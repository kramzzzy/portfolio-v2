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

export interface ProjectItem {
  title: string
  category: string
  description: string
  image: string
  link: string
  previewUrl?: string
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
      title: 'Your Vatoni - Portfolio',
      category: 'WEB DEVELOPMENT',
      description:
        'A cutting-edge modern personal portfolio showcasing design and web development projects.',
      image: '/images/Portfolio.jpg',
      link: 'https://yourvatoni.cfd/',
      previewUrl: 'https://yourvatoni.cfd/',
    },
    {
      title: 'Elite Assistant',
      category: 'WEB & AI INTEGRATION',
      description:
        'Service platform combining human operational expertise with AI workflow efficiency.',
      image: '/images/elite-assistant.webp',
      link: 'https://elite-assistant.com/',
      previewUrl: 'https://elite-assistant.com/',
    },
    {
      title: 'KeyNest Properties',
      category: 'WEB DEVELOPMENT',
      description:
        'A Minnesota cash home buyer web platform with transparent real estate services, cash offers, foreclosure support, and flexible closings.',
      image: '/images/keynest-preview.png',
      link: 'https://keynestprop.com/',
      previewUrl: 'https://keynestprop.com/',
    },
    {
      title: 'Jae Brad Lee - Portfolio',
      category: 'WEB DEVELOPMENT',
      description:
        'A dark cyber-themed interactive web portfolio featuring media showcases and client production archives.',
      image: '/images/jblee-preview.png',
      link: 'https://jblee.pro/',
      previewUrl: 'https://jblee.pro/',
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
