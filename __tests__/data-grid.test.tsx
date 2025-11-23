import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";

interface TestData {
  id: string;
  name: string;
  age: number;
  email: string;
  status: "active" | "inactive";
}

const mockData: TestData[] = [
  { id: "1", name: "Alice Silva", age: 28, email: "alice@example.com", status: "active" },
  { id: "2", name: "Bruno Costa", age: 35, email: "bruno@example.com", status: "active" },
  { id: "3", name: "Carla Souza", age: 22, email: "carla@example.com", status: "inactive" },
  { id: "4", name: "Daniel Lima", age: 41, email: "daniel@example.com", status: "active" },
  { id: "5", name: "Elisa Rocha", age: 30, email: "elisa@example.com", status: "inactive" },
];

const mockColumns: DataGridColumn<TestData>[] = [
  { key: "name", label: "Nome", sortable: true, filterable: true },
  { key: "age", label: "Idade", sortable: true, filterable: true, align: "right" },
  { key: "email", label: "E-mail", sortable: true, filterable: true },
  { key: "status", label: "Status", sortable: true, filterable: true },
];

describe("DataGrid - Render", () => {
  it("deve renderizar tabela com dados", () => {
    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        ariaLabel="Tabela de usuários"
      />
    );

    expect(screen.getByRole("region", { name: "Tabela de usuários" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(6); // 1 header + 5 data rows
  });

  it("deve renderizar cabeçalhos de coluna", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    expect(screen.getByRole("columnheader", { name: /Nome/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Idade/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /E-mail/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Status/i })).toBeInTheDocument();
  });

  it("deve renderizar células com valores corretos", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    expect(screen.getByText("Alice Silva")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não há dados", () => {
    render(
      <DataGrid
        data={[]}
        columns={mockColumns}
        rowKey="id"
        emptyMessage="Nenhum usuário encontrado"
      />
    );

    expect(screen.getByText("Nenhum usuário encontrado")).toBeInTheDocument();
  });

  it("deve renderizar contagem de itens", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    expect(screen.getByText(/Exibindo 5 de 5 itens/i)).toBeInTheDocument();
  });
});

describe("DataGrid - Ordenação", () => {
  it("deve ter botões de ordenação em colunas sortable", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const sortButtons = screen.getAllByRole("button", { name: /Ordenar por/i });
    expect(sortButtons).toHaveLength(4); // Todas as 4 colunas são sortable
  });

  it("deve ordenar por nome em ordem ascendente", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const sortButton = screen.getByRole("button", { name: /Ordenar por Nome/i });
    await user.click(sortButton);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header
    expect(firstDataRow).toBeDefined();
    expect(within(firstDataRow!).getByText("Alice Silva")).toBeInTheDocument();
  });

  it("deve ordenar por idade em ordem descendente após dois cliques", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const sortButton = screen.getByRole("button", { name: /Ordenar por Idade/i });
    
    // Primeiro clique: ascendente
    await user.click(sortButton);
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toBeDefined();
    expect(within(rows[1]!).getByText("22")).toBeInTheDocument();

    // Segundo clique: descendente
    await user.click(sortButton);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toBeDefined();
    expect(within(rows[1]!).getByText("41")).toBeInTheDocument();
  });

  it("deve ter aria-sort correto", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const sortButton = screen.getByRole("button", { name: /Ordenar por Nome/i });
    const header = screen.getByRole("columnheader", { name: /Nome/i });

    // Antes de ordenar
    expect(sortButton).toHaveAttribute("aria-sort", "none");

    // Ordenação ascendente
    await user.click(sortButton);
    expect(sortButton).toHaveAttribute("aria-sort", "ascending");

    // Ordenação descendente
    await user.click(sortButton);
    expect(sortButton).toHaveAttribute("aria-sort", "descending");
  });

  it("deve remover ordenação após terceiro clique", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const sortButton = screen.getByRole("button", { name: /Ordenar por Nome/i });

    // 3 cliques
    await user.click(sortButton);
    await user.click(sortButton);
    await user.click(sortButton);

    expect(sortButton).toHaveAttribute("aria-sort", "none");
  });
});

