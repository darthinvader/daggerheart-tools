import type { DomainCard } from '../../schemas/domains/domain-card.schema';

// Codex Domain Cards - Level 1

export const BOOK_OF_AVA: DomainCard = {
  name: 'BOOK OF AVA',
  domain: 'Codex',
  level: 1,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll against a target within Far range. On a success, the target takes 1d8+2 magic damage and is temporarily Vulnerable.',
};

export const BOOK_OF_ILLIAT: DomainCard = {
  name: 'BOOK OF ILLIAT',
  domain: 'Codex',
  level: 1,
  type: 'Spell',
  recallCost: 0,
  description:
    'Spend a Hope to create a minor illusion that affects one of the five senses within Close range. The illusion lasts until the end of the scene or you cast another spell.',
};

export const BOOK_OF_TYFAR: DomainCard = {
  name: 'BOOK OF TYFAR',
  domain: 'Codex',
  level: 1,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll against a target within Close range. On a success, you learn their current Hit Points, Stress, and damage thresholds.',
};

export const BOOK_OF_SITIL: DomainCard = {
  name: 'BOOK OF SITIL',
  domain: 'Codex',
  level: 1,
  type: 'Spell',
  recallCost: 0,
  description:
    'Spend a Hope to illuminate an area within Very Far range with bright light. This light lasts until the end of the scene or you cast another spell.',
};

// Codex Domain Cards - Level 2

export const BOOK_OF_VAGRAS: DomainCard = {
  name: 'BOOK OF VAGRAS',
  domain: 'Codex',
  level: 2,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll against a target within Far range. On a success, the target is temporarily Restrained and takes 1d6+1 magic damage at the start of each of their turns until they succeed on a Reaction Roll (12) at the end of their turn.',
};

export const BOOK_OF_KORVAX: DomainCard = {
  name: 'BOOK OF KORVAX',
  domain: 'Codex',
  level: 2,
  type: 'Spell',
  recallCost: 0,
  description:
    'Make a Spellcast Roll (12). On a success, create a floating disk of force that can carry up to 500 pounds and hovers 3 feet off the ground. The disk follows you at walking speed and lasts until your next long rest.',
};

export const BOOK_OF_NORAI: DomainCard = {
  name: 'BOOK OF NORAI',
  domain: 'Codex',
  level: 2,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll (13). On a success, you can understand and speak any language for the duration of the scene.',
};

export const BOOK_OF_EXOTA: DomainCard = {
  name: 'BOOK OF EXOTA',
  domain: 'Codex',
  level: 2,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll against all targets within Close range. Targets you succeed against must make a Reaction Roll (13) or be temporarily Confused until the end of their next turn.',
};

// Codex Domain Cards - Level 3

export const BOOK_OF_GRYNN: DomainCard = {
  name: 'BOOK OF GRYNN',
  domain: 'Codex',
  level: 3,
  type: 'Spell',
  recallCost: 2,
  description:
    'Make a Spellcast Roll (14). On a success, you can see invisible creatures and objects, detect magic auras, and see through illusions within Far range. This effect lasts until the end of the scene.',
};

export const MANIFEST_WALL: DomainCard = {
  name: 'MANIFEST WALL',
  domain: 'Codex',
  level: 3,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll (12). On a success, create a wall of force up to 20 feet long, 10 feet high, and 1 foot thick within Far range. The wall is immobile and lasts until the end of the scene or you cast another spell.',
};

export const TELEPORT: DomainCard = {
  name: 'TELEPORT',
  domain: 'Codex',
  level: 3,
  type: 'Spell',
  recallCost: 2,
  description:
    'Make a Spellcast Roll (15). On a success, teleport yourself and up to 3 willing creatures within Very Close range to any location within Very Far range that you can see.',
};

// Codex Domain Cards - Level 4

export const BANISH: DomainCard = {
  name: 'BANISH',
  domain: 'Codex',
  level: 4,
  type: 'Spell',
  recallCost: 2,
  description:
    'Make a Spellcast Roll against a target within Far range. On a success, the target is banished to a harmless demiplane until the end of the scene or until you lose concentration.',
};

export const SIGIL_OF_RETRIBUTION: DomainCard = {
  name: 'SIGIL OF RETRIBUTION',
  domain: 'Codex',
  level: 4,
  type: 'Spell',
  recallCost: 1,
  description:
    'Place a magical sigil on a willing creature within Close range. When the creature takes damage, the attacker must make a Reaction Roll (14) or take 1d10+3 magic damage. The sigil lasts until triggered or your next long rest.',
};

export const BOOK_OF_HOMET: DomainCard = {
  name: 'BOOK OF HOMET',
  domain: 'Codex',
  level: 4,
  type: 'Spell',
  recallCost: 1,
  description:
    'Make a Spellcast Roll (15). On a success, you can alter the flow of time around you. You can take an additional action on your turn. This effect lasts for one round.',
};

