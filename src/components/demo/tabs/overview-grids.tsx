import { useEffect, useMemo } from 'react';

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
import { computeAutoResources } from '@/components/resources/resources-utils';
import { HopeWithScarsDisplay } from '@/components/scars';
import { ProgressionDisplay } from '@/components/shared/progression-display';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import { TraitsDisplay } from '@/components/traits';
import { getClassByName } from '@/lib/data/classes';

import { createDamageHandler } from '../demo-handlers';
import type { TabProps } from '../demo-types';

/**
 * Extract class HP and Evasion from class selection
 */
function getClassStats(classSelection: TabProps['state']['classSelection']) {
  if (!classSelection) return { hp: 6, evasion: 10 };

  if (classSelection.isHomebrew && classSelection.homebrewClass) {
    return {
      hp: classSelection.homebrewClass.startingHitPoints,
      evasion: classSelection.homebrewClass.startingEvasion,
    };
  }

  const gameClass = getClassByName(classSelection.className);
  return {
    hp: gameClass?.startingHitPoints ?? 6,
    evasion: gameClass?.startingEvasion ?? 10,
  };
}

/**
 * Extract armor stats from equipment
 */
function getArmorStats(equipment: TabProps['state']['equipment']) {
  const armor =
    equipment.armorMode === 'homebrew'
      ? equipment.homebrewArmor
      : equipment.armor;

  if (!armor) return { score: 0, evasionMod: 0, major: 5, severe: 11 };

  return {
    score: armor.baseScore ?? 0,
    evasionMod: armor.evasionModifier ?? 0,
    major: armor.baseThresholds?.major ?? 5,
    severe: armor.baseThresholds?.severe ?? 11,
  };
}

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

