import { Moon, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ActiveEffectsDisplay } from '@/components/active-effects';
import { DeathMoveModal } from '@/components/death-move';
import { DowntimeMoves } from '@/components/downtime-moves';
import { GameActions } from '@/components/game-actions';
import { RestModal } from '@/components/rest';
import { SessionTracker } from '@/components/session-tracker';
import { Button } from '@/components/ui/button';
import { getTierFromLevel } from '@/lib/character-stats-engine';
import type { ActiveEffect } from '@/lib/schemas/equipment';

import { createRestHandler } from '../demo-handlers';
import type { TabProps } from '../demo-types';
import { useDeathMoveHandler } from '../use-death-move-handler';

interface SessionTabProps extends TabProps {
  activeEffects: ActiveEffect[];
  onActiveEffectsChange: (effects: ActiveEffect[]) => void;
}

export function SessionTab({
  state,
  handlers,
  activeEffects,
  onActiveEffectsChange,
}: SessionTabProps) {
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);

  const handleRest = useMemo(
    () =>
      createRestHandler({
        resources: state.resources,
        hopeWithScars: state.hopeWithScars,
        companion: state.companion,
        restState: state.restState,
        setResources: handlers.setResources,
        setHopeWithScars: handlers.setHopeWithScars,
        setCompanion: handlers.setCompanion,
        setRestState: handlers.setRestState,
      }),
    [state, handlers]
  );

  const handleExecuteDeathMove = useDeathMoveHandler({
    deathState: state.deathState,
    resources: state.resources,
    progressionLevel: state.progression.currentLevel,
    setDeathState: handlers.setDeathState,
    setResources: prev => handlers.setResources(prev(state.resources)),
  });

  const tier = getTierFromLevel(state.progression.currentLevel);

  return (
    <div className="space-y-6 pt-4">
      <DeathMoveModal
        isOpen={state.deathState.deathMovePending}
        onClose={() =>
          handlers.setDeathState({
            ...state.deathState,
            deathMovePending: false,
          })
        }
        characterLevel={state.progression.currentLevel}
        characterName={state.identity.name}
        onExecuteMove={handleExecuteDeathMove}
      />

      {/* Game Actions Section */}
      <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <h3 className="text-lg font-semibold">Game Actions</h3>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <GameActions
            state={{
              currentStress: state.resources.stress.current,
              maxStress: state.resources.stress.max,
              currentHope: state.hopeWithScars.current,
              tagTeamUsedThisSession:
                state.restState?.tagTeamUsedThisSession ?? false,
            }}
            callbacks={{
              onStressChange: newStress => {
                handlers.setResources({
                  ...state.resources,
                  stress: { ...state.resources.stress, current: newStress },
                });
              },
              onHopeChange: newHope => {
                handlers.setHopeWithScars({
                  ...state.hopeWithScars,
                  current: newHope,
                });
              },
              onTagTeamUsed: () => {
                handlers.setRestState({
                  ...state.restState,
                  tagTeamUsedThisSession: true,
                });
              },
            }}
          />
          <div className="text-muted-foreground mt-3 text-xs">
            <p>Critical Success: Clear 1 Stress when you roll matching dice.</p>
            <p>
              Tag Team: Spend 3 Hope to roll with another PC (once per session).
            </p>
          </div>
        </div>
      </section>

      {/* Rest Management Section */}
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
          handleRest(result);
          setIsRestModalOpen(false);
        }}
      />

      {/* Active Effects Section */}
      <ActiveEffectsDisplay
        effects={activeEffects}
        onChange={onActiveEffectsChange}
        onClearAll={() => onActiveEffectsChange([])}
      />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <DowntimeMoves
          activities={state.downtimeActivities}
          onChange={handlers.setDowntimeActivities}
        />
        <SessionTracker
          sessions={state.sessions}
          currentSessionId={state.currentSessionId}
          onChange={handlers.setSessions}
        />
      </div>
    </div>
  );
}
