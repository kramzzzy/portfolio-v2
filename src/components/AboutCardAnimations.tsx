import { useEffect, useRef } from 'react'
import {
  animate,
  createDrawable,
  createScope,
  createSpring,
  createTimeline,
  stagger,
} from 'animejs'

/**
 * Anime.js v4 visual for "Software & AI Integration" card
 * Shows LLM <-> API Router <-> CRM/Cloud bi-directional token streaming
 */
export function AIIntegrationVisual() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const scope = createScope({ root: rootRef.current }).add(() => {
      // Continuous orbital ring on central AI router hub
      animate('.ai-int-ring', {
        rotate: '1turn',
        duration: 6500,
        ease: 'linear',
        loop: true,
      })

      const tl = createTimeline({
        loop: true,
        defaults: { ease: 'outQuad' },
      })

      // 1. LLM node pulses & emits stream toward API Hub
      tl.add('.ai-int-node-llm', {
        scale: [1, 1.12, 1],
        borderColor: [
          'rgba(255,255,255,0.14)',
          'rgba(79,107,255,0.95)',
          'rgba(255,255,255,0.18)',
        ],
        duration: 520,
        ease: createSpring({ stiffness: 230, damping: 14 }),
      })
        .add(
          createDrawable('.ai-int-wire-1'),
          {
            draw: ['0 0', '0 1'],
            opacity: [0.3, 1],
            duration: 480,
            ease: 'inOutCubic',
          },
          '-=280'
        )
        .add(
          '.ai-int-dot-1',
          {
            translateX: [0, 44],
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1.2, 0.7],
            duration: 480,
            ease: 'inOutCubic',
          },
          '<'
        )
        // 2. Central AI Agent / REST Hub processes payload
        .add('.ai-int-node-hub', {
          scale: [1, 1.15, 1],
          borderColor: [
            'rgba(2,25,234,0.45)',
            'rgba(79,107,255,1)',
            'rgba(2,25,234,0.55)',
          ],
          duration: 600,
          ease: createSpring({ stiffness: 240, damping: 13 }),
        })
        .add(
          '.ai-int-wave-bar',
          {
            scaleY: [0.3, 1, 0.35, 0.9, 0.45],
            duration: 560,
            delay: stagger(60, { from: 'center' }),
          },
          '<'
        )
        // 3. Emit synced payload to CRM / Cloud DB node
        .add(
          createDrawable('.ai-int-wire-2'),
          {
            draw: ['0 0', '0 1'],
            opacity: [0.3, 1],
            duration: 480,
            ease: 'inOutCubic',
          },
          '-=180'
        )
        .add(
          '.ai-int-dot-2',
          {
            translateX: [0, 44],
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1.2, 0.7],
            duration: 480,
            ease: 'inOutCubic',
          },
          '<'
        )
        .add('.ai-int-node-db', {
          scale: [1, 1.12, 1],
          borderColor: [
            'rgba(255,255,255,0.14)',
            'rgba(52,211,153,0.9)',
            'rgba(255,255,255,0.18)',
          ],
          duration: 540,
          ease: createSpring({ stiffness: 230, damping: 14 }),
        })
        .add(
          '.ai-int-status',
          {
            opacity: [0.45, 1, 0.65],
            scale: [0.96, 1.04, 1],
            duration: 500,
          },
          '<'
        )
        .add('.ai-int-wire-1, .ai-int-wire-2', {
          opacity: [1, 0.2],
          duration: 340,
          delay: 220,
        })
    })

    return () => scope.revert()
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative flex h-[54px] w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      {/* Top-left subtle status tag */}
      <div className="flex items-center gap-1.5">
        {/* LLM Node */}
        <div className="ai-int-node-llm flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-neutral-900/90 text-[#4f6bff] shadow-[0_0_12px_rgba(2,25,234,0.3)]">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300">
          LLM
        </span>
      </div>

      {/* Connector 1 */}
      <div className="relative mx-1.5 flex-1 h-4 flex items-center">
        <svg
          className="h-full w-full overflow-visible"
          viewBox="0 0 50 12"
          preserveAspectRatio="none"
        >
          <path
            d="M 2 6 L 48 6"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
            strokeDasharray="2.5 2.5"
          />
          <path
            className="ai-int-wire-1"
            d="M 2 6 L 48 6"
            fill="none"
            stroke="#4f6bff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="ai-int-dot-1 pointer-events-none absolute left-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-[#4f6bff] shadow-[0_0_8px_#4f6bff] opacity-0" />
      </div>

      {/* Central AI API Hub */}
      <div className="ai-int-node-hub relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#0219EA]/50 bg-[#0219EA]/20 shadow-[0_0_16px_rgba(2,25,234,0.4)]">
        <svg
          className="ai-int-ring absolute inset-1 h-7 w-7 text-[#4f6bff]/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        >
          <circle cx="12" cy="12" r="9.5" />
        </svg>
        <div className="relative z-10 flex h-3 items-end gap-[2px]">
          <span className="ai-int-wave-bar h-full w-[2px] origin-bottom rounded-full bg-[#4f6bff]" />
          <span className="ai-int-wave-bar h-full w-[2px] origin-bottom rounded-full bg-white" />
          <span className="ai-int-wave-bar h-full w-[2px] origin-bottom rounded-full bg-[#4f6bff]" />
        </div>
      </div>

      {/* Connector 2 */}
      <div className="relative mx-1.5 flex-1 h-4 flex items-center">
        <svg
          className="h-full w-full overflow-visible"
          viewBox="0 0 50 12"
          preserveAspectRatio="none"
        >
          <path
            d="M 2 6 L 48 6"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
            strokeDasharray="2.5 2.5"
          />
          <path
            className="ai-int-wire-2"
            d="M 2 6 L 48 6"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="ai-int-dot-2 pointer-events-none absolute left-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] opacity-0" />
      </div>

      {/* CRM / Cloud DB Node */}
      <div className="flex items-center gap-1.5">
        <div className="ai-int-node-db flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-neutral-900/90 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          </svg>
        </div>
        <span className="ai-int-status rounded-md bg-emerald-500/15 border border-emerald-400/30 px-1.5 py-0.5 text-[9.5px] font-mono font-semibold text-emerald-400">
          API
        </span>
      </div>
    </div>
  )
}

