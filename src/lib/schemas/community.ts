import { z } from 'zod';

import { COMMUNITIES as RAW_COMMUNITIES } from '../data/characters/communities';

// Base schema for community-related types
export const CommunityFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// Community schema
export const CommunitySchema = z.object({
  name: z.string(),
  description: z.string(),
  commonTraits: z.array(z.string()), // The six adjectives
  feature: CommunityFeatureSchema,
});

// Type exports
export type CommunityFeature = z.infer<typeof CommunityFeatureSchema>;
export type Community = z.infer<typeof CommunitySchema>;

// Re-export data
export const COMMUNITIES = RAW_COMMUNITIES as Community[];

// Utility functions
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

// Validation functions
export function validateCommunity(community: unknown): community is Community {
  try {
    CommunitySchema.parse(community);
    return true;
  } catch {
    return false;
  }
}
