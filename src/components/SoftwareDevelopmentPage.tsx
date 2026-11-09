import React, { useEffect, useRef, useState } from 'react'
import { animate, createScope, createSpring, stagger } from 'animejs'
import { portfolioData } from '../data/portfolio'
import AnimatedContent from './react-bits/AnimatedContent'
import DecryptedText from './react-bits/DecryptedText'
import LetterGlitch from './react-bits/LetterGlitch'
import MagicRings from './react-bits/MagicRings'
import SpotlightCard from './react-bits/SpotlightCard'
import StarBorder from './react-bits/StarBorder'
import TextType from './react-bits/TextType'

interface SoftwareDevelopmentPageProps {
  isModalOpen: boolean
  onBackToHome: () => void
  onOpenAllProjects: () => void
  onOpenContact: () => void
}

type DealStage = 'qualified' | 'discovery' | 'proposal' | 'won'
type CRMTab = 'pipeline' | 'contacts' | 'workflows' | 'meetings'

interface PremadeChatTurn {
  id: string
  label: string
  prompt: string
  response: string
  tag: string
}

interface MeetingTranscriptTurn {
  speaker: string
  role: string
  time: string
  text: string
  capturedNote: string
}

interface MeetingSession {
  id: string
  title: string
  dealId: string
  company: string
  duration: string
  participants: {
    name: string
    role: string
    initials: string
    videoSrc: string
    poster?: string
  }[]
  transcript: MeetingTranscriptTurn[]
  aiSummary: string
  actionItems: string[]
}

interface DealNote {
  id: string
  author: string
  text: string
  time: string
}

interface CRMDeal {
  id: string
  title: string
  company: string
  contactName: string
  contactRole: string
  email: string
  value: number
  probability: number
  stage: DealStage
  tag: 'Enterprise' | 'AI Workflow' | 'Full-Stack'
  updatedAt: string
  aiSummary: string
  notes: DealNote[]
}

interface CRMWorkflow {
  id: string
  name: string
  trigger: string
  steps: string[]
  runs: number
  enabled: boolean
  lastOutput: string
}

const STAGES: { id: DealStage; label: string; accent: string }[] = [
  { id: 'qualified', label: 'Qualified', accent: '#60a5fa' },
  { id: 'discovery', label: 'Technical Discovery', accent: '#4f6bff' },
  { id: 'proposal', label: 'Proposal Sent', accent: '#818cf8' },
  { id: 'won', label: 'Closed Won', accent: '#34d399' },
]

const TAG_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Tags' },
  { value: 'AI Workflow', label: 'AI Workflow' },
  { value: 'Full-Stack', label: 'Full-Stack' },
  { value: 'Enterprise', label: 'Enterprise' },
] as const

interface GlassDropdownOption<T extends string> {
  value: T
  label: string
}

interface GlassDropdownProps<T extends string> {
  value: T
  options: readonly GlassDropdownOption<T>[]
  onChange: (next: T) => void
  ariaLabel: string
  className?: string
  align?: 'left' | 'right'
}

function GlassDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
  align = 'right',
}: GlassDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const activeOption = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full inline-flex items-center justify-between gap-2.5 rounded-xl border bg-neutral-950/75 backdrop-blur-xl px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
          open
            ? 'border-[#0219EA] text-white shadow-[0_0_16px_rgba(2,25,234,0.4)]'
            : 'border-white/15 text-neutral-300 hover:border-[#0219EA]/70 hover:text-white'
        }`}
      >
        <span className="truncate">{activeOption?.label}</span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#4f6bff]' : 'text-neutral-400'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute top-full mt-2 z-50 min-w-[168px] w-max rounded-xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl backdrop-saturate-150 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_20px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(2,25,234,0.25)] space-y-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'border border-[#4f6bff]/50 bg-[#0219EA]/30 text-white shadow-[0_0_14px_rgba(2,25,234,0.35)]'
                    : 'border border-transparent text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    className="h-3.5 w-3.5 text-[#4f6bff] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const INITIAL_DEALS: CRMDeal[] = [
  {
    id: 'deal-1',
    title: 'Autonomous Property Valuation ETL',
    company: 'Saunders Real Estate',
    contactName: 'Marcus Vance',
    contactRole: 'VP of Operations',
    email: 'm.vance@saundersre.com',
    value: 48500,
    probability: 92,
    stage: 'won',
    tag: 'AI Workflow',
    updatedAt: '2h ago',
    aiSummary:
      'Multi-county MLS & assessor pipeline synced to CRM with automated comparable scoring.',
    notes: [
      {
        id: 'n-1',
        author: 'Mark Anthony Ebio',
        text: 'Deployed Python + n8n worker nodes; daily sync latency reduced from 4h to 35s.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'deal-2',
    title: 'Dual-Sided Talent Portal & LLM Matcher',
    company: 'Elite Assistant',
    contactName: 'Elena Rostova',
    contactRole: 'Head of Talent',
    email: 'elena@elite-assistant.com',
    value: 34000,
    probability: 78,
    stage: 'proposal',
    tag: 'Full-Stack',
    updatedAt: '4h ago',
    aiSummary:
      'React + Supabase portal with automated resume-to-opportunity vector matching.',
    notes: [
      {
        id: 'n-2',
        author: 'Mark Anthony Ebio',
        text: 'Sent Phase 2 architecture spec covering OpenAI resume parsing webhook.',
        time: '4h ago',
      },
    ],
  },
  {
    id: 'deal-3',
    title: 'Foreclosure Intake & Instant Cash SLA',
    company: 'KeyNest Properties',
    contactName: 'David Sterling',
    contactRole: 'Managing Partner',
    email: 'd.sterling@keynestprop.com',
    value: 29500,
    probability: 65,
    stage: 'discovery',
    tag: 'Full-Stack',
    updatedAt: '1d ago',
    aiSummary:
      'High-conversion architectural dark UI with automated GoHighLevel SMS sequences.',
    notes: [
      {
        id: 'n-3',
        author: 'Mark Anthony Ebio',
        text: 'Completed technical discovery on Minnesota county auction webhook triggers.',
        time: '1d ago',
      },
    ],
  },
  {
    id: 'deal-4',
    title: 'Enterprise RAG Knowledge Base & Slack Bot',
    company: 'Apex Cloud Logistics',
    contactName: 'Sarah Jenkins',
    contactRole: 'CTO',
    email: 'sjenkins@apexlogistics.io',
    value: 62000,
    probability: 84,
    stage: 'proposal',
    tag: 'Enterprise',
    updatedAt: '3h ago',
    aiSummary:
      'Claude 3.7 Sonnet agent indexing 14,000 SOP documents with role-based citations.',
    notes: [
      {
        id: 'n-4',
        author: 'Mark Anthony Ebio',
        text: 'Security review passed; SSO and rate-limited API gateway approved.',
        time: '3h ago',
      },
    ],
  },
  {
    id: 'deal-5',
    title: 'Multi-Channel Lead Router & Scoring',
    company: 'Antony Dye & Associates',
    contactName: 'Antony Dye',
    contactRole: 'Founder',
    email: 'antony@antonydye.com',
    value: 22000,
    probability: 45,
    stage: 'qualified',
    tag: 'AI Workflow',
    updatedAt: '6h ago',
    aiSummary:
      'Webhook intake unifying web forms, Calendly bookings, and enrichment APIs.',
    notes: [
      {
        id: 'n-5',
        author: 'Mark Anthony Ebio',
        text: 'Initial qualification call completed; mapping existing CRM fields.',
        time: '6h ago',
      },
    ],
  },
  {
    id: 'deal-6',
    title: 'Automated Invoice & QuickBooks Sync',
    company: 'Vanguard Media Group',
    contactName: 'Liam Thorne',
    contactRole: 'Finance Director',
    email: 'l.thorne@vanguardmedia.co',
    value: 19000,
    probability: 58,
    stage: 'discovery',
    tag: 'AI Workflow',
    updatedAt: '2d ago',
    aiSummary:
      'Zero-touch PDF invoice extraction and line-item reconciliation via Make + Python.',
    notes: [],
  },
]

const INITIAL_WORKFLOWS: CRMWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Inbound Lead AI Enrichment & Scoring',
    trigger: 'Webhook: POST /api/leads/inbound',
    steps: [
      ' Clearbit / Apollo Domain Lookup',
      'Claude 3.7 Fit & Intent Scoring',
      'Upsert Twenty CRM Opportunity',
      'Slack #sales-vip Alert',
    ],
    runs: 1428,
    enabled: true,
    lastOutput:
      'Scored Apex Cloud Logistics (94/100) → Routed to Proposal stage in 410ms',
  },
  {
    id: 'wf-2',
    name: 'Closed-Won Client Workspace Provisioning',
    trigger: 'Stage Changed → Closed Won',
    steps: [
      'Generate Stripe Milestone Invoice',
      'Create ClickUp Project & SOP Tasks',
      'Provision Client Slack Channel',
      'Send Welcome Onboarding Deck',
    ],
    runs: 312,
    enabled: true,
    lastOutput:
      'Provisioned Saunders Real Estate workspace + 14 sprint tasks in 1.2s',
  },
  {
    id: 'wf-3',
    name: 'Stale Opportunity Follow-Up Drafts',
    trigger: 'Cron: Every 24h (Idle > 5 Days)',
    steps: [
      'Query Idle Discovery Deals',
      'Summarize Last Call Transcript',
      'Draft Personalized Follow-Up Email',
      'Queue in Gmail Drafts for Review',
    ],
    runs: 864,
    enabled: true,
    lastOutput:
      'Drafted 3 context-aware follow-up emails from meeting notes',
  },
]

const PREMADE_CHAT_PROMPTS: PremadeChatTurn[] = [
  {
    id: 'chat-1',
    label: 'Top Closing Deals',
    prompt: 'Which deals have the highest close probability this month?',
    response:
      'Apex Cloud Logistics ($62,000 • 84% score) and Elite Assistant ($34,000 • 78% score) lead active proposals. Combined weighted ARR: $78,600. Recommended action: finalize webhook security specs today.',
    tag: 'Pipeline Forecast',
  },
  {
    id: 'chat-2',
    label: 'Draft Elite Assistant Follow-Up',
    prompt: "Draft a follow-up for Elite Assistant's $34k proposal",
    response:
      'Subject: Phase 2 OpenAI Matcher Spec — Hi Elena, attached is the 310ms vector matching benchmark for Elite Assistant. Ready to provision the staging webhook and ClickUp workspace this Thursday?',
    tag: 'Auto-Draft',
  },
  {
    id: 'chat-3',
    label: 'Audit Discovery Bottlenecks',
    prompt: 'Audit pipeline bottlenecks across all 4 stages',
    response:
      'Technical Discovery holds $48,500 across KeyNest Properties & Vanguard Media. Automating county auction webhook validation and QuickBooks line-item OCR will advance both to Proposal Sent within 48h.',
    tag: 'Deal Intelligence',
  },
  {
    id: 'chat-4',
    label: 'Summarize Meeting Action Items',
    prompt: 'Summarize recent AI meeting notes & action items',
    response:
      'Captured 4 action items from the Elite Assistant & Saunders RE executive syncs: deploy resume vector endpoint, verify MLS rate limits, and trigger Phase 2 milestone invoice.',
    tag: 'Meeting Sync',
  },
]

const MEETING_SESSIONS: MeetingSession[] = [
  {
    id: 'mtg-elite',
    title: 'Phase 2 LLM Talent Matcher & Webhook Scope',
    dealId: 'deal-2',
    company: 'Elite Assistant',
    duration: '18:42',
    participants: [
      {
        name: 'Mark Anthony Ebio',
        role: 'Lead AI & Full-Stack Architect',
        initials: 'ME',
        videoSrc: '/videos/meeting-mark.mp4',
        poster: '/frames/frame_0001.webp',
      },
      {
        name: 'Elena Rostova',
        role: 'Head of Talent • Elite Assistant',
        initials: 'ER',
        videoSrc: '/videos/meeting-elena.mp4',
        poster: '/images/meeting-elena.jpg',
      },
      {
        name: 'Nexus AI Note-Taker',
        role: 'Real-Time CRM Scribe',
        initials: 'AI',
        videoSrc: '/videos/loader-globe.mp4',
      },
    ],
    transcript: [
      {
        speaker: 'Elena Rostova',
        role: 'Head of Talent • Elite Assistant',
        time: '04:12',
        text: 'Our recruiters spend 3 hours daily matching incoming resumes against open Opportunity Files across bookkeeping and medical scribing.',
        capturedNote:
          'Identified bottleneck: manual resume-to-role screening taking ~3h/day.',
      },
      {
        speaker: 'Mark Anthony Ebio',
        role: 'Lead AI & Full-Stack Architect',
        time: '04:28',
        text: 'We can wire an OpenAI + Claude structured extraction webhook directly to your Supabase portal that scores every applicant in under 400ms.',
        capturedNote:
          'Proposed architecture: OpenAI/Claude webhook + Supabase vector scoring (<400ms).',
      },
      {
        speaker: 'Elena Rostova',
        role: 'Head of Talent • Elite Assistant',
        time: '04:49',
        text: 'If it can also auto-provision a ClickUp onboarding list and Slack channel when a client signs, we are ready to approve the $34,000 Phase 2 scope.',
        capturedNote:
          'Buying signal confirmed: $34,000 Phase 2 approved upon ClickUp + Slack auto-provisioning.',
      },
    ],
    aiSummary:
      'Elena confirmed budget approval ($34,000) for Phase 2 once the LLM resume-to-opportunity matcher is paired with automated ClickUp & Slack client onboarding.',
    actionItems: [
      'Deploy OpenAI resume parsing webhook to staging environment',
      'Connect n8n ClickUp + Slack channel provisioning trigger on Closed-Won',
      'Send final $34,000 Phase 2 milestone agreement to Elena Rostova',
    ],
  },
  {
    id: 'mtg-saunders',
    title: 'Multi-County MLS & Tax Assessor ETL Review',
    dealId: 'deal-1',
    company: 'Saunders Real Estate',
    duration: '24:15',
    participants: [
      {
        name: 'Mark Anthony Ebio',
        role: 'Lead AI & Full-Stack Architect',
        initials: 'ME',
        videoSrc: '/videos/meeting-mark.mp4',
        poster: '/frames/frame_0001.webp',
      },
      {
        name: 'Marcus Vance',
        role: 'VP of Operations • Saunders RE',
        initials: 'MV',
        videoSrc: '/videos/meeting-marcus.mp4',
        poster: '/images/meeting-marcus.jpg',
      },
      {
        name: 'Nexus AI Note-Taker',
        role: 'Real-Time CRM Scribe',
        initials: 'AI',
        videoSrc: '/videos/loader-globe.mp4',
      },
    ],
    transcript: [
      {
        speaker: 'Marcus Vance',
        role: 'VP of Operations • Saunders RE',
        time: '11:04',
        text: 'The daily property valuation sync across 6 county assessor databases used to take our analysts 4 hours every morning.',
        capturedNote:
          'Baseline metric logged: 4 hours/day manual county assessor data entry.',
      },
      {
        speaker: 'Mark Anthony Ebio',
        role: 'Lead AI & Full-Stack Architect',
        time: '11:22',
        text: 'With the new Python FastAPI + n8n worker queue, all 6 counties normalize and upsert into the CRM in 35 seconds with zero duplicate parcels.',
        capturedNote:
          'Performance verified: 4h manual workflow compressed to 35s automated ETL.',
      },
      {
        speaker: 'Marcus Vance',
        role: 'VP of Operations • Saunders RE',
        time: '11:45',
        text: 'Latency is night and day. Let us expand the pipeline to commercial zoning layers for Q3.',
        capturedNote:
          'Upsell opportunity identified: Q3 commercial zoning data layer expansion.',
      },
    ],
    aiSummary:
      'Production ETL review passed with 35-second multi-county sync speed. Marcus requested a Q3 expansion quote for commercial zoning layers.',
    actionItems: [
      'Archive legacy CSV import scripts and lock production cron schedule',
      'Scope Q3 commercial zoning GIS webhook expansion for Marcus Vance',
      'Log 99.4% parcel deduplication benchmark in CRM deal record',
    ],
  },
]

const GLASS_CONTAINER =
  'rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_36px_rgba(0,0,0,0.4)]'

export default function SoftwareDevelopmentPage({
  isModalOpen,
  onBackToHome,
  onOpenAllProjects,
  onOpenContact,
}: SoftwareDevelopmentPageProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const { profile } = portfolioData

  const [activeTab, setActiveTab] = useState<CRMTab>('pipeline')
  const [deals, setDeals] = useState<CRMDeal[]>(INITIAL_DEALS)
  const [workflows, setWorkflows] = useState<CRMWorkflow[]>(INITIAL_WORKFLOWS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('ALL')
  const [selectedDealId, setSelectedDealId] = useState<string>(INITIAL_DEALS[0].id)
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null)

  // New Deal Inline Form State
  const [addingDeal, setAddingDeal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newValue, setNewValue] = useState('25000')
  const [newStage, setNewStage] = useState<DealStage>('qualified')

  // Note Input & AI Enrichment State
  const [noteInput, setNoteInput] = useState('')
  const [enrichingId, setEnrichingId] = useState<string | null>(null)
  const [enrichStep, setEnrichStep] = useState<number>(-1)
  const [enrichedDoneId, setEnrichedDoneId] = useState<string | null>(null)
  const enrichTimersRef = useRef<number[]>([])
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null)
  const [workflowActiveStep, setWorkflowActiveStep] = useState<number>(-1)
  const [completedWorkflowId, setCompletedWorkflowId] = useState<string | null>(
    null
  )
  const workflowTimersRef = useRef<number[]>([])
  const [terminalLog, setTerminalLog] = useState<string>(
    'crm.engine.ready() — Drag opportunities across stages or trigger an AI workflow.'
  )
  const [terminalRunKey, setTerminalRunKey] = useState(0)

  // AI Chat System Mock State (Auto-Animated + Interactive)
  const [activeChatIndex, setActiveChatIndex] = useState(0)
  const [chatAutoPlay, setChatAutoPlay] = useState(true)
  const [customChatPrompt, setCustomChatPrompt] = useState('')
  const [customChatTurn, setCustomChatTurn] = useState<PremadeChatTurn | null>(
    null
  )
  const [chatAnimKey, setChatAnimKey] = useState(0)

  // Team Meeting & AI Note-Taker State
  const [activeMeetingId, setActiveMeetingId] = useState<string>(
    MEETING_SESSIONS[0].id
  )
  const [activeTranscriptIdx, setActiveTranscriptIdx] = useState(0)
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({
    'Deploy OpenAI resume parsing webhook to staging environment': true,
  })
  const [syncedMeetingId, setSyncedMeetingId] = useState<string | null>(null)

  const currentChatTurn =
    customChatTurn ?? PREMADE_CHAT_PROMPTS[activeChatIndex]
  const currentMeeting =
    MEETING_SESSIONS.find((m) => m.id === activeMeetingId) ??
    MEETING_SESSIONS[0]

  // Auto-cycle premade AI Chat responses when idle
  useEffect(() => {
    if (!chatAutoPlay || isModalOpen) return
    const timer = window.setInterval(() => {
      setCustomChatTurn(null)
      setActiveChatIndex((prev) => (prev + 1) % PREMADE_CHAT_PROMPTS.length)
      setChatAnimKey((k) => k + 1)
    }, 6200)
    return () => window.clearInterval(timer)
  }, [chatAutoPlay, isModalOpen])

  // Auto-animate Team Meeting live speaker turns & AI note capture
  useEffect(() => {
    if (isModalOpen) return
    const timer = window.setInterval(() => {
      setActiveTranscriptIdx(
        (prev) => (prev + 1) % currentMeeting.transcript.length
      )
    }, 4500)
    return () => window.clearInterval(timer)
  }, [currentMeeting, isModalOpen])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    if (!pageRef.current) return

    const scope = createScope({ root: pageRef.current }).add(() => {
      animate('.sw-hero-enter', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        ease: createSpring({ stiffness: 210, damping: 20 }),
      })

      animate('.sw-crm-shell', {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 560,
        delay: 90,
        ease: 'outCubic',
      })

      animate('.sw-arch-float', {
        translateY: [-4, 4],
        duration: 2400,
        delay: stagger(600),
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })
    })

    return () => scope.revert()
  }, [])

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === 'ALL' || d.tag === selectedTag
    return matchesSearch && matchesTag
  })

  const selectedDeal =
    deals.find((d) => d.id === selectedDealId) ?? filteredDeals[0] ?? deals[0]

  // Calculated Metrics
  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0)
  const weightedForecast = Math.round(
    deals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0)
  )
  const wonValue = deals
    .filter((d) => d.stage === 'won')
    .reduce((sum, d) => sum + d.value, 0)

  const moveDealStage = (dealId: string, nextStage: DealStage) => {
    const probMap: Record<DealStage, number> = {
      qualified: 45,
      discovery: 65,
      proposal: 82,
      won: 100,
    }
    const target = deals.find((d) => d.id === dealId)
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: nextStage,
              probability: probMap[nextStage],
              updatedAt: 'Just now',
            }
          : d
      )
    )
    if (target) {
      const stageLabel =
        STAGES.find((s) => s.id === nextStage)?.label ?? nextStage
      setTerminalLog(
        `[pipeline.update] Moved "${target.company}" ($${target.value.toLocaleString()}) → ${stageLabel} (${probMap[nextStage]}% win prob)`
      )
      setTerminalRunKey((k) => k + 1)
    }
  }

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newCompany.trim()) return
    const numericVal = Math.max(1000, Number(newValue) || 15000)
    const created: CRMDeal = {
      id: `deal-${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany.trim(),
      contactName: 'New Executive Lead',
      contactRole: 'Decision Maker',
      email: `contact@${newCompany
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')}.com`,
      value: numericVal,
      probability: newStage === 'won' ? 100 : newStage === 'proposal' ? 80 : 50,
      stage: newStage,
      tag: 'AI Workflow',
      updatedAt: 'Just now',
      aiSummary:
        'Newly ingested opportunity via interactive CRM sandbox; queued for automated LLM enrichment.',
      notes: [],
    }
    setDeals((prev) => [created, ...prev])
    setSelectedDealId(created.id)
    setNewTitle('')
    setNewCompany('')
    setNewValue('25000')
    setAddingDeal(false)
    setTerminalLog(
      `[object.create] Created opportunity "${created.title}" for ${created.company} ($${numericVal.toLocaleString()})`
    )
    setTerminalRunKey((k) => k + 1)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteInput.trim() || !selectedDeal) return
    const note: DealNote = {
      id: `note-${Date.now()}`,
      author: 'Visitor (Interactive Sandbox)',
      text: noteInput.trim(),
      time: 'Just now',
    }
    setDeals((prev) =>
      prev.map((d) =>
        d.id === selectedDeal.id
          ? { ...d, notes: [note, ...d.notes], updatedAt: 'Just now' }
          : d
      )
    )
    setNoteInput('')
    setTerminalLog(
      `[note.append] Logged activity note on ${selectedDeal.company}`
    )
    setTerminalRunKey((k) => k + 1)
  }

  const handleEnrichDeal = (deal: CRMDeal) => {
    enrichTimersRef.current.forEach((id) => window.clearTimeout(id))
    enrichTimersRef.current = []

    setSelectedDealId(deal.id)
    setEnrichedDoneId(null)
    setEnrichingId(deal.id)
    setEnrichStep(0)
    setTerminalLog(
      `[ai.enrich] Step 01/03: Scanning ${deal.company} domain & tech stack via Clearbit/Apollo...`
    )
    setTerminalRunKey((k) => k + 1)

    const t1 = window.setTimeout(() => {
      setEnrichStep(1)
      setTerminalLog(
        `[ai.enrich] Step 02/03: Evaluating ${deal.contactName} (${deal.contactRole}) buying intent via Claude 3.7...`
      )
      setTerminalRunKey((k) => k + 1)
    }, 520)

    const t2 = window.setTimeout(() => {
      setEnrichStep(2)
      setTerminalLog(
        `[ai.enrich] Step 03/03: Upserting enriched win probability & next-step playbook for ${deal.company}...`
      )
      setTerminalRunKey((k) => k + 1)
    }, 1040)

    const t3 = window.setTimeout(() => {
      const boostedProb = Math.min(99, deal.probability + 8)
      const enrichedNote: DealNote = {
        id: `enrich-note-${Date.now()}`,
        author: 'Nexus AI Enrichment Engine',
        text: `Verified executive intent & tech stack for ${deal.contactName}. Boosted win score to ${boostedProb}%.`,
        time: 'Just now',
      }
      setDeals((prev) =>
        prev.map((d) =>
          d.id === deal.id
            ? {
                ...d,
                probability: boostedProb,
                aiSummary: `[AI Enriched • ${boostedProb}% Score] Verified tech stack & decision maker intent for ${d.company} (${d.contactName}). Recommended next action: trigger automated ROI proposal webhook.`,
                notes: [enrichedNote, ...d.notes],
                updatedAt: 'Just now',
              }
            : d
        )
      )
      setEnrichingId(null)
      setEnrichStep(-1)
      setEnrichedDoneId(deal.id)
      setTerminalLog(
        `[ai.done] Enriched ${deal.company} → Win score updated to ${boostedProb}% & activity note logged`
      )
      setTerminalRunKey((k) => k + 1)
    }, 1560)

    enrichTimersRef.current.push(t1, t2, t3)
  }

  const handleRunWorkflow = (wf: CRMWorkflow) => {
    // Clear any in-flight step timers
    workflowTimersRef.current.forEach((id) => window.clearTimeout(id))
    workflowTimersRef.current = []

    setCompletedWorkflowId(null)
    setRunningWorkflowId(wf.id)
    setWorkflowActiveStep(0)
    setTerminalLog(
      `[workflow.start] "${wf.name}" → Step 01/04: ${wf.steps[0].trim()}`
    )
    setTerminalRunKey((k) => k + 1)

    const stepDelay = 520
    wf.steps.forEach((stepName, idx) => {
      if (idx === 0) return
      const tid = window.setTimeout(() => {
        setWorkflowActiveStep(idx)
        setTerminalLog(
          `[workflow.step] "${wf.name}" → Step 0${idx + 1}/0${wf.steps.length}: ${stepName.trim()}`
        )
        setTerminalRunKey((k) => k + 1)
      }, idx * stepDelay)
      workflowTimersRef.current.push(tid)
    })

    const finishId = window.setTimeout(() => {
      setWorkflows((prev) =>
        prev.map((item) =>
          item.id === wf.id ? { ...item, runs: item.runs + 1 } : item
        )
      )
      setRunningWorkflowId(null)
      setWorkflowActiveStep(-1)
      setCompletedWorkflowId(wf.id)
      setTerminalLog(`[workflow.done] "${wf.name}" → ${wf.lastOutput}`)
      setTerminalRunKey((k) => k + 1)
    }, wf.steps.length * stepDelay + 120)
    workflowTimersRef.current.push(finishId)
  }

  const handleSelectPremadeChat = (idx: number) => {
    setCustomChatTurn(null)
    setActiveChatIndex(idx)
    setChatAnimKey((k) => k + 1)
    const chosen = PREMADE_CHAT_PROMPTS[idx]
    if (chosen) {
      setTerminalLog(`[copilot.query] "${chosen.prompt}" → Streamed response`)
      setTerminalRunKey((k) => k + 1)
    }
  }

  const handleCustomChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customChatPrompt.trim()) return
    const q = customChatPrompt.trim()
    setCustomChatPrompt('')
    setChatAutoPlay(false)
    const targetDeal = selectedDeal ?? deals[0]
    const generated: PremadeChatTurn = {
      id: `custom-${Date.now()}`,
      label: 'Custom Query',
      prompt: q,
      response: `Analyzed ${deals.length} active opportunities ($${totalPipelineValue.toLocaleString()} pipeline). Focus deal "${targetDeal.company}" ($${targetDeal.value.toLocaleString()}) is at ${targetDeal.probability}% win score — recommended next step: trigger automated follow-up workflow.`,
      tag: 'Live Copilot',
    }
    setCustomChatTurn(generated)
    setChatAnimKey((k) => k + 1)
    setTerminalLog(`[copilot.ask] "${q}" → Evaluated ${deals.length} CRM deals`)
    setTerminalRunKey((k) => k + 1)
  }

  const handleSyncMeetingToDeal = (session: MeetingSession) => {
    setSyncedMeetingId(session.id)
    const note: DealNote = {
      id: `mtg-note-${Date.now()}`,
      author: 'Nexus AI Note-Taker',
      text: `[Meeting Captured] ${session.aiSummary}`,
      time: 'Just now',
    }
    setDeals((prev) =>
      prev.map((d) =>
        d.id === session.dealId
          ? {
              ...d,
              probability: Math.min(99, d.probability + 6),
              notes: [note, ...d.notes],
              updatedAt: 'Just now',
            }
          : d
      )
    )
    setSelectedDealId(session.dealId)
    setTerminalLog(
      `[meeting.sync] Synced AI captured notes & ${session.actionItems.length} action items to ${session.company}`
    )
    setTerminalRunKey((k) => k + 1)
    setTimeout(() => setSyncedMeetingId(null), 1800)
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-[#0219EA] selection:text-white"
    >
      {/* Sticky Top Navigation Bar (Icon-Only Home & All Projects Buttons) */}
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

            <span className="hidden sm:inline text-white/15 px-1">|</span>

            <span className="hidden sm:inline text-xs font-medium text-neutral-400 truncate">
              Software Development • Interactive CRM Sandbox
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <StarBorder
              as="button"
              type="button"
              onClick={onOpenContact}
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
              Build Custom CRM ↗
            </StarBorder>
          </div>
        </div>
      </header>

      {/* Upper Section with MagicRings Background + Interactive CRM Application */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 space-y-8">
          {/* Page Heading */}
          <div className="sw-hero-enter flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2.5">
              <span className="block text-xs font-mono uppercase tracking-wider text-[#4f6bff]">
                SOFTWARE DEVELOPMENT • INTERACTIVE SANDBOX
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                KramZ Nexus CRM
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                An interactive SaaS CRM &amp; AI workflow engine modeled on open-source React/TypeScript architectures (`twentyhq/twenty` &amp; `marmelab/atomic-crm`). Drag deals across stages, enrich leads with AI, or trigger live webhook pipelines below.
              </p>
            </div>

            {/* Live Calculated Revenue Readout */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Total Pipeline
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  ${totalPipelineValue.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Weighted Forecast
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-[#4f6bff]">
                  ${weightedForecast.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Closed Won
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  ${wonValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              INTERACTIVE MOCK CRM APPLICATION SHELL (SpotlightCard Glass)
             ============================================================ */}
          <div className="sw-crm-shell">
            <SpotlightCard
              spotlightColor="#0219EA"
              intensity={0.18}
              borderGlow={0.75}
              className="!p-0 !rounded-2xl overflow-hidden border border-white/15"
            >
              <div>
                {/* Top App Toolbar: View Switcher + Search + Filter + Add Deal */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-6">
                  {/* Left: App View Tabs */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-neutral-950/60 p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('pipeline')}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                        activeTab === 'pipeline'
                          ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="5" height="18" rx="1" />
                        <rect x="10" y="3" width="5" height="12" rx="1" />
                        <rect x="17" y="3" width="5" height="15" rx="1" />
                      </svg>
                      <span>Kanban Pipeline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('contacts')}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                        activeTab === 'contacts'
                          ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>Companies &amp; People</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('workflows')
                        if (!runningWorkflowId && workflows[0]) {
                          handleRunWorkflow(workflows[0])
                        }
                      }}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                        activeTab === 'workflows'
                          ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>AI Workflows</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('meetings')}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                        activeTab === 'meetings'
                          ? 'bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.55)]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                      <span>Team Meeting</span>
                    </button>
                  </div>

                  {/* Right: Search Input + Category Filter + New Opportunity CTA */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search deals or companies..."
                        className="w-44 sm:w-56 rounded-xl border border-white/15 bg-neutral-950/70 px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <GlassDropdown
                      ariaLabel="Filter deals by tag"
                      value={selectedTag}
                      options={TAG_FILTER_OPTIONS}
                      onChange={(next) => setSelectedTag(next)}
                      className="min-w-[136px]"
                    />

                    <button
                      type="button"
                      onClick={() => setAddingDeal((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#0219EA] bg-[#0219EA]/30 px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#0219EA]/50 transition-colors cursor-pointer"
                    >
                      <span>+ New Deal</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible "+ New Deal" Drawer Bar */}
                {addingDeal && (
                  <form
                    onSubmit={handleCreateDeal}
                    className="border-b border-white/10 bg-neutral-950/80 px-4 py-3 sm:px-6 flex flex-wrap items-end gap-3"
                  >
                    <div className="flex-1 min-w-[180px] space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Opportunity Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Custom AI Agent & CRM Sync"
                        className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <div className="w-44 space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <div className="w-32 space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Value (USD)
                      </label>
                      <input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-[#0219EA]"
                      />
                    </div>

                    <div className="w-48 space-y-1">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">
                        Stage
                      </label>
                      <GlassDropdown
                        ariaLabel="Select opportunity stage"
                        value={newStage}
                        options={STAGES.map((s) => ({
                          value: s.id,
                          label: s.label,
                        }))}
                        onChange={(next) => setNewStage(next)}
                        align="left"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-[#0219EA] px-3.5 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#3b55ff] transition-colors cursor-pointer"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingDeal(false)}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Main Workspace Grid: Left View (8 cols) + Right Deal Inspector Drawer (4 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
                  {/* LEFT 8 COLS: Active CRM View */}
                  <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-5 overflow-x-auto">
                    {activeTab === 'pipeline' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 min-w-[680px]">
                        {STAGES.map((stage, stageIdx) => {
                          const stageDeals = filteredDeals.filter(
                            (d) => d.stage === stage.id
                          )
                          const stageSum = stageDeals.reduce(
                            (acc, d) => acc + d.value,
                            0
                          )
                          const isDragTarget = dragOverStage === stage.id

                          return (
                            <div
                              key={stage.id}
                              onDragOver={(e) => {
                                e.preventDefault()
                                setDragOverStage(stage.id)
                              }}
                              onDragLeave={() => setDragOverStage(null)}
                              onDrop={(e) => {
                                e.preventDefault()
                                setDragOverStage(null)
                                if (draggedDealId) {
                                  moveDealStage(draggedDealId, stage.id)
                                  setDraggedDealId(null)
                                }
                              }}
                              className={`rounded-xl border p-3 flex flex-col justify-between gap-3 transition-colors min-h-[280px] ${
                                isDragTarget
                                  ? 'border-[#4f6bff] bg-[#0219EA]/15'
                                  : 'border-white/10 bg-neutral-950/45'
                              }`}
                            >
                              <div className="space-y-2.5">
                                {/* Column Header */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      style={{ backgroundColor: stage.accent }}
                                      className="h-2 w-2 rounded-full"
                                    />
                                    <span className="text-xs font-bold text-white">
                                      {stage.label}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-neutral-400">
                                    {stageDeals.length}
                                  </span>
                                </div>

                                <div className="text-[11px] font-mono text-[#4f6bff]">
                                  ${stageSum.toLocaleString()}
                                </div>

                                {/* Deal Cards */}
                                <div className="space-y-2.5 pt-1">
                                  {stageDeals.map((deal) => {
                                    const isSelected =
                                      selectedDeal?.id === deal.id
                                    return (
                                      <div
                                        key={deal.id}
                                        draggable
                                        onDragStart={() =>
                                          setDraggedDealId(deal.id)
                                        }
                                        onDragEnd={() => {
                                          setDraggedDealId(null)
                                          setDragOverStage(null)
                                        }}
                                        onClick={() =>
                                          setSelectedDealId(deal.id)
                                        }
                                        className={`rounded-xl border p-3 transition-all cursor-grab active:cursor-grabbing space-y-2 ${
                                          isSelected
                                            ? 'border-[#4f6bff] bg-[#0219EA]/20 shadow-[0_0_20px_rgba(2,25,234,0.3)]'
                                            : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="text-[10px] font-mono text-[#4f6bff] truncate">
                                            {deal.company}
                                          </span>
                                          <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                                            {deal.probability}%
                                          </span>
                                        </div>

                                        <div className="text-xs font-semibold text-white leading-snug">
                                          {deal.title}
                                        </div>

                                        <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                                          <span className="text-xs font-bold font-mono text-white">
                                            ${deal.value.toLocaleString()}
                                          </span>

                                          {/* Quick Stage Move Icon Buttons */}
                                          <div
                                            className="flex items-center gap-1"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {stageIdx > 0 && (
                                              <button
                                                type="button"
                                                aria-label={`Move back to ${STAGES[stageIdx - 1].label}`}
                                                title={`Move back to ${STAGES[stageIdx - 1].label}`}
                                                onClick={() =>
                                                  moveDealStage(
                                                    deal.id,
                                                    STAGES[stageIdx - 1].id
                                                  )
                                                }
                                                className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#4f6bff] hover:bg-[#0219EA]/25 hover:text-white transition-colors cursor-pointer"
                                              >
                                                <svg
                                                  className="h-3 w-3"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2.2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <polyline points="15 18 9 12 15 6" />
                                                </svg>
                                              </button>
                                            )}
                                            {stageIdx < STAGES.length - 1 && (
                                              <button
                                                type="button"
                                                aria-label={`Advance to ${STAGES[stageIdx + 1].label}`}
                                                title={`Advance to ${STAGES[stageIdx + 1].label}`}
                                                onClick={() =>
                                                  moveDealStage(
                                                    deal.id,
                                                    STAGES[stageIdx + 1].id
                                                  )
                                                }
                                                className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#4f6bff] hover:bg-[#0219EA]/25 hover:text-white transition-colors cursor-pointer"
                                              >
                                                <svg
                                                  className="h-3 w-3"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2.2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              <div className="text-[10px] font-mono text-neutral-500 text-center pt-2">
                                Drop card here
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {activeTab === 'contacts' && (
                      <div className="space-y-3">
                        <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-950/45">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-neutral-400">
                                <th className="py-3 px-3.5">Company &amp; Contact</th>
                                <th className="py-3 px-3">Opportunity</th>
                                <th className="py-3 px-3 whitespace-nowrap">Stage (Click to Advance)</th>
                                <th className="py-3 px-3 whitespace-nowrap">ARR Value</th>
                                <th className="py-3 px-3.5 text-right whitespace-nowrap">AI Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 text-xs">
                              {filteredDeals.map((deal) => {
                                const isSelected = selectedDeal?.id === deal.id
                                const isEnriching = enrichingId === deal.id
                                const isEnrichedDone =
                                  !isEnriching && enrichedDoneId === deal.id
                                const stageObj =
                                  STAGES.find((s) => s.id === deal.stage) ??
                                  STAGES[0]
                                const currentStageIdx = STAGES.findIndex(
                                  (s) => s.id === deal.stage
                                )
                                const nextStageObj =
                                  STAGES[(currentStageIdx + 1) % STAGES.length]
                                const enrichLabels = [
                                  '1/3 Scanning...',
                                  '2/3 Scoring...',
                                  '3/3 Syncing...',
                                ]

                                return (
                                  <React.Fragment key={deal.id}>
                                    <tr
                                      onClick={() => setSelectedDealId(deal.id)}
                                      className={`transition-colors cursor-pointer ${
                                        isEnriching
                                          ? 'bg-[#0219EA]/25'
                                          : isSelected
                                            ? 'bg-[#0219EA]/15'
                                            : 'hover:bg-white/[0.03]'
                                      }`}
                                    >
                                      <td className="py-3 px-3.5">
                                        <div className="font-semibold text-white">
                                          {deal.company}
                                        </div>
                                        <div className="text-[11px] text-neutral-400">
                                          {deal.contactName} • {deal.contactRole}
                                        </div>
                                      </td>
                                      <td className="py-3 px-3 text-neutral-200">
                                        {deal.title}
                                      </td>
                                      <td
                                        className="py-3 px-3 whitespace-nowrap"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          type="button"
                                          title={`Click to advance stage to ${nextStageObj.label}`}
                                          onClick={() =>
                                            moveDealStage(
                                              deal.id,
                                              nextStageObj.id
                                            )
                                          }
                                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono text-white hover:border-[#4f6bff] hover:bg-[#0219EA]/25 transition-all cursor-pointer"
                                        >
                                          <span
                                            style={{
                                              backgroundColor: stageObj.accent,
                                            }}
                                            className="h-1.5 w-1.5 rounded-full shrink-0"
                                          />
                                          <span>{stageObj.label}</span>
                                          <svg
                                            className="h-2.5 w-2.5 text-neutral-400 shrink-0"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="9 18 15 12 9 6" />
                                          </svg>
                                        </button>
                                      </td>
                                      <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                                        <div>${deal.value.toLocaleString()}</div>
                                        <div className="text-[10px] font-normal text-[#4f6bff]">
                                          {deal.probability}% win score
                                        </div>
                                      </td>
                                      <td
                                        className="py-3 px-3.5 text-right whitespace-nowrap"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => handleEnrichDeal(deal)}
                                          className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                                            isEnriching
                                              ? 'border-[#4f6bff] bg-[#0219EA] text-white shadow-[0_0_16px_rgba(2,25,234,0.6)]'
                                              : isEnrichedDone
                                                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                                                : 'border-[#0219EA]/80 bg-[#0219EA]/25 text-white hover:border-[#4f6bff] hover:bg-[#0219EA]/50'
                                          }`}
                                        >
                                          {isEnriching ? (
                                            <>
                                              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                                              <span>
                                                {enrichLabels[enrichStep] ??
                                                  'Enriching...'}
                                              </span>
                                            </>
                                          ) : isEnrichedDone ? (
                                            <span>Enriched +8% ✓</span>
                                          ) : (
                                            <span>AI Enrich ✦</span>
                                          )}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* Animated Inline AI Enrichment Pipeline Drawer */}
                                    {(isEnriching || isEnrichedDone) && (
                                      <tr className="bg-neutral-950/90">
                                        <td colSpan={5} className="px-3.5 py-2.5">
                                          <div className="space-y-2">
                                            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                                              <div
                                                style={{
                                                  width: isEnrichedDone
                                                    ? '100%'
                                                    : `${Math.round(((enrichStep + 1) / 3) * 100)}%`,
                                                }}
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                  isEnrichedDone
                                                    ? 'bg-emerald-400'
                                                    : 'bg-[#4f6bff]'
                                                }`}
                                              />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                              {[
                                                '01 Clearbit/Apollo Tech Stack Scan',
                                                '02 Claude 3.7 Executive Intent Score',
                                                '03 Upsert CRM Win Score (+8%)',
                                              ].map((label, stepIdx) => {
                                                const active =
                                                  isEnriching &&
                                                  enrichStep === stepIdx
                                                const done =
                                                  isEnrichedDone ||
                                                  (isEnriching &&
                                                    enrichStep > stepIdx)
                                                return (
                                                  <div
                                                    key={label}
                                                    className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-mono flex items-center justify-between ${
                                                      active
                                                        ? 'border-[#4f6bff] bg-[#0219EA]/30 text-white'
                                                        : done
                                                          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                                                          : 'border-white/10 bg-white/[0.02] text-neutral-400'
                                                    }`}
                                                  >
                                                    <span className="truncate">
                                                      {label}
                                                    </span>
                                                    {done && (
                                                      <span className="text-emerald-300 font-bold">
                                                        ✓
                                                      </span>
                                                    )}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activeTab === 'workflows' && (
                      <div className="space-y-3.5">
                        {workflows.map((wf) => {
                          const isRunning = runningWorkflowId === wf.id
                          const isCompleted =
                            !isRunning && completedWorkflowId === wf.id
                          const progressPct = isRunning
                            ? Math.round(
                                ((workflowActiveStep + 1) / wf.steps.length) *
                                  100
                              )
                            : isCompleted
                              ? 100
                              : 0

                          return (
                            <div
                              key={wf.id}
                              className={`rounded-xl border p-4 space-y-3 transition-all duration-300 ${
                                isRunning
                                  ? 'border-[#4f6bff] bg-[#0219EA]/15 shadow-[0_0_28px_rgba(2,25,234,0.3)]'
                                  : isCompleted
                                    ? 'border-emerald-400/50 bg-neutral-950/65'
                                    : 'border-white/10 bg-neutral-950/55 hover:border-[#0219EA]/60'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h3 className="text-sm font-bold text-white">
                                    {wf.name}
                                  </h3>
                                  <p className="text-[11px] font-mono text-[#4f6bff]">
                                    {wf.trigger}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  <span className="text-[11px] font-mono text-neutral-400">
                                    {wf.runs.toLocaleString()} runs
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRunWorkflow(wf)}
                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold text-white transition-all cursor-pointer ${
                                      isRunning
                                        ? 'border-[#4f6bff] bg-[#0219EA] shadow-[0_0_18px_rgba(2,25,234,0.65)]'
                                        : 'border-[#0219EA] bg-[#0219EA]/30 hover:bg-[#0219EA]/55'
                                    }`}
                                  >
                                    {isRunning ? (
                                      <>
                                        <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        <span>
                                          Step 0{workflowActiveStep + 1}/0
                                          {wf.steps.length}
                                        </span>
                                      </>
                                    ) : (
                                      <span>Test Trigger ▶</span>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Animated Pipeline Progress Track */}
                              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  style={{ width: `${progressPct}%` }}
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isCompleted
                                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                                      : 'bg-[#4f6bff] shadow-[0_0_12px_rgba(79,107,255,0.9)]'
                                  }`}
                                />
                              </div>

                              {/* Pipeline Step Nodes with Sequential Animation */}
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-0.5">
                                {wf.steps.map((step, idx) => {
                                  const isStepActive =
                                    isRunning && workflowActiveStep === idx
                                  const isStepDone =
                                    (isRunning && workflowActiveStep > idx) ||
                                    isCompleted
                                  const stepLatency = [110, 240, 320, 410][
                                    idx % 4
                                  ]

                                  return (
                                    <div
                                      key={step}
                                      className={`rounded-lg border px-2.5 py-2 text-[11px] flex items-center justify-between gap-2 transition-all duration-300 ${
                                        isStepActive
                                          ? 'border-[#4f6bff] bg-[#0219EA]/35 text-white shadow-[0_0_16px_rgba(2,25,234,0.45)] -translate-y-0.5'
                                          : isStepDone
                                            ? 'border-emerald-400/45 bg-emerald-500/10 text-emerald-100'
                                            : 'border-white/10 bg-white/[0.03] text-neutral-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        {isStepActive ? (
                                          <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#4f6bff]/30 border-t-[#4f6bff] animate-spin" />
                                        ) : isStepDone ? (
                                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-emerald-500/25 text-[10px] font-mono font-bold text-emerald-300">
                                            ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-mono font-bold text-[#4f6bff] shrink-0">
                                            0{idx + 1}
                                          </span>
                                        )}
                                        <span className="truncate">
                                          {step.trim()}
                                        </span>
                                      </div>

                                      {(isStepActive || isStepDone) && (
                                        <span className="text-[9px] font-mono text-neutral-400 shrink-0">
                                          {stepLatency}ms
                                        </span>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Live Step Trace / Output Stream */}
                              <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 border-t border-white/10 pt-2">
                                <div className="min-w-0 truncate">
                                  {isRunning ? (
                                    <span className="text-[#4f6bff]">
                                      Executing node 0{workflowActiveStep + 1}:{' '}
                                      <strong className="text-white">
                                        {wf.steps[workflowActiveStep]?.trim()}
                                      </strong>
                                      ...
                                    </span>
                                  ) : (
                                    <>
                                      Last Output:{' '}
                                      <span className="text-neutral-200">
                                        {wf.lastOutput}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {isCompleted && (
                                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                                    4/4 Nodes Passed ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {activeTab === 'meetings' && (
                      <div className="space-y-4">
                        {/* Meeting Session Selector + Sync to Deal Action */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-neutral-950/60 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {MEETING_SESSIONS.map((session) => {
                              const active = session.id === currentMeeting.id
                              return (
                                <button
                                  key={session.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveMeetingId(session.id)
                                    setActiveTranscriptIdx(0)
                                    setSelectedDealId(session.dealId)
                                  }}
                                  className={`rounded-lg border px-3 py-1.5 text-left text-xs font-mono transition-all cursor-pointer ${
                                    active
                                      ? 'border-[#4f6bff] bg-[#0219EA]/30 text-white shadow-[0_0_14px_rgba(2,25,234,0.35)]'
                                      : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {session.company} ({session.duration})
                                </button>
                              )
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleSyncMeetingToDeal(currentMeeting)
                            }
                            className="rounded-lg border border-[#0219EA] bg-[#0219EA]/30 px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#0219EA]/55 transition-colors cursor-pointer"
                          >
                            {syncedMeetingId === currentMeeting.id
                              ? 'Synced to CRM Deal ✓'
                              : 'Sync AI Notes to Deal ✦'}
                          </button>
                        </div>

                        {/* Live Video Call Participant Tiles with Active Speaker Equalizer */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {currentMeeting.participants.map((p) => {
                            const activeTurn =
                              currentMeeting.transcript[activeTranscriptIdx] ??
                              currentMeeting.transcript[0]
                            const isAI = p.initials === 'AI'
                            const isSpeaking =
                              activeTurn.speaker === p.name || isAI
                            return (
                              <div
                                key={p.name}
                                className={`group relative overflow-hidden rounded-xl border aspect-video bg-neutral-950 transition-all duration-300 ${
                                  isSpeaking
                                    ? 'border-[#4f6bff] ring-1 ring-[#4f6bff]/50 shadow-[0_0_24px_rgba(2,25,234,0.4)]'
                                    : 'border-white/10 opacity-85 hover:opacity-100'
                                }`}
                              >
                                {/* Looping Video Call Stream */}
                                <video
                                  key={p.videoSrc}
                                  src={p.videoSrc}
                                  poster={p.poster}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className={`h-full w-full object-cover transition-transform duration-500 ${
                                    isSpeaking ? 'scale-[1.03]' : 'scale-100'
                                  } ${isAI ? 'brightness-110 saturate-150' : ''}`}
                                />

                                {/* Subtle Vignette Scrim for HUD Legibility */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/20 to-neutral-950/55" />

                                {/* Top Call Status + Audio Equalizer Pill */}
                                <div className="absolute top-2 inset-x-2.5 flex items-center justify-between gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider backdrop-blur-md ${
                                      isAI
                                        ? 'border-[#4f6bff]/60 bg-[#0219EA]/55 text-white'
                                        : isSpeaking
                                          ? 'border-emerald-400/60 bg-neutral-950/75 text-emerald-300'
                                          : 'border-white/15 bg-neutral-950/65 text-neutral-300'
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        isAI
                                          ? 'bg-[#4f6bff] animate-ping'
                                          : isSpeaking
                                            ? 'bg-emerald-400 animate-pulse'
                                            : 'bg-white/40'
                                      }`}
                                    />
                                    {isAI
                                      ? 'AI Scribe'
                                      : isSpeaking
                                        ? 'Speaking'
                                        : 'Connected'}
                                  </span>

                                  {/* Voice Waveform Bars */}
                                  <div className="flex items-end gap-0.5 h-5 rounded-md border border-white/15 bg-neutral-950/70 px-1.5 py-1 backdrop-blur-md shrink-0">
                                    {[0.45, 0.9, 0.6, 1, 0.5].map((h, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          height: isSpeaking
                                            ? `${Math.round(h * 12)}px`
                                            : '3px',
                                        }}
                                        className={`w-0.5 rounded-full transition-all duration-300 ${
                                          isSpeaking
                                            ? 'bg-[#4f6bff] animate-pulse'
                                            : 'bg-white/25'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* Bottom Participant Identity Overlay */}
                                <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-white truncate drop-shadow">
                                      {p.name}
                                    </div>
                                    <div className="text-[10px] text-neutral-300 truncate">
                                      {p.role}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Live Transcript Turn + Real-Time AI Note Extraction */}
                        {(() => {
                          const turn =
                            currentMeeting.transcript[activeTranscriptIdx] ??
                            currentMeeting.transcript[0]
                          return (
                            <div className="rounded-xl border border-white/15 bg-neutral-950/75 p-4 space-y-3">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-[#4f6bff] font-semibold">
                                  {turn.speaker} • {turn.role}
                                </span>
                                <span className="text-neutral-400">
                                  Timestamp {turn.time}
                                </span>
                              </div>

                              <TextType
                                key={`mtg-turn-${currentMeeting.id}-${activeTranscriptIdx}`}
                                as="p"
                                text={`"${turn.text}"`}
                                typingSpeed={14}
                                loop={false}
                                showCursor={true}
                                cursorStyle="bar"
                                cursorColor="#4f6bff"
                                className="text-xs sm:text-sm text-neutral-100 leading-relaxed"
                              />

                              <div className="rounded-lg border border-[#0219EA]/50 bg-[#0219EA]/15 px-3 py-2 flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono text-blue-100">
                                  <strong className="text-[#4f6bff]">
                                    AI Captured Note:
                                  </strong>{' '}
                                  {turn.capturedNote}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                                  Turn {activeTranscriptIdx + 1}/
                                  {currentMeeting.transcript.length}
                                </span>
                              </div>
                            </div>
                          )
                        })()}

                        {/* AI Captured Executive Summary & Action Items Checklist */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-xl border border-white/10 bg-neutral-950/55 p-3.5 space-y-1.5">
                            <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                              AI Executive Call Summary
                            </span>
                            <p className="text-xs text-neutral-200 leading-relaxed">
                              {currentMeeting.aiSummary}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-neutral-950/55 p-3.5 space-y-2">
                            <span className="block text-[10px] font-mono uppercase text-[#4f6bff]">
                              Extracted CRM Action Items (Click to Toggle)
                            </span>
                            <div className="space-y-1.5">
                              {currentMeeting.actionItems.map((item) => {
                                const done = !!checkedActions[item]
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                      setCheckedActions((prev) => ({
                                        ...prev,
                                        [item]: !prev[item],
                                      }))
                                    }
                                    className="w-full flex items-start gap-2 text-left text-xs text-neutral-200 hover:text-white cursor-pointer"
                                  >
                                    <span
                                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-mono ${
                                        done
                                          ? 'border-[#4f6bff] bg-[#0219EA] text-white'
                                          : 'border-white/25 bg-white/[0.03] text-transparent'
                                      }`}
                                    >
                                      ✓
                                    </span>
                                    <span
                                      className={
                                        done
                                          ? 'line-through text-neutral-500'
                                          : ''
                                      }
                                    >
                                      {item}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================
                        AUTO-ANIMATED AI CRM COPILOT CHAT SYSTEM (BELOW WORKSPACE)
                       ======================================================== */}
                    <div className="mt-4 rounded-xl border border-white/15 bg-neutral-950/75 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0219EA]/35 border border-[#4f6bff]/50 text-[11px] font-mono font-bold text-white">
                            AI
                          </span>
                          <div>
                            <h3 className="text-xs font-bold text-white">
                              Nexus AI CRM Copilot
                            </h3>
                            <p className="text-[10px] font-mono text-neutral-400">
                              Auto-animated pipeline intelligence &amp; instant premade prompts
                            </p>
                          </div>
                        </div>

                        {/* Premade Prompt Quick Chips */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {PREMADE_CHAT_PROMPTS.map((item, idx) => {
                            const active =
                              !customChatTurn && activeChatIndex === idx
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectPremadeChat(idx)}
                                className={`rounded-lg border px-2.5 py-1 text-[10px] font-mono transition-all cursor-pointer ${
                                  active
                                    ? 'border-[#4f6bff] bg-[#0219EA]/30 text-white'
                                    : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white'
                                }`}
                              >
                                {item.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Animated User Prompt + Streaming AI Response */}
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-end">
                          <div className="rounded-xl rounded-tr-sm border border-[#4f6bff]/40 bg-[#0219EA]/25 px-3.5 py-2 text-xs text-white max-w-xl">
                            <span className="block text-[9px] font-mono uppercase text-[#4f6bff] mb-0.5">
                              Operator Prompt • {currentChatTurn.tag}
                            </span>
                            {currentChatTurn.prompt}
                          </div>
                        </div>

                        <div className="flex items-start justify-start">
                          <div className="w-full rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-neutral-200 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#4f6bff]">
                              <span>Nexus Copilot Response</span>
                              <button
                                type="button"
                                onClick={() => setChatAutoPlay((p) => !p)}
                                className="text-neutral-400 hover:text-white cursor-pointer"
                              >
                                {chatAutoPlay ? 'Auto-Play: ON' : 'Auto-Play: PAUSED'}
                              </button>
                            </div>
                            <TextType
                              key={`copilot-ans-${chatAnimKey}-${currentChatTurn.id}`}
                              as="div"
                              text={currentChatTurn.response}
                              typingSpeed={11}
                              loop={false}
                              showCursor={true}
                              cursorStyle="block"
                              cursorColor="#4f6bff"
                              cursorBlinkDuration={0.55}
                              className="text-xs text-neutral-100 leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interactive Custom Prompt Input */}
                      <form
                        onSubmit={handleCustomChatSubmit}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={customChatPrompt}
                          onChange={(e) => setCustomChatPrompt(e.target.value)}
                          placeholder="Ask Nexus AI Copilot about any deal, forecast, or meeting..."
                          className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#0219EA]"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-[#0219EA] bg-[#0219EA]/30 px-3.5 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#0219EA]/55 transition-colors cursor-pointer"
                        >
                          Ask AI ↵
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* RIGHT 4 COLS: Live Opportunity & Contact Inspector Drawer */}
                  <div className="lg:col-span-4 p-5 bg-neutral-950/35 flex flex-col justify-between gap-5">
                    {selectedDeal && (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3.5">
                          <div>
                            <span className="text-[11px] font-mono uppercase text-[#4f6bff]">
                              {selectedDeal.company}
                            </span>
                            <h3 className="text-base font-bold text-white leading-snug">
                              {selectedDeal.title}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {selectedDeal.contactName} • {selectedDeal.email}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEnrichDeal(selectedDeal)}
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer shrink-0 ${
                              enrichingId === selectedDeal.id
                                ? 'border-[#4f6bff] bg-[#0219EA] text-white shadow-[0_0_14px_rgba(2,25,234,0.6)]'
                                : enrichedDoneId === selectedDeal.id
                                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                                  : 'border-[#0219EA]/70 bg-[#0219EA]/25 text-white hover:bg-[#0219EA]/45'
                            }`}
                          >
                            {enrichingId === selectedDeal.id ? (
                              <>
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                <span>
                                  Step 0{enrichStep + 1}/03
                                </span>
                              </>
                            ) : enrichedDoneId === selectedDeal.id ? (
                              <span>Enriched ✓</span>
                            ) : (
                              <span>AI Enrich ✦</span>
                            )}
                          </button>
                        </div>

                        {/* Stage & Probability Selector */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <div className="text-[10px] font-mono uppercase text-neutral-400">
                              Deal Value
                            </div>
                            <div className="text-base font-bold font-mono text-white">
                              ${selectedDeal.value.toLocaleString()}
                            </div>
                          </div>
                          <div
                            className={`rounded-xl border p-3 transition-all ${
                              enrichingId === selectedDeal.id
                                ? 'border-[#4f6bff] bg-[#0219EA]/25 shadow-[0_0_16px_rgba(2,25,234,0.35)]'
                                : enrichedDoneId === selectedDeal.id
                                  ? 'border-emerald-400/45 bg-emerald-500/10'
                                  : 'border-white/10 bg-white/[0.03]'
                            }`}
                          >
                            <div className="text-[10px] font-mono uppercase text-neutral-400">
                              AI Win Score
                            </div>
                            <div className="text-base font-bold font-mono text-[#4f6bff]">
                              {selectedDeal.probability}%
                            </div>
                          </div>
                        </div>

                        {/* Stage Switcher Buttons */}
                        <div className="space-y-1.5">
                          <span className="block text-[10px] font-mono uppercase text-neutral-400">
                            Pipeline Stage
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {STAGES.map((s) => {
                              const active = selectedDeal.stage === s.id
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() =>
                                    moveDealStage(selectedDeal.id, s.id)
                                  }
                                  className={`rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-mono transition-colors cursor-pointer ${
                                    active
                                      ? 'border-[#4f6bff] bg-[#0219EA]/30 text-white font-semibold'
                                      : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {s.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* AI Deal Intelligence Summary */}
                        <div
                          className={`rounded-xl border p-3.5 space-y-1.5 transition-all ${
                            enrichingId === selectedDeal.id
                              ? 'border-[#4f6bff] bg-[#0219EA]/20'
                              : 'border-white/10 bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-[#4f6bff]">
                              AI Deal Intelligence
                            </span>
                            {enrichingId === selectedDeal.id && (
                              <span className="text-[10px] font-mono text-white">
                                Scanning Step 0{enrichStep + 1}/03...
                              </span>
                            )}
                          </div>
                          {enrichingId === selectedDeal.id ? (
                            <div className="space-y-2 pt-1">
                              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  style={{
                                    width: `${Math.round(((enrichStep + 1) / 3) * 100)}%`,
                                  }}
                                  className="h-full rounded-full bg-[#4f6bff] transition-all duration-300"
                                />
                              </div>
                              <p className="text-xs font-mono text-blue-100">
                                {[
                                  '01 Querying Clearbit/Apollo company stack...',
                                  '02 Scoring executive buying intent via Claude 3.7...',
                                  '03 Calculating updated win score & next action...',
                                ][enrichStep] ?? 'Enriching...'}
                              </p>
                            </div>
                          ) : (
                            <TextType
                              key={`intel-${selectedDeal.id}-${selectedDeal.probability}`}
                              as="p"
                              text={selectedDeal.aiSummary}
                              typingSpeed={10}
                              loop={false}
                              showCursor={false}
                              className="text-xs text-neutral-200 leading-relaxed"
                            />
                          )}
                        </div>

                        {/* Interactive Activity Notes */}
                        <div className="space-y-2.5 pt-1 border-t border-white/10">
                          <span className="block text-[10px] font-mono uppercase text-neutral-400">
                            Activity &amp; Notes ({selectedDeal.notes.length})
                          </span>

                          <form
                            onSubmit={handleAddNote}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                              placeholder="Add a call note or next step..."
                              className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#0219EA]"
                            />
                            <button
                              type="submit"
                              className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-mono text-white hover:border-[#0219EA] transition-colors cursor-pointer"
                            >
                              Post
                            </button>
                          </form>

                          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                            {selectedDeal.notes.map((n) => (
                              <div
                                key={n.id}
                                className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-xs space-y-0.5"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                                  <span className="text-[#4f6bff]">
                                    {n.author}
                                  </span>
                                  <span>{n.time}</span>
                                </div>
                                <p className="text-neutral-200">{n.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Live CRM Event Stream Terminal Bar */}
                    <div className="rounded-xl border border-[#0219EA]/45 bg-neutral-950/90 p-3 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                        </div>
                        <span className="text-[10px] text-[#4f6bff]">
                          crm_event_bus.ts
                        </span>
                      </div>
                      <TextType
                        key={`crm-log-${terminalRunKey}`}
                        as="div"
                        text={terminalLog}
                        prefix="> "
                        prefixColor="#0219EA"
                        typingSpeed={11}
                        loop={false}
                        showCursor={true}
                        cursorStyle="block"
                        cursorColor="#0219EA"
                        cursorBlinkDuration={0.55}
                        className="text-[11px] text-blue-50/90 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>

      {/* Lower Section with LetterGlitch + Hero-Style Offset Terminal Architecture Cards */}
      <div className="relative isolate w-full overflow-hidden">
        <div
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
          }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <LetterGlitch
            glitchColors={['#ffffff', '#0219EA', '#3b55ff']}
            baseColor="#ffffff"
            baseOpacity={0.2}
            glitchAmount={0.55}
            speed={isModalOpen ? 0 : 1}
            flow={0.5}
            edgeFade={0.18}
            centerFade={0.15}
            clickEffect="tear"
            dpr={1.5}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-14">
          <AnimatedContent
            distance={80}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            stagger={0.12}
            threshold={0.12}
            trigger="scroll"
            once={false}
          >
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                CRM Architecture &amp; Engineering Stack
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {[
                  {
                    file: '01_relational_core.sql',
                    cmd: 'Custom Objects & Kanban State',
                    detail:
                      'Modeled after Twenty CRM & Atomic CRM with optimistic Kanban drag-and-drop, relational Companies/People tables, and real-time weighted revenue forecasting.',
                  },
                  {
                    file: '02_llm_enrichment.py',
                    cmd: 'Autonomous AI Deal Scoring',
                    detail:
                      'Embeds OpenAI & Anthropic Claude webhooks directly into each opportunity record to score close probability, summarize call notes, and enrich firmographics.',
                  },
                  {
                    file: '03_event_workflows.ts',
                    cmd: 'Webhook & CRM Event Bus',
                    detail:
                      'Triggers n8n, Make, Slack, and ClickUp provisioning pipelines automatically whenever an opportunity transitions across pipeline stages.',
                  },
                ].map((card, idx) => {
                  const offsetClass =
                    idx === 1 ? 'md:mt-6' : idx === 2 ? 'md:mt-12' : 'md:mt-0'
                  return (
                    <div
                      key={card.file}
                      className={`sw-arch-float ${offsetClass}`}
                    >
                      <SpotlightCard
                        spotlightColor="#0219EA"
                        intensity={0.32}
                        borderGlow={0.95}
                        className="w-full !p-5 !rounded-2xl border border-[#0219EA]/45 font-mono min-w-0"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-2.5 mb-3">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                            </div>
                            <span className="text-[11px] text-[#4f6bff] truncate">
                              {card.file}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white min-w-0">
                            <span className="text-[#0219EA] select-none shrink-0">
                              $
                            </span>
                            <DecryptedText
                              text={card.cmd}
                              animateOn="view"
                              speed={35}
                              sequential
                              revealDirection="start"
                              scrambleColor="#0219EA"
                              loop={true}
                              loopDelay={4800 + idx * 1600}
                            />
                          </div>

                          <div className="relative mt-3 text-xs sm:text-[13px] text-blue-50/90 leading-relaxed">
                            <div
                              aria-hidden="true"
                              className="invisible select-none pointer-events-none"
                            >
                              &gt; {card.detail}
                            </div>
                            <TextType
                              as="div"
                              text={card.detail}
                              prefix="> "
                              prefixColor="#0219EA"
                              typingSpeed={14}
                              deletingSpeed={7}
                              initialDelay={180 + idx * 1350}
                              pauseDuration={3400 + idx * 900}
                              loop={true}
                              showCursor={true}
                              cursorStyle="block"
                              cursorColor="#0219EA"
                              cursorBlinkDuration={0.55}
                              className="absolute inset-0 text-blue-50/90"
                            />
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  )
                })}
              </div>
            </section>
          </AnimatedContent>

          {/* Direct Contact Glass Container */}
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.75}
            ease="power3.out"
            threshold={0.1}
            trigger="scroll"
            once={false}
          >
            <div
              className={`${GLASS_CONTAINER} p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Need a custom CRM, internal tool, or AI workflow built?
                </h3>
                <p className="text-sm text-neutral-300">
                  Let&apos;s architect and deploy your custom software application or automation pipeline.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <StarBorder
                  as="button"
                  type="button"
                  onClick={onOpenContact}
                  color="#0219EA"
                  trailColor="#3b55ff"
                  backgroundColor="rgba(2, 25, 234, 0.22)"
                  textColor="#ffffff"
                  borderColor="rgba(2, 25, 234, 0.55)"
                  duration={4}
                  radius={12}
                  glow={0.6}
                  hover="lap"
                  clickPulse
                  className="!px-5 !py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Email {profile.email}
                </StarBorder>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  )
}
