import { useCallback, useState } from 'react';

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
import { LevelUpModal, type LevelUpResult } from '@/components/level-up';
import {
  DEFAULT_RESOURCES_STATE,
  type ResourcesState,
} from '@/components/resources';
import { type ProgressionState } from '@/components/shared/progression-display';
import { DEFAULT_TRAITS_STATE, type TraitsState } from '@/components/traits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCardByName } from '@/lib/data/domains';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CommunitySelection } from '@/lib/schemas/identity';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';

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

  const [unlockedSubclassFeatures, setUnlockedSubclassFeatures] = useState<
    Record<string, string[]>
  >({});

  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);

  const handleLevelUp = useCallback(() => {
    setIsLevelUpOpen(true);
  }, []);

  const handleLevelUpConfirm = useCallback(
    (result: LevelUpResult) => {
      const currentTier = progression.currentTier;
      const tierChanged = result.newTier !== currentTier;

      const updatedTierHistory = tierChanged
        ? {}
        : { ...progression.tierHistory };

      for (const selection of result.selections) {
        updatedTierHistory[selection.optionId] =
          (updatedTierHistory[selection.optionId] ?? 0) + selection.count;
      }

      setProgression({
        currentLevel: result.newLevel,
        currentTier: result.newTier,
        tierHistory: updatedTierHistory,
      });

      if (result.automaticBenefits.proficiencyGained) {
        setCoreScores(prev => ({
          ...prev,
          proficiency: prev.proficiency + 1,
        }));
      }

      if (
        result.automaticBenefits.experienceGained &&
        result.automaticBenefits.experienceName
      ) {
        const expSelection = result.selections.find(
          s => s.optionId === 'experiences'
        );
        const boostedNewExp = expSelection?.details?.selectedExperiences?.some(
          id => id === `new-exp-${result.newLevel}`
        );
        setExperiences(prev => ({
          items: [
            ...prev.items,
            {
              id: crypto.randomUUID(),
              name: result.automaticBenefits.experienceName!,
              value: boostedNewExp ? 3 : 2,
            },
          ],
        }));
      }

      if (result.automaticBenefits.freeDomainCard) {
        const card = getCardByName(result.automaticBenefits.freeDomainCard);
        if (card) {
          const cardLite: DomainCardLite = {
            name: card.name,
            domain: String(card.domain),
            level: card.level,
            type: String(card.type),
            description: card.description,
            hopeCost: card.hopeCost,
            recallCost: card.recallCost,
          };
          setLoadout(prev => {
            const maxActive = 5;
            if (prev.activeCards.length < maxActive) {
              return { ...prev, activeCards: [...prev.activeCards, cardLite] };
            }
            return { ...prev, vaultCards: [...prev.vaultCards, cardLite] };
          });
        }
      }

      if (result.automaticBenefits.traitsCleared) {
        setTraits(prev => {
          const cleared = { ...prev };
          for (const key of Object.keys(cleared) as (keyof TraitsState)[]) {
            cleared[key] = { ...cleared[key], marked: false };
          }
          return cleared;
        });
      }

      for (const selection of result.selections) {
        switch (selection.optionId) {
          case 'traits':
            if (selection.details?.selectedTraits) {
              setTraits(prev => {
                const updated = { ...prev };
                for (const traitName of selection.details!.selectedTraits!) {
                  const key = traitName as keyof TraitsState;
                  if (updated[key]) {
                    updated[key] = {
                      ...updated[key],
                      value: updated[key].value + 1,
                      marked: true,
                    };
                  }
                }
                return updated;
              });
            }
            break;
          case 'experiences':
            if (selection.details?.selectedExperiences) {
              const newExpId = `new-exp-${result.newLevel}`;
              const regularExpIds =
                selection.details.selectedExperiences.filter(
                  id => id !== newExpId
                );
              if (regularExpIds.length > 0) {
                setExperiences(prev => ({
                  items: prev.items.map(exp =>
                    regularExpIds.includes(exp.id)
                      ? { ...exp, value: exp.value + 1 }
                      : exp
                  ),
                }));
              }
            }
            break;
          case 'hp':
            setResources(prev => ({
              ...prev,
              hp: { ...prev.hp, max: prev.hp.max + selection.count },
            }));
            break;
          case 'stress':
            setResources(prev => ({
              ...prev,
              stress: {
                ...prev.stress,
                max: prev.stress.max + selection.count,
              },
            }));
            break;
          case 'evasion':
            setCoreScores(prev => ({
              ...prev,
              evasion: prev.evasion + selection.count,
            }));
            break;
          case 'proficiency':
            setCoreScores(prev => ({
              ...prev,
              proficiency: prev.proficiency + selection.count,
            }));
            break;
          case 'domain-card':
            if (selection.details?.selectedDomainCard) {
              const card = getCardByName(selection.details.selectedDomainCard);
              if (card) {
                const cardLite: DomainCardLite = {
                  name: card.name,
                  domain: String(card.domain),
                  level: card.level,
                  type: String(card.type),
                  description: card.description,
                  hopeCost: card.hopeCost,
                  recallCost: card.recallCost,
                };
                setLoadout(prev => {
                  const maxActive = 5;
                  if (prev.activeCards.length < maxActive) {
                    return {
                      ...prev,
                      activeCards: [...prev.activeCards, cardLite],
                    };
                  }
                  return {
                    ...prev,
                    vaultCards: [...prev.vaultCards, cardLite],
                  };
                });
              }
            }
            break;
          case 'multiclass':
            if (selection.details?.selectedMulticlass) {
              const mc = selection.details.selectedMulticlass;
              setClassSelection(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  isMulticlass: true,
                  classes: [
                    ...(prev.classes ?? [
                      {
                        className: prev.className,
                        subclassName: prev.subclassName,
                        spellcastTrait: prev.spellcastTrait,
                      },
                    ]),
                    {
                      className: mc.className,
                      subclassName: mc.subclassName,
                    },
                  ],
                  domains: [...new Set([...prev.domains, ...mc.domains])],
                };
              });
              setLoadout(prev => ({
                ...prev,
                classDomains: [
                  ...new Set([...prev.classDomains, ...mc.domains]),
                ],
              }));
            }
            break;
          case 'subclass':
            if (selection.details?.selectedSubclassUpgrade) {
              const upgrade = selection.details.selectedSubclassUpgrade;
              const key = `${upgrade.className}:${upgrade.subclassName}`;
              setUnlockedSubclassFeatures(prev => ({
                ...prev,
                [key]: [...(prev[key] ?? []), upgrade.featureName],
              }));
            }
            break;
        }
      }

      setThresholds(prev => ({
        ...prev,
        values: {
          ...prev.values,
          major: prev.values.major + 1,
          severe: prev.values.severe + 1,
        },
      }));

      setIsLevelUpOpen(false);
    },
    [progression.currentTier, progression.tierHistory]
  );

  const currentTraitsForModal = Object.entries(traits).map(([name, val]) => ({
    name,
    marked: val.marked,
  }));

  const currentExperiencesForModal = experiences.items.map(exp => ({
    id: exp.id,
    name: exp.name,
    value: exp.value,
  }));

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
    unlockedSubclassFeatures,
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
    onLevelUp: handleLevelUp,
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

      <LevelUpModal
        isOpen={isLevelUpOpen}
        onClose={() => setIsLevelUpOpen(false)}
        onConfirm={handleLevelUpConfirm}
        currentLevel={progression.currentLevel}
        currentTier={progression.currentTier}
        currentTraits={currentTraitsForModal}
        currentExperiences={currentExperiencesForModal}
        tierHistory={progression.tierHistory}
        classSelection={classSelection}
        unlockedSubclassFeatures={unlockedSubclassFeatures}
        ownedCardNames={[
          ...loadout.activeCards.map(c => c.name),
          ...loadout.vaultCards.map(c => c.name),
        ]}
      />
    </div>
  );
}
