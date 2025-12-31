import type { Scar } from '@/lib/schemas/session-state';

export interface SlotData {
  index: number;
  isFilled: boolean;
  isScarred: boolean;
  scar?: Scar;
  isBonus: boolean;
}

/** Build slot data array from current state */
export function buildSlots(
  current: number,
  scars: Scar[],
  totalSlots: number
): SlotData[] {
  return Array.from({ length: totalSlots }, (_, i) => {
    const scar = scars.find(s => s.hopeSlotIndex === i);
    const isScarred = !!scar;
    const isBonus = i >= 6;

    // Count non-scarred slots up to and including this index
    let nonScarredCount = 0;
    for (let idx = 0; idx <= i; idx++) {
      if (!scars.some(s => s.hopeSlotIndex === idx)) {
        nonScarredCount++;
      }
    }
    const isFilled = !isScarred && nonScarredCount <= current;

    return { index: i, isFilled, isScarred, scar, isBonus };
  });
}
