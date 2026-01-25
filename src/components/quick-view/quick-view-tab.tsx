import { useMemo } from 'react';

import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { useIsMobile } from '@/hooks/use-mobile';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import {
  DEFAULT_QUICK_VIEW_PREFERENCES,
  type QuickViewSections,
} from '@/lib/schemas/quick-view';

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

export function QuickViewTab({ state, handlers }: QuickViewTabProps) {
  const hasCompanion = !!(state.companionEnabled && state.companion);
  const bonusHopeSlots = state.companion?.training.lightInTheDark ? 1 : 0;
  const isMobile = useIsMobile();
  const quickView = state.quickView ?? DEFAULT_QUICK_VIEW_PREFERENCES;

  const equipmentModifiers = useMemo(
    () => getEquipmentFeatureModifiers(state.equipment),
    [state.equipment]
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
