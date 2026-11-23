import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const DEFAULT_LOCAL_SECRET = 'kramz-admin-2026'
const GITHUB_REPO = process.env.GITHUB_REPO || 'kramzzzy/portfolio-v2'
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'

const ALLOWED_EXACT_FILES = new Set([
  'package.json',
  'vercel.json',
  'vite.config.ts',
  'index.html',
])

const ALLOWED_PREFIXES = ['src/', 'public/', 'api/']

const BLOCKED_SEGMENTS = ['.env', '.git', 'node_modules', '.vercel']

export function normalizeSafePath(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('File path is required.')
  }
  const cleaned = inputPath.replace(/\\/g, '/').replace(/^\/+/, '').trim()
  const normalized = path.posix.normalize(cleaned)

  if (
    normalized.startsWith('..') ||
    normalized.includes('/../') ||
    path.isAbsolute(normalized)
  ) {
    throw new Error('Invalid relative path.')
  }

  for (const blocked of BLOCKED_SEGMENTS) {
    if (
      normalized === blocked ||
      normalized.startsWith(`${blocked}/`) ||
      normalized.includes(`/${blocked}/`) ||
      normalized.startsWith('.env')
    ) {
      throw new Error(`Access to ${normalized} is restricted.`)
    }
  }

  const isAllowed =
    ALLOWED_EXACT_FILES.has(normalized) ||
    ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix))

  if (!isAllowed) {
    throw new Error(
      `Path "${normalized}" is outside allowlisted directories (src/, public/, api/).`
    )
  }

  return normalized
}

export function verifyAdminSecret(providedSecret) {
  const isLocalDev = !process.env.VERCEL
  const expectedSecret =
    process.env.ADMIN_SECRET || (isLocalDev ? DEFAULT_LOCAL_SECRET : '')

  if (!expectedSecret) {
    return {
      authorized: false,
      mode: 'sandbox',
      storageDriver: process.env.VERCEL ? 'github-api' : 'local-fs',
      reason: 'Set ADMIN_SECRET environment variable to enable write access.',
    }
  }

  if (!providedSecret || typeof providedSecret !== 'string') {
    return {
      authorized: false,
      mode: 'sandbox',
      storageDriver: process.env.VERCEL ? 'github-api' : 'local-fs',
      defaultLocalHint: isLocalDev && !process.env.ADMIN_SECRET ? DEFAULT_LOCAL_SECRET : undefined,
    }
  }

  const a = Buffer.from(providedSecret)
  const b = Buffer.from(expectedSecret)
  const match = a.length === b.length && crypto.timingSafeEqual(a, b)

  return {
    authorized: match,
    mode: match ? 'admin-write' : 'sandbox',
    storageDriver: process.env.VERCEL ? 'github-api' : 'local-fs',
    defaultLocalHint: isLocalDev && !process.env.ADMIN_SECRET ? DEFAULT_LOCAL_SECRET : undefined,
  }
}

