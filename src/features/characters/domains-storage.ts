import { z } from 'zod';

import { DomainCardLiteSchema } from '@/lib/schemas/loadout';
import { characterKeys as keys, storage } from '@/lib/storage';

// Domains draft uses the lite card schema with passthrough for flexibility
const DomainCardSchemaLite = DomainCardLiteSchema.passthrough();

export const DomainsDraftSchema = z.object({
  loadout: z.array(DomainCardSchemaLite).default([]),
  vault: z.array(DomainCardSchemaLite).default([]),
  creationComplete: z.boolean().default(false),
});
export type DomainsDraft = z.infer<typeof DomainsDraftSchema>;
export const DEFAULT_DOMAINS: DomainsDraft = {
  loadout: [],
  vault: [],
  creationComplete: false,
};

export function readDomainsFromStorage(id: string): DomainsDraft {
  const parsed = storage.read(keys.domains(id), DEFAULT_DOMAINS);
  try {
    return DomainsDraftSchema.parse(parsed);
  } catch {
    return DEFAULT_DOMAINS;
  }
}
export function writeDomainsToStorage(id: string, value: DomainsDraft) {
  storage.write(keys.domains(id), value);
}
