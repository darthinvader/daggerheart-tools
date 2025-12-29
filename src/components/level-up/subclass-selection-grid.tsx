import { Badge } from '@/components/ui/badge';
import type { GameSubclass } from '@/lib/data/classes';
import { CLASS_BG_COLORS, CLASS_COLORS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

export type SubclassSelectionGridProps = {
  subclasses: GameSubclass[];
  selectedSubclass: GameSubclass | null;
  selectedClassName: string;
  onSelect: (subclass: GameSubclass) => void;
};

export function SubclassSelectionGrid({
  subclasses,
  selectedSubclass,
  selectedClassName,
  onSelect,
}: SubclassSelectionGridProps) {
  if (subclasses.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Subclass</label>
      <div className="grid gap-2">
        {subclasses.map(subclass => (
          <div
            key={subclass.name}
            className={cn(
              'cursor-pointer rounded-lg border p-3 transition-colors',
              selectedSubclass?.name === subclass.name
                ? `border-2 ${CLASS_BG_COLORS[selectedClassName] ?? 'border-primary bg-primary/10'}`
                : 'hover:bg-muted/50'
            )}
            onClick={() => onSelect(subclass)}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn('font-medium', CLASS_COLORS[selectedClassName])}
              >
                {subclass.name}
              </span>
              {'spellcastTrait' in subclass && (
                <Badge variant="outline" className="text-xs">
                  Spellcast: {String(subclass.spellcastTrait)}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {subclass.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
