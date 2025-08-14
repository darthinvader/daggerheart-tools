import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// zod only used via imported schemas

import * as React from 'react';

import { Link, createFileRoute } from '@tanstack/react-router';

import { AncestryCard } from '@/components/characters/ancestry-card';
// No Card imports needed here; stub sections use dedicated components
import { CharacterJsonMenu } from '@/components/characters/character-json-menu';
import { ClassCard } from '@/components/characters/class-card';
import { CommunityCard } from '@/components/characters/community-card';
import { ConditionsCard } from '@/components/characters/conditions-card';
import { CoreScoresCard } from '@/components/characters/core-scores-card';
import { DomainsCard } from '@/components/characters/domains-card';
import { EquipmentCard } from '@/components/characters/equipment-card';
import { GoldCard } from '@/components/characters/gold-card';
import { IdentityCard } from '@/components/characters/identity-card';
import { InventoryCard } from '@/components/characters/inventory-card';
// Lazy-load heavy drawers to trim initial bundle
import { ResourcesCard } from '@/components/characters/resources-card';
import { SummaryStats } from '@/components/characters/summary-stats';
import { TraitsCard } from '@/components/characters/traits-card';
// storage helpers moved to features/characters/storage
// QuickJump removed at user's request due to bugs; sticky header remains simple
import { Button } from '@/components/ui/button';
import type { ComboboxItem } from '@/components/ui/combobox';
import {
  countByType,
  createConditionActions,
  createResourceActions,
  createTraitActions,
  groupByDomain,
} from '@/features/characters/logic';
import { deriveFeatureUnlocks } from '@/features/characters/logic';
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
  readResourcesFromStorage,
  readTraitsFromStorage,
  writeClassToStorage,
  writeCustomFeaturesToStorage,
  writeDomainsToStorage,
  writeEquipmentToStorage,
  writeFeaturesToStorage,
  writeIdentityToStorage,
  writeInventoryToStorage,
} from '@/features/characters/storage';
import { ALL_CLASSES } from '@/lib/data/classes';

