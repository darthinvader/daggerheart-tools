import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';
import { z } from 'zod';

import { ClassIcons, getIcon } from '@/lib/icons';

import {
  BaseClassSchema,
  BaseSubclassSchema,
  ClassNameEnum,
  DomainNameSchema,
  SubclassNameSchema,
} from './core';

// Class icon mapping for visual engagement
// Returns Lucide icon components instead of emoji strings
export const getClassIcon = (className: string): ComponentType<LucideProps> =>
  getIcon(ClassIcons, className);

// Legacy export for backward compatibility (components should use getClassIcon)
export const CLASS_ICONS = ClassIcons;

// Class color theme mapping
export const CLASS_COLORS: Record<string, string> = {
  Bard: 'text-pink-500',
  Druid: 'text-green-500',
  Guardian: 'text-slate-500',
  Ranger: 'text-amber-600',
  Rogue: 'text-purple-500',
  Seraph: 'text-yellow-400',
  Sorcerer: 'text-red-500',
  Warrior: 'text-orange-500',
  Wizard: 'text-blue-500',
};

export const CLASS_BG_COLORS: Record<string, string> = {
  Bard: 'bg-pink-500/10 border-pink-500/30',
  Druid: 'bg-green-500/10 border-green-500/30',
  Guardian: 'bg-slate-500/10 border-slate-500/30',
  Ranger: 'bg-amber-600/10 border-amber-600/30',
  Rogue: 'bg-purple-500/10 border-purple-500/30',
  Seraph: 'bg-yellow-400/10 border-yellow-400/30',
  Sorcerer: 'bg-red-500/10 border-red-500/30',
  Warrior: 'bg-orange-500/10 border-orange-500/30',
  Wizard: 'bg-blue-500/10 border-blue-500/30',
};

// 'standard' = Official content
// 'homebrew' = Campaign-linked homebrew content
// 'custom' = Player-created custom content on the fly
export type ClassMode = 'standard' | 'homebrew' | 'custom';

// Homebrew class schema (same shape as BaseClass with subclasses)
export const HomebrewSubclassSchema = BaseSubclassSchema.extend({
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewClassSchema = BaseClassSchema.extend({
  isHomebrew: z.literal(true).default(true),
  subclasses: z.array(HomebrewSubclassSchema).min(1),
});

// Standard class with subclasses array (matches the data structure)
export const StandardClassWithSubclassesSchema = BaseClassSchema.extend({
  subclasses: z.array(BaseSubclassSchema).min(1),
});

export type HomebrewSubclass = z.infer<typeof HomebrewSubclassSchema>;
export type HomebrewClass = z.infer<typeof HomebrewClassSchema>;
export type StandardClassWithSubclasses = z.infer<
  typeof StandardClassWithSubclassesSchema
>;

// Single class/subclass pair for multiclass support
export const ClassSubclassPairSchema = z.object({
  className: z.string(),
  subclassName: z.string(),
  spellcastTrait: z.string().optional(),
});

export type ClassSubclassPair = z.infer<typeof ClassSubclassPairSchema>;

// Complete selection state - includes derived fields for display
export const ClassSelectionSchema = z.object({
  mode: z.enum(['standard', 'homebrew', 'custom']),
  className: z.string(),
  subclassName: z.string(),
  domains: z.array(DomainNameSchema),
  isHomebrew: z.boolean().default(false),
  isCustom: z.boolean().default(false),
  spellcastTrait: z.string().optional(),
  homebrewClass: HomebrewClassSchema.optional(),
  customClass: HomebrewClassSchema.optional(),
  isMulticlass: z.boolean().optional(),
  classes: z.array(ClassSubclassPairSchema).optional(),
  // ID of campaign-linked homebrew content
  homebrewContentId: z.string().optional(),
});

export type ClassSelection = z.infer<typeof ClassSelectionSchema>;

// Draft schema for storage (simpler, handles partial selections)
export const ClassDraftSchema = z.object({
  mode: z.enum(['standard', 'homebrew', 'custom']).default('standard'),
  className: z.union([ClassNameEnum, z.string()]).optional(),
  subclassName: SubclassNameSchema.optional(),
  homebrewClass: HomebrewClassSchema.optional(),
  customClass: HomebrewClassSchema.optional(),
  // ID of campaign-linked homebrew content
  homebrewContentId: z.string().optional(),
});

export type ClassDraft = z.infer<typeof ClassDraftSchema>;

export const DEFAULT_CLASS_DRAFT: ClassDraft = {
  mode: 'standard',
  className: undefined,
  subclassName: undefined,
  homebrewClass: undefined,
};

// Utility to get spellcast trait from subclass
export function getSpellcastTrait(
  subclass: z.infer<typeof BaseSubclassSchema>
): string | undefined {
  const trait = subclass.spellcastTrait;
  if (!trait || trait === 'Spellcast') return undefined;
  return trait as string;
}

// Validation helpers
export function validateClassSelection(
  selection: unknown
): selection is ClassSelection {
  try {
    ClassSelectionSchema.parse(selection);
    return true;
  } catch {
    return false;
  }
}

export function validateHomebrewClass(
  homebrewClass: unknown
): homebrewClass is HomebrewClass {
  try {
    HomebrewClassSchema.parse(homebrewClass);
    return true;
  } catch {
    return false;
  }
}
