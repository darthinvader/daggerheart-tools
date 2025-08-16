import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// zod only used via imported schemas

import * as React from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { AncestryCard } from '@/components/characters/ancestry-card';
// No Card imports needed here; stub sections use dedicated components
import {
  ClassCardLazy,
  DomainsCardLazy,
  EquipmentCardLazy,
  InventoryCardLazy,
} from '@/components/characters/cards-lazy';
import { CommunityCard } from '@/components/characters/community-card';
import { ConditionsCard } from '@/components/characters/conditions-card';
import { CoreScoresCard } from '@/components/characters/core-scores-card';
import {
  AncestryDrawerLazy,
  ClassDrawerLazy,
  CommunityDrawerLazy,
  DomainsDrawerLazy,
  EquipmentDrawerLazy,
  IdentityDrawerLazy,
  InventoryDrawerLazy,
  LevelUpDrawerLazy,
} from '@/components/characters/drawers-lazy';
// Cards above are lazy-loaded via presenters
import { GoldCard } from '@/components/characters/gold-card';
import { IdentityCard } from '@/components/characters/identity-card';
import { LevelCard } from '@/components/characters/leveling/level-card';
// InventoryCard is lazy
// Lazy-load heavy drawers to trim initial bundle
import { ResourcesCard } from '@/components/characters/resources-card';
import { TraitsCard } from '@/components/characters/traits-card';
import { SheetHeader } from '@/components/layout/sheet-header';
// storage helpers moved to features/characters/storage
// QuickJump removed at user's request due to bugs; sticky header remains simple
import type { ComboboxItem } from '@/components/ui/combobox';
import {
  accessibleDomainsFor,
  countByType,
  createConditionActions,
  createResourceActions,
  createTraitActions,
  deriveFeatureUnlocks,
  getClassItems,
  getSubclassItems,
  groupByDomain,
  normalizeDomainLoadout,
  useWarmupModules,
} from '@/features/characters/logic';
import { useInventoryActions } from '@/features/characters/logic/inventory-actions';
import type {
  ClassDraft,
  ConditionsDraft,
  DomainsDraft,
  IdentityDraft,
  ResourcesDraft,
  TraitsDraft,
} from '@/features/characters/storage';
import {
  ClassDraftSchema,
  DEFAULT_CLASS,
  DEFAULT_DOMAINS,
  DEFAULT_IDENTITY,
  DEFAULT_RESOURCES,
  DEFAULT_TRAITS,
  DomainsDraftSchema,
  type EquipmentDraft,
  IdentityDraftSchema,
  type InventoryDraft,
  readClassFromStorage,
  readConditionsFromStorage,
  readCustomFeaturesFromStorage,
  readDomainsFromStorage,
  readEquipmentFromStorage,
  readFeaturesFromStorage,
  readIdentityFromStorage,
  readInventoryFromStorage,
  readLevelFromStorage,
  readLevelingFromStorage,
  readResourcesFromStorage,
  readTraitsFromStorage,
  writeClassToStorage,
  writeCustomFeaturesToStorage,
  writeDomainsToStorage,
  writeEquipmentToStorage,
  writeFeaturesToStorage,
  writeIdentityToStorage,
  writeInventoryToStorage,
  writeLevelToStorage,
  writeLevelingToStorage,
} from '@/features/characters/storage';
import type { LevelUpEntry } from '@/features/characters/storage';