// Codex Domain Cards - Level 5-7

export const CODEX_TOUCHED: DomainCard = {
  name: 'CODEX-TOUCHED',
  domain: 'Codex',
  level: 7,
  type: 'Ability',
  recallCost: 2,
  description:
    'When 4 or more of the domain cards in your loadout are from the Codex domain, gain the following benefits:\n• +1 bonus to your Spellcast Rolls\n• You can recall one additional Codex spell per long rest',
};

export const BOOK_OF_VYOLA: DomainCard = {
  name: 'BOOK OF VYOLA',
  domain: 'Codex',
  level: 5,
  type: 'Spell',
  recallCost: 2,
  description:
    'Make a Spellcast Roll (16). On a success, you can duplicate any spell of Level 3 or lower that you have seen cast within the last 24 hours. Use your Spellcast trait for the duplicated spell.',
};

export const SAFE_HAVEN: DomainCard = {
  name: 'SAFE HAVEN',
  domain: 'Codex',
  level: 6,
  type: 'Spell',
  recallCost: 3,
  description:
    'Make a Spellcast Roll (17). On a success, create a magical sanctuary in an area within Close range. The sanctuary is invisible from the outside and protects those inside from detection and harm for up to 8 hours.',
};

export const BOOK_OF_RONIN: DomainCard = {
  name: 'BOOK OF RONIN',
  domain: 'Codex',
  level: 7,
  type: 'Spell',
  recallCost: 2,
  description:
    'Make a Spellcast Roll (18). On a success, you can step partially into the ethereal plane, becoming incorporeal for up to 10 minutes. While incorporeal, you can move through solid objects but cannot interact with the physical world.',
};

// Codex Domain Cards - Level 8-10

export const DISINTEGRATION_WAVE: DomainCard = {
  name: 'DISINTEGRATION WAVE',
  domain: 'Codex',
  level: 8,
  type: 'Spell',
  recallCost: 3,
  description:
    "Make a Spellcast Roll against all targets in a line within Very Far range. Mark any number of Stress to increase the wave's power. Targets you succeed against take 2d12+6 magic damage plus 1d6 per Stress marked.",
};

export const BOOK_OF_YARROW: DomainCard = {
  name: 'BOOK OF YARROW',
  domain: 'Codex',
  level: 9,
  type: 'Spell',
  recallCost: 2,
  description:
    'Once per rest, make a Spellcast Roll (19). On a success, you can rewrite reality in a small way within Very Far range. You can alter terrain, create or destroy non-magical objects, or change the properties of materials for the duration of the scene.',
};

export const TRANSCENDENT_UNION: DomainCard = {
  name: 'TRANSCENDENT UNION',
  domain: 'Codex',
  level: 10,
  type: 'Spell',
  recallCost: 1,
  description:
    'Once per rest, spend 5 Hope to merge temporarily with the cosmic forces of knowledge and magic. For the next 10 minutes, you automatically succeed on all Spellcast Rolls and can cast any Codex spell without using recall costs.',
};

// Export array of all Codex domain card names for backward compatibility
export const CODEX_DOMAIN_CARD_NAMES = [
  'BOOK OF AVA',
  'BOOK OF ILLIAT',
  'BOOK OF TYFAR',
  'BOOK OF SITIL',
  'BOOK OF VAGRAS',
  'BOOK OF KORVAX',
  'BOOK OF NORAI',
  'BOOK OF EXOTA',
  'BOOK OF GRYNN',
  'MANIFEST WALL',
  'TELEPORT',
  'BANISH',
  'SIGIL OF RETRIBUTION',
  'BOOK OF HOMET',
  'CODEX-TOUCHED',
  'BOOK OF VYOLA',
  'SAFE HAVEN',
  'BOOK OF RONIN',
  'DISINTEGRATION WAVE',
  'BOOK OF YARROW',
  'TRANSCENDENT UNION',
] as const;

export type CodexDomainCardName = (typeof CODEX_DOMAIN_CARD_NAMES)[number];

// Export all individual cards
export const CODEX_DOMAIN_CARDS = [
  BOOK_OF_AVA,
  BOOK_OF_ILLIAT,
  BOOK_OF_TYFAR,
  BOOK_OF_SITIL,
  BOOK_OF_VAGRAS,
  BOOK_OF_KORVAX,
  BOOK_OF_NORAI,
  BOOK_OF_EXOTA,
  BOOK_OF_GRYNN,
  MANIFEST_WALL,
  TELEPORT,
  BANISH,
  SIGIL_OF_RETRIBUTION,
  BOOK_OF_HOMET,
  CODEX_TOUCHED,
  BOOK_OF_VYOLA,
  SAFE_HAVEN,
  BOOK_OF_RONIN,
  DISINTEGRATION_WAVE,
  BOOK_OF_YARROW,
  TRANSCENDENT_UNION,
] as const;
