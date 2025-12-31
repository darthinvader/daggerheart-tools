// Components
export { ArmorSlotIcon } from './armor-slot-icon';
export { ArmorSlotsDisplay } from './armor-slots-display';

// Utils
export {
  consumeArmorSlot,
  createArmorSlot,
  damageArmorSlot,
  getAvailableSlots,
  getCurrentArmor,
  getMaxArmor,
  groupSlotsBySource,
  repairAllArmor,
  repairArmorSlot,
} from './armor-utils';

// Types
export type { ArmorSlot, ArmorSlotsState, ArmorSlotState } from './types';
