import { promises as fs } from "node:fs";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";
import type { ReactElement } from "react";


import * as MdxComponents from "@/components/cases/mdx-components";
import type { CasesLocale } from "@/lib/i18n/cases";

const CASES_ROOT = path.join(process.cwd(), "content", "cases");
const INDEX_FILE = path.join(CASES_ROOT, "index.json");

type LocalizedField = {
  pt: string;
  en: string;
};

interface CaseIndexEntry {
  slug: string;
  title: LocalizedField;
  summary: LocalizedField;
  client: string;
  industry: string;
  tags: string[];
  metrics: Array<{
    label: LocalizedField;
    value: string;
  }>;
  date: string;
  readingMinutes: number;
  cover: string;
}

export interface CaseMetric {
  label: string;
  value: string;
}

export interface CaseSummary {
  slug: string;
  title: string;
  summary: string;
  client: string;
  industry: string;
  tags: string[];
  metrics: CaseMetric[];
  date: string;
  readingMinutes: number;
  cover: string;
}

export interface CaseDetail extends CaseSummary {
  content: ReactElement;
}

const loadIndex = cache(async (): Promise<CaseIndexEntry[]> => {
  const raw = await fs.readFile(INDEX_FILE, "utf-8");
  const parsed = JSON.parse(raw) as { cases: CaseIndexEntry[] };
  return parsed.cases;
});

function localizeField(field: LocalizedField, locale: CasesLocale): string {
  return locale === "en" ? field.en : field.pt;
}

function normalizeCase(entry: CaseIndexEntry, locale: CasesLocale): CaseSummary {
  return {
    slug: entry.slug,
    title: localizeField(entry.title, locale),
    summary: localizeField(entry.summary, locale),
    client: entry.client,
    industry: entry.industry,
    tags: entry.tags,
    metrics: entry.metrics.map((metric) => ({
      label: localizeField(metric.label, locale),
      value: metric.value,
    })),
    date: entry.date,
    readingMinutes: entry.readingMinutes,
    cover: entry.cover,
  };
}

export const getCaseSummaries = cache(async (locale: CasesLocale): Promise<CaseSummary[]> => {
  const entries = await loadIndex();
  return entries
    .slice()
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map((entry) => normalizeCase(entry, locale));
});

export async function getCaseBySlug(locale: CasesLocale, slug: string): Promise<CaseSummary> {
  const entries = await loadIndex();
  const match = entries.find((entry) => entry.slug === slug);
  if (!match) {
    throw new Error(`Case not found for slug "${slug}"`);
  }
  return normalizeCase(match, locale);
}

export async function getCaseDetail(locale: CasesLocale, slug: string): Promise<CaseDetail> {
  const summary = await getCaseBySlug(locale, slug);
  const filePath = path.join(CASES_ROOT, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: false },
    components: MdxComponents,
  });

  return {
    ...summary,
    content,
  };
}

export const getCaseSlugs = cache(async (): Promise<string[]> => {
  const entries = await loadIndex();
  return entries.map((entry) => entry.slug);
});

export const getCaseTags = cache(async (): Promise<string[]> => {
  const entries = await loadIndex();
  const tags = new Set<string>();
  entries.forEach((entry) => entry.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
});
