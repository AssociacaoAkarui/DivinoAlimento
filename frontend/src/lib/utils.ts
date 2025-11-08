import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária para mesclar classes CSS do Tailwind
 * Combina clsx para lidar com classes condicionais e twMerge para resolver conflitos
 *
 * @param inputs - Classes CSS a serem mescladas
 * @returns String com as classes mescladas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
