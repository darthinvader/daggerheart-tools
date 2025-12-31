import { Minus, Plus, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ArmorSacrificeInputProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function ArmorSacrificeInput({
  value,
  max,
  onChange,
}: ArmorSacrificeInputProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        <Shield className="size-4" />
        Sacrifice Armor Slots
      </Label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-8 text-center font-medium">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <Plus className="size-4" />
        </Button>
        <span className="text-muted-foreground text-xs">(-1 HP per slot)</span>
      </div>
    </div>
  );
}
