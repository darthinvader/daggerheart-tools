export interface DowntimeMove {
  id: string;
  name: string;
  description: string;
  category: DowntimeCategory;
  defaultHoursRequired?: number;
}

export type DowntimeCategory =
  | 'recovery'
  | 'crafting'
  | 'social'
  | 'exploration'
  | 'training';

export interface DowntimeActivity {
  id: string;
  moveId: string;
  moveName: string;
  notes: string;
  hoursSpent: number;
  completed: boolean;
  outcome?: string;
  sessionDate: string;
}

export interface DowntimeState {
  activities: DowntimeActivity[];
}
