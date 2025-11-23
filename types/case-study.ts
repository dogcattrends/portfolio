export interface CaseStudyMetadata {
  title: string;
  client: string;
  date: string;
  tags: readonly string[];
  featured: boolean;
}

export interface CaseStudyFrontmatter extends CaseStudyMetadata {
  slug: string;
}

export interface CaseStudy {
  metadata: CaseStudyFrontmatter;
  content: string;
}

export interface KpiData {
  label: string;
  before: number;
  after: number;
  unit?: string;
  improvement: number;
  direction: "positive" | "negative";
}

/**
 * Calcula melhoria percentual entre valores
 */
export function calculateImprovement(before: number, after: number): number {
  return ((after - before) / before) * 100;
}

/**
 * Determina direção baseado em contexto
 */
export function determineDirection(
  improvement: number,
  lowerIsBetter = false
): "positive" | "negative" {
  const isPositive = improvement > 0;
  return lowerIsBetter ? (isPositive ? "negative" : "positive") : (isPositive ? "positive" : "negative");
}
