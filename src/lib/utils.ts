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
      if (c && 'getRandomValues' in c) {
        const bytes = new Uint8Array(16);
        c.getRandomValues(bytes);

        // RFC4122 version 4 UUID
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0'));
        return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
      }
    }
  } catch {
    // ignore and fall back
  }
  // Fallback UUID format for environments without Web Crypto
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
    const rand = Math.floor(Math.random() * 16);
    const value = ch === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}
