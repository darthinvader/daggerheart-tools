// This file contains constants for the Daggerheart domain cards.
// This file is maintained for backward compatibility.
// New detailed domain card implementations are in the domains/ folder.
import { ARCANA_DOMAIN_CARD_NAMES } from './domains/arcana-domain-cards';
import { BONE_DOMAIN_CARD_NAMES } from './domains/bone-domain-cards';
import { GRACE_DOMAIN_CARD_NAMES } from './domains/grace-domain-cards';
import { MIDNIGHT_DOMAIN_CARD_NAMES } from './domains/midnight-domain-cards';
import { SAGE_DOMAIN_CARD_NAMES } from './domains/sage-domain-cards';

export const ARCANA_DOMAIN_CARDS = ARCANA_DOMAIN_CARD_NAMES;

export const BLADE_DOMAIN_CARDS = [
  'GET BACK UP',
  'NOT GOOD ENOUGH',
  'WHIRLWIND',
  "A SOLDIER'S BOND",
  'RECKLESS',
  'SCRAMBLE',
  'VERSATILE FIGHTER',
  'DEADLY FOCUS',
  'FORTIFIED ARMOR',
  "CHAMPION'S EDGE",
  'VITALITY',
  'BATTLE-HARDENED',
  'RAGE UP',
  'BLADE-TOUCHED',
  'GLANCING BLOW',
  'BATTLE CRY',
  'FRENZY',
  'GORE AND GLORY',
  "REAPER'S STRIKE",
  'BATTLE MONSTER',
  'ONSLAUGHT',
] as const;

export const BONE_DOMAIN_CARDS = BONE_DOMAIN_CARD_NAMES;

export const CODEX_DOMAIN_CARDS = [
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

export const GRACE_DOMAIN_CARDS = GRACE_DOMAIN_CARD_NAMES;

export const MIDNIGHT_DOMAIN_CARDS = MIDNIGHT_DOMAIN_CARD_NAMES;

export const SAGE_DOMAIN_CARDS = SAGE_DOMAIN_CARD_NAMES;

export const SPLENDOR_DOMAIN_CARDS = [
  'BOLT BEACON',
  'MENDING TOUCH',
  'REASSURANCE',
  'FINAL WORDS',
  'HEALING HANDS',
  'SECOND WIND',
  'VOICE OF REASON',
  'DIVINATION',
  'LIFE WARD',
  'SHAPE MATERIAL',
  'SMITE',
  'RESTORATION',
  'ZONE OF PROTECTION',
  'HEALING STRIKE',
  'SPLENDOR-TOUCHED',
  'SHIELD AURA',
  'STUNNING SUNLIGHT',
  'OVERWHELMING AURA',
  'SALVATION BEAM',
  'INVIGORATION',
  'RESURRECTION',
] as const;

export const VALOR_DOMAIN_CARDS = [
  'BARE BONES',
  'FORCEFUL PUSH',
  'I AM YOUR SHIELD',
  'BODY BASHER',
  'BOLD PRESENCE',
  'CRITICAL INSPIRATION',
  'LEAN ON ME',
  'GOAD THEM ON',
  'SUPPORT TANK',
  'ARMORER',
  'ROUSING STRIKE',
  'INEVITABLE',
  'RISE UP',
  'SHRUG IT OFF',
  'VALOR-TOUCHED',
  'FULL SURGE',
  'GROUND POUND',
  'HOLD THE LINE',
  'LEAD BY EXAMPLE',
  'UNBREAKABLE',
  'UNYIELDING ARMOR',
] as const;

// Empty arrays for domains that don't have cards listed in the SRD
export const CHAOS_DOMAIN_CARDS = [] as const;
export const MOON_DOMAIN_CARDS = [] as const;
export const SUN_DOMAIN_CARDS = [] as const;
export const BLOOD_DOMAIN_CARDS = [] as const;
export const FATE_DOMAIN_CARDS = [] as const;
