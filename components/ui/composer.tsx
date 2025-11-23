"use client";

import * as React from "react";
import { Send, Smile, Paperclip, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Template de mensagem
 */
export interface MessageTemplate {
  /** Comando para ativar (ex: "saudacao") */
  command: string;
  /** Label exibido no menu */
  label: string;
  /** Descrição curta */
  description: string;
  /** Conteúdo do template */
  content: string;
  /** Categoria do template */
  category?: "comum" | "tecnico" | "comercial";
}

/**
 * Props do Composer
 */
export interface ComposerProps {
  /** Callback ao enviar mensagem */
  onSend: (message: string) => void;
  /** Placeholder do textarea */
  placeholder?: string;
  /** Templates disponíveis */
  templates?: MessageTemplate[];
  /** Se está enviando (loading) */
  isSending?: boolean;
  /** Mensagem inicial */
  initialValue?: string;
  /** Classe CSS customizada */
  className?: string;
  /** Label ARIA */
  ariaLabel?: string;
}

/**
 * Templates padrão
 */
const DEFAULT_TEMPLATES: MessageTemplate[] = [
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
    content: "Obrigado por entrar em contato! Responderei em breve.",
    category: "comum",
  },
  {
    command: "horario",
    label: "Horário de Atendimento",
    description: "Informar disponibilidade",
    content:
      "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.",
    category: "comercial",
  },
  {
    command: "portfolio",
    label: "Portfólio",
    description: "Apresentar projetos",
    content:
      "Você pode conferir meu portfólio completo em [URL]. Tenho experiência em React, TypeScript e Next.js.",
    category: "comercial",
  },
  {
    command: "proposta",
    label: "Proposta Técnica",
    description: "Gerar proposta a partir de cases",
    content:
      "📄 **Proposta Técnica Automatizada**\n\nOlá! Vou elaborar uma proposta baseada nos meus cases de sucesso.\n\nPara personalizar, informe:\n1. Nome da empresa\n2. Tipo de projeto (performance, acessibilidade, migração)\n3. Principais desafios\n\n💡 A proposta incluirá:\n• KPIs de projetos similares\n• Screenshots de evidências técnicas (Lighthouse, axe)\n• Métricas antes/depois\n• Timeline estimada",
    category: "comercial",
  },
  {
    command: "stack",
    label: "Stack Técnica",
    description: "Tecnologias utilizadas",
    content:
      "Trabalho principalmente com:\n- Frontend: React, Next.js, TypeScript, Tailwind CSS\n- Backend: Node.js, PostgreSQL, Prisma\n- DevOps: Docker, GitHub Actions, Vercel",
    category: "tecnico",
  },
  {
    command: "reuniao",
    label: "Agendar Reunião",
    description: "Marcar call",
    content:
      "Podemos agendar uma reunião para discutir em detalhes. Estou disponível esta semana nos seguintes horários: [HORÁRIOS]",
    category: "comercial",
  },
  {
    command: "prazo",
    label: "Prazo de Entrega",
    description: "Informar timeline",
    content:
      "Com base no escopo, estimo um prazo de [X semanas] para entrega do MVP completo.",
    category: "tecnico",
  },
];

/**
 * Compositor de mensagens com suporte a comandos slash
 * 
 * Funcionalidades:
 * - Comandos slash (/comando) com autocompletar
 * - Templates pré-definidos
 * - Sugestões filtradas por digitação
 * - Navegação por teclado (↑↓ Enter Esc)
 * - ARIA announcements
 */
