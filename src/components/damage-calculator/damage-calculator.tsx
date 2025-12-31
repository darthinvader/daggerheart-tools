import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArmorSacrificeInput } from './armor-sacrifice-input';
import { DamageResultDisplay } from './damage-result-display';
import { calculateDamage } from './damage-utils';
import { ThresholdsPreview } from './thresholds-preview';
import type { ArmorState, DamageResult, HealthState } from './types';

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
  const [armorSlotsSacrificed, setArmorSlotsSacrificed] = useState(0);
  const [result, setResult] = useState<DamageResult | null>(null);

  const handleCalculate = () => {
    const res = calculateDamage(
      { amount, type: 'physical', ignoreArmor: false, armorSlotsSacrificed },
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
      setArmorSlotsSacrificed(0);
    }
  };

  return (
    <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📈</span>
          <h3 className="text-lg font-semibold">Damage Calculator</h3>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
          <div>
            HP: {health.current}/{health.max}
          </div>
          <div>
            Armor: {armor.current}/{armor.max}
          </div>
        </div>

        <ThresholdsPreview
          major={health.thresholds.major}
          severe={health.thresholds.severe}
          critical={health.thresholds.critical}
          enableCritical={health.enableCritical}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="damage-amount">Damage Taken</Label>
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
          <ArmorSacrificeInput
            value={armorSlotsSacrificed}
            max={armor.current}
            onChange={setArmorSlotsSacrificed}
          />
        </div>

        <Button
          onClick={handleCalculate}
          disabled={amount <= 0}
          className="w-full"
        >
          Calculate
        </Button>

        {result && (
          <div className="space-y-4">
            <DamageResultDisplay
              result={result}
              thresholds={health.thresholds}
            />
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
    </section>
  );
}
