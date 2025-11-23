/**
 * Limites recomendados para Open Graph
 */
export const OG_LIMITS = {
  /** Título máximo (60 chars para evitar truncamento) */
  TITLE_MAX: 60,
  /** Descrição máxima (155 chars) */
  DESCRIPTION_MAX: 155,
} as const;

/**
 * Remove caracteres de controle e normaliza espaços
 */
function sanitizeText(text: string): string {
  return (
    text
      // Remove control characters (0x00-0x1F, 0x7F-0x9F)
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
      // Normaliza múltiplos espaços em um único
      .replace(/\s+/g, " ")
      // Remove espaços no início e fim
      .trim()
  );
}

/**
 * Trunca texto no limite máximo, respeitando palavras
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Trunca no limite e encontra o último espaço
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  // Se há espaço, trunca na palavra; senão, trunca no limite
  const result = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return `${result}...`;
}

/**
 * Constrói título Open Graph otimizado
 * - Remove caracteres de controle
 * - Normaliza espaços
 * - Trunca em 60 chars respeitando palavras
 * - Adiciona sufixo opcional
 * 
 * @param title - Título base
 * @param suffix - Sufixo opcional (ex: " | Site Name")
 * @returns Título sanitizado e truncado
 * 
 * @example
 * buildOpenGraphTitle("My Very Long Title That Exceeds Limit")
 * // "My Very Long Title That Exceeds..."
 * 
 * @example
 * buildOpenGraphTitle("Article", " | Blog")
 * // "Article | Blog"
 * 
 * @example
 * buildOpenGraphTitle("Text\nwith\x00control chars")
 * // "Text with control chars"
 */
export function buildOpenGraphTitle(title: string, suffix = ""): string {
  // Sanitiza título e sufixo separadamente
  const cleanTitle = sanitizeText(title);
  const cleanSuffix = suffix ? sanitizeText(suffix) : "";

  // Combina título e sufixo
  const fullTitle = cleanTitle + cleanSuffix;

  // Trunca se necessário
  return truncateText(fullTitle, OG_LIMITS.TITLE_MAX);
}

/**
 * Constrói descrição Open Graph otimizada
 * - Remove caracteres de controle
 * - Normaliza espaços
 * - Trunca em 155 chars respeitando palavras
 * 
 * @param description - Descrição base
 * @returns Descrição sanitizada e truncada
 * 
 * @example
 * buildOpenGraphDescription("Short description")
 * // "Short description"
 * 
 * @example
 * buildOpenGraphDescription("A".repeat(200))
 * // "AAA..." (155 chars max)
 */
export function buildOpenGraphDescription(description: string): string {
  const cleanDescription = sanitizeText(description);
  return truncateText(cleanDescription, OG_LIMITS.DESCRIPTION_MAX);
}

/**
 * Valida se título está dentro do limite
 */
export function isValidOGTitle(title: string): boolean {
  return title.length > 0 && title.length <= OG_LIMITS.TITLE_MAX;
}

/**
 * Valida se descrição está dentro do limite
 */
export function isValidOGDescription(description: string): boolean {
  return description.length > 0 && description.length <= OG_LIMITS.DESCRIPTION_MAX;
}

/**
 * Gera metadata completa para Open Graph
 */
export interface OpenGraphMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
}

/**
 * Valida e sanitiza metadata Open Graph completa
 */
export function buildOpenGraphMetadata(
  data: Partial<OpenGraphMetadata> & Pick<OpenGraphMetadata, "title" | "description" | "url">
): OpenGraphMetadata {
  return {
    title: buildOpenGraphTitle(data.title, data.siteName ? ` | ${data.siteName}` : ""),
    description: buildOpenGraphDescription(data.description),
    url: data.url,
    image: data.image,
    type: data.type ?? "website",
    siteName: data.siteName,
  };
}
