import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generates a stable unique ID using the Web Crypto API when available,
// with a safe fallback for older environments.
export function generateId(): string {
  try {
    if (typeof globalThis !== 'undefined') {
      const c = (
        globalThis as {
          crypto?: {
            randomUUID?: () => string;
            getRandomValues?: (array: Uint8Array) => Uint8Array;
          };
        }
      ).crypto;
      if (c?.randomUUID) return c.randomUUID();
      if (c?.getRandomValues) {
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

/**
 * Normalize unicode minus signs and various dash characters to standard hyphen-minus.
 * Handles unicode minus (\u2212), en-dash (\u2013), and em-dash (\u2014).
 */
export function normalizeMinusSigns(text: string): string {
  return text.replace(/[\u2212\u2013\u2014]/g, '-');
}

/**
 * Toggle an item in an array - adds if not present, removes if present.
 * Useful for managing selection state.
 */
export function toggleArrayItem<T>(array: T[], item: T): T[] {
  return array.includes(item)
    ? array.filter(i => i !== item)
    : [...array, item];
}

/**
 * Copy text to the clipboard with standardised toast feedback.
 */
export async function copyToClipboard(
  text: string,
  successMessage = 'Copied to clipboard!'
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    toast.error('Failed to copy — try selecting the text manually');
  }
}
