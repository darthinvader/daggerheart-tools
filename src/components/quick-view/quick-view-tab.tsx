import { useCallback, useMemo } from 'react';

import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import type { EquipmentState } from '@/components/equipment';
import type { TraitsState } from '@/components/traits';
import { useIsMobile } from '@/hooks/use-mobile';
import { buildBeastformModifiers } from '@/lib/character-stats-engine/adapters';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import type { ActiveEffect } from '@/lib/schemas/equipment';
import {
  DEFAULT_QUICK_VIEW_PREFERENCES,
  type QuickViewSections,
} from '@/lib/schemas/quick-view';
import {
  aggregateBonusModifiers,
  combineModifiers,
} from '@/lib/utils/feature-modifiers';

import { QuickActiveEffects } from './quick-active-effects';
import { QuickBeastformStrip } from './quick-beastform-strip';
import { QuickCombatSummary } from './quick-combat-summary';
import { QuickStatusBanner } from './quick-status-banner';
import {
  QuickViewCombatSection,
  QuickViewGearSection,
  QuickViewHeroSection,
  QuickViewIdentitySection,
  QuickViewSessionSection,
} from './quick-view-sections';

interface QuickViewTabProps {
  state: DemoState;
  handlers: DemoHandlers;
}

type QuickSectionKey = keyof QuickViewSections;

function hasEquippedArmor(equipment: EquipmentState) {
  if (equipment.armor) return true;
  if (equipment.armorMode === 'homebrew') {
    return !!equipment.homebrewArmor?.name;
  }
  return false;
}

function getTraitScores(traits: TraitsState) {
  return {
    Agility: traits.Agility.value + traits.Agility.bonus,
    Strength: traits.Strength.value + traits.Strength.bonus,
    Finesse: traits.Finesse.value + traits.Finesse.bonus,
    Instinct: traits.Instinct.value + traits.Instinct.bonus,
    Presence: traits.Presence.value + traits.Presence.bonus,
    Knowledge: traits.Knowledge.value + traits.Knowledge.bonus,
  };
}

export function QuickViewTab({ state, handlers }: QuickViewTabProps) {
  const hasCompanion = !!(state.companionEnabled && state.companion);
  const bonusHopeSlots = state.companion?.training.lightInTheDark ? 1 : 0;
  const isMobile = useIsMobile();
  const quickView = state.quickView ?? DEFAULT_QUICK_VIEW_PREFERENCES;

  const equipmentModifiers = useMemo(
    () => getEquipmentFeatureModifiers(state.equipment),
    [state.equipment]
  );

  const bonusModifiers = useMemo(
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

  const combinedModifiers = useMemo(() => {
    const base = combineModifiers(
      {
        evasion: equipmentModifiers.evasion,
        proficiency: equipmentModifiers.proficiency,
        armorScore: equipmentModifiers.armorScore,
        majorThreshold: equipmentModifiers.majorThreshold,
        severeThreshold: equipmentModifiers.severeThreshold,
        attackRolls: equipmentModifiers.attackRolls,
        spellcastRolls: equipmentModifiers.spellcastRolls,
        traits: equipmentModifiers.traits,
      },
      bonusModifiers
    );
    const bf = buildBeastformModifiers(state.beastform);
    return combineModifiers(base, {
      evasion: bf.evasion,
      proficiency: bf.proficiency,
      armorScore: bf.armorScore,
      majorThreshold: bf.majorThreshold,
      severeThreshold: bf.severeThreshold,
      attackRolls: bf.attackRolls,
      spellcastRolls: bf.spellcastRolls,
      traits: bf.traits,
    });
  }, [equipmentModifiers, bonusModifiers, state.beastform]);

  const handleToggleSection = (id: QuickSectionKey) => {
    if (!isMobile) return;
    handlers.setQuickView({
      ...quickView,
      sections: { ...quickView.sections, [id]: !quickView.sections[id] },
    });
  };

  const isSectionOpen = (id: QuickSectionKey) =>
    !isMobile || quickView.sections[id];

  // Active effects handler — remove by filtering
  const handleRemoveEffect = useCallback(
    (effectId: string) => {
      const updated = (state.activeEffects ?? []).filter(
        (e: ActiveEffect) => e.id !== effectId
      );
      handlers.setActiveEffects(updated);
    },
    [state.activeEffects, handlers]
  );

  // HP danger state for CSS class
  const hpPercent =
    state.resources.hp.max > 0
      ? state.resources.hp.current / state.resources.hp.max
      : 1;
  const isDanger = hpPercent <= 0.25 && state.resources.hp.current > 0;

  return (
    <div className={`quick-tab-root${isDanger ? 'quick-tab-danger' : ''}`}>
      {/* Status banner — death, unconscious, critical HP, full stress */}
      <QuickStatusBanner
        deathState={state.deathState}
        hpCurrent={state.resources.hp.current}
        hpMax={state.resources.hp.max}
        stressCurrent={state.resources.stress.current}
        stressMax={state.resources.stress.max}
      />

      {/* Active effects strip — potions, buffs, temporary bonuses */}
      <QuickActiveEffects
        effects={state.activeEffects ?? []}
        onRemove={handleRemoveEffect}
      />

      {/* Beastform strip — compact form info when active */}
      {isSectionOpen('beastform') && (
        <QuickBeastformStrip beastform={state.beastform} />
      )}

      {/* Hero Section: Vitals bar + Traits */}
      <div className="animate-fade-up">
        <QuickViewHeroSection
          state={state}
          handlers={handlers}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
          bonusHopeSlots={bonusHopeSlots}
          equipmentModifiers={{
            ...combinedModifiers,
            parsedFeatures: equipmentModifiers.parsedFeatures,
          }}
        />
      </div>

      {/* Combat Summary — inline stat line always visible */}
      <QuickCombatSummary
        coreScores={state.coreScores}
        thresholds={state.thresholds}
      />

      {/* Combat Section: Core Scores + Thresholds unified */}
      <div className="animate-fade-up stagger-1">
        <QuickViewCombatSection
          state={state}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
        />
      </div>

      {/* Identity Section: Ancestry / Community / Class as cards */}
      <div className="animate-fade-up stagger-2">
        <QuickViewIdentitySection
          state={state}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
        />
      </div>

      {/* Session Section: Gold, Conditions, Companion, Experiences */}
      <div className="animate-fade-up stagger-3">
        <QuickViewSessionSection
          state={state}
          handlers={handlers}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
          hasCompanion={hasCompanion}
        />
      </div>

      {/* Gear Section: Equipment + Loadout + Inventory */}
      <div className="animate-fade-up stagger-4">
        <QuickViewGearSection
          state={state}
          handlers={handlers}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
        />
      </div>
    </div>
  );
}
