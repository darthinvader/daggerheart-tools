import { describe, expect, it } from 'vitest';

import {
  computeDsValue,
  validateThresholdsManual,
} from '../src/features/characters/logic/thresholds-util';

describe('thresholds-util', () => {
  describe('validateThresholdsManual', () => {
    it('returns null for valid thresholds', () => {
      const result = validateThresholdsManual('10', '20', false, '');
      expect(result).toBeNull();
    });

    it('requires severe >= major', () => {
      const result = validateThresholdsManual('20', '10', false, '');
      expect(result).toContain('Severe must be ≥ Major');
    });

    it('rejects negative values', () => {
      const result1 = validateThresholdsManual('-5', '10', false, '');
      expect(result1).toContain('cannot be negative');

      const result2 = validateThresholdsManual('10', '-5', false, '');
      expect(result2).toContain('cannot be negative');
    });

    it('rejects non-numeric inputs', () => {
      const result1 = validateThresholdsManual('abc', '20', false, '');
      expect(result1).not.toBeNull();

      const result2 = validateThresholdsManual('10', 'xyz', false, '');
      expect(result2).not.toBeNull();
    });

    it('validates DS override when enabled', () => {
      const result = validateThresholdsManual('10', '20', true, '40');
      expect(result).toBeNull();
    });

    it('requires DS >= severe when override enabled', () => {
      const result = validateThresholdsManual('10', '20', true, '15');
      expect(result).toContain('Major Damage must be ≥ Severe');
    });

    it('rejects negative DS value', () => {
      const result = validateThresholdsManual('10', '20', true, '-5');
      expect(result).toContain('non-negative');
    });

    it('rejects non-numeric DS value', () => {
      const result = validateThresholdsManual('10', '20', true, 'invalid');
      expect(result).toContain('non-negative');
    });

    it('allows severe equal to major', () => {
      const result = validateThresholdsManual('15', '15', false, '');
      expect(result).toBeNull();
    });

    it('allows DS equal to severe when override enabled', () => {
      const result = validateThresholdsManual('10', '20', true, '20');
      expect(result).toBeNull();
    });
  });

  describe('computeDsValue', () => {
    it('doubles severe value when override is disabled', () => {
      expect(computeDsValue(20, false)).toBe(40);
      expect(computeDsValue(15, false)).toBe(30);
      expect(computeDsValue(0, false)).toBe(0);
    });

    it('uses custom DS value when override is enabled', () => {
      expect(computeDsValue(20, true, '50')).toBe(50);
      expect(computeDsValue(15, true, '100')).toBe(100);
    });

    it('returns doubled severe when DS input is invalid with override', () => {
      expect(computeDsValue(20, true, 'invalid')).toBe(40);
      expect(computeDsValue(15, true, '')).toBe(30);
      expect(computeDsValue(10, true, undefined)).toBe(20);
    });

    it('enforces minimum of 0', () => {
      expect(computeDsValue(-10, false)).toBe(0);
      expect(computeDsValue(10, true, '-5')).toBe(0);
    });

    it('handles edge cases', () => {
      expect(computeDsValue(0, false)).toBe(0);
      expect(computeDsValue(1, false)).toBe(2);
      expect(computeDsValue(999, false)).toBe(1998);
    });

    it('parses DS input with whitespace', () => {
      expect(computeDsValue(20, true, '  45  ')).toBe(45);
      expect(computeDsValue(20, true, '\t50\n')).toBe(50);
    });
  });
});
