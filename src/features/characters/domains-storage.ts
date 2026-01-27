import { z } from 'zod';

import { DomainCardLiteSchema } from '@/lib/schemas/loadout';

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
