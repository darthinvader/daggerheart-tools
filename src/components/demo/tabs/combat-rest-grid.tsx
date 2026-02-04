import { Moon } from 'lucide-react';
import { useState } from 'react';

import { RestModal } from '@/components/rest';
import type { RestResult } from '@/components/rest';
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

  return (
    <>
      <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Moon className="size-5" />
            <h3 className="text-lg font-semibold">Rest</h3>
          </div>
          <Button onClick={() => setIsRestModalOpen(true)}>Take a Rest</Button>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-muted-foreground text-sm">
            <p>Short rests allow 2 downtime moves with 1d4+Tier recovery.</p>
            <p>Long rests allow 2 downtime moves with full recovery.</p>
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
