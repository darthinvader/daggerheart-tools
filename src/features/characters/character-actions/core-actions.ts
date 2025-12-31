import { getTierForLevel } from '@/lib/schemas/core';

import type { ClassDraft } from '../class-storage';
import type { DomainsDraft } from '../domains-storage';
import type { EquipmentDraft } from '../equipment-storage';
import type { IdentityDraft } from '../identity-storage';
import type { InventoryDraft } from '../inventory-storage';
import type { CharacterProgressionDraft } from '../progression-storage';
import type { CharacterState, CharacterStore } from './types';

export const coreActions = {
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
};
