import { useEffect, useMemo, useRef } from 'react';

import { AncestryDisplay } from '@/components/ancestry-selector';
import { BonusSummaryDisplay } from '@/components/bonus-summary';
import { ClassDisplay } from '@/components/class-selector';
import { CommunityDisplay } from '@/components/community-selector';
import { ConditionsDisplay } from '@/components/conditions';
import { CoreScoresDisplay } from '@/components/core-scores';
import { EquipmentDisplay } from '@/components/equipment';
import type { EquipmentState } from '@/components/equipment';
import { ExperiencesDisplay } from '@/components/experiences';
import { GoldDisplay } from '@/components/gold';
import { IdentityDisplay } from '@/components/identity-editor';
import { ResourcesDisplay } from '@/components/resources';
import { computeAutoResources } from '@/components/resources/resources-utils';
import { HopeWithScarsDisplay } from '@/components/scars';
import { ProgressionDisplay } from '@/components/shared/progression-display';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import { TraitsDisplay } from '@/components/traits';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getClassByName } from '@/lib/data/classes';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import {
  hasAnyModifiers,
  normalizeEquipment,
} from '@/lib/equipment-feature-parser/normalize-equipment';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import {
  aggregateBonusBreakdown,
  aggregateBonusModifiers,
  combineModifiers,
} from '@/lib/utils/feature-modifiers';
import type { BonusSourceEntry } from '@/lib/utils/feature-modifiers';

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

function getExperienceBonus(
  entry: TabProps['state']['inventory']['items'][number]
) {
  if (!entry.item || typeof entry.item !== 'object') return undefined;
  return 'experienceBonus' in entry.item
    ? (
        entry.item as {
          experienceBonus?: { experience?: string; bonus: number };
        }
      ).experienceBonus
    : undefined;
}

function hasEquippedArmor(equipment: EquipmentState) {
  if (equipment.armor) return true;
  if (equipment.armorMode === 'homebrew') {
    return !!equipment.homebrewArmor?.name;
  }
  return false;
}

function getExperienceBonuses(
  inventory: TabProps['state']['inventory'],
  experiences: TabProps['state']['experiences']
) {
  const bonuses: Record<string, number> = {};
  const experienceNames = (experiences?.items ?? [])
    .map(item => item.name)
    .filter(Boolean);

  for (const entry of inventory?.items ?? []) {
    if (!entry.isEquipped) continue;
    const bonus = getExperienceBonus(entry);
    if (!bonus) continue;
    const rawExperience = bonus.experience?.trim();
    if (!rawExperience) continue;

    const target = resolveExperienceTarget(
      entry,
      experienceNames,
      rawExperience
    );
    if (!target) continue;
    bonuses[target] = (bonuses[target] ?? 0) + bonus.bonus;
  }

  return bonuses;
}

function resolveExperienceTarget(
  entry: TabProps['state']['inventory']['items'][number],
  experienceNames: string[],
  rawExperience: string
) {
  let target = rawExperience;
  const selectedExperience =
    (entry.item as { metadata?: Record<string, unknown> })?.metadata
      ?.selectedExperience ??
    (entry as { metadata?: Record<string, unknown> })?.metadata
      ?.selectedExperience;

  if (/any experience/i.test(rawExperience)) {
    if (typeof selectedExperience === 'string') {
      target = selectedExperience;
    } else {
      target = experienceNames[0] ?? '';
    }
  }

  const exactMatch = experienceNames.find(name => name === target);
  const normalizedMatch =
    exactMatch ??
    experienceNames.find(name => name.toLowerCase() === target.toLowerCase());

  return normalizedMatch ?? target;
}

function getExperienceBonusSources(
  inventory: TabProps['state']['inventory'],
  experiences: TabProps['state']['experiences']
): BonusSourceEntry[] {
  const sources: BonusSourceEntry[] = [];
  const experienceNames = (experiences?.items ?? [])
    .map(item => item.name)
    .filter(Boolean);

  for (const entry of inventory?.items ?? []) {
    if (!entry.isEquipped) continue;
    const bonus = getExperienceBonus(entry);
    if (!bonus) continue;
    const rawExperience = bonus.experience?.trim();
    if (!rawExperience) continue;
    const target = resolveExperienceTarget(
      entry,
      experienceNames,
      rawExperience
    );
    if (!target) continue;
    sources.push({
      type: 'experience-bonus',
      sourceName: entry.item?.name ?? 'Experience Bonus',
      detail: target,
      modifiers: {},
      experienceBonus: {
        experience: target,
        bonus: bonus.bonus,
      },
    });
  }

  return sources;
}

