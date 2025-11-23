import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCard } from "@/components/project-card";

describe("ProjectCard", () => {
  const defaultProps = {
    title: "Test Project",
    description: "Test description",
    tags: ["React", "TypeScript"] as const,
  };

  it("renderiza título e descrição", () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByTestId("project-title")).toHaveTextContent("Test Project");
    expect(screen.getByTestId("project-description")).toHaveTextContent("Test description");
  });

  it("renderiza todas as tags", () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByTestId("project-tag-react")).toBeInTheDocument();
    expect(screen.getByTestId("project-tag-typescript")).toBeInTheDocument();
  });

  it("renderiza imagem quando imageUrl é fornecido", () => {
    render(<ProjectCard {...defaultProps} imageUrl="https://example.com/image.jpg" />);

    const img = screen.getByAltText("Screenshot do projeto Test Project");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("não renderiza botão quando href e onClick não são fornecidos", () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.queryByTestId("project-view-button")).not.toBeInTheDocument();
  });

  it("chama onClick quando botão é clicado", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ProjectCard {...defaultProps} onClick={onClick} />);

    await user.click(screen.getByTestId("project-view-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("tem aria-label apropriado para acessibilidade", () => {
    render(<ProjectCard {...defaultProps} onClick={() => {}} />);

    expect(screen.getByLabelText("Projeto: Test Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Ver detalhes do projeto Test Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Tecnologias utilizadas")).toBeInTheDocument();
  });

  it("tem data-testid para todos elementos testáveis", () => {
    render(<ProjectCard {...defaultProps} onClick={() => {}} />);

    expect(screen.getByTestId("project-card")).toBeInTheDocument();
    expect(screen.getByTestId("project-title")).toBeInTheDocument();
    expect(screen.getByTestId("project-description")).toBeInTheDocument();
    expect(screen.getByTestId("project-view-button")).toBeInTheDocument();
  });
});
