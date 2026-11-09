import { useEffect, useRef, useState } from 'react'
import {
  animate,
  createDrawable,
  createMotionPath,
  createScope,
  createSpring,
  createTimeline,
  stagger,
} from 'animejs'

const STAGES = [
  { code: 'INGEST // SPEC.TSX', color: '#4f6bff' },
  { code: 'WORKING // AI_BUILD', color: '#0219EA' },
  { code: 'SHIPPED // PROD_LIVE', color: '#34d399' },
] as const

export default function CareerTrackAnimation() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    if (!rootRef.current) return

    const scope = createScope({ root: rootRef.current }).add(() => {
      // Continuous orbital ring rotation on Working node
      animate('.cta-gear-ring', {
        rotate: '1turn',
        duration: 7000,
        ease: 'linear',
        loop: true,
      })

      // Continuous subtle float on Ship vessel
      animate('.cta-ship-vessel', {
        translateY: [-1.5, 1.5],
        duration: 1300,
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })

      // SVG line-drawing animation on the file icon & rocket outline
      animate(createDrawable('.cta-svg-draw'), {
        draw: ['0 0.25', '0 1', '0 1'],
        duration: 2600,
        ease: 'inOutQuad',
        loop: true,
      })

      const path1 = createMotionPath('#cta-route-1')
      const path2 = createMotionPath('#cta-route-2')

      // Master sequential pipeline timeline: FILE -> WORKING -> SHIP
      const tl = createTimeline({
        loop: true,
        defaults: { ease: 'outQuad' },
      })

      // Stage 1: FILE (spec ingestion + code line typing)
      tl.call(() => setStageIdx(0), 0)
        .add('.cta-node-file', {
          scale: [1, 1.12, 1],
          borderColor: [
            'rgba(255,255,255,0.16)',
            'rgba(79,107,255,0.95)',
            'rgba(255,255,255,0.2)',
          ],
          duration: 550,
          ease: createSpring({ stiffness: 240, damping: 14 }),
        })
        .add(
          '.cta-file-line',
          {
            scaleX: [0.15, 1],
            opacity: [0.25, 1],
            duration: 360,
            delay: stagger(80),
          },
          '<'
        )
        // Draw SVG circuit path 1 & move SVG packet along motion path
        .add(
          createDrawable('#cta-route-1-active'),
          {
            draw: ['0 0', '0 1'],
            opacity: [0.9, 1],
            duration: 580,
            ease: 'inOutCubic',
          },
          '-=120'
        )
        .add(
          '.cta-packet-1',
          {
            ...path1,
            opacity: [0, 1, 1, 0],
            scale: [0.7, 1.25, 0.8],
            duration: 580,
            ease: 'inOutCubic',
          },
          '<'
        )
        // Stage 2: WORKING (AI / Engineering processing)
        .call(() => setStageIdx(1))
        .add('.cta-node-work', {
          scale: [1, 1.14, 1],
          borderColor: [
            'rgba(255,255,255,0.16)',
            'rgba(2,25,234,1)',
            'rgba(79,107,255,0.38)',
          ],
          duration: 720,
          ease: createSpring({ stiffness: 240, damping: 14 }),
        })
        .add(
          '.cta-work-bar',
          {
            scaleY: [0.25, 1, 0.4, 0.95, 0.5],
            backgroundColor: ['#4f6bff', '#0219EA', '#60a5fa', '#4f6bff'],
            duration: 720,
            delay: stagger(65, { from: 'center' }),
          },
          '<'
        )
        // Draw SVG circuit path 2 & move SVG packet along motion path
        .add(
          createDrawable('#cta-route-2-active'),
          {
            draw: ['0 0', '0 1'],
            opacity: [0.9, 1],
            duration: 580,
            ease: 'inOutCubic',
          },
          '-=100'
        )
        .add(
          '.cta-packet-2',
          {
            ...path2,
            opacity: [0, 1, 1, 0],
            scale: [0.7, 1.25, 0.8],
            duration: 580,
            ease: 'inOutCubic',
          },
          '<'
        )
        // Stage 3: SHIP (Rocket launch + sonar ring + exhaust)
        .call(() => setStageIdx(2))
        .add('.cta-node-ship', {
          scale: [1, 1.14, 1],
          borderColor: [
            'rgba(255,255,255,0.16)',
            'rgba(52,211,153,0.95)',
            'rgba(255,255,255,0.2)',
          ],
          duration: 680,
          ease: createSpring({ stiffness: 220, damping: 13 }),
        })
        .add(
          '.cta-ship-rocket',
          {
            translateX: [0, 4, 0],
            translateY: [0, -3, 0],
            scale: [1, 1.18, 1],
            duration: 640,
            ease: 'outBack',
          },
          '<'
        )
        .add(
          '.cta-ship-exhaust',
          {
            scaleX: [0.3, 1.6, 0.5],
            opacity: [0.25, 1, 0.25],
            duration: 560,
          },
          '<'
        )
        .add(
          '.cta-ship-ring',
          {
            scale: [0.75, 1.85],
            opacity: [0.85, 0],
            duration: 720,
            ease: 'outCubic',
          },
          '<'
        )
        // Fade active circuit traces before next loop
        .add('#cta-route-1-active, #cta-route-2-active', {
          opacity: [1, 0],
          duration: 360,
          delay: 260,
        })
    })

    return () => scope.revert()
  }, [])

  const activeStage = STAGES[stageIdx]

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-xl border border-[#4f6bff]/30 bg-gradient-to-r from-[#0219EA]/15 via-neutral-900/90 to-[#0219EA]/15 px-3.5 py-2.5 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
      aria-label="Automated File to Working to Ship pipeline animation"
    >
      {/* Cyber dot matrix background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(79,107,255,0.55) 1px, transparent 0)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* STAGE 1: FILE */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="cta-node-file relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-neutral-900 shadow-[0_0_14px_rgba(2,25,234,0.38)]">
            <svg
              className="h-4 w-4 text-[#4f6bff]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className="cta-svg-draw"
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div className="pointer-events-none absolute bottom-1.5 left-2 right-2 flex flex-col gap-[2px]">
              <span className="cta-file-line h-[1.5px] w-full origin-left rounded-full bg-[#4f6bff]" />
              <span className="cta-file-line h-[1.5px] w-3/4 origin-left rounded-full bg-white/80" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-400 leading-none">
              01 / Spec
            </div>
            <div className="text-xs font-semibold text-white leading-tight mt-0.5">
              File
            </div>
          </div>
        </div>

        {/* SVG MOTION PATH CONNECTOR 1: FILE -> WORKING */}
        <div className="relative h-6 flex-1 min-w-[36px]">
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 120 24"
            preserveAspectRatio="none"
          >
            <path
              id="cta-route-1"
              d="M 4 12 C 38 4, 82 20, 116 12"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.75"
              strokeDasharray="3 3"
            />
            <path
              id="cta-route-1-active"
              d="M 4 12 C 38 4, 82 20, 116 12"
              fill="none"
              stroke="#4f6bff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle
              className="cta-packet-1"
              r="3.5"
              fill="#4f6bff"
              style={{ filter: 'drop-shadow(0 0 6px #4f6bff)', opacity: 0 }}
            />
          </svg>
        </div>

        {/* STAGE 2: WORKING */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="cta-node-work relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-neutral-900 shadow-[0_0_16px_rgba(2,25,234,0.45)]">
            <svg
              className="cta-gear-ring absolute inset-1 h-6 w-6 text-[#4f6bff]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="3 3"
            >
              <circle cx="12" cy="12" r="9" />
            </svg>
            <div className="relative z-10 flex h-3 items-end gap-[2px]">
              <span className="cta-work-bar h-full w-[2px] origin-bottom rounded-full bg-[#4f6bff]" />
              <span className="cta-work-bar h-full w-[2px] origin-bottom rounded-full bg-[#0219EA]" />
              <span className="cta-work-bar h-full w-[2px] origin-bottom rounded-full bg-[#4f6bff]" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[9.5px] font-mono uppercase tracking-wider text-[#4f6bff] leading-none">
              02 / Build
            </div>
            <div className="text-xs font-semibold text-white leading-tight mt-0.5">
              Working
            </div>
          </div>
        </div>

        {/* SVG MOTION PATH CONNECTOR 2: WORKING -> SHIP */}
        <div className="relative h-6 flex-1 min-w-[36px]">
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 120 24"
            preserveAspectRatio="none"
          >
            <path
              id="cta-route-2"
              d="M 4 12 C 38 20, 82 4, 116 12"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.75"
              strokeDasharray="3 3"
            />
            <path
              id="cta-route-2-active"
              d="M 4 12 C 38 20, 82 4, 116 12"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle
              className="cta-packet-2"
              r="3.5"
              fill="#34d399"
              style={{ filter: 'drop-shadow(0 0 6px #34d399)', opacity: 0 }}
            />
          </svg>
        </div>

        {/* STAGE 3: SHIP */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="cta-node-ship relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-neutral-900 shadow-[0_0_16px_rgba(52,211,153,0.35)]">
            <span className="cta-ship-ring pointer-events-none absolute inset-0 rounded-lg border border-emerald-400 opacity-0" />
            <div className="cta-ship-vessel relative flex items-center justify-center">
              <span className="cta-ship-exhaust absolute -left-1.5 bottom-0.5 h-[2px] w-2 origin-right rounded-full bg-[#4f6bff] opacity-40" />
              <svg
                className="cta-ship-rocket h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path
                  className="cta-svg-draw"
                  d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: activeStage.color }}
              />
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400 leading-none">
                03 / Live
              </span>
            </div>
            <div className="text-xs font-semibold text-white leading-tight mt-0.5">
              Ship
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
