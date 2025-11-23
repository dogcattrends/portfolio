import { describe, it, expect } from "vitest";
import {
  parseCaseMetric,
  generateScreenshotsForKpis,
  proposalKpiToCaseKpi,
  generateProposal,
  formatProposalAsMarkdown,
  formatProposalAsHtml,
  type ProposalKpi,
} from "@/lib/proposal-generator";
import type { CaseSummary } from "@/lib/cases";

describe("Proposal Generator", () => {
  describe("parseCaseMetric", () => {
    it("deve parsear melhoria percentual com sinal positivo", () => {
      const kpi = parseCaseMetric("Taxa de conversão", "+42%");

      expect(kpi.label).toBe("Taxa de conversão");
      expect(kpi.valueAfter).toBe(42);
      expect(kpi.direction).toBe("positive");
      expect(kpi.unit).toBe("%");
    });

    it("deve parsear redução percentual com sinal negativo", () => {
      const kpi = parseCaseMetric("Tempo de resposta", "-63%");

      expect(kpi.label).toBe("Tempo de resposta");
      expect(kpi.valueAfter).toBe(37); // 100 - 63 = 37
      expect(kpi.direction).toBe("positive"); // menor tempo é melhor
      expect(kpi.unit).toBe("%");
    });

    it("deve parsear valor de tempo (LCP)", () => {
      const kpi = parseCaseMetric("LCP médio", "1.7s");

      expect(kpi.label).toBe("LCP médio");
      expect(kpi.valueAfter).toBe(1.7);
      expect(kpi.unit).toBe("s");
    });

    it("deve parsear range com seta (NPS)", () => {
      const kpi = parseCaseMetric("NPS da squad", "62 → 84");

      expect(kpi.label).toBe("NPS da squad");
      expect(kpi.valueBefore).toBe(62);
      expect(kpi.valueAfter).toBe(84);
      expect(kpi.direction).toBe("positive");
    });

    it("deve parsear latência em milissegundos", () => {
      const kpi = parseCaseMetric("Latência média", "280ms");

      expect(kpi.label).toBe("Latência média");
      expect(kpi.valueAfter).toBe(280);
      expect(kpi.unit).toBe("ms");
    });

    it("deve identificar métrica onde menor é melhor (tempo)", () => {
      const kpi = parseCaseMetric("Tempo de carregamento", "1.2s");

      expect(kpi.label).toBe("Tempo de carregamento");
      expect(kpi.valueAfter).toBe(1.2);
    });

    it("deve identificar métrica onde menor é melhor (erro)", () => {
      const kpi = parseCaseMetric("Erros de picking", "-55%");

      expect(kpi.label).toBe("Erros de picking");
      expect(kpi.direction).toBe("positive"); // menos erros é positivo
    });
  });

  describe("generateScreenshotsForKpis", () => {
    it("deve gerar screenshot de Lighthouse para LCP", () => {
      const kpis: ProposalKpi[] = [
        {
          label: "LCP",
          valueBefore: 3.2,
          valueAfter: 1.8,
          improvement: "-43.75%",
          direction: "positive",
          unit: "s",
        },
      ];

      const screenshots = generateScreenshotsForKpis(kpis);

      expect(screenshots).toHaveLength(1);
      expect(screenshots[0]!.tool).toBe("Lighthouse");
      expect(screenshots[0]!.url).toContain("Lighthouse+Report");
      expect(screenshots[0]!.url).toContain("LCP");
      expect(screenshots[0]!.url).toContain("1.8");
      expect(screenshots[0]!.alt).toContain("Lighthouse report");
    });

    it("deve gerar screenshot de axe DevTools para acessibilidade", () => {
      const kpis: ProposalKpi[] = [
        {
          label: "Violações WCAG",
          valueBefore: 47,
          valueAfter: 0,
          improvement: "-100%",
          direction: "positive",
        },
      ];

      const screenshots = generateScreenshotsForKpis(kpis);

      expect(screenshots).toHaveLength(1);
      expect(screenshots[0]!.tool).toBe("axe DevTools");
      expect(screenshots[0]!.url).toContain("axe+DevTools");
    });

    it("deve gerar screenshot de WebPageTest para payload", () => {
      const kpis: ProposalKpi[] = [
        {
          label: "Payload",
          valueBefore: 4.7,
          valueAfter: 1.1,
          improvement: "-77%",
          direction: "positive",
          unit: "MB",
        },
      ];

      const screenshots = generateScreenshotsForKpis(kpis);

      expect(screenshots).toHaveLength(1);
      expect(screenshots[0]!.tool).toBe("WebPageTest");
      expect(screenshots[0]!.url).toContain("WebPageTest");
    });

    it("deve gerar múltiplos screenshots para múltiplos KPIs", () => {
      const kpis: ProposalKpi[] = [
        {
          label: "Lighthouse Score",
          valueBefore: 42,
          valueAfter: 91,
          improvement: "+117%",
          direction: "positive",
        },
        {
          label: "WCAG AA",
          valueBefore: 0,
          valueAfter: 100,
          improvement: "+100%",
          direction: "positive",
          unit: "%",
        },
      ];

      const screenshots = generateScreenshotsForKpis(kpis);

      expect(screenshots).toHaveLength(2);
      expect(screenshots[0]!.tool).toBe("Lighthouse");
      expect(screenshots[1]!.tool).toBe("axe DevTools");
    });
  });

  describe("proposalKpiToCaseKpi", () => {
    it("deve converter ProposalKpi para CaseKpi", () => {
      const proposalKpi: ProposalKpi = {
        label: "Performance",
        valueBefore: 42,
        valueAfter: 91,
        improvement: "+117%",
        direction: "positive",
      };

      const caseKpi = proposalKpiToCaseKpi(proposalKpi);

      expect(caseKpi.label).toBe("Performance");
      expect(caseKpi.value).toBe(91);
      expect(caseKpi.direction).toBe("positive");
      expect(caseKpi.delta).toBeCloseTo(116.67, 1); // (91-42)/42 * 100
      expect(caseKpi.tooltip).toBe("42 → 91");
      expect(caseKpi.ariaDescription).toBe("Melhoria de +117%");
    });

    it("deve lidar com valores sem delta", () => {
      const proposalKpi: ProposalKpi = {
        label: "Status",
        valueBefore: 0,
        valueAfter: "Ativo",
        improvement: "N/A",
        direction: "neutral",
      };

      const caseKpi = proposalKpiToCaseKpi(proposalKpi);

      expect(caseKpi.value).toBe("Ativo");
      expect(caseKpi.delta).toBeUndefined();
    });
  });

  describe("generateProposal", () => {
    const mockCases: CaseSummary[] = [
      {
        slug: "cro-loja",
        title: "Programa de CRO para e-commerce de moda",
        summary: "Redesenho analítico do funil de compras.",
        client: "Studio Nébula",
        industry: "E-commerce",
        tags: ["CRO", "A/B Testing"],
        metrics: [
          { label: "Taxa de conversão", value: "+42%" },
          { label: "Ticket médio", value: "+18%" },
          { label: "LCP médio", value: "1.7s" },
        ],
        date: "2024-08-12",
        readingMinutes: 6,
        cover: "/cases/cro-loja.svg",
      },
      {
        slug: "whatsapp-inbox",
        title: "Inbox inteligente para squads comerciais no WhatsApp",
        summary: "Plataforma web que prioriza leads.",
        client: "GrowthMinds",
        industry: "SaaS",
        tags: ["Automação", "IA"],
        metrics: [
          { label: "Tempo de primeira resposta", value: "-63%" },
          { label: "NPS da squad", value: "62 → 84" },
        ],
        date: "2024-05-03",
        readingMinutes: 5,
        cover: "/cases/whatsapp-inbox.svg",
      },
    ];

    it("deve gerar proposta com múltiplos cases", () => {
      const proposal = generateProposal(mockCases, "Acme Corp");

      expect(proposal.client).toBe("Acme Corp");
      expect(proposal.caseReferences).toEqual(["cro-loja", "whatsapp-inbox"]);
      expect(proposal.sections).toHaveLength(2);
      expect(proposal.metadata.totalCases).toBe(2);
      expect(proposal.metadata.totalKpis).toBe(5); // 3 + 2
    });

    it("deve incluir KPIs parseados em cada seção", () => {
      const proposal = generateProposal(mockCases, "Acme Corp");

      expect(proposal.sections[0]!.kpis).toHaveLength(3);
      expect(proposal.sections[0]!.kpis[0]!.label).toBe("Taxa de conversão");
      expect(proposal.sections[0]!.kpis[0]!.valueAfter).toBe(42);
    });

    it("deve gerar screenshots para KPIs relevantes", () => {
      const proposal = generateProposal(mockCases, "Acme Corp");

      expect(proposal.metadata.totalScreenshots).toBeGreaterThan(0);
      expect(proposal.sections[0]!.screenshots.length).toBeGreaterThan(0);
    });

    it("deve calcular melhoria média", () => {
      const proposal = generateProposal(mockCases, "Acme Corp");

      expect(proposal.metadata.avgImprovement).toMatch(/%$/);
      expect(parseFloat(proposal.metadata.avgImprovement)).toBeGreaterThan(0);
    });

    it("deve incluir contexto adicional no executiveSummary", () => {
      const proposal = generateProposal(
        mockCases,
        "Acme Corp",
        "Projeto de transformação digital"
      );

      expect(proposal.executiveSummary).toBe("Projeto de transformação digital");
    });
  });

  describe("formatProposalAsMarkdown", () => {
    const mockProposal = generateProposal(
      [
        {
          slug: "test-case",
          title: "Test Case",
          summary: "Test summary",
          client: "Test Client",
          industry: "Tech",
          tags: ["test"],
          metrics: [{ label: "Performance", value: "+50%" }],
          date: "2024-01-01",
          readingMinutes: 5,
          cover: "/test.svg",
        },
      ],
      "Test Corp"
    );

    it("deve formatar proposta em Markdown", () => {
      const markdown = formatProposalAsMarkdown(mockProposal);

      expect(markdown).toContain("# Proposta Técnica - Test Corp");
      expect(markdown).toContain("## Resumo Executivo");
      expect(markdown).toContain("### KPIs Alcançados");
      expect(markdown).toContain("| Métrica | Antes | Depois | Melhoria |");
    });

    it("deve incluir tabela de KPIs", () => {
      const markdown = formatProposalAsMarkdown(mockProposal);

      expect(markdown).toContain("Performance");
      expect(markdown).toContain("50%");
    });

    it("deve incluir seções de evidências técnicas", () => {
      const markdown = formatProposalAsMarkdown(mockProposal);

      expect(markdown).toContain("### Evidências Técnicas");
    });
  });

  describe("formatProposalAsHtml", () => {
    const mockProposal = generateProposal(
      [
        {
          slug: "test-case",
          title: "Test Case",
          summary: "Test summary",
          client: "Test Client",
          industry: "Tech",
          tags: ["test"],
          metrics: [{ label: "Performance", value: "+50%" }],
          date: "2024-01-01",
          readingMinutes: 5,
          cover: "/test.svg",
        },
      ],
      "Test Corp"
    );

    it("deve formatar proposta em HTML válido", () => {
      const html = formatProposalAsHtml(mockProposal);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html lang=\"pt-BR\">");
      expect(html).toContain("<h1>Proposta Técnica - Test Corp</h1>");
      expect(html).toContain("</html>");
    });

    it("deve incluir estilos CSS inline", () => {
      const html = formatProposalAsHtml(mockProposal);

      expect(html).toContain("<style>");
      expect(html).toContain("font-family:");
      expect(html).toContain(".positive");
    });

    it("deve incluir tabela de KPIs em HTML", () => {
      const html = formatProposalAsHtml(mockProposal);

      expect(html).toContain("<table>");
      expect(html).toContain("<thead>");
      expect(html).toContain("<th>Métrica</th>");
    });

    it("deve incluir imagens de screenshots", () => {
      const html = formatProposalAsHtml(mockProposal);

      expect(html).toContain("<img");
      expect(html).toContain('loading="lazy"');
    });
  });
});
