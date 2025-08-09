import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type CoreScores = {
  evasion: number;
  hope: { current: number; max: number };
  proficiency: number;
};

export type CoreScoresCardProps = {
  scores: CoreScores;
  updateEvasion: (delta: number) => void;
  updateHope: (delta: number) => void;
  updateHopeMax: (delta: number) => void;
  updateProficiency: (delta: number) => void;
};

export function CoreScoresCard({
  scores,
  updateEvasion,
  updateHope,
  updateHopeMax,
  updateProficiency,
}: CoreScoresCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Evasion */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium">Evasion</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Decrease Evasion"
              size="sm"
              variant="outline"
              onClick={() => updateEvasion(-1)}
            >
              -
            </Button>
            <div className="min-w-12 text-center tabular-nums">
              {scores.evasion}
            </div>
            <Button
              aria-label="Increase Evasion"
              size="sm"
              variant="outline"
              onClick={() => updateEvasion(1)}
            >
              +
            </Button>
          </div>
        </div>
        {/* Hope */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium">Hope</div>
            <div className="text-muted-foreground text-xs">
              Max {scores.hope.max}
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
              {scores.hope.current}
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
        {/* Proficiency */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium">Proficiency</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Decrease Proficiency"
              size="sm"
              variant="outline"
              onClick={() => updateProficiency(-1)}
            >
              -
            </Button>
            <div className="min-w-12 text-center tabular-nums">
              {scores.proficiency}
            </div>
            <Button
              aria-label="Increase Proficiency"
              size="sm"
              variant="outline"
              onClick={() => updateProficiency(1)}
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
