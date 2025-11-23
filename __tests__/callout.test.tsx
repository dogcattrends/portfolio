import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Callout } from "@/components/ui/callout";

describe("Callout", () => {
  describe("Rendering", () => {
    it("renderiza com conteúdo básico", () => {
      render(<Callout>Mensagem de teste</Callout>);

      expect(screen.getByText("Mensagem de teste")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("renderiza título quando fornecido", () => {
      render(<Callout title="Aviso Importante">Conteúdo</Callout>);

      expect(screen.getByTestId("callout-title")).toHaveTextContent("Aviso Importante");
    });

    it("renderiza sem título quando não fornecido", () => {
      render(<Callout>Conteúdo</Callout>);

      expect(screen.queryByTestId("callout-title")).not.toBeInTheDocument();
    });

    it("renderiza ícone por padrão", () => {
      render(<Callout>Conteúdo</Callout>);

      expect(screen.getByTestId("callout-icon")).toBeInTheDocument();
    });

    it("não renderiza ícone quando showIcon=false", () => {
      render(<Callout showIcon={false}>Conteúdo</Callout>);

      expect(screen.queryByTestId("callout-icon")).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renderiza variant default", () => {
      render(<Callout variant="default">Conteúdo</Callout>);

      expect(screen.getByTestId("callout-default")).toBeInTheDocument();
    });

    it("renderiza variant info", () => {
      render(<Callout variant="info">Informação</Callout>);

      expect(screen.getByTestId("callout-info")).toBeInTheDocument();
      expect(screen.getByTestId("callout-info")).toHaveClass("border-blue-200");
    });

    it("renderiza variant success", () => {
      render(<Callout variant="success">Sucesso</Callout>);

      expect(screen.getByTestId("callout-success")).toBeInTheDocument();
      expect(screen.getByTestId("callout-success")).toHaveClass("border-green-200");
    });

    it("renderiza variant warning", () => {
      render(<Callout variant="warning">Atenção</Callout>);

      expect(screen.getByTestId("callout-warning")).toBeInTheDocument();
      expect(screen.getByTestId("callout-warning")).toHaveClass("border-yellow-200");
    });

    it("renderiza variant error", () => {
      render(<Callout variant="error">Erro</Callout>);

      expect(screen.getByTestId("callout-error")).toBeInTheDocument();
      expect(screen.getByTestId("callout-error")).toHaveClass("border-red-200");
    });
  });

  describe("Roles e ARIA", () => {
    it("tem role='alert'", () => {
      render(<Callout>Conteúdo</Callout>);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("tem aria-live='polite' para variants info/success", () => {
      const { rerender } = render(<Callout variant="info">Info</Callout>);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");

      rerender(<Callout variant="success">Success</Callout>);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
    });

    it("tem aria-live='assertive' para variants warning/error", () => {
      const { rerender } = render(<Callout variant="warning">Warning</Callout>);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");

      rerender(<Callout variant="error">Error</Callout>);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    });

    it("tem aria-atomic='true'", () => {
      render(<Callout>Conteúdo</Callout>);

      expect(screen.getByRole("alert")).toHaveAttribute("aria-atomic", "true");
    });

    it("ícone tem aria-hidden='true'", () => {
      render(<Callout>Conteúdo</Callout>);

      const icon = screen.getByTestId("callout-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Dismissible", () => {
    it("não renderiza botão de fechar por padrão", () => {
      render(<Callout>Conteúdo</Callout>);

      expect(screen.queryByTestId("callout-dismiss")).not.toBeInTheDocument();
    });

    it("renderiza botão de fechar quando dismissible=true", () => {
      render(<Callout dismissible>Conteúdo</Callout>);

      expect(screen.getByTestId("callout-dismiss")).toBeInTheDocument();
    });

    it("botão de fechar tem aria-label apropriado", () => {
      render(<Callout dismissible>Conteúdo</Callout>);

      expect(screen.getByLabelText("Fechar alerta")).toBeInTheDocument();
    });

    it("remove callout ao clicar no botão de fechar", async () => {
      const user = userEvent.setup();
      render(<Callout dismissible>Conteúdo</Callout>);

      const dismissButton = screen.getByTestId("callout-dismiss");
      await user.click(dismissButton);

      expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
    });

    it("chama onDismiss ao fechar", async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();

      render(
        <Callout dismissible onDismiss={onDismiss}>
          Conteúdo
        </Callout>
      );

      await user.click(screen.getByTestId("callout-dismiss"));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard", () => {
    it("botão de fechar é focável", () => {
      render(<Callout dismissible>Conteúdo</Callout>);

      const button = screen.getByTestId("callout-dismiss");
      expect(button).toHaveAttribute("type", "button");
    });

    it("pode fechar com teclado (Enter)", async () => {
      const user = userEvent.setup();
      render(<Callout dismissible>Conteúdo</Callout>);

      const button = screen.getByTestId("callout-dismiss");
      button.focus();
      await user.keyboard("{Enter}");

      expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
    });

    it("pode fechar com teclado (Space)", async () => {
      const user = userEvent.setup();
      render(<Callout dismissible>Conteúdo</Callout>);

      const button = screen.getByTestId("callout-dismiss");
      button.focus();
      await user.keyboard(" ");

      expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("suporta className customizada", () => {
      render(<Callout className="custom-class">Conteúdo</Callout>);

      expect(screen.getByRole("alert")).toHaveClass("custom-class");
    });

    it("aceita data-testid customizado", () => {
      render(
        <Callout data-testid="custom-callout" variant="info">
          Conteúdo
        </Callout>
      );

      expect(screen.getByTestId("callout-info")).toBeInTheDocument();
    });
  });
});
