export interface DowntimeMove {
  id: string;
  name: string;
  description: string;
  category: DowntimeCategory;
  defaultHoursRequired?: number;
  /** If set, only characters with this domain can use this move */
  requiredDomain?: string;
  /** If set, only characters with this class can use this move */
  requiredClass?: string;
  /** Optional flavor text explaining thematic connection */
  flavorText?: string;
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
