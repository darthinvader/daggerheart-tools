import { useMeasurement } from '@/components/providers/measurement';
import type { MeasurementUnit } from '@/lib/types/measurement';

import { Button } from './button';

const unitOrder: MeasurementUnit[] = ['feet', 'meters', 'yards'];

const unitLabel: Record<MeasurementUnit, string> = {
  feet: 'ft',
  meters: 'm',
  yards: 'yd',
};

export function MeasurementToggle() {
  const { unit, setUnit } = useMeasurement();

  const cycleUnit = () => {
    const currentIndex = unitOrder.indexOf(unit);
    const nextIndex = (currentIndex + 1) % unitOrder.length;
    setUnit(unitOrder[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleUnit}
      aria-label={`Measurement unit: ${unit}`}
    >
      <span className="text-xs font-semibold">{unitLabel[unit]}</span>
    </Button>
  );
}
