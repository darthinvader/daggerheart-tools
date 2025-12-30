import { ClassDisplay } from '@/components/class-selector';
import { EquipmentDisplay } from '@/components/equipment';
import { GoldDisplay } from '@/components/gold';
import { LoadoutDisplay } from '@/components/loadout-selector';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';

import type { TabProps } from '../demo-types';

export function CombatTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <ClassDisplay
          selection={state.classSelection}
          onChange={handlers.setClassSelection}
          unlockedSubclassFeatures={state.unlockedSubclassFeatures}
        />
        <div className="space-y-6">
          <ThresholdsEditableSection
            settings={state.thresholds}
            onChange={handlers.setThresholds}
            baseHp={6}
          />
          <GoldDisplay gold={state.gold} onChange={handlers.setGold} />
        </div>
      </div>
      <EquipmentDisplay
        equipment={state.equipment}
        onChange={handlers.setEquipment}
        hideDialogHeader
      />
      <LoadoutDisplay
        selection={state.loadout}
        onChange={handlers.setLoadout}
        classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
        tier={state.progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
      />
    </div>
  );
}
