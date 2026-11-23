import React, { useCallback, useEffect, useRef, useState } from 'react'
import { animate, createScope, createSpring } from 'animejs'
import type { ProjectItem } from '../data/portfolio'
import LetterGlitch from './react-bits/LetterGlitch'
import MagicRings from './react-bits/MagicRings'
import SpotlightCard from './react-bits/SpotlightCard'
import StarBorder from './react-bits/StarBorder'
import TextType from './react-bits/TextType'

interface AdminStudioPageProps {
  isModalOpen: boolean
  onBackToHome: () => void
  onOpenAllProjects: () => void
  onOpenSoftware: () => void
  onNavigateToRoute: (route: string) => void
  onProjectsUpdated: (projects: ProjectItem[]) => void
}

type StudioTab = 'pages' | 'projects' | 'files' | 'mcp'

interface RouteManifestItem {
  route: string
  title: string
  componentPath: string
  secondaryComponent?: string
  dataSource: string
  type: string
  description: string
  liveExternalUrl?: string
  image?: string
}

interface RepoFileItem {
  path: string
  name: string
  category: string
  size: number
  ext: string
  isBinary: boolean
  publicUrl: string | null
}

interface McpToolSchema {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

interface AuthStatus {
  authorized: boolean
  mode: 'admin-write' | 'sandbox'
  storageDriver: 'local-fs' | 'github-api'
  defaultLocalHint?: string
}

const FILE_CATEGORIES = [
  'ALL',
  'Component',
  'Data Schema',
  'Image Asset',
  'Media Asset',
  'Serverless / MCP API',
  'Config / Core',
] as const

export default function AdminStudioPage({
  isModalOpen,
  onBackToHome,
  onOpenAllProjects,
  onOpenSoftware,
  onNavigateToRoute,
  onProjectsUpdated,
}: AdminStudioPageProps) {
  const pageRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<StudioTab>('pages')
  const [auth, setAuth] = useState<AuthStatus>({
    authorized: false,
    mode: 'sandbox',
    storageDriver: 'local-fs',
  })
  const [adminSecret, setAdminSecret] = useState<string>(
    () => sessionStorage.getItem('kramz_admin_secret') || 'kramz-admin-2026'
  )
  const [showLoginBox, setShowLoginBox] = useState(false)
  const [secretInput, setSecretInput] = useState('kramz-admin-2026')

  // Studio Data State
  const [routes, setRoutes] = useState<RouteManifestItem[]>([])
  const [files, setFiles] = useState<RepoFileItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [mcpTools, setMcpTools] = useState<McpToolSchema[]>([])
  const [loadingStudio, setLoadingStudio] = useState(true)

  // Project Editor State
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [editSlug, setEditSlug] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('Web Development')
  const [editDescription, setEditDescription] = useState('')
  const [editImage, setEditImage] = useState('/images/Portfolio.jpg')
  const [editLink, setEditLink] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editClient, setEditClient] = useState('')
  const [editSummary, setEditSummary] = useState('')
  const [editStack, setEditStack] = useState('')
  const [savingProject, setSavingProject] = useState(false)
  const [uploadingAsset, setUploadingAsset] = useState(false)

  // File Inspector State
  const [fileSearch, setFileSearch] = useState('')
  const [fileCategory, setFileCategory] = useState<string>('ALL')
  const [activeFilePath, setActiveFilePath] = useState<string>(
    'src/data/portfolio.json'
  )
  const [activeFileContent, setActiveFileContent] = useState<string>('')
  const [loadingFile, setLoadingFile] = useState(false)
  const [savingFile, setSavingFile] = useState(false)

  // MCP Console State
  const [selectedMcpTool, setSelectedMcpTool] = useState<string>('list_pages')
  const [mcpArgsInput, setMcpArgsInput] = useState<string>('{}')
  const [mcpResponse, setMcpResponse] = useState<string>('')
  const [runningMcp, setRunningMcp] = useState(false)

  // Terminal Status Bar
  const [terminalLog, setTerminalLog] = useState<string>(
    'studio.mcp.ready() — Connected to repository filesystem & MCP JSON-RPC bus.'
  )
  const [terminalRunKey, setTerminalRunKey] = useState(0)

