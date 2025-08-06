// Domain schemas and types
export * from './domain-card.schema';

// All domain card implementations
export * from './arcana-domain-cards';
export * from './blade-domain-cards';
export * from './bone-domain-cards';
export * from './codex-domain-cards';
export * from './grace-domain-cards';
export * from './midnight-domain-cards';
export * from './sage-domain-cards';
export * from './splendor-domain-cards';
export * from './valor-domain-cards';

// Re-export domain cards with consistent naming for backward compatibility
export {
  ARCANA_DOMAIN_CARDS,
  ARCANA_DOMAIN_CARD_NAMES,
} from './arcana-domain-cards';
export {
  BLADE_DOMAIN_CARDS,
  BLADE_DOMAIN_CARD_NAMES,
} from './blade-domain-cards';
export { BONE_DOMAIN_CARDS, BONE_DOMAIN_CARD_NAMES } from './bone-domain-cards';
export {
  CODEX_DOMAIN_CARDS,
  CODEX_DOMAIN_CARD_NAMES,
} from './codex-domain-cards';
export {
  GRACE_DOMAIN_CARDS,
  GRACE_DOMAIN_CARD_NAMES,
} from './grace-domain-cards';
export {
  MIDNIGHT_DOMAIN_CARDS,
  MIDNIGHT_DOMAIN_CARD_NAMES,
} from './midnight-domain-cards';
export { SAGE_DOMAIN_CARDS, SAGE_DOMAIN_CARD_NAMES } from './sage-domain-cards';
export {
  SPLENDOR_DOMAIN_CARDS,
  SPLENDOR_DOMAIN_CARD_NAMES,
} from './splendor-domain-cards';
export {
  VALOR_DOMAIN_CARDS,
  VALOR_DOMAIN_CARD_NAMES,
} from './valor-domain-cards';

// Empty arrays for domains that don't have cards listed in the SRD
export const CHAOS_DOMAIN_CARDS = [] as const;
export const MOON_DOMAIN_CARDS = [] as const;
export const SUN_DOMAIN_CARDS = [] as const;
export const BLOOD_DOMAIN_CARDS = [] as const;
export const FATE_DOMAIN_CARDS = [] as const;
