import type { useCharacterSheetWithApi } from './use-character-sheet-api';

export type CharacterSheetState = ReturnType<
  typeof useCharacterSheetWithApi
>['state'];
export type CharacterSheetHandlers = ReturnType<
  typeof useCharacterSheetWithApi
>['handlers'];