  const populateProjectForm = useCallback((proj: ProjectItem) => {
    setSelectedSlug(proj.slug)
    setEditSlug(proj.slug)
    setEditTitle(proj.title)
    setEditCategory(proj.category)
    setEditDescription(proj.description)
    setEditImage(proj.image)
    setEditLink(proj.link)
    setEditRole(proj.caseStudy?.role || '')
    setEditClient(proj.caseStudy?.clientOrContext || '')
    setEditSummary(proj.caseStudy?.executiveSummary || '')
    setEditStack((proj.caseStudy?.architectureStack || []).join(', '))
  }, [])

  const onProjectsUpdatedRef = useRef(onProjectsUpdated)
  onProjectsUpdatedRef.current = onProjectsUpdated
  const selectedSlugRef = useRef(selectedSlug)
  selectedSlugRef.current = selectedSlug

  const fetchOverview = useCallback(
    async (secretToUse: string) => {
      setLoadingStudio(true)
      try {
        const res = await fetch('/api/admin?action=overview', {
          headers: { 'x-admin-secret': secretToUse },
        })
        const data = await res.json()
        if (data.ok) {
          setAuth(data.auth)
          setRoutes(data.routes || [])
          setFiles(data.files || [])
          const loadedProjects: ProjectItem[] = data.portfolio?.projects || []
          setProjects(loadedProjects)
          setMcpTools(data.mcpTools || [])
          onProjectsUpdatedRef.current(loadedProjects)
          if (loadedProjects.length > 0 && !selectedSlugRef.current) {
            populateProjectForm(loadedProjects[0])
          }
        }
      } catch (err) {
        setTerminalLog(
          `[studio.error] ${err instanceof Error ? err.message : 'Failed to load studio overview'}`
        )
        setTerminalRunKey((k) => k + 1)
      } finally {
        setLoadingStudio(false)
      }
    },
    [populateProjectForm]
  )

