import { randomUUID } from "crypto";

import type {
  Project,
  Skill,
  PerformanceMetric,
  CaseStudy,
  Tag,
  Experience,
  Contact,
  KpiMetric,
} from "@/lib/schemas";
import {
  ProjectStatus,
  SkillCategory,
  ProficiencyLevel,
  MetricType,
  DeltaDirection,
  CaseStudyType,
  PublicationStatus,
  TagType,
  ContactType,
  ContactStatus,
  Location,
  MarketSegment,
} from "@/types/enums";

/**
 * Nomes realistas de empresas brasileiras e internacionais
 */
const COMPANY_NAMES = [
  "Nubank",
  "Stone Pagamentos",
  "iFood",
  "MercadoLivre",
  "QuintoAndar",
  "Creditas",
  "Vtex",
  "Resultados Digitais",
  "Conta Azul",
  "Loggi",
  "Banco Inter",
  "PagSeguro",
  "B2W Digital",
  "Americanas S.A.",
  "Magazine Luiza",
] as const;

/**
 * Tecnologias realistas
 */
const TECHNOLOGIES = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Tailwind CSS",
  "Jest",
  "Vitest",
  "Playwright",
  "Prisma",
] as const;

/**
 * Factory para criar Projects com dados realistas
 */
export function createProject(overrides?: Partial<Project>): Project {
  const id = randomUUID();
  const title = overrides?.title ?? "E-commerce Headless";
  const slug =
    overrides?.slug ?? title.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    title,
    slug,
    description:
      overrides?.description ??
      "Plataforma de comércio eletrônico com arquitetura headless e CMS customizado.",
    status: overrides?.status ?? ProjectStatus.COMPLETED,
    featured: overrides?.featured ?? false,
    tags: overrides?.tags ?? ["ecommerce", "headless", "cms"],
    technologies:
      overrides?.technologies ?? ["Next.js", "TypeScript", "Prisma"],
    startDate: overrides?.startDate ?? new Date("2023-01-15"),
    endDate: overrides?.endDate ?? new Date("2023-06-30"),
    githubUrl: overrides?.githubUrl ?? "https://github.com/example/project",
    liveUrl: overrides?.liveUrl ?? "https://example.com",
    imageUrl: overrides?.imageUrl ?? "https://placehold.co/800x600",
    screenshots: overrides?.screenshots ?? [],
    metrics: overrides?.metrics,
    createdAt: overrides?.createdAt ?? new Date("2023-01-15"),
    updatedAt: overrides?.updatedAt ?? new Date(),
  };
}

/**
 * Factory para criar Skills
 */
export function createSkill(overrides?: Partial<Skill>): Skill {
  return {
    id: randomUUID(),
    name: overrides?.name ?? "TypeScript",
    category: overrides?.category ?? SkillCategory.FRONTEND,
    level: overrides?.level ?? ProficiencyLevel.ADVANCED,
    yearsOfExperience: overrides?.yearsOfExperience ?? 3,
    iconUrl: overrides?.iconUrl ?? "https://placehold.co/64x64",
    description: overrides?.description ?? "Linguagem tipada para JavaScript.",
  };
}

/**
 * Factory para criar Performance Metrics
 */
export function createPerformanceMetric(
  overrides?: Partial<PerformanceMetric>
): PerformanceMetric {
  const valueBefore = overrides?.valueBefore ?? 45;
  const valueAfter = overrides?.valueAfter ?? 92;
  const delta = valueAfter - valueBefore;

  return {
    id: randomUUID(),
    projectId: overrides?.projectId ?? randomUUID(),
    type: overrides?.type ?? MetricType.PERFORMANCE,
    valueBefore,
    valueAfter,
    delta,
    direction:
      overrides?.direction ??
      (delta > 0
        ? DeltaDirection.POSITIVE
        : delta < 0
          ? DeltaDirection.NEGATIVE
          : DeltaDirection.NEUTRAL),
    unit: overrides?.unit ?? "score",
    measuredAt: overrides?.measuredAt ?? new Date(),
  };
}

