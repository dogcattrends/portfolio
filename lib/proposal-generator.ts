import type { CaseSummary } from "@/lib/cases";
import type { KpiMetric } from "@/components/case-kpi";

/**
 * KPI extraído do case para proposta
 */
export interface ProposalKpi {
  label: string;
  valueBefore: string | number;
  valueAfter: string | number;
  improvement: string;
  direction: "positive" | "negative" | "neutral";
  unit?: string;
  screenshot?: string;
}

/**
 * Screenshot de evidência técnica
 */
export interface TechnicalScreenshot {
  url: string;
  alt: string;
  caption: string;
  tool: "Lighthouse" | "axe DevTools" | "WebPageTest" | "Playwright" | "Custom";
  timestamp?: string;
}

/**
 * Seção da proposta com dados automatizados
 */
export interface ProposalSection {
  title: string;
  content: string;
  kpis: ProposalKpi[];
  screenshots: TechnicalScreenshot[];
}

/**
 * Proposta completa gerada a partir de cases
 */
export interface GeneratedProposal {
  client: string;
  date: string;
  caseReferences: string[];
  executiveSummary: string;
  sections: ProposalSection[];
  metadata: {
    totalCases: number;
    totalKpis: number;
    totalScreenshots: number;
    avgImprovement: string;
  };
}

/**
 * Mapeamento de métricas do index.json para KPIs estruturados
 */
const METRIC_PARSERS: Record<
  string,
  (value: string) => { before: number | string; after: number | string; unit?: string }
> = {
  // Taxa de conversão: "+42%" -> before: 0, after: 42
  conversionRate: (value) => {
    const match = value.match(/([+-])?(\d+(?:\.\d+)?)%/);
    if (!match || !match[2]) return { before: 0, after: value };
    const delta = parseFloat(match[2]) * (match[1] === "-" ? -1 : 1);
    return { before: 0, after: delta, unit: "%" };
  },

  // LCP: "1.7s" -> before: unknown, after: 1.7
  timing: (value) => {
    const match = value.match(/(\d+(?:\.\d+)?)s/);
    if (!match || !match[1]) return { before: 0, after: value };
    return { before: 0, after: parseFloat(match[1]), unit: "s" };
  },

  // Tempo de resposta: "-63%" -> before: 100, after: 37
  percentage: (value) => {
    const match = value.match(/([+-])?(\d+(?:\.\d+)?)%/);
    if (!match || !match[2]) return { before: 0, after: value };
    const delta = parseFloat(match[2]) * (match[1] === "-" ? -1 : 1);
    const after = 100 + delta;
    return { before: 100, after, unit: "%" };
  },

  // NPS: "62 → 84" -> before: 62, after: 84
  range: (value) => {
    const match = value.match(/(\d+(?:\.\d+)?)\s*[→\->]\s*(\d+(?:\.\d+)?)/);
    if (!match || !match[1] || !match[2]) return { before: 0, after: value };
    return { before: parseFloat(match[1]), after: parseFloat(match[2]) };
  },

  // Latência: "280ms" -> before: unknown, after: 280
  latency: (value) => {
    const match = value.match(/(\d+(?:\.\d+)?)ms/);
    if (!match || !match[1]) return { before: 0, after: value };
    return { before: 0, after: parseFloat(match[1]), unit: "ms" };
  },
};

/**
 * Detecta o tipo de métrica pelo label ou valor
 */
function detectMetricType(label: string, value: string): keyof typeof METRIC_PARSERS {
  const lowerLabel = label.toLowerCase();
  const lowerValue = value.toLowerCase();

  if (lowerValue.includes("→") || lowerValue.includes("->")) return "range";
  if (lowerLabel.includes("lcp") || lowerLabel.includes("fcp") || lowerValue.endsWith("s"))
    return "timing";
  if (lowerValue.endsWith("ms")) return "latency";
  if (lowerLabel.includes("conversão") || lowerLabel.includes("conversion"))
    return "conversionRate";

  return "percentage";
}

/**
 * Converte métrica do case em KPI estruturado
 */
