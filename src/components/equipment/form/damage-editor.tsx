import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DAMAGE_TYPES, DICE_TYPES } from '../constants';

interface DamageData {
  count: number;
  diceType: number;
  modifier: number;
  type: string;
}

interface DamageEditorProps {
  damage: DamageData;
  onChange: (damage: DamageData) => void;
}

export function DamageEditor({ damage, onChange }: DamageEditorProps) {
  const handleChange = (field: keyof DamageData, value: number | string) => {
    onChange({ ...damage, [field]: value });
  };

  return (
    <div className="space-y-2">
      <Label>Damage</Label>
      <div className="flex flex-wrap gap-2">
        <Select
          value={String(damage.count)}
          onValueChange={v => handleChange('count', Number(v))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3].map(n => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex items-center text-lg font-bold">d</span>
        <Select
          value={String(damage.diceType)}
          onValueChange={v => handleChange('diceType', Number(v))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DICE_TYPES.map(d => (
              <SelectItem key={d} value={String(d)}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex items-center text-lg font-bold">+</span>
        <Input
          type="number"
          className="w-20"
          value={damage.modifier}
          onChange={e => handleChange('modifier', Number(e.target.value))}
        />
        <Select
          value={damage.type}
          onValueChange={v => handleChange('type', v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAMAGE_TYPES.map(dt => (
              <SelectItem key={dt.value} value={dt.value}>
                {dt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
