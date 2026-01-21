import { z } from 'zod';

export const QuickViewSectionsSchema = z.object({
  traits: z.boolean().default(true),
  vitals: z.boolean().default(true),
  coreScores: z.boolean().default(true),
  thresholds: z.boolean().default(true),
  ancestry: z.boolean().default(true),
  community: z.boolean().default(true),
  class: z.boolean().default(true),
  gold: z.boolean().default(true),
  conditions: z.boolean().default(true),
  companion: z.boolean().default(true),
  experiences: z.boolean().default(true),
  equipment: z.boolean().default(true),
  loadout: z.boolean().default(true),
  inventory: z.boolean().default(true),
});

export const QuickViewPreferencesSchema = z.object({
  sections: QuickViewSectionsSchema,
});

export type QuickViewSections = z.infer<typeof QuickViewSectionsSchema>;
export type QuickViewPreferences = z.infer<typeof QuickViewPreferencesSchema>;

export const DEFAULT_QUICK_VIEW_SECTIONS: QuickViewSections = {
  traits: true,
  vitals: true,
  coreScores: true,
  thresholds: true,
  ancestry: true,
  community: true,
  class: true,
  gold: true,
  conditions: true,
  companion: true,
  experiences: true,
  equipment: true,
  loadout: true,
  inventory: true,
};

export const DEFAULT_QUICK_VIEW_PREFERENCES: QuickViewPreferences = {
  sections: DEFAULT_QUICK_VIEW_SECTIONS,
};