export function parseCaseMetric(label: string, value: string): ProposalKpi {
  const metricType = detectMetricType(label, value);
  const parser = METRIC_PARSERS[metricType];
  if (!parser) {
    return {
      label,
      valueBefore: 0,
      valueAfter: value,
      improvement: "N/A",
      direction: "neutral",
    };
  }
  const parsed = parser(value);

  let improvement = "N/A";
  let direction: "positive" | "negative" | "neutral" = "neutral";

  if (typeof parsed.before === "number" && typeof parsed.after === "number") {
    const delta = parsed.after - parsed.before;
    const percentChange =
      parsed.before !== 0 ? ((delta / parsed.before) * 100).toFixed(1) : "N/A";

    // Para métricas onde menor é melhor (tempo, latência, erros)
    const lowerIsBetter =
      label.toLowerCase().includes("tempo") ||
      label.toLowerCase().includes("time") ||
      label.toLowerCase().includes("latência") ||
      label.toLowerCase().includes("latency") ||
      label.toLowerCase().includes("erro") ||
      label.toLowerCase().includes("error");

    if (delta > 0) {
      direction = lowerIsBetter ? "negative" : "positive";
      improvement = lowerIsBetter ? `+${percentChange}%` : `+${percentChange}%`;
    } else if (delta < 0) {
      direction = lowerIsBetter ? "positive" : "negative";
      improvement = `${percentChange}%`;
    }
  } else {
    improvement = value;
  }

  return {
    label,
    valueBefore: parsed.before,
    valueAfter: parsed.after,
    improvement,
    direction,
    unit: parsed.unit,
  };
}

/**
 * Gera screenshots baseados em KPIs de performance
 */
export function generateScreenshotsForKpis(kpis: ProposalKpi[]): TechnicalScreenshot[] {
  const screenshots: TechnicalScreenshot[] = [];

  kpis.forEach((kpi) => {
    const label = kpi.label.toLowerCase();

    // Lighthouse para métricas Core Web Vitals
    if (
      label.includes("lcp") ||
      label.includes("cls") ||
      label.includes("fid") ||
      label.includes("lighthouse")
    ) {
      screenshots.push({
        url: `https://placehold.co/1200x800/1e293b/cbd5e1?text=Lighthouse+Report%0A${encodeURIComponent(kpi.label)}%3A+${encodeURIComponent(String(kpi.valueAfter))}${kpi.unit || ""}`,
        alt: `Lighthouse report mostrando ${kpi.label}: ${kpi.valueAfter}${kpi.unit || ""}`,
        caption: `Resultado do Lighthouse após otimizações: ${kpi.improvement}`,
        tool: "Lighthouse",
        timestamp: new Date().toISOString(),
      });
    }

    // axe DevTools para acessibilidade
    if (label.includes("a11y") || label.includes("wcag") || label.includes("violações")) {
      screenshots.push({
        url: `https://placehold.co/1200x800/059669/ffffff?text=axe+DevTools%0A${encodeURIComponent(kpi.label)}%3A+${encodeURIComponent(String(kpi.valueAfter))}`,
        alt: `axe DevTools mostrando ${kpi.label}: ${kpi.valueAfter}`,
        caption: `Análise de acessibilidade: ${kpi.improvement}`,
        tool: "axe DevTools",
        timestamp: new Date().toISOString(),
      });
    }

    // WebPageTest para métricas de rede
    if (label.includes("payload") || label.includes("requests") || label.includes("3g")) {
      screenshots.push({
        url: `https://placehold.co/1200x800/7c3aed/ffffff?text=WebPageTest%0A${encodeURIComponent(kpi.label)}%3A+${encodeURIComponent(String(kpi.valueAfter))}${kpi.unit || ""}`,
        alt: `WebPageTest mostrando ${kpi.label}: ${kpi.valueAfter}${kpi.unit || ""}`,
        caption: `Teste de performance em condições reais: ${kpi.improvement}`,
        tool: "WebPageTest",
        timestamp: new Date().toISOString(),
      });
    }
  });

  return screenshots;
}

/**
 * Converte KPI para formato do componente CaseKpi
 */
