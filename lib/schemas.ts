import { z } from "zod";
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
  MessageType,
  MessageStatus,
  MessageDirection,
} from "@/types/enums";

/**
 * Schema para Project
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(10).max(500),
  longDescription: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).min(1).max(10),
  technologies: z.array(z.string()).min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  screenshots: z.array(z.string().url()).default([]),
  metrics: z
    .object({
      linesOfCode: z.number().int().positive().optional(),
      contributors: z.number().int().positive().optional(),
      commits: z.number().int().positive().optional(),
    })
    .optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

/**
 * Schema para Skill
 */
export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  category: z.nativeEnum(SkillCategory),
  level: z.nativeEnum(ProficiencyLevel),
  yearsOfExperience: z.number().int().min(0).max(50),
  iconUrl: z.string().url().optional(),
  description: z.string().max(300).optional(),
});

/**
 * Schema para Performance Metric
 */
export const PerformanceMetricSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  type: z.nativeEnum(MetricType),
  valueBefore: z.number().min(0).max(100),
  valueAfter: z.number().min(0).max(100),
  delta: z.number(),
  direction: z.nativeEnum(DeltaDirection),
  unit: z.string().optional(),
  measuredAt: z.coerce.date(),
});

/**
 * Schema para Case Study
 */
export const CaseStudySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  type: z.nativeEnum(CaseStudyType),
  client: z.string().min(1).max(200),
  industry: z.nativeEnum(MarketSegment),
  location: z.nativeEnum(Location),
  status: z.nativeEnum(PublicationStatus),
  featured: z.boolean().default(false),
  summary: z.string().min(50).max(500),
  problem: z.string().min(100),
  solution: z.string().min(100),
  results: z.string().min(100),
  technologies: z.array(z.string()).min(1),
  teamSize: z.number().int().min(1).max(100),
  duration: z.object({
    value: z.number().int().min(1),
    unit: z.enum(["days", "weeks", "months", "years"]),
  }),
  metrics: z.array(PerformanceMetricSchema),
  imageUrl: z.string().url().optional(),
  publishedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

/**
 * Schema para Tag
 */
export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  type: z.nativeEnum(TagType),
  count: z.number().int().min(0).default(0),
});

/**
 * Schema para Experience
 */
export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  location: z.nativeEnum(Location),
  type: z.enum(["full_time", "part_time", "contract", "freelance"]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  description: z.string().min(50),
  achievements: z.array(z.string()).min(1),
  technologies: z.array(z.string()),
});

/**
 * Schema para Contact Form
 */
export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
  type: z.nativeEnum(ContactType).default(ContactType.INQUIRY),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  company: z.string().max(200).optional(),
});

/**
 * Schema para Contact (stored)
 */
export const ContactSchema = ContactFormSchema.extend({
  id: z.string().uuid(),
  status: z.nativeEnum(ContactStatus).default(ContactStatus.NEW),
  createdAt: z.coerce.date().default(() => new Date()),
  respondedAt: z.coerce.date().optional(),
});

/**
 * Schema para KPI Metric (para CaseKpi component)
 */
export const KpiMetricSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  previousValue: z.number().optional(),
  delta: z.number().optional(),
  direction: z.nativeEnum(DeltaDirection).optional(),
  tooltip: z.string().max(300).optional(),
  ariaDescription: z.string().max(300).optional(),
});

/**
 * Schema para Analytics Event
 */
export const AnalyticsEventSchema = z.object({
  eventName: z.string().min(1).max(100),
  properties: z.record(z.unknown()).optional(),
  timestamp: z.coerce.date().default(() => new Date()),
  userId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
});

/**
 * Schema para Mensagem de Chat
 */
export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  direction: z.nativeEnum(MessageDirection),
  status: z.nativeEnum(MessageStatus).default(MessageStatus.SENT),
  content: z.string().min(1).max(5000),
  senderId: z.string().min(1).max(100),
  senderName: z.string().min(1).max(200),
  senderAvatar: z.string().url().optional(),
  mediaUrl: z.string().url().optional(),
  mediaMimeType: z.string().optional(),
  mediaSize: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(), // para áudio/vídeo
  latitude: z.number().optional(), // para localização
  longitude: z.number().optional(),
  replyToId: z.string().uuid().optional(),
  timestamp: z.coerce.date().default(() => new Date()),
  deliveredAt: z.coerce.date().optional(),
  readAt: z.coerce.date().optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Schema para Conversa
 */
export const ConversationSchema = z.object({
  id: z.string().uuid(),
  contactId: z.string().min(1).max(100),
  contactName: z.string().min(1).max(200),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactAvatar: z.string().url().optional(),
  lastMessage: z.string().optional(),
  lastMessageAt: z.coerce.date().optional(),
  unreadCount: z.number().int().min(0).default(0),
  status: z.enum(["active", "archived", "blocked"]).default("active"),
  tags: z.array(z.string()).default([]),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

/**
 * Type exports
 */
export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type PerformanceMetric = z.infer<typeof PerformanceMetricSchema>;
export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type KpiMetric = z.infer<typeof KpiMetricSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
