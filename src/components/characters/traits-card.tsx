import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export type TraitState = { value: number; marked: boolean };
export type Traits = Record<string, TraitState>;

export type TraitsCardProps = {
  traits: Traits;
  canIncrement: (key: string) => boolean;
  incTrait: (key: string, delta: 1 | -1) => void;
  toggleMarked: (key: string) => void;
};

export function TraitsCard({
  traits,
  canIncrement,
  incTrait,
  toggleMarked,
}: TraitsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.keys(traits).map(key => (
          <div key={key} className="flex items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">{key}</div>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox
                  checked={traits[key].marked}
                  onCheckedChange={() => toggleMarked(key)}
                  aria-label={`Mark ${key}`}
                />
                Marked
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label={`Decrease ${key}`}
                size="sm"
                variant="outline"
                onClick={() => incTrait(key, -1)}
              >
                -
              </Button>
              <div className="min-w-12 text-center tabular-nums">
                {traits[key].value}
              </div>
              <Button
                aria-label={`Increase ${key}`}
                size="sm"
                variant="outline"
                onClick={() => canIncrement(key) && incTrait(key, 1)}
                disabled={!canIncrement(key)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
