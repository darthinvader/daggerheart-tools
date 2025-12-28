import { useState } from 'react';

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
  DEFAULT_CORE_SCORES,
} from '@/components/core-scores';
import {
  DEFAULT_EQUIPMENT_STATE,
  EquipmentDisplay,
  type EquipmentState,
} from '@/components/equipment';
import {
  ExperiencesDisplay,
  type ExperiencesState,
} from '@/components/experiences';
import { GoldDisplay } from '@/components/gold';
import { IdentityDisplay } from '@/components/identity-editor';
import { InventoryDisplay, type InventoryState } from '@/components/inventory';
import { LoadoutDisplay } from '@/components/loadout-selector';
import {
  DEFAULT_RESOURCES_STATE,
  ResourcesDisplay,
  type ResourcesState,
} from '@/components/resources';
import {
  ProgressionDisplay,
  type ProgressionState,
} from '@/components/shared/progression-display';
import { ThresholdsEditableSection } from '@/components/thresholds-editor';
import {
  DEFAULT_TRAITS_STATE,
  TraitsDisplay,
  type TraitsState,
} from '@/components/traits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import {
  type CommunitySelection,
  getAncestryByName,
  getCommunityByName,
} from '@/lib/schemas/identity';
import {
  DEFAULT_LOADOUT,
  type DomainCardLite,
  type LoadoutSelection,
} from '@/lib/schemas/loadout';

const sampleCard = (
  name: string,
  domain: string,
  level: number,
  type: string,
  hopeCost?: number
): DomainCardLite => ({
  name,
  domain,
  level,
  type,
  description: `A ${domain.toLowerCase()} ability: ${name.toLowerCase()}.`,
  hopeCost,
  recallCost: type === 'Spell' ? 1 : undefined,
});

const buildClassSelection = (): ClassSelection | null => {
  const gameClass = getClassByName('Wizard');
  const subclass = getSubclassByName('Wizard', 'School of Knowledge');
  if (!gameClass || !subclass) return null;
  return {
    mode: 'standard',
    className: 'Wizard',
    subclassName: 'School of Knowledge',
    domains: [...gameClass.domains],
    isHomebrew: false,
    spellcastTrait:
      'spellcastTrait' in subclass ? subclass.spellcastTrait : undefined,
  };
};

const SAMPLE_IDENTITY: IdentityFormValues = {
  name: 'Eryndor Ashwhisper',
  pronouns: 'he/him',
  calling: 'The Ember Sage',
  description:
    'A wandering scholar seeking ancient fire magic long thought lost to the ages.',
  background:
    'Former apprentice at the Arcane Academy who discovered forbidden texts.',
  descriptionDetails: {},
  connections: [
    {
      prompt: 'Who taught you magic?',
      answer: 'Archmage Theloria, before her disappearance.',
    },
  ],
};

const SAMPLE_ANCESTRY: AncestrySelection = {
  mode: 'standard',
  ancestry: getAncestryByName('Elf')!,
};

const SAMPLE_COMMUNITY: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Loreborne')!,
};

const SAMPLE_PROGRESSION: ProgressionState = {
  currentLevel: 3,
  currentTier: '2-4',
  experience: 750,
  experienceToNext: 1000,
};

const SAMPLE_GOLD: Gold = {
  handfuls: 5,
  bags: 2,
  chests: 0,
  coins: 0,
  showCoins: false,
};

const SAMPLE_THRESHOLDS: ThresholdsSettings = {
  auto: false,
  values: { major: 4, severe: 8, dsOverride: false, ds: 0 },
  enableCritical: false,
};

const SAMPLE_INVENTORY: InventoryState = {
  maxSlots: 30,
  items: [],
};

const SAMPLE_LOADOUT: LoadoutSelection = {
  ...DEFAULT_LOADOUT,
  mode: 'class-domains',
  classDomains: ['Sage', 'Arcana'],
  activeCards: [
    sampleCard('Firebolt', 'Arcana', 1, 'Spell', 1),
    sampleCard('Shield', 'Codex', 1, 'Ability', 2),
    sampleCard('Magic Missile', 'Arcana', 1, 'Spell', 1),
  ],
  vaultCards: [sampleCard('Counterspell', 'Arcana', 3, 'Spell', 2)],
  creationComplete: true,
};

const SAMPLE_EXPERIENCES: ExperiencesState = {
  items: [
    { id: '1', name: 'Arcane Studies', value: 3 },
    { id: '2', name: 'Combat Training', value: 2 },
  ],
};

const SAMPLE_CONDITIONS: ConditionsState = {
  items: ['Inspired'],
};

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

        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <IdentityDisplay identity={identity} onChange={setIdentity} />
            <ProgressionDisplay
              progression={progression}
              onChange={setProgression}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <AncestryDisplay selection={ancestry} onChange={setAncestry} />
            <CommunityDisplay selection={community} onChange={setCommunity} />
            <ClassDisplay
              selection={classSelection}
              onChange={setClassSelection}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TraitsDisplay traits={traits} onChange={setTraits} />
            <div className="space-y-6">
              <CoreScoresDisplay scores={coreScores} onChange={setCoreScores} />
              <ResourcesDisplay resources={resources} onChange={setResources} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ThresholdsEditableSection
              settings={thresholds}
              onChange={setThresholds}
              baseHp={6}
            />
            <GoldDisplay gold={gold} onChange={setGold} />
            <ConditionsDisplay
              conditions={conditions}
              onChange={setConditions}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ExperiencesDisplay
              experiences={experiences}
              onChange={setExperiences}
            />
            <EquipmentDisplay equipment={equipment} onChange={setEquipment} />
          </div>

          <LoadoutDisplay
            selection={loadout}
            onChange={setLoadout}
            classDomains={classSelection?.domains ?? ['Arcana', 'Codex']}
            tier={progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
          />

          <InventoryDisplay inventory={inventory} onChange={setInventory} />
        </TabsContent>

        <TabsContent value="identity" className="space-y-6 pt-4">
          <IdentityDisplay identity={identity} onChange={setIdentity} />
          <div className="grid gap-6 lg:grid-cols-2">
            <AncestryDisplay selection={ancestry} onChange={setAncestry} />
            <CommunityDisplay selection={community} onChange={setCommunity} />
          </div>
        </TabsContent>

        <TabsContent value="combat" className="space-y-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <ClassDisplay
              selection={classSelection}
              onChange={setClassSelection}
            />
            <div className="space-y-6">
              <ThresholdsEditableSection
                settings={thresholds}
                onChange={setThresholds}
                baseHp={6}
              />
              <GoldDisplay gold={gold} onChange={setGold} />
            </div>
          </div>
          <EquipmentDisplay equipment={equipment} onChange={setEquipment} />
          <LoadoutDisplay
            selection={loadout}
            onChange={setLoadout}
            classDomains={classSelection?.domains ?? ['Arcana', 'Codex']}
            tier={progression.currentTier as '1' | '2-4' | '5-7' | '8-10'}
          />
        </TabsContent>

        <TabsContent value="items" className="space-y-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InventoryDisplay inventory={inventory} onChange={setInventory} />
            </div>
            <div className="space-y-6">
              <GoldDisplay gold={gold} onChange={setGold} compactMode />
              <EquipmentDisplay equipment={equipment} onChange={setEquipment} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
