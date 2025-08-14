import { z } from 'zod';

import { characterKeys as keys, storage } from '@/lib/storage';

// Domains draft (lite card shape to avoid importing all domain schemas)
const DomainCardSchemaLite = z
  .object({
    name: z.string(),
    level: z.number().int().min(1).max(10),
    domain: z.string(),
    type: z.string(),
    description: z.string().optional(),
    hopeCost: z.number().int().min(0).optional(),
    recallCost: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();
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
