import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type LevelOptionRowProps = {
  optionKey: string;
  def: { cost: number; maxSelections: number };
  currentValue: number;
  alreadyTaken: number;
  remainingAllTime: number;
  gatedDisabled: boolean;
  isMulticlass: boolean;
  onChange: (value: number) => void;
};

export function LevelOptionRow({
  optionKey,
  def,
  currentValue,
  alreadyTaken,
  remainingAllTime,
  gatedDisabled,
  isMulticlass,
  onChange,
}: LevelOptionRowProps) {
  const atMax = currentValue >= remainingAllTime;
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <div className="text-sm font-medium">{optionKey}</div>
        <div className="text-muted-foreground text-xs">
          Cost {def.cost}, up to {def.maxSelections} • Taken {alreadyTaken} •
          Remaining {remainingAllTime}
        </div>
        {atMax && (
          <div className="text-muted-foreground text-xs">
            Max selections reached
          </div>
        )}
        {gatedDisabled && (
          <div className="text-muted-foreground text-xs">
            {isMulticlass
              ? 'Disabled: you have already upgraded subclass in this tier or multiclassed previously.'
              : 'Disabled: you chose multiclass in this tier.'}
          </div>
        )}
        {optionKey.startsWith('Increase your Proficiency') && (
          <div className="text-muted-foreground text-xs">
            Uses both points this level; also increase weapon damage dice by 1.
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={String(currentValue)}
          onValueChange={val => {
            const next = Math.max(
              0,
              Math.min(Number(val) || 0, remainingAllTime)
            );
            const safeVal = Math.min(next, remainingAllTime);
            onChange(safeVal);
          }}
          disabled={gatedDisabled}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="0" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: Math.max(0, remainingAllTime) + 1 },
              (_, i) => i
            ).map(n => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
