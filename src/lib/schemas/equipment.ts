/**
 * Equipment and Inventory Schemas
 */
import { z } from 'zod';

import { DamageTypeSchema, RangeBandSchema, TraitNameSchema } from './core';

export const WeaponSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  trait: z.union([TraitNameSchema, z.literal('Spellcast')]),
  range: RangeBandSchema,
  damageDie: z.string().regex(/^d\d+$/),
  damageType: DamageTypeSchema,
  burden: z.enum(['One-Handed', 'Two-Handed']),
  features: z.array(z.string()),
});

export const ArmorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  majorThreshold: z.number().min(0).int(),
  severeThreshold: z.number().min(0).int(),
  armorScore: z.number().min(0).int(),
  features: z.array(z.string()),
});

export const ConsumableSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    'Health Potion',
    'Stamina Potion',
    'Antidote',
    'Scroll',
    'Bomb',
    'Food',
    'Other',
  ]),
  effect: z.string().min(1),
  quantity: z.number().min(0).int(),
  tags: z.array(z.string()).optional(),
});

export const InventoryItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().min(0).int().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type Weapon = z.infer<typeof WeaponSchema>;
export type Armor = z.infer<typeof ArmorSchema>;
export type Consumable = z.infer<typeof ConsumableSchema>;
export type InventoryItem = z.infer<typeof InventoryItemSchema>;
