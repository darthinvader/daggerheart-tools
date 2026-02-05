/**
 * Tests for the SRD-compliant rest system.
 * Verifies rest mechanics match SRD v1.0 Page 41.
 * Includes Fear gain mechanics per Chapter 3.
 */
import { describe, expect, it } from 'vitest';

import {
  calculateFearGain,
  createRestResult,
  executeRestMove,
  formatRestResult,
  getFearGainSummary,
  getMovesForRestType,
  getRestMoveResultSummary,
  LONG_REST_MOVES,
  rollRestRecovery,
  SHORT_REST_MOVES,
} from '@/components/rest';
import type {
  FearGainResult,
  RestMove,
  RestMoveResult,
} from '@/components/rest';

describe('Rest System Constants', () => {
  describe('SHORT_REST_MOVES', () => {
    it('should have 4 short rest moves', () => {
      expect(SHORT_REST_MOVES).toHaveLength(4);
    });

    it('should include Tend to Wounds move', () => {
      const tendWounds = SHORT_REST_MOVES.find(
        m => m.id === 'tend-wounds-short'
      );
      expect(tendWounds).toBeDefined();
      expect(tendWounds?.category).toBe('healing');
      expect(tendWounds?.canTargetAlly).toBe(true);
    });

    it('should include Clear Stress move', () => {
      const clearStress = SHORT_REST_MOVES.find(
        m => m.id === 'clear-stress-short'
      );
      expect(clearStress).toBeDefined();
      expect(clearStress?.category).toBe('stress');
    });

    it('should include Repair Armor move', () => {
      const repairArmor = SHORT_REST_MOVES.find(
        m => m.id === 'repair-armor-short'
      );
      expect(repairArmor).toBeDefined();
      expect(repairArmor?.category).toBe('armor');
      expect(repairArmor?.canTargetAlly).toBe(true);
    });

    it('should include Prepare move', () => {
      const prepare = SHORT_REST_MOVES.find(m => m.id === 'prepare');
      expect(prepare).toBeDefined();
      expect(prepare?.category).toBe('hope');
      // Prepare is available in both short and long rest
      expect(prepare?.shortRest).toBe(true);
      expect(prepare?.longRest).toBe(true);
    });

    it('all short rest moves should have shortRest=true', () => {
      for (const move of SHORT_REST_MOVES) {
        expect(move.shortRest).toBe(true);
      }
    });

    it('short rest recovery moves should not be full clear', () => {
      const recoveryMoves = SHORT_REST_MOVES.filter(m => m.id !== 'prepare');
      for (const move of recoveryMoves) {
        expect(move.isFullClear).toBe(false);
      }
    });
  });

  describe('LONG_REST_MOVES', () => {
    it('should have 5 long rest moves', () => {
      expect(LONG_REST_MOVES).toHaveLength(5);
    });

    it('should include full HP recovery', () => {
      const tendWounds = LONG_REST_MOVES.find(m => m.id === 'tend-wounds-long');
      expect(tendWounds).toBeDefined();
      expect(tendWounds?.isFullClear).toBe(true);
    });

    it('should include full Stress clear', () => {
      const clearStress = LONG_REST_MOVES.find(
        m => m.id === 'clear-stress-long'
      );
      expect(clearStress).toBeDefined();
      expect(clearStress?.isFullClear).toBe(true);
    });

    it('should include full Armor repair', () => {
      const repairArmor = LONG_REST_MOVES.find(
        m => m.id === 'repair-armor-long'
      );
      expect(repairArmor).toBeDefined();
      expect(repairArmor?.isFullClear).toBe(true);
    });

    it('should include Work on a Project', () => {
      const project = LONG_REST_MOVES.find(m => m.id === 'work-on-project');
      expect(project).toBeDefined();
      expect(project?.category).toBe('project');
    });

    it('all long rest moves should have longRest=true', () => {
      for (const move of LONG_REST_MOVES) {
        expect(move.longRest).toBe(true);
      }
    });
  });

  describe('getMovesForRestType', () => {
    it('should return short rest moves for short rest', () => {
      const moves = getMovesForRestType('short');
      expect(moves).toEqual(SHORT_REST_MOVES);
    });

    it('should return long rest moves for long rest', () => {
      const moves = getMovesForRestType('long');
      expect(moves).toEqual(LONG_REST_MOVES);
    });
  });
});

