// Domain schemas and types
export * from './domain-card.schema';

// Specific domain card implementations
export * from './arcana-domain-cards';
export * from './bone-domain-cards';
export * from './codex-domain-cards';
export * from './sage-domain-cards';
export * from './splendor-domain-cards';

// Re-export existing domain card arrays for backward compatibility
export {
  ARCANA_DOMAIN_CARDS as ARCANA_DOMAIN_CARD_NAMES_LEGACY,
  BLADE_DOMAIN_CARDS,
  BLOOD_DOMAIN_CARDS,
  BONE_DOMAIN_CARDS,
  CHAOS_DOMAIN_CARDS,
  CODEX_DOMAIN_CARDS as CODEX_DOMAIN_CARD_NAMES_LEGACY,
  FATE_DOMAIN_CARDS,
  GRACE_DOMAIN_CARDS,
  MIDNIGHT_DOMAIN_CARDS,
  MOON_DOMAIN_CARDS,
  SAGE_DOMAIN_CARDS,
  SPLENDOR_DOMAIN_CARDS,
  SUN_DOMAIN_CARDS,
  VALOR_DOMAIN_CARDS,
} from '../domain-cards';
