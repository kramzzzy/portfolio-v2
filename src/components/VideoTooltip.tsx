import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface VideoTooltipProps {
  videoSrc?: string
  emailHref?: string
  align?: 'left' | 'right' | 'center'
  onOpenChange?: (open: boolean) => void
  children: (props: {
    open: boolean
    toggle: () => void
  }) => React.ReactNode
}

export default function VideoTooltip({
  videoSrc = '/videos/AI_Video.mp4',
  emailHref,
  align = 'left',
  onOpenChange,
  children,
}: VideoTooltipProps) {
  const [open, setOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('9 / 16')
  const [progress, setProgress] = useState(0)
  const [coords, setCoords] = useState<{
    left: number
    bottom: number
    arrowLeft: number
  }>({ left: 24, bottom: 80, arrowLeft: 32 })

  const wrapperRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const updateOpen = useCallback(
    (next: boolean) => {
      setOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  const updatePosition = useCallback(() => {
    const trigger = wrapperRef.current
    if (!trigger || typeof window === 'undefined') return

    const rect = trigger.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const tooltipWidth = vw < 640 ? 224 : 256 // w-56 (224px) or sm:w-64 (256px)

    let targetLeft = rect.left
    if (align === 'center') {
      targetLeft = rect.left + rect.width / 2 - tooltipWidth / 2
    } else if (align === 'right') {
      targetLeft = rect.right - tooltipWidth
    }

    const clampedLeft = Math.max(16, Math.min(vw - tooltipWidth - 16, targetLeft))
    const rawBottom = vh - rect.top + 14
    const clampedBottom = Math.max(16, Math.min(vh - 470, rawBottom))

    const triggerCenter = rect.left + rect.width / 2
    const arrowLeft = Math.max(
      20,
      Math.min(tooltipWidth - 28, triggerCenter - clampedLeft - 6)
    )

    setCoords({
      left: clampedLeft,
      bottom: clampedBottom,
      arrowLeft,
    })
  }, [align])

  const toggle = () => {
    const next = !open
    if (next) {
      updatePosition()
    }
    updateOpen(next)
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (open) {
      video.currentTime = 0
      video.muted = false
      setIsMuted(false)
      video.play().catch(() => {
        video.muted = true
        setIsMuted(true)
        video.play().catch(() => {})
      })
    } else {
      video.pause()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(target)
      ) {
        updateOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        updateOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, updateOpen])

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      {children({ open, toggle })}

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            role="dialog"
            aria-label="Sample Work Video Preview"
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              bottom: `${coords.bottom}px`,
              zIndex: 9999,
            }}
            className="w-56 sm:w-64 rounded-2xl border border-[#0219EA]/65 bg-slate-950/75 p-1.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_24px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(2,25,234,0.45)] select-none"
          >
            {/* Video Container Matched Strictly to Video Aspect Ratio (9:16 / 2160x3840) */}
            <div
              style={{ aspectRatio }}
              className="relative w-full overflow-hidden rounded-xl bg-neutral-950 border border-white/15"
            >
              <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                loop
                muted={isMuted}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget
                  if (v.videoWidth > 0 && v.videoHeight > 0) {
                    setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`)
                  }
                }}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  if (v.duration > 0) {
                    setProgress((v.currentTime / v.duration) * 100)
                  }
                }}
                className="h-full w-full object-cover block"
              />

              {/* Top Overlay Controls (Audio Toggle + Close) */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
                <button
                  type="button"
                  onClick={() => {
                    const v = videoRef.current
                    if (!v) return
                    v.muted = !v.muted
                    setIsMuted(v.muted)
                  }}
                  aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/65 px-2.5 py-1 text-[11px] font-mono text-white backdrop-blur-md hover:border-[#0219EA] hover:text-[#4f6bff] transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-rose-400"
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
                      <span>Muted</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 h-full bg-[#0219EA] animate-pulse" />
                        <span className="w-0.5 h-2 bg-[#0219EA] animate-pulse [animation-delay:150ms]" />
                        <span className="w-0.5 h-3 bg-[#0219EA] animate-pulse [animation-delay:300ms]" />
                      </span>
                      <span>Audio On</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => updateOpen(false)}
                  aria-label="Close video tooltip"
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-slate-950/65 text-xs text-white/80 backdrop-blur-md hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Bottom Progress + Quick Action Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-2.5 pt-6 space-y-2">
                <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-[#0219EA] transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-200">Sample Work</span>
                  {emailHref ? (
                    <a
                      href={emailHref}
                      className="text-[#4f6bff] hover:text-white underline underline-offset-2 font-semibold"
                    >
                      View Projects ↓
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Tooltip Pointer Diamond */}
            <div
              style={{ left: `${coords.arrowLeft}px` }}
              className="absolute -bottom-1.5 h-3 w-3 rotate-45 border-r border-b border-[#0219EA]/65 bg-slate-950/85 backdrop-blur-xl"
            />
          </div>,
          document.body
        )}
    </div>
  )
}
