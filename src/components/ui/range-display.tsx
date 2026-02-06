import { useMeasurement } from '@/components/providers/measurement';
import { formatRangeWithDistance } from '@/lib/utils/measurement';

interface RangeDisplayProps {
  range: string;
  className?: string;
}

export function RangeDisplay({ range, className }: RangeDisplayProps) {
  const { unit } = useMeasurement();

  return (
    <span className={className}>{formatRangeWithDistance(range, unit)}</span>
  );
}
