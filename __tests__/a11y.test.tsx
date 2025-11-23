import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Callout } from "@/components/ui/callout";
import { BeforeAfter } from "@/components/ui/before-after";

expect.extend(toHaveNoViolations);

describe("Accessibility Tests", () => {
  describe("Callout", () => {
    it("não tem violações de acessibilidade (variant default)", async () => {
      const { container } = render(<Callout>Conteúdo de teste</Callout>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("não tem violações de acessibilidade (variant warning)", async () => {
      const { container } = render(
        <Callout variant="warning" title="Atenção">
          Mensagem importante
        </Callout>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("não tem violações de acessibilidade (dismissible)", async () => {
      const { container } = render(
        <Callout dismissible variant="error">
          Erro crítico
        </Callout>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("BeforeAfter", () => {
    it("não tem violações de acessibilidade", async () => {
      const { container } = render(
        <BeforeAfter
          beforeImage="/before.jpg"
          afterImage="/after.jpg"
          beforeAlt="Estado inicial"
          afterAlt="Estado final"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
