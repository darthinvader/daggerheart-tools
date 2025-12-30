import { useMemo } from 'react';

import { CharacterNotesDisplay } from '@/components/character-notes';
import { DamageCalculator } from '@/components/damage-calculator';
import { DeathMoveModal } from '@/components/death-move';
import { DowntimeMoves } from '@/components/downtime-moves';
import { InventoryDisplay } from '@/components/inventory';
import { LoadoutDisplay } from '@/components/loadout-selector';
import { RestManagement } from '@/components/rest-management';
import { SessionTracker } from '@/components/session-tracker';

import { CompanionSection } from '../companion-section';
import { createDamageHandler, createRestHandler } from '../demo-handlers';
import type { TabProps } from '../demo-types';
import { useDeathMoveHandler } from '../use-death-move-handler';
import {
  AncestryClassGrid,
  ExperiencesEquipmentGrid,
  GoldConditionsGrid,
  HopeThresholdsGrid,
  IdentityProgressionGrid,
  TraitsScoresGrid,
} from './overview-grids';

export function OverviewTab({ state, handlers }: TabProps) {
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

  const handleDamage = useMemo(
    () =>
      createDamageHandler({
        resources: state.resources,
        deathState: state.deathState,
        setResources: handlers.setResources,
        setDeathState: handlers.setDeathState,
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

      <IdentityProgressionGrid state={state} handlers={handlers} />
      <AncestryClassGrid state={state} handlers={handlers} />
      <TraitsScoresGrid state={state} handlers={handlers} />
      <HopeThresholdsGrid state={state} handlers={handlers} />
      <GoldConditionsGrid state={state} handlers={handlers} />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <DamageCalculator
          armor={state.resources.armorScore}
          health={{
            current: state.resources.hp.current,
            max: state.resources.hp.max,
            thresholds: {
              minor: Math.floor(state.thresholds.values.major / 2),
              major: state.thresholds.values.major,
              severe: state.thresholds.values.severe,
            },
          }}
          onApplyDamage={handleDamage}
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
      </div>

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

      <CompanionSection
        isRanger={state.classSelection?.className === 'Ranger'}
        companionEnabled={state.companionEnabled}
        companion={state.companion}
        setCompanion={handlers.setCompanion}
        setCompanionEnabled={handlers.setCompanionEnabled}
      />

      <ExperiencesEquipmentGrid state={state} handlers={handlers} />

      <LoadoutDisplay
        selection={state.loadout}
        onChange={handlers.setLoadout}
        classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
        tier={state.progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
      />

      <InventoryDisplay
        inventory={state.inventory}
        onChange={handlers.setInventory}
      />

      <CharacterNotesDisplay notes={state.notes} onChange={handlers.setNotes} />
    </div>
  );
}
