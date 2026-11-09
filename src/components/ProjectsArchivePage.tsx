import { useEffect, useRef, useState } from 'react'
import { animate, createScope, createSpring, stagger } from 'animejs'
import { portfolioData } from '../data/portfolio'
import LetterGlitch from './react-bits/LetterGlitch'
import MagicRings from './react-bits/MagicRings'
import SpotlightCard from './react-bits/SpotlightCard'
import StarBorder from './react-bits/StarBorder'

interface ProjectsArchivePageProps {
  isModalOpen: boolean
  onBackToHome: () => void
  onSelectProject: (index: number) => void
  onOpenContact: () => void
}

const STAR_VARIANTS = [
  {
    color: '#0219EA',
    trailColor: '#3b55ff',
    backgroundColor: 'rgba(2, 25, 234, 0.22)',
    textColor: '#ffffff',
    borderColor: 'rgba(2, 25, 234, 0.55)',
  },
  {
    color: '#0219EA',
    trailColor: '#4f6bff',
    backgroundColor: 'rgba(2, 25, 234, 0.16)',
    textColor: '#f1f5f9',
    borderColor: 'rgba(2, 25, 234, 0.45)',
  },
  {
    color: '#0219EA',
    trailColor: '#3b55ff',
    backgroundColor: 'rgba(2, 25, 234, 0.2)',
    textColor: '#ffffff',
    borderColor: 'rgba(2, 25, 234, 0.5)',
  },
] as const

export default function ProjectsArchivePage({
  isModalOpen,
  onBackToHome,
  onSelectProject,
  onOpenContact,
}: ProjectsArchivePageProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const { profile, projects } = portfolioData

  const categories = [
    'ALL',
    ...Array.from(new Set(projects.map((p) => p.category))),
  ]

  const filteredProjects = projects
    .map((project, originalIndex) => ({ project, originalIndex }))
    .filter(
      ({ project }) =>
        selectedCategory === 'ALL' || project.category === selectedCategory
    )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  useEffect(() => {
    if (!pageRef.current) return

    const scope = createScope({ root: pageRef.current }).add(() => {
      animate('.proj-archive-hero', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 480,
        ease: createSpring({ stiffness: 210, damping: 20 }),
      })

      animate('.proj-archive-card', {
        opacity: [0, 1],
        translateY: [22, 0],
        duration: 440,
        delay: stagger(75, { start: 60 }),
        ease: 'outCubic',
      })
    })

    return () => scope.revert()
  }, [selectedCategory])

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-[#0219EA] selection:text-white"
    >
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
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

            <span className="hidden sm:inline text-white/15">|</span>

            <span className="hidden sm:inline text-xs font-medium text-neutral-400 truncate">
              All Projects &amp; Case Studies
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
              Start a Project ↗
            </StarBorder>
          </div>
        </div>
      </header>

      {/* Top Section with MagicRings Background */}
      <div className="relative isolate w-full overflow-hidden">
        <div
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, #000 25%, #000 82%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, #000 25%, #000 82%, transparent 100%)',
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 space-y-10">
          {/* Page Header & Category Filter */}
          <div className="proj-archive-hero flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="block text-xs font-mono uppercase tracking-wider text-[#4f6bff]">
                PROJECT ARCHIVE &amp; CASE STUDIES
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Selected Web &amp; AI Projects
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Explore complete case studies, extracted color &amp; typography systems, problem-to-solution engineering breakdowns, and client outcomes across every platform.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {categories.map((cat) => {
                const active = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      active
                        ? 'border-[#0219EA] bg-[#0219EA]/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_16px_rgba(2,25,234,0.35)]'
                        : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* All Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map(({ project: p, originalIndex }, idx) => {
              const v = STAR_VARIANTS[idx % STAR_VARIANTS.length]
              return (
                <SpotlightCard
                  key={p.slug}
                  spotlightColor={v.color}
                  intensity={0.18}
                  borderGlow={0.75}
                  className="proj-archive-card !p-0 !rounded-2xl overflow-hidden border border-white/10 flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => onSelectProject(originalIndex)}
                    aria-label={`Open ${p.title} case study`}
                    className="group h-64 w-full overflow-hidden bg-neutral-900 border-b border-white/10 text-left cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#4f6bff]">
                          {p.category}
                        </span>
                        <span className="text-xs font-mono font-semibold text-neutral-300">
                          {p.caseStudy.impactMetrics[0].delta}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {p.title}
                      </h2>

                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {p.caseStudy.executiveSummary}
                      </p>

                      {/* Color Palette Bar + Stack Preview */}
                      <div className="pt-2 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-2.5 flex-1 overflow-hidden rounded-full border border-white/15">
                            {p.caseStudy.colorPalette.map((swatch) => (
                              <span
                                key={`${p.slug}-${swatch.hex}`}
                                style={{ backgroundColor: swatch.hex }}
                                className="flex-1 h-full"
                                title={`${swatch.name} (${swatch.hex})`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                            {p.caseStudy.typography[0].family}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {p.caseStudy.architectureStack.slice(0, 4).map((tech) => (
                            <span
                              key={`${p.slug}-${tech}`}
                              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-neutral-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/10">
                      <StarBorder
                        as="button"
                        type="button"
                        onClick={() => onSelectProject(originalIndex)}
                        color={v.color}
                        trailColor={v.trailColor}
                        backgroundColor={v.backgroundColor}
                        textColor={v.textColor}
                        borderColor={v.borderColor}
                        duration={4}
                        radius={12}
                        glow={0.6}
                        hover="lap"
                        clickPulse
                        className="!px-4 !py-2.5 text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        View Case Study
                      </StarBorder>

                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors"
                      >
                        <span>Launch Live Site</span>
                        <span className="text-[#4f6bff]">↗</span>
                      </a>
                    </div>
                  </div>
                </SpotlightCard>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section with LetterGlitch Background + Contact CTA */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_36px_rgba(0,0,0,0.4)] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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
                color={STAR_VARIANTS[0].color}
                trailColor={STAR_VARIANTS[0].trailColor}
                backgroundColor={STAR_VARIANTS[0].backgroundColor}
                textColor={STAR_VARIANTS[0].textColor}
                borderColor={STAR_VARIANTS[0].borderColor}
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
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                color={STAR_VARIANTS[1].color}
                trailColor={STAR_VARIANTS[1].trailColor}
                backgroundColor={STAR_VARIANTS[1].backgroundColor}
                textColor={STAR_VARIANTS[1].textColor}
                borderColor={STAR_VARIANTS[1].borderColor}
                duration={4}
                radius={12}
                glow={0.6}
                hover="lap"
                clickPulse
                className="!px-5 !py-2.5 text-xs font-mono"
              >
                GitHub ↗
              </StarBorder>
              <StarBorder
                as="a"
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                color={STAR_VARIANTS[2].color}
                trailColor={STAR_VARIANTS[2].trailColor}
                backgroundColor={STAR_VARIANTS[2].backgroundColor}
                textColor={STAR_VARIANTS[2].textColor}
                borderColor={STAR_VARIANTS[2].borderColor}
                duration={4}
                radius={12}
                glow={0.6}
                hover="lap"
                clickPulse
                className="!px-5 !py-2.5 text-xs font-mono"
              >
                LinkedIn ↗
              </StarBorder>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
