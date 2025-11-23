import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { NetworkError } from "@/lib/utils/errors";

interface TestData {
  id: number;
  name: string;
  status: string;
}

const mockData: TestData[] = [
  { id: 1, name: "Alice", status: "active" },
  { id: 2, name: "Bob", status: "inactive" },
  { id: 3, name: "Charlie", status: "active" },
];

const mockColumns: DataGridColumn<TestData>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Nome", sortable: true, filterable: true },
  { key: "status", label: "Status", filterable: true },
];

describe("DataGrid - Error States", () => {
  it("renderiza error state quando error prop está definido", () => {
    const error = new Error("Falha ao carregar");
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        error={error}
      />
    );

    expect(screen.getByTestId("data-grid-error")).toBeInTheDocument();
    expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();
    expect(screen.getByText("Falha ao carregar")).toBeInTheDocument();
  });

  it("renderiza botão retry quando onRetry está disponível", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        error={new Error("Network timeout")}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByRole("button", { name: /tentar novamente/i });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("não renderiza dados quando há erro", () => {
    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        error={new Error("Error")}
      />
    );

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("renderiza mensagem de erro de NetworkError", () => {
    const error = new NetworkError("API indisponível", 503, "/api/data");

    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        error={error}
      />
    );

    expect(screen.getByText("API indisponível")).toBeInTheDocument();
  });
});

describe("DataGrid - Loading State", () => {
  it("renderiza loading state quando isLoading=true", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
      />
    );

    expect(screen.getByTestId("data-grid-loading")).toBeInTheDocument();
    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
  });

  it("não renderiza tabela durante loading", () => {
    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
      />
    );

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("renderiza loading com spinner animado", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
      />
    );

    const loadingContainer = screen.getByTestId("data-grid-loading");
    const spinner = within(loadingContainer).getByRole("status");
    
    expect(spinner).toHaveAttribute("aria-live", "polite");
  });
});

describe("DataGrid - Empty States", () => {
  it("renderiza empty state padrão quando data está vazio", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
      />
    );

    expect(screen.getByText("Nenhum dado disponível")).toBeInTheDocument();
  });

  it("renderiza custom emptyMessage", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        emptyMessage="Nada aqui ainda"
      />
    );

    expect(screen.getByText("Nada aqui ainda")).toBeInTheDocument();
  });

  it("renderiza empty state específico quando filtros estão aplicados", async () => {
    const user = userEvent.setup();

    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        filterable={true}
      />
    );

    // Aplicar filtro que não retorna resultados
    const filterInput = screen.getByLabelText("Filtrar Nome");
    await user.type(filterInput, "XYZ");

    expect(screen.getByText("Nenhum resultado encontrado com os filtros aplicados")).toBeInTheDocument();
  });

  it("renderiza botão para limpar filtros no empty state", async () => {
    const user = userEvent.setup();

    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        filterable={true}
      />
    );

    const filterInput = screen.getByLabelText("Filtrar Nome");
    await user.type(filterInput, "NOTFOUND");

    const clearButton = screen.getByRole("button", { name: /limpar/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    
    // Após limpar, deve mostrar dados novamente
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renderiza ícone de busca no empty state", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
      />
    );

    const searchIcon = screen.getByRole("cell").querySelector('svg');
    expect(searchIcon).toHaveAttribute("aria-hidden", "true");
  });
});

describe("DataGrid - Locale/i18n", () => {
  it("renderiza mensagens em português por padrão", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
      />
    );

    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
  });

  it("renderiza mensagens em inglês quando locale=en", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
        locale="en"
      />
    );

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("empty state em inglês", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        locale="en"
      />
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("error message em inglês", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        error={new Error("Failed to load")}
        locale="en"
      />
    );

    expect(screen.getByText("Error loading data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("botão limpar filtros em inglês", async () => {
    const user = userEvent.setup();

    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        filterable={true}
        locale="en"
      />
    );

    const filterInput = screen.getByLabelText("Filtrar Nome");
    await user.type(filterInput, "XYZ");

    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });
});

describe("DataGrid - Error Recovery", () => {
  it("limpa error quando dados são carregados com sucesso", () => {
    const { rerender } = render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        error={new Error("Failed")}
      />
    );

    expect(screen.getByTestId("data-grid-error")).toBeInTheDocument();

    rerender(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        error={null}
      />
    );

    expect(screen.queryByTestId("data-grid-error")).not.toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("muda de loading para success", () => {
    const { rerender } = render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
      />
    );

    expect(screen.getByTestId("data-grid-loading")).toBeInTheDocument();

    rerender(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        isLoading={false}
      />
    );

    expect(screen.queryByTestId("data-grid-loading")).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("muda de loading para error", () => {
    const { rerender } = render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={true}
      />
    );

    rerender(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        isLoading={false}
        error={new Error("Timeout")}
      />
    );

    expect(screen.queryByTestId("data-grid-loading")).not.toBeInTheDocument();
    expect(screen.getByTestId("data-grid-error")).toBeInTheDocument();
  });
});
