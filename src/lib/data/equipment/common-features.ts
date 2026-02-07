import type { BaseFeature } from '../../schemas/core';

export const COMMON_EQUIPMENT_FEATURES: Record<string, BaseFeature> = {
  RELIABLE: {
    name: 'Reliable',
    description: '+1 to attack rolls',
    type: 'passive',
    modifiers: { attackRolls: 1 },
  },
  BRUTAL: {
    name: 'Brutal',
    description:
      'When you roll the maximum value on a damage die, roll an additional damage die',
    type: 'passive',
  },
  HEAVY: {
    name: 'Heavy',
    description: '−1 to Evasion',
    type: 'passive',
    modifiers: { evasion: -1 },
  },
  PROTECTIVE_1: {
    name: 'Protective',
    description: '+1 to Armor Score',
    type: 'passive',
    modifiers: { armorScore: 1 },
  },
  PROTECTIVE_2: {
    name: 'Protective',
    description: '+2 to Armor Score',
    type: 'passive',
    modifiers: { armorScore: 2 },
  },
  PROTECTIVE_3: {
    name: 'Protective',
    description: '+3 to Armor Score',
    type: 'passive',
    modifiers: { armorScore: 3 },
  },
  PROTECTIVE_4: {
    name: 'Protective',
    description: '+4 to Armor Score',
    type: 'passive',
    modifiers: { armorScore: 4 },
  },
  BARRIER_1: {
    name: 'Barrier',
    description: '+1 to Armor Score; −1 to Evasion',
    type: 'passive',
    modifiers: { armorScore: 1, evasion: -1 },
  },
  BARRIER_2: {
    name: 'Barrier',
    description: '+2 to Armor Score; −1 to Evasion',
    type: 'passive',
    modifiers: { armorScore: 2, evasion: -1 },
  },
  BARRIER_3: {
    name: 'Barrier',
    description: '+3 to Armor Score; −1 to Evasion',
    type: 'passive',
    modifiers: { armorScore: 3, evasion: -1 },
  },
  BARRIER_4: {
    name: 'Barrier',
    description: '+4 to Armor Score; −1 to Evasion',
    type: 'passive',
    modifiers: { armorScore: 4, evasion: -1 },
  },
  BARRIER_5: {
    name: 'Barrier',
    description: '+5 to Armor Score; −1 to Evasion',
    type: 'passive',
    modifiers: { armorScore: 5, evasion: -1 },
  },
};

export const getReliableFeature = () => COMMON_EQUIPMENT_FEATURES.RELIABLE;
export const getBrutalFeature = () => COMMON_EQUIPMENT_FEATURES.BRUTAL;
export const getHeavyFeature = () => COMMON_EQUIPMENT_FEATURES.HEAVY;
export const getProtectiveFeature = (armorBonus: number) => {
  switch (armorBonus) {
    case 1:
      return COMMON_EQUIPMENT_FEATURES.PROTECTIVE_1;
    case 2:
      return COMMON_EQUIPMENT_FEATURES.PROTECTIVE_2;
    case 3:
      return COMMON_EQUIPMENT_FEATURES.PROTECTIVE_3;
    case 4:
      return COMMON_EQUIPMENT_FEATURES.PROTECTIVE_4;
    default:
      return COMMON_EQUIPMENT_FEATURES.PROTECTIVE_1;
  }
};
export const getBarrierFeature = (armorBonus: number) => {
  switch (armorBonus) {
    case 1:
      return COMMON_EQUIPMENT_FEATURES.BARRIER_1;
    case 2:
      return COMMON_EQUIPMENT_FEATURES.BARRIER_2;
    case 3:
      return COMMON_EQUIPMENT_FEATURES.BARRIER_3;
    case 4:
      return COMMON_EQUIPMENT_FEATURES.BARRIER_4;
    case 5:
      return COMMON_EQUIPMENT_FEATURES.BARRIER_5;
    default:
      return COMMON_EQUIPMENT_FEATURES.BARRIER_3;
  }
};
