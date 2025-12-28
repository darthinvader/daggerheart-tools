import { useState } from 'react';

import { type AncestrySelection } from '@/components/ancestry-selector';
import { type ConditionsState } from '@/components/conditions';
import {
  type CoreScoresState,
  DEFAULT_CORE_SCORES,
} from '@/components/core-scores';
import {
  DEFAULT_EQUIPMENT_STATE,
  type EquipmentState,
} from '@/components/equipment';
import { type ExperiencesState } from '@/components/experiences';
import { type InventoryState } from '@/components/inventory';
import {
  DEFAULT_RESOURCES_STATE,
  type ResourcesState,
} from '@/components/resources';
import { type ProgressionState } from '@/components/shared/progression-display';
import { DEFAULT_TRAITS_STATE, type TraitsState } from '@/components/traits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CommunitySelection } from '@/lib/schemas/identity';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

import { CombatTab, IdentityTab, ItemsTab, OverviewTab } from './demo-tabs';
import {
  SAMPLE_ANCESTRY,
  SAMPLE_COMMUNITY,
  SAMPLE_CONDITIONS,
  SAMPLE_EXPERIENCES,
  SAMPLE_GOLD,
  SAMPLE_IDENTITY,
  SAMPLE_INVENTORY,
  SAMPLE_LOADOUT,
  SAMPLE_PROGRESSION,
  SAMPLE_THRESHOLDS,
  buildClassSelection,
} from './sample-data';

export function CharacterSheetDemo() {
  const [identity, setIdentity] = useState<IdentityFormValues>(SAMPLE_IDENTITY);
  const [ancestry, setAncestry] = useState<AncestrySelection>(SAMPLE_ANCESTRY);
  const [community, setCommunity] =
    useState<CommunitySelection>(SAMPLE_COMMUNITY);
  const [classSelection, setClassSelection] = useState<ClassSelection | null>(
    buildClassSelection
  );
  const [progression, setProgression] =
    useState<ProgressionState>(SAMPLE_PROGRESSION);
  const [gold, setGold] = useState<Gold>(SAMPLE_GOLD);
  const [thresholds, setThresholds] =
    useState<ThresholdsSettings>(SAMPLE_THRESHOLDS);
  const [equipment, setEquipment] = useState<EquipmentState>(
    DEFAULT_EQUIPMENT_STATE
  );
  const [inventory, setInventory] = useState<InventoryState>(SAMPLE_INVENTORY);
  const [loadout, setLoadout] = useState<LoadoutSelection>(SAMPLE_LOADOUT);
  const [experiences, setExperiences] =
    useState<ExperiencesState>(SAMPLE_EXPERIENCES);
  const [conditions, setConditions] =
    useState<ConditionsState>(SAMPLE_CONDITIONS);
  const [traits, setTraits] = useState<TraitsState>(DEFAULT_TRAITS_STATE);
  const [coreScores, setCoreScores] =
    useState<CoreScoresState>(DEFAULT_CORE_SCORES);
  const [resources, setResources] = useState<ResourcesState>(
    DEFAULT_RESOURCES_STATE
  );

  const state = {
    identity,
    ancestry,
    community,
    classSelection,
    progression,
    gold,
    thresholds,
    equipment,
    inventory,
    loadout,
    experiences,
    conditions,
    traits,
    coreScores,
    resources,
  };

  const handlers = {
    setIdentity,
    setAncestry,
    setCommunity,
    setClassSelection,
    setProgression,
    setGold,
    setThresholds,
    setEquipment,
    setInventory,
    setLoadout,
    setExperiences,
    setConditions,
    setTraits,
    setCoreScores,
    setResources,
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">📋 Character Sheet Demo</h1>
        <p className="text-muted-foreground">
          A complete character sheet showing all display components with edit
          capabilities. Click the ✏️ Edit button on any section to modify it.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="identity">👤 Identity</TabsTrigger>
          <TabsTrigger value="combat">⚔️ Combat</TabsTrigger>
          <TabsTrigger value="items">🎒 Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="identity">
          <IdentityTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="combat">
          <CombatTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="items">
          <ItemsTab state={state} handlers={handlers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
