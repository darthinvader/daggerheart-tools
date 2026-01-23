export type EnvironmentTier = '1' | '2' | '3' | '4';

export interface EnvironmentEntry {
  name: string;
  tier: EnvironmentTier;
  description: string;
  hazards: string[];
  tags?: string[];
}

export const ENVIRONMENTS: EnvironmentEntry[] = [
  {
    name: 'Shattered Causeway',
    tier: '1',
    description:
      'Broken stone spans a chasm; footing is unstable and visibility is poor.',
    hazards: ['Crumbling ledges', 'Loose debris', 'Narrow paths'],
    tags: ['outdoors'],
  },
  {
    name: 'Ashwind Flats',
    tier: '2',
    description:
      'A blasted plain of hot gusts and drifting embers that sap endurance.',
    hazards: ['Scorching winds', 'Low visibility', 'Heat strain'],
    tags: ['outdoors', 'extreme'],
  },
  {
    name: 'Echoing Vault',
    tier: '3',
    description:
      'Ancient halls amplify sound, drawing danger and masking movement.',
    hazards: ['Reverberation traps', 'Disorienting echoes', 'Falling masonry'],
    tags: ['indoors', 'ruins'],
  },
  {
    name: 'Aether Rift',
    tier: '4',
    description:
      'Reality frays in pulses, warping matter and disrupting magic.',
    hazards: ['Gravity shifts', 'Arcane backlash', 'Spatial distortion'],
    tags: ['anomalous'],
  },
];