/**
 * Factory para criar Case Studies
 */
export function createCaseStudy(overrides?: Partial<CaseStudy>): CaseStudy {
  const title =
    overrides?.title ?? "Otimização de Performance em SPA Financeiro";
  const slug =
    overrides?.slug ?? title.toLowerCase().replace(/\s+/g, "-");

  return {
    id: randomUUID(),
    title,
    slug,
    type: overrides?.type ?? CaseStudyType.PERFORMANCE_OPTIMIZATION,
    client: overrides?.client ?? "Nubank",
    industry: overrides?.industry ?? MarketSegment.FINTECH,
    location: overrides?.location ?? Location.SAO_PAULO_SP,
    status: overrides?.status ?? PublicationStatus.PUBLISHED,
    featured: overrides?.featured ?? true,
    summary:
      overrides?.summary ??
      "Redução de 67% no tempo de carregamento inicial de aplicação financeira com 2M usuários ativos.",
    problem:
      overrides?.problem ??
      "Aplicação apresentava FCP de 4.2s e TBT de 890ms, causando abandono de 34% na primeira interação.",
    solution:
      overrides?.solution ??
      "Code splitting granular, lazy loading de componentes pesados e otimização de bundle com Webpack.",
    results:
      overrides?.results ??
      "FCP reduzido para 1.4s, TBT para 120ms, aumento de 28% na conversão.",
    technologies:
      overrides?.technologies ?? [
        "React",
        "TypeScript",
        "Webpack",
        "Lighthouse",
      ],
    teamSize: overrides?.teamSize ?? 4,
    duration: overrides?.duration ?? { value: 3, unit: "months" },
    metrics: overrides?.metrics ?? [],
    imageUrl: overrides?.imageUrl ?? "https://placehold.co/1200x630",
    publishedAt: overrides?.publishedAt ?? new Date("2023-08-15"),
    createdAt: overrides?.createdAt ?? new Date("2023-07-01"),
    updatedAt: overrides?.updatedAt ?? new Date(),
  };
}

/**
 * Factory para criar Tags
 */
export function createTag(overrides?: Partial<Tag>): Tag {
  const name = overrides?.name ?? "React";
  const slug = overrides?.slug ?? name.toLowerCase();

  return {
    id: randomUUID(),
    name,
    slug,
    type: overrides?.type ?? TagType.TECHNOLOGY,
    count: overrides?.count ?? 0,
  };
}

/**
 * Factory para criar Experience
 */
export function createExperience(overrides?: Partial<Experience>): Experience {
  return {
    id: randomUUID(),
    company: overrides?.company ?? "Nubank",
    role: overrides?.role ?? "Senior Frontend Engineer",
    location: overrides?.location ?? Location.SAO_PAULO_SP,
    type: overrides?.type ?? "full_time",
    startDate: overrides?.startDate ?? new Date("2021-03-01"),
    endDate: overrides?.endDate,
    current: overrides?.current ?? true,
    description:
      overrides?.description ??
      "Desenvolvimento de features para aplicação web e mobile com React e React Native.",
    achievements:
      overrides?.achievements ?? [
        "Reduziu bundle size em 40% com code splitting",
        "Implementou design system usado por 15 squads",
      ],
    technologies:
      overrides?.technologies ?? ["React", "TypeScript", "GraphQL"],
  };
}

/**
 * Factory para criar Contact
 */
export function createContact(overrides?: Partial<Contact>): Contact {
  return {
    id: randomUUID(),
    name: overrides?.name ?? "Maria Silva",
    email: overrides?.email ?? "maria.silva@example.com",
    subject: overrides?.subject ?? "Proposta de colaboração",
    message:
      overrides?.message ??
      "Gostaria de conversar sobre oportunidades de colaboração em projeto React.",
    type: overrides?.type ?? ContactType.COLLABORATION,
    status: overrides?.status ?? ContactStatus.NEW,
    phone: overrides?.phone,
    company: overrides?.company,
    createdAt: overrides?.createdAt ?? new Date(),
    respondedAt: overrides?.respondedAt,
  };
}

