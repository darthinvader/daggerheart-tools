import { z } from 'zod';

// Data sources
import { ANCESTRIES as RAW_ANCESTRIES } from '../data/characters/ancestries';
import { COMMUNITIES as RAW_COMMUNITIES } from '../data/characters/communities';
import { NameDescriptionSchema } from './core';

// =============================
// Ancestry
// =============================

export const AncestryFeatureSchema = z.object({
  ...NameDescriptionSchema.shape,
  // Preserve explicit type used by callers to distinguish features
  type: z.enum(['primary', 'secondary']),
});

export const AncestrySchema = z.object({
  name: z.string(),
  description: z.string(),
  heightRange: z.string(),
  lifespan: z.string(),
  physicalCharacteristics: z.array(z.string()),
  primaryFeature: AncestryFeatureSchema,
  secondaryFeature: AncestryFeatureSchema,
});

export const MixedAncestrySchema = z.object({
  name: z.string(),
  parentAncestries: z.array(z.string()),
  primaryFeature: AncestryFeatureSchema,
  secondaryFeature: AncestryFeatureSchema,
});

export type AncestryFeature = z.infer<typeof AncestryFeatureSchema>;
export type Ancestry = z.infer<typeof AncestrySchema>;
export type MixedAncestry = z.infer<typeof MixedAncestrySchema>;

export type AncestryMode = 'standard' | 'mixed' | 'homebrew';

// Homebrew uses same shape as Ancestry but represents user-created content
export type HomebrewAncestry = Ancestry;

// Discriminated union for ancestry selection state
export type AncestrySelection =
  | { mode: 'standard'; ancestry: Ancestry }
  | { mode: 'mixed'; mixedAncestry: MixedAncestry }
  | { mode: 'homebrew'; homebrew: HomebrewAncestry }
  | null;

export const ANCESTRIES = RAW_ANCESTRIES as Ancestry[];

export function getAncestryByName(name: string): Ancestry | undefined {
  return ANCESTRIES.find(
    (ancestry: Ancestry) => ancestry.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAncestryPrimaryFeatures(): AncestryFeature[] {
  return ANCESTRIES.map((ancestry: Ancestry) => ancestry.primaryFeature);
}

export function getAncestrySecondaryFeatures(): AncestryFeature[] {
  return ANCESTRIES.map((ancestry: Ancestry) => ancestry.secondaryFeature);
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

// Mixed ancestry creators
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

// =============================
// Community
// =============================

export const CommunityFeatureSchema = z.object({
  ...NameDescriptionSchema.shape,
});

export const CommunitySchema = z.object({
  name: z.string(),
  description: z.string(),
  commonTraits: z.array(z.string()),
  feature: CommunityFeatureSchema,
});

export type CommunityFeature = z.infer<typeof CommunityFeatureSchema>;
export type Community = z.infer<typeof CommunitySchema>;

export type CommunityMode = 'standard' | 'homebrew';

export type HomebrewCommunity = Community;

export type CommunitySelection =
  | { mode: 'standard'; community: Community }
  | { mode: 'homebrew'; homebrew: HomebrewCommunity }
  | null;

export const COMMUNITIES = RAW_COMMUNITIES as Community[];

export function getCommunityByName(name: string): Community | undefined {
  return COMMUNITIES.find(
    (community: Community) =>
      community.name.toLowerCase() === name.toLowerCase()
  );
}

export function getRandomCommunityTrait(
  communityName: string
): string | undefined {
  const community = getCommunityByName(communityName);
  if (!community) return undefined;

  const randomIndex = Math.floor(Math.random() * community.commonTraits.length);
  return community.commonTraits[randomIndex];
}

export function validateCommunity(community: unknown): community is Community {
  try {
    CommunitySchema.parse(community);
    return true;
  } catch {
    return false;
  }
}
