import { z } from 'zod';

export const TierEnum = z.enum(['1', '2', '3', '4']);
export type Tier = z.infer<typeof TierEnum>;
