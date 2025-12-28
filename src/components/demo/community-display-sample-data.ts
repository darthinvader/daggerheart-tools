import type { CommunitySelection } from '@/lib/schemas/identity';
import { getCommunityByName } from '@/lib/schemas/identity';

export const SAMPLE_HIGHBORNE: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Highborne')!,
};

export const SAMPLE_WANDERBORNE: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Wanderborne')!,
};

export const SAMPLE_LOREBORNE: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Loreborne')!,
};

export const SAMPLE_HOMEBREW: CommunitySelection = {
  mode: 'homebrew',
  homebrew: {
    name: 'Skyborne',
    description:
      'Those who dwell among the floating islands and airships, where the wind is home and the ground is but a distant memory. Skyborne communities value freedom, innovation, and adaptability above all else.',
    commonTraits: [
      'adventurous',
      'resourceful',
      'independent',
      'daring',
      'curious',
      'carefree',
    ],
    feature: {
      name: 'Sky Legs',
      description:
        'You have advantage on rolls to maintain balance, navigate aerial vessels, or resist vertigo and fear of heights.',
    },
  },
};
