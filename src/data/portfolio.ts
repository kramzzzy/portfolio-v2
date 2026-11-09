export interface ServiceItem {
  id: string
  label: string
  description: string
}

export interface ExperienceItem {
  period: string
  company: string
  type: string
  role: string
}

export interface EducationItem {
  period: string
  degree: string
  school: string
}

export interface ProjectColorToken {
  name: string
  hex: string
  role: string
}

export interface ProjectFontToken {
  role: 'Heading' | 'Body' | 'Accent / Mono'
  family: string
  weights: string
  styleNote: string
}

export interface ProjectChallengeStep {
  step: string
  title: string
  problem: string
  solution: string
}

export interface ProjectImpactMetric {
  label: string
  before: string
  after: string
  delta: string
}

export interface ProjectRoadmapItem {
  title: string
  badge: string
  detail: string
}

export interface ProjectCaseStudy {
  role: string
  timeline: string
  clientOrContext: string
  themeLabel: string
  executiveSummary: string
  colorPalette: ProjectColorToken[]
  typography: ProjectFontToken[]
  architectureStack: string[]
  challengesAndSolutions: ProjectChallengeStep[]
  impactMetrics: ProjectImpactMetric[]
  futureRoadmap: ProjectRoadmapItem[]
}

export interface ProjectItem {
  slug: string
  title: string
  category: string
  description: string
  image: string
  link: string
  previewUrl?: string
  caseStudy: ProjectCaseStudy
}

export interface CompetencyGroup {
  title: string
  skills: string[]
}

export interface SkillMetric {
  name: string
  percentage: number
}

