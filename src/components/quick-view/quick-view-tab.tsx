import { ChevronDown, ChevronRight } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AggregatedEquipmentStats } from '@/lib/equipment-feature-parser';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import {
  DEFAULT_QUICK_VIEW_PREFERENCES,
  type QuickViewSections,
} from '@/lib/schemas/quick-view';
import { cn } from '@/lib/utils';

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
import { QuickThresholdsInfo } from './quick-thresholds-info';
import { QuickTraitsInfo } from './quick-traits-info';
import { QuickVitalsInfo } from './quick-vitals-info';

interface QuickViewTabProps {
  state: DemoState;
  handlers: DemoHandlers;
}

type QuickSectionKey = keyof QuickViewSections;

function QuickSection({
  id,
  label,
  isOpen,
  isMobile,
  onToggle,
  className,
  children,
}: {
  id: QuickSectionKey;
  label: string;
  isOpen: boolean;
  isMobile: boolean;
  onToggle: (id: QuickSectionKey) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      {isMobile && (
        <button
          type="button"
          onClick={() => onToggle(id)}
          className="bg-muted/40 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold"
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
      {isOpen && <div className="flex-1 [&>*]:h-full">{children}</div>}
    </div>
  );
}

function QuickViewPrimarySections({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
  bonusHopeSlots,
  equipmentModifiers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
  isMobile: boolean;
  isSectionOpen: (id: QuickSectionKey) => boolean;
  onToggle: (id: QuickSectionKey) => void;
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
        />
      </QuickSection>

      <div className="grid items-stretch gap-3 sm:grid-cols-2">
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

function QuickViewIdentitySections({
  state,
  isMobile,
  isSectionOpen,
  onToggle,
}: {
  state: DemoState;
  isMobile: boolean;
  isSectionOpen: (id: QuickSectionKey) => boolean;
  onToggle: (id: QuickSectionKey) => void;
}) {
  return (
    <div className="grid items-stretch gap-3 sm:grid-cols-3">
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

function QuickViewStatusSections({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
  hasCompanion,
}: {
  state: DemoState;
  handlers: DemoHandlers;
  isMobile: boolean;
  isSectionOpen: (id: QuickSectionKey) => boolean;
  onToggle: (id: QuickSectionKey) => void;
  hasCompanion: boolean;
}) {
  return (
    <>
      <div className="grid items-stretch gap-3 sm:grid-cols-2">
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

      <div className="grid items-stretch gap-3 sm:grid-cols-2">
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

function QuickViewInventorySections({
  state,
  handlers,
  isMobile,
  isSectionOpen,
  onToggle,
}: {
  state: DemoState;
  handlers: DemoHandlers;
  isMobile: boolean;
  isSectionOpen: (id: QuickSectionKey) => boolean;
  onToggle: (id: QuickSectionKey) => void;
}) {
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

export function QuickViewTab({ state, handlers }: QuickViewTabProps) {
  const hasCompanion = !!(state.companionEnabled && state.companion);
  const bonusHopeSlots = state.companion?.training.lightInTheDark ? 1 : 0;
  const isMobile = useIsMobile();
  const quickView = state.quickView ?? DEFAULT_QUICK_VIEW_PREFERENCES;

  // Compute equipment modifiers
  const equipmentModifiers = useMemo(
    () => getEquipmentFeatureModifiers(state.equipment),
    [state.equipment]
  );

  const handleToggleSection = (id: QuickSectionKey) => {
    if (!isMobile) return;
    handlers.setQuickView({
      ...quickView,
      sections: {
        ...quickView.sections,
        [id]: !quickView.sections[id],
      },
    });
  };

  const isSectionOpen = (id: QuickSectionKey) =>
    !isMobile || quickView.sections[id];

  return (
    <div className="space-y-3 pt-4">
      <QuickViewPrimarySections
        state={state}
        handlers={handlers}
        isMobile={isMobile}
        isSectionOpen={isSectionOpen}
        onToggle={handleToggleSection}
        bonusHopeSlots={bonusHopeSlots}
        equipmentModifiers={equipmentModifiers}
      />

      <QuickViewIdentitySections
        state={state}
        isMobile={isMobile}
        isSectionOpen={isSectionOpen}
        onToggle={handleToggleSection}
      />

      <QuickViewStatusSections
        state={state}
        handlers={handlers}
        isMobile={isMobile}
        isSectionOpen={isSectionOpen}
        onToggle={handleToggleSection}
        hasCompanion={hasCompanion}
      />

      <QuickViewInventorySections
        state={state}
        handlers={handlers}
        isMobile={isMobile}
        isSectionOpen={isSectionOpen}
        onToggle={handleToggleSection}
      />
    </div>
  );
}
