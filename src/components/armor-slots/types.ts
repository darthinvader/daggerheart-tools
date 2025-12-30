export type ArmorSlotState = 'available' | 'used' | 'damaged' | 'broken';

export interface ArmorSlot {
  id: string;
  state: ArmorSlotState;
  source: string; // e.g., "Chainmail", "Shield", "Foundation"
}

export interface ArmorSlotsState {
  slots: ArmorSlot[];
  baseArmor: number;
  bonusArmor: number;
}