describe("DataGrid - Filtros", () => {
  it("deve ter inputs de filtro para colunas filterable", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    expect(screen.getByLabelText(/Filtrar Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar Idade/i)).toBeInTheDocument();
  });

  it("deve filtrar por nome", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const filterInput = screen.getByLabelText("Filtrar Nome");
    await user.type(filterInput, "alice");

    expect(screen.getByText("Alice Silva")).toBeInTheDocument();
    expect(screen.queryByText("Bruno Costa")).not.toBeInTheDocument();
    expect(screen.getByText(/Exibindo 1 de 5 itens/i)).toBeInTheDocument();
  });

  it("deve filtrar case-insensitive", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const filterInput = screen.getByLabelText("Filtrar Nome");
    await user.type(filterInput, "ALICE");

    expect(screen.getByText("Alice Silva")).toBeInTheDocument();
  });

  it("deve aplicar múltiplos filtros", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const nameFilter = screen.getByLabelText("Filtrar Nome");
    const statusFilter = screen.getByLabelText("Filtrar Status");

    await user.type(statusFilter, "active");
    expect(screen.getAllByRole("row")).toHaveLength(4); // 1 header + 3 active

    await user.type(nameFilter, "alice");
    expect(screen.getAllByRole("row")).toHaveLength(2); // 1 header + 1 match
  });

  it("deve exibir botão de limpar filtros quando há filtros ativos", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    expect(screen.queryByRole("button", { name: /Limpar todos os filtros/i })).not.toBeInTheDocument();

    const filterInput = screen.getByLabelText("Filtrar Nome");
    await user.type(filterInput, "alice");

    const clearButton = screen.getByRole("button", { name: /Limpar todos os filtros/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveTextContent("Limpar filtros (1)");
  });

  it("deve limpar todos os filtros ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const nameFilter = screen.getByLabelText("Filtrar Nome");
    const statusFilter = screen.getByLabelText("Filtrar Status");

    await user.type(nameFilter, "alice");
    await user.type(statusFilter, "active");

    const clearButton = screen.getByRole("button", { name: /Limpar filtros \(2\)/i });
    await user.click(clearButton);

    expect(nameFilter).toHaveValue("");
    expect(statusFilter).toHaveValue("");
    expect(screen.getAllByRole("row")).toHaveLength(6); // Todos os dados
  });

  it("deve anunciar resultados de filtro via aria-live", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const liveRegion = screen.getByRole("status");
    const filterInput = screen.getByLabelText("Filtrar Nome");

    await user.type(filterInput, "alice");

    // Verifica que aria-live contém mensagem de filtro
    expect(liveRegion).toHaveTextContent(/1 resultado encontrado/i);
  });

  it("deve anunciar quando filtros são removidos", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const liveRegion = screen.getByRole("status");
    const filterInput = screen.getByLabelText("Filtrar Nome");

    await user.type(filterInput, "alice");
    await user.clear(filterInput);

    expect(liveRegion).toHaveTextContent(/Filtros removidos.*5 itens exibidos/i);
  });
});

describe("DataGrid - Navegação por Teclado", () => {
  it("deve permitir navegação com seta para baixo", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}");
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveClass("bg-blue-100"); // Primeira linha de dados focada
  });

  it("deve permitir navegação com seta para cima", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}");
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveClass("bg-blue-100");
  });

  it("deve navegar com PageDown (10 linhas)", async () => {
    const user = userEvent.setup();
    const largeData = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i,
      email: `user${i + 1}@example.com`,
      status: "active" as const,
    }));

    render(<DataGrid data={largeData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{PageDown}");
    const rows = screen.getAllByRole("row");
    expect(rows[11]).toHaveClass("bg-blue-100"); // Linha 10 (0-indexed)
  });

  it("deve navegar com PageUp", async () => {
    const user = userEvent.setup();
    const largeData = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i,
      email: `user${i + 1}@example.com`,
      status: "active" as const,
    }));

    render(<DataGrid data={largeData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{PageDown}{PageUp}");
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveClass("bg-blue-100"); // Volta para linha 0
  });

  it("deve navegar com Home (primeira coluna)", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}{ArrowRight}{ArrowRight}{Home}");
    const rows = screen.getAllByRole("row");
    const cells = within(rows[1]).getAllByRole("gridcell");
    expect(cells[0]).toHaveClass("font-semibold"); // Primeira coluna focada
  });

  it("deve navegar com End (última coluna)", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}{End}");
    const rows = screen.getAllByRole("row");
    const cells = within(rows[1]).getAllByRole("gridcell");
    expect(cells[cells.length - 1]).toHaveClass("font-semibold"); // Última coluna focada
  });

  it("deve navegar com Ctrl+Home (primeira célula)", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{PageDown}{End}");
    await user.keyboard("{Control>}{Home}{/Control}");

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveClass("bg-blue-100"); // Primeira linha
    const cells = within(rows[1]).getAllByRole("gridcell");
    expect(cells[0]).toHaveClass("font-semibold"); // Primeira coluna
  });

  it("deve navegar com Ctrl+End (última célula)", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{Control>}{End}{/Control}");

    const rows = screen.getAllByRole("row");
    expect(rows[5]).toHaveClass("bg-blue-100"); // Última linha (5 dados)
    const cells = within(rows[5]).getAllByRole("gridcell");
    expect(cells[cells.length - 1]).toHaveClass("font-semibold"); // Última coluna
  });

  it("deve chamar onRowActivate ao pressionar Enter", async () => {
    const user = userEvent.setup();
    const onRowActivate = vi.fn();
    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        onRowActivate={onRowActivate}
      />
    );

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}{Enter}");

    expect(onRowActivate).toHaveBeenCalledWith(mockData[0]);
  });

  it("deve chamar onRowClick ao pressionar Space", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        onRowClick={onRowClick}
      />
    );

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}{ }");

    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("deve anunciar navegação de linha via aria-live", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const liveRegion = screen.getByRole("status");
    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}");

    expect(liveRegion).toHaveTextContent(/Linha 1 de 5.*Nome: Alice Silva/i);
  });

  it("deve ter aria-selected nas linhas focadas", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}");
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveAttribute("aria-selected", "true");
  });

  it("não deve navegar além dos limites (primeira linha)", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{ArrowDown}{ArrowUp}{ArrowUp}");
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveClass("bg-blue-100"); // Permanece na primeira linha
  });

  it("não deve navegar além dos limites (última linha)", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    grid.focus();

    await user.keyboard("{Control>}{End}{/Control}{ArrowDown}{ArrowDown}");
    const rows = screen.getAllByRole("row");
    expect(rows[5]).toHaveClass("bg-blue-100"); // Permanece na última linha
  });
});

