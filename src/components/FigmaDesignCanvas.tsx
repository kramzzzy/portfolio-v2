import { useEffect, useRef, useState } from 'react'
import {
  animate,
  createDrawable,
  createScope,
  createSpring,
  createTimeline,
  stagger,
} from 'animejs'
import type { ProjectItem } from '../data/portfolio'
import SpotlightCard from './react-bits/SpotlightCard'

interface FigmaDesignCanvasProps {
  project: ProjectItem
}

const H_RULER_TICKS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
const V_RULER_TICKS = [0, 100, 200, 300, 400, 500]

export default function FigmaDesignCanvas({ project }: FigmaDesignCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [activeFrame, setActiveFrame] = useState<number>(0)
  const [activeColorIdx, setActiveColorIdx] = useState<number>(0)
  const [activeFontIdx, setActiveFontIdx] = useState<number>(0)
  const [liveCoords, setLiveCoords] = useState({ x: 48, y: 42, w: 1440, h: 900, zoom: 100 })
  const [agentStatus, setAgentStatus] = useState<string>(
    `Scrolling Hero → ${project.caseStudy.colorPalette[0].hex}`
  )
  const { caseStudy } = project

  const section1Img = `/images/case-studies/${project.slug}-section-1.webp`
  const section2Img = `/images/case-studies/${project.slug}-section-2.webp`
  const mobileImg = `/images/case-studies/${project.slug}-mobile.webp`

  useEffect(() => {
    if (!rootRef.current) return

    const palette = caseStudy.colorPalette
    const fonts = caseStudy.typography

    const scope = createScope({ root: rootRef.current }).add(() => {
      // 1. Continuous Auto-Scrolling WebpageReel inside Artboard 01 (Desktop Full-Page Scroll)
      animate('.figma-scroll-reel-desktop', {
        translateY: ['0%', '-66.666%'],
        duration: 8500,
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })

      // Synced mini scrollbar thumb on Desktop Artboard
      animate('.figma-scroll-thumb-desktop', {
        translateY: ['0%', '220%'],
        duration: 8500,
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })

      // 2. Continuous Auto-Scrolling Mobile Viewport Reel inside Artboard 03
      animate('.figma-scroll-reel-mobile', {
        translateY: ['0%', '-50%'],
        duration: 6200,
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })

      // 3. Continuous Panning on Bottom Section Artboards
      animate('.figma-scroll-reel-sec1', {
        translateY: ['-50%', '0%'],
        duration: 7400,
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })

      animate('.figma-scroll-reel-sec2', {
        translateY: ['0%', '-50%'],
        duration: 6800,
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })

      // 4. SVG Redline Measurement Vectors Drawing
      animate(createDrawable('.figma-redline-vec'), {
        draw: ['0 0', '0 1', '1 1'],
        duration: 3600,
        delay: stagger(350),
        ease: 'inOutQuad',
        loop: true,
      })

      // 5. Color Spectrum Bar Wave Pulse
      animate('.figma-spectrum-seg', {
        scaleY: [1, 1.35, 1],
        opacity: [0.75, 1, 0.75],
        duration: 1800,
        delay: stagger(140),
        ease: 'inOutSine',
        loop: true,
      })

      // 6. Selection Corner Handles Pulse
      animate('.figma-handle', {
        scale: [1, 1.3, 1],
        duration: 1500,
        ease: 'inOutSine',
        loop: true,
      })

      // 7. Master Agentic AI Cursor + Live Data Inspection Timeline
      const agentTl = createTimeline({
        loop: true,
        defaults: { ease: createSpring({ stiffness: 130, damping: 16 }) },
      })

      // Step A: Inspect Desktop Hero Artboard & Primary CTA Color
      agentTl
        .call(() => {
          setActiveFrame(0)
          setActiveColorIdx(0)
          setActiveFontIdx(0)
          setLiveCoords({ x: 48, y: 42, w: 1440, h: 900, zoom: 100 })
          setAgentStatus(`Scrolling Hero • Token ${palette[0]?.hex ?? '#0219EA'}`)
        }, 0)
        .add('.figma-ai-cursor', {
          translateX: [30, 145],
          translateY: [45, 96],
          duration: 1350,
        })
        .add(
          '.figma-ai-ripple',
          {
            scale: [0.3, 2.3],
            opacity: [0.95, 0],
            duration: 600,
            ease: 'outCubic',
          },
          '-=320'
        )
        .add(
          '.figma-ruler-highlight-h',
          {
            translateX: [0, 18],
            scaleX: [1, 1.2],
            duration: 850,
          },
          '<'
        )
        .add(
          '.figma-ruler-highlight-v',
          {
            translateY: [0, 14],
            scaleY: [1, 1.15],
            duration: 850,
          },
          '<'
        )

        // Step B: Glide to Mobile Viewport Artboard (390x844)
        .call(() => {
          setActiveFrame(2)
          setActiveColorIdx(1 % palette.length)
          setActiveFontIdx(1 % fonts.length)
          setLiveCoords({ x: 980, y: 64, w: 390, h: 844, zoom: 125 })
          setAgentStatus(`Testing Mobile Scroll • 390×844px`)
        })
        .add('.figma-ai-cursor', {
          translateX: 395,
          translateY: 118,
          duration: 1400,
        })
        .add(
          '.figma-ai-ripple',
          {
            scale: [0.3, 2.3],
            opacity: [0.95, 0],
            duration: 600,
            ease: 'outCubic',
          },
          '-=320'
        )
        .add(
          '.figma-ruler-highlight-h',
          {
            translateX: 165,
            scaleX: 0.65,
            duration: 850,
          },
          '<'
        )
        .add(
          '.figma-ruler-highlight-v',
          {
            translateY: 32,
            scaleY: 0.9,
            duration: 850,
          },
          '<'
        )

        // Step C: Glide down to Section Flow 01 Artboard
        .call(() => {
          setActiveFrame(1)
          setActiveColorIdx(2 % palette.length)
          setActiveFontIdx(0)
          setLiveCoords({ x: 120, y: 540, w: 1440, h: 900, zoom: 110 })
          setAgentStatus(`Inspecting ${fonts[0]?.family ?? 'Display'} Hierarchy`)
        })
        .add('.figma-ai-cursor', {
          translateX: 130,
          translateY: 295,
          duration: 1450,
        })
        .add(
          '.figma-ai-ripple',
          {
            scale: [0.3, 2.3],
            opacity: [0.95, 0],
            duration: 600,
            ease: 'outCubic',
          },
          '-=320'
        )
        .add(
          '.figma-ruler-highlight-h',
          {
            translateX: 40,
            scaleX: 1.05,
            duration: 850,
          },
          '<'
        )
        .add(
          '.figma-ruler-highlight-v',
          {
            translateY: 135,
            scaleY: 1.1,
            duration: 850,
          },
          '<'
        )

        // Step D: Glide across to Section Flow 02 Artboard
        .call(() => {
          setActiveFrame(3)
          setActiveColorIdx(3 % palette.length)
          setActiveFontIdx(2 % fonts.length)
          setLiveCoords({ x: 560, y: 540, w: 1440, h: 900, zoom: 100 })
          setAgentStatus(`Syncing Variable ${palette[3]?.name ?? 'Surface'}`)
        })
        .add('.figma-ai-cursor', {
          translateX: 340,
          translateY: 305,
          duration: 1400,
        })
        .add(
          '.figma-ai-ripple',
          {
            scale: [0.3, 2.3],
            opacity: [0.95, 0],
            duration: 600,
            ease: 'outCubic',
          },
          '-=320'
        )

      // 8. Secondary Architect Co-Cursor
      animate('.figma-arch-cursor', {
        translateX: [330, 110, 260, 380, 330],
        translateY: [280, 175, 75, 220, 280],
        duration: 8600,
        ease: 'inOutSine',
        loop: true,
      })
    })

    return () => scope.revert()
  }, [project.slug, caseStudy.colorPalette, caseStudy.typography])

  const handleCopyHex = async (hex: string, idx: number) => {
    setActiveColorIdx(idx)
    try {
      await navigator.clipboard.writeText(hex)
    } catch {
      // Clipboard fallback
    }
    setCopiedHex(hex)
    window.setTimeout(() => {
      setCopiedHex((prev) => (prev === hex ? null : prev))
    }, 1400)
  }

  return (
    <div ref={rootRef}>
      <SpotlightCard
        spotlightColor="#0219EA"
        intensity={0.18}
        borderGlow={0.75}
        className="!p-0 !rounded-2xl overflow-hidden border border-white/10"
      >
        <div>
          {/* 1. Top Figma Workspace Chrome Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-neutral-950/60 p-1">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0219EA] text-white shadow-[0_0_10px_rgba(2,25,234,0.6)]"
                  title="Move / Agentic Select (V)"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 3l16 9-7 2-2 7-7-18z" />
                  </svg>
                </span>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400"
                  title="Frame / Artboard (F)"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="6" y1="2" x2="6" y2="22" />
                    <line x1="18" y1="2" x2="18" y2="22" />
                    <line x1="2" y1="6" x2="22" y2="6" />
                    <line x1="2" y1="18" x2="22" y2="18" />
                  </svg>
                </span>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-serif font-bold text-neutral-400"
                  title="Type Specimen (T)"
                >
                  T
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs min-w-0">
                <span className="text-neutral-400 hidden sm:inline">
                  Figma Inspector
                </span>
                <span className="text-white/20 hidden sm:inline">/</span>
                <span className="font-semibold text-white truncate">
                  {project.title}.fig
                </span>
              </div>
            </div>

            {/* Live Animated Coordinates & Zoom Readout */}
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-3 rounded-lg border border-white/10 bg-neutral-950/60 px-3 py-1 text-[11px] font-mono text-neutral-400">
                <span>
                  X: <strong className="text-white">{liveCoords.x}</strong>
                </span>
                <span>
                  Y: <strong className="text-white">{liveCoords.y}</strong>
                </span>
                <span>
                  W: <strong className="text-[#4f6bff]">{liveCoords.w}</strong>
                </span>
                <span>
                  H: <strong className="text-[#4f6bff]">{liveCoords.h}</strong>
                </span>
                <span className="text-neutral-300">{liveCoords.zoom}%</span>
              </div>
            </div>
          </div>

          {/* 2. Split Workspace: Left Interactive Canvas with Rulers (7 cols) + Right Live Variable Inspector (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT: Figma Canvas with Rulers, Auto-Scrolling Artboards & Agentic Cursors */}
            <div className="lg:col-span-7 relative border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col select-none overflow-hidden">
              {/* Top Horizontal Pixel Ruler */}
              <div className="relative h-6 w-full border-b border-white/10 bg-neutral-950/75 flex items-end pl-6 overflow-hidden">
                <div className="absolute left-0 top-0 h-6 w-6 border-r border-white/10 bg-neutral-950 flex items-center justify-center text-[9px] font-mono text-neutral-500">
                  px
                </div>

                <div className="figma-ruler-highlight-h pointer-events-none absolute left-12 top-0 bottom-0 w-40 bg-[#0219EA]/30 border-x border-[#4f6bff]" />

                <div className="flex w-full items-end justify-between pr-4">
                  {H_RULER_TICKS.map((val) => (
                    <div key={val} className="flex flex-col items-start">
                      <span className="text-[9px] font-mono text-neutral-500 leading-none mb-0.5">
                        {val}
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="h-2 w-px bg-white/25" />
                        <span className="h-1 w-px bg-white/10" />
                        <span className="h-1.5 w-px bg-white/15" />
                        <span className="h-1 w-px bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Canvas Body with Left Vertical Ruler + Dot Grid Stage */}
              <div className="relative flex-1 flex min-h-[480px] sm:min-h-[540px]">
                {/* Left Vertical Pixel Ruler */}
                <div className="relative w-6 shrink-0 border-r border-white/10 bg-neutral-950/75 flex flex-col justify-between py-3 items-end pr-0.5 overflow-hidden">
                  <div className="figma-ruler-highlight-v pointer-events-none absolute inset-x-0 top-8 h-28 bg-[#0219EA]/30 border-y border-[#4f6bff]" />
                  {V_RULER_TICKS.map((val) => (
                    <div key={val} className="relative z-10 flex items-center gap-0.5">
                      <span className="text-[8px] font-mono text-neutral-500 -rotate-90">
                        {val}
                      </span>
                      <span className="h-px w-2 bg-white/25" />
                    </div>
                  ))}
                </div>

                {/* Interactive Dot-Grid Stage */}
                <div
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                  className="relative flex-1 p-4 sm:p-5 overflow-hidden flex flex-col justify-between gap-3.5 bg-neutral-950/35"
                >
                  {/* Animated SVG Redline Measurement Vectors */}
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full z-0"
                    viewBox="0 0 600 480"
                    fill="none"
                  >
                    <path
                      d="M 40 235 L 560 235"
                      stroke="rgba(79, 107, 255, 0.45)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="figma-redline-vec"
                    />
                    <path
                      d="M 380 20 L 380 460"
                      stroke="rgba(79, 107, 255, 0.45)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="figma-redline-vec"
                    />
                  </svg>

                  {/* Top Row: Artboard 01 (Auto-Scrolling Full Desktop Reel) + Artboard 03 (Auto-Scrolling Mobile Reel) */}
                  <div className="relative z-10 grid grid-cols-12 gap-3.5 items-start">
                    {/* Artboard 01: Live Auto-Scrolling Desktop Page */}
                    <div
                      onClick={() => setActiveFrame(0)}
                      className={`col-span-8 relative rounded-lg bg-neutral-900 p-1 transition-all cursor-pointer ${
                        activeFrame === 0
                          ? 'ring-2 ring-[#4f6bff] shadow-[0_0_28px_rgba(2,25,234,0.45)]'
                          : 'ring-1 ring-white/15 hover:ring-white/35'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 px-1">
                        <span
                          className={
                            activeFrame === 0
                              ? 'text-[#4f6bff] font-semibold'
                              : 'text-neutral-400'
                          }
                        >
                          # Desktop_Scroll_Preview
                        </span>
                        <span className="text-neutral-400">1440 × 2700</span>
                      </div>

                      {/* Viewport Window with Live Vertical Webpage Scroll Reel */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-950">
                        <div className="figma-scroll-reel-desktop w-full flex flex-col">
                          <img
                            src={project.image}
                            alt={`${project.title} Hero`}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                          <img
                            src={section1Img}
                            alt={`${project.title} Section 1`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                          <img
                            src={section2Img}
                            alt={`${project.title} Section 2`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                        </div>

                        {/* Mini Scrollbar Track inside Artboard */}
                        <div className="pointer-events-none absolute right-1 top-1 bottom-1 w-1 rounded-full bg-black/50 overflow-hidden">
                          <div className="figma-scroll-thumb-desktop w-full h-1/3 rounded-full bg-[#4f6bff]" />
                        </div>
                      </div>

                      {activeFrame === 0 && (
                        <>
                          <span className="figma-handle absolute -left-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -right-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -left-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -right-1 h-2 w-2 border border-[#0219EA] bg-white" />
                        </>
                      )}
                    </div>

                    {/* Artboard 03: Live Auto-Scrolling Mobile Viewport (390 × 844) */}
                    <div
                      onClick={() => setActiveFrame(2)}
                      className={`col-span-4 relative rounded-lg bg-neutral-900 p-1 transition-all cursor-pointer ${
                        activeFrame === 2
                          ? 'ring-2 ring-[#4f6bff] shadow-[0_0_28px_rgba(2,25,234,0.45)]'
                          : 'ring-1 ring-white/15 hover:ring-white/35'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 px-1">
                        <span
                          className={
                            activeFrame === 2
                              ? 'text-[#4f6bff] font-semibold'
                              : 'text-neutral-400'
                          }
                        >
                          # Mobile_390px
                        </span>
                        <span className="text-neutral-400">390 × 844</span>
                      </div>

                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-950">
                        <div className="figma-scroll-reel-mobile w-full flex flex-col">
                          <img
                            src={mobileImg}
                            alt={`${project.title} Mobile Top`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[9/16] object-cover object-top shrink-0"
                          />
                          <img
                            src={section1Img}
                            alt={`${project.title} Mobile Scroll`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[9/16] object-cover object-center shrink-0"
                          />
                        </div>
                      </div>

                      {activeFrame === 2 && (
                        <>
                          <span className="figma-handle absolute -left-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -right-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -left-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -right-1 h-2 w-2 border border-[#0219EA] bg-white" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Artboard 02A & Artboard 02B (Live Panning Section Slices) */}
                  <div className="relative z-10 grid grid-cols-2 gap-3.5 items-start">
                    <div
                      onClick={() => setActiveFrame(1)}
                      className={`relative rounded-lg bg-neutral-900 p-1 transition-all cursor-pointer ${
                        activeFrame === 1
                          ? 'ring-2 ring-[#4f6bff] shadow-[0_0_28px_rgba(2,25,234,0.45)]'
                          : 'ring-1 ring-white/15 hover:ring-white/35'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 px-1">
                        <span
                          className={
                            activeFrame === 1
                              ? 'text-[#4f6bff] font-semibold'
                              : 'text-neutral-400'
                          }
                        >
                          # Section_01_Flow
                        </span>
                        <span className="text-neutral-400">y: 920px</span>
                      </div>

                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-950">
                        <div className="figma-scroll-reel-sec1 w-full flex flex-col">
                          <img
                            src={section1Img}
                            alt={`${project.title} Section 1`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                          <img
                            src={section2Img}
                            alt={`${project.title} Section 2`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                        </div>
                      </div>

                      {activeFrame === 1 && (
                        <>
                          <span className="figma-handle absolute -left-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -right-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -left-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -right-1 h-2 w-2 border border-[#0219EA] bg-white" />
                        </>
                      )}
                    </div>

                    <div
                      onClick={() => setActiveFrame(3)}
                      className={`relative rounded-lg bg-neutral-900 p-1 transition-all cursor-pointer ${
                        activeFrame === 3
                          ? 'ring-2 ring-[#4f6bff] shadow-[0_0_28px_rgba(2,25,234,0.45)]'
                          : 'ring-1 ring-white/15 hover:ring-white/35'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 px-1">
                        <span
                          className={
                            activeFrame === 3
                              ? 'text-[#4f6bff] font-semibold'
                              : 'text-neutral-400'
                          }
                        >
                          # Section_02_Flow
                        </span>
                        <span className="text-neutral-400">y: 1900px</span>
                      </div>

                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-950">
                        <div className="figma-scroll-reel-sec2 w-full flex flex-col">
                          <img
                            src={section2Img}
                            alt={`${project.title} Section 2`}
                            onError={(e) => {
                              e.currentTarget.src = project.image
                            }}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                          <img
                            src={project.image}
                            alt={`${project.title} Hero`}
                            className="w-full aspect-[16/10] object-cover object-top shrink-0"
                          />
                        </div>
                      </div>

                      {activeFrame === 3 && (
                        <>
                          <span className="figma-handle absolute -left-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -right-1 -top-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -left-1 h-2 w-2 border border-[#0219EA] bg-white" />
                          <span className="figma-handle absolute -bottom-1 -right-1 h-2 w-2 border border-[#0219EA] bg-white" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* ============================================================
                      AGENTIC AI MULTIPLAYER POINTERS
                     ============================================================ */}
                  <div
                    aria-hidden="true"
                    className="figma-ai-cursor pointer-events-none absolute left-0 top-0 z-30"
                  >
                    <span className="figma-ai-ripple absolute -left-2 -top-2 h-5 w-5 rounded-full border border-[#4f6bff] bg-[#0219EA]/40 opacity-0" />
                    <svg
                      className="h-5 w-5 text-[#0219EA] drop-shadow-[0_2px_8px_rgba(2,25,234,0.9)]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    >
                      <path d="M3 2l17 9.5-7.5 2-2.5 7.5L3 2z" />
                    </svg>
                    <div className="ml-3.5 -mt-1 whitespace-nowrap rounded-lg border border-[#4f6bff]/70 bg-[#0219EA] px-2.5 py-1 text-[10px] font-mono font-semibold text-white shadow-[0_8px_20px_rgba(2,25,234,0.65)]">
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      AI Agent • {agentStatus}
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="figma-arch-cursor pointer-events-none absolute left-0 top-0 z-20 hidden sm:block"
                  >
                    <svg
                      className="h-4 w-4 text-emerald-400 drop-shadow-[0_2px_6px_rgba(16,185,129,0.7)]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    >
                      <path d="M3 2l17 9.5-7.5 2-2.5 7.5L3 2z" />
                    </svg>
                    <div className="ml-3 -mt-1 whitespace-nowrap rounded-md border border-emerald-400/50 bg-neutral-950/90 px-2 py-0.5 text-[10px] font-mono text-emerald-300 shadow-lg">
                      KramZ • Architect
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Figma Variable Inspector (Synced Active Token Highlighting) */}
            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between gap-6 bg-neutral-950/25">
              {/* Color Palette Variables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Color Variables
                  </h3>
                  <span className="text-[11px] font-mono text-[#4f6bff]">
                    {caseStudy.colorPalette[activeColorIdx]?.hex} Active
                  </span>
                </div>

                {/* Animated Spectrum Bar */}
                <div className="flex h-3 w-full overflow-hidden rounded-full border border-white/15">
                  {caseStudy.colorPalette.map((swatch, idx) => (
                    <div
                      key={`bar-${swatch.hex}-${swatch.name}`}
                      style={{ backgroundColor: swatch.hex }}
                      className={`figma-spectrum-seg flex-1 h-full transition-opacity ${
                        activeColorIdx === idx ? 'opacity-100' : 'opacity-75'
                      }`}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {caseStudy.colorPalette.map((swatch, idx) => {
                    const isCopied = copiedHex === swatch.hex
                    const isInspected = activeColorIdx === idx
                    return (
                      <button
                        key={`${swatch.name}-${swatch.hex}`}
                        type="button"
                        onClick={() => handleCopyHex(swatch.hex, idx)}
                        className={`text-left rounded-xl border p-2.5 transition-all cursor-pointer flex items-center gap-2.5 ${
                          isInspected
                            ? 'border-[#4f6bff] bg-[#0219EA]/20 shadow-[0_0_18px_rgba(2,25,234,0.3)] scale-[1.01]'
                            : 'border-white/10 bg-white/[0.03] hover:border-[#0219EA]/60'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: swatch.hex }}
                          className="h-8 w-8 rounded-lg border border-white/20 shrink-0 shadow-inner"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white truncate">
                              {swatch.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#4f6bff] shrink-0">
                              {isCopied ? 'Copied' : swatch.hex}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 truncate">
                            {swatch.role}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Typography Styles (Synced Active Font Highlighting) */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Typography</h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {caseStudy.typography[activeFontIdx]?.family}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {caseStudy.typography.map((font, idx) => {
                    const isFontActive = activeFontIdx === idx
                    return (
                      <div
                        key={font.role}
                        onClick={() => setActiveFontIdx(idx)}
                        className={`rounded-xl border px-3.5 py-2.5 transition-all cursor-pointer flex items-center gap-3.5 ${
                          isFontActive
                            ? 'border-[#4f6bff] bg-[#0219EA]/20 shadow-[0_0_18px_rgba(2,25,234,0.25)]'
                            : 'border-white/10 bg-white/[0.03] hover:border-[#0219EA]/60'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                            isFontActive
                              ? 'border-[#4f6bff] bg-[#0219EA] text-white'
                              : 'border-white/10 bg-neutral-950/70 text-[#4f6bff]'
                          }`}
                        >
                          Aa
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#4f6bff]">
                              {font.role}
                            </span>
                            <span className="font-mono text-neutral-400">
                              {font.weights}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-white truncate">
                            {font.family}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {font.styleNote}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
