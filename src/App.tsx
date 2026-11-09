import { useState } from 'react'
import {
  SiAnthropic,
  SiClaude,
  SiDocker,
  SiFastapi,
  SiGithub,
  SiGooglecloud,
  SiGraphql,
  SiJavascript,
  SiLangchain,
  SiMake,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiZapier,
} from 'react-icons/si'
import ContactModal from './components/ContactModal'
import EntranceLoader from './components/EntranceLoader'
import ScrollHero from './components/ScrollHero'
import AnimatedContent from './components/react-bits/AnimatedContent'
import LetterGlitch from './components/react-bits/LetterGlitch'
import LogoLoop, { type LogoItem } from './components/react-bits/LogoLoop'
import MagicBento, { type MagicBentoItem } from './components/react-bits/MagicBento'
import MagicRings from './components/react-bits/MagicRings'
import SpotlightCard from './components/react-bits/SpotlightCard'
import StarBorder from './components/react-bits/StarBorder'
import { portfolioData } from './data/portfolio'

const TOOL_LOGOS: LogoItem[] = [
  {
    node: (
      <svg className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4.5 4.5 0 0 0-3.89 2.25L4.5 10.5a4.5 4.5 0 0 0 0 4.5l3.61 6.25a4.5 4.5 0 0 0 7.78 0l3.61-6.25a4.5 4.5 0 0 0 0-4.5L15.89 4.25A4.5 4.5 0 0 0 12 2Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'OpenAI',
    href: 'https://openai.com',
    hoverColor: '#10a37f',
  },
  { node: <SiClaude />, title: 'Claude AI', href: 'https://claude.ai', hoverColor: '#d97757' },
  { node: <SiAnthropic />, title: 'Anthropic', href: 'https://www.anthropic.com', hoverColor: '#fbbf24' },
  { node: <SiN8N />, title: 'n8n', href: 'https://n8n.io', hoverColor: '#ea4b71' },
  { node: <SiMake />, title: 'Make', href: 'https://www.make.com', hoverColor: '#a855f7' },
  { node: <SiZapier />, title: 'Zapier', href: 'https://zapier.com', hoverColor: '#ff4a00' },
  { node: <SiLangchain />, title: 'LangChain', href: 'https://www.langchain.com', hoverColor: '#22d3ee' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org', hoverColor: '#3776ab' },
  { node: <SiFastapi />, title: 'FastAPI', href: 'https://fastapi.tiangolo.com', hoverColor: '#009688' },
  { node: <SiReact />, title: 'React', href: 'https://react.dev', hoverColor: '#61dafb' },
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org', hoverColor: '#ffffff' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org', hoverColor: '#f7df1e' },
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#5fa04e' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' },
  { node: <SiSupabase />, title: 'Supabase', href: 'https://supabase.com', hoverColor: '#3ecf8e' },
  { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org', hoverColor: '#60a5fa' },
  { node: <SiPrisma />, title: 'Prisma', href: 'https://www.prisma.io', hoverColor: '#818cf8' },
  { node: <SiGraphql />, title: 'GraphQL', href: 'https://graphql.org', hoverColor: '#e10098' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com', hoverColor: '#2496ed' },
  { node: <SiGooglecloud />, title: 'Google Cloud', href: 'https://cloud.google.com', hoverColor: '#4285f4' },
  { node: <SiVercel />, title: 'Vercel', href: 'https://vercel.com', hoverColor: '#ffffff' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com/kramzzzy', hoverColor: '#ffffff' },
]

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

export default function App() {
  const [contactOpen, setContactOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedFrames, setLoadedFrames] = useState(0)
  const [totalFrames, setTotalFrames] = useState(180)
  const {
    profile,
    services,
    projects,
    experience,
    education,
    coreCompetencies,
    skillMetrics,
  } = portfolioData

  // MagicBento items for "About Me & Core AI / Web Capabilities"
  const aboutBentoItems: MagicBentoItem[] = [
    {
      id: 'about-profile',
      colSpan: 2,
      rowSpan: 2,
      content: (
        <div className="flex h-full flex-col justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-start flex-1 min-h-0">
            {/* Left Column: Portrait Photo + Name & Subtitle underneath */}
            <div className="sm:col-span-5 flex flex-col gap-2.5">
              <div className="w-36 sm:w-full max-w-[185px] aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-[0_8px_24px_rgba(0,0,0,0.45)] shrink-0">
                <img
                  src={profile.aboutImage}
                  alt={profile.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {profile.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-medium text-[#4f6bff] leading-snug">
                  {profile.tagline}
                </p>
              </div>
            </div>

            {/* Right Column: Summary / Bio Text */}
            <div className="sm:col-span-7 flex flex-col justify-center h-full">
              <p className="text-xs sm:text-[13.5px] text-neutral-300 leading-relaxed">
                {profile.summary}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2.5 border-t border-white/10 shrink-0">
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div className="text-lg sm:text-xl font-bold font-mono text-[#0219EA] drop-shadow-[0_0_12px_rgba(59,85,255,0.65)]">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'svc-automation',
      title: services[0].label,
      description: services[0].description,
      visual: 'automation',
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 'svc-integration',
      title: services[1].label,
      description: services[1].description,
      visual: 'integration',
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 'svc-web-dev',
      title: services[2].label,
      description: services[2].description,
      visual: 'dashboard',
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 'svc-ui-ux',
      title: services[3].label,
      description: services[3].description,
      visual: 'analytics',
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 'svc-security',
      title: 'Resilient Cloud & API Security',
      description:
        'Authenticated webhooks, rate-limited LLM pipelines, and fault-tolerant data synchronization.',
      visual: 'security',
      colSpan: 1,
      rowSpan: 1,
    },
  ]

  // MagicBento items for "Experience, Competencies, Skill Metrics & Education"
  const experienceBentoItems: MagicBentoItem[] = [
    {
      id: 'career-timeline',
      colSpan: 2,
      rowSpan: 2,
      content: (
        <div className="flex h-full flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Career Track Record</h3>
            <span className="text-[11px] font-mono text-neutral-400">
              2016 — PRESENT
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto pr-1">
            {experience.map((e) => (
              <div
                key={`${e.company}-${e.period}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:border-[#0219EA]/60 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {e.company}
                  </h4>
                  <p className="text-xs text-[#4f6bff]">{e.role}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-[11px] font-mono text-neutral-300">
                    {e.period}
                  </p>
                  <p className="text-[10px] text-neutral-500">{e.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'core-competencies',
      colSpan: 1,
      rowSpan: 1,
      content: (
        <div className="flex h-full flex-col justify-between gap-1.5">
          <h3 className="text-sm font-bold text-white">Core Competencies</h3>
          <div className="space-y-2 overflow-y-auto pr-1">
            {coreCompetencies.map((group) => (
              <div key={group.title} className="space-y-1">
                <h4 className="text-[11px] font-semibold text-[#4f6bff]">
                  {group.title}
                </h4>
                <ul className="space-y-0.5">
                  {group.skills.slice(0, 3).map((skill) => (
                    <li
                      key={skill}
                      className="text-[11px] text-neutral-300 flex items-center gap-1.5"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#0219EA] shrink-0" />
                      <span className="truncate">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'education-credentials',
      image: profile.credentialsImage,
      title: education[1].degree,
      description: `${education[0].degree} • ${education[0].school}`,
      colSpan: 1,
      rowSpan: 2,
    },
    {
      id: 'skill-metrics',
      colSpan: 1,
      rowSpan: 1,
      content: (
        <div className="flex h-full flex-col justify-between gap-2">
          <h3 className="text-sm font-bold text-white">Stack Proficiency</h3>
          <div className="space-y-2">
            {skillMetrics.map((metric) => (
              <div key={metric.name} className="space-y-0.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-neutral-200">{metric.name}</span>
                  <span className="text-[#4f6bff]">{metric.percentage}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0219EA]"
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <EntranceLoader
        loadedFrames={loadedFrames}
        totalFrames={totalFrames}
        onComplete={() => setIsLoading(false)}
      />

      <ScrollHero
        onOpenContact={() => setContactOpen(true)}
        isModalOpen={contactOpen}
        isLoading={isLoading}
        onLoadProgress={(loaded, total) => {
          setLoadedFrames(loaded)
          setTotalFrames(total)
        }}
      />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      {/* Top Section: Seamless In-Place Hero-to-MagicRings Cross-Dissolve + LogoLoop + About Bento Grid */}
      <div className="relative isolate z-20 -mt-[105vh] pt-[36vh] w-full overflow-hidden pointer-events-none">
        <div
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 14%, #000 32%, #000 84%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 14%, #000 32%, #000 84%, transparent 100%)',
          }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <MagicRings
            color="#0219EA"
            colorTwo="#3b55ff"
            motion="pulse"
            ringCount={8}
            speed={1.05}
            lineThickness={2.2}
            glow={1.25}
            baseRadius={0.3}
            radiusStep={0.095}
            hoverScale={1.2}
            clickBurst={true}
            maxDevicePixelRatio={1.5}
          />
        </div>

        <div className="relative z-10 pointer-events-auto">
          {/* Emerging Energy Stage + Tools, AI & Software LogoLoop Band before Bento Grid */}
          <AnimatedContent
            distance={55}
            direction="vertical"
            duration={0.8}
            delay={0.06}
            ease="power3.out"
            threshold={0.18}
            trigger="scroll"
            once={false}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16 text-neutral-300">
              <LogoLoop
                logos={TOOL_LOGOS}
                speed={90}
                direction="left"
                logoHeight={28}
                gap={52}
                hoverSpeed={0}
                scaleOnHover
                magnify={0.35}
                labels="inline"
                muted={0.25}
                fadeOut
                fadeOutWidth={0.12}
                ariaLabel="AI, automation, and web engineering tools"
              />
            </div>
          </AnimatedContent>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
            {/* About Me & Core Capabilities MagicBento Section */}
            <section id="about" className="scroll-mt-24 space-y-8">
              <AnimatedContent
                distance={50}
                direction="vertical"
                duration={0.75}
                delay={0.18}
                ease="power3.out"
                threshold={0.22}
                trigger="scroll"
                once={false}
              >
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    About Mark Anthony Ebio
                  </h2>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={85}
                direction="vertical"
                duration={0.8}
                delay={0.28}
                ease="power3.out"
                stagger={0.14}
                threshold={0.18}
                trigger="scroll"
                once={false}
              >
                <MagicBento
                  items={aboutBentoItems}
                  columns={4}
                  rowHeight={220}
                  gap={14}
                  radius={20}
                  glowColor="#0219EA"
                  enableBorderGlow={true}
                  enableSpotlight={true}
                  spotlightRadius={320}
                  enableStars={true}
                  clickEffect={true}
                  textAutoHide={false}
                  intro={false}
                />
              </AnimatedContent>
            </section>
          </div>
        </div>
      </div>

      {/* Selected Web & AI Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <section id="works" className="scroll-mt-24 space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Selected Web &amp; AI Projects
            </h2>
          </div>

          <AnimatedContent
            distance={90}
            direction="vertical"
            duration={0.85}
            ease="power3.out"
            stagger={0.1}
            threshold={0.12}
            trigger="scroll"
            once={false}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {projects.map((p, idx) => {
              const v = STAR_VARIANTS[idx % STAR_VARIANTS.length]
              return (
                <SpotlightCard
                  key={p.title}
                  spotlightColor={v.color}
                  intensity={0.18}
                  borderGlow={0.75}
                  className="!p-0 !rounded-2xl overflow-hidden border border-white/10 flex flex-col"
                >
                  <div className="h-56 w-full overflow-hidden bg-neutral-900 border-b border-white/10">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#4f6bff]">
                        {p.category}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {p.title}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                    <div>
                      <StarBorder
                        as="a"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
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
                        className="!px-4 !py-2.5 text-xs font-mono uppercase tracking-wider"
                      >
                        Launch Live Site ↗
                      </StarBorder>
                    </div>
                  </div>
                </SpotlightCard>
              )
            })}
          </AnimatedContent>
        </section>
      </div>

      {/* Bottom Section: Experience, Skills & Engineering Stack with LetterGlitch Background */}
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
            speed={1}
            flow={0.5}
            edgeFade={0.18}
            centerFade={0.15}
            clickEffect="tear"
            dpr={1.5}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24">
          <section id="experience" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Experience, Skills &amp; Engineering Stack
              </h2>
            </div>

            <AnimatedContent
              distance={90}
              direction="vertical"
              duration={0.85}
              ease="power3.out"
              stagger={0.09}
              threshold={0.12}
              trigger="scroll"
              once={false}
            >
              <MagicBento
                items={experienceBentoItems}
                columns={4}
                rowHeight={225}
                gap={14}
                radius={20}
                glowColor="#0219EA"
                enableBorderGlow={true}
                enableSpotlight={true}
                spotlightRadius={320}
                enableStars={true}
                clickEffect={true}
                intro={false}
              />
            </AnimatedContent>

            {/* Direct Contact Card */}
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
                id="contact"
                className="scroll-mt-24 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_36px_rgba(0,0,0,0.4)] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
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
                  onClick={() => setContactOpen(true)}
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
                  className="!px-5 !py-2.5 text-xs font-semibold"
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
            </AnimatedContent>
          </section>
        </div>
      </div>
    </div>
  )
}
