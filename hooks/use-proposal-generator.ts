import { useState, useCallback } from "react";
import type { CaseSummary } from "@/lib/cases";
import { generateProposal, type GeneratedProposal } from "@/lib/proposal-generator";

/**
 * Hook para gerenciar geração de propostas
 */
export function useProposalGenerator() {
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (cases: CaseSummary[], clientName: string, additionalContext?: string) => {
      setIsGenerating(true);
      setError(null);

      try {
        // Simular delay de processamento
        await new Promise((resolve) => setTimeout(resolve, 500));

        const generatedProposal = generateProposal(cases, clientName, additionalContext);
        setProposal(generatedProposal);

        return generatedProposal;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao gerar proposta";
        setError(errorMessage);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setProposal(null);
    setError(null);
  }, []);

  return {
    proposal,
    isGenerating,
    error,
    generate,
    reset,
  };
}