async function githubFetchFile(repoPath) {
  const token = process.env.GITHUB_TOKEN
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'KramZ-Portfolio-Studio-MCP',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}?ref=${GITHUB_BRANCH}`
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`GitHub API read failed (${res.status}) for ${repoPath}`)
  }
  return res.json()
}

async function githubWriteFile(repoPath, contentBuffer, commitMessage) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN environment variable is required to commit changes in production.'
    )
  }

  let existingSha
  try {
    const existing = await githubFetchFile(repoPath)
    existingSha = existing.sha
  } catch {
    existingSha = undefined
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'KramZ-Portfolio-Studio-MCP',
    },
    body: JSON.stringify({
      message: commitMessage || `chore(studio): update ${repoPath}`,
      content: contentBuffer.toString('base64'),
      branch: GITHUB_BRANCH,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`GitHub API write failed (${res.status}): ${errText}`)
  }

  return res.json()
}

export async function readRepoTextFile(relativePath) {
  const safePath = normalizeSafePath(relativePath)
  try {
    const fullPath = path.join(ROOT_DIR, safePath)
    const content = await fs.readFile(fullPath, 'utf8')
    return { path: safePath, content, source: 'local-fs' }
  } catch (err) {
    if (process.env.VERCEL || process.env.GITHUB_TOKEN) {
      const ghData = await githubFetchFile(safePath)
      const content = Buffer.from(ghData.content, 'base64').toString('utf8')
      return { path: safePath, content, source: 'github-api', sha: ghData.sha }
    }
    throw err
  }
}

export async function writeRepoFile(relativePath, contentOrBuffer, commitMessage) {
  const safePath = normalizeSafePath(relativePath)
  const buffer = Buffer.isBuffer(contentOrBuffer)
    ? contentOrBuffer
    : Buffer.from(String(contentOrBuffer), 'utf8')

  if (!process.env.VERCEL) {
    const fullPath = path.join(ROOT_DIR, safePath)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, buffer)
    return {
      path: safePath,
      driver: 'local-fs',
      bytes: buffer.length,
      message: commitMessage || `Saved ${safePath} to local disk`,
    }
  }

  const ghRes = await githubWriteFile(safePath, buffer, commitMessage)
  return {
    path: safePath,
    driver: 'github-api',
    commitSha: ghRes?.commit?.sha,
    message: commitMessage || `Committed ${safePath} to ${GITHUB_REPO}`,
  }
}

export async function readPortfolioJson() {
  const { content } = await readRepoTextFile('src/data/portfolio.json')
  return JSON.parse(content)
}

export async function writePortfolioJson(data, commitMessage) {
  const formatted = JSON.stringify(data, null, 2) + '\n'
  return writeRepoFile(
    'src/data/portfolio.json',
    formatted,
    commitMessage || 'chore(cms): update src/data/portfolio.json'
  )
}

export async function listRepositoryFiles(includeFrames = false) {
  const results = []

  async function walk(relDir) {
    const absDir = path.join(ROOT_DIR, relDir)
    let entries = []
    try {
      entries = await fs.readdir(absDir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const relPath = path.posix.join(relDir.replace(/\\/g, '/'), entry.name)
      if (!includeFrames && relPath.startsWith('public/frames/')) {
        continue
      }
      if (entry.isDirectory()) {
        await walk(relPath)
      } else if (entry.isFile()) {
        try {
          const stat = await fs.stat(path.join(ROOT_DIR, relPath))
          const ext = path.posix.extname(relPath).toLowerCase()
          const category = relPath.startsWith('src/components/')
            ? 'Component'
            : relPath.startsWith('src/data/')
              ? 'Data Schema'
              : relPath.startsWith('public/images/')
                ? 'Image Asset'
                : relPath.startsWith('public/videos/') ||
                    relPath.startsWith('public/audio/')
                  ? 'Media Asset'
                  : relPath.startsWith('api/')
                    ? 'Serverless / MCP API'
                    : 'Config / Core'

          results.push({
            path: relPath,
            name: entry.name,
            category,
            size: stat.size,
            ext,
            isBinary: [
              '.png',
              '.jpg',
              '.jpeg',
              '.webp',
              '.gif',
              '.mp4',
              '.mp3',
              '.pdf',
            ].includes(ext),
            publicUrl: relPath.startsWith('public/')
              ? '/' + relPath.slice('public/'.length)
              : null,
          })
        } catch {
          // ignore unreadable file
        }
      }
    }
  }

  await walk('src')
  await walk('public')
  await walk('api')

  for (const exact of ALLOWED_EXACT_FILES) {
    try {
      const stat = await fs.stat(path.join(ROOT_DIR, exact))
      results.push({
        path: exact,
        name: exact,
        category: 'Config / Core',
        size: stat.size,
        ext: path.posix.extname(exact).toLowerCase(),
        isBinary: false,
        publicUrl: null,
      })
    } catch {
      // ignore
    }
  }

  return results
}

export async function getSiteRoutesManifest() {
  const portfolio = await readPortfolioJson()
  const projects = portfolio.projects || []

  const staticRoutes = [
    {
      route: '/',
      title: 'Home • ScrollHero, Capabilities Bento, Works & Stack',
      componentPath: 'src/App.tsx',
      secondaryComponent: 'src/components/ScrollHero.tsx',
      dataSource: 'src/data/portfolio.json',
      type: 'Core Route',
      description:
        '358-frame interactive ScrollHero canvas, MagicRings + LogoLoop band, About MagicBento, Selected Projects, and Experience stack.',
    },
    {
      route: '/projects',
      title: 'All Projects Archive',
      componentPath: 'src/components/ProjectsArchivePage.tsx',
      dataSource: 'src/data/portfolio.json',
      type: 'Archive Route',
      description:
        'Filterable grid of all portfolio web, AI automation, and UI/UX engineering projects with impact metrics.',
    },
    {
      route: '/software',
      title: 'Software Development • KramZ Nexus CRM Sandbox',
      componentPath: 'src/components/SoftwareDevelopmentPage.tsx',
      dataSource: 'src/components/SoftwareDevelopmentPage.tsx',
      type: 'Interactive App Route',
      description:
        'Interactive Kanban pipeline, Companies & People AI enrichment, 4-stage AI Workflow runner, Team Meeting AI Note-Taker, and Nexus Copilot chat.',
    },
    {
      route: '/admin',
      title: 'KramZ Admin & MCP Content Studio',
      componentPath: 'src/components/AdminStudioPage.tsx',
      dataSource: 'api/admin.js • api/mcp.js',
      type: 'Management & MCP Studio',
      description:
        'Zero-database Git-backed CMS, Repository File Explorer, Asset Library, and live Model Context Protocol (MCP) JSON-RPC server.',
    },
  ]

  const caseStudyRoutes = projects.map((p) => ({
    route: `/case-study/${p.slug}`,
    title: `Case Study • ${p.title}`,
    componentPath: 'src/components/ProjectCaseStudyPage.tsx',
    secondaryComponent: 'src/components/FigmaDesignCanvas.tsx',
    dataSource: `src/data/portfolio.json (slug: "${p.slug}")`,
    type: 'Dynamic Case Study',
    description: p.description,
    liveExternalUrl: p.link,
    image: p.image,
  }))

  return [...staticRoutes, ...caseStudyRoutes]
}

export const MCP_TOOLS = [
  {
    name: 'list_pages',
    description:
      'List all website routes/pages (/, /projects, /software, /admin, and all /case-study/:slug pages) along with their backing React component files and data sources.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_files',
    description:
      'List repository files across src/, public/, and api/ with file size, category, and public asset URLs.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description:
            'Optional category filter: "Component", "Data Schema", "Image Asset", "Media Asset", "Serverless / MCP API", or "Config / Core".',
        },
      },
    },
  },
  {
    name: 'read_file',
    description:
      'Read the source code or JSON contents of an allowlisted repository file (e.g., "src/data/portfolio.json", "src/App.tsx", "vercel.json").',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative repository path (e.g. "src/data/portfolio.json").',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'read_project',
    description:
      'Read a single portfolio project and its full case study by slug, or omit slug to list all projects.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description:
            'Optional project slug (e.g. "your-vatoni", "elite-assistant", "la-sistah", "jae-brad-lee").',
        },
      },
    },
  },
  {
    name: 'upsert_project',
    description:
      'Create a new portfolio project or update an existing project by slug in src/data/portfolio.json (requires Admin Write authorization).',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'URL-friendly project slug.' },
        title: { type: 'string', description: 'Project title.' },
        category: {
          type: 'string',
          description: 'Category label (e.g. "Web Development", "AI & Web Platform").',
        },
        description: { type: 'string', description: 'Short project summary.' },
        image: {
          type: 'string',
          description: 'Public image path (e.g. "/images/Portfolio.jpg").',
        },
        link: { type: 'string', description: 'External live URL.' },
        role: { type: 'string', description: 'Case study engineering role.' },
        clientOrContext: { type: 'string', description: 'Client or context name.' },
        executiveSummary: { type: 'string', description: 'Case study executive summary.' },
        architectureStack: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of stack tags (e.g. ["React 19", "TypeScript", "Tailwind CSS v4"]).',
        },
      },
      required: ['slug', 'title', 'category', 'description', 'link'],
    },
  },
]

export async function executeMcpTool(toolName, args = {}, isAuthorized = false) {
  switch (toolName) {
    case 'list_pages': {
      const routes = await getSiteRoutesManifest()
      return { totalRoutes: routes.length, routes }
    }

    case 'list_files': {
      const files = await listRepositoryFiles(false)
      const filtered = args.category
        ? files.filter((f) => f.category.toLowerCase() === String(args.category).toLowerCase())
        : files
      return { totalFiles: filtered.length, files: filtered }
    }

    case 'read_file': {
      const fileData = await readRepoTextFile(args.path)
      return {
        path: fileData.path,
        source: fileData.source,
        lineCount: fileData.content.split('\n').length,
        content: fileData.content,
      }
    }

    case 'read_project': {
      const portfolio = await readPortfolioJson()
      if (args.slug) {
        const found = portfolio.projects.find((p) => p.slug === args.slug)
        if (!found) {
          throw new Error(`Project with slug "${args.slug}" not found.`)
        }
        return found
      }
      return {
        totalProjects: portfolio.projects.length,
        projects: portfolio.projects,
      }
    }

    case 'upsert_project': {
      if (!isAuthorized) {
        throw new Error(
          'Unauthorized: Unlock Admin Write Mode (or pass X-Admin-Secret header) to persist project changes to disk/GitHub.'
        )
      }
      const portfolio = await readPortfolioJson()
      const slug = String(args.slug || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
      if (!slug) throw new Error('Valid project slug is required.')

      const existingIdx = portfolio.projects.findIndex((p) => p.slug === slug)
      const fallbackTemplate = portfolio.projects[0]

      const existing = existingIdx >= 0 ? portfolio.projects[existingIdx] : null
      const mergedProject = {
        slug,
        title: args.title || existing?.title || 'Untitled Project',
        category: args.category || existing?.category || 'Web Development',
        description:
          args.description ||
          existing?.description ||
          'Full-stack web and AI automation build.',
        image: args.image || existing?.image || '/images/Portfolio.jpg',
        link: args.link || existing?.link || 'https://github.com/kramzzzy',
        previewUrl: args.previewUrl || existing?.previewUrl || args.link || 'https://github.com/kramzzzy',
        caseStudy: {
          ...(existing?.caseStudy || fallbackTemplate.caseStudy),
          role:
            args.role ||
            existing?.caseStudy?.role ||
            'Lead UI/UX Engineer & Full-Stack Developer',
          timeline:
            args.timeline || existing?.caseStudy?.timeline || '2026 • Production Live',
          clientOrContext:
            args.clientOrContext ||
            existing?.caseStudy?.clientOrContext ||
            args.title ||
            'Enterprise Client',
          themeLabel:
            args.themeLabel ||
            existing?.caseStudy?.themeLabel ||
            'Dark Glassmorphic & High-Contrast Web Architecture',
          executiveSummary:
            args.executiveSummary ||
            existing?.caseStudy?.executiveSummary ||
            args.description ||
            'Architected and deployed an end-to-end web platform.',
          architectureStack:
            Array.isArray(args.architectureStack) && args.architectureStack.length > 0
              ? args.architectureStack
              : existing?.caseStudy?.architectureStack || [
                  'React 19',
                  'TypeScript',
                  'Tailwind CSS v4',
                  'Vite',
                ],
        },
      }

      if (existingIdx >= 0) {
        portfolio.projects[existingIdx] = mergedProject
      } else {
        portfolio.projects.unshift(mergedProject)
      }

      const writeRes = await writePortfolioJson(
        portfolio,
        `feat(cms): upsert project "${mergedProject.title}" (${slug})`
      )
      return {
        status: existingIdx >= 0 ? 'updated' : 'created',
        project: mergedProject,
        storage: writeRes,
      }
    }

    default:
      throw new Error(`Unknown MCP tool: ${toolName}`)
  }
}
