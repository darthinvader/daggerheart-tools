import * as React from 'react';

import { formatThresholdChip } from '@/features/characters/logic/thresholds-format';

export type ThresholdsSummaryProps = {
  major: React.ReactNode;
  severe: React.ReactNode;
  doubleSevere: React.ReactNode;
  showFour?: boolean;
  className?: string;
};

export function ThresholdsSummary({
  major,
  severe,
  doubleSevere,
  showFour = true,
  className,
}: ThresholdsSummaryProps) {
  return (
    <div
      className={[
        'text-muted-foreground -mt-1 flex flex-wrap items-center justify-center gap-2 pl-1 text-xs',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="bg-muted rounded px-1 py-0.5">1</span>
      <span className="rounded px-1 py-0.5">
        {formatThresholdChip('major', String(major))}
      </span>
      <span className="text-muted-foreground">|</span>
      <span className="bg-muted rounded px-1 py-0.5">2</span>
      <span className="rounded px-1 py-0.5">
        {formatThresholdChip('severe', String(severe))}
      </span>
      <span className="text-muted-foreground">|</span>
      <span className="bg-muted rounded px-1 py-0.5">3</span>
      <span className="rounded px-1 py-0.5" title="Major Damage threshold">
        {formatThresholdChip('ds', String(doubleSevere))}
      </span>
      <span className="text-muted-foreground">|</span>
      {showFour && <span className="bg-muted rounded px-1 py-0.5">4</span>}
    </div>
  );
}