export function proposalKpiToCaseKpi(proposalKpi: ProposalKpi): KpiMetric {
  let delta: number | undefined;

  if (
    typeof proposalKpi.valueBefore === "number" &&
    typeof proposalKpi.valueAfter === "number" &&
    proposalKpi.valueBefore !== 0
  ) {
    delta =
      ((proposalKpi.valueAfter - proposalKpi.valueBefore) / proposalKpi.valueBefore) * 100;
  }

  return {
    label: proposalKpi.label,
    value: proposalKpi.valueAfter,
    unit: proposalKpi.unit,
    delta,
    direction: proposalKpi.direction,
    tooltip: `${proposalKpi.valueBefore} → ${proposalKpi.valueAfter}`,
    ariaDescription: `Melhoria de ${proposalKpi.improvement}`,
  };
}

/**
 * Gera proposta completa a partir de cases selecionados
 */
export function generateProposal(
  cases: CaseSummary[],
  clientName: string,
  additionalContext?: string
): GeneratedProposal {
  const allKpis: ProposalKpi[] = [];
  const allScreenshots: TechnicalScreenshot[] = [];
  const sections: ProposalSection[] = [];

  // Processar cada case
  cases.forEach((caseStudy) => {
    const caseKpis = caseStudy.metrics.map((metric) =>
      parseCaseMetric(metric.label, metric.value)
    );

    const caseScreenshots = generateScreenshotsForKpis(caseKpis);

    allKpis.push(...caseKpis);
    allScreenshots.push(...caseScreenshots);

    sections.push({
      title: `Experiência com ${caseStudy.client} - ${caseStudy.industry}`,
      content: caseStudy.summary,
      kpis: caseKpis,
      screenshots: caseScreenshots,
    });
  });

  // Calcular média de melhorias
  const numericImprovements = allKpis
    .map((kpi) => {
      const match = kpi.improvement.match(/([+-])?(\d+(?:\.\d+)?)/);
      return match && match[2] ? parseFloat(match[2]) * (match[1] === "-" ? -1 : 1) : null;
    })
    .filter((val): val is number => val !== null);

  const avgImprovement =
    numericImprovements.length > 0
      ? `${(numericImprovements.reduce((a, b) => a + b, 0) / numericImprovements.length).toFixed(1)}%`
      : "N/A";

  return {
    client: clientName,
    date: new Date().toISOString().split("T")[0]!,
    caseReferences: cases.map((c) => c.slug),
    executiveSummary:
      additionalContext ||
      `Com base em ${cases.length} projeto(s) similar(es) entregue(s) para clientes como ${cases.map((c) => c.client).join(", ")}, temos track record comprovado de melhoria média de ${avgImprovement} nas métricas-chave.`,
    sections,
    metadata: {
      totalCases: cases.length,
      totalKpis: allKpis.length,
      totalScreenshots: allScreenshots.length,
      avgImprovement,
    },
  };
}

/**
 * Formata proposta em Markdown para copiar
 */
