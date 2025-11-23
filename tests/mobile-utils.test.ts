import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isEditable, watchSoftKeyboard } from '../src/utils/mobile';

describe('mobile utils', () => {
  describe('isEditable', () => {
    it('returns true for input elements', () => {
      const input = document.createElement('input');
      expect(isEditable(input)).toBe(true);
    });

    it('returns true for textarea elements', () => {
      const textarea = document.createElement('textarea');
      expect(isEditable(textarea)).toBe(true);
    });

    it('returns true for select elements', () => {
      const select = document.createElement('select');
      expect(isEditable(select)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isEditable(null)).toBe(false);
    });
  });

  describe('watchSoftKeyboard', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('sets up event listeners and returns cleanup function', () => {
      const onChange = vi.fn();
      const cleanup = watchSoftKeyboard(onChange);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('cleanup function can be called multiple times safely', () => {
      const onChange = vi.fn();
      const cleanup = watchSoftKeyboard(onChange);
      expect(() => {
        cleanup();
        cleanup();
      }).not.toThrow();
    });
  });
});
