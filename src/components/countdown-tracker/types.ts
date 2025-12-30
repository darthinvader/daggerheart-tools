export interface Countdown {
  id: string;
  name: string;
  description?: string;
  segments: number;
  filled: number;
  type: CountdownType;
  createdAt: string;
}

export type CountdownType = 'threat' | 'opportunity' | 'neutral';

export interface CountdownsState {
  countdowns: Countdown[];
}
