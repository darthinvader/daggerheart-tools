import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type Score = { current: number; max: number };

export type ResourcesCardProps = {
  id?: string;
  resources: { hp: Score; stress: Score; hope: Score };
  updateHp: (delta: number) => void;
  updateHpMax: (delta: number) => void;
  updateStress: (delta: number) => void;
  updateStressMax: (delta: number) => void;
  updateHope: (delta: number) => void;
  updateHopeMax: (delta: number) => void;
};

export function ResourcesCard({
  id,
  resources,
  updateHp,
  updateHpMax,
  updateStress,
  updateStressMax,
  updateHope,
  updateHopeMax,
}: ResourcesCardProps) {
  // NOTE: Placeholder thresholds. REVIEW: incorporate armor/equipment modifiers when model is available.
  const majorHp = Math.max(0, Math.floor(resources.hp.max / 2));
  const severeHp = Math.max(0, Math.floor(resources.hp.max / 4));
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* HP Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium">HP</div>
            <div className="text-muted-foreground text-xs">
              Max {resources.hp.max}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Decrease HP"
              size="sm"
              variant="outline"
              onClick={() => updateHp(-1)}
            >
              -
            </Button>
            <div className="min-w-12 text-center tabular-nums">
              {resources.hp.current}
            </div>
            <Button
              aria-label="Increase HP"
              size="sm"
              variant="outline"
              onClick={() => updateHp(1)}
            >
              +
            </Button>
            <div className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
              <Button
                aria-label="Decrease HP max"
                size="icon"
                variant="ghost"
                onClick={() => updateHpMax(-1)}
              >
                -
              </Button>
              <span>max</span>
              <Button
                aria-label="Increase HP max"
                size="icon"
                variant="ghost"
                onClick={() => updateHpMax(1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        {/* HP Thresholds (read-only, computed) */}
        <div className="text-muted-foreground -mt-1 flex flex-wrap items-center gap-1 pl-1 text-[11px]">
          <span className="bg-muted rounded px-1 py-0.5">
            Major ≤ {majorHp}
          </span>
          <span className="bg-muted rounded px-1 py-0.5">
            Severe ≤ {severeHp}
          </span>
          <span className="pl-1">*</span>
        </div>
        {/* Stress Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium">Stress</div>
            <div className="text-muted-foreground text-xs">
              Max {resources.stress.max}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Decrease Stress"
              size="sm"
              variant="outline"
              onClick={() => updateStress(-1)}
            >
              -
            </Button>
            <div className="min-w-12 text-center tabular-nums">
              {resources.stress.current}
            </div>
            <Button
              aria-label="Increase Stress"
              size="sm"
              variant="outline"
              onClick={() => updateStress(1)}
            >
              +
            </Button>
            <div className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
              <Button
                aria-label="Decrease Stress max"
                size="icon"
                variant="ghost"
                onClick={() => updateStressMax(-1)}
              >
                -
              </Button>
              <span>max</span>
              <Button
                aria-label="Increase Stress max"
                size="icon"
                variant="ghost"
                onClick={() => updateStressMax(1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Hope Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium">Hope</div>
            <div className="text-muted-foreground text-xs">
              Max {resources.hope.max}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Decrease Hope"
              size="sm"
              variant="outline"
              onClick={() => updateHope(-1)}
            >
              -
            </Button>
            <div className="min-w-12 text-center tabular-nums">
              {resources.hope.current}
            </div>
            <Button
              aria-label="Increase Hope"
              size="sm"
              variant="outline"
              onClick={() => updateHope(1)}
            >
              +
            </Button>
            <div className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
              <Button
                aria-label="Decrease Hope max"
                size="icon"
                variant="ghost"
                onClick={() => updateHopeMax(-1)}
              >
                -
              </Button>
              <span>max</span>
              <Button
                aria-label="Increase Hope max"
                size="icon"
                variant="ghost"
                onClick={() => updateHopeMax(1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
