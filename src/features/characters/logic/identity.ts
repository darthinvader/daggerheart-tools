import {
  type Community,
  getCommunityByName as getCommunityByNameRaw,
} from '@/lib/schemas/identity';

interface CommunityDetails {
  type?: 'standard' | 'homebrew';
  homebrew?: {
    name: string;
    description?: string;
    commonTraits?: string[];
    feature?: { name: string; description?: string };
  };
}

export function getCommunityByName(name: string): Community | undefined {
  if (!name) return undefined;
  return getCommunityByNameRaw(name);
}

export function normalizeCommunity(input: {
  community: string;
  details?: CommunityDetails;
}):
  | {
      mode: 'standard';
      name: string;
      traits?: string[];
      feature?: { name: string; description?: string };
    }
  | {
      mode: 'homebrew';
      name: string;
      traits?: string[];
      feature?: { name: string; description?: string };
    }
  | { mode: 'empty' } {
  const mode = input.details?.type ?? 'standard';
  if (mode === 'homebrew' && input.details?.homebrew) {
    const hb = input.details.homebrew;
    return {
      mode: 'homebrew',
      name: hb.name,
      traits: hb.commonTraits,
      feature: hb.feature,
    };
  }
  const std = getCommunityByName(input.community);
  if (!std) return { mode: 'empty' };
  return {
    mode: 'standard',
    name: std.name,
    traits: std.commonTraits,
    feature: std.feature,
  };
}