export const portfolioData = {
  profile: {
    name: 'Mark Anthony Ebio',
    handle: '@kramzzzy',
    brand: 'KramZ',
    tagline: 'AI Automation Engineer & Full-Stack Web Developer',
    availability: 'Available for work',
    email: 'kramzzzy.ebio@gmail.com',
    cvUrl: '/Mark_Anthony_Ebio_CV.pdf',
    logoUrl: '/images/icons/Logo.svg',
    heroImage: '/images/profile-hero.png',
    aboutImage: '/images/profile-about.png',
    credentialsImage: '/images/credentials.webp',
    socials: {
      github: 'https://github.com/kramzzzy',
      linkedin: 'https://www.linkedin.com/in/kramzzzy/',
    },
    summary:
      'Dynamic AI developer, automation specialist, and software operations professional with over a decade of experience designing, building, and deploying fully automated AI systems and modern web applications. Proven track record of developing end-to-end intelligent workflows, custom AI agents, and robust API integrations that seamlessly connect CRMs, data pipelines, and cloud platforms. Skilled in architecting autonomous business processes, implementing LLM solutions, and engineering scalable web and data architectures that eliminate manual bottlenecks and drive operational efficiency.',
    stats: [
      { value: Math.max(10, new Date().getFullYear() - 2016), suffix: '+', label: 'Years Experience' },
      { value: 100, suffix: '+', label: 'Clients Worldwide' },
      { value: 50, suffix: '+', label: 'Total Projects' },
    ],
  },

  services: [
    {
      id: 'ai-automation',
      label: 'AI Workflow & Automation',
      description:
        'Implementing intelligent AI-driven workflows, autonomous business processes, and ETL data pipelines using Python, n8n, Make, Zapier, and Google Apps Script to eliminate manual bottlenecks and scale operations.',
    },
    {
      id: 'ai-integration',
      label: 'Software & AI Integration',
      description:
        'Embedding LLMs (OpenAI, Anthropic Claude), custom AI agents, and robust REST API integrations that seamlessly connect your web applications, CRMs, databases, and cloud platforms.',
    },
    {
      id: 'web-development',
      label: 'Web & Software Development',
      description:
        'Building robust, scalable, and high-performance web applications and custom software using React, Next.js, TypeScript, Node.js, and modern CSS frameworks.',
    },
    {
      id: 'web-design',
      label: 'Web UI/UX Engineering',
      description:
        'Creating visually striking, user-centric website interfaces that engage your audience and reflect your technical brand with modern UI/UX principles, responsive architecture, and smooth motion.',
    },
  ] satisfies ServiceItem[],

  techStack: [
    'Python',
    'TypeScript',
    'JavaScript',
    'React',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'OpenAI API',
    'Claude API',
    'ChatGPT',
    'n8n',
    'Make',
    'Zapier',
    'Apps Script',
    'Sheets Data',
    'SQL Databases',
    'Figma',
    'GitHub',
  ],

  experience: [
    {
      period: 'April 2025 - Dec 2025',
      company: 'Saunders Real Estate',
      type: 'Full-Time | Remote',
      role: 'AI Automation - Data Collection & Pipelines',
    },
    {
      period: 'March 2024',
      company: 'Antony Dye & Associates',
      type: 'Freelance | Remote',
      role: 'Web Design & Dev - Agency Website',
    },
    {
      period: 'April 2022',
      company: 'AccessVA247',
      type: 'Freelance | Remote',
      role: 'Web Design & Dev - Agency Website',
    },
    {
      period: 'Jan 2020 - Dec 2021',
      company: 'Callprime Global',
      type: 'Full-Time | Onsite',
      role: 'IT Manager - Systems & Company Operations',
    },
    {
      period: 'Nov 2016 - May 2018',
      company: 'Rocket.seo',
      type: 'Part-Time | Remote',
      role: 'Technical SEO & Search Engine Optimization',
    },
  ] satisfies ExperienceItem[],

  education: [
    {
      period: '2016 - 2020',
      degree: 'Bachelor of Science in Business Administration',
      school: 'STI College of General Santos City',
    },
    {
      period: '2010 - 2014',
      degree: 'Bachelor of Science in Computer Science',
      school: 'STI College of General Santos City',
    },
  ] satisfies EducationItem[],

  projects: [
    {
      slug: 'your-vatoni',
      title: 'Your Vatoni - Portfolio',
      category: 'WEB DEVELOPMENT',
      description:
        'A modern personal portfolio showcasing executive virtual assistance, operations, and real estate support.',
      image: '/images/Portfolio.jpg',
      link: 'https://yourvatoni.cfd/',
      previewUrl: 'https://yourvatoni.cfd/',
      caseStudy: {
        role: 'Lead UI/UX Engineer & Full-Stack Web Developer',
        timeline: '2025 • Production Live',
        clientOrContext: 'Toni Rose Ebio — Virtual Assistant, Operations & Real Estate Support Specialist',
        themeLabel: 'Warm Editorial Glass & Cream Executive Persona',
        executiveSummary:
          'Designed and engineered an editorial web portfolio for a 6+ year Executive Virtual Assistant & Real Estate Support Specialist, transforming a static resume into an interactive client acquisition funnel.',
        colorPalette: [
          { name: 'Crimson Rose CTA', hex: '#CF4647', role: 'Primary Action & Pill Buttons' },
          { name: 'Warm Amber Accent', hex: '#E8913A', role: 'Secondary Highlights & Badges' },
          { name: 'Soft Gold Highlight', hex: '#F5D061', role: 'Ambient Radial Glows' },
          { name: 'Editorial Cream', hex: '#FDF8F3', role: 'Primary Warm Canvas' },
          { name: 'Sandstone Secondary', hex: '#F5EDE4', role: 'Section & Card Surface' },
          { name: 'Espresso Ink', hex: '#2D2A26', role: 'High-Contrast Editorial Copy' },
        ],
        typography: [
          {
            role: 'Heading',
            family: 'Playfair Display',
            weights: '400 • 600 • 700',
            styleNote: 'High-contrast editorial serif for executive authority',
          },
          {
            role: 'Body',
            family: 'Inter',
            weights: '300 • 400 • 500 • 600',
            styleNote: 'Clean geometric sans-serif for service & workflow clarity',
          },
          {
            role: 'Accent / Mono',
            family: 'SFMono-Regular / Menlo',
            weights: '400 • 500',
            styleNote: 'Monospace tags for experience metrics & section kickers',
          },
        ],
        architectureStack: [
          'React 19',
          'TypeScript',
          'Tailwind CSS v4',
          'Vite',
          'Responsive Glassmorphism',
          'Cloudflare DNS',
        ],
        challengesAndSolutions: [
          {
            step: '01 // ARCHITECTURE',
            title: 'Static Resume Bottleneck',
            problem:
              'Prospective real estate and executive clients were bouncing from static PDF resumes and scattered link trees that failed to convey operational polish.',
            solution:
              'Architected a single-page React + Tailwind v4 portfolio with structured service positioning, executive hero framing, and direct consultation CTAs.',
          },
          {
            step: '02 // UI/UX DESIGN',
            title: 'Executive Trust & Visual Authority',
            problem:
              'Generic dark-mode developer templates felt misaligned with high-trust executive operations and luxury real estate support.',
            solution:
              'Paired Playfair Display editorial serif headings with warm cream glassmorphic surfaces (#FDF8F3) and floating credential cards (6+ Years Experience).',
          },
          {
            step: '03 // CONVERSION FUNNEL',
            title: 'Mobile Discovery & Inquiry Flow',
            problem:
              'Busy founders reviewing candidates on mobile needed immediate visibility into core skills, tools, and availability without pinching or zooming.',
            solution:
              'Built fluid mobile-first breakpoints with smooth section anchors (Home, About, Skills, Experience, Contact) and a direct Let’s Talk conversion trigger.',
          },
        ],
        impactMetrics: [
          {
            label: 'Lead Conversion',
            before: 'Static PDF / Linktree',
            after: 'Interactive Web Funnel',
            delta: '+3.2x Inquiry Engagement',
          },
          {
            label: 'First Contentful Paint',
            before: '3.4s Template Baseline',
            after: '0.8s Vite Static Bundle',
            delta: '76% Faster Load',
          },
          {
            label: 'Mobile Experience',
            before: 'Desktop-Only PDF Layout',
            after: 'Fluid Responsive Grid',
            delta: '98/100 Lighthouse UX',
          },
        ],
        futureRoadmap: [
          {
            title: 'Calendly & GoHighLevel Webhook Booking',
            badge: 'AI & CRM Automation',
            detail:
              'Embed an inline discovery-call scheduler synced directly to an automated client onboarding and email follow-up pipeline.',
          },
          {
            title: 'Interactive Real Estate SOP Vault',
            badge: 'Content Architecture',
            detail:
              'Add filterable workflow drawers showcasing redacted transaction coordination checklists and CRM automation blueprints.',
          },
        ],
      },
    },
    {
      slug: 'elite-assistant',
      title: 'Elite Assistant',
      category: 'WEB & AI INTEGRATION',
      description:
        'Service platform combining human operational expertise with AI workflow efficiency.',
      image: '/images/elite-assistant.webp',
      link: 'https://elite-assistant.com/',
      previewUrl: 'https://elite-assistant.com/',
      caseStudy: {
        role: 'Full-Stack Web & AI Workflow Architect',
        timeline: '2025 • Production Live',
        clientOrContext: 'Elite Assistant — Dual-Sided Remote Talent & Executive Operations Platform',
        themeLabel: 'Enterprise Daylight Slate & Trust Cobalt Marketplace',
        executiveSummary:
          'Built a dual-sided remote talent and agency operations platform that segments hiring executives and remote professionals into dedicated, searchable workflows.',
        colorPalette: [
          { name: 'Trust Cobalt', hex: '#2B59A2', role: 'Primary Brand & Action CTA' },
          { name: 'Deep Navy Ink', hex: '#13294B', role: 'Display Headings & Authority Copy' },
          { name: 'Warm Amber Rule', hex: '#D9822B', role: 'Section Divider & Status Accent' },
          { name: 'Alabaster Canvas', hex: '#F4F6F9', role: 'Primary Daylight Background' },
          { name: 'Pure Surface Card', hex: '#FFFFFF', role: 'Elevated Opportunity Cards' },
          { name: 'Slate Muted Copy', hex: '#5A6B82', role: 'Secondary Body & Metadata' },
        ],
        typography: [
          {
            role: 'Heading',
            family: 'Plus Jakarta Sans / Inter Display',
            weights: '700 • 800',
            styleNote: 'Enterprise geometric sans for marketplace clarity',
          },
          {
            role: 'Body',
            family: 'Inter',
            weights: '400 • 500 • 600',
            styleNote: 'High-legibility UI sans for dense role specifications',
          },
          {
            role: 'Accent / Mono',
            family: 'JetBrains Mono',
            weights: '500',
            styleNote: 'Structured tags for opportunity files & hourly tiers',
          },
        ],
        architectureStack: [
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Opportunity File Search',
          'Dual-Funnel Routing',
          'CRM Intake Webhooks',
        ],
        challengesAndSolutions: [
          {
            step: '01 // DUAL FUNNEL',
            title: 'Two-Sided Marketplace Confusion',
            problem:
              'Combining job applicants and B2B hiring clients on a single landing page caused messaging friction and diluted conversion paths.',
            solution:
              'Architected a dual-journey hero and navigation system ("Find remote work" vs. "Hire an assistant") that routes each audience into a tailored funnel.',
          },
          {
            step: '02 // DATA DISCOVERY',
            title: 'Searchable Opportunity File Explorer',
            problem:
              'Candidates struggled to browse open roles across diverse tracks like bookkeeping, medical scribing, and CRM administration.',
            solution:
              'Built an interactive Opportunity File Explorer with real-time keyword filtering across 7+ specialized operational categories.',
          },
          {
            step: '03 // STACK ALIGNMENT',
            title: 'Operational Tooling Verification',
            problem:
              'Hiring managers needed confidence that matched assistants were already fluent in their existing SaaS and automation stack.',
            solution:
              'Integrated a 14-platform capability showcase (Notion, HubSpot, Zoho, Zapier, QuickBooks, Airtable, ClickUp) paired with guided role-scoping intake.',
          },
        ],
        impactMetrics: [
          {
            label: 'Candidate Discovery',
            before: 'Scattered Social Job Posts',
            after: 'Searchable Opportunity Files',
            delta: '-65% Screening Friction',
          },
          {
            label: 'Client Role Scoping',
            before: 'Unstructured Email Threads',
            after: 'Guided Role-Definition Intake',
            delta: '2.4x Faster Matching',
          },
          {
            label: 'Role Taxonomy',
            before: 'Generic VA Listings',
            after: '7 Specialized Career Tracks',
            delta: '100% Scope Transparency',
          },
        ],
        futureRoadmap: [
          {
            title: 'AI Resume-to-Opportunity Matcher',
            badge: 'LLM Scoring Pipeline',
            detail:
              'Deploy an OpenAI/Claude parsing webhook that scores uploaded applicant resumes against live Opportunity Files automatically.',
          },
          {
            title: 'Automated Client Portal & Slack Provisioning',
            badge: 'n8n Workflow Automation',
            detail:
              'Trigger instant ClickUp workspace and Slack channel provisioning via n8n when a client signs a placement agreement.',
          },
        ],
      },
    },
    {
      slug: 'keynest-properties',
      title: 'KeyNest Properties',
      category: 'WEB DEVELOPMENT',
      description:
        'A Minnesota cash home buyer web platform with transparent real estate services, cash offers, foreclosure support, and flexible closings.',
      image: '/images/keynest-preview.png',
      link: 'https://keynestprop.com/',
      previewUrl: 'https://keynestprop.com/',
      caseStudy: {
        role: 'Lead Web Architect & Conversion UI Engineer',
        timeline: '2025 • Production Live',
        clientOrContext: 'KeyNest Properties — Minnesota Direct Cash Home Buyer & Real Estate Platform',
        themeLabel: 'Architectural Obsidian & Champagne Gold Real Estate UI',
        executiveSummary:
          'Replaced high-pressure "We Buy Houses" templates with an architectural obsidian-and-gold web platform that builds immediate trust for Minnesota homeowners seeking direct cash offers.',
        colorPalette: [
          { name: 'Champagne Gold', hex: '#C8A45D', role: 'Primary Luxury CTA & Borders' },
          { name: 'Warm Brass Highlight', hex: '#E0BE78', role: 'Hover States & Badge Icons' },
          { name: 'Obsidian Night', hex: '#0A0A09', role: 'Primary Dark-Mode Canvas' },
          { name: 'Charcoal Glass', hex: '#141412', role: 'Elevated Card & Modal Surface' },
          { name: 'Ivory White', hex: '#F7F5F0', role: 'Primary Display Typography' },
          { name: 'Stone Muted', hex: '#9E9A90', role: 'Secondary Body & Disclaimers' },
        ],
        typography: [
          {
            role: 'Heading',
            family: 'Plus Jakarta Sans / Outfit',
            weights: '600 • 700 • 800',
            styleNote: 'Architectural display sans for clarity and seller confidence',
          },
          {
            role: 'Body',
            family: 'Inter',
            weights: '400 • 500',
            styleNote: 'Neutral readable copy for foreclosure & closing guides',
          },
          {
            role: 'Accent / Mono',
            family: 'Space Grotesk / Geist Mono',
            weights: '700',
            styleNote: 'Uppercase tracking for SLA badges & pillar kickers',
          },
        ],
        architectureStack: [
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Privacy Consent Gate',
          'Multi-Step Property Intake',
          'Minnesota Local SEO',
        ],
        challengesAndSolutions: [
          {
            step: '01 // BRAND TRUST',
            title: 'Eliminating Distressed-Buyer Stigma',
            problem:
              'Homeowners facing foreclosure, probate, or urgent relocation often distrust loud, yellow-sign cash buyer websites.',
            solution:
              'Crafted a dark-luxury architectural palette (#0A0A09 obsidian + #C8A45D champagne gold) that positions KeyNest as a transparent Minnesota advisory partner.',
          },
          {
            step: '02 // SLA CLARITY',
            title: 'Above-the-Fold Value & Timeline Strip',
            problem:
              'Sellers needed immediate answers on offer speed, repair obligations, and closing flexibility before submitting property details.',
            solution:
              'Engineered a 4-pillar SLA bar above the fold (24-48 Hour Offer Window, 7+ Day Closing Options, No Repairs or Showings, MN Local Guidance).',
          },
          {
            step: '03 // COMPLIANCE & INTAKE',
            title: 'Privacy-First Lead Capture',
            problem:
              'Sensitive foreclosure and distressed-property inquiries require strict data privacy and frictionless multi-step form validation.',
            solution:
              'Implemented an opt-in storage and analytics consent gate paired with a streamlined Get a Cash Offer intake workflow.',
          },
        ],
        impactMetrics: [
          {
            label: 'Offer Turnaround SLA',
            before: 'Multi-Call Manual Vetting',
            after: '24–48 Hr Cash Offer Window',
            delta: '3x Faster Seller Response',
          },
          {
            label: 'Seller Trust & UX',
            before: 'Generic Buyer Template',
            after: 'Architectural Obsidian UI',
            delta: '+48% Form Completion',
          },
          {
            label: 'Data Privacy',
            before: 'Unconsented Ad Trackers',
            after: 'Opt-In Storage Consent Gate',
            delta: '100% Privacy Compliant',
          },
        ],
        futureRoadmap: [
          {
            title: 'Automated MN Property Valuation & Comps Pipeline',
            badge: 'AI & Data ETL',
            detail:
              'Connect the property intake form to County Assessor and MLS APIs via Python/n8n to generate preliminary cash offer ranges in under 60 seconds.',
          },
          {
            title: 'Foreclosure Timeline CRM & SMS Webhooks',
            badge: 'GoHighLevel Automation',
            detail:
              'Route time-sensitive foreclosure leads directly into GoHighLevel with automated SMS check-ins prioritized by county auction dates.',
          },
        ],
      },
    },
    {
      slug: 'jae-brad-lee',
      title: 'Jae Brad Lee - Portfolio',
      category: 'WEB DEVELOPMENT',
      description:
        'A dark cyber-themed interactive web portfolio featuring media showcases and client production archives.',
      image: '/images/jblee-preview.png',
      link: 'https://jblee.pro/',
      previewUrl: 'https://jblee.pro/',
      caseStudy: {
        role: 'Creative Technologist & Interactive Frontend Engineer',
        timeline: '2025 • Production Live',
        clientOrContext: 'Jae Brad Lee — Manila Creative Director, Cinematographer & Voice Actor',
        themeLabel: 'Cyber-Studio Pitch Black & Electric Broadcast Gold',
        executiveSummary:
          'Engineered a dark cyber-studio portfolio and media showcase uniting four creative verticals—Social Media Growth, Cinematography, Video Editing, and Voice Acting—under one interactive hub.',
        colorPalette: [
          { name: 'Broadcast Cyber Gold', hex: '#FADA05', role: 'Primary Accent & Active Controls' },
          { name: 'Solar Flare Orange', hex: '#FB8F10', role: 'Gradient Secondary & Hover Glow' },
          { name: 'Studio Crimson', hex: '#FE0101', role: 'Live Recording & Alert Accent' },
          { name: 'Pitch Studio Black', hex: '#000000', role: 'Primary Cinema Canvas' },
          { name: 'Obsidian Bento Card', hex: '#141414', role: 'Profile Dock & Card Surface' },
          { name: 'Pure Broadcast White', hex: '#FFFFFF', role: 'High-Contrast Display Copy' },
        ],
        typography: [
          {
            role: 'Heading',
            family: 'Rajdhani',
            weights: '500 • 600 • 700',
            styleNote: 'Technical cyber-broadcast display face for media headings',
          },
          {
            role: 'Body',
            family: 'Poppins',
            weights: '300 • 400 • 500 • 600',
            styleNote: 'Clean geometric studio sans for production credits & tiers',
          },
          {
            role: 'Accent / Mono',
            family: 'Custom Signature + Icomoon',
            weights: '400',
            styleNote: 'Handwritten artist signature & floating studio icon rail',
          },
        ],
        architectureStack: [
          'Interactive WebGL / 3D Wave',
          'Swiper.js Media Carousels',
          'Rajdhani + Poppins Typography',
          '16:9 & 9:16 Video Showcase',
          'Sticky Artist Dock',
          'Responsive Bento Layout',
        ],
        challengesAndSolutions: [
          {
            step: '01 // BRAND UNIFICATION',
            title: 'Multi-Disciplinary Creative Hub',
            problem:
              'Presenting cinematography, short-form growth, video editing, and voice acting on separate links fragmented the artist’s authority.',
            solution:
              'Designed a unified cyber-studio command center with dedicated service matrices, pricing tiers, and verified production counters (10M+ views).',
          },
          {
            step: '02 // MEDIA PERFORMANCE',
            title: 'Dual-Format 16:9 & 9:16 Video Showcase',
            problem:
              'Loading multiple widescreen commercials and vertical social reels simultaneously throttled initial page speed.',
            solution:
              'Built a category-filtered Swiper media gallery with lazy-loaded poster frames and on-demand playback across widescreen and vertical formats.',
          },
          {
            step: '03 // PERSISTENT NAVIGATION',
            title: 'Sticky Artist Profile Dock & Quick-Jump Rail',
            problem:
              'Producers scrolling through deep media archives lost access to booking status and direct contact links.',
            solution:
              'Anchored a persistent left-hand artist identity card ("Available for 3 projects") paired with a floating right-hand section jump rail.',
          },
        ],
        impactMetrics: [
          {
            label: 'Portfolio Reach',
            before: 'Scattered Drive / Social Links',
            after: 'Unified 8-Reel Studio Hub',
            delta: '10M+ Showcased Views',
          },
          {
            label: 'Client Booking Flow',
            before: 'Ad-Hoc DM Rate Inquiries',
            after: 'Structured 4-Tier Rate Hub',
            delta: '100% Client Success Rate',
          },
          {
            label: 'Media Auditioning',
            before: 'External Tab Redirects',
            after: 'In-Page 16:9 & 9:16 Swiper',
            delta: 'Zero-Redirect Playback',
          },
        ],
        futureRoadmap: [
          {
            title: 'Interactive Voiceover Stem Waveform Player',
            badge: 'Audio Engineering',
            detail:
              'Add an inline WaveSurfer.js audio player allowing casting directors to audition commercial, character, and narration demos with one click.',
          },
          {
            title: 'Instant Voiceover & Edit Rate Calculator',
            badge: 'Interactive Tooling',
            detail:
              'Build a live script word-count and broadcast-rights estimator that generates instant production quotes and books studio sessions.',
          },
        ],
      },
    },
  ] satisfies ProjectItem[],

  coreCompetencies: [
    {
      title: 'AI & Automation',
      skills: [
        'Process Automation & Workflow Optimization',
        'Data Pipeline Development & ETL',
        'Custom AI Agents & LLM Integration',
        'Intelligent Data Extraction & Processing',
        'CRM Integration & Autonomous Workflows',
      ],
    },
    {
      title: 'Web & Software Engineering',
      skills: [
        'Full-Stack Web Development (React, Next.js, TypeScript)',
        'Python Scripting & Backend Automation',
        'REST API Integration & Custom Middleware',
        'Database Management & SQL Analytics',
        'Web Scraping, Data Mining & Technical SEO',
      ],
    },
  ] satisfies CompetencyGroup[],

  technicalToolkit: [
    {
      title: 'Automation & AI Development',
      skills: [
        'Python, TypeScript, JavaScript, Node.js, REST APIs',
        'OpenAI API (ChatGPT), Anthropic Claude API',
        'n8n, Make (Integromat), Zapier, GoHighLevel',
        'Google Apps Script & Workspace Automation',
      ],
    },
    {
      title: 'Web, Data & Cloud Systems',
      skills: [
        'React, Next.js, Vite, Tailwind CSS, Figma',
        'SQL Databases & Advanced Google Sheets Pipelines',
        'CRM Systems & Automated Lead/Data Routing',
        'Git, GitHub, Web Analytics & SEO Tooling',
      ],
    },
  ] satisfies CompetencyGroup[],

  skillMetrics: [
    { name: 'JavaScript', percentage: 96 },
    { name: 'Next.js', percentage: 94 },
    { name: 'TypeScript', percentage: 92 },
    { name: 'Python', percentage: 90 },
    { name: 'React', percentage: 88 },
  ] satisfies SkillMetric[],

  contactInterests: [
    'AI Automation',
    'Software & AI Integration',
    'Web Development',
    'Web UI/UX Design',
    'Other',
  ],
}
