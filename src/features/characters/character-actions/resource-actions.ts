import type { CharacterState, CharacterStore } from './types';
import { clamp } from './types';

export const resourceActions = {
  updateStress(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      resources: {
        ...s.resources,
        stress: {
          ...s.resources.stress,
          current: clamp(
            s.resources.stress.current + delta,
            0,
            s.resources.stress.max
          ),
        },
      },
    }));
  },

  updateStressMax(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => {
      const max = Math.max(1, s.resources.stress.max + delta);
      return {
        ...s,
        resources: {
          ...s.resources,
          stress: { current: clamp(s.resources.stress.current, 0, max), max },
        },
      };
    });
  },

  updateHp(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      resources: {
        ...s.resources,
        hp: {
          ...s.resources.hp,
          current: clamp(s.resources.hp.current + delta, 0, s.resources.hp.max),
        },
      },
    }));
  },

  updateHpMax(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => {
      const max = Math.max(1, s.resources.hp.max + delta);
      return {
        ...s,
        resources: {
          ...s.resources,
          hp: { current: clamp(s.resources.hp.current, 0, max), max },
        },
      };
    });
  },

  updateHope(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      resources: {
        ...s.resources,
        hope: {
          ...s.resources.hope,
          current: clamp(
            s.resources.hope.current + delta,
            0,
            s.resources.hope.max
          ),
        },
      },
    }));
  },

  updateHopeMax(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => {
      const max = Math.max(1, s.resources.hope.max + delta);
      return {
        ...s,
        resources: {
          ...s.resources,
          hope: { current: clamp(s.resources.hope.current, 0, max), max },
        },
      };
    });
  },

  updateArmorScore(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      resources: {
        ...s.resources,
        armorScore: {
          ...s.resources.armorScore,
          current: clamp(
            s.resources.armorScore.current + delta,
            0,
            s.resources.armorScore.max
          ),
        },
      },
    }));
  },

  updateArmorScoreMax(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => {
      const max = Math.max(0, s.resources.armorScore.max + delta);
      return {
        ...s,
        resources: {
          ...s.resources,
          armorScore: {
            current: clamp(s.resources.armorScore.current, 0, max),
            max,
          },
        },
      };
    });
  },

  updateEvasion(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      resources: {
        ...s.resources,
        evasion: Math.max(0, s.resources.evasion + delta),
      },
    }));
  },

  updateProficiency(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      resources: {
        ...s.resources,
        proficiency: Math.max(1, s.resources.proficiency + delta),
      },
    }));
  },

  updateGold(
    store: CharacterStore,
    kind: 'handfuls' | 'bags' | 'chests',
    delta: number
  ) {
    store.setState((s: CharacterState) => {
      const gold = s.resources.gold ?? { handfuls: 0, bags: 0, chests: 0 };
      return {
        ...s,
        resources: {
          ...s.resources,
          gold: { ...gold, [kind]: Math.max(0, gold[kind] + delta) },
        },
      };
    });
  },

  setGold(
    store: CharacterStore,
    kind: 'handfuls' | 'bags' | 'chests',
    value: number
  ) {
    store.setState((s: CharacterState) => {
      const gold = s.resources.gold ?? { handfuls: 0, bags: 0, chests: 0 };
      return {
        ...s,
        resources: {
          ...s.resources,
          gold: { ...gold, [kind]: Math.max(0, Math.floor(value) || 0) },
        },
      };
    });
  },
};
