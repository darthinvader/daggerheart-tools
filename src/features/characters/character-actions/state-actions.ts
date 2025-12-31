import { DEFAULT_CONDITION_MAP } from '@/lib/data/core/conditions';
import type {
  ConditionItem,
  CustomFeature,
  ExperiencesDraft,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';

import type { LevelUpEntry } from '../progression-storage';
import type { CharacterState, CharacterStore } from './types';

export const stateActions = {
  incTrait(store: CharacterStore, key: string, delta: 1 | -1) {
    store.setState((s: CharacterState) => {
      const trait = s.traits[key] ?? { value: 0, bonus: 0, marked: false };
      return {
        ...s,
        traits: {
          ...s.traits,
          [key]: { ...trait, value: trait.value + delta },
        },
      };
    });
  },

  toggleTraitMarked(store: CharacterStore, key: string) {
    store.setState((s: CharacterState) => {
      const trait = s.traits[key] ?? { value: 0, bonus: 0, marked: false };
      return {
        ...s,
        traits: { ...s.traits, [key]: { ...trait, marked: !trait.marked } },
      };
    });
  },

  setTraitBonus(store: CharacterStore, key: string, bonus: number) {
    store.setState((s: CharacterState) => {
      const trait = s.traits[key] ?? { value: 0, bonus: 0, marked: false };
      return {
        ...s,
        traits: {
          ...s.traits,
          [key]: { ...trait, bonus: Math.floor(bonus) || 0 },
        },
      };
    });
  },

  addCondition(store: CharacterStore, label: string, description?: string) {
    const value = label.trim();
    if (!value) return;
    const key = value.toLowerCase();
    const item: ConditionItem = {
      name: value,
      description: description?.trim() || DEFAULT_CONDITION_MAP[key],
    };
    store.setState((s: CharacterState) => {
      const dedup = new Map<string, ConditionItem>();
      for (const c of s.conditions) dedup.set(c.name.toLowerCase(), c);
      dedup.set(item.name.toLowerCase(), item);
      return { ...s, conditions: Array.from(dedup.values()).slice(0, 12) };
    });
  },

  removeCondition(store: CharacterStore, label: string) {
    store.setState((s: CharacterState) => ({
      ...s,
      conditions: s.conditions.filter((c: ConditionItem) => c.name !== label),
    }));
  },

  setFeature(
    store: CharacterStore,
    key: string,
    value: string | number | boolean
  ) {
    store.setState((s: CharacterState) => ({
      ...s,
      features: { ...s.features, [key]: value },
    }));
  },

  removeFeature(store: CharacterStore, key: string) {
    store.setState((s: CharacterState) => {
      const rest = { ...s.features };
      delete rest[key];
      return { ...s, features: rest };
    });
  },

  addCustomFeature(store: CharacterStore, feature: CustomFeature) {
    store.setState((s: CharacterState) => ({
      ...s,
      customFeatures: [...s.customFeatures, feature],
    }));
  },

  removeCustomFeature(store: CharacterStore, index: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      customFeatures: s.customFeatures.filter(
        (_: unknown, i: number) => i !== index
      ),
    }));
  },

  updateCustomFeature(
    store: CharacterStore,
    index: number,
    patch: Partial<CustomFeature>
  ) {
    store.setState((s: CharacterState) => {
      const list = [...s.customFeatures];
      if (list[index]) list[index] = { ...list[index], ...patch };
      return { ...s, customFeatures: list };
    });
  },

  setThresholds(store: CharacterStore, settings: ThresholdsSettings | null) {
    store.setState((s: CharacterState) => ({ ...s, thresholds: settings }));
  },

  addLevelUpEntry(store: CharacterStore, entry: LevelUpEntry) {
    store.setState((s: CharacterState) => ({
      ...s,
      leveling: [...s.leveling, entry],
    }));
  },

  updateLeveling(store: CharacterStore, entries: LevelUpEntry[]) {
    store.setState((s: CharacterState) => ({ ...s, leveling: entries }));
  },

  setExperience(store: CharacterStore, value: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      experience: Math.max(0, Math.floor(value)),
    }));
  },

  addExperience(store: CharacterStore, delta: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      experience: Math.max(0, s.experience + delta),
    }));
  },

  setExperiences(store: CharacterStore, list: ExperiencesDraft) {
    store.setState((s: CharacterState) => ({ ...s, experiences: list }));
  },
};
