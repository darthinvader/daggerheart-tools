import { useMemo } from 'react';

import { ClassDisplay } from '@/components/class-selector';
import { CoreScoresDisplay } from '@/components/core-scores';
import { EquipmentDisplay } from '@/components/equipment';
import { LoadoutDisplay } from '@/components/loadout-selector';
import { ResourcesDisplay } from '@/components/resources';
import { HopeWithScarsDisplay } from '@/components/scars';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import { TraitsDisplay } from '@/components/traits';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';

import { CompanionSection } from '../companion-section';
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

export function CombatTab({
  state,
  handlers,
  isHydrated: _isHydrated,
}: TabProps) {
  const classStats = useMemo(
    () => getClassStats(state.classSelection),
    [state.classSelection]
  );
  const armorStats = useMemo(
    () => getArmorStats(state.equipment),
    [state.equipment]
  );

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
    <div className="space-y-6 pt-4">
      {/* Row 1: Class and Equipment */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ClassDisplay
          selection={state.classSelection}
          onChange={handlers.setClassSelection}
          unlockedSubclassFeatures={state.unlockedSubclassFeatures}
        />
        <EquipmentDisplay
          equipment={state.equipment}
          onChange={handlers.setEquipment}
          hideDialogHeader
        />
      </div>

      {/* Row 2: Traits and Resources */}
      <div className="grid gap-4 md:grid-cols-2">
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

      {/* Row 3: Hope/Scars, Core Scores, and Thresholds */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Row 4: Companion (if exists) */}
      <CompanionSection
        hasCompanionFeature={hasCompanionFeature}
        companionEnabled={state.companionEnabled}
        companion={state.companion}
        setCompanion={handlers.setCompanion}
        setCompanionEnabled={handlers.setCompanionEnabled}
      />

      {/* Row 5: Loadout */}
      <LoadoutDisplay
        selection={state.loadout}
        onChange={handlers.setLoadout}
        classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
        tier={state.progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
      />
    </div>
  );
}
