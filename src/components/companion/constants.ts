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

// Emoji mappings for companion types
export const COMPANION_TYPE_EMOJIS: Record<string, string> = {
  Wolf: '🐺',
  Bear: '🐻',
  Hawk: '🦅',
  Fox: '🦊',
  Panther: '🐆',
  Owl: '🦉',
  Serpent: '🐍',
  Boar: '🐗',
  Stag: '🦌',
  Raven: '🪶',
  Spider: '🕷️',
  Eagle: '🦅',
  Horse: '🐴',
  Lynx: '🐱',
};

// Training emojis for visual flair
export const TRAINING_EMOJIS = {
  intelligent: '🧠',
  vicious: '💥',
  resilient: '🛡️',
  aware: '👁️',
  lightInTheDark: '✨',
  creatureComfort: '💕',
  armored: '🛡️',
  bonded: '🤝',
} as const;

// Get emoji for companion type, with fallback
export function getCompanionEmoji(type: string): string {
  const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return COMPANION_TYPE_EMOJIS[normalized] ?? '🐾';
}
