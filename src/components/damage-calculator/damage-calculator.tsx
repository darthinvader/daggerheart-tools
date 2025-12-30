import { Calculator } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DAMAGE_TYPES } from './constants';
import { DamageResultDisplay } from './damage-result-display';
import { calculateDamage } from './damage-utils';
import type {
  ArmorState,
  DamageResult,
  DamageType,
  HealthState,
} from './types';

interface DamageCalculatorProps {
  armor: ArmorState;
  health: HealthState;
  onApplyDamage?: (result: DamageResult) => void;
}

export function DamageCalculator({
  armor,
  health,
  onApplyDamage,
}: DamageCalculatorProps) {
  const [amount, setAmount] = useState(0);
  const [damageType, setDamageType] = useState<DamageType>('physical');
  const [ignoreArmor, setIgnoreArmor] = useState(false);
  const [result, setResult] = useState<DamageResult | null>(null);

  const handleCalculate = () => {
    const res = calculateDamage(
      { amount, type: damageType, ignoreArmor },
      armor,
      health
    );
    setResult(res);
  };

  const handleApply = () => {
    if (result) {
      onApplyDamage?.(result);
      setResult(null);
      setAmount(0);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Calculator className="h-5 w-5" />
        Damage Calculator
      </h3>

      {/* Current Status */}
      <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
        <div>
          HP: {health.current}/{health.max}
        </div>
        <div>
          Armor: {armor.current}/{armor.max}
        </div>
      </div>

      {/* Input Form */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="damage-amount">Damage Amount</Label>
          <Input
            id="damage-amount"
            type="number"
            min={0}
            value={amount}
            onChange={e =>
              setAmount(Math.max(0, parseInt(e.target.value) || 0))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Damage Type</Label>
          <Select
            value={damageType}
            onValueChange={v => setDamageType(v as DamageType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAMAGE_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2 pb-1">
          <Checkbox
            id="ignore-armor"
            checked={ignoreArmor}
            onCheckedChange={v => setIgnoreArmor(v === true)}
          />
          <Label htmlFor="ignore-armor" className="cursor-pointer text-sm">
            Ignore armor
          </Label>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        disabled={amount <= 0}
        className="w-full"
      >
        Calculate
      </Button>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <DamageResultDisplay result={result} thresholds={health.thresholds} />
          {onApplyDamage && (
            <Button
              onClick={handleApply}
              variant="destructive"
              className="w-full"
            >
              Apply Damage
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