export function formatProposalAsMarkdown(proposal: GeneratedProposal): string {
  let markdown = `# Proposta Técnica - ${proposal.client}\n\n`;
  markdown += `**Data:** ${new Date(proposal.date).toLocaleDateString("pt-BR")}\n\n`;
  markdown += `---\n\n`;
  markdown += `## Resumo Executivo\n\n${proposal.executiveSummary}\n\n`;

  markdown += `### Métricas Agregadas\n\n`;
  markdown += `- **Cases de Referência:** ${proposal.metadata.totalCases}\n`;
  markdown += `- **KPIs Mensurados:** ${proposal.metadata.totalKpis}\n`;
  markdown += `- **Evidências Técnicas:** ${proposal.metadata.totalScreenshots} screenshots\n`;
  markdown += `- **Melhoria Média:** ${proposal.metadata.avgImprovement}\n\n`;

  markdown += `---\n\n`;

  // Seções de cada case
  proposal.sections.forEach((section, idx) => {
    markdown += `## ${idx + 1}. ${section.title}\n\n`;
    markdown += `${section.content}\n\n`;

    if (section.kpis.length > 0) {
      markdown += `### KPIs Alcançados\n\n`;
      markdown += `| Métrica | Antes | Depois | Melhoria |\n`;
      markdown += `|---------|-------|--------|----------|\n`;
      section.kpis.forEach((kpi) => {
        const beforeDisplay =
          typeof kpi.valueBefore === "number" && kpi.valueBefore !== 0
            ? `${kpi.valueBefore}${kpi.unit || ""}`
            : "N/A";
        markdown += `| ${kpi.label} | ${beforeDisplay} | ${kpi.valueAfter}${kpi.unit || ""} | **${kpi.improvement}** |\n`;
      });
      markdown += `\n`;
    }

    if (section.screenshots.length > 0) {
      markdown += `### Evidências Técnicas\n\n`;
      section.screenshots.forEach((screenshot, screenshotIdx) => {
        markdown += `${screenshotIdx + 1}. **${screenshot.tool}:** ${screenshot.caption}\n`;
        markdown += `   ![${screenshot.alt}](${screenshot.url})\n\n`;
      });
    }

    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Gera proposta em HTML para email
 */
export function formatProposalAsHtml(proposal: GeneratedProposal): string {
  let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposta Técnica - ${proposal.client}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #0f172a; border-bottom: 3px solid #3b82f6; padding-bottom: 0.5rem; }
    h2 { color: #1e293b; margin-top: 2rem; border-left: 4px solid #3b82f6; padding-left: 1rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    .positive { color: #16a34a; font-weight: bold; }
    .negative { color: #dc2626; font-weight: bold; }
    .screenshot { margin: 1rem 0; }
    .screenshot img { max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
    .metadata { background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; }
    .metadata ul { margin: 0; padding-left: 1.5rem; }
  </style>
</head>
<body>
  <h1>Proposta Técnica - ${proposal.client}</h1>
  <p><strong>Data:</strong> ${new Date(proposal.date).toLocaleDateString("pt-BR")}</p>
  
  <div class="metadata">
    <h3>Resumo Executivo</h3>
    <p>${proposal.executiveSummary}</p>
    <ul>
      <li><strong>Cases de Referência:</strong> ${proposal.metadata.totalCases}</li>
      <li><strong>KPIs Mensurados:</strong> ${proposal.metadata.totalKpis}</li>
      <li><strong>Evidências Técnicas:</strong> ${proposal.metadata.totalScreenshots} screenshots</li>
      <li><strong>Melhoria Média:</strong> ${proposal.metadata.avgImprovement}</li>
    </ul>
  </div>
`;

  proposal.sections.forEach((section, idx) => {
    html += `<h2>${idx + 1}. ${section.title}</h2>`;
    html += `<p>${section.content}</p>`;

    if (section.kpis.length > 0) {
      html += `<h3>KPIs Alcançados</h3>`;
      html += `<table><thead><tr><th>Métrica</th><th>Antes</th><th>Depois</th><th>Melhoria</th></tr></thead><tbody>`;
      section.kpis.forEach((kpi) => {
        const beforeDisplay =
          typeof kpi.valueBefore === "number" && kpi.valueBefore !== 0
            ? `${kpi.valueBefore}${kpi.unit || ""}`
            : "N/A";
        const improvementClass = kpi.direction === "positive" ? "positive" : kpi.direction === "negative" ? "negative" : "";
        html += `<tr><td>${kpi.label}</td><td>${beforeDisplay}</td><td>${kpi.valueAfter}${kpi.unit || ""}</td><td class="${improvementClass}">${kpi.improvement}</td></tr>`;
      });
      html += `</tbody></table>`;
    }

    if (section.screenshots.length > 0) {
      html += `<h3>Evidências Técnicas</h3>`;
      section.screenshots.forEach((screenshot) => {
        html += `<div class="screenshot">`;
        html += `<p><strong>${screenshot.tool}:</strong> ${screenshot.caption}</p>`;
        html += `<img src="${screenshot.url}" alt="${screenshot.alt}" loading="lazy">`;
        html += `</div>`;
      });
    }
  });

  html += `</body></html>`;
  return html;
}
