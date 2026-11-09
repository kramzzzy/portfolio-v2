import { useEffect, useRef, useState } from 'react'
import { animate, createScope, createSpring, stagger } from 'animejs'
import { portfolioData, type ProjectItem } from '../data/portfolio'
import FigmaDesignCanvas from './FigmaDesignCanvas'
import AnimatedContent from './react-bits/AnimatedContent'
import DecryptedText from './react-bits/DecryptedText'
import LetterGlitch from './react-bits/LetterGlitch'
import MagicRings from './react-bits/MagicRings'
import SpotlightCard from './react-bits/SpotlightCard'
import StarBorder from './react-bits/StarBorder'
import TextType from './react-bits/TextType'

interface ProjectCaseStudyPageProps {
  project: ProjectItem
  projectIndex: number
  totalProjects: number
  isModalOpen: boolean
  onBackToHome: () => void
  onOpenAllProjects: () => void
  onSelectProject: (nextIndex: number) => void
  onOpenContact: () => void
}

const TERMINAL_STEP_FILES = [
  '01_architecture.sh',
  '02_design_system.tsx',
  '03_conversion_flow.py',
] as const

const GLASS_CONTAINER =
  'rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_36px_rgba(0,0,0,0.4)]'

export default function ProjectCaseStudyPage({
  project,
  projectIndex,
  totalProjects,
  isModalOpen,
  onBackToHome,
  onOpenAllProjects,
  onSelectProject,
  onOpenContact,
}: ProjectCaseStudyPageProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const processSectionRef = useRef<HTMLElement>(null)
  const [terminalRunId, setTerminalRunId] = useState(0)
  const [processInView, setProcessInView] = useState(false)
  const { profile, projects } = portfolioData
  const { caseStudy } = project

  const prevIndex = (projectIndex - 1 + totalProjects) % totalProjects
  const nextIndex = (projectIndex + 1) % totalProjects
  const prevProject = projects[prevIndex]
  const nextProject = projects[nextIndex]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    if (!pageRef.current) return

    const scope = createScope({ root: pageRef.current }).add(() => {
      animate('.cs-page-hero', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        ease: createSpring({ stiffness: 210, damping: 20 }),
      })

      animate('.cs-metric-bar', {
        scaleX: [0.15, 1],
        opacity: [0.4, 1],
        duration: 900,
        delay: stagger(140, { start: 220 }),
        ease: 'outCubic',
      })

      animate('.cs-telemetry-dot', {
        scaleY: [0.35, 1, 0.45],
        opacity: [0.5, 1, 0.5],
        duration: 1400,
        delay: stagger(120),
        ease: 'inOutSine',
        loop: true,
      })

      // Continuous out-of-phase floating motion on the 3 offset Terminal cards
      animate('.cs-terminal-float', {
        translateY: [-4, 4],
        duration: 2400,
        delay: stagger(650),
        alternate: true,
        ease: 'inOutSine',
        loop: true,
      })
    })

    return () => scope.revert()
  }, [project.slug])

  // Re-trigger terminal typing animation whenever Process & Solutions scrolls into view
  useEffect(() => {
    const el = processSectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessInView(true)
          setTerminalRunId((prev) => prev + 1)
        } else {
          setProcessInView(false)
        }
      },
      { threshold: 0.18 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [project.slug])

  useEffect(() => {
    if (isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onSelectProject(prevIndex)
      } else if (e.key === 'ArrowRight') {
        onSelectProject(nextIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, prevIndex, nextIndex, onSelectProject])

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-[#0219EA] selection:text-white"
    >
      {/* Sticky Glass Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Icon-Only Home & All Projects Buttons + Project Title */}
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
              {project.title}
            </span>
          </div>

          {/* Right: Icon-Only Prev / Next + Launch Live Site */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectProject(prevIndex)}
              aria-label={`Previous project: ${prevProject.title}`}
              title={`Previous: ${prevProject.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer"
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => onSelectProject(nextIndex)}
              aria-label={`Next project: ${nextProject.title}`}
              title={`Next: ${nextProject.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer"
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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <StarBorder
              as="a"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
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
              className="!px-4 !py-2 text-xs font-mono uppercase tracking-wider"
            >
              Launch Live Site ↗
            </StarBorder>
          </div>
        </div>
      </header>

      {/* Upper Section with MagicRings Background */}
      <div className="relative isolate w-full overflow-hidden">
        <div
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, #000 24%, #000 82%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, #000 24%, #000 82%, transparent 100%)',
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 space-y-14">
          {/* 1. Refined Hero + Unified Glass Showcase Card */}
          <div className="cs-page-hero space-y-7">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono uppercase tracking-wider">
                <span className="text-[#4f6bff]">{project.category}</span>
                <span className="text-white/20">•</span>
                <span className="text-neutral-400">{caseStudy.role}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                {project.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {caseStudy.executiveSummary}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {caseStudy.architectureStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-mono text-neutral-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Unified Glass Showcase Container */}
            <SpotlightCard
              spotlightColor="#0219EA"
              intensity={0.18}
              borderGlow={0.75}
              className="!p-0 !rounded-2xl overflow-hidden border border-white/10"
            >
              <div>
                <div className="w-full overflow-hidden bg-neutral-900/60 border-b border-white/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full max-h-[520px] object-cover object-top"
                  />
                </div>

                <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:divide-x sm:divide-white/10">
                  {caseStudy.impactMetrics.map((m, idx) => (
                    <div
                      key={m.label}
                      className={idx > 0 ? 'sm:pl-6 space-y-2' : 'space-y-2'}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                          {m.label}
                        </span>
                        <div className="flex items-end gap-1 h-3">
                          <span className="cs-telemetry-dot w-1 h-full rounded-full bg-[#0219EA] origin-bottom" />
                          <span className="cs-telemetry-dot w-1 h-full rounded-full bg-[#4f6bff] origin-bottom" />
                          <span className="cs-telemetry-dot w-1 h-full rounded-full bg-[#0219EA] origin-bottom" />
                        </div>
                      </div>

                      <div className="text-base sm:text-lg font-bold text-white">
                        {m.delta}
                      </div>

                      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="cs-metric-bar h-full w-4/5 rounded-full bg-gradient-to-r from-[#0219EA] to-[#4f6bff] origin-left" />
                      </div>

                      <div className="text-xs text-[#4f6bff]">{m.after}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* 2. Scroll-Triggered Design System: Interactive Figma Canvas */}
          <AnimatedContent
            distance={75}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            threshold={0.12}
            trigger="scroll"
            once={false}
          >
            <section className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Design System
              </h2>

              <FigmaDesignCanvas project={project} />
            </section>
          </AnimatedContent>
        </div>
      </div>

      {/* Lower Section with LetterGlitch Background */}
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-14">
          {/* 3. Process & Solutions — Hero Section Animated Terminal Cards */}
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
            <section ref={processSectionRef} className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Process &amp; Solutions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {caseStudy.challengesAndSolutions.map((item, idx) => {
                  const offsetClass =
                    idx === 1 ? 'md:mt-6' : idx === 2 ? 'md:mt-12' : 'md:mt-0'
                  return (
                    <div
                      key={item.title}
                      className={`cs-terminal-float ${offsetClass}`}
                    >
                      <SpotlightCard
                        spotlightColor="#0219EA"
                        intensity={0.32}
                        borderGlow={0.95}
                        className="w-full !p-5 !rounded-2xl border border-[#0219EA]/45 font-mono min-w-0"
                      >
                        <div>
                          {/* Terminal Window Chrome (exact match to ScrollHero.tsx Act II) */}
                          <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-2.5 mb-3">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                            </div>
                            <span className="text-[11px] text-[#4f6bff] truncate">
                              {TERMINAL_STEP_FILES[idx % TERMINAL_STEP_FILES.length]}
                            </span>
                          </div>

                          {/* Terminal Command Header ($ + Continuous Staggered DecryptedText) */}
                          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white min-w-0">
                            <span className="text-[#0219EA] select-none shrink-0">
                              $
                            </span>
                            <span className="truncate sm:whitespace-normal">
                              {processInView ? (
                                <DecryptedText
                                  key={`cmd-${project.slug}-${idx}-${terminalRunId}`}
                                  text={item.title}
                                  animateOn="view"
                                  speed={35}
                                  sequential
                                  revealDirection="start"
                                  scrambleColor="#0219EA"
                                  loop={true}
                                  loopDelay={4800 + idx * 1600}
                                />
                              ) : (
                                <span>{item.title}</span>
                              )}
                            </span>
                          </div>

                          {/* Bottleneck Context Line */}
                          <div className="mt-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] text-neutral-400 leading-relaxed">
                            <span className="text-rose-400/90 select-none">
                              [issue]
                            </span>{' '}
                            {item.problem}
                          </div>

                          {/* Terminal Streaming Solution Output (Continuous Staggered TextType Loop) */}
                          <div className="relative mt-3 text-xs sm:text-[13px] text-blue-50/90 leading-relaxed">
                            <div
                              aria-hidden="true"
                              className="invisible select-none pointer-events-none"
                            >
                              &gt; {item.solution}
                            </div>
                            {processInView && (
                              <TextType
                                key={`out-${project.slug}-${idx}-${terminalRunId}`}
                                as="div"
                                text={item.solution}
                                prefix="> "
                                prefixColor="#0219EA"
                                typingSpeed={14}
                                deletingSpeed={7}
                                initialDelay={150 + idx * 1350}
                                pauseDuration={3400 + idx * 900}
                                loop={true}
                                showCursor={true}
                                cursorStyle="block"
                                cursorColor="#0219EA"
                                cursorBlinkDuration={0.55}
                                className="absolute inset-0 text-blue-50/90"
                              />
                            )}
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  )
                })}
              </div>
            </section>
          </AnimatedContent>

          {/* 4. Scroll-Triggered Next Phase Improvements */}
          <AnimatedContent
            distance={75}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            stagger={0.12}
            threshold={0.12}
            trigger="scroll"
            once={false}
          >
            <section className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Next Phase Improvements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudy.futureRoadmap.map((road) => (
                  <SpotlightCard
                    key={road.title}
                    spotlightColor="#0219EA"
                    intensity={0.18}
                    borderGlow={0.75}
                    className="!p-6 !rounded-2xl border border-white/10"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#4f6bff]">
                        {road.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {road.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {road.detail}
                      </p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </section>
          </AnimatedContent>

          {/* 5. Scroll-Triggered Direct Contact Glass Container */}
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
                  Need an AI workflow or web platform built?
                </h3>
                <p className="text-sm text-neutral-300">
                  Let&apos;s architect and deploy your custom automation pipeline or web application.
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

                <StarBorder
                  as="a"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#0219EA"
                  trailColor="#4f6bff"
                  backgroundColor="rgba(2, 25, 234, 0.16)"
                  textColor="#f1f5f9"
                  borderColor="rgba(2, 25, 234, 0.45)"
                  duration={4}
                  radius={12}
                  glow={0.6}
                  hover="lap"
                  clickPulse
                  className="!px-5 !py-2.5 text-xs font-mono"
                >
                  Launch Live Site ↗
                </StarBorder>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  )
}
