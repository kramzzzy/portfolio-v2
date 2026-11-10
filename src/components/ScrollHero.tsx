import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../data/portfolio'
import CountUp from './react-bits/CountUp'
import Crosshair from './react-bits/Crosshair'
import DecryptedText from './react-bits/DecryptedText'
import RotatingText from './react-bits/RotatingText'
import SpotlightCard from './react-bits/SpotlightCard'
import StaggeredMenu from './react-bits/StaggeredMenu'
import StarBorder from './react-bits/StarBorder'
import TechText from './react-bits/TechText'
import TextType from './react-bits/TextType'
import VideoTooltip from './VideoTooltip'

const TERMINAL_FILES = [
  '~/kramz/ai-workflow.sh',
  '~/kramz/llm-bridge.py',
  '~/kramz/web-platform.tsx',
  '~/kramz/ui-ux-engine.ts',
] as const

const CAPABILITY_META = [
  {
    phrases: [
      'Python • n8n • Make • Zapier',
      'Autonomous ETL Pipelines',
      'Zero-Touch CRM Workflows',
    ],
    accent: '#0219EA',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1.5" />
        <rect x="15" y="3" width="6" height="6" rx="1.5" />
        <rect x="9" y="15" width="6" height="6" rx="1.5" />
        <path d="M6 9v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
        <path d="M12 14v1" />
      </svg>
    ),
  },
  {
    phrases: [
      'OpenAI • Claude • REST APIs',
      'Custom AI Agents & RAG',
      'Multi-Model Orchestration',
    ],
    accent: '#0219EA',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    phrases: [
      'React • Next.js • TypeScript',
      'Full-Stack Cloud Platforms',
      'Scalable Web Architecture',
    ],
    accent: '#0219EA',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    phrases: [
      'Design Systems • Motion UI',
      'Interactive WebGL & GSAP',
      'High-Conversion Interfaces',
    ],
    accent: '#0219EA',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="9" y1="20" x2="9" y2="10" />
      </svg>
    ),
  },
] as const

const STAT_META = [
  {
    phrases: [
      'Since 2016 • Full-Stack',
      'AI & Software Operations',
      'Enterprise & Startups',
    ],
    bars: [38, 56, 72, 86, 100],
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
      </svg>
    ),
  },
  {
    phrases: [
      'Global Remote Delivery',
      'US • UK • AU • APAC',
      'End-to-End Execution',
    ],
    bars: [45, 68, 60, 88, 100],
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18" />
      </svg>
    ),
  },
  {
    phrases: [
      'AI Agents & Web Apps',
      'Production Cloud Scale',
      'Zero-Touch Workflows',
    ],
    bars: [42, 62, 78, 92, 100],
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
] as const

const TOTAL_FRAMES = 358
const AUTOPLAY_DURATION_SEC = 14.5 // ~24.7 fps across 358 frames
const IDLE_RESUME_MS = 1200 // Resume video playback 1.2s after scroll stops

const frameUrl = (index: number) =>
  `/frames/frame_${String(index).padStart(4, '0')}.webp`

const MENU_ITEMS = [
  { label: 'Home', ariaLabel: 'Go to top hero section', link: '#home' },
  { label: 'About', ariaLabel: 'View profile and core AI capabilities', link: '#about' },
  { label: 'Works', ariaLabel: 'Explore selected web and AI projects', link: '#works' },
  {
    label: 'Software Development',
    ariaLabel: 'Explore interactive software development and CRM sandbox',
    link: '/software',
  },
  { label: 'Stack', ariaLabel: 'View experience and engineering stack', link: '#experience' },
  { label: 'Contact', ariaLabel: 'Get in touch with Mark Anthony Ebio', link: '#contact' },
]