function CharacterSheet() {
  const { id } = Route.useParams();
  const IdentityDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/identity-drawer').then(m => ({
          default: m.IdentityDrawer,
        }))
      ),
    []
  );
  const AncestryDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/ancestry-drawer').then(m => ({
          default: m.AncestryDrawer,
        }))
      ),
    []
  );
  const CommunityDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/community-drawer').then(m => ({
          default: m.CommunityDrawer,
        }))
      ),
    []
  );
  const ClassDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/class-drawer').then(m => ({
          default: m.ClassDrawer,
        }))
      ),
    []
  );
  // Features drawer removed: features editing is embedded into the Class drawer
  const DomainsDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/domains-drawer').then(m => ({
          default: m.DomainsDrawer,
        }))
      ),
    []
  );
  const EquipmentDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/equipment-drawer').then(m => ({
          default: m.EquipmentDrawer,
        }))
      ),
    []
  );
  const InventoryDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/inventory-drawer').then(m => ({
          default: m.InventoryDrawer,
        }))
      ),
    []
  );

  // Warm up the Domains drawer chunk after mount/idle so opening feels instant.
  React.useEffect(() => {
    // Warm up the Domains drawer chunk after idle to make opening feel instant.
    const cleanup = (async () => {
      const { prefetchOnIdle } = await import('@/features/characters/prefetch');
      return prefetchOnIdle(() => {
        void import('@/components/characters/domains-drawer');
      });
    })();
    // When the promise resolves to a cleanup function, attach it
    let disposer: undefined | (() => void);
    cleanup.then(fn => {
      if (typeof fn === 'function') disposer = fn;
    });
    return () => {
      if (disposer) disposer();
    };
  }, []);

  // Warm up the Equipment drawer chunk during idle
  React.useEffect(() => {
    const cleanup = (async () => {
      const { prefetchOnIdle } = await import('@/features/characters/prefetch');
      return prefetchOnIdle(() => {
        void import('@/components/characters/equipment-drawer');
      });
    })();
    let disposer: undefined | (() => void);
    cleanup.then(fn => {
      if (typeof fn === 'function') disposer = fn;
    });
    return () => {
      if (disposer) disposer();
    };
  }, []);

  // Warm up the Inventory drawer chunk during idle
  React.useEffect(() => {
    const cleanup = (async () => {
      const { prefetchOnIdle } = await import('@/features/characters/prefetch');
      return prefetchOnIdle(() => {
        void import('@/components/characters/inventory-drawer');
      });
    })();
    let disposer: undefined | (() => void);
    cleanup.then(fn => {
      if (typeof fn === 'function') disposer = fn;
    });
    return () => {
      if (disposer) disposer();
    };
  }, []);

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
  }, [id]);

  // Items for identity (ancestry/community now edited in dedicated drawers)

  // Items for class & subclass
  const classItems: ComboboxItem[] = React.useMemo(
    () => ALL_CLASSES.map(c => ({ value: c.name, label: c.name })),
    []
  );
  const subclassItemsFor = React.useCallback(
    (className: string): ComboboxItem[] => {
      const found = ALL_CLASSES.find(c => c.name === className);
      if (!found) return [];
      const subclasses = (
        (found as unknown as { subclasses?: { name: string }[] }).subclasses ??
        []
      ).map(s => s.name);
      return subclasses.map(name => ({ value: name, label: name }));
    },
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
  const accessibleDomains = React.useMemo(() => {
    const found = ALL_CLASSES.find(c => c.name === currentClassName);
    return (
      (found && (found as unknown as { domains?: string[] }).domains) || []
    );
  }, [currentClassName]);
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
  const incInventoryQty = React.useCallback(
    (index: number, delta: number) => {
      setInventory(prev => {
        const slots = prev.slots ?? [];
        const list = [...slots];
        const cur = list[index];
        if (!cur) return prev;
        const next = Math.max(0, (cur.quantity ?? 1) + delta);
        if (next <= 0) {
          list.splice(index, 1);
        } else {
          list[index] = { ...cur, quantity: next };
        }
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id]
  );
  const setInventoryQty = React.useCallback(
    (index: number, value: number) => {
      setInventory(prev => {
        const slots = prev.slots ?? [];
        const list = [...slots];
        const cur = list[index];
        if (!cur) return prev;
        if (value <= 0) {
          list.splice(index, 1);
        } else {
          list[index] = { ...cur, quantity: value };
        }
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id]
  );
  const removeInventoryAt = React.useCallback(
    (index: number) => {
      setInventory(prev => {
        const list = (prev.slots ?? []).filter((_, i) => i !== index);
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id]
  );
  const setInventoryLocation = React.useCallback(
    (
      index: number,
      loc: 'backpack' | 'belt' | 'equipped' | 'stored' | (string & {})
    ) => {
      setInventory(prev => {
        const list = [...(prev.slots ?? [])];
        if (!list[index]) return prev;
        list[index] = {
          ...list[index],
          location: loc,
          // Keep flags in sync so outside can equip/unequip items that were equipped inside the drawer
          isEquipped: loc === 'equipped',
        };
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id]
  );

  // All domain cards are now lazy-loaded inside the Domains drawer to reduce route weight.

  // Normalize loadout/vault cards where description may be optional from storage
  const normalizedLoadout = React.useMemo(
    () =>
      domainsDraft.loadout.map(c => ({
        ...c,
        description: c.description ?? '',
      })),
    [domainsDraft.loadout]
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

  return (
    <div className="w-full pb-24">
      {/* Sticky header with summary and quick jump */}
      <div
        id="sheet-header"
        className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 border-b backdrop-blur"
      >
        <div className="mx-auto grid w-full max-w-screen-sm grid-cols-[1fr_auto] items-center gap-2 px-4 py-0">
          <div className="text-foreground min-w-0 text-lg leading-tight font-semibold">
            <button
              type="button"
              aria-label="Edit name"
              onClick={() => setOpenIdentity(true)}
              className="line-clamp-2 block max-w-full cursor-pointer text-left text-lg font-semibold break-words hover:underline"
              title={identity.name || 'Set a name'}
            >
              {identity.name ? (
                identity.name
              ) : (
                <span className="text-muted-foreground font-normal">
                  Set a name
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Button asChild size="sm" variant="ghost">
              <Link to="/characters">Back</Link>
            </Button>
            {/* Export/Import */}
            <CharacterJsonMenu
              id={id}
              identity={identity}
              resources={resources}
              traits={traits}
              conditions={conditions}
              classDraft={classDraft}
              domainsDraft={domainsDraft}
              equipment={equipment}
              inventory={inventory}
              setIdentity={setIdentity}
              setResources={setResources}
              setTraits={setTraits}
              setConditions={setConditions}
              setClassDraft={setClassDraft}
              setDomainsDraft={setDomainsDraft}
              setEquipment={setEquipment}
              setInventory={setInventory}
            />
          </div>
        </div>
        {/* QuickJump removed per request */}
      </div>
      <div className="mx-auto max-w-screen-sm p-4">
        {/* Summary section */}
        <section
          id="summary"
          aria-label="Summary"
          className="scroll-mt-24 space-y-4 md:scroll-mt-28"
        >
          <SummaryStats id={id} identity={identity} resources={resources} />
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

        {/* Resources prioritized for gameplay */}
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
            }}
            updateHp={updateHp}
            updateHpMax={updateHpMax}
            updateStress={updateStress}
            updateStressMax={updateStressMax}
            updateHope={delta => updateHope(delta)}
            updateHopeMax={delta => updateHopeMax(delta)}
          />
        </section>

        {/* Thresholds moved inline with Core Scores */}

        {/* Quick stats: Evasion, Hope, Proficiency */}
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

        {/* Gold */}
        <section
          id="gold"
          aria-label="Gold"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <GoldCard gold={resources.gold} set={setGold} />
        </section>

        {/* Identity section */}
        <section
          id="identity"
          aria-label="Identity"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <IdentityCard
            identity={{ name: identity.name, pronouns: identity.pronouns }}
            onEdit={() => setOpenIdentity(true)}
          />
        </section>

        {/* Identity Drawer */}
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
          <EquipmentCard
            equipment={equipment as unknown as EquipmentDraft}
            onEdit={section => {
              setEquipmentSection(section);
              setOpenEquipment(true);
            }}
          />
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

        {/* Inventory */}
        <section
          id="inventory"
          aria-label="Inventory"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <InventoryCard
            inventory={inventory as unknown as InventoryDraft}
            onEdit={() => setOpenInventory(true)}
            incQty={incInventoryQty}
            setQty={setInventoryQty}
            removeAt={removeInventoryAt}
            setLocation={setInventoryLocation}
          />
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

        {/* Class, Subclass, and Features */}
        <section
          id="class"
          aria-label="Class & Subclass"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <ClassCard
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
        {/* Domains */}
        <section
          id="domains"
          aria-label="Domains"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <DomainsCard
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
        {/* Domains & Equipment sections removed per UX: empty stubs don't add value */}
      </div>

      {/* Bottom action bar removed */}
    </div>
  );
}

export const Route = createFileRoute('/characters/$id')({
  component: CharacterSheet,
});

// QuickJump extracted to components/layout/quick-jump
