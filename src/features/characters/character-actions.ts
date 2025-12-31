// Re-export from split modules for backward compatibility
export {
  characterActions,
  clamp,
  coreActions,
  resourceActions,
  stateActions,
} from './character-actions/index';
export type { CharacterState, CharacterStore } from './character-actions/index';
