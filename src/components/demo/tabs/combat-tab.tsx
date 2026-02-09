import { Moon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { BeastformSection } from '@/components/beastform';
import { ClassDisplay } from '@/components/class-selector';
import { CoreScoresDisplay } from '@/components/core-scores';
import { EquipmentDisplay } from '@/components/equipment';
import { GameActions } from '@/components/game-actions';
import { LoadoutDisplay } from '@/components/loadout-selector';
import { ResourcesDisplay } from '@/components/resources';
import { RestModal } from '@/components/rest';
import { HopeWithScarsDisplay } from '@/components/scars';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import { TraitsDisplay } from '@/components/traits';
import { Button } from '@/components/ui/button';
import { buildBeastformModifiers } from '@/lib/character-stats-engine/adapters';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import {
  aggregateBonusModifiers,
  combineModifiers,
} from '@/lib/utils/feature-modifiers';
import { CompanionSection } from '../companion-section';
import { createDamageHandler, createRestHandler } from '../demo-handlers';
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

function getTraitScores(traits: TabProps['state']['traits']) {
  return {
    Agility: traits.Agility.value + traits.Agility.bonus,
    Strength: traits.Strength.value + traits.Strength.bonus,
    Finesse: traits.Finesse.value + traits.Finesse.bonus,
    Instinct: traits.Instinct.value + traits.Instinct.bonus,
    Presence: traits.Presence.value + traits.Presence.bonus,
    Knowledge: traits.Knowledge.value + traits.Knowledge.bonus,
  };
}

function hasEquippedArmor(equipment: TabProps['state']['equipment']) {
  if (equipment.armor) return true;
  if (equipment.armorMode === 'homebrew') {
    return !!equipment.homebrewArmor?.name;
  }
  return false;
}

/**
 * Computes all feature modifiers from equipment, class, ancestry, etc.
 */
function useCombatModifiers(state: TabProps['state']) {
  const equipmentFeatureModifiers = useMemo(
    () => getEquipmentFeatureModifiers(state.equipment),
    [state.equipment]
  );
  const bonusFeatureModifiers = useMemo(
    () =>
      aggregateBonusModifiers({
        classSelection: state.classSelection,
        ancestry: state.ancestry,
        community: state.community,
        loadout: state.loadout,
        inventory: state.inventory,
        isWearingArmor: hasEquippedArmor(state.equipment),
        proficiency: state.coreScores.proficiency,
        level: state.progression.currentLevel,
        traitScores: getTraitScores(state.traits),
      }),
    [
      state.classSelection,
      state.ancestry,
      state.community,
      state.loadout,
      state.inventory,
      state.equipment,
      state.coreScores.proficiency,
      state.progression.currentLevel,
      state.traits,
    ]
  );

  const combinedFeatureModifiers = useMemo(
    () =>
      combineModifiers(
        {
          evasion: equipmentFeatureModifiers.evasion,
          proficiency: equipmentFeatureModifiers.proficiency,
          armorScore: equipmentFeatureModifiers.armorScore,
          majorThreshold: equipmentFeatureModifiers.majorThreshold,
          severeThreshold: equipmentFeatureModifiers.severeThreshold,
          attackRolls: equipmentFeatureModifiers.attackRolls,
          spellcastRolls: equipmentFeatureModifiers.spellcastRolls,
          traits: equipmentFeatureModifiers.traits,
        },
        bonusFeatureModifiers
      ),
    [equipmentFeatureModifiers, bonusFeatureModifiers]
  );

  // Beastform trait + evasion modifiers (only when active)
  const beastformModifiers = useMemo(
    () => buildBeastformModifiers(state.beastform),
    [state.beastform]
  );

  // Merge beastform trait bonuses into combined modifiers for trait display
  const traitModifiersWithBeastform = useMemo(() => {
    const base = combinedFeatureModifiers.traits;
    const bf = beastformModifiers.traits;
    return {
      Agility: base.Agility + bf.Agility,
      Strength: base.Strength + bf.Strength,
      Finesse: base.Finesse + bf.Finesse,
      Instinct: base.Instinct + bf.Instinct,
      Presence: base.Presence + bf.Presence,
      Knowledge: base.Knowledge + bf.Knowledge,
    };
  }, [combinedFeatureModifiers.traits, beastformModifiers.traits]);

  return {
    equipmentFeatureModifiers,
    bonusFeatureModifiers,
    combinedFeatureModifiers,
    beastformModifiers,
    traitModifiersWithBeastform,
  };
}

/**
 * Builds auto-context objects for resources, core scores, and thresholds.
 */
function useCombatAutoContexts(input: {
  classStats: ReturnType<typeof getClassStats>;
  armorStats: ReturnType<typeof getArmorStats>;
  currentLevel: number;
  combinedFeatureModifiers: ReturnType<typeof combineModifiers>;
  equipmentFeatureModifiers: ReturnType<typeof getEquipmentFeatureModifiers>;
  bonusFeatureModifiers: ReturnType<typeof aggregateBonusModifiers>;
  beastformModifiers: ReturnType<typeof buildBeastformModifiers>;
}) {
  const {
    classStats,
    armorStats,
    currentLevel,
    combinedFeatureModifiers,
    equipmentFeatureModifiers,
    bonusFeatureModifiers,
    beastformModifiers,
  } = input;

  const resourcesAutoContext = useMemo(
    () => ({
      classHp: classStats.hp,
      classEvasion: classStats.evasion,
      classTier: Math.ceil(currentLevel / 3),
      armorScore: armorStats.score,
      armorEvasionModifier: armorStats.evasionMod,
      armorThresholdsMajor: armorStats.major,
      armorThresholdsSevere: armorStats.severe,
      level: currentLevel,
      equipmentFeatureModifiers: {
        evasion: combinedFeatureModifiers.evasion,
        proficiency: combinedFeatureModifiers.proficiency,
        armorScore: combinedFeatureModifiers.armorScore,
        majorThreshold: combinedFeatureModifiers.majorThreshold,
        severeThreshold: combinedFeatureModifiers.severeThreshold,
      },
    }),
    [classStats, armorStats, currentLevel, combinedFeatureModifiers]
  );

  const coreScoresAutoContext = useMemo(
    () => ({
      classEvasion: classStats.evasion,
      armorEvasionModifier: armorStats.evasionMod,
      equipmentEvasionModifier: equipmentFeatureModifiers.evasion,
      bonusEvasionModifier: bonusFeatureModifiers.evasion,
      beastformEvasionModifier: beastformModifiers.evasion,
    }),
    [
      classStats.evasion,
      armorStats.evasionMod,
      equipmentFeatureModifiers.evasion,
      bonusFeatureModifiers.evasion,
      beastformModifiers.evasion,
    ]
  );

  const thresholdsAutoContext = useMemo(
    () => ({
      armorThresholdsMajor: armorStats.major,
      armorThresholdsSevere: armorStats.severe,
      level: currentLevel,
      equipmentMajorModifier: equipmentFeatureModifiers.majorThreshold,
      equipmentSevereModifier: equipmentFeatureModifiers.severeThreshold,
      bonusMajorModifier: bonusFeatureModifiers.majorThreshold,
      bonusSevereModifier: bonusFeatureModifiers.severeThreshold,
    }),
    [
      armorStats.major,
      armorStats.severe,
      currentLevel,
      equipmentFeatureModifiers.majorThreshold,
      equipmentFeatureModifiers.severeThreshold,
      bonusFeatureModifiers.majorThreshold,
      bonusFeatureModifiers.severeThreshold,
    ]
  );

  return { resourcesAutoContext, coreScoresAutoContext, thresholdsAutoContext };
}

/**
 * Check whether the selected subclass has a companion feature.
 */
function checkHasCompanionFeature(
  classSelection: TabProps['state']['classSelection']
): boolean {
  const hasCompanionFlag = (value: unknown): value is { companion?: boolean } =>
    Boolean(value && typeof value === 'object' && 'companion' in value);
  if (!classSelection?.className || !classSelection?.subclassName) return false;
  if (classSelection.isHomebrew && classSelection.homebrewClass) {
    const homebrewSubclass = classSelection.homebrewClass.subclasses.find(
      s => s.name === classSelection.subclassName
    );
    return Boolean(homebrewSubclass?.companion);
  }
  const subclass = getSubclassByName(
    classSelection.className,
    classSelection.subclassName
  );
  return hasCompanionFlag(subclass) && Boolean(subclass.companion);
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

  const {
    equipmentFeatureModifiers,
    bonusFeatureModifiers,
    combinedFeatureModifiers,
    beastformModifiers,
    traitModifiersWithBeastform,
  } = useCombatModifiers(state);

  const { resourcesAutoContext, coreScoresAutoContext, thresholdsAutoContext } =
    useCombatAutoContexts({
      classStats,
      armorStats,
      currentLevel: state.progression.currentLevel,
      combinedFeatureModifiers,
      equipmentFeatureModifiers,
      bonusFeatureModifiers,
      beastformModifiers,
    });

  const hasCompanionFeature = useMemo(
    () => checkHasCompanionFeature(state.classSelection),
    [state.classSelection]
  );

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
    [
      state.resources,
      state.hopeWithScars,
      state.companion,
      state.restState,
      handlers,
    ]
  );

  const handleRollHopeChange = useCallback(
    (delta: number) => {
      handlers.setHopeWithScars({
        ...state.hopeWithScars,
        current: Math.min(
          state.hopeWithScars.max,
          state.hopeWithScars.current + delta
        ),
      });
    },
    [state.hopeWithScars, handlers]
  );

  const handleSpendHope = useCallback(
    (amount: number) => {
      handlers.setHopeWithScars({
        ...state.hopeWithScars,
        current: Math.max(0, state.hopeWithScars.current - amount),
      });
    },
    [state.hopeWithScars, handlers]
  );

  return (
    <div className="space-y-6 pt-4">
      {/* Row 1: Class and Equipment */}
      <div className="animate-fade-up grid gap-4 lg:grid-cols-2">
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
      <div className="animate-fade-up stagger-1 grid gap-4 md:grid-cols-2">
        <TraitsDisplay
          traits={state.traits}
          onChange={handlers.setTraits}
          equipmentModifiers={traitModifiersWithBeastform}
          currentHope={state.hopeWithScars.current}
          experiences={state.experiences.items}
          onHopeChange={handleRollHopeChange}
          onSpendHope={handleSpendHope}
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
      <div className="animate-fade-up stagger-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Game Actions - Combat actions for Critical Success and Tag Team */}
      <div className="animate-fade-up stagger-3">
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
      </div>

      {/* Rest Section */}
      <section className="game-card game-card-tier animate-fade-up stagger-4">
        <div className="game-card-header">
          <h3>
            <Moon className="text-fear size-5" />
            Rest
          </h3>
          <Button onClick={() => setIsRestModalOpen(true)} size="sm">
            Take a Rest
          </Button>
        </div>
        <div className="game-card-body">
          <div className="text-muted-foreground text-sm">
            <p>Short rests allow 2 downtime moves with 1d4+Tier recovery.</p>
            <p>Long rests allow 2 downtime moves with full recovery.</p>
          </div>
        </div>
      </section>

      <RestModal
        isOpen={isRestModalOpen}
        onClose={() => setIsRestModalOpen(false)}
        tier={Number(state.progression.currentTier)}
        currentHp={state.resources.hp.current}
        maxHp={state.resources.hp.max}
        currentStress={state.resources.stress.current}
        maxStress={state.resources.stress.max}
        currentArmorMarked={
          state.resources.armorScore.max - state.resources.armorScore.current
        }
        totalArmorSlots={state.resources.armorScore.max}
        shortRestsToday={state.restState.shortRestsToday}
        onRestComplete={result => {
          handleRest(result);
          setIsRestModalOpen(false);
        }}
      />

      {/* Row 4: Companion (if exists) */}
      <div className="animate-fade-up stagger-5">
        <CompanionSection
          hasCompanionFeature={hasCompanionFeature}
          companionEnabled={state.companionEnabled}
          companion={state.companion}
          setCompanion={handlers.setCompanion}
          setCompanionEnabled={handlers.setCompanionEnabled}
        />
      </div>

      {/* Row 4b: Beastform */}
      <div className="animate-fade-up stagger-5">
        <BeastformSection state={state} handlers={handlers} />
      </div>

      {/* Row 5: Loadout */}
      <div className="animate-fade-up stagger-6">
        <LoadoutDisplay
          selection={state.loadout}
          onChange={handlers.setLoadout}
          classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
          tier={state.progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
        />
      </div>
    </div>
  );
}