export function TraitsScoresGrid({ state, handlers, isHydrated }: TabProps) {
  const classStats = useMemo(
    () => getClassStats(state.classSelection),
    [state.classSelection]
  );
  const armorStats = useMemo(
    () => getArmorStats(state.equipment),
    [state.equipment]
  );

  const resourcesAutoContext = useMemo(
    () => ({
      classHp: classStats.hp,
      classEvasion: classStats.evasion,
      classTier: Math.ceil(state.progression.currentLevel / 3),
      armorScore: armorStats.score,
      armorEvasionModifier: armorStats.evasionMod,
      armorThresholdsMajor: armorStats.major,
      armorThresholdsSevere: armorStats.severe,
      level: state.progression.currentLevel,
    }),
    [classStats, armorStats, state.progression.currentLevel]
  );

  const autoValues = useMemo(
    () => computeAutoResources(resourcesAutoContext),
    [resourcesAutoContext]
  );

  // Auto-update HP when class or tier changes (if autoCalculateHp is enabled)
  // Only run after hydration is complete to prevent overwriting saved values
  useEffect(() => {
    if (!isHydrated) return;
    if (
      state.resources.autoCalculateHp === true &&
      state.resources.hp.max !== autoValues.maxHp
    ) {
      handlers.setResources({
        ...state.resources,
        hp: {
          current: Math.min(state.resources.hp.current, autoValues.maxHp),
          max: autoValues.maxHp,
        },
      });
    }
    // Run when auto values change (after hydration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, autoValues.maxHp, state.resources.hp.max]);

  // Auto-update Armor Score when armor changes (if autoCalculateArmorScore is enabled)
  useEffect(() => {
    if (!isHydrated) return;
    const isAutoArmor = state.resources.autoCalculateArmorScore === true;
    if (
      isAutoArmor &&
      state.resources.armorScore.max !== autoValues.armorScore
    ) {
      // Only update max, preserve current (clamped to new max)
      const newMax = autoValues.armorScore;
      const newCurrent = Math.min(state.resources.armorScore.current, newMax);
      handlers.setResources({
        ...state.resources,
        armorScore: {
          current: newCurrent,
          max: newMax,
        },
      });
    }
    // Run when auto values change (after hydration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, autoValues.armorScore, state.resources.armorScore.max]);

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

  const handleDamage = useMemo(
    () =>
      createDamageHandler({
        resources: state.resources,
        deathState: state.deathState,
        setResources: handlers.setResources,
        setDeathState: handlers.setDeathState,
      }),
    [state.resources, state.deathState, handlers]
  );

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      <TraitsDisplay traits={state.traits} onChange={handlers.setTraits} />
      <ResourcesDisplay
        resources={state.resources}
        onChange={handlers.setResources}
        autoContext={resourcesAutoContext}
        deathState={state.deathState}
        onTriggerDeathMove={handleTriggerDeathMove}
        onWakeUp={handleWakeUp}
        thresholds={{
          major: state.thresholds.values.major,
          severe: state.thresholds.values.severe,
          critical: state.thresholds.values.critical,
          enableCritical: state.thresholds.enableCritical,
        }}
        onApplyDamage={handleDamage}
      />
    </div>
  );
}

export function HopeScoresThresholdsGrid({
  state,
  handlers,
  isHydrated,
}: TabProps) {
  const classStats = useMemo(
    () => getClassStats(state.classSelection),
    [state.classSelection]
  );
  const armorStats = useMemo(
    () => getArmorStats(state.equipment),
    [state.equipment]
  );

  const coreScoresAutoContext = useMemo(
    () => ({
      classEvasion: classStats.evasion,
      armorEvasionModifier: armorStats.evasionMod,
    }),
    [classStats.evasion, armorStats.evasionMod]
  );

  const thresholdsAutoContext = useMemo(
    () => ({
      armorThresholdsMajor: armorStats.major,
      armorThresholdsSevere: armorStats.severe,
      level: state.progression.currentLevel,
    }),
    [armorStats.major, armorStats.severe, state.progression.currentLevel]
  );

  const autoEvasion = useMemo(
    () => classStats.evasion + armorStats.evasionMod,
    [classStats.evasion, armorStats.evasionMod]
  );

  const autoThresholdsMajor = useMemo(
    () => armorStats.major + Math.max(0, state.progression.currentLevel - 1),
    [armorStats.major, state.progression.currentLevel]
  );
  const autoThresholdsSevere = useMemo(
    () => armorStats.severe + Math.max(0, state.progression.currentLevel - 1),
    [armorStats.severe, state.progression.currentLevel]
  );

  // Auto-update Evasion when class or armor changes (if autoCalculateEvasion is enabled)
  // Only run after hydration is complete to prevent overwriting saved values
  useEffect(() => {
    if (!isHydrated) return;
    if (
      state.coreScores.autoCalculateEvasion === true &&
      state.coreScores.evasion !== autoEvasion
    ) {
      handlers.setCoreScores({
        ...state.coreScores,
        evasion: autoEvasion,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, autoEvasion, state.coreScores.evasion]);

  // Auto-update Thresholds when armor or level changes (if auto is enabled)
  // Only run after hydration is complete
  useEffect(() => {
    if (!isHydrated) return;
    const needsUpdate =
      state.thresholds.values.major !== autoThresholdsMajor ||
      state.thresholds.values.severe !== autoThresholdsSevere;
    if (state.thresholds.auto === true && needsUpdate) {
      handlers.setThresholds({
        ...state.thresholds,
        values: {
          ...state.thresholds.values,
          major: autoThresholdsMajor,
          severe: autoThresholdsSevere,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isHydrated,
    autoThresholdsMajor,
    autoThresholdsSevere,
    state.thresholds.values.major,
    state.thresholds.values.severe,
  ]);

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
        autoContext={coreScoresAutoContext}
      />
      <ThresholdsEditableSection
        settings={state.thresholds}
        onChange={handlers.setThresholds}
        autoContext={thresholdsAutoContext}
        baseHp={classStats.hp}
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
