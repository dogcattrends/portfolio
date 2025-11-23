export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: readonly string[];
  href?: string;
  repository?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  level: 1 | 2 | 3 | 4 | 5;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: {
    start: Date;
    end?: Date;
  };
  description: string;
  achievements: readonly string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type { OpenGraphMetadata } from "@/lib/og-utils";

export * from "./case-study";
