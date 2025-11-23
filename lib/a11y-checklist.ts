/**
 * Guia de Acessibilidade - Padrões do Projeto
 * 
 * Este documento lista verificações e correções comuns para axe DevTools
 */

export const A11Y_CHECKLIST = {
  /** Imagens devem ter alt text descritivo */
  images: {
    rule: "Toda <img> deve ter atributo alt",
    examples: {
      good: '<img src="/photo.jpg" alt="Descrição clara do conteúdo" />',
      bad: '<img src="/photo.jpg" />',
      decorative: '<img src="/icon.svg" alt="" aria-hidden="true" />',
    },
  },

  /** Inputs devem ter labels associados */
  inputs: {
    rule: "Todo <input> deve ter <label> ou aria-label",
    examples: {
      good: '<label htmlFor="email">Email</label><input id="email" type="email" />',
      ariaLabel: '<input type="search" aria-label="Buscar projetos" />',
      bad: '<input type="text" placeholder="Nome" />',
    },
  },

  /** Ordem de headings deve ser sequencial */
  headings: {
    rule: "Headings devem seguir ordem lógica (h1 -> h2 -> h3)",
    examples: {
      good: "<h1>Título Principal</h1><h2>Seção</h2><h3>Subseção</h3>",
      bad: "<h1>Título</h1><h3>Pula h2</h3>",
      note: "Apenas um <h1> por página",
    },
  },

  /** Botões devem ter texto ou aria-label */
  buttons: {
    rule: "Botões devem ter conteúdo textual acessível",
    examples: {
      good: '<button>Enviar</button>',
      iconOnly: '<button aria-label="Fechar modal"><X /></button>',
      bad: "<button><Icon /></button>",
    },
  },

  /** Links devem ter texto descritivo */
  links: {
    rule: "Links devem ter texto que descreva o destino",
    examples: {
      good: '<a href="/projects">Ver todos os projetos</a>',
      bad: '<a href="/more">Clique aqui</a>',
      external: '<a href="https://..." target="_blank" rel="noopener noreferrer">Título <span className="sr-only">(abre em nova aba)</span></a>',
    },
  },

  /** Contrast ratio mínimo */
  contrast: {
    rule: "Texto normal: 4.5:1 | Texto grande (18px+): 3:1",
    tools: "Use Firefox DevTools ou axe DevTools para verificar",
  },

  /** ARIA live regions */
  liveRegions: {
    rule: "Use aria-live para conteúdo dinâmico importante",
    examples: {
      polite: 'aria-live="polite" // Notificações não urgentes',
      assertive: 'aria-live="assertive" // Erros críticos',
    },
  },

  /** Foco visível */
  focus: {
    rule: "Elementos interativos devem ter indicador de foco visível",
    examples: {
      good: "focus:ring-2 focus:ring-ring focus:ring-offset-2",
      bad: "outline-none sem substituição",
    },
  },
} as const;

/**
 * Checklist rápido para novos componentes
 */
export const NEW_COMPONENT_CHECKLIST = [
  "[ ] Todas as imagens têm alt text apropriado",
  "[ ] Inputs têm labels ou aria-label",
  "[ ] Botões com ícones têm aria-label",
  "[ ] Headings em ordem sequencial (h1 -> h2 -> h3)",
  "[ ] Contrast ratio ≥ 4.5:1 para texto",
  "[ ] Elementos interativos são focáveis",
  "[ ] Foco tem indicador visível",
  "[ ] Conteúdo dinâmico usa aria-live quando apropriado",
  "[ ] Landmarks semânticos (main, nav, aside, footer)",
  "[ ] Testado com leitor de tela (NVDA/VoiceOver)",
  "[ ] Testado com navegação por teclado",
  "[ ] Rodado axe DevTools sem erros críticos",
] as const;
