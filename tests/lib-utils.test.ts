import { describe, expect, it, vi } from 'vitest';

import { cn, generateId } from '../src/lib/utils';

describe('lib utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base',
        isActive && 'conditional',
        isDisabled && 'excluded'
      );
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('excluded');
    });

    it('merges tailwind conflicting classes correctly', () => {
      const result = cn('p-4', 'p-8');
      expect(result).toBe('p-8');
    });

    it('handles arrays', () => {
      const result = cn(['text-sm', 'font-bold'], 'text-blue-500');
      expect(result).toContain('font-bold');
      expect(result).toContain('text-blue-500');
    });
  });

  describe('generateId', () => {
    it('generates a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('uses crypto.randomUUID when available', () => {
      const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
      const mockCrypto = {
        randomUUID: vi.fn(() => mockUUID),
      };

      vi.stubGlobal('crypto', mockCrypto);

      const id = generateId();
      expect(id).toBe(mockUUID);
      expect(mockCrypto.randomUUID).toHaveBeenCalled();

      vi.unstubAllGlobals();
    });

    it('falls back when crypto is unavailable', () => {
      const originalCrypto = globalThis.crypto;
      vi.stubGlobal('crypto', undefined);

      const id = generateId();
      expect(id).toBeTruthy();
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);

      vi.stubGlobal('crypto', originalCrypto);
    });

    it('contains timestamp component in fallback', () => {
      vi.stubGlobal('crypto', undefined);

      const before = Date.now();
      const id = generateId();
      const after = Date.now();

      const timestamp = parseInt(id.split('-')[0] ?? '0', 36);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);

      vi.unstubAllGlobals();
    });
  });
});
