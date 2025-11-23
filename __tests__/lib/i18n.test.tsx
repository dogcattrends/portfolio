import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useTranslations, getTranslations, isValidLocale, getBrowserLocale } from "@/lib/i18n/ui";

describe("UI i18n", () => {
  describe("useTranslations", () => {
    it("retorna dicionário português por padrão", () => {
      const TestComponent = () => {
        const t = useTranslations();
        return <div>{t.common.loading}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("retorna dicionário inglês quando locale=en", () => {
      const TestComponent = () => {
        const t = useTranslations("en");
        return <div>{t.common.loading}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("getTranslations", () => {
    it("retorna dicionário português", () => {
      const t = getTranslations("pt");
      expect(t.dataGrid.emptyState).toBe("Nenhum dado disponível");
      expect(t.composer.send).toBe("Enviar");
    });

    it("retorna dicionário inglês", () => {
      const t = getTranslations("en");
      expect(t.dataGrid.emptyState).toBe("No data available");
      expect(t.composer.send).toBe("Send");
    });
  });

  describe("Mensagens do DataGrid", () => {
    it("possui mensagens pt", () => {
      const t = getTranslations("pt");
      
      expect(t.dataGrid.emptyState).toBe("Nenhum dado disponível");
      expect(t.dataGrid.emptyFiltered).toBe("Nenhum resultado encontrado com os filtros aplicados");
      expect(t.dataGrid.emptySearch).toBe("Nenhum resultado para a busca");
      expect(t.dataGrid.loading).toBe("Carregando dados...");
      expect(t.dataGrid.error).toBe("Erro ao carregar dados");
    });

    it("possui mensagens en", () => {
      const t = getTranslations("en");
      
      expect(t.dataGrid.emptyState).toBe("No data available");
      expect(t.dataGrid.emptyFiltered).toBe("No results found with the applied filters");
      expect(t.dataGrid.loading).toBe("Loading data...");
    });

    it("formata rowsSelected corretamente", () => {
      const tPt = getTranslations("pt");
      const tEn = getTranslations("en");
      
      expect(tPt.dataGrid.rowsSelected(1)).toBe("1 linha selecionada");
      expect(tPt.dataGrid.rowsSelected(5)).toBe("5 linhas selecionadas");
      
      expect(tEn.dataGrid.rowsSelected(1)).toBe("1 row selected");
      expect(tEn.dataGrid.rowsSelected(5)).toBe("5 rows selected");
    });

    it("formata filterApplied corretamente", () => {
      const tPt = getTranslations("pt");
      
      expect(tPt.dataGrid.filterApplied(1)).toBe("1 filtro aplicado");
      expect(tPt.dataGrid.filterApplied(3)).toBe("3 filtros aplicados");
    });

    it("formata sortedBy corretamente", () => {
      const tPt = getTranslations("pt");
      
      expect(tPt.dataGrid.sortedBy("Nome", "asc")).toBe("Ordenado por Nome (crescente)");
      expect(tPt.dataGrid.sortedBy("Data", "desc")).toBe("Ordenado por Data (decrescente)");
    });
  });

  describe("Mensagens do Composer", () => {
    it("possui mensagens pt", () => {
      const t = getTranslations("pt");
      
      expect(t.composer.placeholder).toBe("Digite sua mensagem...");
      expect(t.composer.send).toBe("Enviar");
      expect(t.composer.sending).toBe("Enviando...");
      expect(t.composer.slashCommandsHint).toBe("Digite / para ver comandos disponíveis");
    });

    it("formata charLimit corretamente", () => {
      const tPt = getTranslations("pt");
      const tEn = getTranslations("en");
      
      expect(tPt.composer.charLimit(120, 500)).toBe("120/500 caracteres");
      expect(tEn.composer.charLimit(120, 500)).toBe("120/500 characters");
    });

    it("formata suggestionsAvailable corretamente", () => {
      const tPt = getTranslations("pt");
      
      expect(tPt.composer.suggestionsAvailable(1)).toBe("1 sugestão disponível");
      expect(tPt.composer.suggestionsAvailable(8)).toBe("8 sugestões disponíveis");
    });
  });

  describe("Mensagens Comuns", () => {
    it("possui ações básicas em pt", () => {
      const t = getTranslations("pt");
      
      expect(t.common.loading).toBe("Carregando...");
      expect(t.common.error).toBe("Erro");
      expect(t.common.retry).toBe("Tentar novamente");
      expect(t.common.cancel).toBe("Cancelar");
      expect(t.common.save).toBe("Salvar");
    });

    it("possui ações básicas em en", () => {
      const t = getTranslations("en");
      
      expect(t.common.loading).toBe("Loading...");
      expect(t.common.error).toBe("Error");
      expect(t.common.retry).toBe("Try again");
      expect(t.common.cancel).toBe("Cancel");
    });
  });

  describe("isValidLocale", () => {
    it("valida pt e en", () => {
      expect(isValidLocale("pt")).toBe(true);
      expect(isValidLocale("en")).toBe(true);
    });

    it("rejeita outros locales", () => {
      expect(isValidLocale("fr")).toBe(false);
      expect(isValidLocale("es")).toBe(false);
      expect(isValidLocale("")).toBe(false);
    });
  });

  describe("getBrowserLocale", () => {
    it("retorna pt para navegadores pt-BR", () => {
      // Mock navigator.language
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "pt-BR",
      });
      
      expect(getBrowserLocale()).toBe("pt");
    });

    it("retorna en para outros navegadores", () => {
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "en-US",
      });
      
      expect(getBrowserLocale()).toBe("en");
    });

    it("retorna pt como fallback server-side", () => {
      // Simula ambiente server-side
      const originalWindow = global.window;
      // @ts-expect-error - simulando server-side
      delete global.window;
      
      expect(getBrowserLocale()).toBe("pt");
      
      // Restaura
      global.window = originalWindow;
    });
  });
});
