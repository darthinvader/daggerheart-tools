import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import type { AggregatedEquipmentStats } from '@/lib/equipment-feature-parser';
import type { QuickViewSections } from '@/lib/schemas/quick-view';

import { QuickAncestryInfo } from './quick-ancestry-info';
import { QuickClassInfo } from './quick-class-info';
import { QuickCommunityInfo } from './quick-community-info';
import { QuickCompanionInfo } from './quick-companion-info';
import { QuickConditionsInfo } from './quick-conditions-info';
import { QuickCoreScoresInfo } from './quick-core-scores-info';
import { QuickEquipmentInfo } from './quick-equipment-info';
import { QuickExperiencesInfo } from './quick-experiences-info';
import { QuickGoldInfo } from './quick-gold-info';
import { QuickInventoryInfo } from './quick-inventory-info';
import { QuickLoadoutInfo } from './quick-loadout-info';
import { QuickSection } from './quick-section';
import { QuickThresholdsInfo } from './quick-thresholds-info';
import { QuickTraitsInfo } from './quick-traits-info';
import { QuickVitalsInfo } from './quick-vitals-info';

type QuickSectionKey = keyof QuickViewSections;

interface SectionProps {
  state: DemoState;
  handlers: DemoHandlers;
  isMobile: boolean;
  isSectionOpen: (id: QuickSectionKey) => boolean;
  onToggle: (id: QuickSectionKey) => void;
}

/**
 * Hero Section — The most critical at-a-glance data:
 * Vitals bar (HP, Armor, Stress, Hope) + Traits grid.
 * On mobile, vitals is always expanded; traits can collapse.
 */
export function QuickViewHeroSection({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
  bonusHopeSlots,
  equipmentModifiers,
}: SectionProps & {
  bonusHopeSlots: number;
  equipmentModifiers: AggregatedEquipmentStats;
}) {
  return (
    <div className="quick-section-group">
      {/* Vitals — always visible, no collapse on mobile */}
      <QuickVitalsInfo
        resources={state.resources}
        hopeState={state.hopeWithScars}
        onResourcesChange={handlers.setResources}
        onHopeChange={handlers.setHopeWithScars}
        bonusHopeSlots={bonusHopeSlots}
        conditions={state.conditions}
        onConditionsChange={handlers.setConditions}
      />

      {/* Traits — collapsible on mobile */}
      <QuickSection
        id="traits"
        label="Traits"
        icon="traits"
        isOpen={isSectionOpen('traits')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickTraitsInfo
          traits={state.traits}
          equipmentModifiers={equipmentModifiers.traits}
        />
      </QuickSection>
    </div>
  );
}

/**
 * Combat Section — Core Scores + Thresholds side by side,
 * combined into a single "Combat Stats" area.
 */
export function QuickViewCombatSection({
  state,
  isMobile,
  isSectionOpen,
  onToggle,
}: Omit<SectionProps, 'handlers'>) {
  return (
    <div className="quick-section-group">
      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6">
        <QuickSection
          id="coreScores"
          label="Core Scores"
          icon="combat"
          isOpen={isSectionOpen('coreScores')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickCoreScoresInfo scores={state.coreScores} />
        </QuickSection>
        <QuickSection
          id="thresholds"
          label="Thresholds"
          icon="thresholds"
          isOpen={isSectionOpen('thresholds')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickThresholdsInfo thresholds={state.thresholds} />
        </QuickSection>
      </div>
    </div>
  );
}

/**
 * Identity Section — Ancestry, Community, Class.
 * On mobile these stack vertically as compact expandable cards.
 * On desktop they sit in a 3-column grid.
 */
export function QuickViewIdentitySection({
  state,
  isMobile,
  isSectionOpen,
  onToggle,
}: Omit<SectionProps, 'handlers'>) {
  return (
    <div className="quick-section-group">
      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <QuickSection
          id="ancestry"
          label="Ancestry"
          icon="ancestry"
          isOpen={isSectionOpen('ancestry')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickAncestryInfo selection={state.ancestry} />
        </QuickSection>
        <QuickSection
          id="community"
          label="Community"
          icon="community"
          isOpen={isSectionOpen('community')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickCommunityInfo selection={state.community} />
        </QuickSection>
        <QuickSection
          id="class"
          label="Class"
          icon="class"
          isOpen={isSectionOpen('class')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickClassInfo
            selection={state.classSelection}
            unlockedSubclassFeatures={state.unlockedSubclassFeatures}
          />
        </QuickSection>
      </div>
    </div>
  );
}

/**
 * Session Section — Gold, Conditions, Companion, Experiences.
 * Compact dashboard for tracking session-level state.
 */
export function QuickViewSessionSection({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
  hasCompanion,
}: SectionProps & { hasCompanion: boolean }) {
  return (
    <div className="quick-section-group">
      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6">
        <QuickSection
          id="gold"
          label="Gold"
          icon="gold"
          isOpen={isSectionOpen('gold')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickGoldInfo gold={state.gold} onChange={handlers.setGold} />
        </QuickSection>
        <QuickSection
          id="conditions"
          label="Conditions"
          icon="conditions"
          isOpen={isSectionOpen('conditions')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickConditionsInfo
            conditions={state.conditions}
            onChange={handlers.setConditions}
          />
        </QuickSection>
      </div>

      {hasCompanion && (
        <QuickSection
          id="companion"
          label="Companion"
          icon="companion"
          isOpen={isSectionOpen('companion')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickCompanionInfo
            companion={state.companion}
            onChange={handlers.setCompanion}
          />
        </QuickSection>
      )}

      <QuickSection
        id="experiences"
        label="Experiences"
        icon="experiences"
        isOpen={isSectionOpen('experiences')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickExperiencesInfo experiences={state.experiences} />
      </QuickSection>
    </div>
  );
}

/**
 * Gear Section — Equipment, Domain Loadout, Inventory.
 * All the items and gear your character carries.
 */
export function QuickViewGearSection({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
}: SectionProps) {
  return (
    <div className="quick-section-group">
      <QuickSection
        id="equipment"
        label="Equipment"
        icon="equipment"
        isOpen={isSectionOpen('equipment')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickEquipmentInfo equipment={state.equipment} />
      </QuickSection>

      <QuickSection
        id="loadout"
        label="Domain Loadout"
        icon="loadout"
        isOpen={isSectionOpen('loadout')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickLoadoutInfo selection={state.loadout} />
      </QuickSection>

      <QuickSection
        id="inventory"
        label="Inventory"
        icon="inventory"
        isOpen={isSectionOpen('inventory')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickInventoryInfo
          inventory={state.inventory}
          onChange={handlers.setInventory}
        />
      </QuickSection>
    </div>
  );
}
