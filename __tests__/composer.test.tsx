import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Composer, type MessageTemplate } from "@/components/ui/composer";

const mockTemplates: MessageTemplate[] = [
  {
    command: "saudacao",
    label: "Saudação",
    description: "Cumprimento inicial",
    content: "Olá! Como posso ajudá-lo hoje?",
    category: "comum",
  },
  {
    command: "agradecimento",
    label: "Agradecimento",
    description: "Agradecer contato",
    content: "Obrigado por entrar em contato!",
    category: "comum",
  },
  {
    command: "portfolio",
    label: "Portfólio",
    description: "Apresentar projetos",
    content: "Você pode conferir meu portfólio em [URL].",
    category: "comercial",
  },
];

describe("Composer - Render", () => {
  it("deve renderizar textarea", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    expect(screen.getByTestId("composer-textarea")).toBeInTheDocument();
  });

  it("deve renderizar botão de enviar", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    expect(screen.getByRole("button", { name: /Enviar mensagem/i })).toBeInTheDocument();
  });

  it("deve renderizar placeholder", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} placeholder="Digite aqui..." />);

    expect(screen.getByPlaceholderText("Digite aqui...")).toBeInTheDocument();
  });

  it("deve renderizar com valor inicial", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} initialValue="Mensagem inicial" />);

    expect(screen.getByDisplayValue("Mensagem inicial")).toBeInTheDocument();
  });

  it("deve renderizar contador de caracteres", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    expect(screen.getByText(/0 caracteres/i)).toBeInTheDocument();
  });

  it("deve renderizar botões de toolbar (emoji, anexo)", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    expect(screen.getByRole("button", { name: /Adicionar emoji/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Anexar arquivo/i })).toBeInTheDocument();
  });

  it("deve renderizar hints de atalhos", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    expect(screen.getByText(/Comandos/i)).toBeInTheDocument();
    expect(screen.getByText(/Enviar/i)).toBeInTheDocument();
    expect(screen.getByText(/Nova linha/i)).toBeInTheDocument();
  });
});

describe("Composer - Comandos Slash", () => {
  it("deve mostrar sugestões ao digitar /", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    expect(screen.getByTestId("composer-suggestions")).toBeInTheDocument();
    expect(screen.getByText(/Comandos Disponíveis \(3\)/i)).toBeInTheDocument();
  });

  it("deve filtrar sugestões por comando digitado", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/saud");

    expect(screen.getByTestId("composer-suggestions")).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-saudacao")).toBeInTheDocument();
    expect(screen.queryByTestId("suggestion-portfolio")).not.toBeInTheDocument();
  });

  it("deve filtrar sugestões por label", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/portf");

    expect(screen.getByTestId("suggestion-portfolio")).toBeInTheDocument();
  });

  it("deve ocultar sugestões quando não há matches", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/xyz123");

    expect(screen.queryByTestId("composer-suggestions")).not.toBeInTheDocument();
  });

  it("deve exibir categoria do template", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    expect(screen.getByText("comum")).toBeInTheDocument();
    expect(screen.getByText("comercial")).toBeInTheDocument();
  });

  it("deve exibir preview do conteúdo do template", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/saud");

    expect(screen.getByText(/Olá! Como posso ajudá-lo hoje\?/i)).toBeInTheDocument();
  });

  it("deve aplicar template ao clicar", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/saud");

    const suggestion = screen.getByTestId("suggestion-saudacao");
    await user.click(suggestion);

    expect(textarea).toHaveValue("Olá! Como posso ajudá-lo hoje?");
    expect(screen.queryByTestId("composer-suggestions")).not.toBeInTheDocument();
  });

  it("deve aplicar template ao pressionar Enter", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/saud");
    await user.keyboard("{Enter}");

    expect(textarea).toHaveValue("Olá! Como posso ajudá-lo hoje?");
  });

  it("deve aplicar template ao pressionar Tab", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/agra");
    await user.keyboard("{Tab}");

    expect(textarea).toHaveValue("Obrigado por entrar em contato!");
  });

  it("deve posicionar cursor após template aplicado", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea") as HTMLTextAreaElement;
    await user.type(textarea, "/saud");
    await user.keyboard("{Enter}");

    // Cursor deve estar no final do template
    expect(textarea.selectionStart).toBe("Olá! Como posso ajudá-lo hoje?".length);
  });

  it("deve permitir texto antes e depois do comando", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "Antes /saud");
    await user.keyboard("{Enter}");

    expect(textarea).toHaveValue("Antes Olá! Como posso ajudá-lo hoje?");
  });

  it("não deve detectar / no meio de palavra", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "http://example.com");

    expect(screen.queryByTestId("composer-suggestions")).not.toBeInTheDocument();
  });
});

