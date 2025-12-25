import { z } from 'zod';

import {
  DEFAULT_LOADOUT,
  type HomebrewDomainCard,
  HomebrewDomainCardSchema,
  type LoadoutSelection,
  LoadoutSelectionSchema,
} from '@/lib/schemas/loadout';
import { characterKeys as keys, storage } from '@/lib/storage';

export function readLoadoutFromStorage(id: string): LoadoutSelection {
  const raw = storage.read(keys.loadout(id), DEFAULT_LOADOUT);
  const parsed = LoadoutSelectionSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_LOADOUT;
}

export function writeLoadoutToStorage(id: string, value: LoadoutSelection) {
  storage.write(keys.loadout(id), value);
}

export function readHomebrewCardsFromStorage(id: string): HomebrewDomainCard[] {
  const raw = storage.read(keys.homebrewCards(id), []);
  const parsed = z.array(HomebrewDomainCardSchema).safeParse(raw);
  return parsed.success ? parsed.data : [];
}

export function writeHomebrewCardsToStorage(
  id: string,
  value: HomebrewDomainCard[]
) {
  storage.write(keys.homebrewCards(id), value);
}

export function addHomebrewCard(id: string, card: HomebrewDomainCard) {
  const existing = readHomebrewCardsFromStorage(id);
  const filtered = existing.filter(c => c.name !== card.name);
  writeHomebrewCardsToStorage(id, [...filtered, card]);
}

export function removeHomebrewCard(id: string, cardName: string) {
  const existing = readHomebrewCardsFromStorage(id);
  writeHomebrewCardsToStorage(
    id,
    existing.filter(c => c.name !== cardName)
  );
}

export { DEFAULT_LOADOUT, LoadoutSelectionSchema };
export type { LoadoutSelection };
