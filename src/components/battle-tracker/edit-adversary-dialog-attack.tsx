import { RotateCcw, Swords } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdversaryAttackEditor({
  attackName,
  attackModifier,
  attackRange,
  attackDamage,
  isModified,
  onNameChange,
  onModifierChange,
  onRangeChange,
  onDamageChange,
  onReset,
}: {
  attackName: string;
  attackModifier: string;
  attackRange: string;
  attackDamage: string;
  isModified: boolean;
  onNameChange: (value: string) => void;
  onModifierChange: (value: string) => void;
  onRangeChange: (value: string) => void;
  onDamageChange: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Swords className="size-4 text-red-500" />
          Attack
        </Label>
        {isModified && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={onReset}
          >
            <RotateCcw className="mr-1 size-3" />
            Reset
          </Button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Name</Label>
          <Input
            value={attackName}
            onChange={event => onNameChange(event.target.value)}
            placeholder="Attack name"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Modifier</Label>
          <Input
            value={attackModifier}
            onChange={event => onModifierChange(event.target.value)}
            placeholder="+5"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Range</Label>
          <Input
            value={attackRange}
            onChange={event => onRangeChange(event.target.value)}
            placeholder="Melee / Very Close"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Damage</Label>
          <Input
            value={attackDamage}
            onChange={event => onDamageChange(event.target.value)}
            placeholder="2d6+3"
          />
        </div>
      </div>
    </div>
  );
}
