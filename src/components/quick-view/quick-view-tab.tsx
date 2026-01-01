import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';

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
import { QuickProgressionInfo } from './quick-progression-info';
import { QuickThresholdsInfo } from './quick-thresholds-info';
import { QuickTraitsInfo } from './quick-traits-info';
import { QuickVitalsInfo } from './quick-vitals-info';

interface QuickViewTabProps {
  state: DemoState;
  handlers: DemoHandlers;
}

export function QuickViewTab({ state, handlers }: QuickViewTabProps) {
  const hasCompanion = state.companionEnabled && state.companion;
  const bonusHopeSlots = state.companion?.training.lightInTheDark ? 1 : 0;

  return (
    <div className="space-y-3 pt-4">
      {/* Row 1: Level/Tier + Traits (half width) */}
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickProgressionInfo progression={state.progression} />
        <QuickTraitsInfo traits={state.traits} className="sm:col-span-2" />
      </div>

      {/* Row 2: Vitals (HP, Armor, Stress, Hope) */}
      <QuickVitalsInfo
        resources={state.resources}
        hopeState={state.hopeWithScars}
        onResourcesChange={handlers.setResources}
        onHopeChange={handlers.setHopeWithScars}
        bonusHopeSlots={bonusHopeSlots}
      />

      {/* Row 3: Core Scores + Thresholds */}
      <div className="grid gap-3 sm:grid-cols-2">
        <QuickCoreScoresInfo scores={state.coreScores} />
        <QuickThresholdsInfo thresholds={state.thresholds} />
      </div>

      {/* Row 4: Ancestry + Community + Class */}
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAncestryInfo selection={state.ancestry} />
        <QuickCommunityInfo selection={state.community} />
        <QuickClassInfo
          selection={state.classSelection}
          unlockedSubclassFeatures={state.unlockedSubclassFeatures}
        />
      </div>

      {/* Row 4: Gold + Conditions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <QuickGoldInfo gold={state.gold} onChange={handlers.setGold} />
        <QuickConditionsInfo
          conditions={state.conditions}
          onChange={handlers.setConditions}
        />
      </div>

      {/* Row 5: Companion + Experiences */}
      <div className="grid gap-3 sm:grid-cols-2">
        {hasCompanion && (
          <QuickCompanionInfo
            companion={state.companion}
            onChange={handlers.setCompanion}
          />
        )}
        <QuickExperiencesInfo
          experiences={state.experiences}
          className={hasCompanion ? '' : 'sm:col-span-2'}
        />
      </div>

      {/* Equipment */}
      <QuickEquipmentInfo equipment={state.equipment} />

      {/* Domain Loadout */}
      <QuickLoadoutInfo selection={state.loadout} />

      {/* Inventory */}
      <QuickInventoryInfo
        inventory={state.inventory}
        onChange={handlers.setInventory}
      />
    </div>
  );
}
