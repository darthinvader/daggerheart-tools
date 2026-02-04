import { describe, expect, it } from 'vitest';

import {
  applyStressWithOverflow,
  calculateStressMark,
  clearStressOnCriticalSuccess,
  shouldAddVulnerableFromStress,
  TAG_TEAM_HOPE_COST,
  tryTagTeam,
} from '@/lib/mechanics';

describe('Stress & HP Mechanics (SRD Compliance)', () => {
  describe('calculateStressMark', () => {
    it('should mark stress normally when slots available', () => {
      const result = calculateStressMark(2, 6, 2);

      expect(result.stressMarked).toBe(2);
      expect(result.hpOverflow).toBe(0);
      expect(result.newStressCurrent).toBe(4);
      expect(result.shouldBecomeVulnerable).toBe(false);
    });

    it('should overflow to HP when stress is full per SRD Page 38', () => {
      // "If you ever have to mark a Stress slot but don't have any available,
      // you must mark a Hit Point instead"
      const result = calculateStressMark(5, 6, 3);

      expect(result.stressMarked).toBe(1); // Only 1 slot available
      expect(result.hpOverflow).toBe(2); // 2 overflow to HP
      expect(result.newStressCurrent).toBe(6);
      expect(result.shouldBecomeVulnerable).toBe(true);
    });

    it('should become Vulnerable when stress is full per SRD Page 38', () => {
      // "When your Stress is full, you become Vulnerable"
      const result = calculateStressMark(4, 6, 2);

      expect(result.newStressCurrent).toBe(6);
      expect(result.shouldBecomeVulnerable).toBe(true);
    });

    it('should handle already full stress (all overflow)', () => {
      const result = calculateStressMark(6, 6, 3);

      expect(result.stressMarked).toBe(0);
      expect(result.hpOverflow).toBe(3);
      expect(result.newStressCurrent).toBe(6);
      expect(result.shouldBecomeVulnerable).toBe(true);
    });

    it('should handle zero amount', () => {
      const result = calculateStressMark(3, 6, 0);

      expect(result.stressMarked).toBe(0);
      expect(result.hpOverflow).toBe(0);
      expect(result.newStressCurrent).toBe(3);
    });
  });

  describe('applyStressWithOverflow', () => {
    it('should apply stress increase with HP overflow', () => {
      const result = applyStressWithOverflow(
        4, // currentStress
        6, // maxStress
        10, // currentHp
        8 // targetStress (trying to add 4)
      );

      expect(result.newStress).toBe(6); // Caps at max
      expect(result.newHp).toBe(8); // 2 overflow to HP
      expect(result.shouldBecomeVulnerable).toBe(true);
    });

    it('should allow stress reduction without overflow', () => {
      const result = applyStressWithOverflow(
        5, // currentStress
        6, // maxStress
        10, // currentHp
        3 // targetStress (reducing)
      );

      expect(result.newStress).toBe(3);
      expect(result.newHp).toBe(10); // HP unchanged
      expect(result.shouldBecomeVulnerable).toBe(false);
    });

    it('should clamp stress to 0 on negative target', () => {
      const result = applyStressWithOverflow(3, 6, 10, -1);

      expect(result.newStress).toBe(0);
      expect(result.newHp).toBe(10);
    });
  });

  describe('shouldAddVulnerableFromStress', () => {
    it('should return true when stress full and not already Vulnerable', () => {
      expect(shouldAddVulnerableFromStress(6, 6, ['Hidden'])).toBe(true);
    });

    it('should return false when already Vulnerable', () => {
      expect(shouldAddVulnerableFromStress(6, 6, ['Vulnerable'])).toBe(false);
    });

    it('should return false when stress not full', () => {
      expect(shouldAddVulnerableFromStress(5, 6, [])).toBe(false);
    });

    it('should be case-insensitive for Vulnerable check', () => {
      expect(shouldAddVulnerableFromStress(6, 6, ['vulnerable'])).toBe(false);
      expect(shouldAddVulnerableFromStress(6, 6, ['VULNERABLE'])).toBe(false);
    });
  });

  describe('clearStressOnCriticalSuccess', () => {
    it('should clear 1 stress on critical success per SRD Page 29', () => {
      // "When you critically succeed, you clear one Stress if any is marked"
      expect(clearStressOnCriticalSuccess(4)).toBe(3);
      expect(clearStressOnCriticalSuccess(1)).toBe(0);
    });

    it('should not go below 0', () => {
      expect(clearStressOnCriticalSuccess(0)).toBe(0);
    });
  });

  describe('Tag Team mechanics per SRD Page 32', () => {
    it('should require 3 Hope to use Tag Team', () => {
      expect(TAG_TEAM_HOPE_COST).toBe(3);
    });

    it('should succeed when enough Hope and not used', () => {
      const result = tryTagTeam(5, false);

      expect(result.success).toBe(true);
      expect(result.newHope).toBe(2); // 5 - 3
      expect(result.errorMessage).toBeUndefined();
    });

    it('should fail when Tag Team already used this session', () => {
      const result = tryTagTeam(5, true);

      expect(result.success).toBe(false);
      expect(result.newHope).toBe(5); // Unchanged
      expect(result.errorMessage).toContain('once per session');
    });

    it('should fail when not enough Hope', () => {
      const result = tryTagTeam(2, false);

      expect(result.success).toBe(false);
      expect(result.newHope).toBe(2);
      expect(result.errorMessage).toContain('requires 3 Hope');
    });

    it('should succeed with exactly 3 Hope', () => {
      const result = tryTagTeam(3, false);

      expect(result.success).toBe(true);
      expect(result.newHope).toBe(0);
    });
  });
});