function smooth01(t: number) {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

function bandOpacity(
  progress: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number
) {
  if (progress < enterStart || progress > exitEnd) return 0
  if (progress < enterEnd) {
    return smooth01((progress - enterStart) / Math.max(0.001, enterEnd - enterStart))
  }
  if (progress > exitStart) {
    return smooth01(1 - (progress - exitStart) / Math.max(0.001, exitEnd - exitStart))
  }
  return 1
}

function itemStageStyle(
  progress: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number,
  enterY = 26,
  exitY = -22
) {
  const op = bandOpacity(progress, enterStart, enterEnd, exitStart, exitEnd)
  const isExiting = progress > exitStart
  const y = isExiting ? (1 - op) * exitY : (1 - op) * enterY
  const scale = 0.96 + 0.04 * op
  return {
    opacity: op,
    style: {
      opacity: op,
      transform: `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
      pointerEvents: (op > 0.2 ? 'auto' : 'none') as 'auto' | 'none',
    },
  }
}

interface ScrollHeroProps {
  onOpenContact?: () => void
  onOpenSoftware?: () => void
  isModalOpen?: boolean
  isLoading?: boolean
  onLoadProgress?: (loaded: number, total: number) => void
}

export default function ScrollHero({
  onOpenContact,
  onOpenSoftware,
  isModalOpen = false,
  isLoading = false,
  onLoadProgress,
}: ScrollHeroProps) {
  const { profile, services } = portfolioData
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isMutedRef = useRef(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const onLoadProgressRef = useRef(onLoadProgress)
  onLoadProgressRef.current = onLoadProgress
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  )

  // Shared mutable state for the 60fps render loop so autoplay & scroll hand off without jumps
  const engineRef = useRef({
    targetProgress: 0,
    smoothProgress: 0,
    lastScrollProgress: 0,
    lastInteractionTime: 0,
    isHeroInView: true,
    isVideoTooltipOpen: false,
    isModalOpen: false,
    isLoopResetting: false,
    loopResetElapsed: 0,
    hasSwappedToStart: false,
  })

  useEffect(() => {
    const paused = isModalOpen || isLoading
    engineRef.current.isModalOpen = paused
    if (paused) {
      engineRef.current.lastInteractionTime = performance.now()
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [isModalOpen, isLoading])

  const [progress, setProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [loopResetState, setLoopResetState] = useState<{
    active: boolean
    opacity: number
    percent: number
  }>({ active: false, opacity: 0, percent: 0 })
  const [loopCycle, setLoopCycle] = useState(0)

  const menuItems = MENU_ITEMS.map((item) => {
    if (item.label === 'Contact') return { ...item, onClick: onOpenContact }
    if (item.label === 'Software Development') return { ...item, onClick: onOpenSoftware }
    return item
  })

  const socialItems = [
    { label: 'GitHub', link: profile.socials.github },
    { label: 'LinkedIn', link: profile.socials.linkedin },
    { label: 'Resume / CV', link: profile.cvUrl },
  ]

  useEffect(() => {
    let cancelled = false
    const isMobile = window.innerWidth < 768
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean; effectiveType?: string }
    }
    const lowMem = (nav.deviceMemory ?? 8) <= 4
    const slowNet =
      Boolean(nav.connection?.saveData) ||
      nav.connection?.effectiveType === '2g' ||
      nav.connection?.effectiveType === 'slow-2g' ||
      nav.connection?.effectiveType === '3g'

    // Adaptive stride: 3 on phones/slow net (121 frames), 2 on tablets/4GB laptops (180 frames), 1 on desktop
    const stride = isMobile || slowNet ? 3 : lowMem ? 2 : 1

    // Progressive loading order: frame 1 -> coarse scrub (step 12) -> medium (step 3) -> even (step 2) -> fine
    const order: number[] = [1, TOTAL_FRAMES, 180]
    const seen = new Set<number>(order)

    const passes = stride === 3 ? [12, 3] : [12, 6, 2]
    for (const step of passes) {
      for (let i = 1; i <= TOTAL_FRAMES; i += step) {
        if (!seen.has(i)) {
          seen.add(i)
          order.push(i)
        }
      }
    }

    // Sync target for EntranceLoader: full 0%-100% coverage across the timeline (121 frames on phone, 180 on laptop)
    const syncTarget = order.length

    if (stride === 1) {
      for (let i = 1; i <= TOTAL_FRAMES; i += 1) {
        if (!seen.has(i)) {
          seen.add(i)
          order.push(i)
        }
      }
    }

    onLoadProgressRef.current?.(0, syncTarget)

    let cursor = 0
    let done = 0
    const concurrency = isMobile ? 10 : 18

    const loadNext = () => {
      if (cancelled || cursor >= order.length) return
      const frameIdx = order[cursor++]
      const img = new Image()
      img.decoding = 'async'
      img.src = frameUrl(frameIdx)
      img.onload = () => {
        if (cancelled) return
        imagesRef.current[frameIdx] = img
        done += 1
        if (done === 1 || done % 4 === 0 || done === syncTarget || done === order.length) {
          setLoadedCount(done)
        }
        if (done <= syncTarget && (done === 1 || done % 2 === 0 || done === syncTarget)) {
          onLoadProgressRef.current?.(done, syncTarget)
        }
        loadNext()
      }
      img.onerror = () => {
        if (cancelled) return
        done += 1
        if (done <= syncTarget) {
          onLoadProgressRef.current?.(done, syncTarget)
        }
        loadNext()
      }
    }

    for (let c = 0; c < concurrency; c++) {
      loadNext()
    }

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const HERO_SCRUB_PORTION = 0.78

    const computeScrollProgress = () => {
      const container = containerRef.current
      if (!container) return { raw: 0, scrub: 0, inView: true }
      const rect = container.getBoundingClientRect()
      const scrollable = Math.max(1, rect.height - window.innerHeight)
      const scrolled = -rect.top
      const inView = rect.bottom > 80 && rect.top < window.innerHeight
      const raw = Math.min(1, Math.max(0, scrolled / scrollable))
      const scrub = Math.min(1, Math.max(0, raw / HERO_SCRUB_PORTION))
      return {
        raw,
        scrub,
        inView,
      }
    }

    // Initialize scroll baseline
    const initial = computeScrollProgress()
    engineRef.current.lastScrollProgress = initial.scrub
    engineRef.current.targetProgress = initial.scrub
    engineRef.current.smoothProgress = initial.scrub
    engineRef.current.isHeroInView = initial.inView
    setScrollProgress(initial.raw)

    let rafId = 0
    let lastWidth = 0
    let lastHeight = 0
    let lastDrawnFrame = -1
    let lastTime = performance.now()

    const wakeLoop = () => {
      if (!rafId) {
        lastTime = performance.now()
        rafId = requestAnimationFrame(render)
      }
    }

    const onScroll = () => {
      const state = engineRef.current
      const { raw: nextRaw, scrub: nextScroll, inView } = computeScrollProgress()
      const wasInView = state.isHeroInView
      state.isHeroInView = inView
      if (inView && !wasInView) {
        wakeLoop()
      }

      setScrollProgress((prev) =>
        Math.abs(prev - nextRaw) > 0.0015 ? nextRaw : prev
      )

      const ds = nextScroll - state.lastScrollProgress
      state.lastScrollProgress = nextScroll
      if (Math.abs(ds) < 0.0001) {
        wakeLoop()
        return
      }

      state.lastInteractionTime = performance.now()
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
      if (state.isLoopResetting) {
        state.isLoopResetting = false
        state.loopResetElapsed = 0
        state.hasSwappedToStart = false
        setLoopResetState({ active: false, opacity: 0, percent: 0 })
      }

      if (ds > 0) {
        // Continue forward smoothly from whatever frame is currently showing
        const remainingScroll = Math.max(0.12, 1 - (nextScroll - ds))
        const remainingVisual = Math.max(0, 1 - state.targetProgress)
        const scale = Math.max(1, remainingVisual / remainingScroll)
        state.targetProgress =
          nextScroll >= 0.995
            ? 1
            : Math.min(1, state.targetProgress + ds * scale)
      } else {
        // Scrub backward smoothly toward 0 as user scrolls back to top
        const availableScroll = Math.max(0.12, nextScroll - ds)
        const scale = Math.max(1, state.targetProgress / availableScroll)
        state.targetProgress =
          nextScroll <= 0.005
            ? 0
            : Math.max(0, state.targetProgress + ds * scale)
      }
      wakeLoop()
    }

    let lastMouseX = -1
    let lastMouseY = -1
    const onMouseMove = (e: MouseEvent) => {
      const state = engineRef.current
      if (!state.isHeroInView || state.isModalOpen) return
      if (lastMouseX >= 0 && lastMouseY >= 0) {
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY)
        if (dist < 1.5) return
      }
      lastMouseX = e.clientX
      lastMouseY = e.clientY
      state.lastInteractionTime = performance.now()
      state.targetProgress = state.smoothProgress
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
      wakeLoop()
    }

    let audioUnlocked = false
    const unlockAudioOnGesture = () => {
      const audio = audioRef.current
      const state = engineRef.current
      if (!audio) return
      const idleMs = performance.now() - state.lastInteractionTime
      const canPlayNow =
        !isMutedRef.current &&
        state.isHeroInView &&
        !state.isVideoTooltipOpen &&
        !state.isModalOpen &&
        !state.isLoopResetting &&
        idleMs > IDLE_RESUME_MS &&
        state.lastScrollProgress < 0.98
      if (canPlayNow && audio.paused) {
        audioUnlocked = true
        const dur = audio.duration || AUTOPLAY_DURATION_SEC
        const targetTime = Math.min(dur - 0.05, Math.max(0, state.smoothProgress * dur))
        if (Math.abs(audio.currentTime - targetTime) > 0.45) {
          audio.currentTime = targetTime
        }
        audio.play().catch(() => {})
      } else if (!audioUnlocked) {
        const prevMuted = audio.muted
        audio.muted = true
        audio
          .play()
          .then(() => {
            audio.pause()
            audio.muted = prevMuted
            audioUnlocked = true
          })
          .catch(() => {
            audio.muted = prevMuted
          })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('pointerdown', unlockAudioOnGesture, { passive: true })
    window.addEventListener('keydown', unlockAudioOnGesture, { passive: true })
    window.addEventListener('touchstart', unlockAudioOnGesture, { passive: true })

    const findNearestImage = (frameIndex: number): HTMLImageElement | null => {
      const imgs = imagesRef.current
      if (imgs[frameIndex]) return imgs[frameIndex]
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (frameIndex - offset >= 1 && imgs[frameIndex - offset]) {
          return imgs[frameIndex - offset]
        }
        if (frameIndex + offset <= TOTAL_FRAMES && imgs[frameIndex + offset]) {
          return imgs[frameIndex + offset]
        }
      }
      return null
    }

    const render = (now: number) => {
      rafId = 0
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000))
      lastTime = now

      const state = engineRef.current
      const idleMs = now - state.lastInteractionTime
      const shouldAutoplay =
        state.isHeroInView &&
        !state.isVideoTooltipOpen &&
        !state.isModalOpen &&
        idleMs > IDLE_RESUME_MS &&
        state.lastScrollProgress < 0.98

      const LOOP_RESET_DURATION = 1.25

      if (state.isLoopResetting) {
        if (!shouldAutoplay) {
          state.isLoopResetting = false
          state.loopResetElapsed = 0
          state.hasSwappedToStart = false
          setLoopResetState({ active: false, opacity: 0, percent: 0 })
        } else {
          state.loopResetElapsed += dt
          const t = Math.min(1, state.loopResetElapsed / LOOP_RESET_DURATION)

          // Swap to Frame 1 behind the opaque loading curtain at t >= 0.5
          if (t >= 0.5 && !state.hasSwappedToStart) {
            state.hasSwappedToStart = true
            state.targetProgress = 0
            state.smoothProgress = 0
            lastDrawnFrame = -1
            setLoopCycle((c) => c + 1)
          }

          const overlayOpacity =
            t < 0.36
              ? t / 0.36
              : t < 0.62
                ? 1
                : Math.max(0, 1 - (t - 0.62) / 0.38)
          const barPercent = Math.min(100, Math.round((t / 0.65) * 100))

          setLoopResetState({
            active: true,
            opacity: overlayOpacity,
            percent: barPercent,
          })

          if (t >= 1) {
            state.isLoopResetting = false
            state.loopResetElapsed = 0
            state.hasSwappedToStart = false
            setLoopResetState({ active: false, opacity: 0, percent: 0 })
          }
        }
      } else if (shouldAutoplay) {
        const next = state.targetProgress + dt / AUTOPLAY_DURATION_SEC
        if (next >= 1) {
          // Trigger seamless end-of-loop loading transition before restarting from Frame 1
          state.targetProgress = 1
          state.smoothProgress = 1
          state.isLoopResetting = true
          state.loopResetElapsed = 0
          state.hasSwappedToStart = false
          setLoopResetState({ active: true, opacity: 0.05, percent: 0 })
        } else {
          state.targetProgress = next
        }
      }

      // Sync Hero soundtrack: ONLY play during active Hero autoplay; pause immediately when scrolling or resetting
      const audio = audioRef.current
      if (audio) {
        if (
          shouldAutoplay &&
          !state.isLoopResetting &&
          !isMutedRef.current
        ) {
          const dur = audio.duration || AUTOPLAY_DURATION_SEC
          const expectedTime = Math.min(
            Math.max(0, dur - 0.05),
            Math.max(0, state.smoothProgress * dur)
          )
          if (Math.abs(audio.currentTime - expectedTime) > 0.45) {
            audio.currentTime = expectedTime
          }
          if (audio.paused) {
            audio.play().catch(() => {})
          }
        } else if (!audio.paused) {
          audio.pause()
        }
      }

      const diff = state.targetProgress - state.smoothProgress
      state.smoothProgress =
        Math.abs(diff) < 0.0004 || Math.abs(diff) > 0.65
          ? state.targetProgress
          : state.smoothProgress + diff * (shouldAutoplay ? 0.25 : 0.16)

      const frameIdx = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(1 + state.smoothProgress * (TOTAL_FRAMES - 1)))
      )

      // Cap internal canvas buffer to source 1440px resolution to avoid costly 4K upscaling on mobile/Retina
      const rawDpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5)
      const scaleCap = Math.min(1, 1440 / Math.max(1, window.innerWidth * rawDpr))
      const effDpr = rawDpr * scaleCap
      const width = Math.max(1, Math.floor(window.innerWidth * effDpr))
      const height = Math.max(1, Math.floor(window.innerHeight * effDpr))

      const resized = width !== lastWidth || height !== lastHeight
      if (resized) {
        canvas.width = width
        canvas.height = height
        lastWidth = width
        lastHeight = height
      }

      const img = findNearestImage(frameIdx)
      if (img && (frameIdx !== lastDrawnFrame || resized)) {
        lastDrawnFrame = frameIdx
        const imgRatio = img.naturalWidth / img.naturalHeight
        const canvasRatio = width / height

        let drawW = width
        let drawH = height
        let offsetX = 0
        let offsetY = 0

        if (canvasRatio > imgRatio) {
          drawW = width
          drawH = width / imgRatio
          offsetY = (height - drawH) * 0.35
        } else {
          drawH = height
          drawW = height * imgRatio
          offsetX = (width - drawW) * 0.5
        }

        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
      }

      setProgress((prev) =>
        Math.abs(prev - state.smoothProgress) > 0.002
          ? state.smoothProgress
          : prev
      )

      // Sleep the 60fps loop when the hero section is scrolled out of view and settled
      if (state.isHeroInView || Math.abs(state.targetProgress - state.smoothProgress) > 0.0005) {
        rafId = requestAnimationFrame(render)
      }
    }

    rafId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('pointerdown', unlockAudioOnGesture)
      window.removeEventListener('keydown', unlockAudioOnGesture)
      window.removeEventListener('touchstart', unlockAudioOnGesture)
    }
  }, [loadedCount])

  const jumpToProgress = (target: number) => {
    const container = containerRef.current
    const state = engineRef.current
    state.lastInteractionTime = performance.now()
    state.targetProgress = target
    if (!container) return
    const top = container.offsetTop
    const scrollable = Math.max(1, container.offsetHeight - window.innerHeight)
    state.lastScrollProgress = target
    window.scrollTo({
      top: top + scrollable * (target * 0.78),
      behavior: 'smooth',
    })
  }

  // Opacity envelopes for the 3 acts (container bounds) + per-item staggered show/out
  const act1Opacity =
    progress <= 0.19
      ? 1
      : Math.max(0, 1 - (progress - 0.19) / (0.37 - 0.19))
  const act2Opacity = bandOpacity(progress, 0.28, 0.34, 0.68, 0.74)
  const act3Opacity =
    progress < 0.64
      ? 0
      : Math.min(1, (progress - 0.64) / (0.71 - 0.64))

  // In-place cross-dissolve envelope (78% -> 96% of sticky hero scroll, reaching 100% before un-pinning)
  const scrollExitProgress = smooth01((scrollProgress - 0.78) / 0.18)
  const canvasExitProgress = smooth01((scrollExitProgress - 0.08) / 0.86)

  // Staggered initial/loop entrance for Act I items so they don't all pop in at once
  const [act1Entered, setAct1Entered] = useState(false)
  useEffect(() => {
    if (isLoading) {
      setAct1Entered(false)
      return
    }
    setAct1Entered(false)
    const id = window.requestAnimationFrame(() => {
      setAct1Entered(true)
    })
    return () => window.cancelAnimationFrame(id)
  }, [isLoading, loopCycle])

  const getAct1ItemStyle = (idx: number, totalItems = 6) => {
    const exitStart = 0.20 + idx * 0.02
    const exitEnd = exitStart + 0.065
    const exitOp =
      progress <= exitStart
        ? 1
        : smooth01(1 - (progress - exitStart) / (exitEnd - exitStart))
    const shown = act1Entered ? exitOp : 0
    const yOffset = !act1Entered ? 26 : (1 - exitOp) * -22
    const scale = 0.96 + 0.04 * shown
    const delayMs = progress <= 0.18 ? idx * 120 : (totalItems - 1 - idx) * 35
    return {
      opacity: shown,
      transform: `translate3d(0, ${yOffset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
      transition:
        progress <= 0.18
          ? `opacity 520ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms, transform 520ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`
          : 'none',
      pointerEvents: (shown > 0.2 ? 'auto' : 'none') as 'auto' | 'none',
    }
  }

  const getAct3ItemStyle = (idx: number) => {
    // Staggered entrance (0.65 -> 0.83) and staggered in-place scroll-exit (0.0 -> 0.76 of scrollExitProgress)
    const enterStart = 0.65 + idx * 0.028
    const enterEnd = enterStart + 0.058
    const enterOp =
      progress <= enterStart
        ? 0
        : progress >= enterEnd
          ? 1
          : smooth01((progress - enterStart) / (enterEnd - enterStart))

    const exitStart = idx * 0.1
    const exitEnd = exitStart + 0.36
    const scrollExitOp =
      scrollExitProgress <= exitStart
        ? 1
        : scrollExitProgress >= exitEnd
          ? 0
          : smooth01(1 - (scrollExitProgress - exitStart) / (exitEnd - exitStart))

    const op = enterOp * scrollExitOp
    const y = (1 - enterOp) * 28 + (1 - scrollExitOp) * -32
    const scale = 0.95 + 0.05 * op
    return {
      opacity: op,
      style: {
        opacity: op,
        transform: `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
        pointerEvents: (op > 0.2 ? 'auto' : 'none') as 'auto' | 'none',
      },
    }
  }

  const isAct2Active = act2Opacity > 0.12
  const [act2RunId, setAct2RunId] = useState(0)

  useEffect(() => {
    if (isAct2Active) {
      setAct2RunId((prev) => prev + 1)
    }
  }, [isAct2Active])

  const isAct3Active = act3Opacity > 0.12
  const [act3RunId, setAct3RunId] = useState(0)

  useEffect(() => {
    if (isAct3Active) {
      setAct3RunId((prev) => prev + 1)
    }
  }, [isAct3Active])

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-[460vh] w-full bg-neutral-950 select-none"
    >
      {/* Floating Centered Logo + Right-Side StaggeredMenu */}
      <StaggeredMenu
        isFixed={true}
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#111111"
        changeMenuColorOnOpen={true}
        colors={['#0219EA', '#1d4ed8']}
        logoUrl={profile.logoUrl}
        accentColor="#0219EA"
      />

      {/* Sticky Viewport Stage */}
      <div
        ref={stageRef}
        style={{
          pointerEvents: canvasExitProgress > 0.85 ? 'none' : 'auto',
        }}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden"
      >
        <audio
          ref={audioRef}
          src="/audio/hero-soundtrack.mp3"
          preload="auto"
          className="hidden"
        />

        {/* Icon-Only Hero Soundtrack Toggle (Bottom-Left) */}
        <button
          type="button"
          onClick={() => {
            const nextMuted = !isMutedRef.current
            isMutedRef.current = nextMuted
            setIsAudioMuted(nextMuted)
            const audio = audioRef.current
            if (!audio) return
            if (nextMuted) {
              audio.pause()
            } else {
              const dur = audio.duration || AUTOPLAY_DURATION_SEC
              audio.currentTime = Math.min(
                Math.max(0, dur - 0.05),
                Math.max(0, engineRef.current.smoothProgress * dur)
              )
              audio.play().catch(() => {})
            }
          }}
          aria-label={isAudioMuted ? 'Unmute hero soundtrack' : 'Mute hero soundtrack'}
          title={isAudioMuted ? 'Unmute Hero Audio' : 'Mute Hero Audio'}
          style={{ opacity: Math.max(0, 1 - canvasExitProgress * 1.4) }}
          className="absolute bottom-5 left-4 sm:bottom-7 sm:left-7 z-40 flex h-9 w-9 items-center justify-center rounded-xl text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          {isAudioMuted ? (
            <svg
              className="h-4 w-4 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-[#4f6bff]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
        {/* Hero-Only Interactive Cyber Crosshair */}
        <Crosshair
          containerRef={stageRef}
          color="#0219EA"
          targetEffect="lock"
          thickness={1}
          opacity={0.85 * Math.max(0, 1 - scrollExitProgress * 1.4)}
          smoothing={0.35}
          showCoordinates
        />

        {/* Autoplay + Scroll-Scrubbed Operating Frame Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            transform:
              canvasExitProgress > 0.001
                ? `scale(${(1 + canvasExitProgress * 0.06).toFixed(4)})`
                : undefined,
            opacity: 1 - canvasExitProgress,
            filter:
              canvasExitProgress > 0.01
                ? `blur(${(canvasExitProgress * 8).toFixed(1)}px)`
                : undefined,
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 72%, transparent 97%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 72%, transparent 97%)',
          }}
          className="absolute inset-0 h-full w-full block object-cover"
        />

        {/* Controlled Vignette & Scrims to protect HUD Typography without hiding the subject */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 1 - canvasExitProgress,
            background:
              'radial-gradient(circle at 50% 42%, transparent 28%, rgba(5, 8, 15, 0.52) 78%, rgba(5, 8, 15, 0.92) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950/60 to-transparent" />

        {/* Seamless Loop-End Reboot Loading Overlay */}
        {loopResetState.active && (
          <div
            aria-hidden="true"
            style={{ opacity: loopResetState.opacity }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950/92 backdrop-blur-md"
          >
            <div className="relative flex flex-col items-center gap-4">
              {/* Dual-Ring Cybernetic Spinner */}
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-[#0219EA]/30" />
                <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0219EA] border-r-[#3b55ff] animate-spin" />
                <span className="absolute inset-2 rounded-full border border-transparent border-b-[#4f6bff]/80 animate-spin [animation-direction:reverse] [animation-duration:900ms]" />
                <span className="h-2 w-2 rounded-full bg-[#0219EA] shadow-[0_0_12px_#0219EA]" />
              </div>

              <div className="w-44 space-y-1.5">
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#0219EA] transition-[width] duration-75 ease-out"
                    style={{ width: `${loopResetState.percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em]">
                  <span className="text-neutral-400">Syncing Loop</span>
                  <span className="text-[#4f6bff] tabular-nums font-semibold">
                    {String(loopResetState.percent).padStart(3, '0')}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subtle Corner Cyber Brackets */}
        <div
          style={{ opacity: Math.max(0, 1 - scrollExitProgress * 1.6) }}
          className="pointer-events-none absolute inset-4 sm:inset-6 top-4 sm:top-5 bottom-6"
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#0219EA]/80 rounded-tl-lg" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#0219EA]/80 rounded-br-lg" />
        </div>

        {/* ============================================================
            FLUSH EDGE-DOCKED SYSTEM TELEMETRY RAILS (OPTION A)
           ============================================================ */}
        {(() => {
          const pct = Math.min(100, Math.max(0, Math.round(progress * 100)))
          const currentFrame = Math.min(
            TOTAL_FRAMES,
            Math.max(1, Math.round(1 + progress * (TOTAL_FRAMES - 1)))
          )
          const actLabel =
            progress < 0.31 ? 'ACT 01' : progress < 0.66 ? 'ACT 02' : 'ACT 03'
          const ringCircumference = 113.1 // 2 * Math.PI * 18
          const ringOffset = ringCircumference * (1 - progress)
          const aiCorePct = 92 + Math.round(Math.sin(progress * Math.PI * 4) * 4)
          const aiCoreCircumference = 100.5 // 2 * Math.PI * 16
          const aiCoreOffset = aiCoreCircumference * (1 - aiCorePct / 100)
          const livePingMs = 26 + Math.round(Math.abs(Math.sin(progress * 18)) * 6)
          const railOpacity = Math.max(0, 1 - scrollExitProgress * 1.5)
          const signalSeeds = [78, 96, 58, 86, 100, 66, 48, 90, 76, 54, 92, 64]
          const nodeSeeds = [65, 90, 55, 100, 78]

          return (
            <>
              {/* LEFT FLUSH EDGE DOCK: Telemetry Spine, Signal Equalizer & Frame Counter */}
              <div
                style={{ opacity: railOpacity }}
                className="hidden lg:flex pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 z-30 w-[66px] flex-col items-center gap-4 py-4 pr-2.5 pl-2 rounded-r-[18px] border-t border-r border-b border-[#4f6bff]/35 border-l-[3px] border-l-[#0219EA] bg-[linear-gradient(90deg,rgba(2,25,234,0.22)_0%,rgba(8,12,24,0.84)_100%)] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.16),8px_0_32px_rgba(0,0,0,0.65),0_0_24px_rgba(2,25,234,0.28)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    jumpToProgress(
                      progress < 0.31 ? 0.5 : progress < 0.66 ? 0.85 : 0
                    )
                  }
                  title="Jump to next Hero Act"
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                >
                  <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke="#0219EA"
                      strokeWidth="3"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 22 22)"
                      className="transition-[stroke-dashoffset] duration-150 ease-out"
                    />
                    <text
                      x="22"
                      y="25"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="font-mono text-[10px] font-bold"
                    >
                      {pct}%
                    </text>
                  </svg>
                  <span className="font-mono text-[9px] tracking-[0.08em] text-[#4f6bff] group-hover:text-white transition-colors">
                    {actLabel}
                  </span>
                </button>

                <div className="h-px w-9 bg-white/15" />

                {/* Flush-Left 12-Bar Animated Signal Equalizer */}
                <div className="flex w-full flex-col items-start gap-1.5 pl-0.5">
                  <span className="self-center font-mono text-[8px] tracking-[0.1em] text-slate-400">
                    SIGNAL
                  </span>
                  <div className="flex w-[44px] flex-col gap-1 py-1">
                    {signalSeeds.map((seed, idx) => {
                      const wave = Math.sin(progress * 28 + idx * 0.85) * 18
                      const widthPct = Math.min(
                        100,
                        Math.max(24, Math.round(seed + wave))
                      )
                      return (
                        <div
                          key={idx}
                          className="h-1 w-full overflow-hidden rounded-r-full bg-white/[0.08]"
                        >
                          <div
                            style={{ width: `${widthPct}%` }}
                            className={`h-full rounded-r-full shadow-[0_0_8px_#0219EA] transition-[width] duration-150 ${
                              idx % 2 === 0 ? 'bg-[#0219EA]' : 'bg-[#4f6bff]'
                            }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="h-px w-9 bg-white/15" />

                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-mono text-[8px] text-slate-400">
                    FRAME
                  </span>
                  <span className="font-mono text-[11px] font-bold tabular-nums text-white">
                    {String(currentFrame).padStart(4, '0')}
                  </span>
                  <span className="font-mono text-[8px] text-[#4f6bff]">
                    60 FPS
                  </span>
                </div>
              </div>

              {/* RIGHT FLUSH EDGE DOCK: AI Core Gauge, Live Ping Sparkline & Node Cluster */}
              <div
                style={{ opacity: railOpacity }}
                className="hidden lg:flex pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-30 w-[66px] flex-col items-center gap-3.5 py-4 pl-2.5 pr-2 rounded-l-[18px] border-t border-l border-b border-[#4f6bff]/35 border-r-[3px] border-r-[#0219EA] bg-[linear-gradient(270deg,rgba(2,25,234,0.22)_0%,rgba(8,12,24,0.84)_100%)] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.16),-8px_0_32px_rgba(0,0,0,0.65),0_0_24px_rgba(2,25,234,0.28)]"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[8px] tracking-[0.08em] text-slate-400">
                    AI CORE
                  </span>
                  <svg width="42" height="42" viewBox="0 0 42 42">
                    <circle
                      cx="21"
                      cy="21"
                      r="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2.8"
                    />
                    <circle
                      cx="21"
                      cy="21"
                      r="16"
                      fill="none"
                      stroke="#4f6bff"
                      strokeWidth="2.8"
                      strokeDasharray={aiCoreCircumference}
                      strokeDashoffset={aiCoreOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 21 21)"
                      className="transition-[stroke-dashoffset] duration-200 ease-out"
                    />
                    <text
                      x="21"
                      y="24"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="font-mono text-[9.5px] font-bold"
                    >
                      {aiCorePct}%
                    </text>
                  </svg>
                  <span className="font-mono text-[8px] text-[#4f6bff]">
                    ONLINE
                  </span>
                </div>

                <div className="h-px w-9 bg-white/15" />

                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[8px] text-slate-400">
                    PING
                  </span>
                  <svg width="44" height="26" viewBox="0 0 44 26">
                    <polyline
                      fill="none"
                      stroke="#0219EA"
                      strokeWidth="2"
                      points={`2,${16 + Math.round(Math.sin(progress * 20) * 4)} 9,${11 + Math.round(Math.cos(progress * 22) * 3)} 16,${15 + Math.round(Math.sin(progress * 25) * 4)} 23,${7 + Math.round(Math.cos(progress * 18) * 3)} 30,${13 + Math.round(Math.sin(progress * 24) * 3)} 37,${8 + Math.round(Math.cos(progress * 20) * 3)} 42,${11 + Math.round(Math.sin(progress * 16) * 3)}`}
                    />
                    <circle
                      cx="42"
                      cy={11 + Math.round(Math.sin(progress * 16) * 3)}
                      r="2.5"
                      fill="#4f6bff"
                    />
                  </svg>
                  <span className="font-mono text-[10px] font-bold tabular-nums text-white">
                    {livePingMs}ms
                  </span>
                </div>

                <div className="h-px w-9 bg-white/15" />

                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[8px] text-slate-400">
                    NODES
                  </span>
                  <div className="flex h-[34px] items-end gap-[3px] pt-1">
                    {nodeSeeds.map((seed, idx) => {
                      const mod = Math.cos(progress * 24 + idx * 1.1) * 16
                      const hPct = Math.min(
                        100,
                        Math.max(35, Math.round(seed + mod))
                      )
                      return (
                        <div
                          key={idx}
                          style={{ height: `${hPct}%` }}
                          className={`w-[5px] rounded-[2px] transition-[height] duration-150 ${
                            idx % 2 === 0 ? 'bg-[#0219EA]' : 'bg-[#4f6bff]'
                          }`}
                        />
                      )
                    })}
                  </div>
                  <span className="font-mono text-[9px] text-[#4f6bff]">
                    99.9%
                  </span>
                </div>
              </div>
            </>
          )
        })()}

        {/* ============================================================
            ACT I (0% - 33%): Front-Facing Code & Neural HUDs
           ============================================================ */}
        <div
          style={{
            visibility: act1Opacity > 0.01 ? 'visible' : 'hidden',
            pointerEvents: act1Opacity > 0.1 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-20 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-16 pb-4 sm:pt-20 sm:pb-12 flex flex-col justify-end"
        >
          {/* Bottom-aligned split layout leaving center subject & upper holograms clear */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 items-end">
            <div className="lg:col-span-7 space-y-2 sm:space-y-4">
              <div className="space-y-1">
                {/* Bold Interactive TechText Name Wordmark (Stagger Slot 0) */}
                <div
                  style={getAct1ItemStyle(0)}
                  className="relative -ml-[2%] w-[102%] h-8 sm:-ml-[5%] sm:w-[105%] sm:h-24 lg:h-28"
                >
                  <TechText
                    key={isLoading ? 'loading' : `ready-${loopCycle}`}
                    text="MARK ANTHONY EBIO"
                    fontWeight={800}
                    fontSize={92}
                    letterSpacing={-0.03}
                    align="left"
                    color="#ffffff"
                    accentColor="#0219EA"
                    reveal="letter"
                    dashLength={4}
                    dashGap={2}
                    strokeWidth={1.6}
                    specks={15}
                    intro="type"
                    introDuration={1.8}
                    clickKick
                    draggable
                    sweep
                    guides={false}
                  />
                </div>

                {/* Heading, Bio & CTAs Block (Stagger Slot 1) */}
                <div
                  style={getAct1ItemStyle(1)}
                  className="border-l-2 border-[#0219EA] pl-3 sm:pl-5 space-y-1.5 sm:space-y-3"
                >
                  <h1 className="text-lg sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-white leading-[1.15] sm:leading-[1.2] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                    <span className="block text-white">Autonomous</span>
                    <RotatingText
                      texts={[
                        'AI Systems & Web Engineering.',
                        'Workflow & Pipeline Automation.',
                        'LLM Agents & API Integrations.',
                        'Full-Stack Software Platforms.',
                      ]}
                      splitBy="words"
                      effect="slide"
                      direction="up"
                      rotationInterval={2600}
                      staggerDuration={0.05}
                      staggerFrom="first"
                      mainClassName="text-[#0219EA] drop-shadow-[0_0_20px_rgba(59,85,255,0.65)] overflow-hidden py-0.5"
                    />
                  </h1>

                  <p className="text-xs sm:text-[15px] text-neutral-200/90 max-w-xl leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none drop-shadow">
                    I build custom AI agents, end-to-end automated workflows,
                    and scalable React &amp; Next.js software platforms that
                    connect CRMs, LLMs, and cloud pipelines without manual
                    bottlenecks.
                  </p>

                  <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-3 pt-0.5 sm:pt-1">
                    <StarBorder
                      as="button"
                      type="button"
                      onClick={() => onOpenContact?.()}
                      color="#0219EA"
                      trailColor="#3b55ff"
                      backgroundColor="rgba(2, 25, 234, 0.28)"
                      textColor="#ffffff"
                      borderColor="rgba(2, 25, 234, 0.65)"
                      duration={4}
                      direction="clockwise"
                      stars={1}
                      trailLength={0.3}
                      thickness={1}
                      radius={12}
                      glow={0.75}
                      hover="lap"
                      sparkle={false}
                      clickPulse
                      theme="dark"
                      className="!px-2.5 !py-1.5 sm:!px-5 sm:!py-2.5 text-[11px] sm:text-sm font-semibold tracking-wide whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1 sm:gap-2">
                        <span>Initialize Project</span>
                        <span className="text-[#4f6bff]">↗</span>
                      </span>
                    </StarBorder>

                    <StarBorder
                      as="button"
                      type="button"
                      onClick={() => jumpToProgress(0.5)}
                      color="#0219EA"
                      trailColor="#3b55ff"
                      backgroundColor="rgba(15, 23, 42, 0.42)"
                      textColor="#f1f5f9"
                      borderColor="rgba(2, 25, 234, 0.45)"
                      duration={4}
                      direction="clockwise"
                      stars={1}
                      trailLength={0.3}
                      thickness={1}
                      radius={12}
                      glow={0.65}
                      hover="lap"
                      sparkle={false}
                      clickPulse
                      theme="dark"
                      className="!px-2.5 !py-1.5 sm:!px-5 sm:!py-2.5 text-[11px] sm:text-sm font-medium whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1 sm:gap-2">
                        <span>Inspect AI Console</span>
                        <span className="text-[#4f6bff]">↓</span>
                      </span>
                    </StarBorder>

                    <VideoTooltip
                      videoSrc="/videos/AI_Video.mp4"
                      emailHref="#works"
                      align="center"
                      onOpenChange={(open) => {
                        engineRef.current.isVideoTooltipOpen = open
                        engineRef.current.lastInteractionTime = performance.now()
                      }}
                    >
                      {({ open, toggle }) => (
                        <StarBorder
                          as="button"
                          type="button"
                          onClick={toggle}
                          aria-expanded={open}
                          color="#0219EA"
                          trailColor="#3b55ff"
                          backgroundColor="rgba(2, 25, 234, 0.18)"
                          textColor="#f8fafc"
                          borderColor="rgba(2, 25, 234, 0.55)"
                          duration={4}
                          direction="clockwise"
                          stars={1}
                          trailLength={0.3}
                          thickness={1}
                          radius={12}
                          glow={0.7}
                          hover="lap"
                          sparkle={false}
                          clickPulse
                          theme="dark"
                          className="!px-2.5 !py-1.5 sm:!px-5 sm:!py-2.5 text-[11px] sm:text-sm font-medium whitespace-nowrap"
                        >
                          <span className="inline-flex items-center gap-1 sm:gap-2">
                            <span>Sample Work</span>
                            <span className="text-[#4f6bff]">
                              {open ? '✕' : '▶'}
                            </span>
                          </span>
                        </StarBorder>
                      )}
                    </VideoTooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2x2 Interactive Glass Bento Tiles (Stagger Slots 2..5) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2 sm:gap-3">
              {services.map((svc, idx) => {
                const meta = CAPABILITY_META[idx % CAPABILITY_META.length]
                return (
                  <div
                    key={svc.id}
                    style={getAct1ItemStyle(idx + 2)}
                    className="flex"
                  >
                    <SpotlightCard
                      spotlightColor={meta.accent}
                      intensity={0.32}
                      borderGlow={0.95}
                      onClick={() => jumpToProgress(0.5)}
                      data-crosshair-target
                      className="group w-full !p-2.5 sm:!p-4 !rounded-xl sm:!rounded-2xl border border-white/15 cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 flex flex-col justify-between gap-1.5 sm:gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl border border-[#0219EA]/55 bg-[#0219EA]/25 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_16px_rgba(2,25,234,0.35)] group-hover:border-[#0219EA] group-hover:bg-[#0219EA]/40 transition-colors">
                          {meta.icon}
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono text-white/45 group-hover:text-[#4f6bff] transition-colors">
                          0{idx + 1} ↗
                        </span>
                      </div>

                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <h3 className="text-[11px] sm:text-[13px] font-semibold text-white leading-tight sm:leading-snug truncate sm:whitespace-normal group-hover:text-blue-100 transition-colors">
                          <DecryptedText
                            text={svc.label}
                            animateOn="view"
                            loop={true}
                            loopDelay={3400 + idx * 800}
                            speed={38}
                            sequential
                            revealDirection="start"
                            scrambleColor="#0219EA"
                          />
                        </h3>
                        <div className="text-[10px] sm:text-[11px] font-mono text-[#4f6bff] h-3.5 sm:h-4 overflow-hidden">
                          <TextType
                            as="div"
                            text={[...meta.phrases]}
                            typingSpeed={36}
                            deletingSpeed={22}
                            pauseDuration={1900 + idx * 350}
                            initialDelay={idx * 250}
                            loop={true}
                            showCursor={true}
                            cursorStyle="block"
                            cursorColor="#0219EA"
                            className="truncate text-[#4f6bff]"
                          />
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            ACT II (33% - 68%): Turned to the Holographic Command Console
           ============================================================ */}
        <div
          style={{
            visibility: act2Opacity > 0.01 ? 'visible' : 'hidden',
            pointerEvents: act2Opacity > 0.1 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-20 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-16 pb-5 sm:pt-20 sm:pb-20 flex flex-col justify-between"
        >
          {/* Top Center Command Header (Enters & Exits First) */}
          <div
            style={itemStageStyle(progress, 0.285, 0.345, 0.585, 0.645).style}
            className="text-center max-w-xl mx-auto"
          >
            <h2 className="text-lg sm:text-3xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              Orchestrating AI Agents, APIs &amp; Full-Stack Web Systems
            </h2>
          </div>

          {/* Left & Right Wing Terminal Panels framing Mark's back at the console */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-2 sm:gap-5 items-stretch md:items-end">
            <div className="md:col-span-5 grid grid-cols-1 gap-2 sm:gap-3 min-w-0">
              {services.slice(0, 2).map((svc, idx) => {
                const orderIdx = idx * 2 // 0, 2
                const stage = itemStageStyle(
                  progress,
                  0.31 + orderIdx * 0.028,
                  0.37 + orderIdx * 0.028,
                  0.595 + orderIdx * 0.024,
                  0.655 + orderIdx * 0.024
                )
                const cardActive = stage.opacity > 0.12
                return (
                  <div key={svc.id} style={stage.style} className="flex min-w-0">
                    <SpotlightCard
                      spotlightColor="#0219EA"
                      intensity={0.32}
                      borderGlow={0.95}
                      className="w-full !p-2.5 sm:!p-5 !rounded-xl sm:!rounded-2xl border border-[#0219EA]/45 font-mono min-w-0"
                    >
                      {/* Terminal Window Chrome */}
                      <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-1 mb-1 sm:pb-2 sm:mb-2.5">
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500/80" />
                          <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-400/80" />
                          <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400/80" />
                        </div>
                        <span className="text-[9px] sm:text-[11px] text-[#4f6bff] truncate">
                          {TERMINAL_FILES[idx]}
                        </span>
                      </div>

                      {/* Terminal Command Header */}
                      <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-base font-bold text-white min-w-0">
                        <span className="text-[#0219EA] select-none shrink-0">$</span>
                        <span className="truncate sm:whitespace-normal">
                          {cardActive ? (
                            <DecryptedText
                              key={`cmd-${svc.id}-${act2RunId}`}
                              text={svc.label}
                              animateOn="view"
                              speed={35}
                              sequential
                              revealDirection="start"
                              scrambleColor="#0219EA"
                            />
                          ) : (
                            <span>{svc.label}</span>
                          )}
                        </span>
                      </div>

                      {/* Terminal Streaming Output */}
                      <div className="relative mt-1 sm:mt-1.5 text-[10px] sm:text-[13px] text-blue-50/90 leading-snug sm:leading-relaxed max-h-11 sm:max-h-none overflow-hidden">
                        <div
                          aria-hidden="true"
                          className="invisible select-none pointer-events-none"
                        >
                          &gt; {svc.description}
                        </div>
                        {cardActive && (
                          <TextType
                            key={`out-${svc.id}-${act2RunId}`}
                            as="div"
                            text={svc.description}
                            prefix="> "
                            prefixColor="#0219EA"
                            typingSpeed={13}
                            initialDelay={120}
                            loop={false}
                            showCursor={true}
                            cursorStyle="block"
                            cursorColor="#0219EA"
                            cursorBlinkDuration={0.55}
                            className="absolute inset-0 text-blue-50/90"
                          />
                        )}
                      </div>
                    </SpotlightCard>
                  </div>
                )
              })}
            </div>

            {/* Center Spacer keeps Mark's glowing circuit jacket unobstructed */}
            <div className="hidden md:block md:col-span-2" />

            <div className="md:col-span-5 grid grid-cols-1 gap-2 sm:gap-3 min-w-0">
              {services.slice(2, 4).map((svc, idx) => {
                const orderIdx = idx * 2 + 1 // 1, 3
                const stage = itemStageStyle(
                  progress,
                  0.31 + orderIdx * 0.028,
                  0.37 + orderIdx * 0.028,
                  0.595 + orderIdx * 0.024,
                  0.655 + orderIdx * 0.024
                )
                const cardActive = stage.opacity > 0.12
                return (
                  <div key={svc.id} style={stage.style} className="flex min-w-0">
                    <SpotlightCard
                      spotlightColor="#0219EA"
                      intensity={0.32}
                      borderGlow={0.95}
                      className="w-full !p-2.5 sm:!p-5 !rounded-xl sm:!rounded-2xl border border-[#0219EA]/45 font-mono min-w-0"
                    >
                      {/* Terminal Window Chrome */}
                      <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-1 mb-1 sm:pb-2 sm:mb-2.5">
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500/80" />
                          <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-400/80" />
                          <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400/80" />
                        </div>
                        <span className="text-[9px] sm:text-[11px] text-[#4f6bff] truncate">
                          {TERMINAL_FILES[idx + 2]}
                        </span>
                      </div>

                      {/* Terminal Command Header */}
                      <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-base font-bold text-white min-w-0">
                        <span className="text-[#0219EA] select-none shrink-0">$</span>
                        <span className="truncate sm:whitespace-normal">
                          {cardActive ? (
                            <DecryptedText
                              key={`cmd-${svc.id}-${act2RunId}`}
                              text={svc.label}
                              animateOn="view"
                              speed={35}
                              sequential
                              revealDirection="start"
                              scrambleColor="#0219EA"
                            />
                          ) : (
                            <span>{svc.label}</span>
                          )}
                        </span>
                      </div>

                      {/* Terminal Streaming Output */}
                      <div className="relative mt-1 sm:mt-1.5 text-[10px] sm:text-[13px] text-blue-50/90 leading-snug sm:leading-relaxed max-h-11 sm:max-h-none overflow-hidden">
                        <div
                          aria-hidden="true"
                          className="invisible select-none pointer-events-none"
                        >
                          &gt; {svc.description}
                        </div>
                        {cardActive && (
                          <TextType
                            key={`out-${svc.id}-${act2RunId}`}
                            as="div"
                            text={svc.description}
                            prefix="> "
                            prefixColor="#0219EA"
                            typingSpeed={13}
                            initialDelay={120}
                            loop={false}
                            showCursor={true}
                            cursorStyle="block"
                            cursorColor="#0219EA"
                            cursorBlinkDuration={0.55}
                            className="absolute inset-0 text-blue-50/90"
                          />
                        )}
                      </div>
                    </SpotlightCard>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            ACT III (68% - 100%): Front-Facing 3D Holographic Globe
           ============================================================ */}
        <div
          style={{
            visibility: act3Opacity > 0.01 ? 'visible' : 'hidden',
            pointerEvents: act3Opacity > 0.1 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-20 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-16 pb-5 sm:pt-24 sm:pb-10 flex flex-col justify-between"
        >
          {/* Top-Left Heading leaving center globe & right side 100% clear (Stagger Slot 0) */}
          <div style={getAct3ItemStyle(0).style}>
            <h2 className="text-xl sm:text-4xl font-bold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              Built for Global Production Scale
            </h2>
          </div>

          {/* Bottom Metrics + Conversion Bar (Stagger Slots 1..4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 items-stretch">
            <div className="lg:col-span-8 grid grid-cols-3 gap-2 sm:gap-4">
              {profile.stats.map((stat, idx) => {
                const meta = STAT_META[idx % STAT_META.length]
                const cardStage = getAct3ItemStyle(idx + 1)
                const statActive = cardStage.opacity > 0.15
                return (
                  <div
                    key={stat.label}
                    style={cardStage.style}
                    className="flex"
                  >
                    <SpotlightCard
                      spotlightColor="#0219EA"
                      intensity={0.32}
                      borderGlow={0.95}
                      data-crosshair-target
                      className="group w-full !p-2.5 sm:!p-5 !rounded-xl sm:!rounded-2xl border border-white/15 flex flex-col justify-between gap-1.5 sm:gap-3 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {/* Top Icon + Animated Telemetry Bars */}
                      <div className="flex items-center justify-between">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl border border-[#0219EA]/55 bg-[#0219EA]/25 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_16px_rgba(2,25,234,0.35)]">
                          {meta.icon}
                        </div>
                        <div className="hidden sm:flex items-end gap-1 h-4">
                          {meta.bars.map((height, bIdx) => (
                            <span
                              key={bIdx}
                              className="w-1 rounded-full bg-[#0219EA] shadow-[0_0_8px_rgba(2,25,234,0.8)] animate-pulse"
                              style={{
                                height: `${statActive ? height : 25}%`,
                                animationDelay: `${(idx * 3 + bIdx) * 160}ms`,
                                animationDuration: '1.6s',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Rolling Odometer Metric (Triggers per-card as it staggers in) */}
                      <div className="text-xl sm:text-4xl lg:text-[2.6rem] font-bold text-white font-mono leading-none tracking-tight">
                        {statActive ? (
                          <CountUp
                            key={`stat-${stat.label}-${act3RunId}`}
                            from={0}
                            to={stat.value}
                            suffix={stat.suffix}
                            duration={1.8}
                            mode="roll"
                          />
                        ) : (
                          <span>0{stat.suffix}</span>
                        )}
                      </div>

                      {/* Continuous Decrypted Title + Streaming Sub-line */}
                      <div className="space-y-0.5 sm:space-y-1 border-t border-white/10 pt-1.5 sm:pt-2.5 min-w-0">
                        <h3 className="text-[11px] sm:text-[13px] font-semibold text-white leading-tight sm:leading-snug truncate sm:whitespace-normal">
                          <DecryptedText
                            text={stat.label}
                            animateOn="view"
                            loop={true}
                            loopDelay={3200 + idx * 750}
                            speed={36}
                            sequential
                            revealDirection="start"
                            scrambleColor="#0219EA"
                          />
                        </h3>
                        <div className="text-[10px] sm:text-[11px] font-mono text-[#4f6bff] h-3.5 sm:h-4 overflow-hidden">
                          <TextType
                            as="div"
                            text={[...meta.phrases]}
                            typingSpeed={34}
                            deletingSpeed={20}
                            pauseDuration={1800 + idx * 300}
                            initialDelay={idx * 220}
                            loop={true}
                            showCursor={true}
                            cursorStyle="block"
                            cursorColor="#0219EA"
                            className="truncate text-[#4f6bff]"
                          />
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                )
              })}
            </div>

            <div
              style={getAct3ItemStyle(4).style}
              className="lg:col-span-4 flex"
            >
              <SpotlightCard
                spotlightColor="#0219EA"
                intensity={0.32}
                borderGlow={0.95}
                className="w-full !p-3.5 sm:!p-5 !rounded-xl sm:!rounded-2xl border border-white/15 flex flex-col justify-between gap-2.5 sm:gap-3.5"
              >
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="text-sm sm:text-lg font-bold text-white leading-snug">
                    <span className="text-white block">Ready to</span>
                    <RotatingText
                      texts={[
                        'Automate Your Operations?',
                        'Ship Your Web Platform?',
                        'Deploy Custom AI Agents?',
                      ]}
                      splitBy="words"
                      effect="slide"
                      direction="up"
                      rotationInterval={2500}
                      staggerDuration={0.05}
                      staggerFrom="first"
                      mainClassName="text-[#0219EA] drop-shadow-[0_0_18px_rgba(59,85,255,0.65)] overflow-hidden py-0.5"
                    />
                  </div>
                  <div className="text-[11px] sm:text-xs font-mono text-neutral-300 h-3.5 sm:h-4 overflow-hidden">
                    <TextType
                      as="div"
                      text={[
                        'Direct engineering relay — ready to deploy.',
                        'Custom LLMs, n8n pipelines & Next.js apps.',
                      ]}
                      typingSpeed={32}
                      deletingSpeed={18}
                      pauseDuration={2200}
                      loop={true}
                      showCursor={true}
                      cursorStyle="block"
                      cursorColor="#0219EA"
                      className="truncate text-neutral-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 pt-0.5 sm:pt-1">
                  <StarBorder
                    as="button"
                    type="button"
                    onClick={() => onOpenContact?.()}
                    color="#0219EA"
                    trailColor="#3b55ff"
                    backgroundColor="rgba(2, 25, 234, 0.28)"
                    textColor="#ffffff"
                    borderColor="rgba(2, 25, 234, 0.65)"
                    duration={4}
                    radius={12}
                    glow={0.75}
                    hover="lap"
                    clickPulse
                    className="flex-1 !py-2 sm:!py-2.5 !px-3 sm:!px-4 text-[11px] sm:text-xs font-semibold"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span>Start Conversation</span>
                      <span className="text-[#4f6bff]">↗</span>
                    </span>
                  </StarBorder>

                  <VideoTooltip
                    videoSrc="/videos/AI_Video.mp4"
                    emailHref="#works"
                    align="right"
                    onOpenChange={(open) => {
                      engineRef.current.isVideoTooltipOpen = open
                      engineRef.current.lastInteractionTime = performance.now()
                    }}
                  >
                    {({ open, toggle }) => (
                      <StarBorder
                        as="button"
                        type="button"
                        onClick={toggle}
                        aria-expanded={open}
                        color="#0219EA"
                        trailColor="#3b55ff"
                        backgroundColor="rgba(2, 25, 234, 0.18)"
                        textColor="#f1f5f9"
                        borderColor="rgba(2, 25, 234, 0.55)"
                        duration={4}
                        radius={12}
                        glow={0.7}
                        hover="lap"
                        clickPulse
                        className="!py-2.5 !px-4 text-xs font-mono"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span>Sample Work</span>
                          <span className="text-[#4f6bff]">
                            {open ? '✕' : '▶'}
                          </span>
                        </span>
                      </StarBorder>
                    )}
                  </VideoTooltip>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
