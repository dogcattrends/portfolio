"use client";

import { Download, Copy, Mail, Check } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { CaseKpi } from "@/components/case-kpi";
import { BeforeAfter } from "@/components/ui/before-after";
import { Button } from "@/components/ui/button";
import {
  type GeneratedProposal,
  type TechnicalScreenshot,
  formatProposalAsMarkdown,
  formatProposalAsHtml,
  proposalKpiToCaseKpi,
} from "@/lib/proposal-generator";

/**
 * Props do ProposalViewer
 */
export interface ProposalViewerProps {
  proposal: GeneratedProposal;
  /** Callback ao copiar conteúdo */
  onCopy?: (format: "markdown" | "html") => void;
  /** Callback ao baixar */
  onDownload?: (format: "markdown" | "html" | "pdf") => void;
  /** Mostrar botões de ação */
  showActions?: boolean;
  className?: string;
}

/**
 * Componente para visualizar e exportar propostas geradas
 * 
 * Features:
 * - Visualização rica com KPIs e screenshots
 * - Exportação para Markdown, HTML
 * - Cópia para clipboard
 * - Layout responsivo
 */
export function ProposalViewer({
  proposal,
  onCopy,
  onDownload,
  showActions = true,
  className,
}: ProposalViewerProps): React.JSX.Element {
  const [copiedFormat, setCopiedFormat] = React.useState<"markdown" | "html" | null>(null);

  const handleCopy = async (format: "markdown" | "html") => {
    const content = format === "markdown" 
      ? formatProposalAsMarkdown(proposal)
      : formatProposalAsHtml(proposal);

    await navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    onCopy?.(format);

    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownload = (format: "markdown" | "html") => {
    const content = format === "markdown" 
      ? formatProposalAsMarkdown(proposal)
      : formatProposalAsHtml(proposal);

    const blob = new Blob([content], { 
      type: format === "markdown" ? "text/markdown" : "text/html" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proposta-${proposal.client.toLowerCase().replace(/\s+/g, "-")}-${proposal.date}.${format === "markdown" ? "md" : "html"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onDownload?.(format);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">
          Proposta Técnica - {proposal.client}
        </h1>
        <p className="text-muted-foreground">
          {new Date(proposal.date).toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            onClick={() => handleCopy("markdown")}
            variant="outline"
            size="sm"
            disabled={copiedFormat === "markdown"}
          >
            {copiedFormat === "markdown" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Markdown
              </>
            )}
          </Button>

          <Button
            onClick={() => handleCopy("html")}
            variant="outline"
            size="sm"
            disabled={copiedFormat === "html"}
          >
            {copiedFormat === "html" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Copiar HTML
              </>
            )}
          </Button>

          <Button
            onClick={() => handleDownload("markdown")}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar .md
          </Button>

          <Button
            onClick={() => handleDownload("html")}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar .html
          </Button>
        </div>
      )}

      {/* Executive Summary */}
      <section className="mb-8 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Resumo Executivo</h2>
        <p className="mb-4">{proposal.executiveSummary}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <div className="text-sm text-muted-foreground">Cases</div>
            <div className="text-2xl font-bold">{proposal.metadata.totalCases}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">KPIs</div>
            <div className="text-2xl font-bold">{proposal.metadata.totalKpis}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Screenshots</div>
            <div className="text-2xl font-bold">{proposal.metadata.totalScreenshots}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Melhoria Média</div>
            <div className="text-2xl font-bold text-green-600">{proposal.metadata.avgImprovement}</div>
          </div>
        </div>
      </section>

      {/* Sections */}
      {proposal.sections.map((section, idx) => (
        <section key={idx} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-4">
            {idx + 1}. {section.title}
          </h2>

          <p className="text-muted-foreground mb-6">{section.content}</p>

          {/* KPIs */}
          {section.kpis.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">KPIs Alcançados</h3>
              <CaseKpi
                metrics={section.kpis.map((kpi) => proposalKpiToCaseKpi(kpi))}
                layout="grid"
              />

              {/* Table view for detailed comparison */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Métrica</th>
                      <th className="text-left p-3">Antes</th>
                      <th className="text-left p-3">Depois</th>
                      <th className="text-left p-3">Melhoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.kpis.map((kpi, kpiIdx) => {
                      const beforeDisplay = 
                        typeof kpi.valueBefore === "number" && kpi.valueBefore !== 0
                          ? `${kpi.valueBefore}${kpi.unit || ""}`
                          : "N/A";
                      return (
                        <tr key={kpiIdx} className="border-b">
                          <td className="p-3 font-medium">{kpi.label}</td>
                          <td className="p-3 text-muted-foreground">{beforeDisplay}</td>
                          <td className="p-3 font-semibold">
                            {kpi.valueAfter}
                            {kpi.unit || ""}
                          </td>
                          <td className="p-3">
                            <span
                              className={
                                kpi.direction === "positive"
                                  ? "text-green-600 font-bold"
                                  : kpi.direction === "negative"
                                    ? "text-red-600 font-bold"
                                    : ""
                              }
                            >
                              {kpi.improvement}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Screenshots */}
          {section.screenshots.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Evidências Técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.screenshots.map((screenshot, screenshotIdx) => (
                  <ScreenshotCard key={screenshotIdx} screenshot={screenshot} />
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

/**
 * Card para exibir screenshot com metadados
 */
function ScreenshotCard({ screenshot }: { screenshot: TechnicalScreenshot }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative w-full aspect-[3/2]">
        <Image
          src={screenshot.url}
          alt={screenshot.alt}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
            {screenshot.tool}
          </span>
          {screenshot.timestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(screenshot.timestamp).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
        <p className="text-sm">{screenshot.caption}</p>
      </div>
    </div>
  );
}

/**
 * Exemplo de uso com Before/After integrado
 */
export function ProposalWithBeforeAfter({
  proposal,
  beforeImageUrl,
  afterImageUrl,
  className,
}: ProposalViewerProps & {
  beforeImageUrl?: string;
  afterImageUrl?: string;
}) {
  return (
    <div className={className}>
      <ProposalViewer proposal={proposal} />

      {beforeImageUrl && afterImageUrl && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Comparação Visual</h2>
          <BeforeAfter
            beforeImage={beforeImageUrl}
            afterImage={afterImageUrl}
            beforeAlt="Estado anterior do projeto"
            afterAlt="Estado após implementação"
            beforeLabel="Antes"
            afterLabel="Depois"
          />
        </section>
      )}
    </div>
  );
}
