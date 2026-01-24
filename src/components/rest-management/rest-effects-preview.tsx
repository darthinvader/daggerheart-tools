import { ArrowRight, Heart, Shield, Sparkles, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { RestEffects } from './types';

interface RestEffectsPreviewProps {
  effects: RestEffects;
  hopeSpent?: number;
}

export function RestEffectsPreview({
  effects,
  hopeSpent = 0,
}: RestEffectsPreviewProps) {
  const items = [
    {
      label: 'HP Recovered',
      value: effects.hpRecovered,
      icon: Heart,
      color: 'text-red-500',
      show: effects.hpRecovered > 0,
    },
    {
      label: 'Stress Cleared',
      value: effects.stressCleared,
      icon: Zap,
      color: 'text-amber-500',
      show: effects.stressCleared > 0,
    },
    {
      label: 'Hope Recovered',
      value: effects.hopeRecovered,
      icon: Sparkles,
      color: 'text-blue-500',
      show: effects.hopeRecovered > 0,
    },
    {
      label: 'Armor Repaired',
      value: effects.armorRepaired,
      icon: Shield,
      color: 'text-slate-500',
      show: effects.armorRepaired > 0,
    },
  ].filter(i => i.show);

  if (items.length === 0 && hopeSpent === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
        All resources at maximum - no recovery needed
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hopeSpent > 0 && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-blue-500" />
          Spending {hopeSpent} Hope
          <ArrowRight className="h-3 w-3" />
          {effects.hpRecovered} HP recovered
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <div
            key={item.label}
            className="bg-card flex items-center gap-2 rounded-lg border p-3"
          >
            <item.icon className={cn('h-5 w-5', item.color)} />
            <div>
              <div className="font-medium">+{item.value}</div>
              <div className="text-muted-foreground text-xs">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      {effects.downtime && (
        <div className="bg-primary/10 flex items-center gap-2 rounded-lg p-3 text-sm">
          <Sparkles className="size-4" />
          <span>
            You may perform <strong>downtime moves</strong> during this rest
          </span>
        </div>
      )}
    </div>
  );
}
