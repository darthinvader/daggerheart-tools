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
  getDamagedSlots,
  getMaxArmor,
  getUsedSlots,
  groupSlotsBySource,
  repairAllArmor,
  repairArmorSlot,
} from './armor-utils';

// Types
export type { ArmorSlot, ArmorSlotState, ArmorSlotsState } from './types';

// Constants
export { ARMOR_SLOT_STYLES } from './constants';
