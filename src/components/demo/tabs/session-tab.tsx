import { useMemo } from 'react';

import { CompanionDisplay } from '@/components/companion';
import { DeathMoveModal } from '@/components/death-move';
import { DowntimeMoves } from '@/components/downtime-moves';
import { RestManagement } from '@/components/rest-management';
import { SessionTracker } from '@/components/session-tracker';

import { createRestHandler } from '../demo-handlers';
import type { TabProps } from '../demo-types';
import { useDeathMoveHandler } from '../use-death-move-handler';

export function SessionTab({ state, handlers }: TabProps) {
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

      <RestManagement
        restState={state.restState}
        resources={{
          hope: {
            current: state.hopeWithScars.current,
            max: state.hopeWithScars.max,
          },
          stress: state.resources.stress,
          hp: state.resources.hp,
          armor: state.resources.armorScore,
        }}
        onRest={handleRest}
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

      {state.classSelection?.className === 'Ranger' && (
        <CompanionDisplay
          companion={state.companion}
          onChange={handlers.setCompanion}
        />
      )}
    </div>
  );
}
