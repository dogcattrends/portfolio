import type { Metadata } from "next";
import { getCaseSummaries, getCaseTags } from "@/lib/cases";
import { getCasesDictionary, resolveCasesLocale } from "@/lib/i18n/cases";
import { CasesExplorer } from "@/components/cases/search-explorer";

export const metadata: Metadata = {
  title: "Cases | Portfolio",
  description: "Histórias de impacto com métricas reais e stack completa.",
};

type CasesPageProps = {
  searchParams?: {
    lang?: string;
  };
};

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const locale = resolveCasesLocale(searchParams?.lang);
  const [cases, tags] = await Promise.all([getCaseSummaries(locale), getCaseTags()]);
  const dictionary = getCasesDictionary(locale);

  return (
    <section aria-labelledby="cases-heading" className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-primary/80">
          {dictionary.listTitle}
        </p>
        <h1 id="cases-heading" className="text-4xl font-bold tracking-tight sm:text-5xl">
          {dictionary.listTitle}
        </h1>
        <p className="text-base text-muted-foreground">
          {locale === "pt"
            ? "Projetos práticos com IA, Supabase e Next.js, sempre defendidos com métricas e processos auditáveis."
            : "Hands-on projects combining AI, Supabase and Next.js with measurable outcomes and auditable processes."}
        </p>
      </div>
      <CasesExplorer
        initialCases={cases}
        tags={tags}
        dictionary={dictionary}
        locale={locale}
      />
    </section>
  );
}
