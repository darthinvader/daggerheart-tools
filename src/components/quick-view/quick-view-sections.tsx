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

export function QuickViewPrimarySections({
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
    <>
      <QuickSection
        id="traits"
        label="Traits"
        isOpen={isSectionOpen('traits')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickTraitsInfo
          traits={state.traits}
          equipmentModifiers={equipmentModifiers.traits}
        />
      </QuickSection>

      <QuickSection
        id="vitals"
        label="Vitals"
        isOpen={isSectionOpen('vitals')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickVitalsInfo
          resources={state.resources}
          hopeState={state.hopeWithScars}
          onResourcesChange={handlers.setResources}
          onHopeChange={handlers.setHopeWithScars}
          bonusHopeSlots={bonusHopeSlots}
          conditions={state.conditions}
          onConditionsChange={handlers.setConditions}
        />
      </QuickSection>

      <div className="grid items-stretch gap-2 sm:grid-cols-2 sm:gap-3">
        <QuickSection
          id="coreScores"
          label="Core Scores"
          isOpen={isSectionOpen('coreScores')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickCoreScoresInfo scores={state.coreScores} />
        </QuickSection>
        <QuickSection
          id="thresholds"
          label="Thresholds"
          isOpen={isSectionOpen('thresholds')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickThresholdsInfo thresholds={state.thresholds} />
        </QuickSection>
      </div>
    </>
  );
}

export function QuickViewIdentitySections({
  state,
  isMobile,
  isSectionOpen,
  onToggle,
}: Omit<SectionProps, 'handlers'>) {
  return (
    <div className="grid items-stretch gap-2 sm:grid-cols-3 sm:gap-3">
      <QuickSection
        id="ancestry"
        label="Ancestry"
        isOpen={isSectionOpen('ancestry')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickAncestryInfo selection={state.ancestry} />
      </QuickSection>
      <QuickSection
        id="community"
        label="Community"
        isOpen={isSectionOpen('community')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickCommunityInfo selection={state.community} />
      </QuickSection>
      <QuickSection
        id="class"
        label="Class"
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
  );
}

export function QuickViewStatusSections({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
  hasCompanion,
}: SectionProps & { hasCompanion: boolean }) {
  return (
    <>
      <div className="grid items-stretch gap-2 sm:grid-cols-2 sm:gap-3">
        <QuickSection
          id="gold"
          label="Gold"
          isOpen={isSectionOpen('gold')}
          isMobile={isMobile}
          onToggle={onToggle}
        >
          <QuickGoldInfo gold={state.gold} onChange={handlers.setGold} />
        </QuickSection>
        <QuickSection
          id="conditions"
          label="Conditions"
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

      <div className="grid items-stretch gap-2 sm:grid-cols-2 sm:gap-3">
        {hasCompanion && (
          <QuickSection
            id="companion"
            label="Companion"
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
          isOpen={isSectionOpen('experiences')}
          isMobile={isMobile}
          onToggle={onToggle}
          className={hasCompanion ? '' : 'sm:col-span-2'}
        >
          <QuickExperiencesInfo experiences={state.experiences} />
        </QuickSection>
      </div>
    </>
  );
}

export function QuickViewInventorySections({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
}: SectionProps) {
  return (
    <>
      <QuickSection
        id="equipment"
        label="Equipment"
        isOpen={isSectionOpen('equipment')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickEquipmentInfo equipment={state.equipment} />
      </QuickSection>

      <QuickSection
        id="loadout"
        label="Domain Loadout"
        isOpen={isSectionOpen('loadout')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickLoadoutInfo selection={state.loadout} />
      </QuickSection>

      <QuickSection
        id="inventory"
        label="Inventory"
        isOpen={isSectionOpen('inventory')}
        isMobile={isMobile}
        onToggle={onToggle}
      >
        <QuickInventoryInfo
          inventory={state.inventory}
          onChange={handlers.setInventory}
        />
      </QuickSection>
    </>
  );
}