export function Composer({
  onSend,
  placeholder = "Digite sua mensagem ou use / para comandos...",
  templates = DEFAULT_TEMPLATES,
  isSending = false,
  initialValue = "",
  className,
  ariaLabel = "Compositor de mensagem",
}: ComposerProps) {
  const [message, setMessage] = React.useState(initialValue);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [filteredTemplates, setFilteredTemplates] = React.useState<
    MessageTemplate[]
  >([]);
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  /**
   * Detecta comando slash e filtra templates
   */
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const textBeforeCursor = message.slice(0, cursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf("/");

    if (lastSlashIndex !== -1) {
      const commandText = textBeforeCursor
        .slice(lastSlashIndex + 1)
        .toLowerCase();
      const isAtWordBoundary =
        lastSlashIndex === 0 || /\s/.test(textBeforeCursor[lastSlashIndex - 1]);

      if (isAtWordBoundary) {
        const filtered = templates.filter(
          (template) =>
            template.command.toLowerCase().includes(commandText) ||
            template.label.toLowerCase().includes(commandText)
        );

        if (filtered.length > 0) {
          setFilteredTemplates(filtered);
          setShowSuggestions(true);
          setSelectedIndex(0);
          return;
        }
      }
    }

    setShowSuggestions(false);
  }, [message, cursorPosition, templates]);

  /**
   * Ajusta altura do textarea automaticamente
   */
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  /**
   * Aplica template selecionado
   */
  const applyTemplate = React.useCallback(
    (template: MessageTemplate) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const textBeforeCursor = message.slice(0, cursorPosition);
      const textAfterCursor = message.slice(cursorPosition);
      const lastSlashIndex = textBeforeCursor.lastIndexOf("/");

      const newMessage =
        message.slice(0, lastSlashIndex) + template.content + textAfterCursor;

      setMessage(newMessage);
      setShowSuggestions(false);

      // Focar e posicionar cursor após o template
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = lastSlashIndex + template.content.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [message, cursorPosition]
  );

  /**
   * Navegação por teclado no textarea
   */
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showSuggestions) {
        // Enter sem Shift envia mensagem
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (message.trim() && !isSending) {
            onSend(message.trim());
            setMessage("");
          }
        }
        return;
      }

      // Navegação nas sugestões
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredTemplates.length - 1)
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case "Enter":
        case "Tab":
          event.preventDefault();
          if (filteredTemplates[selectedIndex]) {
            applyTemplate(filteredTemplates[selectedIndex]);
          }
          break;

        case "Escape":
          event.preventDefault();
          setShowSuggestions(false);
          break;
      }
    },
    [
      showSuggestions,
      filteredTemplates,
      selectedIndex,
      applyTemplate,
      message,
      isSending,
      onSend,
    ]
  );

  /**
   * Atualiza posição do cursor
   */
  const handleSelect = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setCursorPosition(textarea.selectionStart);
  }, []);

  /**
   * Envia mensagem
   */
  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (message.trim() && !isSending) {
        onSend(message.trim());
        setMessage("");
      }
    },
    [message, isSending, onSend]
  );

  /**
   * Scroll sugestão selecionada para view
   */
  React.useEffect(() => {
    if (!showSuggestions || !suggestionsRef.current) return;

    const suggestionElement = suggestionsRef.current.children[
      selectedIndex
    ] as HTMLElement;
    if (suggestionElement) {
      suggestionElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex, showSuggestions]);

  const categoryColors = {
    comum: "bg-blue-50 text-blue-700 border-blue-200",
    tecnico: "bg-purple-50 text-purple-700 border-purple-200",
    comercial: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Textarea */}
        <div className="relative rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            onClick={handleSelect}
            placeholder={placeholder}
            disabled={isSending}
            className="w-full resize-none rounded-lg border-0 px-4 py-3 pr-24 text-sm focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ minHeight: "60px", maxHeight: "200px" }}
            aria-label={ariaLabel}
            aria-describedby="composer-hint"
            data-testid="composer-textarea"
          />

          {/* Hint */}
          <div
            id="composer-hint"
            className="sr-only"
            role="status"
            aria-live="polite"
          >
            {showSuggestions
              ? `${filteredTemplates.length} sugestões disponíveis. Use setas para navegar e Enter para selecionar.`
              : "Digite / para ver comandos disponíveis"}
          </div>

          {/* Toolbar */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Adicionar emoji"
              disabled={isSending}
            >
              <Smile className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Anexar arquivo"
              disabled={isSending}
            >
              <Paperclip className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Enviar mensagem"
              data-testid="composer-send-button"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Character count */}
        <div className="mt-1 text-right text-xs text-gray-500">
          {message.length} caracteres
          {message.length > 500 && (
            <span className="ml-2 text-amber-600">
              (considere dividir em múltiplas mensagens)
            </span>
          )}
        </div>
      </form>

      {/* Sugestões de Comandos */}
      <AnimatePresence>
        {showSuggestions && filteredTemplates.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-2 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            role="listbox"
            aria-label="Sugestões de templates"
            data-testid="composer-suggestions"
          >
            <div className="sticky top-0 border-b border-gray-200 bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Command className="h-3.5 w-3.5" aria-hidden="true" />
                Comandos Disponíveis ({filteredTemplates.length})
              </div>
            </div>

            {filteredTemplates.map((template, index) => (
              <button
                key={template.command}
                type="button"
                onClick={() => applyTemplate(template)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0",
                  index === selectedIndex
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                )}
                role="option"
                aria-selected={index === selectedIndex}
                data-testid={`suggestion-${template.command}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        /{template.command}
                      </span>
                      {template.category && (
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                            categoryColors[template.category]
                          )}
                        >
                          {template.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {template.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {template.description}
                    </p>
                  </div>

                  {index === selectedIndex && (
                    <div className="flex-shrink-0 text-xs text-gray-400">
                      Enter ↵
                    </div>
                  )}
                </div>

                {/* Preview do conteúdo */}
                <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  {template.content.length > 100
                    ? `${template.content.slice(0, 100)}...`
                    : template.content}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atalhos (hint visual) */}
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono">
            /
          </kbd>
          <span>Comandos</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono">
            Enter
          </kbd>
          <span>Enviar</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono">
            Shift+Enter
          </kbd>
          <span>Nova linha</span>
        </div>
      </div>
    </div>
  );
}
