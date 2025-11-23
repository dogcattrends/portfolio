export type CasesLocale = "pt" | "en";
export const CASES_LOCALES: readonly CasesLocale[] = ["pt", "en"];

interface CasesDictionary {
  listTitle: string;
  searchPlaceholder: string;
  filterLabel: string;
  clearFilter: string;
  emptyState: string;
  breadcrumbHome: string;
  breadcrumbCases: string;
  readCase: string;
  backToCases: string;
  readingTime: (minutes: number) => string;
  publishedAt: (date: string) => string;
  metricsTitle: string;
  relatedTagsLabel: string;
}

const dictionaries: Record<CasesLocale, CasesDictionary> = {
  pt: {
    listTitle: "Cases aplicados",
    searchPlaceholder: "Buscar por cliente, dor ou tecnologia...",
    filterLabel: "Filtrar por tag",
    clearFilter: "Limpar filtro",
    emptyState: "Nenhum case encontrado com esses critérios.",
    breadcrumbHome: "Início",
    breadcrumbCases: "Cases",
    readCase: "Ler case",
    backToCases: "Voltar para cases",
    readingTime: (minutes) => `${minutes} min de leitura`,
    publishedAt: (date) => `Publicado em ${date}`,
    metricsTitle: "Métricas principais",
    relatedTagsLabel: "Tags relacionadas",
  },
  en: {
    listTitle: "Customer stories",
    searchPlaceholder: "Search by client, pain or technology...",
    filterLabel: "Filter by tag",
    clearFilter: "Reset filter",
    emptyState: "No case matched those criteria.",
    breadcrumbHome: "Home",
    breadcrumbCases: "Cases",
    readCase: "Read case study",
    backToCases: "Back to cases",
    readingTime: (minutes) => `${minutes} min read`,
    publishedAt: (date) => `Published on ${date}`,
    metricsTitle: "Key metrics",
    relatedTagsLabel: "Related tags",
  },
};

export function getCasesDictionary(locale: CasesLocale): CasesDictionary {
  return dictionaries[locale];
}

export function resolveCasesLocale(value?: string | null): CasesLocale {
  return value === "en" ? "en" : "pt";
}
