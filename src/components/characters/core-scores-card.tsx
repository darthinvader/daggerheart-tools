import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ThresholdsInline } from './thresholds-inline';

export type CoreScores = {
  evasion: number;
  proficiency: number;
};

export type CoreScoresCardProps = {
  scores: CoreScores;
  updateEvasion: (delta: number) => void;
  updateProficiency: (delta: number) => void;
  id?: string;
  updateHp?: (delta: number) => void;
};

export function CoreScoresCard({
  scores,
  updateEvasion,
  updateProficiency,
  id,
  updateHp,
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
        {/* Damage thresholds: own line */}
        {id && updateHp && (
          <ThresholdsInline
            id={id}
            onDamage={delta => updateHp(delta)}
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}
