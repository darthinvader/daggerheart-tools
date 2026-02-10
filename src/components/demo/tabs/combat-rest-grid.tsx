import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import { RestModal } from '@/components/rest';
import type { RestResult } from '@/components/rest';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTierFromLevel } from '@/lib/character-stats-engine';

import type { DemoState } from '../demo-types';

interface RestGridProps {
  state: DemoState;
  onRest: (result: RestResult) => void;
}

export function RestGrid({ state, onRest }: RestGridProps) {
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const tier = getTierFromLevel(state.progression.currentLevel);
  const shortRestsToday = state.restState?.shortRestsToday ?? 0;

  return (
    <>
      <section className="bg-card hover:border-primary/20 max-w-md rounded-xl border shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Moon className="size-4" />
            <h3 className="font-semibold">Rest</h3>
          </div>
          <Button onClick={() => setIsRestModalOpen(true)} size="sm">
            Take a Rest
          </Button>
        </div>
        <div className="space-y-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sun className="size-3.5 text-amber-500" />
            <span className="text-sm">Short rests:</span>
            <Badge
              variant={shortRestsToday >= 3 ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {shortRestsToday}/3 available
            </Badge>
          </div>
          <div className="text-muted-foreground text-xs">
            <p>Short rest: 2 downtime moves, 1d4+Tier recovery.</p>
            <p>
              Long rest: 2 downtime moves, full recovery (resets short rests).
            </p>
          </div>
        </div>
      </section>

      <RestModal
        isOpen={isRestModalOpen}
        onClose={() => setIsRestModalOpen(false)}
        tier={tier}
        currentHp={state.resources.hp.current}
        maxHp={state.resources.hp.max}
        currentStress={state.resources.stress.current}
        maxStress={state.resources.stress.max}
        currentArmorMarked={
          state.resources.armorScore.max - state.resources.armorScore.current
        }
        totalArmorSlots={state.resources.armorScore.max}
        shortRestsToday={state.restState?.shortRestsToday}
        onRestComplete={result => {
          onRest(result);
          setIsRestModalOpen(false);
        }}
      />
    </>
  );
}
