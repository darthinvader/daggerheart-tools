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

// Empty arrays for domains that don't have cards listed in the SRD
export const CHAOS_DOMAIN_CARDS = [] as const;
export const MOON_DOMAIN_CARDS = [] as const;
export const SUN_DOMAIN_CARDS = [] as const;
export const BLOOD_DOMAIN_CARDS = [] as const;
export const FATE_DOMAIN_CARDS = [] as const;