function CharacterSheet() {
  const { id } = Route.useParams();
  // Lazy drawers centralized in presenters module

  // Warm up heavy drawer chunks during idle so opening feels instant
  useWarmupModules([
    () => import('@/components/characters/domains-drawer'),
    () => import('@/components/characters/equipment-drawer'),
    () => import('@/components/characters/inventory-drawer'),
  ]);

  const [identity, setIdentity] =
    React.useState<IdentityDraft>(DEFAULT_IDENTITY);
  const [openIdentity, setOpenIdentity] = React.useState(false);
  const [openAncestry, setOpenAncestry] = React.useState(false);
  const [openCommunity, setOpenCommunity] = React.useState(false);
  const [resources, setResources] =
    React.useState<ResourcesDraft>(DEFAULT_RESOURCES);
  const [traits, setTraits] = React.useState<TraitsDraft>(DEFAULT_TRAITS);
  const [conditions, setConditions] = React.useState<ConditionsDraft>([]);
  const [classDraft, setClassDraft] = React.useState<ClassDraft>(DEFAULT_CLASS);
  const [openClass, setOpenClass] = React.useState(false);
  const [openDomains, setOpenDomains] = React.useState(false);
  // Features UI merged into ClassDrawer
  const [openEquipment, setOpenEquipment] = React.useState(false);
  const [equipmentSection, setEquipmentSection] = React.useState<
    'primary' | 'secondary' | 'armor' | undefined
  >(undefined);
  const [openInventory, setOpenInventory] = React.useState(false);
  // Level up drawer also centralized

  const [domainsDraft, setDomainsDraft] =
    React.useState<DomainsDraft>(DEFAULT_DOMAINS);
  const [featureSelections, setFeatureSelections] = React.useState(() =>
    readFeaturesFromStorage(id)
  );
  const [customFeatures, setCustomFeatures] = React.useState(() =>
    readCustomFeaturesFromStorage(id)
  );
  const [equipment, setEquipment] = React.useState(() =>
    readEquipmentFromStorage(id)
  );
  const [inventory, setInventory] = React.useState(() =>
    readInventoryFromStorage(id)
  );
  // Character level (progression)
  const [currentLevel, setCurrentLevel] = React.useState(() =>
    readLevelFromStorage(id)
  );
  const [levelHistory, setLevelHistory] = React.useState<LevelUpEntry[]>(() =>
    readLevelingFromStorage(id)
  );
  const [openLevelUp, setOpenLevelUp] = React.useState(false);

  // Hydrate from localStorage when id changes

  React.useEffect(() => {
    setIdentity(readIdentityFromStorage(id));
    setResources(readResourcesFromStorage(id));
    setTraits(readTraitsFromStorage(id));
    setConditions(readConditionsFromStorage(id));
    setClassDraft(readClassFromStorage(id));
    setDomainsDraft(readDomainsFromStorage(id));
    setEquipment(readEquipmentFromStorage(id));
    setInventory(readInventoryFromStorage(id));
    setFeatureSelections(readFeaturesFromStorage(id));
    setCustomFeatures(readCustomFeaturesFromStorage(id));
    setCurrentLevel(readLevelFromStorage(id));
    setLevelHistory(readLevelingFromStorage(id));
  }, [id]);

  // Items for identity (ancestry/community now edited in dedicated drawers)

  // Items for class & subclass
  const classItems: ComboboxItem[] = React.useMemo(() => getClassItems(), []);
  const subclassItemsFor = React.useCallback(
    (className: string): ComboboxItem[] => getSubclassItems(className),
    []
  );

  const form = useForm<IdentityDraft>({
    resolver: zodResolver(IdentityDraftSchema) as never,
    mode: 'onChange',
    defaultValues: identity,
  });

  // Use ref to capture latest identity without triggering re-renders
  const identityRef = React.useRef(identity);
  identityRef.current = identity;

  // Only reset when drawer opens, using ref to get fresh data without loops
  React.useEffect(() => {
    if (openIdentity) form.reset(identityRef.current);
  }, [openIdentity, form]);

  React.useEffect(() => {
    if (openAncestry) form.reset(identityRef.current);
  }, [openAncestry, form]);

  React.useEffect(() => {
    if (openCommunity) form.reset(identityRef.current);
  }, [openCommunity, form]);

  const classForm = useForm<ClassDraft>({
    resolver: zodResolver(ClassDraftSchema) as never,
    mode: 'onChange',
    defaultValues: classDraft,
  });

  // Watch current class selection to drive subclass list options
  const currentClassName = classForm.watch('className') ?? classDraft.className;
  const accessibleDomains = React.useMemo(
    () => accessibleDomainsFor(currentClassName),
    [currentClassName]
  );
  React.useEffect(() => {
    if (openClass) classForm.reset(classDraft);
  }, [openClass, classDraft, classForm]);
  // Reset Domains form when opened
  const domainsForm = useForm<DomainsDraft>({
    resolver: zodResolver(DomainsDraftSchema) as never,
    mode: 'onChange',
    defaultValues: domainsDraft,
  });
  React.useEffect(() => {
    if (!openDomains) return;
    // Defer the reset to the next frame so the open animation starts smoothly
    const id = requestAnimationFrame(() => domainsForm.reset(domainsDraft));
    return () => cancelAnimationFrame(id);
  }, [openDomains, domainsDraft, domainsForm]);

  // When class changes in form, ensure subclass list is valid; if current subclass not in new list, set first
  React.useEffect(() => {
    const subscription = classForm.watch((values, { name }) => {
      if (name === 'className') {
        const items = subclassItemsFor(
          values.className ?? DEFAULT_CLASS.className
        );
        if (!items.find(i => i.value === values.subclass)) {
          classForm.setValue(
            'subclass',
            items[0]?.value ?? DEFAULT_CLASS.subclass,
            { shouldValidate: true }
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [classForm, subclassItemsFor]);

  const onSubmit = (values: IdentityDraft) => {
    setIdentity(values);
    writeIdentityToStorage(id, values);
    setOpenIdentity(false);
    setOpenAncestry(false);
    setOpenCommunity(false);
  };
  const submit = form.handleSubmit(values => onSubmit(values as IdentityDraft));
  const onSubmitClass = (values: ClassDraft) => {
    setClassDraft(values);
    writeClassToStorage(id, values);
    setOpenClass(false);
  };
  const submitClass = classForm.handleSubmit(v =>
    onSubmitClass(v as ClassDraft)
  );
  const onSubmitDomains = (values: DomainsDraft) => {
    setDomainsDraft(values);
    writeDomainsToStorage(id, values);
    setOpenDomains(false);
  };
  const submitDomains = domainsForm.handleSubmit(v =>
    onSubmitDomains(v as DomainsDraft)
  );

  // Features persistence
  const onSaveFeatures = React.useCallback(
    (next: Record<string, string | number | boolean>) => {
      setFeatureSelections(next);
      writeFeaturesToStorage(id, next);
    },
    [id]
  );

  const onSaveCustomFeatures = React.useCallback(
    (list: ReturnType<typeof readCustomFeaturesFromStorage>) => {
      setCustomFeatures(list);
      writeCustomFeaturesToStorage(id, list);
    },
    [id]
  );

  // Equipment form
  const equipmentForm = useForm<EquipmentDraft>({
    mode: 'onChange',
    defaultValues: equipment,
  });
  React.useEffect(() => {
    if (openEquipment) equipmentForm.reset(equipment);
  }, [openEquipment, equipment, equipmentForm]);
  const onSubmitEquipment = (values: EquipmentDraft) => {
    setEquipment(values);
    writeEquipmentToStorage(id, values);
    setOpenEquipment(false);
  };
  const submitEquipment = equipmentForm.handleSubmit(v =>
    onSubmitEquipment(v as EquipmentDraft)
  );

  // Inventory form
  const inventoryForm = useForm<InventoryDraft>({
    mode: 'onChange',
    defaultValues: inventory,
  });
  React.useEffect(() => {
    if (openInventory) inventoryForm.reset(inventory);
  }, [openInventory, inventory, inventoryForm]);
  const onSubmitInventory = (values: InventoryDraft) => {
    setInventory(values);
    writeInventoryToStorage(id, values);
    setOpenInventory(false);
  };
  const submitInventory = inventoryForm.handleSubmit(v =>
    onSubmitInventory(v as InventoryDraft)
  );

  // Inventory quick-edit handlers for card
  const {
    incQty: incInventoryQty,
    setQty: setInventoryQty,
    removeAt: removeInventoryAt,
    setLocation: setInventoryLocation,
  } = useInventoryActions(id, setInventory);

  // All domain cards are now lazy-loaded inside the Domains drawer to reduce route weight.

  // Normalize loadout/vault cards where description may be optional from storage
  const normalizedLoadout = React.useMemo(
    () => normalizeDomainLoadout(domainsDraft),
    [domainsDraft]
  );

  // Resource update helpers (extracted)
  const {
    updateStress,
    updateStressMax,
    updateHp,
    updateHpMax,
    updateHope,
    updateHopeMax,
    updateNumber,
    updateArmorScore,
    updateArmorScoreMax,
    setGold,
  } = createResourceActions(id, setResources);

  // Traits helpers (extracted)
  const { canIncrement, incTrait, toggleMarked } = createTraitActions(
    id,
    setTraits
  );

  // Conditions helpers (extracted)
  const { addCondition, removeCondition } = createConditionActions(
    id,
    setConditions
  );

  const onSaveLevelUp = React.useCallback(
    (values: {
      level: number;
      notes?: string;
      selections: Record<string, number>;
    }) => {
      const lv = Math.max(1, Math.min(10, Math.floor(values.level)));
      const entry = {
        level: lv,
        selections: values.selections ?? {},
        notes: values.notes,
      };
      // Record-only: do not mutate resources or traits; just capture what was selected.
      setLevelHistory(prev => {
        const next = [...prev.filter(e => e.level !== lv), entry].sort(
          (a, b) => a.level - b.level
        );
        writeLevelingToStorage(id, next);
        return next;
      });
      setCurrentLevel(lv);
      writeLevelToStorage(id, lv);
      setOpenLevelUp(false);
    },
    [id]
  );

  return (
    <div className="w-full pb-24">
      {/* Sticky header with summary and quick jump */}
      <SheetHeader
        id={id}
        identity={identity}
        resources={resources}
        traits={traits}
        conditions={conditions}
        classDraft={classDraft}
        domainsDraft={domainsDraft}
        equipment={equipment as EquipmentDraft}
        inventory={inventory as InventoryDraft}
        level={currentLevel}
        onDeltaHp={delta => updateHp(delta)}
        onDeltaStress={delta => updateStress(delta)}
        onDeltaHope={delta => updateHope(delta)}
        onDeltaArmorScore={delta => updateArmorScore(delta)}
        setIdentity={setIdentity}
        setResources={setResources}
        setTraits={setTraits}
        setConditions={setConditions}
        setClassDraft={setClassDraft}
        setDomainsDraft={setDomainsDraft}
        setEquipment={setEquipment}
        setInventory={setInventory}
        onEditName={() => setOpenIdentity(true)}
      />
      <div className="mx-auto max-w-screen-sm p-4">
        {/* Traits */}
        <section
          id="traits"
          aria-label="Traits"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <TraitsCard
            traits={
              traits as Record<string, { value: number; marked: boolean }>
            }
            canIncrement={k => canIncrement(k)}
            incTrait={(k, d) => incTrait(k, d)}
            toggleMarked={k => toggleMarked(k)}
          />
        </section>

        {/* Core Scores */}
        <section
          id="core"
          aria-label="Core scores"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <CoreScoresCard
            scores={{
              evasion: resources.evasion,
              proficiency: resources.proficiency,
            }}
            updateEvasion={delta => updateNumber('evasion', delta, 0)}
            updateProficiency={delta => updateNumber('proficiency', delta, 1)}
            id={id}
            updateHp={updateHp}
          />
        </section>

        {/* Class, Subclass, and Features */}
        <section
          id="class"
          aria-label="Class & Subclass"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <React.Suspense
            fallback={
              <div className="text-muted-foreground p-2 text-sm">
                Loading class…
              </div>
            }
          >
            <ClassCardLazy
              disabled={false}
              onEdit={() => setOpenClass(true)}
              selectedClass={classDraft.className}
              selectedSubclass={classDraft.subclass}
              level={currentLevel}
              features={(() => {
                const derived = deriveFeatureUnlocks(
                  classDraft.className,
                  classDraft.subclass
                );
                const custom = customFeatures.map(cf => ({
                  name: cf.name,
                  description: cf.description,
                  type: cf.type,
                  tags: cf.tags,
                  level: cf.level,
                  tier: cf.tier as never,
                  unlockCondition: cf.unlockCondition,
                  source: 'custom' as const,
                }));
                return [...derived, ...custom].sort((a, b) =>
                  a.level === b.level
                    ? a.name.localeCompare(b.name)
                    : a.level - b.level
                );
              })()}
              selections={featureSelections}
            />
          </React.Suspense>
        </section>
        <React.Suspense fallback={null}>
          <ClassDrawerLazy
            open={openClass}
            onOpenChange={setOpenClass}
            form={classForm as never}
            classItems={classItems}
            subclassItems={subclassItemsFor(currentClassName)}
            submit={submitClass}
            onCancel={() => setOpenClass(false)}
            level={currentLevel}
            selections={featureSelections}
            onSaveSelections={onSaveFeatures}
            custom={customFeatures}
            onSaveCustom={onSaveCustomFeatures}
          />
        </React.Suspense>

        {/* Level Up */}
        <section
          id="leveling"
          aria-label="Leveling"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <LevelCard
            level={currentLevel}
            onEdit={() => setOpenLevelUp(true)}
            onUndoLast={() => {
              setLevelHistory(prev => {
                if (prev.length === 0) return prev;
                const nextHistory = prev.slice(0, -1);
                writeLevelingToStorage(id, nextHistory);
                const nextLevel =
                  nextHistory.length > 0
                    ? nextHistory[nextHistory.length - 1].level
                    : 1;
                setCurrentLevel(nextLevel);
                writeLevelToStorage(id, nextLevel);
                return nextHistory;
              });
            }}
            onResetAll={() => {
              writeLevelingToStorage(id, []);
              setLevelHistory([]);
              setCurrentLevel(1);
              writeLevelToStorage(id, 1);
            }}
            recent={
              levelHistory.length > 0
                ? {
                    level: levelHistory[levelHistory.length - 1].level,
                    summary:
                      Object.entries(
                        levelHistory[levelHistory.length - 1].selections || {}
                      )
                        .map(([k, v]) => `${k} x${v}`)
                        .join(', ') || 'No selections',
                  }
                : null
            }
            history={levelHistory.map(h => ({
              level: h.level,
              summary:
                Object.entries(h.selections || {})
                  .map(([k, v]) => `${k} x${v}`)
                  .join(', ') || 'No selections',
            }))}
          />
        </section>
        <React.Suspense fallback={null}>
          <LevelUpDrawerLazy
            open={openLevelUp}
            onOpenChange={setOpenLevelUp}
            level={currentLevel}
            history={levelHistory}
            submit={onSaveLevelUp}
            onCancel={() => setOpenLevelUp(false)}
          />
        </React.Suspense>

        {/* Resources */}
        <section
          id="resources"
          aria-label="Resources"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <ResourcesCard
            id="resources"
            resources={{
              hp: resources.hp,
              stress: resources.stress,
              hope: resources.hope,
              armorScore: resources.armorScore,
            }}
            updateHp={updateHp}
            updateHpMax={updateHpMax}
            updateStress={updateStress}
            updateStressMax={updateStressMax}
            updateHope={delta => updateHope(delta)}
            updateHopeMax={delta => updateHopeMax(delta)}
            updateArmorScore={delta => updateArmorScore(delta)}
            updateArmorScoreMax={delta => updateArmorScoreMax(delta)}
          />
        </section>

        {/* Gold */}
        <section
          id="gold"
          aria-label="Gold"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <GoldCard gold={resources.gold} set={setGold} />
        </section>

        {/* Conditions */}
        <section
          id="conditions"
          aria-label="Conditions"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <ConditionsCard
            conditions={conditions}
            addCondition={addCondition}
            removeCondition={removeCondition}
          />
        </section>

        {/* Ancestry */}
        <section
          id="ancestry"
          aria-label="Ancestry"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <AncestryCard
            ancestry={identity.ancestry}
            ancestryDetails={identity.ancestryDetails as never}
            onEdit={() => setOpenAncestry(true)}
          />
        </section>
        <React.Suspense fallback={null}>
          <AncestryDrawerLazy
            open={openAncestry}
            onOpenChange={setOpenAncestry}
            form={form as never}
            submit={() => onSubmit(form.getValues() as IdentityDraft)}
            onCancel={() => setOpenAncestry(false)}
          />
        </React.Suspense>

        {/* Community */}
        <section
          id="community"
          aria-label="Community"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <CommunityCard
            community={identity.community}
            communityDetails={identity.communityDetails as never}
            onEdit={() => setOpenCommunity(true)}
          />
        </section>
        <React.Suspense fallback={null}>
          <CommunityDrawerLazy
            open={openCommunity}
            onOpenChange={setOpenCommunity}
            form={form as never}
            submit={() => onSubmit(form.getValues() as IdentityDraft)}
            onCancel={() => setOpenCommunity(false)}
          />
        </React.Suspense>

        {/* Equipment */}
        <section
          id="equipment"
          aria-label="Equipment"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <React.Suspense
            fallback={
              <div className="text-muted-foreground p-2 text-sm">
                Loading equipment…
              </div>
            }
          >
            <EquipmentCardLazy
              equipment={equipment as unknown as EquipmentDraft}
              onEdit={(section?: 'primary' | 'secondary' | 'armor') => {
                setEquipmentSection(section);
                setOpenEquipment(true);
              }}
            />
          </React.Suspense>
        </section>
        <React.Suspense fallback={null}>
          <EquipmentDrawerLazy
            open={openEquipment}
            onOpenChange={setOpenEquipment}
            form={equipmentForm as never}
            submit={submitEquipment}
            onCancel={() => setOpenEquipment(false)}
            section={equipmentSection}
          />
        </React.Suspense>

        {/* Inventory / Items */}
        <section
          id="inventory"
          aria-label="Inventory"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <React.Suspense
            fallback={
              <div className="text-muted-foreground p-2 text-sm">
                Loading inventory…
              </div>
            }
          >
            <InventoryCardLazy
              inventory={inventory as unknown as InventoryDraft}
              onEdit={() => setOpenInventory(true)}
              incQty={incInventoryQty}
              setQty={setInventoryQty}
              removeAt={removeInventoryAt}
              setLocation={setInventoryLocation}
            />
          </React.Suspense>
        </section>
        <React.Suspense fallback={null}>
          <InventoryDrawerLazy
            open={openInventory}
            onOpenChange={setOpenInventory}
            form={inventoryForm as never}
            submit={submitInventory}
            onCancel={() => setOpenInventory(false)}
          />
        </React.Suspense>

        {/* Domains & Loadout */}
        <section
          id="domains"
          aria-label="Domains"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <React.Suspense
            fallback={
              <div className="text-muted-foreground p-2 text-sm">
                Loading domains…
              </div>
            }
          >
            <DomainsCardLazy
              onEdit={() => setOpenDomains(true)}
              summary={{
                total: normalizedLoadout.length,
                byDomain: groupByDomain(normalizedLoadout).filter(g =>
                  accessibleDomains.includes(g.domain)
                ),
                byType: countByType(normalizedLoadout),
                sample: normalizedLoadout.slice(0, 3).map(c => c.name),
              }}
              recallUsed={normalizedLoadout.reduce(
                (sum, c) => sum + (c.recallCost ?? 0),
                0
              )}
              loadout={normalizedLoadout}
            />
          </React.Suspense>
        </section>
        <React.Suspense fallback={null}>
          <DomainsDrawerLazy
            open={openDomains}
            onOpenChange={setOpenDomains}
            form={domainsForm as never}
            accessibleDomains={accessibleDomains as string[]}
            submit={submitDomains}
            onCancel={() => setOpenDomains(false)}
            startingLimit={3}
            softLimit={6}
          />
        </React.Suspense>

        {/* Identity */}
        <section
          id="identity"
          aria-label="Identity"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <IdentityCard
            identity={{
              name: identity.name,
              pronouns: identity.pronouns,
              description: identity.description,
              calling: identity.calling,
              connections: Array.isArray(
                (identity as Record<string, unknown>).connections
              )
                ? (
                    identity as unknown as {
                      connections: { prompt: string; answer: string }[];
                    }
                  ).connections
                : [],
            }}
            onEdit={() => setOpenIdentity(true)}
          />
        </section>
        <React.Suspense
          fallback={
            <div className="text-muted-foreground p-4 text-sm">Loading…</div>
          }
        >
          <IdentityDrawerLazy
            open={openIdentity}
            onOpenChange={setOpenIdentity}
            form={form as never}
            submit={submit}
            onCancel={() => setOpenIdentity(false)}
          />
        </React.Suspense>
      </div>

      {/* Bottom action bar removed */}
    </div>
  );
}

export const Route = createFileRoute('/characters/$id')({
  component: CharacterSheet,
});

// QuickJump extracted to components/layout/quick-jump
