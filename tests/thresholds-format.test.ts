import { describe, expect, it } from 'vitest';

import {
  THRESHOLD_PREFIX,
  type ThresholdKind,
  formatThresholdChip,
} from '../src/features/characters/logic/thresholds-format';

describe('thresholds-format', () => {
  describe('THRESHOLD_PREFIX', () => {
    it('defines correct prefixes for each threshold kind', () => {
      expect(THRESHOLD_PREFIX.major).toBe('M');
      expect(THRESHOLD_PREFIX.severe).toBe('S');
      expect(THRESHOLD_PREFIX.md).toBe('MD');
      expect(THRESHOLD_PREFIX.ds).toBe('MD');
    });

    it('maps legacy ds to MD', () => {
      expect(THRESHOLD_PREFIX.ds).toBe(THRESHOLD_PREFIX.md);
    });
  });

  describe('formatThresholdChip', () => {
    it('formats major threshold', () => {
      expect(formatThresholdChip('major', 10)).toBe('M:10');
      expect(formatThresholdChip('major', '15')).toBe('M:15');
    });

    it('formats severe threshold', () => {
      expect(formatThresholdChip('severe', 20)).toBe('S:20');
      expect(formatThresholdChip('severe', '25')).toBe('S:25');
    });

    it('formats MD threshold', () => {
      expect(formatThresholdChip('md', 30)).toBe('MD:30');
      expect(formatThresholdChip('md', '35')).toBe('MD:35');
    });

    it('formats legacy ds threshold', () => {
      expect(formatThresholdChip('ds', 40)).toBe('MD:40');
    });

    it('handles string and number values', () => {
      const kinds: ThresholdKind[] = ['major', 'severe', 'md', 'ds'];
      kinds.forEach(kind => {
        const numResult = formatThresholdChip(kind, 100);
        const strResult = formatThresholdChip(kind, '100');
        expect(numResult).toContain('100');
        expect(strResult).toContain('100');
      });
    });

    it('converts non-string values to string', () => {
      expect(formatThresholdChip('major', 0)).toBe('M:0');
      expect(formatThresholdChip('severe', 999)).toBe('S:999');
    });
  });
});