  const loadRepoFile = useCallback(
    async (targetPath: string) => {
      setActiveFilePath(targetPath)
      const fileMeta = files.find((f) => f.path === targetPath)
      if (fileMeta?.isBinary) {
        setActiveFileContent('')
        return
      }
      setLoadingFile(true)
      try {
        const res = await fetch(
          `/api/admin?action=file&path=${encodeURIComponent(targetPath)}`,
          {
            headers: { 'x-admin-secret': adminSecret },
          }
        )
        const data = await res.json()
        if (data.ok && data.file) {
          setActiveFileContent(data.file.content)
          setTerminalLog(
            `[fs.read] Loaded ${data.file.path} (${data.file.content.split('\n').length} lines via ${data.file.source})`
          )
          setTerminalRunKey((k) => k + 1)
        }
      } catch {
        setActiveFileContent('// Could not load file contents.')
      } finally {
        setLoadingFile(false)
      }
    },
    [adminSecret, files]
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    fetchOverview(adminSecret)
  }, [adminSecret, fetchOverview])

  useEffect(() => {
    const fileMeta = files.find((f) => f.path === activeFilePath)
    if (
      activeTab === 'files' &&
      !activeFileContent &&
      activeFilePath &&
      !fileMeta?.isBinary &&
      !loadingFile
    ) {
      loadRepoFile(activeFilePath)
    }
  }, [activeTab, activeFileContent, activeFilePath, files, loadingFile, loadRepoFile])

  useEffect(() => {
    if (!pageRef.current) return
    const scope = createScope({ root: pageRef.current }).add(() => {
      animate('.studio-enter', {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 480,
        ease: createSpring({ stiffness: 210, damping: 20 }),
      })
    })
    return () => scope.revert()
  }, [])

  const handleVerifySecret = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = secretInput.trim()
    sessionStorage.setItem('kramz_admin_secret', trimmed)
    setAdminSecret(trimmed)
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_auth', adminSecret: trimmed }),
    })
    const data = await res.json()
    if (data.auth) {
      setAuth(data.auth)
      setShowLoginBox(false)
      setTerminalLog(
        data.auth.authorized
          ? `[auth.unlock] Admin Write Mode unlocked (${data.auth.storageDriver})`
          : '[auth.sandbox] Invalid secret — staying in Sandbox Preview Mode'
      )
      setTerminalRunKey((k) => k + 1)
    }
  }

  const handleStartNewProject = () => {
    setSelectedSlug('__new__')
    setEditSlug('new-ai-platform')
    setEditTitle('New AI & Web Platform')
    setEditCategory('AI & Web Platform')
    setEditDescription(
      'Custom full-stack web application and automated AI workflow pipeline.'
    )
    setEditImage('/images/Portfolio.jpg')
    setEditLink('https://github.com/kramzzzy')
    setEditRole('Lead AI & Full-Stack Architect')
    setEditClient('Enterprise Client')
    setEditSummary(
      'Designed and deployed an end-to-end web portal integrated with automated LLM webhooks.'
    )
    setEditStack('React 19, TypeScript, Tailwind CSS v4, Node.js, OpenAI')
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProject(true)
    const stackArr = editStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      slug: editSlug,
      title: editTitle,
      category: editCategory,
      description: editDescription,
      image: editImage,
      link: editLink,
      role: editRole,
      clientOrContext: editClient,
      executiveSummary: editSummary,
      architectureStack: stackArr,
    }

    try {
      if (!auth.authorized) {
        // Sandbox local preview fallback
        const existingIdx = projects.findIndex((p) => p.slug === editSlug)
        const baseCaseStudy =
          projects[existingIdx]?.caseStudy || projects[0]?.caseStudy
        const sandboxProj: ProjectItem = {
          slug: editSlug,
          title: editTitle,
          category: editCategory,
          description: editDescription,
          image: editImage,
          link: editLink,
          previewUrl: editLink,
          caseStudy: {
            ...baseCaseStudy,
            role: editRole,
            clientOrContext: editClient,
            executiveSummary: editSummary,
            architectureStack: stackArr,
          },
        }
        const nextList =
          existingIdx >= 0
            ? projects.map((p, i) => (i === existingIdx ? sandboxProj : p))
            : [sandboxProj, ...projects]
        setProjects(nextList)
        onProjectsUpdated(nextList)
        setSelectedSlug(sandboxProj.slug)
        setTerminalLog(
          `[sandbox.upsert] Previewed project "${sandboxProj.title}" in browser session`
        )
        setTerminalRunKey((k) => k + 1)
        return
      }

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          action: 'upsert_project',
          project: payload,
        }),
      })
      const data = await res.json()
      if (!data.ok) {
        throw new Error(data.error || 'Failed to save project')
      }
      const nextProjects: ProjectItem[] = data.portfolio.projects
      setProjects(nextProjects)
      setRoutes(data.routes || routes)
      onProjectsUpdated(nextProjects)
      setSelectedSlug(data.result.project.slug)
      setTerminalLog(
        `[cms.upsert] Saved "${data.result.project.title}" to src/data/portfolio.json (${data.result.storage.driver})`
      )
      setTerminalRunKey((k) => k + 1)
    } catch (err) {
      setTerminalLog(
        `[cms.error] ${err instanceof Error ? err.message : 'Save failed'}`
      )
      setTerminalRunKey((k) => k + 1)
    } finally {
      setSavingProject(false)
    }
  }

  const handleDeleteProject = async (slugToDelete: string) => {
    if (!auth.authorized) {
      const next = projects.filter((p) => p.slug !== slugToDelete)
      if (next.length > 0) {
        setProjects(next)
        onProjectsUpdated(next)
        populateProjectForm(next[0])
        setTerminalLog(`[sandbox.delete] Removed "${slugToDelete}" in preview`)
        setTerminalRunKey((k) => k + 1)
      }
      return
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({ action: 'delete_project', slug: slugToDelete }),
      })
      const data = await res.json()
      if (data.ok) {
        const next: ProjectItem[] = data.portfolio.projects
        setProjects(next)
        setRoutes(data.routes || routes)
        onProjectsUpdated(next)
        if (next[0]) populateProjectForm(next[0])
        setTerminalLog(
          `[cms.delete] Removed project "${slugToDelete}" from src/data/portfolio.json`
        )
        setTerminalRunKey((k) => k + 1)
      }
    } catch (err) {
      setTerminalLog(
        `[cms.error] ${err instanceof Error ? err.message : 'Delete failed'}`
      )
      setTerminalRunKey((k) => k + 1)
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAsset(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

      if (!auth.authorized) {
        setEditImage(base64)
        setTerminalLog(
          `[sandbox.upload] Loaded "${file.name}" into local preview`
        )
        setTerminalRunKey((k) => k + 1)
        return
      }

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          action: 'upload_asset',
          filename: file.name,
          base64,
        }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Upload failed')
      setEditImage(data.publicUrl)
      if (data.files) setFiles(data.files)
      setTerminalLog(
        `[asset.upload] Saved ${data.publicUrl} (${data.storage.driver})`
      )
      setTerminalRunKey((k) => k + 1)
    } catch (err) {
      setTerminalLog(
        `[asset.error] ${err instanceof Error ? err.message : 'Upload failed'}`
      )
      setTerminalRunKey((k) => k + 1)
    } finally {
      setUploadingAsset(false)
    }
  }

  const handleSaveRepoFile = async () => {
    if (!auth.authorized) {
      setTerminalLog(
        `[sandbox.save] Simulated save of ${activeFilePath} (Unlock Admin Write Mode to write to disk)`
      )
      setTerminalRunKey((k) => k + 1)
      return
    }
    setSavingFile(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          action: 'save_file',
          path: activeFilePath,
          content: activeFileContent,
        }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Save failed')
      if (data.portfolio?.projects) {
        setProjects(data.portfolio.projects)
        onProjectsUpdated(data.portfolio.projects)
      }
      setTerminalLog(
        `[fs.write] Saved ${activeFilePath} (${data.storage.driver})`
      )
      setTerminalRunKey((k) => k + 1)
    } catch (err) {
      setTerminalLog(
        `[fs.error] ${err instanceof Error ? err.message : 'File save failed'}`
      )
      setTerminalRunKey((k) => k + 1)
    } finally {
      setSavingFile(false)
    }
  }

  const handleExecuteMcpTool = async (
    toolNameOverride?: string,
    argsOverride?: Record<string, unknown>
  ) => {
    const toolToCall = toolNameOverride || selectedMcpTool
    setRunningMcp(true)
    try {
      const parsedArgs =
        argsOverride ?? (mcpArgsInput.trim() ? JSON.parse(mcpArgsInput) : {})
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: toolToCall,
            arguments: parsedArgs,
          },
        }),
      })
      const data = await res.json()
      setMcpResponse(JSON.stringify(data, null, 2))
      setTerminalLog(
        `[mcp.call] tools/call "${toolToCall}" → JSON-RPC 200 OK`
      )
      setTerminalRunKey((k) => k + 1)
    } catch (err) {
      setMcpResponse(
        JSON.stringify(
          {
            error:
              err instanceof Error ? err.message : 'Invalid JSON arguments',
          },
          null,
          2
        )
      )
    } finally {
      setRunningMcp(false)
    }
  }

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.path
      .toLowerCase()
      .includes(fileSearch.toLowerCase())
    const matchesCat = fileCategory === 'ALL' || f.category === fileCategory
    return matchesSearch && matchesCat
  })

  const activeFileMeta = files.find((f) => f.path === activeFilePath)

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-[#0219EA] selection:text-white"
    >
      {/* Top Sticky Bar (Icon-Only Navigation + Admin Mode Unlock) */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onBackToHome}
              aria-label="Back to Home"
              title="Back to Home"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V19a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V9.5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onOpenAllProjects}
              aria-label="All Projects"
              title="All Projects"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onOpenSoftware}
              aria-label="Software Development CRM"
              title="Software Development CRM"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="5" height="18" rx="1" />
                <rect x="10" y="3" width="5" height="12" rx="1" />
                <rect x="17" y="3" width="5" height="15" rx="1" />
              </svg>
            </button>

            <span className="hidden sm:inline text-white/15 px-1">|</span>

            <span className="hidden sm:inline text-xs font-medium text-neutral-400 truncate">
              KramZ Admin &amp; MCP Content Studio
            </span>
          </div>

          <div className="relative flex items-center gap-2.5 shrink-0">
            <span className="hidden md:inline text-[11px] font-mono text-neutral-400">
              Driver:{' '}
              <strong className="text-[#4f6bff]">{auth.storageDriver}</strong>
            </span>

            <StarBorder
              as="button"
              type="button"
              onClick={() => setShowLoginBox((prev) => !prev)}
              color="#0219EA"
              trailColor="#3b55ff"
              backgroundColor="rgba(2, 25, 234, 0.25)"
              textColor="#ffffff"
              borderColor="rgba(2, 25, 234, 0.6)"
              duration={4}
              radius={12}
              glow={0.6}
              hover="lap"
              clickPulse
              className="!px-4 !py-2 text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              {auth.authorized ? 'Write Mode Unlocked ✓' : 'Admin Login'}
            </StarBorder>

            {showLoginBox && (
              <form
                onSubmit={handleVerifySecret}
                className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-white/15 bg-neutral-950/95 backdrop-blur-2xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Admin Write Authentication
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLoginBox(false)}
                    className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Enter <code className="text-[#4f6bff]">ADMIN_SECRET</code> to
                  commit changes directly to disk / GitHub. (Default local dev
                  key: <code className="text-white">kramz-admin-2026</code>)
                </p>
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="Enter ADMIN_SECRET..."
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#0219EA]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0219EA] px-4 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#3b55ff] transition-colors cursor-pointer"
                  >
                    Unlock Write Mode
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with MagicRings + LetterGlitch Background */}
      <div className="relative isolate w-full overflow-hidden">
        <div
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, #000 22%, #000 84%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, #000 22%, #000 84%, transparent 100%)',
          }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <MagicRings
            color="#0219EA"
            colorTwo="#3b55ff"
            motion="pulse"
            ringCount={8}
            speed={isModalOpen ? 0 : 1.05}
            lineThickness={2.2}
            glow={1.25}
            baseRadius={0.3}
            radiusStep={0.095}
            hoverScale={1.2}
            clickBurst={true}
            maxDevicePixelRatio={1.5}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-8">
          {/* Header & Telemetry Counters */}
          <div className="studio-enter flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <span className="block text-xs font-mono uppercase tracking-wider text-[#4f6bff]">
                ZERO-DATABASE GIT CMS • MODEL CONTEXT PROTOCOL (MCP)
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                KramZ Admin &amp; MCP Studio
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Manage every route, case study, and repository file without an
                external database. Changes sync directly to{' '}
                <code className="text-[#4f6bff]">src/data/portfolio.json</code>{' '}
                and <code className="text-[#4f6bff]">public/images/</code> via
                both this visual dashboard and the embedded{' '}
                <code className="text-[#4f6bff]">/api/mcp</code> server.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Site Routes
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {routes.length}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Projects
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-[#4f6bff]">
                  {projects.length}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Repo Files
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {files.length}
                </div>
              </div>
            </div>
          </div>

          {/* Studio Workspace Shell */}
          <SpotlightCard
            spotlightColor="#0219EA"
            intensity={0.18}
            borderGlow={0.75}
            className="!p-0 !rounded-2xl overflow-hidden border border-white/15"
          >
            <div>
              {/* Studio Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-6">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-neutral-950/60 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pages')}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeTab === 'pages'
                        ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>01 Pages &amp; Routes ({routes.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeTab === 'projects'
                        ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>02 Projects CMS ({projects.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('files')}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeTab === 'files'
                        ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>03 Files &amp; Assets ({files.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('mcp')
                      if (!mcpResponse) {
                        handleExecuteMcpTool('list_pages', {})
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeTab === 'mcp'
                        ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>04 MCP Server Console ({mcpTools.length} tools)</span>
                  </button>
                </div>

                {/* Live Terminal Event Bus Readout */}
                <div className="flex items-center gap-2 rounded-xl border border-[#0219EA]/45 bg-neutral-950/85 px-3 py-1.5 max-w-md w-full sm:w-auto">
                  <span className="text-[10px] font-mono text-[#4f6bff] shrink-0">
                    mcp_bus.ts
                  </span>
                  <TextType
                    key={`studio-log-${terminalRunKey}`}
                    as="div"
                    text={terminalLog}
                    prefix="> "
                    prefixColor="#0219EA"
                    typingSpeed={10}
                    loop={false}
                    showCursor={true}
                    cursorStyle="block"
                    cursorColor="#4f6bff"
                    className="text-[11px] font-mono text-blue-50/90 truncate"
                  />
                </div>
              </div>

              {/* ============================================================
                  TAB 01: PAGES & ROUTES EXPLORER
                 ============================================================ */}
              {activeTab === 'pages' && (
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Live Application Route Registry
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Every route registered in the SPA router and exposed via
                        the <code className="text-[#4f6bff]">list_pages</code>{' '}
                        MCP tool.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('projects')
                        handleStartNewProject()
                      }}
                      className="rounded-xl border border-[#0219EA] bg-[#0219EA]/30 px-3.5 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#0219EA]/55 transition-colors cursor-pointer"
                    >
                      + Create New Case Study Page
                    </button>
                  </div>

                  {loadingStudio ? (
                    <div className="py-12 text-center text-xs font-mono text-neutral-400">
                      Scanning repository routes...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {routes.map((r) => (
                        <div
                          key={r.route}
                          className="rounded-xl border border-white/10 bg-neutral-950/60 p-4 flex flex-col justify-between gap-4 hover:border-[#0219EA]/60 transition-colors"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-lg border border-[#4f6bff]/40 bg-[#0219EA]/25 px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                                {r.route}
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                                {r.type}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-white">
                              {r.title}
                            </h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                              {r.description}
                            </p>
                          </div>

                          <div className="space-y-2.5 pt-2 border-t border-white/10">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-neutral-400">
                              <span>
                                Component:{' '}
                                <strong className="text-neutral-200">
                                  {r.componentPath}
                                </strong>
                              </span>
                              <span>
                                Data:{' '}
                                <strong className="text-[#4f6bff]">
                                  {r.dataSource}
                                </strong>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onNavigateToRoute(r.route)}
                                className="rounded-lg border border-[#0219EA] bg-[#0219EA]/30 px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#0219EA]/55 transition-colors cursor-pointer"
                              >
                                Open Page ↗
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('files')
                                  loadRepoFile(r.componentPath)
                                }}
                                className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-neutral-300 hover:border-[#4f6bff] hover:text-white transition-colors cursor-pointer"
                              >
                                Inspect Source Code
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                  TAB 02: PROJECTS & CASE STUDIES CMS EDITOR
                 ============================================================ */}
              {activeTab === 'projects' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                  {/* Left 4 Cols: Project List */}
                  <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-5 space-y-3 bg-neutral-950/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-neutral-400">
                        Portfolio Projects ({projects.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleStartNewProject}
                        className="rounded-lg border border-[#0219EA] bg-[#0219EA]/30 px-2.5 py-1 text-xs font-mono font-semibold text-white hover:bg-[#0219EA]/55 transition-colors cursor-pointer"
                      >
                        + New Project
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {projects.map((p) => {
                        const active = selectedSlug === p.slug
                        return (
                          <div
                            key={p.slug}
                            onClick={() => populateProjectForm(p)}
                            className={`rounded-xl border p-3 transition-all cursor-pointer space-y-2 ${
                              active
                                ? 'border-[#4f6bff] bg-[#0219EA]/25 shadow-[0_0_20px_rgba(2,25,234,0.3)]'
                                : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-11 w-16 rounded-lg object-cover object-top border border-white/10 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-mono text-[#4f6bff] truncate">
                                  /case-study/{p.slug}
                                </div>
                                <div className="text-xs font-bold text-white truncate">
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-neutral-400 truncate">
                                  {p.category}
                                </div>
                              </div>
                            </div>

                            <div
                              className="flex items-center justify-between pt-1.5 border-t border-white/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigateToRoute(`/case-study/${p.slug}`)
                                }
                                className="text-[10px] font-mono text-[#4f6bff] hover:underline cursor-pointer"
                              >
                                View Single Post →
                              </button>
                              {projects.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p.slug)}
                                  className="text-[10px] font-mono text-neutral-400 hover:text-rose-400 cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right 8 Cols: Project & Case Study Editor Form */}
                  <form
                    onSubmit={handleSaveProject}
                    className="lg:col-span-8 p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {selectedSlug === '__new__'
                            ? 'Create New Project & Case Study'
                            : `Editing: ${editTitle}`}
                        </h3>
                        <p className="text-xs font-mono text-[#4f6bff]">
                          Route: /case-study/{editSlug || 'project-slug'}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingProject}
                        className="rounded-xl border border-[#0219EA] bg-[#0219EA] px-4 py-2 text-xs font-mono font-semibold text-white hover:bg-[#3b55ff] transition-colors cursor-pointer"
                      >
                        {savingProject
                          ? 'Saving...'
                          : auth.authorized
                            ? 'Save to src/data/portfolio.json ✓'
                            : 'Preview Save (Sandbox)'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-[#0219EA]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          required
                          value={editSlug}
                          onChange={(e) =>
                            setEditSlug(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, '-')
                            )
                          }
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#0219EA]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          Category *
                        </label>
                        <input
                          type="text"
                          required
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-[#0219EA]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          Live Site URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={editLink}
                          onChange={(e) => setEditLink(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#0219EA]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          Preview Image Path or Upload to public/images/
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                            className="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#0219EA]"
                          />
                          <label className="rounded-xl border border-[#0219EA] bg-[#0219EA]/30 px-3 py-2 text-xs font-mono text-white hover:bg-[#0219EA]/55 transition-colors cursor-pointer shrink-0">
                            {uploadingAsset ? 'Uploading...' : 'Upload'}
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg,.webp,.svg"
                              onChange={handleUploadImage}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Card Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          Case Study Role
                        </label>
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-[#0219EA]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">
                          Client &amp; Context
                        </label>
                        <input
                          type="text"
                          value={editClient}
                          onChange={(e) => setEditClient(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-[#0219EA]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Single Post Executive Summary
                      </label>
                      <textarea
                        rows={2}
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Engineering Stack Tags (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={editStack}
                        onChange={(e) => setEditStack(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================
                  TAB 03: REPOSITORY FILE EXPLORER & LIVE CODE/ASSET VIEWER
                 ============================================================ */}
              {activeTab === 'files' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                  {/* Left 4 Cols: Filterable File Tree */}
                  <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-4 space-y-3 bg-neutral-950/40">
                    <input
                      type="text"
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      placeholder="Filter files (e.g. portfolio.json, App.tsx)..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#0219EA]"
                    />

                    <div className="flex flex-wrap gap-1">
                      {FILE_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFileCategory(cat)}
                          className={`rounded-lg border px-2 py-1 text-[10px] font-mono transition-colors cursor-pointer ${
                            fileCategory === cat
                              ? 'border-[#4f6bff] bg-[#0219EA]/30 text-white'
                              : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1 max-h-[440px] overflow-y-auto pr-1">
                      {filteredFiles.map((f) => {
                        const active = activeFilePath === f.path
                        return (
                          <button
                            key={f.path}
                            type="button"
                            onClick={() => loadRepoFile(f.path)}
                            className={`w-full rounded-lg border px-3 py-2 text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              active
                                ? 'border-[#4f6bff] bg-[#0219EA]/25 text-white'
                                : 'border-transparent hover:bg-white/[0.04] text-neutral-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-mono truncate">
                                {f.path}
                              </div>
                              <div className="text-[10px] text-neutral-500">
                                {f.category}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                              {(f.size / 1024).toFixed(1)} KB
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right 8 Cols: Code Editor or Asset Visual Preview */}
                  <div className="lg:col-span-8 p-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                          {activeFileMeta?.category || 'Repository File'}
                        </span>
                        <h3 className="text-sm font-mono font-bold text-white">
                          {activeFilePath}
                        </h3>
                      </div>

                      {!activeFileMeta?.isBinary && (
                        <button
                          type="button"
                          onClick={handleSaveRepoFile}
                          disabled={savingFile}
                          className="rounded-xl border border-[#0219EA] bg-[#0219EA] px-4 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#3b55ff] transition-colors cursor-pointer"
                        >
                          {savingFile
                            ? 'Saving...'
                            : auth.authorized
                              ? 'Save File Changes ✓'
                              : 'Simulate Save (Sandbox)'}
                        </button>
                      )}
                    </div>

                    {activeFileMeta?.isBinary && activeFileMeta.publicUrl ? (
                      <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-neutral-950/60 p-6 gap-4">
                        {activeFileMeta.ext === '.mp4' ? (
                          <video
                            src={activeFileMeta.publicUrl}
                            controls
                            className="max-h-96 rounded-xl border border-white/15"
                          />
                        ) : activeFileMeta.ext === '.mp3' ? (
                          <audio src={activeFileMeta.publicUrl} controls />
                        ) : (
                          <img
                            src={activeFileMeta.publicUrl}
                            alt={activeFileMeta.name}
                            className="max-h-96 rounded-xl border border-white/15 object-contain"
                          />
                        )}
                        <span className="text-xs font-mono text-[#4f6bff]">
                          Public URL: {activeFileMeta.publicUrl}
                        </span>
                      </div>
                    ) : (
                      <textarea
                        value={
                          loadingFile
                            ? '// Loading file contents...'
                            : activeFileContent
                        }
                        onChange={(e) => setActiveFileContent(e.target.value)}
                        spellCheck={false}
                        className="flex-1 min-h-[450px] w-full rounded-xl border border-white/15 bg-neutral-950/90 p-4 font-mono text-xs text-blue-50/95 leading-relaxed outline-none focus:border-[#0219EA]"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 04: MCP SERVER CONSOLE & PLAYGROUND (/api/mcp)
                 ============================================================ */}
              {activeTab === 'mcp' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
                  {/* Left 5 Cols: MCP Tool Selector & Runner */}
                  <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 p-5 space-y-4 bg-neutral-950/40">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                        JSON-RPC 2.0 Endpoint: POST /api/mcp
                      </span>
                      <h3 className="text-base font-bold text-white">
                        Embedded MCP Tools ({mcpTools.length})
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Select any registered tool to test against the live{' '}
                        <code className="text-[#4f6bff]">/api/mcp</code> server.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {mcpTools.map((t) => {
                        const active = selectedMcpTool === t.name
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => {
                              setSelectedMcpTool(t.name)
                              const defaultArgs =
                                t.name === 'read_project'
                                  ? '{\n  "slug": "your-vatoni"\n}'
                                  : t.name === 'read_file'
                                    ? '{\n  "path": "vercel.json"\n}'
                                    : t.name === 'list_files'
                                      ? '{\n  "category": "Component"\n}'
                                      : '{}'
                              setMcpArgsInput(defaultArgs)
                            }}
                            className={`w-full rounded-xl border p-3 text-left transition-all cursor-pointer space-y-1 ${
                              active
                                ? 'border-[#4f6bff] bg-[#0219EA]/25 text-white'
                                : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25'
                            }`}
                          >
                            <div className="text-xs font-mono font-bold text-[#4f6bff]">
                              {t.name}()
                            </div>
                            <div className="text-[11px] text-neutral-300 leading-snug">
                              {t.description}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Tool Arguments (JSON)
                      </label>
                      <textarea
                        rows={4}
                        value={mcpArgsInput}
                        onChange={(e) => setMcpArgsInput(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-neutral-950 p-3 font-mono text-xs text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteMcpTool()}
                      disabled={runningMcp}
                      className="w-full rounded-xl border border-[#0219EA] bg-[#0219EA] py-2.5 text-xs font-mono font-semibold text-white hover:bg-[#3b55ff] transition-colors cursor-pointer"
                    >
                      {runningMcp
                        ? 'Executing JSON-RPC Call...'
                        : `Execute ${selectedMcpTool}() ▶`}
                    </button>
                  </div>

                  {/* Right 7 Cols: Live JSON-RPC Output + Agent Connection Config */}
                  <div className="lg:col-span-7 p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2 flex-1 flex flex-col">
                      <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                        Live MCP JSON-RPC 2.0 Response
                      </span>
                      <pre className="flex-1 min-h-[280px] max-h-[340px] overflow-auto rounded-xl border border-white/15 bg-neutral-950/90 p-4 font-mono text-xs text-blue-50/90">
                        {mcpResponse || '// Click Execute to inspect MCP output'}
                      </pre>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-neutral-950/75 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                          Connect External AI Agent (mcp_config.json)
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Streamable HTTP JSON-RPC
                        </span>
                      </div>
                      <pre className="overflow-x-auto rounded-lg bg-black/60 p-3 font-mono text-[11px] text-neutral-300">
{`{
  "mcpServers": {
    "kramz-portfolio-studio": {
      "serverUrl": "${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/api/mcp",
      "headers": {
        "X-Admin-Secret": "kramz-admin-2026"
      }
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Bottom Subtle LetterGlitch Footer Strip */}
      <div className="relative isolate h-24 w-full overflow-hidden border-t border-white/10">
        <div className="pointer-events-none absolute inset-0 opacity-35">
          <LetterGlitch
            glitchColors={['#ffffff', '#0219EA', '#3b55ff']}
            baseColor="#ffffff"
            baseOpacity={0.15}
            glitchAmount={0.45}
            speed={isModalOpen ? 0 : 0.8}
            flow={0.4}
            edgeFade={0.2}
            centerFade={0.2}
            dpr={1.25}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>KramZ Admin &amp; MCP Studio • Zero-Database Git Architecture</span>
          <span className="text-[#4f6bff]">/api/admin • /api/mcp</span>
        </div>
      </div>
    </div>
  )
}
