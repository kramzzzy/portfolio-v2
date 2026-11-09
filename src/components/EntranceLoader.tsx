import { useEffect, useRef, useState } from 'react'

interface EntranceLoaderProps {
  loadedFrames: number
  targetFrames?: number
  onComplete?: () => void
}

const CRITICAL_IMAGES = [
  '/images/icons/Logo.svg',
  '/images/profile.jpg',
  '/images/profile-2.jpg',
  '/frames/frame_0001.webp',
]

const MIN_DURATION_MS = 2600
const MAX_WAIT_MS = 4500
const VIDEO_W = 592
const VIDEO_H = 686

export default function EntranceLoader({
  loadedFrames,
  targetFrames = 120,
  onComplete,
}: EntranceLoaderProps) {
  const [percent, setPercent] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [unmounted, setUnmounted] = useState(false)
  const [staticReady, setStaticReady] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const progressRef = useRef({
    loadedFrames: 0,
    staticReady: false,
    displayed: 0,
    startedAt: performance.now(),
    doneTriggered: false,
  })

  useEffect(() => {
    progressRef.current.loadedFrames = loadedFrames
  }, [loadedFrames])

  useEffect(() => {
    progressRef.current.staticReady = staticReady
  }, [staticReady])

  // Lock page scroll while the entrance loader is active
  useEffect(() => {
    if (unmounted) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [unmounted])

  // Preload critical static images + web fonts
  useEffect(() => {
    let cancelled = false

    const imagePromises = CRITICAL_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        })
    )

    const fontPromise =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready.then(() => undefined).catch(() => undefined)
        : Promise.resolve()

    Promise.all([...imagePromises, fontPromise]).then(() => {
      if (!cancelled) {
        setStaticReady(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Luma-key canvas renderer: strips the video's black background into true alpha transparency
  useEffect(() => {
    if (unmounted) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    video.play().catch(() => undefined)

    let rafId = 0
    const renderGlobe = () => {
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        ctx.clearRect(0, 0, VIDEO_W, VIDEO_H)
        ctx.drawImage(video, 0, 0, VIDEO_W, VIDEO_H)
        const frame = ctx.getImageData(0, 0, VIDEO_W, VIDEO_H)
        const data = frame.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const luma = r > g ? (r > b ? r : b) : g > b ? g : b
          if (luma <= 16) {
            data[i + 3] = 0
          } else {
            const alpha = Math.min(255, (luma - 16) * 2.4)
            data[i] = Math.min(255, Math.round(r * 1.15))
            data[i + 1] = Math.min(255, Math.round(g * 1.15))
            data[i + 2] = Math.min(255, Math.round(b * 1.2))
            data[i + 3] = alpha
          }
        }
        ctx.putImageData(frame, 0, 0)
      }
      rafId = requestAnimationFrame(renderGlobe)
    }

    rafId = requestAnimationFrame(renderGlobe)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [unmounted])

  // Smooth 60fps progress interpolation tied to actual frame & asset loading
  useEffect(() => {
    let rafId = 0
    let exitTimer: number | undefined
    let unmountTimer: number | undefined

    const tick = (now: number) => {
      const state = progressRef.current
      const elapsed = now - state.startedAt

      const frameRatio = Math.min(1, state.loadedFrames / Math.max(1, targetFrames))
      const staticRatio = state.staticReady ? 1 : 0.35
      const rawAssetProgress = frameRatio * 0.85 + staticRatio * 0.15

      const timeFloor = Math.min(1, elapsed / MIN_DURATION_MS)
      const timedOut = elapsed >= MAX_WAIT_MS

      const target = timedOut
        ? 100
        : Math.min(100, Math.min(rawAssetProgress, timeFloor) * 100)

      state.displayed += (target - state.displayed) * 0.14
      if (target >= 99.5 && state.displayed > 98.8) {
        state.displayed = 100
      }

      const rounded = Math.min(100, Math.round(state.displayed))
      setPercent((prev) => (prev !== rounded ? rounded : prev))

      if (state.displayed >= 100 && !state.doneTriggered) {
        state.doneTriggered = true
        exitTimer = window.setTimeout(() => {
          setExiting(true)
          document.body.style.overflow = ''
          onComplete?.()
          unmountTimer = window.setTimeout(() => {
            setUnmounted(true)
          }, 650)
        }, 180)
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      if (exitTimer !== undefined) window.clearTimeout(exitTimer)
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer)
    }
  }, [targetFrames, onComplete])

  if (unmounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 select-none transition-opacity duration-600 ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/videos/loader-globe.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Centered Rotating Particle Globe (True Alpha Transparency) */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-700 ease-out ${
          exiting ? 'scale-105' : 'scale-100'
        }`}
      >
        <div className="relative w-[260px] sm:w-[320px] md:w-[360px] aspect-[592/686] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={VIDEO_W}
            height={VIDEO_H}
            className="h-full w-full object-contain pointer-events-none"
          />
        </div>

        {/* Brand Logo + Solid Progress Bar + Percentage */}
        <div className="-mt-4 flex flex-col items-center gap-3.5">
          <img
            src="/images/icons/Logo.svg"
            alt="KramZ"
            className="h-6 sm:h-7 w-auto object-contain opacity-95"
          />

          <div className="w-48 sm:w-56 space-y-2">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-[#0219EA] transition-[width] duration-100 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em]">
              <span className="text-neutral-500">
                {percent < 100 ? 'Loading Assets' : 'Ready'}
              </span>
              <span className="text-[#4f6bff] tabular-nums font-semibold">
                {String(percent).padStart(3, '0')}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
