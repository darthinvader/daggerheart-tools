import { AncestryDisplay } from '@/components/ancestry-selector';
import { ClassDisplay } from '@/components/class-selector';
import { CommunityDisplay } from '@/components/community-selector';
import { ConditionsDisplay } from '@/components/conditions';
import { CoreScoresDisplay } from '@/components/core-scores';
import { EquipmentDisplay } from '@/components/equipment';
import { ExperiencesDisplay } from '@/components/experiences';
import { GoldDisplay } from '@/components/gold';
import { IdentityDisplay } from '@/components/identity-editor';
import { ResourcesDisplay } from '@/components/resources';
import { HopeWithScarsDisplay } from '@/components/scars';
import { ProgressionDisplay } from '@/components/shared/progression-display';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import { TraitsDisplay } from '@/components/traits';

import type { TabProps } from '../demo-types';

export function IdentityProgressionGrid({ state, handlers }: TabProps) {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      <IdentityDisplay
        identity={state.identity}
        onChange={handlers.setIdentity}
      />
      <ProgressionDisplay
        progression={state.progression}
        onChange={handlers.setProgression}
        onLevelUp={handlers.onLevelUp}
      />
    </div>
  );
}

export function AncestryClassGrid({ state, handlers }: TabProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      <AncestryDisplay
        selection={state.ancestry}
        onChange={handlers.setAncestry}
      />
      <CommunityDisplay
        selection={state.community}
        onChange={handlers.setCommunity}
      />
      <ClassDisplay
        selection={state.classSelection}
        onChange={handlers.setClassSelection}
        unlockedSubclassFeatures={state.unlockedSubclassFeatures}
      />
    </div>
  );
}

export function TraitsScoresGrid({ state, handlers }: TabProps) {
  const handleTriggerDeathMove = () => {
    handlers.setDeathState({
      ...state.deathState,
      deathMovePending: true,
    });
  };

  const handleWakeUp = () => {
    handlers.setDeathState({
      ...state.deathState,
      isUnconscious: false,
    });
  };

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      <TraitsDisplay traits={state.traits} onChange={handlers.setTraits} />
      <ResourcesDisplay
        resources={state.resources}
        onChange={handlers.setResources}
        deathState={state.deathState}
        onTriggerDeathMove={handleTriggerDeathMove}
        onWakeUp={handleWakeUp}
      />
    </div>
  );
}

export function HopeScoresThresholdsGrid({ state, handlers }: TabProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      <HopeWithScarsDisplay
        state={state.hopeWithScars}
        onChange={handlers.setHopeWithScars}
        bonusHopeSlots={state.companion?.training.lightInTheDark ? 1 : 0}
      />
      <CoreScoresDisplay
        scores={state.coreScores}
        onChange={handlers.setCoreScores}
      />
      <ThresholdsEditableSection
        settings={state.thresholds}
        onChange={handlers.setThresholds}
        baseHp={6}
      />
    </div>
  );
}

export function GoldConditionsGrid({ state, handlers }: TabProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
      <GoldDisplay gold={state.gold} onChange={handlers.setGold} />
      <ConditionsDisplay
        conditions={state.conditions}
        onChange={handlers.setConditions}
      />
    </div>
  );
}

export function ExperiencesEquipmentGrid({ state, handlers }: TabProps) {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      <ExperiencesDisplay
        experiences={state.experiences}
        onChange={handlers.setExperiences}
      />
      <EquipmentDisplay
        equipment={state.equipment}
        onChange={handlers.setEquipment}
        hideDialogHeader
        className="md:col-span-2"
      />
    </div>
  );
}
