import { z } from 'zod';

import { ANCESTRIES } from '../data/characters/ancestries';

// Base schemas for ancestry-related types
export const AncestryFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['primary', 'secondary']),
});

// Ancestry schema
export const AncestrySchema = z.object({
  name: z.string(),
  description: z.string(),
  heightRange: z.string(),
  lifespan: z.string(),
  physicalCharacteristics: z.array(z.string()),
  primaryFeature: AncestryFeatureSchema,
  secondaryFeature: AncestryFeatureSchema,
});

// Mixed ancestry schema
export const MixedAncestrySchema = z.object({
  name: z.string(),
  parentAncestries: z.array(z.string()),
  primaryFeature: AncestryFeatureSchema,
  secondaryFeature: AncestryFeatureSchema,
});

// Type exports
export type AncestryFeature = z.infer<typeof AncestryFeatureSchema>;
export type Ancestry = z.infer<typeof AncestrySchema>;
export type MixedAncestry = z.infer<typeof MixedAncestrySchema>;

// Re-export moved data
export { ANCESTRIES } from '../data/characters/ancestries';

// Utility functions
export function getAncestryByName(name: string): Ancestry | undefined {
  return (ANCESTRIES as Ancestry[]).find(
    ancestry => ancestry.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAncestryPrimaryFeatures(): AncestryFeature[] {
  return (ANCESTRIES as Ancestry[]).map(ancestry => ancestry.primaryFeature);
}

export function getAncestrySecondaryFeatures(): AncestryFeature[] {
  return (ANCESTRIES as Ancestry[]).map(ancestry => ancestry.secondaryFeature);
}

export function getPrimaryFeatureByAncestryName(
  ancestryName: string
): AncestryFeature | undefined {
  const ancestry = getAncestryByName(ancestryName);
  return ancestry ? ancestry.primaryFeature : undefined;
}

export function getSecondaryFeatureByAncestryName(
  ancestryName: string
): AncestryFeature | undefined {
  const ancestry = getAncestryByName(ancestryName);
  return ancestry ? ancestry.secondaryFeature : undefined;
}

// Helper function to create a mixed ancestry following the rules
export function createMixedAncestry(
  name: string,
  ancestryOneName: string,
  ancestryTwoName: string
): MixedAncestry | null {
  const ancestryOne = getAncestryByName(ancestryOneName);
  const ancestryTwo = getAncestryByName(ancestryTwoName);

  if (!ancestryOne || !ancestryTwo) return null;

  return {
    name,
    parentAncestries: [ancestryOneName, ancestryTwoName],
    primaryFeature: ancestryOne.primaryFeature,
    secondaryFeature: ancestryTwo.secondaryFeature,
  };
}

// Alternative mixed ancestry creation (primary from second ancestry, secondary from first)
export function createAlternateMixedAncestry(
  name: string,
  ancestryOneName: string,
  ancestryTwoName: string
): MixedAncestry | null {
  const ancestryOne = getAncestryByName(ancestryOneName);
  const ancestryTwo = getAncestryByName(ancestryTwoName);

  if (!ancestryOne || !ancestryTwo) return null;

  return {
    name,
    parentAncestries: [ancestryOneName, ancestryTwoName],
    primaryFeature: ancestryTwo.primaryFeature,
    secondaryFeature: ancestryOne.secondaryFeature,
  };
}

// Custom mixed ancestry creation (choose any primary and any secondary)
export function createCustomMixedAncestry(
  name: string,
  parentAncestries: string[],
  primaryFeatureFromAncestry: string,
  secondaryFeatureFromAncestry: string
): MixedAncestry | null {
  const primaryAncestry = getAncestryByName(primaryFeatureFromAncestry);
  const secondaryAncestry = getAncestryByName(secondaryFeatureFromAncestry);

  if (!primaryAncestry || !secondaryAncestry) return null;

  return {
    name,
    parentAncestries,
    primaryFeature: primaryAncestry.primaryFeature,
    secondaryFeature: secondaryAncestry.secondaryFeature,
  };
}

// Validation functions
export function validateAncestry(ancestry: unknown): ancestry is Ancestry {
  try {
    AncestrySchema.parse(ancestry);
    return true;
  } catch {
    return false;
  }
}

export function validateMixedAncestry(
  mixedAncestry: unknown
): mixedAncestry is MixedAncestry {
  try {
    MixedAncestrySchema.parse(mixedAncestry);
    return true;
  } catch {
    return false;
  }
}
