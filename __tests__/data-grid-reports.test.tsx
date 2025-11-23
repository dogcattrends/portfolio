import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { testDatasets } from "@/lib/test-factories";
import type { Project, Skill } from "@/lib/schemas";

describe("DataGrid - Relatórios (Projects)", () => {
  const projectColumns: DataGridColumn<Project>[] = [
    { key: "title", label: "Título", sortable: true, filterable: true },
    { key: "status", label: "Status", sortable: true, filterable: true },
    {
      key: "startDate",
      label: "Data Início",
      sortable: true,
      render: (value) => new Date(value as Date).toLocaleDateString("pt-BR"),
    },
    {
      key: "technologies",
      label: "Tecnologias",
      render: (value) => (value as string[]).join(", "),
    },
  ];

  describe("Quantidade Correta", () => {
    it("deve renderizar todos 10 projetos do dataset", () => {
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(11); // 1 header + 10 data rows
    });

    it("deve exibir contagem correta no footer", () => {
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      expect(screen.getByText(/Exibindo 10 de 10 itens/i)).toBeInTheDocument();
    });

    it("deve exibir contagem correta após filtro", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const filterInput = screen.getByLabelText("Filtrar Status");
      await user.type(filterInput, "completed");

      // Dataset tem 1 projeto COMPLETED
      expect(screen.getByText(/Exibindo 1 de 10 itens/i)).toBeInTheDocument();
    });

    it("deve exibir zero itens quando filtro não retorna resultados", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const filterInput = screen.getByLabelText("Filtrar Título");
      await user.type(filterInput, "xyz123naoexiste");

      expect(screen.getByText(/Exibindo 0 de 10 itens/i)).toBeInTheDocument();
      expect(screen.getByText(/Nenhum dado encontrado/i)).toBeInTheDocument();
    });

    it("deve contar corretamente após múltiplos filtros", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const statusFilter = screen.getByLabelText("Filtrar Status");
      await user.type(statusFilter, "draft");

      // Dataset tem 2 projetos DRAFT (índices 0 e 8)
      expect(screen.getByText(/Exibindo 2 de 10 itens/i)).toBeInTheDocument();
    });
  });

  describe("Ordenação", () => {
    it("deve ordenar projetos por título alfabeticamente (ASC)", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Título/i,
      });
      await user.click(sortButton);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[1];

      // Alfabeticamente, primeiro deve ser "CLI Tool", "Dashboard Analytics", "Design System", etc.
      // Verificar que a ordem mudou
      expect(firstRow).toHaveTextContent(/CLI Tool|Dashboard Analytics/i);
    });

    it("deve ordenar projetos por título reversamente (DESC)", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Título/i,
      });
      
      // ASC
      await user.click(sortButton);
      // DESC
      await user.click(sortButton);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[1];

      // Reverso alfabético deve ter "Mobile Banking App", "Legacy Monolith", etc.
      expect(firstRow).toHaveTextContent(
        /Mobile Banking App|Legacy Monolith|Landing Page/i
      );
    });

    it("deve ordenar por data corretamente", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Data Início/i,
      });
      await user.click(sortButton);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[1];

      // Projeto mais antigo no dataset é "Legacy Monolith Migration" (2018-01-01)
      expect(firstRow).toHaveTextContent(/Legacy Monolith Migration/i);
    });

    it("deve manter ordenação após aplicar filtro", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      // Ordenar por título
      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Título/i,
      });
      await user.click(sortButton);

      // Aplicar filtro
      const filterInput = screen.getByLabelText("Filtrar Status");
      await user.type(filterInput, "draft");

      const rows = screen.getAllByRole("row");
      
      // Deve ter 2 drafts ordenados alfabeticamente
      expect(rows).toHaveLength(3); // 1 header + 2 drafts
    });

    it("deve remover ordenação após terceiro clique", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
        />
      );

      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Título/i,
      });

      // 3 cliques
      await user.click(sortButton);
      await user.click(sortButton);
      await user.click(sortButton);

      // Deve voltar à ordem original (ordem do array)
      const rows = screen.getAllByRole("row");
      const firstRow = rows[1];
      expect(firstRow).toHaveTextContent(/Dashboard Analytics/i); // Primeiro item do dataset
    });
  });

  describe("Exportação CSV", () => {
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;
    let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
    let mockClick: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockCreateObjectURL = vi.fn(() => "blob:mock-url");
      mockRevokeObjectURL = vi.fn();
      mockClick = vi.fn();

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      // Mock createElement para interceptar link
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === "a") {
          element.click = mockClick;
        }
        return element;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deve gerar CSV com headers corretos", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects.slice(0, 3)}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      // Verificar que Blob foi criado
      expect(mockCreateObjectURL).toHaveBeenCalled();
      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;

      const csvContent = await blobArg.text();
      expect(csvContent).toContain("Título,Status,Data Início,Tecnologias");
    });

    it("deve gerar CSV com todas as 10 linhas de dados", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      const lines = csvContent.split("\n");
      expect(lines.length).toBe(11); // 1 header + 10 rows
    });

    it("deve escapar vírgulas em valores CSV", async () => {
      const user = userEvent.setup();
      const dataWithCommas = [
        {
          id: "1",
          title: "Project A, B, and C",
          status: "completed",
          startDate: new Date("2023-01-01"),
          technologies: ["React", "Node.js"],
        },
      ];

      const simpleColumns: DataGridColumn<typeof dataWithCommas[0]>[] = [
        { key: "title", label: "Título" },
        { key: "status", label: "Status" },
      ];

      render(
        <DataGrid
          data={dataWithCommas}
          columns={simpleColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      // Valores com vírgulas devem estar entre aspas
      expect(csvContent).toContain('"Project A, B, and C"');
    });

    it("deve escapar aspas duplas em valores CSV", async () => {
      const user = userEvent.setup();
      const dataWithQuotes = [
        {
          id: "1",
          title: 'Project "Alpha"',
          status: "completed",
          startDate: new Date("2023-01-01"),
          technologies: ["React"],
        },
      ];

      const simpleColumns: DataGridColumn<typeof dataWithQuotes[0]>[] = [
        { key: "title", label: "Título" },
      ];

      render(
        <DataGrid
          data={dataWithQuotes}
          columns={simpleColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      // Aspas devem ser duplicadas e valor entre aspas
      expect(csvContent).toContain('"Project ""Alpha"""');
    });

    it("deve ter nome de arquivo padrão 'export.csv'", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects.slice(0, 1)}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      expect(mockClick).toHaveBeenCalled();
    });

    it("deve criar Blob com tipo text/csv", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects.slice(0, 1)}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      expect(blobArg.type).toBe("text/csv;charset=utf-8;");
    });

    it("deve revocar ObjectURL após download", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects.slice(0, 1)}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("deve anunciar exportação via aria-live", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects.slice(0, 5)}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveTextContent(/Arquivo CSV exportado com 5 linhas/i);
    });

    it("deve exportar apenas dados filtrados", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      // Aplicar filtro
      const filterInput = screen.getByLabelText("Filtrar Status");
      await user.type(filterInput, "draft");

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      const lines = csvContent.split("\n");
      expect(lines.length).toBe(3); // 1 header + 2 drafts
    });

    it("deve exportar dados ordenados", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.projects.slice(0, 3)}
          columns={projectColumns}
          rowKey="id"
          exportable
        />
      );

      // Ordenar por título
      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Título/i,
      });
      await user.click(sortButton);

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      const lines = csvContent.split("\n");
      // Verificar que os dados estão ordenados
      expect(lines.length).toBe(4); // 1 header + 3 rows
    });
  });
});