describe("DataGrid - Click Interaction", () => {
  it("deve chamar onRowClick ao clicar em linha", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataGrid
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        onRowClick={onRowClick}
      />
    );

    const rows = screen.getAllByRole("row");
    await user.click(rows[1]); // Primeira linha de dados

    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("deve focar linha ao clicar", async () => {
    const user = userEvent.setup();
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const rows = screen.getAllByRole("row");
    await user.click(rows[2]); // Segunda linha de dados

    expect(rows[2]).toHaveClass("bg-blue-100");
  });
});

describe("DataGrid - Exportação CSV", () => {
  it("deve exibir botão de exportar quando exportable=true", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" exportable />);

    expect(screen.getByRole("button", { name: /Exportar.*CSV/i })).toBeInTheDocument();
  });

  it("não deve exibir botão de exportar quando exportable=false", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" exportable={false} />);

    expect(screen.queryByRole("button", { name: /Exportar.*CSV/i })).not.toBeInTheDocument();
  });

  it("não deve exibir botão quando não há dados", () => {
    render(<DataGrid data={[]} columns={mockColumns} rowKey="id" exportable />);

    expect(screen.queryByRole("button", { name: /Exportar.*CSV/i })).not.toBeInTheDocument();
  });

  it("deve ter aria-label descritivo no botão de exportar", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" exportable />);

    const exportButton = screen.getByRole("button", { name: /Exportar 5 linhas para CSV/i });
    expect(exportButton).toBeInTheDocument();
  });
});

describe("DataGrid - Acessibilidade", () => {
  it("não deve ter violações de acessibilidade", async () => {
    const { container } = render(
      <DataGrid data={mockData} columns={mockColumns} rowKey="id" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("deve ter role=region no container", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" ariaLabel="Usuários" />);

    expect(screen.getByRole("region", { name: "Usuários" })).toBeInTheDocument();
  });

  it("deve ter aria-live region para anúncios", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("deve ter labels em todos inputs de filtro", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    expect(screen.getByLabelText("Filtrar Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar Idade")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar Status")).toBeInTheDocument();
  });

  it("deve ter tabindex=0 no container para navegação", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const grid = screen.getByRole("region");
    expect(grid).toHaveAttribute("tabindex", "0");
  });

  it("deve ter aria-rowindex nas linhas", () => {
    render(<DataGrid data={mockData} columns={mockColumns} rowKey="id" />);

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveAttribute("aria-rowindex", "2"); // Header é row 1
  });
});

describe("DataGrid - Custom Render", () => {
  it("deve usar função render customizada", () => {
    const customColumns: DataGridColumn<TestData>[] = [
      {
        key: "status",
        label: "Status",
        render: (value) => (
          <span className={value === "active" ? "text-green-600" : "text-red-600"}>
            {value === "active" ? "Ativo" : "Inativo"}
          </span>
        ),
      },
    ];

    render(<DataGrid data={mockData} columns={customColumns} rowKey="id" />);

    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });
});
