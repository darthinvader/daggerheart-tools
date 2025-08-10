import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generates a stable unique ID using the Web Crypto API when available,
// with a safe fallback for older environments.
export function generateId(): string {
  try {
    if (typeof globalThis !== 'undefined' && 'crypto' in globalThis) {
      const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
      if (c && 'randomUUID' in c) return c.randomUUID();
    }
  } catch {
    // ignore and fall back
  }
  const rand = Math.random().toString(36).slice(2, 8);
  return `${Date.now().toString(36)}-${rand}`;
}
