import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

import { CompanionTrainingIcons, CompanionTypeIcons } from '@/lib/icons';

export const COMPANION_TYPE_SUGGESTIONS = [
  'Wolf',
  'Bear',
  'Hawk',
  'Fox',
  'Panther',
  'Owl',
  'Serpent',
  'Boar',
  'Stag',
  'Raven',
  'Spider',
  'Eagle',
  'Horse',
  'Lynx',
] as const;

export const COMPANION_ATTACK_SUGGESTIONS = [
  'Bite',
  'Claw',
  'Talons',
  'Gore',
  'Stomp',
  'Pounce',
  'Charge',
  'Tail Swipe',
  'Peck',
  'Web',
] as const;

// Re-export icon mappings from centralized location
export { CompanionTrainingIcons, CompanionTypeIcons };

// Type alias for icon components
type IconComponent = ComponentType<LucideProps>;

// Get icon for companion type, with fallback
export function getCompanionIcon(type: string): IconComponent {
  const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return CompanionTypeIcons[normalized] ?? CompanionTypeIcons.default;
}

// Get icon for training type
export function getTrainingIcon(training: string): IconComponent {
  return CompanionTrainingIcons[training] ?? CompanionTrainingIcons.intelligent;
}