/**
 * Anime.js v4 visual for "Web UI/UX Engineering" card
 * Shows animated responsive interface blocks, bezier motion curve & interactive cursor
 */
export function UIUXEngineeringVisual() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const scope = createScope({ root: rootRef.current }).add(() => {
      // Draw bezier motion curve continuously
      animate(createDrawable('.uiux-curve-path'), {
        draw: ['0 0', '0 1'],
        duration: 1800,
        ease: 'inOutCubic',
        alternate: true,
        loop: true,
      })

      const tl = createTimeline({
        loop: true,
        defaults: { ease: 'outQuad' },
      })

      // 1. Staggered UI layout blocks morph/pop in
      tl.add('.uiux-block', {
        scale: [0.88, 1.05, 1],
        borderColor: [
          'rgba(255,255,255,0.12)',
          'rgba(79,107,255,0.85)',
          'rgba(255,255,255,0.18)',
        ],
        duration: 600,
        delay: stagger(110),
        ease: createSpring({ stiffness: 230, damping: 14 }),
      })
        // 2. Animated pointer glides across the mini viewport and clicks
        .add(
          '.uiux-cursor',
          {
            translateX: [0, 56, 24, 0],
            translateY: [0, -8, 6, 0],
            scale: [1, 0.9, 1.08, 1],
            duration: 1800,
            ease: 'inOutCubic',
          },
          '-=450'
        )
        // 3. Active UI card glow & FPS badge pulse
        .add(
          '.uiux-hero-chip',
          {
            backgroundColor: [
              'rgba(2,25,234,0.22)',
              'rgba(79,107,255,0.48)',
              'rgba(2,25,234,0.22)',
            ],
            duration: 900,
          },
          '-=1200'
        )
    })

    return () => scope.revert()
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative flex h-[54px] w-full items-center justify-between gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      {/* Left: Mini Browser / Responsive Bento Layout Preview */}
      <div className="relative flex items-center gap-1.5 flex-1 min-w-0">
        {/* Window dots */}
        <div className="flex flex-col gap-1 pr-1 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4f6bff]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </div>

        {/* Animated UI blocks */}
        <div className="uiux-block uiux-hero-chip relative flex h-8 w-14 shrink-0 flex-col justify-between rounded-lg border border-[#4f6bff]/40 bg-[#0219EA]/25 p-1.5">
          <span className="h-1.5 w-6 rounded-full bg-[#4f6bff]" />
          <span className="h-1 w-9 rounded-full bg-white/60" />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="uiux-block h-3.5 w-full rounded-md border border-white/15 bg-neutral-900/90 px-1.5 flex items-center">
            <svg
              className="h-2.5 w-full overflow-visible"
              viewBox="0 0 60 10"
              preserveAspectRatio="none"
            >
              <path
                className="uiux-curve-path"
                d="M 2 8 C 18 1, 38 9, 58 2"
                fill="none"
                stroke="#4f6bff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="uiux-block h-3.5 w-4/5 rounded-md border border-white/15 bg-white/[0.05] px-1.5 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            <span className="h-1 flex-1 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Floating Animated Design Cursor */}
        <div className="uiux-cursor pointer-events-none absolute left-9 top-3 z-20 flex items-center">
          <svg
            className="h-3.5 w-3.5 text-[#4f6bff] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            viewBox="0 0 16 18"
            fill="currentColor"
          >
            <path d="M2.2 1.6 13.4 9.9c.5.4.3 1.2-.4 1.3l-4.6.6-2.2 4.2c-.3.6-1.2.5-1.4-.1L1.2 2.4c-.2-.6.5-1.1 1-.8Z" />
          </svg>
        </div>
      </div>

      {/* Right: Motion FPS Badge */}
      <div className="shrink-0 flex flex-col items-end">
        <span className="rounded-md bg-[#0219EA]/25 border border-[#4f6bff]/40 px-1.5 py-0.5 text-[9.5px] font-mono font-semibold text-[#4f6bff]">
          60 FPS
        </span>
        <span className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-400">
          Motion
        </span>
      </div>
    </div>
  )
}
