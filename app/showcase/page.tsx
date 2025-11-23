"use client";

import * as React from "react";

import { CaseKpi } from "@/components/case-kpi";
import type { KpiMetric } from "@/components/case-kpi";
import { BeforeAfter } from "@/components/ui/before-after";
import { Callout } from "@/components/ui/callout";

/**
 * Página de demonstração dos componentes acessíveis
 * 
 * NOTA: Como esta página usa "use client", o metadata deve ser
 * definido em um layout.tsx pai ou através de next/head.
 * Para SEO completo, considere converter para Server Component
 * ou adicionar metadata via layout.tsx
 */
export default function ComponentsShowcase(): React.JSX.Element {
  const performanceMetrics: KpiMetric[] = [
    {
      label: "Lighthouse Score",
      value: 91,
      delta: 117,
      direction: "positive",
      tooltip: "Performance melhorou de 42 para 91",
      ariaDescription: "Aumento de 117% após otimizações",
    },
    {
      label: "LCP",
      value: 1.8,
      unit: "s",
      delta: -62,
      direction: "positive",
      tooltip: "Largest Contentful Paint",
      ariaDescription: "Redução de 4.8s para 1.8s",
    },
    {
      label: "Acessibilidade",
      value: 100,
      delta: 49,
      direction: "positive",
      tooltip: "Lighthouse Accessibility score",
    },
  ];

  return (
    <main className="container mx-auto max-w-6xl space-y-16 py-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold tracking-tight">
          Componentes Acessíveis
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Demonstração de componentes com ARIA completo e navegação por teclado
        </p>
      </header>

      {/* Section: Callout */}
      <section aria-labelledby="callout-section">
        <h2 id="callout-section" className="mb-6 text-2xl font-semibold">
          Callout Component
        </h2>
        
        <div className="space-y-4">
          <Callout variant="info" title="Informação">
            Este é um callout informativo com aria-live="polite"
          </Callout>

          <Callout variant="success" title="Sucesso!">
            Operação concluída com êxito
          </Callout>

          <Callout variant="warning" title="Atenção" dismissible>
            Este recurso está em beta. Clique no X para fechar.
          </Callout>

          <Callout variant="error" title="Erro Crítico" dismissible>
            Falha ao carregar dados. Este callout usa aria-live="assertive"
          </Callout>

          <Callout>
            Callout default sem título, apenas conteúdo
          </Callout>
        </div>

        <div className="mt-4 rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-semibold">Recursos de Acessibilidade:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✅ role="alert" para anúncio automático</li>
            <li>✅ aria-live baseado em severidade (polite/assertive)</li>
            <li>✅ Ícones com aria-hidden="true"</li>
            <li>✅ Botão fechar com aria-label</li>
            <li>✅ Navegação: Tab → Enter/Space para fechar</li>
          </ul>
        </div>
      </section>

      {/* Section: BeforeAfter */}
      <section aria-labelledby="before-after-section">
        <h2 id="before-after-section" className="mb-6 text-2xl font-semibold">
          Before/After Comparison
        </h2>

        <BeforeAfter
          beforeImage="https://placehold.co/800x450/ef4444/ffffff?text=Before%0A42%2F100"
          afterImage="https://placehold.co/800x450/22c55e/ffffff?text=After%0A91%2F100"
          beforeAlt="Dashboard antes da otimização, Lighthouse score 42/100"
          afterAlt="Dashboard após otimização, Lighthouse score 91/100"
          beforeLabel="Original"
          afterLabel="Otimizado"
        />

        <div className="mt-4 rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-semibold">Recursos de Acessibilidade:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✅ Ambas imagens com alt descritivo</li>
            <li>✅ role="slider" com aria-valuenow/min/max/text</li>
            <li>✅ Navegação: ← → (1%), Shift+← → (10%), Home, End</li>
            <li>✅ Slider focável (tabIndex=0)</li>
            <li>✅ Mouse drag + Touch support</li>
          </ul>
        </div>
      </section>

      {/* Section: CaseKpi */}
      <section aria-labelledby="kpi-section">
        <h2 id="kpi-section" className="mb-6 text-2xl font-semibold">
          Case Study KPIs
        </h2>

        <CaseKpi metrics={performanceMetrics} />

        <div className="mt-4 rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-semibold">Recursos de Acessibilidade:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✅ aria-label com valor e variação</li>
            <li>✅ aria-description para contexto adicional</li>
            <li>✅ Tooltips acessíveis (Radix UI)</li>
            <li>✅ data-testid para testes</li>
            <li>✅ Direção do delta com cores e ícones</li>
          </ul>
        </div>
      </section>

      {/* Section: Keyboard Navigation */}
      <section aria-labelledby="keyboard-section">
        <h2 id="keyboard-section" className="mb-6 text-2xl font-semibold">
          Navegação por Teclado
        </h2>

        <div className="rounded-lg border bg-card p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-semibold">Componente</th>
                <th className="pb-2 text-left font-semibold">Tecla</th>
                <th className="pb-2 text-left font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 font-medium">Callout</td>
                <td className="py-2 font-mono text-xs">Tab</td>
                <td className="py-2 text-muted-foreground">Foca botão fechar</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Callout</td>
                <td className="py-2 font-mono text-xs">Enter / Space</td>
                <td className="py-2 text-muted-foreground">Fecha callout</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">BeforeAfter</td>
                <td className="py-2 font-mono text-xs">Tab</td>
                <td className="py-2 text-muted-foreground">Foca slider</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">BeforeAfter</td>
                <td className="py-2 font-mono text-xs">← →</td>
                <td className="py-2 text-muted-foreground">Move ±1%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">BeforeAfter</td>
                <td className="py-2 font-mono text-xs">Shift + ← →</td>
                <td className="py-2 text-muted-foreground">Move ±10%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">BeforeAfter</td>
                <td className="py-2 font-mono text-xs">Home / End</td>
                <td className="py-2 text-muted-foreground">Vai para 0% / 100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-8 text-center text-sm text-muted-foreground">
        <p>
          Todos os componentes seguem{" "}
          <a
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            WCAG 2.1 Level AA
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </p>
      </footer>
    </main>
  );
}
