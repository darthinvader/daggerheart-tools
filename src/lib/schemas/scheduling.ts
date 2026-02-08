// Standalone Scheduling Poll schemas — availability voting via shareable links
import { z } from 'zod';

// =====================================================================================
// Vote value (player's availability for a specific time slot)
// =====================================================================================

export const PollVoteValueSchema = z.enum([
  'available',
  'maybe',
  'unavailable',
]);

export const PollVoteSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  value: PollVoteValueSchema,
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Time slot with embedded votes
// =====================================================================================

export const PollSlotSchema = z.object({
  id: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  label: z.string().default(''),
  votes: z.array(PollVoteSchema).default([]),
});

// =====================================================================================
// Poll status lifecycle: open → confirmed | archived
// =====================================================================================

export const PollStatusSchema = z.enum(['open', 'confirmed', 'archived']);

// =====================================================================================
// Scheduling Poll — standalone entity with shareable link
// =====================================================================================

export const SchedulingPollSchema = z.object({
  id: z.string(),
  gmId: z.string(),
  campaignId: z.string().optional(),
  title: z.string().min(1),
  description: z.string().default(''),
  status: PollStatusSchema.default('open'),
  slots: z.array(PollSlotSchema).default([]),
  quorum: z.number().int().min(1).default(1),
  confirmedSlotId: z.string().optional(),
  shareCode: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Type exports
// =====================================================================================

export type PollVoteValue = z.infer<typeof PollVoteValueSchema>;
export type PollVote = z.infer<typeof PollVoteSchema>;
export type PollSlot = z.infer<typeof PollSlotSchema>;
export type PollStatus = z.infer<typeof PollStatusSchema>;
export type SchedulingPoll = z.infer<typeof SchedulingPollSchema>;
