import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type ConditionsCardProps = {
  conditions: string[];
  addCondition: (label: string) => void;
  removeCondition: (label: string) => void;
};

export function ConditionsCard({
  conditions,
  addCondition,
  removeCondition,
}: ConditionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {conditions.length === 0 ? (
            <span className="text-muted-foreground text-sm">None</span>
          ) : (
            conditions.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => removeCondition(c)}
                className="bg-accent text-accent-foreground hover:bg-accent/80 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                title="Remove"
              >
                {c}
                <span aria-hidden>×</span>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add condition (e.g., Frightened, Prone)"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                addCondition(target.value);
                target.value = '';
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>(
                'input[placeholder^="Add condition"]'
              );
              if (!el) return;
              addCondition(el.value);
              el.value = '';
            }}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
