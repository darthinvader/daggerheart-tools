import { useEffect, useMemo, useRef } from 'react';

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
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';

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

interface AutoUpdateConfig {
  isHydrated: boolean | undefined;
  autoValues: ReturnType<typeof computeAutoResources>;
  state: TabProps['state'];
  handlers: TabProps['handlers'];
}

/**
 * Hook to auto-update HP and Armor Score when auto-calculate is enabled.
 * Uses refs to access latest state while keeping effect deps minimal.
 */
function useAutoUpdateResources({
  isHydrated,
  autoValues,
  state,
  handlers,
}: AutoUpdateConfig) {
  const stateRef = useRef(state);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    stateRef.current = state;
    handlersRef.current = handlers;
  });

  // Extract primitives for stable deps
  const autoMaxHp = autoValues.maxHp;
  const hpMax = state.resources.hp.max;
  const autoArmorScore = autoValues.armorScore;
  const armorMax = state.resources.armorScore.max;

  useEffect(() => {
    if (!isHydrated) return;
    const { resources } = stateRef.current;
    if (resources.autoCalculateHp === true && resources.hp.max !== autoMaxHp) {
      handlersRef.current.setResources({
        ...resources,
        hp: {
          current: Math.min(resources.hp.current, autoMaxHp),
          max: autoMaxHp,
        },
      });
    }
  }, [isHydrated, autoMaxHp, hpMax]);

  useEffect(() => {
    if (!isHydrated) return;
    const { resources } = stateRef.current;
    const isAutoArmor = resources.autoCalculateArmorScore === true;
    if (isAutoArmor && resources.armorScore.max !== autoArmorScore) {
      const newMax = autoArmorScore;
      const newCurrent = Math.min(resources.armorScore.current, newMax);
      handlersRef.current.setResources({
        ...resources,
        armorScore: { current: newCurrent, max: newMax },
      });
    }
  }, [isHydrated, autoArmorScore, armorMax]);
}

interface AutoUpdateScoresConfig {
  isHydrated: boolean | undefined;
  autoEvasion: number;
  autoThresholdsMajor: number;
  autoThresholdsSevere: number;
  state: TabProps['state'];
  handlers: TabProps['handlers'];
}

/**
 * Hook to auto-update Evasion and Thresholds when auto-calculate is enabled.
 */
function useAutoUpdateScores({
  isHydrated,
  autoEvasion,
  autoThresholdsMajor,
  autoThresholdsSevere,
  state,
  handlers,
}: AutoUpdateScoresConfig) {
  const stateRef = useRef(state);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    stateRef.current = state;
    handlersRef.current = handlers;
  });

  // Extract primitives for stable deps
  const evasion = state.coreScores.evasion;
  const thresholdMajor = state.thresholds.values.major;
  const thresholdSevere = state.thresholds.values.severe;

  useEffect(() => {
    if (!isHydrated) return;
    const { coreScores } = stateRef.current;
    if (
      coreScores.autoCalculateEvasion === true &&
      coreScores.evasion !== autoEvasion
    ) {
      handlersRef.current.setCoreScores({
        ...coreScores,
        evasion: autoEvasion,
      });
    }
  }, [isHydrated, autoEvasion, evasion]);

  useEffect(() => {
    if (!isHydrated) return;
    const { thresholds } = stateRef.current;
    const needsUpdate =
      thresholds.values.major !== autoThresholdsMajor ||
      thresholds.values.severe !== autoThresholdsSevere;
    if (thresholds.auto === true && needsUpdate) {
      handlersRef.current.setThresholds({
        ...thresholds,
        values: {
          ...thresholds.values,
          major: autoThresholdsMajor,
          severe: autoThresholdsSevere,
        },
      });
    }
  }, [
    isHydrated,
    autoThresholdsMajor,
    autoThresholdsSevere,
    thresholdMajor,
    thresholdSevere,
  ]);
}

