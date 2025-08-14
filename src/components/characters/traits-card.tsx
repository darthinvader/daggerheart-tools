import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      <CharacterCardHeader title="Traits" />
      <CardContent className="space-y-3">
        {Object.keys(traits).map(key => {
          const base = traits[key].value;
          return (
            <div
              key={key}
              className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-2 gap-y-1 text-sm"
            >
              <div className="col-start-1 row-start-1 truncate font-medium">
                {key}
              </div>
              <label className="text-muted-foreground col-start-1 row-start-2 inline-flex items-center gap-2 text-xs">
                <Checkbox
                  checked={traits[key].marked}
                  onCheckedChange={() => toggleMarked(key)}
                  aria-label={`Mark ${key}`}
                />
                Marked
              </label>
              <div className="col-start-2 row-span-2 flex items-center gap-1 self-center justify-self-end">
                <Button
                  aria-label={`Decrease ${key}`}
                  size="sm"
                  variant="outline"
                  onClick={() => incTrait(key, -1)}
                >
                  -
                </Button>
                <div
                  className="min-w-8 text-center tabular-nums"
                  aria-label={`${key} value`}
                >
                  {base}
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
          );
        })}
      </CardContent>
    </Card>
  );
}
