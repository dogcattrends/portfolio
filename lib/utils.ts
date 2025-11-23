import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes do Tailwind CSS evitando conflitos
 * @param inputs - Classes CSS a serem combinadas
 * @returns String de classes CSS combinadas
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
