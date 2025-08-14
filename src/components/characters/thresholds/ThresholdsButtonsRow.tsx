// React import not necessary with automatic JSX runtime
import { Button } from '@/components/ui/button';
import { formatThresholdChip } from '@/features/characters/logic/thresholds-format';

export type ThresholdsButtonsRowProps = {
  used: { major: number; severe: number };
  dsUsed: number;
  enableCritical: boolean;
  onDamageClick: (label: 1 | 2 | 3 | 4) => void;
};

export function ThresholdsButtonsRow({
  used,
  dsUsed,
  enableCritical,
  onDamageClick,
}: ThresholdsButtonsRowProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
      <Button
        key={1}
        size="sm"
        className="h-7 bg-emerald-600 px-2 text-sm font-medium text-white hover:bg-emerald-600/90"
        variant="default"
        aria-label="Apply 1 HP damage (Minor)"
        onClick={() => onDamageClick(1)}
        title="Minor = 1 HP"
      >
        1
      </Button>
      <span className="text-xs" title="Major threshold">
        {formatThresholdChip('major', used.major)}
      </span>
      <Button
        key={2}
        size="sm"
        className="h-7 bg-blue-600 px-2 text-sm font-medium text-white hover:bg-blue-600/90"
        variant="default"
        aria-label="Apply 2 HP damage (Major)"
        onClick={() => onDamageClick(2)}
        title="Major = 2 HP"
      >
        2
      </Button>
      <span className="text-xs" title="Severe threshold">
        {formatThresholdChip('severe', used.severe)}
      </span>
      <Button
        key={3}
        size="sm"
        className="h-7 bg-amber-600 px-2 text-sm font-medium text-white hover:bg-amber-600/90"
        variant="default"
        aria-label="Apply 3 HP damage (Severe)"
        onClick={() => onDamageClick(3)}
        title="Severe = 3 HP"
      >
        3
      </Button>
      {enableCritical && (
        <>
          <span className="text-xs" title={'Major Damage threshold'}>
            {formatThresholdChip('ds', dsUsed)}
          </span>
          <Button
            size="sm"
            className="h-7 px-2 text-sm font-medium"
            variant="destructive"
            aria-label="Apply 4 HP damage (Major Damage)"
            onClick={() => onDamageClick(4)}
            title={`Major Damage at MD:${dsUsed} = 4 HP`}
          >
            4
          </Button>
        </>
      )}
    </div>
  );
}