export function IdentityProgressionGrid({ state, handlers }: TabProps) {
  return (
    <div className="grid gap-3 sm:gap-4 sm:gap-6 md:grid-cols-2">
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
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 sm:gap-6 lg:grid-cols-3">
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

  // Parse equipment features for stat modifiers (e.g., "Heavy: -1 to Evasion")
  const equipmentFeatureModifiers = useMemo(
    () => getEquipmentFeatureModifiers(state.equipment),
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
      equipmentFeatureModifiers: {
        evasion: equipmentFeatureModifiers.evasion,
        proficiency: equipmentFeatureModifiers.proficiency,
        armorScore: equipmentFeatureModifiers.armorScore,
        majorThreshold: equipmentFeatureModifiers.majorThreshold,
        severeThreshold: equipmentFeatureModifiers.severeThreshold,
      },
    }),
    [
      classStats,
      armorStats,
      state.progression.currentLevel,
      equipmentFeatureModifiers,
    ]
  );

  const autoValues = useMemo(
    () => computeAutoResources(resourcesAutoContext),
    [resourcesAutoContext]
  );

  // Auto-update HP and Armor Score when auto-calculate is enabled
  useAutoUpdateResources({ isHydrated, autoValues, state, handlers });

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
    <div className="grid gap-3 sm:gap-4 sm:gap-6 md:grid-cols-2">
      <TraitsDisplay
        traits={state.traits}
        onChange={handlers.setTraits}
        equipmentModifiers={equipmentFeatureModifiers.traits}
      />
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

  // Parse equipment features for stat modifiers
  const equipmentFeatureModifiers = useMemo(
    () => getEquipmentFeatureModifiers(state.equipment),
    [state.equipment]
  );

  const coreScoresAutoContext = useMemo(
    () => ({
      classEvasion: classStats.evasion,
      armorEvasionModifier: armorStats.evasionMod,
      equipmentEvasionModifier: equipmentFeatureModifiers.evasion,
    }),
    [
      classStats.evasion,
      armorStats.evasionMod,
      equipmentFeatureModifiers.evasion,
    ]
  );

  const thresholdsAutoContext = useMemo(
    () => ({
      armorThresholdsMajor: armorStats.major,
      armorThresholdsSevere: armorStats.severe,
      level: state.progression.currentLevel,
      equipmentMajorModifier: equipmentFeatureModifiers.majorThreshold,
      equipmentSevereModifier: equipmentFeatureModifiers.severeThreshold,
    }),
    [
      armorStats.major,
      armorStats.severe,
      state.progression.currentLevel,
      equipmentFeatureModifiers.majorThreshold,
      equipmentFeatureModifiers.severeThreshold,
    ]
  );

  const autoEvasion = useMemo(
    () =>
      classStats.evasion +
      armorStats.evasionMod +
      equipmentFeatureModifiers.evasion,
    [
      classStats.evasion,
      armorStats.evasionMod,
      equipmentFeatureModifiers.evasion,
    ]
  );

  const autoThresholdsMajor = useMemo(
    () =>
      armorStats.major +
      Math.max(0, state.progression.currentLevel) +
      equipmentFeatureModifiers.majorThreshold,
    [
      armorStats.major,
      state.progression.currentLevel,
      equipmentFeatureModifiers.majorThreshold,
    ]
  );
  const autoThresholdsSevere = useMemo(
    () =>
      armorStats.severe +
      Math.max(0, state.progression.currentLevel) +
      equipmentFeatureModifiers.severeThreshold,
    [
      armorStats.severe,
      state.progression.currentLevel,
      equipmentFeatureModifiers.severeThreshold,
    ]
  );

  // Auto-update Evasion and Thresholds when auto-calculate is enabled
  useAutoUpdateScores({
    isHydrated,
    autoEvasion,
    autoThresholdsMajor,
    autoThresholdsSevere,
    state,
    handlers,
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 sm:gap-6 lg:grid-cols-3">
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
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 sm:gap-6">
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
    <div className="grid gap-3 sm:gap-4 sm:gap-6 md:grid-cols-3">
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
