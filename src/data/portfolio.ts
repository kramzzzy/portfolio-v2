import rawPortfolioData from './portfolio.json'

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
  ...rawPortfolioData,
  profile: {
    ...rawPortfolioData.profile,
    stats: [
      {
        value: Math.max(10, new Date().getFullYear() - 2016),
        suffix: '+',
        label: 'Years Experience',
      },
      ...rawPortfolioData.profile.stats.slice(1),
    ],
  },
  projects: rawPortfolioData.projects as ProjectItem[],
  services: rawPortfolioData.services as ServiceItem[],
  experience: rawPortfolioData.experience as ExperienceItem[],
  education: rawPortfolioData.education as EducationItem[],
  coreCompetencies: rawPortfolioData.coreCompetencies as CompetencyGroup[],
  skillMetrics: rawPortfolioData.skillMetrics as SkillMetric[],
}
