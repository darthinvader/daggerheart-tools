import type { CountdownType } from './types';

export const COUNTDOWN_TYPES: {
  value: CountdownType;
  label: string;
  color: string;
}[] = [
  { value: 'threat', label: 'Threat', color: 'text-red-500' },
  { value: 'opportunity', label: 'Opportunity', color: 'text-green-500' },
  { value: 'neutral', label: 'Neutral', color: 'text-slate-500' },
];

export const COUNTDOWN_SEGMENT_OPTIONS = [4, 6, 8, 10, 12];

export const COUNTDOWN_TYPE_STYLES: Record<
  CountdownType,
  { ring: string; fill: string; bg: string }
> = {
  threat: {
    ring: 'ring-red-500/50',
    fill: 'bg-red-500',
    bg: 'bg-red-500/10',
  },
  opportunity: {
    ring: 'ring-green-500/50',
    fill: 'bg-green-500',
    bg: 'bg-green-500/10',
  },
  neutral: {
    ring: 'ring-slate-500/50',
    fill: 'bg-slate-500',
    bg: 'bg-slate-500/10',
  },
};
