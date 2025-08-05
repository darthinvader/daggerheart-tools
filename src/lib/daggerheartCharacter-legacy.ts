/**
 * Backward Compatibility Export
 * 
 * This file maintains the original API while the new modular structure
 * is being integrated. Eventually this can be deprecated in favor of
 * importing directly from the schemas/ directory.
 * 
 * @deprecated Use `import from './schemas'` instead
 */

// Re-export everything from the new modular structure
export * from './schemas';

// Legacy exports for backward compatibility
export { 
  PlayerCharacterSchema as default,
  CharacterFactory,
  CharacterValidator,
  CharacterUtilities
} from './schemas';
