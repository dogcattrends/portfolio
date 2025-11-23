import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseKpi } from "@/components/case-kpi";
import type { KpiMetric } from "@/components/case-kpi";

describe("CaseKpi", () => {
  const mockMetrics: KpiMetric[] = [
    {
      label: "Performance",
      value: 95,
      delta: 12.5,
      direction: "positive",
      tooltip: "Lighthouse score",
      ariaDescription: "Melhorou de 84 para 95",
    },
    {
      label: "Acessibilidade",
      value: 100,
      delta: 0,
      direction: "neutral",
    },
    {
      label: "Tempo de carregamento",
      value: 1.2,
      unit: "s",
      delta: -25.0,
      direction: "positive",
      ariaDescription: "Redução de 1.6s para 1.2s",
    },
  ];

  it("renderiza todos os KPIs", () => {
    render(<CaseKpi metrics={mockMetrics} />);

    expect(screen.getByTestId("kpi-card-performance")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-card-acessibilidade")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-card-tempo-de-carregamento")).toBeInTheDocument();
  });

  it("exibe valores e unidades corretamente", () => {
    render(<CaseKpi metrics={mockMetrics} />);

    const values = screen.getAllByTestId("kpi-value");
    expect(values[0]).toHaveTextContent("95");
    expect(values[2]).toHaveTextContent("1.2");
    expect(screen.getByText("s")).toBeInTheDocument();
  });

  it("renderiza delta positivo com ícone de seta para cima", () => {
    render(
      <CaseKpi
        metrics={[
          {
            label: "Score",
            value: 95,
            delta: 10.5,
            direction: "positive",
          },
        ]}
      />
    );

    const delta = screen.getByTestId("kpi-delta");
    expect(delta).toHaveTextContent("+10.5%");
    expect(delta).toHaveClass("text-green-700");
  });

  it("renderiza delta negativo com ícone de seta para baixo", () => {
    render(
      <CaseKpi
        metrics={[
          {
            label: "Errors",
            value: 2,
            delta: -5.0,
            direction: "negative",
          },
        ]}
      />
    );

    const delta = screen.getByTestId("kpi-delta");
    expect(delta).toHaveTextContent("-5.0%");
    expect(delta).toHaveClass("text-red-700");
  });

  it("renderiza delta neutro", () => {
    render(
      <CaseKpi
        metrics={[
          {
            label: "Status",
            value: 100,
            delta: 0,
            direction: "neutral",
          },
        ]}
      />
    );

    const delta = screen.getByTestId("kpi-delta");
    expect(delta).toHaveTextContent("+0.0%");
    expect(delta).toHaveClass("text-gray-600");
  });

  it("não renderiza delta quando ausente", () => {
    render(
      <CaseKpi
        metrics={[
          {
            label: "Score",
            value: 95,
          },
        ]}
      />
    );

    expect(screen.queryByTestId("kpi-delta")).not.toBeInTheDocument();
  });

  it("aplica layout grid por padrão", () => {
    render(<CaseKpi metrics={mockMetrics} />);

    const container = screen.getByTestId("case-kpi-container");
    expect(container).toHaveClass("grid");
  });

  it("aplica layout horizontal", () => {
    render(<CaseKpi metrics={mockMetrics} layout="horizontal" />);

    const container = screen.getByTestId("case-kpi-container");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("overflow-x-auto");
  });

  it("tem aria-labels apropriados", () => {
    render(<CaseKpi metrics={mockMetrics} />);

    expect(
      screen.getByLabelText(/Performance: 95, variação de \+12.5%/)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Métricas de desempenho do caso")
    ).toBeInTheDocument();
  });

  it("renderiza aria-description quando fornecido", () => {
    render(<CaseKpi metrics={mockMetrics} />);

    expect(screen.getByText("Melhorou de 84 para 95")).toHaveClass("sr-only");
    expect(screen.getByText("Redução de 1.6s para 1.2s")).toHaveClass("sr-only");
  });
});
