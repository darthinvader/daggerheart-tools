// Core schemas
export * from './core';

// Character creation schemas
export * from './ancestry';
export * from './classes';
export * from './community';
export * from './player-character';

// Equipment system
export * from './equipment';

// Domain cards (excluding conflicting exports)
export {
  // Individual domain exports
  ARCANA_DOMAIN_CARDS,
  BLADE_DOMAIN_CARDS,
  BONE_DOMAIN_CARDS,
  CODEX_DOMAIN_CARDS,
  // Domain card schemas
  DomainCardSchema,
  GRACE_DOMAIN_CARDS,
  MIDNIGHT_DOMAIN_CARDS,
  SAGE_DOMAIN_CARDS,
  VALOR_DOMAIN_CARDS,
} from './domains';
