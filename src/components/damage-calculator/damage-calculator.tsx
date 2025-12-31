import { Minus, Plus, Shield } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { DamageResultDisplay } from './damage-result-display';
import { calculateDamage } from './damage-utils';
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

  // Max armor that can be sacrificed is the lower of current armor and what would reduce HP to 0
  const maxArmorSacrifice = armor.current;

  return (
    <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📈</span>
          <h3 className="text-lg font-semibold">Damage Calculator</h3>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {/* Current Status */}
        <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
          <div>
            HP: {health.current}/{health.max}
          </div>
          <div>
            Armor: {armor.current}/{armor.max}
          </div>
        </div>

        {/* Thresholds Display */}
        <div className="bg-muted/50 flex flex-wrap gap-3 rounded-lg p-3 text-sm">
          <div>
            <span className="text-muted-foreground">Major:</span>{' '}
            <span className="font-medium">{health.thresholds.major}+</span>
          </div>
          <div>
            <span className="text-muted-foreground">Severe:</span>{' '}
            <span className="font-medium">{health.thresholds.severe}+</span>
          </div>
          {health.enableCritical && health.thresholds.critical && (
            <div>
              <span className="text-muted-foreground">Critical:</span>{' '}
              <span className="font-medium">{health.thresholds.critical}+</span>
            </div>
          )}
        </div>

        {/* Input Form */}
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

          {/* Armor Sacrifice */}
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
                onClick={() =>
                  setArmorSlotsSacrificed(Math.max(0, armorSlotsSacrificed - 1))
                }
                disabled={armorSlotsSacrificed <= 0}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {armorSlotsSacrificed}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() =>
                  setArmorSlotsSacrificed(
                    Math.min(maxArmorSacrifice, armorSlotsSacrificed + 1)
                  )
                }
                disabled={armorSlotsSacrificed >= maxArmorSacrifice}
              >
                <Plus className="size-4" />
              </Button>
              <span className="text-muted-foreground text-xs">
                (-1 HP per slot)
              </span>
            </div>
          </div>
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
