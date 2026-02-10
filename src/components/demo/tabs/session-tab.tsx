import { Moon, Sparkles, Sun } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ActiveEffectsDisplay } from '@/components/active-effects';
import { CountdownTracker } from '@/components/countdown-tracker';
import { DeathMoveModal } from '@/components/death-move';
import { DowntimeMoves } from '@/components/downtime-moves';
import { GameActions } from '@/components/game-actions';
import { RestModal } from '@/components/rest';
import { SessionTracker } from '@/components/session-tracker';
import { Badge } from '@/components/ui/badge';
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
      <section className="game-card game-card-tier animate-fade-up">
        <div className="game-card-header">
          <h3>
            <Sparkles className="text-hope size-5" />
            Game Actions
          </h3>
        </div>
        <div className="game-card-body">
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
      <section className="game-card game-card-tier animate-fade-up stagger-1 max-w-md">
        <div className="game-card-header">
          <h3>
            <Moon className="text-fear size-4" />
            Rest
          </h3>
          <Button onClick={() => setIsRestModalOpen(true)} size="sm">
            Take a Rest
          </Button>
        </div>
        <div className="game-card-body space-y-2">
          <div className="flex items-center gap-2">
            <Sun className="size-3.5 text-amber-500" />
            <span className="text-sm">Short rests:</span>
            <Badge
              variant={
                (state.restState?.shortRestsToday ?? 0) >= 3
                  ? 'destructive'
                  : 'secondary'
              }
              className="text-xs"
            >
              {state.restState?.shortRestsToday ?? 0}/3 available
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
          handleRest(result);
          setIsRestModalOpen(false);
        }}
      />

      {/* Active Effects Section */}
      <div className="animate-fade-up stagger-2">
        <ActiveEffectsDisplay
          effects={activeEffects}
          onChange={onActiveEffectsChange}
          onClearAll={() => onActiveEffectsChange([])}
        />
      </div>

      <div className="animate-fade-up stagger-3 grid gap-4 sm:gap-6 md:grid-cols-2">
        <DowntimeMoves
          activities={state.downtimeActivities}
          onChange={handlers.setDowntimeActivities}
        />
        <CountdownTracker
          countdowns={state.countdowns}
          onChange={handlers.setCountdowns}
        />
      </div>

      <div className="animate-fade-up stagger-4 grid gap-4 sm:gap-6 md:grid-cols-2">
        <SessionTracker
          sessions={state.sessions}
          currentSessionId={state.currentSessionId}
          onChange={handlers.setSessions}
        />
      </div>
    </div>
  );
}
