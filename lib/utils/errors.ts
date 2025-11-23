/**
 * Error boundary utilities e custom error classes
 */

/**
 * Erro customizado para falhas de validação
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Erro customizado para falhas de rede/API
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Erro customizado para dados não encontrados
 */
export class NotFoundError extends Error {
  constructor(
    message: string,
    public resourceType?: string,
    public resourceId?: string
  ) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Tipo para resultado de operação com tratamento de erro
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper para criar resultado de sucesso
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Helper para criar resultado de erro
 */
export function failure<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Try-catch wrapper que retorna Result
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Try-catch síncrono que retorna Result
 */
export function tryCatchSync<T>(fn: () => T): Result<T, Error> {
  try {
    const data = fn();
    return success(data);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Guard: verifica se array não está vazio
 */
export function isNonEmpty<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0;
}

/**
 * Guard: verifica se valor não é null/undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Guard: verifica se string não está vazia
 */
export function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Extrai mensagem de erro de forma segura
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Erro desconhecido";
}

/**
 * Extrai código de erro HTTP de forma segura
 */
export function getErrorCode(error: unknown): number | undefined {
  if (error instanceof NetworkError) return error.statusCode;
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

/**
 * Verifica se erro é de rede
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Verifica se erro é de validação
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Verifica se erro é de "não encontrado"
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}
