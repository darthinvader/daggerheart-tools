// Equipment schemas and types
export * from './armor';
export * from './base-equipment';
export * from './items';
export * from './weapons';

// Re-export commonly used schemas for convenience
export {
  ArmorSchema,
  EquipmentLoadoutSchema,
  ItemSchema,
  WeaponSchema,
} from './base-equipment';

export {
  CombatWheelchairSchema,
  PrimaryWeaponSchema,
  SecondaryWeaponSchema,
} from './weapons';

export {
  ArmorStatusSchema,
  SpecialArmorSchema,
  StandardArmorSchema,
} from './armor';

export {
  ConsumableSchema,
  InventorySchema,
  PotionSchema,
  RelicSchema,
  UtilityItemSchema,
} from './items';

// Equipment data constants
export * from './data';