/**
 * Factory para criar KPI Metrics
 */
export function createKpiMetric(overrides?: Partial<KpiMetric>): KpiMetric {
  const previousValue = overrides?.previousValue ?? 45;
  const value =
    typeof overrides?.value === "number"
      ? overrides.value
      : overrides?.value
        ? parseFloat(overrides.value)
        : 92;
  const delta =
    overrides?.delta ??
    (typeof value === "number" && previousValue
      ? ((value - previousValue) / previousValue) * 100
      : 0);

  return {
    label: overrides?.label ?? "Performance Score",
    value: overrides?.value ?? 92,
    unit: overrides?.unit ?? "pts",
    previousValue,
    delta,
    direction:
      overrides?.direction ??
      (delta > 0
        ? DeltaDirection.POSITIVE
        : delta < 0
          ? DeltaDirection.NEGATIVE
          : DeltaDirection.NEUTRAL),
    tooltip: overrides?.tooltip ?? "Lighthouse Performance Score",
    ariaDescription:
      overrides?.ariaDescription ??
      `Performance score aumentou de ${previousValue} para ${value} pontos`,
  };
}

/**
 * Seed completo para testes com 10 itens e estados extremos
 */
export const testDatasets = {
  /**
   * Projects com estados extremos:
   * - Zero commits/contribuidores
   * - Valores negativos não permitidos (mas testados via overrides)
   * - Alto volume de tecnologias
   * - Projetos antigos e recentes
   */
  projects: [
    // Projeto novo, zero métricas
    createProject({
      title: "Dashboard Analytics",
      status: ProjectStatus.DRAFT,
      startDate: new Date(),
      endDate: undefined,
      metrics: { linesOfCode: 0, contributors: 0, commits: 0 },
    }),
    // Projeto arquivado, alto volume
    createProject({
      title: "Legacy Monolith Migration",
      status: ProjectStatus.ARCHIVED,
      technologies: TECHNOLOGIES.slice(0, 10),
      startDate: new Date("2018-01-01"),
      endDate: new Date("2020-12-31"),
      metrics: { linesOfCode: 250000, contributors: 25, commits: 8500 },
    }),
    // Projeto em progresso, métricas médias
    createProject({
      title: "Mobile Banking App",
      status: ProjectStatus.IN_PROGRESS,
      featured: true,
      technologies: ["React Native", "TypeScript", "GraphQL"],
      startDate: new Date("2024-06-01"),
      metrics: { linesOfCode: 45000, contributors: 8, commits: 1200 },
    }),
    // Projeto concluído, featured
    createProject({
      title: "E-commerce Platform",
      status: ProjectStatus.COMPLETED,
      featured: true,
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      startDate: new Date("2023-03-01"),
      endDate: new Date("2023-11-30"),
      metrics: { linesOfCode: 78000, contributors: 12, commits: 3400 },
    }),
    // Projeto sem URLs
    createProject({
      title: "Internal Tool",
      githubUrl: undefined,
      liveUrl: undefined,
      imageUrl: undefined,
      technologies: ["Node.js", "Express"],
    }),
    // Projeto com muitas screenshots
    createProject({
      title: "Design System",
      screenshots: Array.from(
        { length: 15 },
        (_, i) => `https://placehold.co/800x600?text=Screenshot${i + 1}`
      ),
    }),
    // Projeto minimal
    createProject({
      title: "CLI Tool",
      description: "Ferramenta de linha de comando para automação.",
      tags: ["cli"],
      technologies: ["TypeScript"],
    }),
    // Projeto com tag máxima
    createProject({
      title: "Full Stack SaaS",
      tags: [
        "saas",
        "fullstack",
        "api",
        "frontend",
        "backend",
        "devops",
        "cloud",
        "security",
        "testing",
        "monitoring",
      ],
    }),
    // Projeto futuro (edge case)
    createProject({
      title: "Future Project",
      startDate: new Date("2025-12-01"),
      status: ProjectStatus.DRAFT,
    }),
    // Projeto de 1 dia
    createProject({
      title: "Landing Page",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-01-16"),
      technologies: ["HTML", "CSS", "JavaScript"],
    }),
  ],

  /**
   * Skills com estados extremos:
   * - Iniciante (level 1, 0 anos)
   * - Expert (level 5, 15+ anos)
   * - Múltiplas categorias
   */
  skills: [
    // Iniciante absoluto
    createSkill({
      name: "Rust",
      category: SkillCategory.BACKEND,
      level: ProficiencyLevel.BEGINNER,
      yearsOfExperience: 0,
    }),
    // Expert máximo
    createSkill({
      name: "JavaScript",
      category: SkillCategory.FRONTEND,
      level: ProficiencyLevel.MASTER,
      yearsOfExperience: 15,
    }),
    // DevOps intermediário
    createSkill({
      name: "Docker",
      category: SkillCategory.DEVOPS,
      level: ProficiencyLevel.INTERMEDIATE,
      yearsOfExperience: 2,
    }),
    // Design avançado
    createSkill({
      name: "Figma",
      category: SkillCategory.DESIGN,
      level: ProficiencyLevel.ADVANCED,
      yearsOfExperience: 4,
    }),
    // Tools expert
    createSkill({
      name: "Git",
      category: SkillCategory.TOOLS,
      level: ProficiencyLevel.EXPERT,
      yearsOfExperience: 10,
    }),
    // Soft skill
    createSkill({
      name: "Comunicação",
      category: SkillCategory.SOFT_SKILLS,
      level: ProficiencyLevel.ADVANCED,
      yearsOfExperience: 8,
    }),
    // Backend master
    createSkill({
      name: "Node.js",
      category: SkillCategory.BACKEND,
      level: ProficiencyLevel.MASTER,
      yearsOfExperience: 12,
    }),
    // Frontend expert
    createSkill({
      name: "React",
      category: SkillCategory.FRONTEND,
      level: ProficiencyLevel.EXPERT,
      yearsOfExperience: 6,
    }),
    // Skill sem descrição
    createSkill({
      name: "PostgreSQL",
      description: undefined,
    }),
    // Skill sem ícone
    createSkill({
      name: "GraphQL",
      iconUrl: undefined,
    }),
  ],

  /**
   * Performance Metrics com estados extremos:
   * - Delta zero (sem mudança)
   * - Delta negativo (piora)
   * - Delta positivo alto
   * - Valores extremos (0 e 100)
   */
  performanceMetrics: [
    // Melhoria extrema (0 → 100)
    createPerformanceMetric({
      type: MetricType.PERFORMANCE,
      valueBefore: 0,
      valueAfter: 100,
    }),
    // Piora extrema (100 → 0)
    createPerformanceMetric({
      type: MetricType.ACCESSIBILITY,
      valueBefore: 100,
      valueAfter: 0,
    }),
    // Sem mudança
    createPerformanceMetric({
      type: MetricType.SEO,
      valueBefore: 75,
      valueAfter: 75,
    }),
    // Melhoria pequena
    createPerformanceMetric({
      type: MetricType.BEST_PRACTICES,
      valueBefore: 88,
      valueAfter: 92,
    }),
    // Piora pequena
    createPerformanceMetric({
      type: MetricType.PWA,
      valueBefore: 95,
      valueAfter: 91,
    }),
    // Performance alta
    createPerformanceMetric({
      type: MetricType.PERFORMANCE,
      valueBefore: 45,
      valueAfter: 98,
    }),
    // Accessibility baixa
    createPerformanceMetric({
      type: MetricType.ACCESSIBILITY,
      valueBefore: 22,
      valueAfter: 87,
    }),
    // SEO médio
    createPerformanceMetric({
      type: MetricType.SEO,
      valueBefore: 50,
      valueAfter: 72,
    }),
    // Best Practices quase perfeito
    createPerformanceMetric({
      type: MetricType.BEST_PRACTICES,
      valueBefore: 96,
      valueAfter: 99,
    }),
    // PWA sem implementação
    createPerformanceMetric({
      type: MetricType.PWA,
      valueBefore: 0,
      valueAfter: 85,
    }),
  ],

  /**
   * Case Studies com empresas reais e métricas extremas
   */
  caseStudies: [
    // Nubank - Performance
    createCaseStudy({
      client: "Nubank",
      type: CaseStudyType.PERFORMANCE_OPTIMIZATION,
      industry: MarketSegment.FINTECH,
      location: Location.SAO_PAULO_SP,
      teamSize: 1,
      duration: { value: 2, unit: "weeks" },
    }),
    // iFood - Accessibility
    createCaseStudy({
      title: "Remediação de Acessibilidade em Dashboard",
      client: "iFood",
      type: CaseStudyType.ACCESSIBILITY_IMPROVEMENT,
      industry: MarketSegment.ECOMMERCE,
      location: Location.SAO_PAULO_SP,
      teamSize: 25,
      duration: { value: 2, unit: "years" },
    }),
    // Stone - Migration
    createCaseStudy({
      title: "Migração de GraphQL em App Mobile",
      client: "Stone Pagamentos",
      type: CaseStudyType.MIGRATION,
      industry: MarketSegment.FINTECH,
      location: Location.RIO_DE_JANEIRO_RJ,
      teamSize: 8,
      duration: { value: 6, unit: "months" },
    }),
    // QuintoAndar - Architecture
    createCaseStudy({
      title: "Redesign de Arquitetura Micro-Frontends",
      client: "QuintoAndar",
      type: CaseStudyType.ARCHITECTURE_REDESIGN,
      industry: MarketSegment.STARTUP,
      location: Location.SAO_PAULO_SP,
      teamSize: 12,
      duration: { value: 1, unit: "years" },
    }),
    // MercadoLivre - Feature
    createCaseStudy({
      title: "Desenvolvimento de Sistema de Pagamentos",
      client: "MercadoLivre",
      type: CaseStudyType.FEATURE_DEVELOPMENT,
      industry: MarketSegment.ECOMMERCE,
      location: Location.SAO_PAULO_SP,
      teamSize: 15,
      duration: { value: 8, unit: "months" },
    }),
    // Governo - Accessibility
    createCaseStudy({
      title: "Portal Acessível Gov.br",
      client: "Ministério da Economia",
      type: CaseStudyType.ACCESSIBILITY_IMPROVEMENT,
      industry: MarketSegment.GOVERNMENT,
      location: Location.BRASILIA_DF,
      teamSize: 6,
      duration: { value: 4, unit: "months" },
      featured: false,
      status: PublicationStatus.DRAFT,
    }),
    // Remote - International
    createCaseStudy({
      title: "SaaS Platform Modernization",
      client: "Stripe (International)",
      type: CaseStudyType.ARCHITECTURE_REDESIGN,
      industry: MarketSegment.SAAS,
      location: Location.REMOTE,
      teamSize: 10,
      duration: { value: 10, unit: "months" },
    }),
    // Startup pequena
    createCaseStudy({
      title: "MVP EdTech Platform",
      client: "StartupEdu",
      type: CaseStudyType.FEATURE_DEVELOPMENT,
      industry: MarketSegment.EDTECH,
      location: Location.FLORIANOPOLIS_SC,
      teamSize: 3,
      duration: { value: 3, unit: "months" },
    }),
    // Healthcare
    createCaseStudy({
      title: "Telemedicina HIPAA Compliant",
      client: "Hospital Albert Einstein",
      type: CaseStudyType.FEATURE_DEVELOPMENT,
      industry: MarketSegment.HEALTHTECH,
      location: Location.SAO_PAULO_SP,
      teamSize: 7,
      duration: { value: 5, unit: "months" },
    }),
    // Duração extrema (1 dia - urgente)
    createCaseStudy({
      title: "Hotfix Crítico Black Friday",
      client: "Magazine Luiza",
      type: CaseStudyType.PERFORMANCE_OPTIMIZATION,
      industry: MarketSegment.RETAIL,
      location: Location.SAO_PAULO_SP,
      teamSize: 4,
      duration: { value: 1, unit: "days" },
    }),
  ],

  /**
   * KPI Metrics para component CaseKpi com estados extremos
   */
  kpiMetrics: [
    // Delta zero
    createKpiMetric({
      label: "Lighthouse Score",
      value: 85,
      previousValue: 85,
      delta: 0,
      direction: DeltaDirection.NEUTRAL,
    }),
    // Delta negativo alto
    createKpiMetric({
      label: "Bundle Size",
      value: 450,
      unit: "KB",
      previousValue: 220,
      delta: -104.5, // Piora de 104%
      direction: DeltaDirection.NEGATIVE,
    }),
    // Delta positivo alto
    createKpiMetric({
      label: "Conversão",
      value: 8.5,
      unit: "%",
      previousValue: 3.2,
      delta: 165.6, // Melhoria de 165%
      direction: DeltaDirection.POSITIVE,
    }),
    // Valor string
    createKpiMetric({
      label: "Status",
      value: "100% Acessível",
      previousValue: undefined,
      delta: undefined,
      direction: undefined,
    }),
    // Sem previous value
    createKpiMetric({
      label: "Usuários Ativos",
      value: 12500,
      unit: "users",
      previousValue: undefined,
    }),
    // Delta muito pequeno
    createKpiMetric({
      label: "Tempo de Resposta",
      value: 142,
      unit: "ms",
      previousValue: 140,
      delta: 1.4,
      direction: DeltaDirection.POSITIVE,
    }),
    // Valor alto
    createKpiMetric({
      label: "Economia Anual",
      value: 2500000,
      unit: "R$",
      previousValue: 1800000,
      delta: 38.9,
      direction: DeltaDirection.POSITIVE,
    }),
    // Tooltip longo
    createKpiMetric({
      label: "Core Web Vitals",
      value: 95,
      unit: "score",
      tooltip:
        "Métrica composta de LCP (1.2s), FID (8ms) e CLS (0.02) medidos em ambiente de produção com 10k sessões reais.",
    }),
    // Sem tooltip
    createKpiMetric({
      label: "Cobertura de Testes",
      value: 87,
      unit: "%",
      tooltip: undefined,
    }),
    // Aria-description customizada
    createKpiMetric({
      label: "Acessibilidade WCAG",
      value: "AAA",
      ariaDescription:
        "Nível AAA de conformidade com WCAG 2.1, incluindo contraste 7:1 e navegação completa por teclado",
    }),
  ],

  /**
   * Tags com contagens extremas
   */
  tags: [
    createTag({ name: "React", count: 0 }), // Não usado
    createTag({ name: "TypeScript", count: 1 }),
    createTag({ name: "Next.js", count: 5 }),
    createTag({ name: "Node.js", count: 12 }),
    createTag({ name: "GraphQL", count: 28 }), // Muito usado
    createTag({
      name: "Accessibility",
      type: TagType.TOPIC,
      count: 15,
    }),
    createTag({
      name: "E-commerce",
      type: TagType.INDUSTRY,
      count: 7,
    }),
    createTag({ name: "Agile", type: TagType.METHODOLOGY, count: 22 }),
    createTag({ name: "DevOps", type: TagType.TECHNOLOGY, count: 9 }),
    createTag({ name: "Performance", type: TagType.TOPIC, count: 18 }),
  ],

  /**
   * Experiences com datas extremas e variados tipos
   */
  experiences: [
    // Experiência atual
    createExperience({
      company: "Nubank",
      role: "Staff Frontend Engineer",
      current: true,
      startDate: new Date("2022-01-10"),
      endDate: undefined,
    }),
    // Experiência curta (2 meses)
    createExperience({
      company: "Startup Falida",
      role: "Fullstack Developer",
      current: false,
      startDate: new Date("2020-03-01"),
      endDate: new Date("2020-05-01"),
      type: "contract",
    }),
    // Experiência longa (5 anos)
    createExperience({
      company: "Stone Pagamentos",
      role: "Senior Backend Engineer",
      current: false,
      startDate: new Date("2017-06-01"),
      endDate: new Date("2022-01-01"),
      type: "full_time",
    }),
    // Freelance
    createExperience({
      company: "Diversos Clientes",
      role: "Freelance Developer",
      current: false,
      startDate: new Date("2015-01-01"),
      endDate: new Date("2017-05-31"),
      type: "freelance",
      location: Location.REMOTE,
    }),
    // Part-time
    createExperience({
      company: "Universidade Estadual",
      role: "Teaching Assistant",
      current: true,
      startDate: new Date("2024-03-01"),
      type: "part_time",
      location: Location.CAMPINAS_SP,
    }),
    // Muitas conquistas
    createExperience({
      company: "MercadoLivre",
      role: "Tech Lead",
      achievements: [
        "Liderou migração de monolito para microserviços",
        "Reduziu custos de infra em 45%",
        "Implementou CI/CD com deploy em produção 50x/dia",
        "Mentorou 8 desenvolvedores juniores",
        "Palestrou em 3 conferências internacionais",
      ],
    }),
    // Poucas tecnologias
    createExperience({
      company: "Agência Web",
      role: "Junior Developer",
      technologies: ["HTML", "CSS"],
    }),
    // Muitas tecnologias
    createExperience({
      company: "Consultoria Tech",
      role: "Solutions Architect",
      technologies: TECHNOLOGIES.slice(),
    }),
    // Internacional
    createExperience({
      company: "Google (US)",
      role: "Software Engineer",
      location: Location.INTERNATIONAL,
      current: false,
      startDate: new Date("2019-08-01"),
      endDate: new Date("2021-12-31"),
    }),
    // Descrição mínima
    createExperience({
      company: "Empresa Confidencial",
      role: "Senior Developer",
      description:
        "Desenvolvimento de soluções enterprise com tecnologias modernas.",
      achievements: ["Entregas no prazo"],
    }),
  ],

  /**
   * Contacts com tipos variados
   */
  contacts: [
    createContact({
      type: ContactType.HIRING,
      status: ContactStatus.RESPONDED,
      respondedAt: new Date(),
    }),
    createContact({
      type: ContactType.COLLABORATION,
      status: ContactStatus.IN_PROGRESS,
    }),
    createContact({
      type: ContactType.FEEDBACK,
      status: ContactStatus.CLOSED,
    }),
    createContact({
      type: ContactType.INQUIRY,
      status: ContactStatus.NEW,
    }),
    createContact({
      type: ContactType.OTHER,
      status: ContactStatus.NEW,
      phone: "+5511987654321",
      company: "StartupXYZ",
    }),
    // Mensagem longa
    createContact({
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(
          20
        ),
    }),
    // Mensagem mínima
    createContact({
      message: "Oi, podemos conversar?",
    }),
    // Sem telefone/empresa
    createContact({
      phone: undefined,
      company: undefined,
    }),
    // Com todos campos
    createContact({
      name: "João da Silva",
      email: "joao@example.com",
      subject: "Proposta de Emprego - Senior React Developer",
      message:
        "Somos uma fintech em crescimento e gostaríamos de conversar sobre uma vaga de Senior React Developer.",
      type: ContactType.HIRING,
      phone: "+5511999887766",
      company: "FinTech Inovadora Ltda",
    }),
    // Criado há 30 dias
    createContact({
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: ContactStatus.CLOSED,
      respondedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    }),
  ],
};

/**
 * Helper para gerar dataset específico
 */
export function generateTestDataset<T extends keyof typeof testDatasets>(
  type: T,
  count?: number
): (typeof testDatasets)[T] {
  const dataset = testDatasets[type];
  if (count && Array.isArray(dataset)) {
    return dataset.slice(0, count) as (typeof testDatasets)[T];
  }
  return dataset;
}
