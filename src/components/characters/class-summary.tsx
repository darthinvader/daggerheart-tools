import { FeatureBlock } from '@/components/characters/identity/feature-block';
import { Badge } from '@/components/ui/badge';
import { getClassByName, getSubclassByName } from '@/features/characters/logic';

export type ClassSummaryProps = {
  className?: string;
  subclass?: string;
  showStats?: boolean;
};

export function ClassSummary({
  className,
  subclass,
  showStats = true,
}: ClassSummaryProps) {
  const cls = className ? getClassByName(className) : undefined;
  const sub =
    className && subclass ? getSubclassByName(cls, subclass) : undefined;

  if (!className) {
    return <div className="text-muted-foreground text-sm">Pick a class</div>;
  }

  const domains = cls?.domains ?? [];
  const startingHP = cls?.startingHitPoints;
  const startingEvasion = cls?.startingEvasion;
  const hopeFeature = cls?.hopeFeature;
  const spellcastTrait = sub?.spellcastTrait;

  return (
    <div className="space-y-2 text-sm">
      <div className="space-y-0.5">
        <div className="font-medium">{className}</div>
        <div className="text-muted-foreground text-xs">
          {subclass ?? 'Select a subclass'}
        </div>
      </div>

      {spellcastTrait ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Spellcasting:</span>
          <Badge variant="secondary">{spellcastTrait}</Badge>
        </div>
      ) : null}

      {domains.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Domains:</span>
          {domains.map(d => (
            <Badge key={d} variant="outline">
              {d}
            </Badge>
          ))}
        </div>
      ) : null}

      {showStats ? (
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          <span>
            Starting HP:{' '}
            <span className="text-foreground font-medium">
              {startingHP ?? '—'}
            </span>
          </span>
          <span>
            Starting Evasion:{' '}
            <span className="text-foreground font-medium">
              {startingEvasion ?? '—'}
            </span>
          </span>
        </div>
      ) : null}

      {hopeFeature ? (
        <FeatureBlock
          label="Hope Feature"
          name={hopeFeature.name}
          description={hopeFeature.description}
        />
      ) : null}
    </div>
  );
}
