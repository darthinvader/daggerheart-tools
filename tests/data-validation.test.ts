import { describe, expect, it } from 'vitest';

// Data: classes
import { ALL_CLASSES } from '../src/lib/data/classes';
// Data: core
import { COMPANION_UPGRADES } from '../src/lib/data/core/companion-upgrades';
// Data: domains
import * as DomainData from '../src/lib/data/domains';
// Data: equipment
import * as EquipmentIndex from '../src/lib/data/equipment';
// Schemas
import {
  BaseClassSchema,
  BaseSubclassSchema,
  CompanionUpgradeSchema,
  LEVEL_PROGRESSION,
  LEVEL_UP_OPTIONS,
  LevelUpPointSystemSchema,
} from '../src/lib/schemas/core';
import {
  DomainCardCollectionSchema,
  DomainCardSchema,
} from '../src/lib/schemas/domains';
import {
  ArmorModificationSchema,
  ArmorSchema,
  CombatWheelchairSchema,
  ItemSchema,
  PrimaryWeaponSchema,
  SecondaryWeaponSchema,
  SpecialArmorSchema,
  StandardArmorSchema,
  WeaponModificationSchema,
} from '../src/lib/schemas/equipment';
import {
  ANCESTRIES,
  AncestrySchema,
  COMMUNITIES,
  CommunitySchema,
} from '../src/lib/schemas/identity';

// Helper to validate arrays with a schema
function expectAllParse(schema: any, arr: any[], label: string) {
  const results = arr.map((v, i) => ({ i, r: schema.safeParse(v) }));
  const failures = results.filter(x => !x.r.success);
  if (failures.length) {
    const msgs = failures
      .slice(0, 5)
      .map(x => `${label}[${x.i}] => ${x.r.error}`)
      .join('\n');
    throw new Error(`Validation failed for ${label}:\n${msgs}`);
  }
  expect(failures.length).toBe(0);
}

describe('Data validates against Zod schemas', () => {
  it('domain cards match DomainCard schema', () => {
    // Collect all explicit domain card arrays exported
    const domainArrays = Object.entries(DomainData)
      .filter(([k]) => k.endsWith('_DOMAIN_CARDS'))
      .map(([, v]) => v as unknown as any[]);

    // Flatten and validate
    const allCards = domainArrays.flat();
    expect(allCards.length).toBeGreaterThan(0);
    expectAllParse(DomainCardSchema, allCards, 'DomainCard');

    // Also validate per-array as a collection
    domainArrays.forEach(arr => {
      expect(DomainCardCollectionSchema.safeParse(arr).success).toBe(true);
    });
  });

  it('equipment collections match schemas', () => {
    // Weapons
    expectAllParse(
      PrimaryWeaponSchema,
      EquipmentIndex.ALL_PRIMARY_WEAPONS ?? [],
      'PrimaryWeapon'
    );
    expectAllParse(
      SecondaryWeaponSchema,
      EquipmentIndex.ALL_SECONDARY_WEAPONS ?? [],
      'SecondaryWeapon'
    );
    expectAllParse(
      CombatWheelchairSchema,
      EquipmentIndex.ALL_COMBAT_WHEELCHAIRS ?? [],
      'CombatWheelchair'
    );

    // Armor (both standard and special)
    const allArmor = EquipmentIndex.ALL_ARMOR ?? [];
    // Try specific schemas, then fallback to generic ArmorSchema
    allArmor.forEach((a: any, i: number) => {
      const std = StandardArmorSchema.safeParse(a);
      const special = SpecialArmorSchema.safeParse(a);
      const base = ArmorSchema.safeParse(a);
      if (!std.success && !special.success && !base.success) {
        throw new Error(`Armor[${i}] failed validation`);
      }
    });

    // Items
    const itemGroups: [string, any, any[]][] = [
      ['UtilityItem', ItemSchema, EquipmentIndex.UTILITY_ITEMS ?? []],
      ['Consumable', ItemSchema, EquipmentIndex.CONSUMABLES ?? []],
      ['Potion', ItemSchema, EquipmentIndex.POTIONS ?? []],
      ['Relic', ItemSchema, EquipmentIndex.RELICS ?? []],
      [
        'WeaponModification',
        WeaponModificationSchema,
        EquipmentIndex.WEAPON_MODIFICATIONS ?? [],
      ],
      [
        'ArmorModification',
        ArmorModificationSchema,
        EquipmentIndex.ARMOR_MODIFICATIONS ?? [],
      ],
      ['Recipe', ItemSchema, EquipmentIndex.RECIPES ?? []],
    ];

    itemGroups.forEach(([label, schema, arr]) => {
      expect(arr.length).toBeGreaterThan(0);
      expectAllParse(schema, arr, label);
    });
  });

  it('ancestries and communities match identity schemas', () => {
    expect(ANCESTRIES.length).toBeGreaterThan(0);
    expectAllParse(AncestrySchema, ANCESTRIES as any[], 'Ancestry');

    expect(COMMUNITIES.length).toBeGreaterThan(0);
    expectAllParse(CommunitySchema, COMMUNITIES as any[], 'Community');
  });

  it('classes and subclasses match core class schemas', () => {
    expect(ALL_CLASSES.length).toBe(9);
    // Validate class shape (extra keys like subclasses are ignored/stripped)
    ALL_CLASSES.forEach((cls: any, i: number) => {
      const parsed = BaseClassSchema.safeParse(cls);
      if (!parsed.success) {
        throw new Error(
          `Class[${i}] ${cls?.name ?? ''} failed: ${parsed.error}`
        );
      }

      // Validate subclasses if present
      const subs = (cls as any).subclasses ?? [];
      subs.forEach((sub: any, j: number) => {
        const r = BaseSubclassSchema.safeParse(sub);
        if (!r.success) {
          throw new Error(
            `Subclass[${i}.${j}] ${sub?.name ?? ''} failed: ${r.error}`
          );
        }
      });
    });
  });

  it('progression config matches schemas', () => {
    // Level up point system matches schema
    expect(LevelUpPointSystemSchema.safeParse(LEVEL_UP_OPTIONS).success).toBe(
      true
    );

    // Sanity: LEVEL_PROGRESSION contains expected tiers
    expect(Object.keys(LEVEL_PROGRESSION.TIERS)).toEqual([
      'TIER_1',
      'TIER_2',
      'TIER_3',
      'TIER_4',
    ]);
  });

  it('companion upgrades match schema', () => {
    const upgrades = Object.values(COMPANION_UPGRADES) as any[];
    expect(upgrades.length).toBeGreaterThan(0);
    expectAllParse(CompanionUpgradeSchema, upgrades, 'CompanionUpgrade');
  });
});
