// JSX runtime handles React import
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DEFAULT_CONDITIONS } from '@/features/characters/data/conditions';

export type ConditionsCardProps = {
  conditions: { name: string; description?: string }[];
  addCondition: (label: string, description?: string) => void;
  removeCondition: (label: string) => void;
};

export function ConditionsCard({
  conditions,
  addCondition,
  removeCondition,
}: ConditionsCardProps) {
  // no-op
  return (
    <Card>
      <CharacterCardHeader title="Conditions" />
      <CardContent className="space-y-4">
        {/* Active conditions */}
        <div className="flex flex-wrap gap-2">
          {conditions.length === 0 ? (
            <span className="text-muted-foreground text-sm">None</span>
          ) : (
            conditions.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => removeCondition(c.name)}
                className="bg-accent text-accent-foreground hover:bg-accent/80 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                title={c.description ? `${c.name}: ${c.description}` : 'Remove'}
              >
                {c.name}
                <span aria-hidden>×</span>
              </button>
            ))
          )}
        </div>

        {/* Quick add row */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add condition by name"
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
            size="sm"
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>(
                'input[placeholder="Add condition by name"]'
              );
              if (!el) return;
              addCondition(el.value);
              el.value = '';
            }}
          >
            Add
          </Button>
        </div>

        {/* Default list (dropdown) */}
        <Accordion type="single" collapsible>
          <AccordionItem value="defaults">
            <AccordionTrigger>
              <span className="text-sm">Default conditions</span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="divide-border rounded-md border">
                {DEFAULT_CONDITIONS.map(c => (
                  <li
                    key={c.name}
                    className="hover:bg-muted/40 flex items-start justify-between gap-3 p-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {c.description}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addCondition(c.name, c.description)}
                    >
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
