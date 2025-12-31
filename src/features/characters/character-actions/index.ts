export { coreActions } from './core-actions';
export { resourceActions } from './resource-actions';
export { stateActions } from './state-actions';
export { clamp } from './types';
export type { CharacterState, CharacterStore } from './types';

import { coreActions } from './core-actions';
import { resourceActions } from './resource-actions';
import { stateActions } from './state-actions';

export const characterActions = {
  ...coreActions,
  ...resourceActions,
  ...stateActions,
};
