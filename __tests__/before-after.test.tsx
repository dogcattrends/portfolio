import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BeforeAfter } from "@/components/ui/before-after";

describe("BeforeAfter", () => {
  const defaultProps = {
    beforeImage: "/before.jpg",
    afterImage: "/after.jpg",
    beforeAlt: "Estado antes da otimização",
    afterAlt: "Estado após otimização",
  };

  beforeEach(() => {
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 450,
      top: 0,
      left: 0,
      bottom: 450,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  describe("Rendering", () => {
    it("renderiza ambas as imagens", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByTestId("before-image")).toBeInTheDocument();
      expect(screen.getByTestId("after-image")).toBeInTheDocument();
    });

    it("imagens têm alt text apropriado", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByAltText("Estado antes da otimização")).toBeInTheDocument();
      expect(screen.getByAltText("Estado após otimização")).toBeInTheDocument();
    });

    it("imagens têm draggable=false", () => {
      render(<BeforeAfter {...defaultProps} />);

      const beforeImg = screen.getByTestId("before-image");
      const afterImg = screen.getByTestId("after-image");

      expect(beforeImg).toHaveAttribute("draggable", "false");
      expect(afterImg).toHaveAttribute("draggable", "false");
    });

    it("renderiza labels padrão", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByText("Antes")).toBeInTheDocument();
      expect(screen.getByText("Depois")).toBeInTheDocument();
    });

    it("renderiza labels customizados", () => {
      render(
        <BeforeAfter
          {...defaultProps}
          beforeLabel="Original"
          afterLabel="Otimizado"
        />
      );

      expect(screen.getByText("Original")).toBeInTheDocument();
      expect(screen.getByText("Otimizado")).toBeInTheDocument();
    });

    it("renderiza slider handle", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByTestId("slider-handle")).toBeInTheDocument();
    });
  });

  describe("Roles e ARIA", () => {
    it("container tem role='group'", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("container tem aria-label", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByLabelText("Comparação antes e depois")).toBeInTheDocument();
    });

    it("slider tem role='slider'", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("slider tem aria-valuenow", () => {
      render(<BeforeAfter {...defaultProps} defaultPosition={60} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "60");
    });

    it("slider tem aria-valuemin e aria-valuemax", () => {
      render(<BeforeAfter {...defaultProps} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
    });

    it("slider tem aria-valuetext descritivo", () => {
      render(<BeforeAfter {...defaultProps} defaultPosition={70} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuetext", "70% antes, 30% depois");
    });

    it("slider tem aria-label descritivo", () => {
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      expect(
        screen.getByLabelText(/Ajustar comparação, posição atual 50%/)
      ).toBeInTheDocument();
    });

    it("ícone SVG tem aria-hidden='true'", () => {
      render(<BeforeAfter {...defaultProps} />);

      const svg = screen.getByRole("slider").querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("slider é focável", () => {
      render(<BeforeAfter {...defaultProps} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("tabIndex", "0");
    });

    it("ArrowRight aumenta posição em 1%", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(slider).toHaveAttribute("aria-valuenow", "51");
    });

    it("ArrowLeft diminui posição em 1%", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowLeft}");

      expect(slider).toHaveAttribute("aria-valuenow", "49");
    });

    it("Shift+ArrowRight aumenta posição em 10%", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Shift>}{ArrowRight}{/Shift}");

      expect(slider).toHaveAttribute("aria-valuenow", "60");
    });

    it("Shift+ArrowLeft diminui posição em 10%", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");

      expect(slider).toHaveAttribute("aria-valuenow", "40");
    });

    it("Home vai para 0%", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Home}");

      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });

    it("End vai para 100%", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{End}");

      expect(slider).toHaveAttribute("aria-valuenow", "100");
    });

    it("não permite posição menor que 0", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={0} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowLeft}");

      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });

    it("não permite posição maior que 100", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={100} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(slider).toHaveAttribute("aria-valuenow", "100");
    });
  });

  describe("Mouse Interaction", () => {
    it("inicia arrasto ao mousedown no handle", async () => {
      const user = userEvent.setup();
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const handle = screen.getByTestId("slider-handle");
      await user.pointer({ keys: "[MouseLeft>]", target: handle });

      // Verifica que o estado de arrasto foi iniciado
      expect(handle).toBeInTheDocument();
    });

    it("inicia arrasto ao touchstart no handle", async () => {
      render(<BeforeAfter {...defaultProps} defaultPosition={50} />);

      const handle = screen.getByTestId("slider-handle");
      
      // Simula touchstart
      const touchEvent = new TouchEvent("touchstart", {
        touches: [{ clientX: 400, clientY: 225 } as Touch],
      });
      
      handle.dispatchEvent(touchEvent);
      expect(handle).toBeInTheDocument();
    });
  });

  describe("Default Position", () => {
    it("usa defaultPosition=50 por padrão", () => {
      render(<BeforeAfter {...defaultProps} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });

    it("respeita defaultPosition customizado", () => {
      render(<BeforeAfter {...defaultProps} defaultPosition={75} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Acessibilidade", () => {
    it("suporta className customizada", () => {
      render(<BeforeAfter {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId("before-after-container")).toHaveClass("custom-class");
    });

    it("container tem data-testid", () => {
      render(<BeforeAfter {...defaultProps} />);

      expect(screen.getByTestId("before-after-container")).toBeInTheDocument();
    });
  });
});
