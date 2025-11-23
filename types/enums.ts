/**
 * Enums do domínio da aplicação
 */

/**
 * Status de projetos
 */
export enum ProjectStatus {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

/**
 * Categorias de habilidades técnicas
 */
export enum SkillCategory {
  FRONTEND = "frontend",
  BACKEND = "backend",
  DEVOPS = "devops",
  DESIGN = "design",
  TOOLS = "tools",
  SOFT_SKILLS = "soft_skills",
}

/**
 * Níveis de proficiência
 */
export enum ProficiencyLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  MASTER = 5,
}

/**
 * Tipos de métrica de performance
 */
export enum MetricType {
  PERFORMANCE = "performance",
  ACCESSIBILITY = "accessibility",
  SEO = "seo",
  BEST_PRACTICES = "best_practices",
  PWA = "pwa",
}

/**
 * Direção de variação de KPI
 */
export enum DeltaDirection {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
}

/**
 * Tipos de case study
 */
export enum CaseStudyType {
  PERFORMANCE_OPTIMIZATION = "performance_optimization",
  ACCESSIBILITY_IMPROVEMENT = "accessibility_improvement",
  ARCHITECTURE_REDESIGN = "architecture_redesign",
  MIGRATION = "migration",
  FEATURE_DEVELOPMENT = "feature_development",
}

/**
 * Status de publicação
 */
export enum PublicationStatus {
  DRAFT = "draft",
  REVIEW = "review",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

/**
 * Tipos de tag
 */
export enum TagType {
  TECHNOLOGY = "technology",
  METHODOLOGY = "methodology",
  INDUSTRY = "industry",
  TOPIC = "topic",
}

/**
 * Prioridade de tarefas
 */
export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Tipos de contato
 */
export enum ContactType {
  INQUIRY = "inquiry",
  COLLABORATION = "collaboration",
  HIRING = "hiring",
  FEEDBACK = "feedback",
  OTHER = "other",
}

/**
 * Status de contato
 */
export enum ContactStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  RESPONDED = "responded",
  CLOSED = "closed",
}

/**
 * Tipos de mensagem (chat/webhook)
 */
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document",
  LOCATION = "location",
  STICKER = "sticker",
}

/**
 * Status de mensagem
 */
export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

/**
 * Direção da mensagem
 */
export enum MessageDirection {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
}

/**
 * Localização (cidades para empresas/clientes)
 */
export enum Location {
  SAO_PAULO_SP = "São Paulo, SP",
  RIO_DE_JANEIRO_RJ = "Rio de Janeiro, RJ",
  BELO_HORIZONTE_MG = "Belo Horizonte, MG",
  CURITIBA_PR = "Curitiba, PR",
  PORTO_ALEGRE_RS = "Porto Alegre, RS",
  BRASILIA_DF = "Brasília, DF",
  FLORIANOPOLIS_SC = "Florianópolis, SC",
  SALVADOR_BA = "Salvador, BA",
  RECIFE_PE = "Recife, PE",
  FORTALEZA_CE = "Fortaleza, CE",
  CAMPINAS_SP = "Campinas, SP",
  REMOTE = "Remoto",
  INTERNATIONAL = "Internacional",
}

/**
 * Segmentos de mercado
 */
export enum MarketSegment {
  FINTECH = "fintech",
  HEALTHTECH = "healthtech",
  EDTECH = "edtech",
  ECOMMERCE = "ecommerce",
  SAAS = "saas",
  ENTERPRISE = "enterprise",
  STARTUP = "startup",
  GOVERNMENT = "government",
  RETAIL = "retail",
  MEDIA = "media",
}

/**
 * Tipos de stack tecnológica
 */
export enum TechStack {
  REACT_NEXTJS = "React + Next.js",
  REACT_NATIVE = "React Native",
  VUE_NUXT = "Vue + Nuxt",
  ANGULAR = "Angular",
  NODE_EXPRESS = "Node.js + Express",
  NODE_NESTJS = "Node.js + NestJS",
  PYTHON_DJANGO = "Python + Django",
  PYTHON_FASTAPI = "Python + FastAPI",
  DOTNET = ".NET",
  JAVA_SPRING = "Java + Spring",
}

/**
 * Helper para obter label de enum
 */
export const EnumLabels = {
  ProjectStatus: {
    [ProjectStatus.DRAFT]: "Rascunho",
    [ProjectStatus.IN_PROGRESS]: "Em Progresso",
    [ProjectStatus.COMPLETED]: "Concluído",
    [ProjectStatus.ARCHIVED]: "Arquivado",
  },
  SkillCategory: {
    [SkillCategory.FRONTEND]: "Frontend",
    [SkillCategory.BACKEND]: "Backend",
    [SkillCategory.DEVOPS]: "DevOps",
    [SkillCategory.DESIGN]: "Design",
    [SkillCategory.TOOLS]: "Ferramentas",
    [SkillCategory.SOFT_SKILLS]: "Soft Skills",
  },
  Priority: {
    [Priority.LOW]: "Baixa",
    [Priority.MEDIUM]: "Média",
    [Priority.HIGH]: "Alta",
    [Priority.CRITICAL]: "Crítica",
  },
  ContactType: {
    [ContactType.INQUIRY]: "Consulta",
    [ContactType.COLLABORATION]: "Colaboração",
    [ContactType.HIRING]: "Contratação",
    [ContactType.FEEDBACK]: "Feedback",
    [ContactType.OTHER]: "Outro",
  },
} as const;