function getSelectableExperienceBonusItems(
  inventory: TabProps['state']['inventory']
) {
  return (inventory?.items ?? []).filter(entry => {
    const bonus = getExperienceBonus(entry);
    if (!bonus) return false;
    return /any experience/i.test(bonus.experience ?? '');
  });
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
    <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
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
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
        evasion: combinedFeatureModifiers.evasion,
        proficiency: combinedFeatureModifiers.proficiency,
        armorScore: combinedFeatureModifiers.armorScore,
        majorThreshold: combinedFeatureModifiers.majorThreshold,
        severeThreshold: combinedFeatureModifiers.severeThreshold,
      },
    }),
    [
      classStats,
      armorStats,
      state.progression.currentLevel,
      combinedFeatureModifiers,
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
    <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
      <TraitsDisplay
        traits={state.traits}
        onChange={handlers.setTraits}
        equipmentModifiers={combinedFeatureModifiers.traits}
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

  const bonusFeatureModifiers = useMemo(
    () =>
      aggregateBonusModifiers({
        classSelection: state.classSelection,
        ancestry: state.ancestry,
        community: state.community,
        loadout: state.loadout,
        inventory: state.inventory,
        isWearingArmor: hasEquippedArmor(state.equipment),
      }),
    [
      state.classSelection,
      state.ancestry,
      state.community,
      state.loadout,
      state.inventory,
      state.equipment,
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

  const coreScoresAutoContext = useMemo(
    () => ({
      classEvasion: classStats.evasion,
      armorEvasionModifier: armorStats.evasionMod,
      equipmentEvasionModifier: equipmentFeatureModifiers.evasion,
      bonusEvasionModifier: bonusFeatureModifiers.evasion,
    }),
    [
      classStats.evasion,
      armorStats.evasionMod,
      equipmentFeatureModifiers.evasion,
      bonusFeatureModifiers.evasion,
    ]
  );

  const thresholdsAutoContext = useMemo(
    () => ({
      armorThresholdsMajor: armorStats.major,
      armorThresholdsSevere: armorStats.severe,
      level: state.progression.currentLevel,
      equipmentMajorModifier: equipmentFeatureModifiers.majorThreshold,
      equipmentSevereModifier: equipmentFeatureModifiers.severeThreshold,
      bonusMajorModifier: bonusFeatureModifiers.majorThreshold,
      bonusSevereModifier: bonusFeatureModifiers.severeThreshold,
    }),
    [
      armorStats.major,
      armorStats.severe,
      state.progression.currentLevel,
      equipmentFeatureModifiers.majorThreshold,
      equipmentFeatureModifiers.severeThreshold,
      bonusFeatureModifiers.majorThreshold,
      bonusFeatureModifiers.severeThreshold,
    ]
  );

  const autoEvasion = useMemo(
    () =>
      classStats.evasion +
      armorStats.evasionMod +
      combinedFeatureModifiers.evasion,
    [
      classStats.evasion,
      armorStats.evasionMod,
      combinedFeatureModifiers.evasion,
    ]
  );

  const autoThresholdsMajor = useMemo(
    () =>
      armorStats.major +
      Math.max(0, state.progression.currentLevel) +
      combinedFeatureModifiers.majorThreshold,
    [
      armorStats.major,
      state.progression.currentLevel,
      combinedFeatureModifiers.majorThreshold,
    ]
  );
  const autoThresholdsSevere = useMemo(
    () =>
      armorStats.severe +
      Math.max(0, state.progression.currentLevel) +
      combinedFeatureModifiers.severeThreshold,
    [
      armorStats.severe,
      state.progression.currentLevel,
      combinedFeatureModifiers.severeThreshold,
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
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
      <GoldDisplay gold={state.gold} onChange={handlers.setGold} />
      <ConditionsDisplay
        conditions={state.conditions}
        onChange={handlers.setConditions}
      />
    </div>
  );
}

export function ExperiencesEquipmentGrid({ state, handlers }: TabProps) {
  const bonusBreakdown = useMemo(
    () =>
      aggregateBonusBreakdown({
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
  const equipmentSources = useMemo(
    () => collectEquipmentSources(state.equipment),
    [state.equipment]
  );
  const experienceBonusSources = useMemo(
    () => getExperienceBonusSources(state.inventory, state.experiences),
    [state.inventory, state.experiences]
  );
  const experienceBonuses = useMemo(
    () => getExperienceBonuses(state.inventory, state.experiences),
    [state.inventory, state.experiences]
  );
  const selectableExperienceItems = useMemo(
    () => getSelectableExperienceBonusItems(state.inventory),
    [state.inventory]
  );
  const experienceNames = useMemo(
    () => state.experiences.items.map(item => item.name).filter(Boolean),
    [state.experiences]
  );

  const handleExperienceSelection = (entryId: string, selection: string) => {
    handlers.setInventory({
      ...state.inventory,
      items: state.inventory.items.map(item => {
        if (item.id !== entryId) return item;
        const metadata =
          (item as { metadata?: Record<string, unknown> }).metadata ?? {};
        return {
          ...item,
          metadata: { ...metadata, selectedExperience: selection },
        };
      }),
    });
  };

  return (
    <div className="grid gap-3 sm:gap-6 md:grid-cols-4">
      <ExperiencesDisplay
        experiences={state.experiences}
        onChange={handlers.setExperiences}
        bonusByExperience={experienceBonuses}
      />
      {selectableExperienceItems.length > 0 && (
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Experience Bonus Targets</p>
              <p className="text-muted-foreground text-xs">
                Choose which experience receives each bonus.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {selectableExperienceItems.map(entry => {
              const metadata = (entry as { metadata?: Record<string, unknown> })
                .metadata;
              const selected =
                typeof metadata?.selectedExperience === 'string'
                  ? metadata.selectedExperience
                  : (experienceNames[0] ?? '');
              return (
                <div key={entry.id} className="grid gap-2">
                  <Label className="text-muted-foreground text-xs">
                    {entry.item?.name ?? 'Experience Bonus'}
                  </Label>
                  <Select
                    value={selected}
                    onValueChange={value =>
                      handleExperienceSelection(entry.id, value)
                    }
                    disabled={experienceNames.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceNames.map(name => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <BonusSummaryDisplay
        breakdown={bonusBreakdown}
        extraSources={[...equipmentSources, ...experienceBonusSources]}
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

function getActiveEquipment(equipment: EquipmentState) {
  return {
    armor:
      equipment.armorMode === 'homebrew'
        ? equipment.homebrewArmor
        : equipment.armor,
    primaryWeapon:
      equipment.primaryWeaponMode === 'homebrew'
        ? equipment.homebrewPrimaryWeapon
        : equipment.primaryWeapon,
    secondaryWeapon:
      equipment.secondaryWeaponMode === 'homebrew'
        ? equipment.homebrewSecondaryWeapon
        : equipment.secondaryWeapon,
    wheelchair: equipment.useCombatWheelchair
      ? equipment.wheelchairMode === 'homebrew'
        ? equipment.homebrewWheelchair
        : equipment.combatWheelchair
      : null,
  };
}

function collectEquipmentSources(
  equipment: EquipmentState
): BonusSourceEntry[] {
  const sources: BonusSourceEntry[] = [];
  const active = getActiveEquipment(equipment);

  const pushStatModifiers = (
    sourceName: string,
    modifiers?: FeatureStatModifiers
  ) => {
    if (!modifiers) return;
    sources.push({
      type: 'equipment-item',
      sourceName,
      modifiers,
    });
  };

  const pushFeatureModifiers = (
    sourceName: string,
    featureName: string,
    modifiers?: FeatureStatModifiers
  ) => {
    if (!modifiers) return;
    sources.push({
      type: 'equipment-feature',
      sourceName,
      detail: featureName,
      modifiers,
    });
  };

  const collectFromEquipment = (item: unknown, fallbackLabel: string) => {
    if (!item || typeof item !== 'object') return;
    const record = item as {
      name?: string;
      statModifiers?: FeatureStatModifiers;
      features?: Array<{ name: string; modifiers?: FeatureStatModifiers }>;
    };
    const name = record.name ?? fallbackLabel;
    const hasExplicitStatModifiers = Boolean(record.statModifiers);
    const hasExplicitFeatureModifiers = (record.features ?? []).some(feature =>
      Boolean(feature.modifiers)
    );

    if (hasExplicitStatModifiers || hasExplicitFeatureModifiers) {
      pushStatModifiers(name, record.statModifiers);
      for (const feature of record.features ?? []) {
        pushFeatureModifiers(name, feature.name, feature.modifiers);
      }
      return;
    }

    const normalized = normalizeEquipment(record);
    if (!hasAnyModifiers(normalized)) return;
    pushStatModifiers(name, {
      evasion: normalized.evasion,
      proficiency: normalized.proficiency,
      armorScore: normalized.armorScore,
      majorThreshold: normalized.majorThreshold,
      severeThreshold: normalized.severeThreshold,
      attackRolls: normalized.attackRolls,
      spellcastRolls: normalized.spellcastRolls,
      traits: normalized.traits,
    });
  };

  collectFromEquipment(
    equipment.armorActivated !== false ? active.armor : null,
    'Armor'
  );
  collectFromEquipment(
    equipment.primaryWeaponActivated !== false ? active.primaryWeapon : null,
    'Primary Weapon'
  );
  collectFromEquipment(
    equipment.secondaryWeaponActivated !== false
      ? active.secondaryWeapon
      : null,
    'Secondary Weapon'
  );
  collectFromEquipment(
    equipment.wheelchairActivated !== false ? active.wheelchair : null,
    'Combat Wheelchair'
  );

  return sources;
}
