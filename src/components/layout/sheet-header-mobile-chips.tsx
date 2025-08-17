import * as React from 'react';

import type {
  ClassDraft,
  ResourcesDraft,
  TraitsDraft,
} from '@/features/characters/storage';

import { ClassChip } from './sheet-header-mobile-chips/ClassChip';
import { CoreChip } from './sheet-header-mobile-chips/CoreChip';
import { GoldChip } from './sheet-header-mobile-chips/GoldChip';
import { ResourcesChip } from './sheet-header-mobile-chips/ResourcesChip';
import { ThresholdsChip } from './sheet-header-mobile-chips/ThresholdsChip';
import { TraitsChip } from './sheet-header-mobile-chips/TraitsChip';

export type SheetHeaderMobileChipsProps = {
  showClass: boolean;
  showTraits: boolean;
  showCore: boolean;
  showThresholds: boolean;
  showResources: boolean;
  showGold: boolean;
  classDraft: ClassDraft;
  level: number;
  traits: TraitsDraft;
  resources: ResourcesDraft;
  displayMajor: number | string;
  displaySevere: number | string;
  displayDs: number | string;
  enableCritical?: boolean;
  onDeltaHp?: (delta: number) => void;
  onDeltaStress?: (delta: number) => void;
  onDeltaHope?: (delta: number) => void;
  onDeltaArmorScore?: (delta: number) => void;
};

// Subcomponents imported from ./sheet-header-mobile-chips/*.tsx

export function SheetHeaderMobileChips({
  showClass,
  showTraits,
  showCore,
  showThresholds,
  showResources,
  showGold,
  classDraft,
  level,
  traits,
  resources,
  displayMajor,
  displaySevere,
  displayDs,
  enableCritical,
  onDeltaHp,
  onDeltaStress,
  onDeltaHope,
  onDeltaArmorScore,
}: SheetHeaderMobileChipsProps) {
  return (
    <div className="border-t px-4 py-1 md:hidden">
      <div className="flex flex-wrap gap-2">
        {showClass && <ClassChip classDraft={classDraft} level={level} />}
        {showTraits && <TraitsChip traits={traits} />}
        {showCore && <CoreChip resources={resources} />}
        {showThresholds && (
          <ThresholdsChip
            displayMajor={displayMajor}
            displaySevere={displaySevere}
            displayDs={displayDs}
            enableCritical={enableCritical}
            onDeltaHp={onDeltaHp}
          />
        )}
        {showResources && (
          <ResourcesChip
            resources={resources}
            onDeltaHp={onDeltaHp}
            onDeltaStress={onDeltaStress}
            onDeltaHope={onDeltaHope}
            onDeltaArmorScore={onDeltaArmorScore}
          />
        )}
        {showGold && <GoldChip resources={resources} />}
      </div>
    </div>
  );
}
