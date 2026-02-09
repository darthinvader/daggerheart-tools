import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  Bird,
  Brain,
  Bug,
  Cat,
  Dog,
  Feather,
  Flame,
  Focus,
  Handshake,
  Heart,
  PawPrint,
  Shield,
  Sparkles,
} from 'lucide-react';
import type { ComponentType } from 'react';

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

export const CompanionTypeIcons: Record<string, LucideIcon> = {
  Wolf: Dog,
  Bear: PawPrint,
  Hawk: Bird,
  Eagle: Bird,
  Fox: Dog,
  Panther: Cat,
  Owl: Bird,
  Serpent: Bug,
  Boar: PawPrint,
  Stag: PawPrint,
  Raven: Feather,
  Spider: Bug,
  Horse: PawPrint,
  Lynx: Cat,
  default: PawPrint,
} as const;

export const CompanionTrainingIcons: Record<string, LucideIcon> = {
  intelligent: Brain,
  vicious: Flame,
  resilient: Shield,
  armored: Shield,
  aware: Focus,
  lightInTheDark: Sparkles,
  creatureComfort: Heart,
  bonded: Handshake,
} as const;

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
