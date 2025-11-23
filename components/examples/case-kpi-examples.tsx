"use client";

import * as React from "react";
import { CaseKpi } from "@/components/case-kpi";
import type { KpiMetric } from "@/components/case-kpi";

/**
 * Exemplo de uso do CaseKpi com dados de performance
 */
export function PerformanceCaseExample(): React.JSX.Element {
  const metrics: KpiMetric[] = [
    {
      label: "Lighthouse Score",
      value: 91,
      delta: 117,
      direction: "positive",
      tooltip: "Performance score aumentou de 42 para 91",
      ariaDescription: "Melhorou 117% após otimizações de bundle e code splitting",
    },
    {
      label: "LCP",
      value: 1.8,
      unit: "s",
      delta: -62,
      direction: "positive",
      tooltip: "Largest Contentful Paint",
      ariaDescription: "Redução de 4.8s para 1.8s (threshold: 2.5s)",
    },
    {
      label: "TBT",
      value: 120,
      unit: "ms",
      delta: -86,
      direction: "positive",
      tooltip: "Total Blocking Time",
      ariaDescription: "Redução de 890ms para 120ms",
    },
    {
      label: "CLS",
      value: 0.04,
      delta: -86,
      direction: "positive",
      tooltip: "Cumulative Layout Shift",
      ariaDescription: "Redução de 0.28 para 0.04 (threshold: 0.1)",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Otimização de Performance</h2>
        <p className="text-muted-foreground">
          Métricas após implementação de code splitting e lazy loading
        </p>
      </div>
      <CaseKpi metrics={metrics} />
    </section>
  );
}

/**
 * Exemplo de uso do CaseKpi com dados de acessibilidade
 */
export function AccessibilityCaseExample(): React.JSX.Element {
  const metrics: KpiMetric[] = [
    {
      label: "Lighthouse A11y",
      value: 100,
      delta: 49,
      direction: "positive",
      tooltip: "Accessibility score",
      ariaDescription: "Melhorou de 67 para 100 pontos",
    },
    {
      label: "Violações Críticas",
      value: 0,
      delta: -100,
      direction: "positive",
      tooltip: "axe DevTools critical issues",
      ariaDescription: "Eliminadas todas as 47 violações críticas",
    },
    {
      label: "WCAG Level AA",
      value: "20/20",
      direction: "positive",
      tooltip: "Conformidade com WCAG 2.1",
      ariaDescription: "100% de conformidade alcançada",
    },
    {
      label: "SUS Score",
      value: 78,
      delta: 86,
      direction: "positive",
      tooltip: "System Usability Scale",
      ariaDescription: "Melhorou de 42 para 78 em testes com usuários",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Correção de Acessibilidade</h2>
        <p className="text-muted-foreground">
          Resultados após remediação completa do dashboard
        </p>
      </div>
      <CaseKpi metrics={metrics} />
    </section>
  );
}

/**
 * Exemplo de uso do CaseKpi com layout horizontal
 */
export function MobileMetricsExample(): React.JSX.Element {
  const metrics: KpiMetric[] = [
    {
      label: "Tempo de carregamento",
      value: 2.4,
      unit: "s",
      delta: -71,
      direction: "positive",
      ariaDescription: "Redução de 8.2s para 2.4s em rede 3G",
    },
    {
      label: "Payload",
      value: 1.1,
      unit: "MB",
      delta: -77,
      direction: "positive",
      ariaDescription: "Redução de 4.7MB para 1.1MB por requisição",
    },
    {
      label: "Cache hit rate",
      value: 78,
      unit: "%",
      delta: 550,
      direction: "positive",
      ariaDescription: "Aumentou de 12% para 78%",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Migração GraphQL</h2>
        <p className="text-muted-foreground">Mobile app performance metrics</p>
      </div>
      <CaseKpi metrics={metrics} layout="horizontal" />
    </section>
  );
}