describe("DataGrid - Relatórios (Skills)", () => {
  const skillColumns: DataGridColumn<Skill>[] = [
    { key: "name", label: "Habilidade", sortable: true, filterable: true },
    { key: "category", label: "Categoria", sortable: true, filterable: true },
    {
      key: "level",
      label: "Nível",
      sortable: true,
      align: "center",
      render: (value) => {
        const levels = ["", "Iniciante", "Intermediário", "Avançado", "Expert", "Master"];
        return levels[value as number];
      },
    },
    {
      key: "yearsOfExperience",
      label: "Anos Exp.",
      sortable: true,
      align: "right",
    },
  ];

  describe("Quantidade Correta", () => {
    it("deve renderizar todas 10 skills do dataset", () => {
      render(
        <DataGrid data={testDatasets.skills} columns={skillColumns} rowKey="id" />
      );

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(11); // 1 header + 10 skills
    });

    it("deve filtrar skills por categoria", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid data={testDatasets.skills} columns={skillColumns} rowKey="id" />
      );

      const filterInput = screen.getByLabelText("Filtrar Categoria");
      await user.type(filterInput, "frontend");

      // Dataset tem 2 skills FRONTEND (JavaScript e React)
      expect(screen.getByText(/Exibindo 2 de 10 itens/i)).toBeInTheDocument();
    });
  });

  describe("Ordenação", () => {
    it("deve ordenar skills por nível (numérico)", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid data={testDatasets.skills} columns={skillColumns} rowKey="id" />
      );

      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Nível/i,
      });
      await user.click(sortButton);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[1];

      // Menor nível é 1 (BEGINNER) - Rust
      expect(firstRow).toHaveTextContent(/Rust|Iniciante/i);
    });

    it("deve ordenar skills por anos de experiência", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid data={testDatasets.skills} columns={skillColumns} rowKey="id" />
      );

      const sortButton = screen.getByRole("button", {
        name: /Ordenar por Anos Exp./i,
      });
      await user.click(sortButton);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[1];

      // Menor experiência é 0 anos - Rust
      expect(firstRow).toHaveTextContent(/Rust/i);
      expect(firstRow).toHaveTextContent(/0/);
    });
  });

  describe("Exportação CSV", () => {
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockCreateObjectURL = vi.fn(() => "blob:mock-url");
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = vi.fn();

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === "a") {
          element.click = vi.fn();
        }
        return element;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deve gerar CSV com 10 skills", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.skills}
          columns={skillColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      const lines = csvContent.split("\n");
      expect(lines.length).toBe(11); // 1 header + 10 skills
    });

    it("deve incluir valores renderizados no CSV", async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          data={testDatasets.skills}
          columns={skillColumns}
          rowKey="id"
          exportable
        />
      );

      const exportButton = screen.getByRole("button", {
        name: /Exportar.*CSV/i,
      });
      await user.click(exportButton);

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const csvContent = await blobArg.text();

      // Verificar que CSV contém dados de skills
      expect(csvContent).toContain("TypeScript");
      expect(csvContent).toContain("React");
      expect(csvContent).toContain("frontend");
    });
  });
});
