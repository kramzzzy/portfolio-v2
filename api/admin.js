import {
  executeMcpTool,
  getSiteRoutesManifest,
  listRepositoryFiles,
  MCP_TOOLS,
  readPortfolioJson,
  readRepoTextFile,
  verifyAdminSecret,
  writePortfolioJson,
  writeRepoFile,
} from './_lib/studio-core.js'

function extractSecret(req, body) {
  const headerSecret =
    req.headers?.['x-admin-secret'] ||
    (req.headers?.authorization || '').replace(/^Bearer\s+/i, '')
  return headerSecret || body?.adminSecret || ''
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const urlObj = new URL(req.url || '/api/admin', 'http://localhost')
      const action = urlObj.searchParams.get('action') || 'overview'
      const secret = extractSecret(req, null)
      const auth = verifyAdminSecret(secret)

      if (action === 'file') {
        const targetPath = urlObj.searchParams.get('path') || ''
        const fileData = await readRepoTextFile(targetPath)
        return res.status(200).json({ ok: true, auth, file: fileData })
      }

      const [routes, files, portfolio] = await Promise.all([
        getSiteRoutesManifest(),
        listRepositoryFiles(false),
        readPortfolioJson(),
      ])

      return res.status(200).json({
        ok: true,
        auth,
        routes,
        files,
        portfolio,
        mcpTools: MCP_TOOLS,
      })
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
      const secret = extractSecret(req, body)
      const auth = verifyAdminSecret(secret)
      const { action } = body

      if (action === 'verify_auth') {
        return res.status(200).json({ ok: true, auth })
      }

      if (!auth.authorized) {
        return res.status(403).json({
          ok: false,
          auth,
          error:
            'Admin Write Mode is locked. Enter your Admin Secret to persist changes to disk / GitHub (or use Sandbox Mode to preview edits locally).',
        })
      }

      if (action === 'upsert_project') {
        const result = await executeMcpTool('upsert_project', body.project || body, true)
        const portfolio = await readPortfolioJson()
        const routes = await getSiteRoutesManifest()
        return res.status(200).json({
          ok: true,
          auth,
          result,
          portfolio,
          routes,
        })
      }

      if (action === 'delete_project') {
        const slug = String(body.slug || '').trim()
        const portfolio = await readPortfolioJson()
        const nextProjects = portfolio.projects.filter((p) => p.slug !== slug)
        if (nextProjects.length === 0) {
          return res.status(400).json({
            ok: false,
            error: 'Cannot delete the last remaining project.',
          })
        }
        portfolio.projects = nextProjects
        const storage = await writePortfolioJson(
          portfolio,
          `chore(cms): delete project "${slug}"`
        )
        const routes = await getSiteRoutesManifest()
        return res.status(200).json({
          ok: true,
          auth,
          storage,
          portfolio,
          routes,
        })
      }

      if (action === 'save_file') {
        const targetPath = String(body.path || '')
        const content = String(body.content ?? '')
        if (targetPath === 'src/data/portfolio.json') {
          JSON.parse(content)
        }
        const storage = await writeRepoFile(
          targetPath,
          content,
          body.commitMessage || `chore(studio): update ${targetPath}`
        )
        const portfolio = await readPortfolioJson()
        const routes = await getSiteRoutesManifest()
        const files = await listRepositoryFiles(false)
        return res.status(200).json({
          ok: true,
          auth,
          storage,
          portfolio,
          routes,
          files,
        })
      }

      if (action === 'upload_asset') {
        const rawName = String(body.filename || 'upload.webp')
          .replace(/[^a-zA-Z0-9._-]/g, '-')
          .toLowerCase()
        const ext = rawName.slice(rawName.lastIndexOf('.'))
        if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
          return res.status(400).json({
            ok: false,
            error: 'Only .png, .jpg, .webp, and .svg image uploads are allowed.',
          })
        }
        const base64Data = String(body.base64 || '').replace(
          /^data:[^;]+;base64,/,
          ''
        )
        const buffer = Buffer.from(base64Data, 'base64')
        if (buffer.length > 3.5 * 1024 * 1024) {
          return res.status(400).json({
            ok: false,
            error: 'Asset exceeds 3.5 MB upload limit.',
          })
        }
        const repoPath = `public/images/${rawName}`
        const storage = await writeRepoFile(
          repoPath,
          buffer,
          `feat(assets): upload ${rawName}`
        )
        const files = await listRepositoryFiles(false)
        return res.status(200).json({
          ok: true,
          auth,
          publicUrl: `/images/${rawName}`,
          storage,
          files,
        })
      }

      return res.status(400).json({ ok: false, error: `Unknown action: ${action}` })
    }

    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal studio error',
    })
  }
}
