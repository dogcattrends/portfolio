export type Locale = "pt" | "en";

/**
 * Dicionário de mensagens para componentes UI
 */
interface UIDictionary {
  // DataGrid
  dataGrid: {
    emptyState: string;
    emptyFiltered: string;
    emptySearch: string;
    loading: string;
    error: string;
    rowsSelected: (count: number) => string;
    filterApplied: (count: number) => string;
    sortedBy: (column: string, direction: string) => string;
  };

  // Composer
  composer: {
    placeholder: string;
    send: string;
    sending: string;
    charLimit: (current: number, max: number) => string;
    charWarning: string;
    slashCommandsHint: string;
    suggestionsAvailable: (count: number) => string;
    templateApplied: (name: string) => string;
    sendError: string;
    required: string;
  };

  // Callout
  callout: {
    dismiss: string;
    info: string;
    success: string;
    warning: string;
    error: string;
  };

  // BeforeAfter
  beforeAfter: {
    beforeLabel: string;
    afterLabel: string;
    sliderLabel: string;
    sliderValue: (value: number) => string;
    loadError: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    clear: string;
    apply: string;
    notFound: string;
    networkError: string;
    unknownError: string;
  };
}

const dictionaries: Record<Locale, UIDictionary> = {
  pt: {
    dataGrid: {
      emptyState: "Nenhum dado disponível",
      emptyFiltered: "Nenhum resultado encontrado com os filtros aplicados",
      emptySearch: "Nenhum resultado para a busca",
      loading: "Carregando dados...",
      error: "Erro ao carregar dados",
      rowsSelected: (count) => `${count} ${count === 1 ? "linha selecionada" : "linhas selecionadas"}`,
      filterApplied: (count) => `${count} ${count === 1 ? "filtro aplicado" : "filtros aplicados"}`,
      sortedBy: (column, direction) => `Ordenado por ${column} (${direction === "asc" ? "crescente" : "decrescente"})`,
    },

    composer: {
      placeholder: "Digite sua mensagem...",
      send: "Enviar",
      sending: "Enviando...",
      charLimit: (current, max) => `${current}/${max} caracteres`,
      charWarning: "Limite de caracteres próximo",
      slashCommandsHint: "Digite / para ver comandos disponíveis",
      suggestionsAvailable: (count) => `${count} ${count === 1 ? "sugestão disponível" : "sugestões disponíveis"}`,
      templateApplied: (name) => `Template "${name}" aplicado`,
      sendError: "Erro ao enviar mensagem",
      required: "Mensagem obrigatória",
    },

    callout: {
      dismiss: "Fechar alerta",
      info: "Informação",
      success: "Sucesso",
      warning: "Atenção",
      error: "Erro",
    },

    beforeAfter: {
      beforeLabel: "Antes",
      afterLabel: "Depois",
      sliderLabel: "Controle de comparação antes/depois",
      sliderValue: (value) => `${value}% visível da imagem "depois"`,
      loadError: "Erro ao carregar imagens",
    },

    common: {
      loading: "Carregando...",
      error: "Erro",
      retry: "Tentar novamente",
      cancel: "Cancelar",
      save: "Salvar",
      close: "Fechar",
      back: "Voltar",
      next: "Próximo",
      previous: "Anterior",
      search: "Buscar",
      filter: "Filtrar",
      clear: "Limpar",
      apply: "Aplicar",
      notFound: "Não encontrado",
      networkError: "Erro de rede. Verifique sua conexão.",
      unknownError: "Erro desconhecido. Tente novamente.",
    },
  },

  en: {
    dataGrid: {
      emptyState: "No data available",
      emptyFiltered: "No results found with the applied filters",
      emptySearch: "No results for the search",
      loading: "Loading data...",
      error: "Error loading data",
      rowsSelected: (count) => `${count} ${count === 1 ? "row selected" : "rows selected"}`,
      filterApplied: (count) => `${count} ${count === 1 ? "filter applied" : "filters applied"}`,
      sortedBy: (column, direction) => `Sorted by ${column} (${direction === "asc" ? "ascending" : "descending"})`,
    },

    composer: {
      placeholder: "Type your message...",
      send: "Send",
      sending: "Sending...",
      charLimit: (current, max) => `${current}/${max} characters`,
      charWarning: "Character limit approaching",
      slashCommandsHint: "Type / to see available commands",
      suggestionsAvailable: (count) => `${count} ${count === 1 ? "suggestion available" : "suggestions available"}`,
      templateApplied: (name) => `Template "${name}" applied`,
      sendError: "Error sending message",
      required: "Message required",
    },

    callout: {
      dismiss: "Dismiss alert",
      info: "Information",
      success: "Success",
      warning: "Warning",
      error: "Error",
    },

    beforeAfter: {
      beforeLabel: "Before",
      afterLabel: "After",
      sliderLabel: "Before/after comparison control",
      sliderValue: (value) => `${value}% of "after" image visible`,
      loadError: "Error loading images",
    },

    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Try again",
      cancel: "Cancel",
      save: "Save",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      apply: "Apply",
      notFound: "Not found",
      networkError: "Network error. Check your connection.",
      unknownError: "Unknown error. Please try again.",
    },
  },
};

/**
 * Hook para acessar traduções dos componentes UI
 */
export function useTranslations(locale: Locale = "pt"): UIDictionary {
  return dictionaries[locale];
}

/**
 * Função para obter traduções sem React hooks (para uso em Server Components)
 */
export function getTranslations(locale: Locale = "pt"): UIDictionary {
  return dictionaries[locale];
}

/**
 * Utilitário para validar locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === "pt" || locale === "en";
}

/**
 * Utilitário para obter locale do navegador
 */
export function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  
  const browserLang = window.navigator.language.toLowerCase();
  if (browserLang.startsWith("pt")) return "pt";
  return "en";
}
