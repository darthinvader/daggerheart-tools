import { useMemo } from 'react';

import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import type { EquipmentState } from '@/components/equipment';
import type { TraitsState } from '@/components/traits';
import { useIsMobile } from '@/hooks/use-mobile';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import {
  DEFAULT_QUICK_VIEW_PREFERENCES,
  type QuickViewSections,
} from '@/lib/schemas/quick-view';
import {
  aggregateBonusModifiers,
  combineModifiers,
} from '@/lib/utils/feature-modifiers';

import {
  QuickViewIdentitySections,
  QuickViewInventorySections,
  QuickViewPrimarySections,
  QuickViewStatusSections,
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

  const combinedModifiers = useMemo(
    () =>
      combineModifiers(
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
      ),
    [equipmentModifiers, bonusModifiers]
  );

  const handleToggleSection = (id: QuickSectionKey) => {
    if (!isMobile) return;
    handlers.setQuickView({
      ...quickView,
      sections: { ...quickView.sections, [id]: !quickView.sections[id] },
    });
  };

  const isSectionOpen = (id: QuickSectionKey) =>
    !isMobile || quickView.sections[id];

  return (
    <div className="space-y-2 pt-3 sm:space-y-3 sm:pt-4">
      <div className="animate-fade-up">
        <QuickViewPrimarySections
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
      <div className="animate-fade-up stagger-1">
        <QuickViewIdentitySections
          state={state}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
        />
      </div>
      <div className="animate-fade-up stagger-2">
        <QuickViewStatusSections
          state={state}
          handlers={handlers}
          isMobile={isMobile}
          isSectionOpen={isSectionOpen}
          onToggle={handleToggleSection}
          hasCompanion={hasCompanion}
        />
      </div>
      <div className="animate-fade-up stagger-3">
        <QuickViewInventorySections
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
