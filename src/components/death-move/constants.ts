import type { DeathMoveType } from './types';

export type DeathMoveIconKey = 'flame' | 'sparkle' | 'dice5';

export const DEATH_MOVE_OPTIONS: {
  type: DeathMoveType;
  name: string;
  iconKey: DeathMoveIconKey;
  description: string;
  riskLevel: 'safe' | 'risky' | 'heroic';
}[] = [
  {
    type: 'blaze_of_glory',
    name: 'Blaze of Glory',
    iconKey: 'flame',
    description:
      'Embrace death and go out heroically. Take one action that critically succeeds, then cross through the veil of death.',
    riskLevel: 'heroic',
  },
  {
    type: 'avoid_death',
    name: 'Avoid Death',
    iconKey: 'sparkle',
    description:
      "Drop unconscious and face consequences. You can't move or act while unconscious. Roll your Hope Die - if equal to or under your level, you gain a scar.",
    riskLevel: 'safe',
  },
  {
    type: 'risk_it_all',
    name: 'Risk It All',
    iconKey: 'dice5',
    description:
      'Roll your Duality Dice. If Hope is higher, stay up and clear HP/Stress equal to the Hope Die. If Fear is higher, you die. Critical success clears all HP and Stress.',
    riskLevel: 'risky',
  },
];

export const RISK_LEVEL_STYLES = {
  safe: 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20',
  risky: 'border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20',
  heroic: 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20',
} as const;
