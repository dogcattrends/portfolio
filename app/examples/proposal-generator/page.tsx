"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ProposalViewer } from "@/components/proposal-viewer";
import { useProposalGenerator } from "@/hooks/use-proposal-generator";
import type { CaseSummary } from "@/lib/cases";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";

/**
 * Exemplo de geração de proposta automática
 * 
 * Demonstra:
 * - Seleção de cases
 * - Geração de KPIs automaticamente
 * - Screenshots de evidências técnicas
 * - Exportação em múltiplos formatos
 */
export default function ProposalGeneratorExample() {
  const [cases, setCases] = React.useState<CaseSummary[]>([]);
  const [selectedCases, setSelectedCases] = React.useState<string[]>([]);
  const [clientName, setClientName] = React.useState("");
  const [isLoadingCases, setIsLoadingCases] = React.useState(true);

  const { proposal, isGenerating, error, generate } = useProposalGenerator();

  // Carregar cases disponíveis
  React.useEffect(() => {
    setIsLoadingCases(true);
    fetch("/api/cases?lang=pt")
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar cases");
        return response.json();
      })
      .then((loadedCases: CaseSummary[]) => {
        setCases(loadedCases);
      })
      .catch((err) => {
        console.error("Erro ao carregar cases:", err);
      })
      .finally(() => setIsLoadingCases(false));
  }, []);

  const handleToggleCase = (slug: string) => {
    setSelectedCases((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleGenerateProposal = () => {
    const selected = cases.filter((c) => selectedCases.includes(c.slug));
    if (selected.length === 0 || !clientName.trim()) {
      alert("Selecione ao menos 1 case e informe o nome do cliente");
      return;
    }

    generate(
      selected,
      clientName,
      `Proposta customizada baseada em ${selected.length} projeto(s) similar(es).`
    );
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Gerador de Propostas Automatizado
        </h1>
        <p className="text-lg text-muted-foreground">
          Selecione cases relevantes e gere uma proposta técnica completa com KPIs,
          screenshots e métricas before/after automaticamente.
        </p>
      </div>

      {!proposal ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Configuração */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium mb-2"
              >
                Nome do Cliente
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Nubank"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">
                Cases Selecionados ({selectedCases.length})
              </h3>
              {isLoadingCases ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando cases...
                </div>
              ) : (
                <div className="space-y-2">
                  {cases.map((caseItem) => (
                    <label
                      key={caseItem.slug}
                      className="flex items-start gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCases.includes(caseItem.slug)}
                        onChange={() => handleToggleCase(caseItem.slug)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {caseItem.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {caseItem.client} • {caseItem.industry}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateProposal}
              disabled={isGenerating || selectedCases.length === 0 || !clientName.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando proposta...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Proposta
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                {error}
              </div>
            )}
          </div>

          {/* Main - Preview */}
          <div className="lg:col-span-2 border rounded-lg p-8 bg-muted/20">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Nenhuma proposta gerada ainda
              </h3>
              <p className="text-muted-foreground max-w-md">
                Selecione ao menos 1 case, informe o nome do cliente e clique em
                &ldquo;Gerar Proposta&rdquo; para criar uma proposta técnica automatizada.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">
                Proposta gerada com sucesso!
              </div>
              <div className="text-sm text-green-700">
                {proposal.metadata.totalKpis} KPIs e{" "}
                {proposal.metadata.totalScreenshots} screenshots incluídos
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => window.location.reload()}
            >
              Nova Proposta
            </Button>
          </div>

          <ProposalViewer proposal={proposal} showActions />
        </div>
      )}
    </div>
  );
}
