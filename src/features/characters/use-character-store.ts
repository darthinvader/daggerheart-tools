import * as React from 'react';

import { useStore } from '@tanstack/react-store';

import {
  type CharacterState,
  type CharacterStore,
  characterActions,
  disposeCharacterStore,
  getCharacterStore,
} from './character-store';

export function useCharacterStore<T>(
  id: string,
  selector: (state: CharacterState) => T
): T {
  const store = React.useMemo(() => getCharacterStore(id), [id]);
  return useStore(store, selector);
}

export function useCharacterActions(id: string) {
  const store = React.useMemo(() => getCharacterStore(id), [id]);

  return React.useMemo(
    () => ({
      // Identity
      updateIdentity: (patch: Partial<CharacterState['identity']>) =>
        characterActions.updateIdentity(store, patch),

      // Class
      updateClass: (patch: Partial<CharacterState['classDraft']>) =>
        characterActions.updateClass(store, patch),

      // Domains
      updateDomains: (patch: Partial<CharacterState['domains']>) =>
        characterActions.updateDomains(store, patch),

      // Equipment
      updateEquipment: (patch: Partial<CharacterState['equipment']>) =>
        characterActions.updateEquipment(store, patch),

      // Inventory
      updateInventory: (patch: Partial<CharacterState['inventory']>) =>
        characterActions.updateInventory(store, patch),
      incInventoryQty: (index: number, delta: number) =>
        characterActions.incInventoryQty(store, index, delta),
      removeInventoryAt: (index: number) =>
        characterActions.removeInventoryAt(store, index),
      setInventoryLocation: (index: number, location: string) =>
        characterActions.setInventoryLocation(store, index, location),

      // Progression
      updateProgression: (patch: Partial<CharacterState['progression']>) =>
        characterActions.updateProgression(store, patch),
      setLevel: (level: number) => characterActions.setLevel(store, level),

      // Resources
      updateStress: (delta: number) =>
        characterActions.updateStress(store, delta),
      updateStressMax: (delta: number) =>
        characterActions.updateStressMax(store, delta),
      updateHp: (delta: number) => characterActions.updateHp(store, delta),
      updateHpMax: (delta: number) =>
        characterActions.updateHpMax(store, delta),
      updateHope: (delta: number) => characterActions.updateHope(store, delta),
      updateHopeMax: (delta: number) =>
        characterActions.updateHopeMax(store, delta),
      updateArmorScore: (delta: number) =>
        characterActions.updateArmorScore(store, delta),
      updateArmorScoreMax: (delta: number) =>
        characterActions.updateArmorScoreMax(store, delta),
      updateEvasion: (delta: number) =>
        characterActions.updateEvasion(store, delta),
      updateProficiency: (delta: number) =>
        characterActions.updateProficiency(store, delta),
      updateGold: (kind: 'handfuls' | 'bags' | 'chests', delta: number) =>
        characterActions.updateGold(store, kind, delta),
      setGold: (kind: 'handfuls' | 'bags' | 'chests', value: number) =>
        characterActions.setGold(store, kind, value),

      // Traits
      incTrait: (key: string, delta: 1 | -1) =>
        characterActions.incTrait(store, key, delta),
      toggleTraitMarked: (key: string) =>
        characterActions.toggleTraitMarked(store, key),
      setTraitBonus: (key: string, bonus: number) =>
        characterActions.setTraitBonus(store, key, bonus),

      // Conditions
      addCondition: (label: string, description?: string) =>
        characterActions.addCondition(store, label, description),
      removeCondition: (label: string) =>
        characterActions.removeCondition(store, label),

      // Features
      setFeature: (key: string, value: string | number | boolean) =>
        characterActions.setFeature(store, key, value),
      removeFeature: (key: string) =>
        characterActions.removeFeature(store, key),

      // Custom Features
      addCustomFeature: (feature: CharacterState['customFeatures'][number]) =>
        characterActions.addCustomFeature(store, feature),
      removeCustomFeature: (index: number) =>
        characterActions.removeCustomFeature(store, index),
      updateCustomFeature: (
        index: number,
        patch: Partial<CharacterState['customFeatures'][number]>
      ) => characterActions.updateCustomFeature(store, index, patch),

      // Thresholds
      setThresholds: (settings: CharacterState['thresholds']) =>
        characterActions.setThresholds(store, settings),

      // Leveling
      addLevelUpEntry: (entry: CharacterState['leveling'][number]) =>
        characterActions.addLevelUpEntry(store, entry),
      updateLeveling: (entries: CharacterState['leveling']) =>
        characterActions.updateLeveling(store, entries),

      // Experience
      setExperience: (value: number) =>
        characterActions.setExperience(store, value),
      addExperience: (delta: number) =>
        characterActions.addExperience(store, delta),
      setExperiences: (list: CharacterState['experiences']) =>
        characterActions.setExperiences(store, list),
    }),
    [store]
  );
}

export function useCharacterStoreRef(id: string): CharacterStore {
  return React.useMemo(() => getCharacterStore(id), [id]);
}

export function useDisposeCharacterStore(id: string) {
  React.useEffect(() => {
    return () => disposeCharacterStore(id);
  }, [id]);
}
