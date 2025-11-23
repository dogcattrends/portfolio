/**
 * Utility para screen readers
 * @example
 * <span className={srOnly()}>Descrição apenas para leitores de tela</span>
 */
export function srOnly(): string {
  return "sr-only";
}

/**
 * Formata texto para aria-label
 * Remove caracteres especiais e normaliza espaços
 */
export function formatAriaLabel(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Gera ID único para associação de labels
 * @example
 * const id = generateId("email");
 * <label htmlFor={id}>Email</label>
 * <input id={id} type="email" />
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verifica se elemento deve ter aria-label
 */
export function needsAriaLabel(
  _element: "button" | "input" | "link",
  hasVisibleText: boolean
): boolean {
  return !hasVisibleText;
}

/**
 * Gera aria-label para botões de ícone
 */
export function iconButtonLabel(action: string, context?: string): string {
  return context ? `${action} ${context}` : action;
}

/**
 * Helpers para aria-live
 */
export const ariaLive = {
  polite: "polite" as const,
  assertive: "assertive" as const,
  off: "off" as const,
};

/**
 * Helpers para roles ARIA
 */
export const ariaRoles = {
  alert: "alert" as const,
  dialog: "dialog" as const,
  navigation: "navigation" as const,
  main: "main" as const,
  complementary: "complementary" as const,
  contentinfo: "contentinfo" as const,
  banner: "banner" as const,
};