describe('Rest System Utilities', () => {
  describe('rollRestRecovery', () => {
    it('should return dice roll between 1-4', () => {
      // Run multiple times to verify range
      for (let i = 0; i < 100; i++) {
        const result = rollRestRecovery(1);
        expect(result.diceRoll).toBeGreaterThanOrEqual(1);
        expect(result.diceRoll).toBeLessThanOrEqual(4);
      }
    });

    it('should add tier bonus to total', () => {
      const tier = 3;
      const result = rollRestRecovery(tier);
      expect(result.tierBonus).toBe(tier);
      expect(result.total).toBe(result.diceRoll + tier);
    });

    it('should work with tier 1', () => {
      const result = rollRestRecovery(1);
      expect(result.total).toBeGreaterThanOrEqual(2); // 1 (min roll) + 1 (tier)
      expect(result.total).toBeLessThanOrEqual(5); // 4 (max roll) + 1 (tier)
    });

    it('should work with tier 4', () => {
      const result = rollRestRecovery(4);
      expect(result.total).toBeGreaterThanOrEqual(5); // 1 (min roll) + 4 (tier)
      expect(result.total).toBeLessThanOrEqual(8); // 4 (max roll) + 4 (tier)
    });
  });

  describe('executeRestMove', () => {
    const shortHealMove: RestMove = {
      id: 'tend-wounds-short',
      name: 'Tend to Wounds',
      description: 'Clear 1d4+Tier Hit Points',
      category: 'healing',
      shortRest: true,
      longRest: false,
      isFullClear: false,
      canTargetAlly: true,
    };

    const longHealMove: RestMove = {
      id: 'tend-wounds-long',
      name: 'Tend to All Wounds',
      description: 'Clear all Hit Points',
      category: 'healing',
      shortRest: false,
      longRest: true,
      isFullClear: true,
      canTargetAlly: true,
    };

    const prepareMove: RestMove = {
      id: 'prepare',
      name: 'Prepare',
      description: 'Gain Hope',
      category: 'hope',
      shortRest: true,
      longRest: true,
      isFullClear: false,
      canTargetAlly: false,
    };

    it('should return 1d4+tier for short rest healing', () => {
      const tier = 2;
      const currentMarked = 10; // Amount that could be healed
      const result = executeRestMove(shortHealMove, tier, currentMarked);

      expect(result.moveId).toBe('tend-wounds-short');
      expect(result.diceRoll).toBeGreaterThanOrEqual(1);
      expect(result.diceRoll).toBeLessThanOrEqual(4);
      expect(result.tierBonus).toBe(tier);
      expect(result.isFullClear).toBe(false);
    });

    it('should cap recovery at current marked value', () => {
      const tier = 4; // Max recovery would be 8 (4 + 4)
      const currentMarked = 2; // Only 2 HP marked
      const result = executeRestMove(shortHealMove, tier, currentMarked);

      expect(result.amount).toBeLessThanOrEqual(currentMarked);
    });

    it('should clear all for long rest full clear moves', () => {
      const tier = 1;
      const currentMarked = 15;
      const result = executeRestMove(longHealMove, tier, currentMarked);

      expect(result.isFullClear).toBe(true);
      expect(result.amount).toBe(currentMarked);
      expect(result.diceRoll).toBeUndefined();
    });

    it('should give 1 Hope for Prepare alone', () => {
      const result = executeRestMove(prepareMove, 1, 0, 'Self', false);

      expect(result.moveId).toBe('prepare');
      expect(result.amount).toBe(1);
    });

    it('should give 2 Hope for Prepare with party', () => {
      const result = executeRestMove(prepareMove, 1, 0, 'Self', true);

      expect(result.moveId).toBe('prepare');
      expect(result.amount).toBe(2);
    });

    it('should set target correctly', () => {
      const result = executeRestMove(shortHealMove, 1, 5, 'Ally Name');
      expect(result.target).toBe('Ally Name');
    });
  });

  describe('createRestResult', () => {
    it('should create a result with timestamp', () => {
      const moveResults: RestMoveResult[] = [
        {
          moveId: 'test',
          moveName: 'Test Move',
          amount: 5,
          isFullClear: false,
          target: 'Self',
        },
      ];

      const result = createRestResult('short', moveResults);

      expect(result.restType).toBe('short');
      expect(result.moveResults).toEqual(moveResults);
      expect(result.timestamp).toBeDefined();
      // Verify it's a valid ISO timestamp
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });

  describe('getRestMoveResultSummary', () => {
    it('should format Prepare result', () => {
      const result: RestMoveResult = {
        moveId: 'prepare',
        moveName: 'Prepare',
        amount: 2,
        isFullClear: false,
        target: 'Self',
      };
      expect(getRestMoveResultSummary(result)).toBe('Gained 2 Hope');
    });

    it('should format full clear result', () => {
      const result: RestMoveResult = {
        moveId: 'tend-wounds-long',
        moveName: 'Tend to All Wounds',
        amount: 10,
        isFullClear: true,
        target: 'Self',
      };
      expect(getRestMoveResultSummary(result)).toBe('Cleared all (10)');
    });

    it('should format dice roll result', () => {
      const result: RestMoveResult = {
        moveId: 'tend-wounds-short',
        moveName: 'Tend to Wounds',
        diceRoll: 3,
        tierBonus: 2,
        amount: 5,
        isFullClear: false,
        target: 'Self',
      };
      expect(getRestMoveResultSummary(result)).toBe('Cleared 5 (3 + 2)');
    });

    it('should format project result', () => {
      const result: RestMoveResult = {
        moveId: 'work-on-project',
        moveName: 'Work on a Project',
        amount: 1,
        isFullClear: false,
        target: 'Self',
      };
      expect(getRestMoveResultSummary(result)).toBe(
        'Advanced project countdown'
      );
    });
  });

  describe('formatRestResult', () => {
    it('should format short rest result', () => {
      const result = {
        restType: 'short' as const,
        moveResults: [
          {
            moveId: 'tend-wounds-short',
            moveName: 'Tend to Wounds',
            diceRoll: 2,
            tierBonus: 1,
            amount: 3,
            isFullClear: false,
            target: 'Self',
          },
        ],
        timestamp: new Date().toISOString(),
      };

      const formatted = formatRestResult(result);
      expect(formatted).toContain('Short Rest');
      expect(formatted).toContain('Tend to Wounds');
    });

    it('should format long rest result', () => {
      const result = {
        restType: 'long' as const,
        moveResults: [
          {
            moveId: 'tend-wounds-long',
            moveName: 'Tend to All Wounds',
            amount: 15,
            isFullClear: true,
            target: 'Self',
          },
        ],
        timestamp: new Date().toISOString(),
      };

      const formatted = formatRestResult(result);
      expect(formatted).toContain('Long Rest');
      expect(formatted).toContain('Cleared all (15)');
    });
  });
});

describe('SRD Compliance', () => {
  it('short rest recovery should be 1d4+Tier per SRD Page 41', () => {
    // SRD specifies 1d4+Tier for short rest recovery
    const tier2Result = rollRestRecovery(2);
    expect(tier2Result.total).toBeGreaterThanOrEqual(3); // 1+2
    expect(tier2Result.total).toBeLessThanOrEqual(6); // 4+2
  });

  it('PCs can make 2 downtime moves per rest per SRD', () => {
    // This is enforced by the UI, but we verify the moves exist
    const shortMoves = getMovesForRestType('short');
    const longMoves = getMovesForRestType('long');

    // Must have enough moves to choose from
    expect(shortMoves.length).toBeGreaterThanOrEqual(2);
    expect(longMoves.length).toBeGreaterThanOrEqual(2);
  });

  it('Prepare with party should give 2 Hope per SRD', () => {
    const prepareMove = SHORT_REST_MOVES.find(m => m.id === 'prepare');
    expect(prepareMove).toBeDefined();

    const result = executeRestMove(prepareMove!, 1, 0, 'Self', true);
    expect(result.amount).toBe(2);
  });

  it('long rest should fully clear resources', () => {
    const longHealMove = LONG_REST_MOVES.find(m => m.id === 'tend-wounds-long');
    expect(longHealMove?.isFullClear).toBe(true);

    const longStressMove = LONG_REST_MOVES.find(
      m => m.id === 'clear-stress-long'
    );
    expect(longStressMove?.isFullClear).toBe(true);

    const longArmorMove = LONG_REST_MOVES.find(
      m => m.id === 'repair-armor-long'
    );
    expect(longArmorMove?.isFullClear).toBe(true);
  });
});

/**
 * Fear Gain on Rest Tests
 * Per Daggerheart Chapter 3:
 * - Short Rest: GM gains 1d4 Fear
 * - Long Rest: GM gains (number of PCs + 1d4) Fear
 */
describe('Fear Gain on Rest', () => {
  describe('calculateFearGain', () => {
    it('should return 1d4 Fear for short rest', () => {
      // Run multiple times to verify range
      for (let i = 0; i < 100; i++) {
        const result = calculateFearGain('short');
        expect(result.diceRoll).toBeGreaterThanOrEqual(1);
        expect(result.diceRoll).toBeLessThanOrEqual(4);
        expect(result.total).toBe(result.diceRoll);
        expect(result.partyBonus).toBe(0);
        expect(result.restType).toBe('short');
      }
    });

    it('should return party size + 1d4 Fear for long rest', () => {
      const partySize = 4;
      for (let i = 0; i < 100; i++) {
        const result = calculateFearGain('long', partySize);
        expect(result.diceRoll).toBeGreaterThanOrEqual(1);
        expect(result.diceRoll).toBeLessThanOrEqual(4);
        expect(result.partyBonus).toBe(partySize);
        expect(result.total).toBe(partySize + result.diceRoll);
        expect(result.restType).toBe('long');
      }
    });

    it('should handle party size of 0 for long rest', () => {
      const result = calculateFearGain('long', 0);
      expect(result.partyBonus).toBe(0);
      expect(result.total).toBe(result.diceRoll);
    });

    it('should handle large party sizes', () => {
      const partySize = 6;
      const result = calculateFearGain('long', partySize);
      expect(result.total).toBeGreaterThanOrEqual(7); // 6 + 1
      expect(result.total).toBeLessThanOrEqual(10); // 6 + 4
    });
  });

  describe('getFearGainSummary', () => {
    it('should format short rest Fear gain correctly', () => {
      const fearGain: FearGainResult = {
        diceRoll: 3,
        partyBonus: 0,
        total: 3,
        restType: 'short',
      };
      expect(getFearGainSummary(fearGain)).toBe('GM gains 3 Fear (1d4: 3)');
    });

    it('should format long rest Fear gain correctly', () => {
      const fearGain: FearGainResult = {
        diceRoll: 2,
        partyBonus: 4,
        total: 6,
        restType: 'long',
      };
      expect(getFearGainSummary(fearGain)).toBe(
        'GM gains 6 Fear (4 PCs + 1d4: 2)'
      );
    });
  });

  describe('createRestResult with Fear gain', () => {
    it('should include Fear gain in rest result when provided', () => {
      const moveResults: RestMoveResult[] = [
        {
          moveId: 'tend-wounds-short',
          moveName: 'Tend to Wounds',
          diceRoll: 3,
          tierBonus: 2,
          amount: 5,
          isFullClear: false,
          target: 'Self',
        },
      ];
      const fearGain: FearGainResult = {
        diceRoll: 4,
        partyBonus: 0,
        total: 4,
        restType: 'short',
      };

      const result = createRestResult('short', moveResults, fearGain);

      expect(result.fearGain).toBeDefined();
      expect(result.fearGain?.total).toBe(4);
      expect(result.fearGain?.restType).toBe('short');
    });

    it('should work without Fear gain (undefined)', () => {
      const moveResults: RestMoveResult[] = [
        {
          moveId: 'prepare',
          moveName: 'Prepare',
          amount: 1,
          isFullClear: false,
          target: 'Self',
        },
      ];

      const result = createRestResult('short', moveResults);

      expect(result.fearGain).toBeUndefined();
    });
  });

  describe('formatRestResult with Fear gain', () => {
    it('should include Fear gain in formatted output', () => {
      const result = {
        restType: 'short' as const,
        moveResults: [
          {
            moveId: 'tend-wounds-short',
            moveName: 'Tend to Wounds',
            diceRoll: 2,
            tierBonus: 1,
            amount: 3,
            isFullClear: false,
            target: 'Self',
          },
        ],
        timestamp: new Date().toISOString(),
        fearGain: {
          diceRoll: 3,
          partyBonus: 0,
          total: 3,
          restType: 'short' as const,
        },
      };

      const formatted = formatRestResult(result);
      expect(formatted).toContain('Short Rest');
      expect(formatted).toContain('Tend to Wounds');
      expect(formatted).toContain('GM gains 3 Fear');
    });

    it('should work without Fear gain in formatted output', () => {
      const result = {
        restType: 'long' as const,
        moveResults: [
          {
            moveId: 'tend-wounds-long',
            moveName: 'Tend to All Wounds',
            amount: 15,
            isFullClear: true,
            target: 'Self',
          },
        ],
        timestamp: new Date().toISOString(),
      };

      const formatted = formatRestResult(result);
      expect(formatted).toContain('Long Rest');
      expect(formatted).not.toContain('Fear');
    });
  });
});

describe('Chapter 3 Fear Gain Compliance', () => {
  it('short rest should give GM 1d4 Fear per Chapter 3', () => {
    const result = calculateFearGain('short');
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeLessThanOrEqual(4);
    expect(result.partyBonus).toBe(0);
  });

  it('long rest should give GM (PCs + 1d4) Fear per Chapter 3', () => {
    const partyOf4 = calculateFearGain('long', 4);
    expect(partyOf4.total).toBeGreaterThanOrEqual(5); // 4 + 1
    expect(partyOf4.total).toBeLessThanOrEqual(8); // 4 + 4
    expect(partyOf4.partyBonus).toBe(4);

    const partyOf5 = calculateFearGain('long', 5);
    expect(partyOf5.total).toBeGreaterThanOrEqual(6); // 5 + 1
    expect(partyOf5.total).toBeLessThanOrEqual(9); // 5 + 4
    expect(partyOf5.partyBonus).toBe(5);
  });

  it('Fear gain should be additive with party size', () => {
    // For various party sizes, verify the formula is correct
    for (let partySize = 1; partySize <= 6; partySize++) {
      const result = calculateFearGain('long', partySize);
      expect(result.total).toBe(partySize + result.diceRoll);
    }
  });
});