describe("Composer - Navegação por Teclado", () => {
  it("deve navegar com ArrowDown", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    const firstSuggestion = screen.getByTestId("suggestion-saudacao");
    expect(firstSuggestion).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowDown}");

    const secondSuggestion = screen.getByTestId("suggestion-agradecimento");
    expect(secondSuggestion).toHaveAttribute("aria-selected", "true");
  });

  it("deve navegar com ArrowUp", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}");

    const secondSuggestion = screen.getByTestId("suggestion-agradecimento");
    expect(secondSuggestion).toHaveAttribute("aria-selected", "true");
  });

  it("não deve navegar além da primeira sugestão", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");
    await user.keyboard("{ArrowUp}{ArrowUp}");

    const firstSuggestion = screen.getByTestId("suggestion-saudacao");
    expect(firstSuggestion).toHaveAttribute("aria-selected", "true");
  });

  it("não deve navegar além da última sugestão", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");

    const lastSuggestion = screen.getByTestId("suggestion-portfolio");
    expect(lastSuggestion).toHaveAttribute("aria-selected", "true");
  });

  it("deve fechar sugestões com Escape", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    expect(screen.getByTestId("composer-suggestions")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByTestId("composer-suggestions")).not.toBeInTheDocument();
  });

  it("deve destacar sugestão ao passar mouse", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    const thirdSuggestion = screen.getByTestId("suggestion-portfolio");
    await user.hover(thirdSuggestion);

    expect(thirdSuggestion).toHaveAttribute("aria-selected", "true");
  });
});

describe("Composer - Envio de Mensagem", () => {
  it("deve enviar mensagem ao clicar no botão", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "Mensagem de teste");

    const sendButton = screen.getByTestId("composer-send-button");
    await user.click(sendButton);

    expect(onSend).toHaveBeenCalledWith("Mensagem de teste");
  });

  it("deve enviar mensagem ao pressionar Enter", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "Mensagem de teste{Enter}");

    expect(onSend).toHaveBeenCalledWith("Mensagem de teste");
  });

  it("não deve enviar ao pressionar Shift+Enter", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "Linha 1{Shift>}{Enter}{/Shift}Linha 2");

    expect(onSend).not.toHaveBeenCalled();
    expect(textarea).toHaveValue("Linha 1\nLinha 2");
  });

  it("deve limpar textarea após enviar", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "Mensagem{Enter}");

    expect(textarea).toHaveValue("");
  });

  it("não deve enviar mensagem vazia", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const sendButton = screen.getByTestId("composer-send-button");
    await user.click(sendButton);

    expect(onSend).not.toHaveBeenCalled();
  });

  it("não deve enviar apenas espaços em branco", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "   {Enter}");

    expect(onSend).not.toHaveBeenCalled();
  });

  it("deve trim espaços ao enviar", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "  Mensagem  {Enter}");

    expect(onSend).toHaveBeenCalledWith("Mensagem");
  });

  it("deve desabilitar envio quando isSending=true", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} isSending />);

    const sendButton = screen.getByTestId("composer-send-button");
    expect(sendButton).toBeDisabled();
  });

  it("deve desabilitar textarea quando isSending=true", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} isSending />);

    const textarea = screen.getByTestId("composer-textarea");
    expect(textarea).toBeDisabled();
  });
});

describe("Composer - Contador de Caracteres", () => {
  it("deve atualizar contador ao digitar", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "Teste");

    expect(screen.getByText(/5 caracteres/i)).toBeInTheDocument();
  });

  it("deve mostrar aviso acima de 500 caracteres", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    const longText = "a".repeat(501);
    await user.type(textarea, longText);

    expect(screen.getByText(/considere dividir em múltiplas mensagens/i)).toBeInTheDocument();
  });
});

describe("Composer - Acessibilidade", () => {
  it("não deve ter violações de acessibilidade", async () => {
    const onSend = vi.fn();
    const { container } = render(<Composer onSend={onSend} templates={mockTemplates} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("deve ter aria-label no textarea", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} ariaLabel="Compositor de mensagem" />);

    const textarea = screen.getByLabelText("Compositor de mensagem");
    expect(textarea).toBeInTheDocument();
  });

  it("deve ter aria-describedby com hint", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    expect(textarea).toHaveAttribute("aria-describedby", "composer-hint");
  });

  it("deve ter role=status aria-live no hint", () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const hint = screen.getByRole("status");
    expect(hint).toHaveAttribute("aria-live", "polite");
  });

  it("deve anunciar número de sugestões", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    const hint = screen.getByRole("status");
    expect(hint).toHaveTextContent(/3 sugestões disponíveis/i);
  });

  it("deve ter role=listbox nas sugestões", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    const suggestions = screen.getByRole("listbox", { name: /Sugestões de templates/i });
    expect(suggestions).toBeInTheDocument();
  });

  it("deve ter role=option em cada sugestão", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  it("deve ter aria-selected na opção selecionada", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} templates={mockTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });
});

describe("Composer - Templates Customizados", () => {
  it("deve aceitar templates personalizados", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const customTemplates: MessageTemplate[] = [
      {
        command: "custom",
        label: "Custom Template",
        description: "Template personalizado",
        content: "Conteúdo personalizado",
      },
    ];

    render(<Composer onSend={onSend} templates={customTemplates} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/custom");

    expect(screen.getByTestId("suggestion-custom")).toBeInTheDocument();
  });

  it("deve usar templates padrão quando não fornecidos", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);

    const textarea = screen.getByTestId("composer-textarea");
    await user.type(textarea, "/");

    // Templates padrão incluem saudacao, agradecimento, etc.
    expect(screen.getByTestId("suggestion-saudacao")).toBeInTheDocument();
  });
});
