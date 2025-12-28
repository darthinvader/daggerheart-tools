import {
  AncestryDisplay,
  type AncestrySelection,
} from '@/components/ancestry-selector';
import { ClassDisplay } from '@/components/class-selector';
import { CommunityDisplay } from '@/components/community-selector';
import {
  ConditionsDisplay,
  type ConditionsState,
} from '@/components/conditions';
import {
  CoreScoresDisplay,
  type CoreScoresState,
} from '@/components/core-scores';
import { EquipmentDisplay, type EquipmentState } from '@/components/equipment';
import {
  ExperiencesDisplay,
  type ExperiencesState,
} from '@/components/experiences';
import { GoldDisplay } from '@/components/gold';
import { IdentityDisplay } from '@/components/identity-editor';
import { InventoryDisplay, type InventoryState } from '@/components/inventory';
import { LoadoutDisplay } from '@/components/loadout-selector';
import { ResourcesDisplay, type ResourcesState } from '@/components/resources';
import {
  ProgressionDisplay,
  type ProgressionState,
} from '@/components/shared/progression-display';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import { TraitsDisplay, type TraitsState } from '@/components/traits';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CommunitySelection } from '@/lib/schemas/identity';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

export interface DemoState {
  identity: IdentityFormValues;
  ancestry: AncestrySelection;
  community: CommunitySelection;
  classSelection: ClassSelection | null;
  progression: ProgressionState;
  gold: Gold;
  thresholds: ThresholdsSettings;
  equipment: EquipmentState;
  inventory: InventoryState;
  loadout: LoadoutSelection;
  experiences: ExperiencesState;
  conditions: ConditionsState;
  traits: TraitsState;
  coreScores: CoreScoresState;
  resources: ResourcesState;
  unlockedSubclassFeatures: Record<string, string[]>;
}

export interface DemoHandlers {
  setIdentity: (v: IdentityFormValues) => void;
  setAncestry: (v: AncestrySelection) => void;
  setCommunity: (v: CommunitySelection) => void;
  setClassSelection: (v: ClassSelection | null) => void;
  setProgression: (v: ProgressionState) => void;
  setGold: (v: Gold) => void;
  setThresholds: (v: ThresholdsSettings) => void;
  setEquipment: (v: EquipmentState) => void;
  setInventory: (v: InventoryState) => void;
  setLoadout: (v: LoadoutSelection) => void;
  setExperiences: (v: ExperiencesState) => void;
  setConditions: (v: ConditionsState) => void;
  setTraits: (v: TraitsState) => void;
  setCoreScores: (v: CoreScoresState) => void;
  setResources: (v: ResourcesState) => void;
  onLevelUp: () => void;
}

interface TabProps {
  state: DemoState;
  handlers: DemoHandlers;
}

export function OverviewTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-6 lg:grid-cols-2">
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

      <div className="grid gap-6 lg:grid-cols-3">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <TraitsDisplay traits={state.traits} onChange={handlers.setTraits} />
        <div className="space-y-6">
          <CoreScoresDisplay
            scores={state.coreScores}
            onChange={handlers.setCoreScores}
          />
          <ResourcesDisplay
            resources={state.resources}
            onChange={handlers.setResources}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ThresholdsEditableSection
          settings={state.thresholds}
          onChange={handlers.setThresholds}
          baseHp={6}
        />
        <GoldDisplay gold={state.gold} onChange={handlers.setGold} />
        <ConditionsDisplay
          conditions={state.conditions}
          onChange={handlers.setConditions}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExperiencesDisplay
          experiences={state.experiences}
          onChange={handlers.setExperiences}
        />
        <EquipmentDisplay
          equipment={state.equipment}
          onChange={handlers.setEquipment}
          hideDialogHeader
        />
      </div>

      <LoadoutDisplay
        selection={state.loadout}
        onChange={handlers.setLoadout}
        classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
        tier={state.progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
      />

      <InventoryDisplay
        inventory={state.inventory}
        onChange={handlers.setInventory}
      />
    </div>
  );
}

export function IdentityTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-6 pt-4">
      <IdentityDisplay
        identity={state.identity}
        onChange={handlers.setIdentity}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <AncestryDisplay
          selection={state.ancestry}
          onChange={handlers.setAncestry}
        />
        <CommunityDisplay
          selection={state.community}
          onChange={handlers.setCommunity}
        />
      </div>
    </div>
  );
}

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

export function ItemsTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryDisplay
            inventory={state.inventory}
            onChange={handlers.setInventory}
          />
        </div>
        <div className="space-y-6">
          <GoldDisplay
            gold={state.gold}
            onChange={handlers.setGold}
            compactMode
          />
          <EquipmentDisplay
            equipment={state.equipment}
            onChange={handlers.setEquipment}
            hideDialogHeader
          />
        </div>
      </div>
    </div>
  );
}
