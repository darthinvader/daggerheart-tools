export type AdversaryTier = '1' | '2' | '3' | '4';

export interface AdversaryEntry {
  name: string;
  tier: AdversaryTier;
  role: string;
  description: string;
  traits: string[];
  tags?: string[];
}

export const ADVERSARIES: AdversaryEntry[] = [
  {
    name: 'Cutter',
    tier: '1',
    role: 'Skirmisher',
    description:
      'A quick-footed melee threat that presses weak points and retreats when pressed.',
    traits: ['Swift', 'Close-quarters', 'Opportunistic'],
    tags: ['humanoid', 'bandit'],
  },
  {
    name: 'Hexhand',
    tier: '2',
    role: 'Controller',
    description:
      'Uses disruptive magic to weaken targets and tilt the flow of a fight.',
    traits: ['Spellcasting', 'Debilitating', 'Fragile'],
    tags: ['mystic'],
  },
  {
    name: 'Ironbound',
    tier: '3',
    role: 'Bruiser',
    description:
      'Soaks hits and forces the party to reposition under heavy pressure.',
    traits: ['Armored', 'Relentless', 'Slow'],
    tags: ['construct'],
  },
  {
    name: 'Storm Herald',
    tier: '4',
    role: 'Elite',
    description:
      'Commands battlefield-wide threats with punishing bursts of power.',
    traits: ['Area control', 'Commanding', 'Volatile'],
    tags: ['leader'],
  },
];
