import { useMemo } from 'react';

import { CharacterNotesDisplay } from '@/components/character-notes';
import { CountdownTracker } from '@/components/countdown-tracker';
import { DeathMoveModal } from '@/components/death-move';
import { DowntimeMoves } from '@/components/downtime-moves';
import { InventoryDisplay } from '@/components/inventory';
import { LoadoutDisplay } from '@/components/loadout-selector';
import { SessionTracker } from '@/components/session-tracker';
import { getSubclassByName } from '@/lib/data/classes';

import { CompanionSection } from '../companion-section';
import { createRestHandler } from '../demo-handlers';
import type { TabProps } from '../demo-types';
import { useDeathMoveHandler } from '../use-death-move-handler';
import { RestGrid } from './combat-rest-grid';
import {
  AncestryClassGrid,
  ExperiencesEquipmentGrid,
  GoldConditionsGrid,
  HopeScoresThresholdsGrid,
  IdentityProgressionGrid,
  TraitsScoresGrid,
} from './overview-grids';

export function OverviewTab({ state, handlers, isHydrated }: TabProps) {
  const hasCompanionFeature = useMemo(() => {
    const hasCompanionFlag = (
      value: unknown
    ): value is { companion?: boolean } =>
      Boolean(value && typeof value === 'object' && 'companion' in value);
    const selection = state.classSelection;
    if (!selection?.className || !selection?.subclassName) return false;
    if (selection.isHomebrew && selection.homebrewClass) {
      const homebrewSubclass = selection.homebrewClass.subclasses.find(
        s => s.name === selection.subclassName
      );
      return Boolean(homebrewSubclass?.companion);
    }
    const subclass = getSubclassByName(
      selection.className,
      selection.subclassName
    );
    return hasCompanionFlag(subclass) && Boolean(subclass.companion);
  }, [state.classSelection]);

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

      <IdentityProgressionGrid state={state} handlers={handlers} />
      <AncestryClassGrid state={state} handlers={handlers} />
      <TraitsScoresGrid
        state={state}
        handlers={handlers}
        isHydrated={isHydrated}
      />
      <HopeScoresThresholdsGrid
        state={state}
        handlers={handlers}
        isHydrated={isHydrated}
      />
      <GoldConditionsGrid state={state} handlers={handlers} />

      <CompanionSection
        hasCompanionFeature={hasCompanionFeature}
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

      <div className="grid gap-4 sm:gap-6 md:h-112 md:grid-cols-2">
        <DowntimeMoves
          activities={state.downtimeActivities}
          onChange={handlers.setDowntimeActivities}
        />
        <CountdownTracker
          countdowns={state.countdowns}
          onChange={handlers.setCountdowns}
        />
      </div>

      <RestGrid state={state} onRest={handleRest} />

      <div className="grid gap-4 sm:gap-6 md:h-112 md:grid-cols-2">
        <SessionTracker
          sessions={state.sessions}
          currentSessionId={state.currentSessionId}
          onChange={handlers.setSessions}
        />
        <CharacterNotesDisplay
          notes={state.notes}
          onChange={handlers.setNotes}
        />
      </div>
    </div>
  );
}
