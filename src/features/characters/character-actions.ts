import type { Store } from '@tanstack/react-store';

import { DEFAULT_CONDITION_MAP } from '@/lib/data/core/conditions';
import type {
  ConditionItem,
  ConditionsDraft,
  CustomFeature,
  CustomFeatures,
  ExperiencesDraft,
  ResourcesDraft,
  ThresholdsSettings,
  TraitsDraft,
} from '@/lib/schemas/character-state';
import { getTierForLevel } from '@/lib/schemas/core';

import type { ClassDraft } from './class-storage';
import type { DomainsDraft } from './domains-storage';
import type { EquipmentDraft } from './equipment-storage';
import type { FeatureSelections } from './features-storage';
import type { IdentityDraft } from './identity-storage';
import type { InventoryDraft } from './inventory-storage';
import type {
  CharacterProgressionDraft,
  LevelUpEntry,
} from './progression-storage';

export interface CharacterState {
  id: string;
  identity: IdentityDraft;
  classDraft: ClassDraft;
  domains: DomainsDraft;
  equipment: EquipmentDraft;
  inventory: InventoryDraft;
  progression: CharacterProgressionDraft;
  resources: ResourcesDraft;
  traits: TraitsDraft;
  conditions: ConditionsDraft;
  features: FeatureSelections;
  customFeatures: CustomFeatures;
  thresholds: ThresholdsSettings | null;
  leveling: LevelUpEntry[];
  experience: number;
  experiences: ExperiencesDraft;
}

export type CharacterStore = Store<CharacterState>;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export const characterActions = {
  updateIdentity(store: CharacterStore, patch: Partial<IdentityDraft>) {
    store.setState((s: CharacterState) => ({
      ...s,
      identity: { ...s.identity, ...patch },
    }));
  },

  updateClass(store: CharacterStore, patch: Partial<ClassDraft>) {
    store.setState((s: CharacterState) => ({
      ...s,
      classDraft: { ...s.classDraft, ...patch },
    }));
  },

  updateDomains(store: CharacterStore, patch: Partial<DomainsDraft>) {
    store.setState((s: CharacterState) => ({
      ...s,
      domains: { ...s.domains, ...patch },
    }));
  },

  updateEquipment(store: CharacterStore, patch: Partial<EquipmentDraft>) {
    store.setState((s: CharacterState) => ({
      ...s,
      equipment: { ...s.equipment, ...patch },
    }));
  },

  updateInventory(store: CharacterStore, patch: Partial<InventoryDraft>) {
    store.setState((s: CharacterState) => ({
      ...s,
      inventory: { ...s.inventory, ...patch },
    }));
  },

  incInventoryQty(store: CharacterStore, index: number, delta: number) {
    store.setState((s: CharacterState) => {
      const slots = [...(s.inventory.slots ?? [])];
      const cur = slots[index];
      if (!cur) return s;
      const next = Math.max(0, (cur.quantity ?? 1) + delta);
      if (next <= 0) slots.splice(index, 1);
      else slots[index] = { ...cur, quantity: next };
      return { ...s, inventory: { ...s.inventory, slots } };
    });
  },

  removeInventoryAt(store: CharacterStore, index: number) {
    store.setState((s: CharacterState) => ({
      ...s,
      inventory: {
        ...s.inventory,
        slots:
          s.inventory.slots?.filter((_: unknown, i: number) => i !== index) ??
          [],
      },
    }));
  },

  setInventoryLocation(store: CharacterStore, index: number, location: string) {
    store.setState((s: CharacterState) => {
      const slots = [...(s.inventory.slots ?? [])];
      if (!slots[index]) return s;
      slots[index] = {
        ...slots[index],
        location,
        isEquipped: location === 'equipped',
      };
      return { ...s, inventory: { ...s.inventory, slots } };
    });
  },

  updateProgression(
    store: CharacterStore,
    patch: Partial<CharacterProgressionDraft>
  ) {
    store.setState((s: CharacterState) => ({
      ...s,
      progression: { ...s.progression, ...patch },
    }));
  },

  setLevel(store: CharacterStore, level: number) {
    const clamped = Math.max(1, Math.min(10, Math.floor(level)));
    store.setState((s: CharacterState) => ({
      ...s,
      progression: {
        ...s.progression,
        currentLevel: clamped,
        currentTier: getTierForLevel(clamped),
      },
    }));
  },

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
