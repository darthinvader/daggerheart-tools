import { CharacteristicsIcon } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from '@/lib/icons';
import { cn } from '@/lib/utils';

// Predefined physical characteristics from official ancestries
const PHYSICAL_CHARACTERISTIC_SUGGESTIONS = [
  'Pointed ears',
  'Thick protective scales',
  'Luminous eyes',
  'Sharp claws',
  'Natural camouflage',
  'Bioluminescent markings',
  'Thick fur or hair',
  'Horns or antlers',
  'Tail (prehensile or decorative)',
  'Wings (functional or vestigial)',
  'Gills or aquatic features',
  'Elongated limbs',
  'Dense musculature',
  'Crystalline skin',
  'Elemental features',
  'Multiple arms',
  'Extra eyes',
  'Feathers',
  'Natural armor plating',
  'Retractable claws',
] as const;

interface HomebrewCharacteristicsFieldProps {
  characteristics: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}

export function HomebrewCharacteristicsField({
  characteristics,
  onAdd,
  onRemove,
}: HomebrewCharacteristicsFieldProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !characteristics.includes(value)) {
        onAdd(value);
        e.currentTarget.value = '';
      }
    }
  };

  const handleQuickAdd = (trait: string) => {
    if (!characteristics.includes(trait)) {
      onAdd(trait);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
      <Label className="flex items-center gap-2">
        <CharacteristicsIcon />
        Physical Characteristics
      </Label>

      {/* Quick-add suggestions */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs">Quick add suggestions:</p>
        <div className="flex flex-wrap gap-1">
          {PHYSICAL_CHARACTERISTIC_SUGGESTIONS.filter(
            trait => !characteristics.includes(trait)
          )
            .slice(0, 12)
            .map(trait => (
              <Button
                key={trait}
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  'h-7 text-xs',
                  'border-cyan-500/30 hover:bg-cyan-500/20'
                )}
                onClick={() => handleQuickAdd(trait)}
              >
                + {trait}
              </Button>
            ))}
        </div>
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom characteristic..."
          onKeyDown={handleKeyDown}
          id="custom-characteristic"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            const input = document.getElementById(
              'custom-characteristic'
            ) as HTMLInputElement;
            if (
              input?.value.trim() &&
              !characteristics.includes(input.value.trim())
            ) {
              onAdd(input.value.trim());
              input.value = '';
            }
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Added characteristics */}
      {characteristics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {characteristics.map((char, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="flex items-center gap-1 bg-cyan-500/20"
            >
              {char}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="hover:bg-destructive/20 ml-1 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-muted-foreground text-sm">
        {characteristics.length} characteristic(s) added
      </p>
    </div>
  );
}
