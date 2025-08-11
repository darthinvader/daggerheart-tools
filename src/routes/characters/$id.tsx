import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// zod only used via imported schemas

import * as React from 'react';

import { Link, createFileRoute } from '@tanstack/react-router';

// No Card imports needed here; stub sections use dedicated components
import { CharacterJsonMenu } from '@/components/characters/character-json-menu';
import { ClassCard } from '@/components/characters/class-card';
import { ConditionsCard } from '@/components/characters/conditions-card';
import { CoreScoresCard } from '@/components/characters/core-scores-card';
import { DomainsCard } from '@/components/characters/domains-card';
import { EquipmentCard } from '@/components/characters/equipment-card';
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
  readDomainsFromStorage,
  readEquipmentFromStorage,
  readIdentityFromStorage,
  readInventoryFromStorage,
  readResourcesFromStorage,
  readTraitsFromStorage,
  writeClassToStorage,
  writeDomainsToStorage,
  writeEquipmentToStorage,
  writeIdentityToStorage,
  writeInventoryToStorage,
} from '@/features/characters/storage';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';
import { COMMUNITIES } from '@/lib/data/characters/communities';
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
  const ClassDrawerLazy = React.useMemo(
    () =>
      React.lazy(() =>
        import('@/components/characters/class-drawer').then(m => ({
          default: m.ClassDrawer,
        }))
      ),
    []
  );
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
    // Prefer requestIdleCallback when available to avoid competing with user work.
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const warm = () => {
      // Fire and forget; the dynamic import will be cached by the module loader.
      void import('@/components/characters/domains-drawer');
    };
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback!(warm);
    } else {
      // Fallback to next tick if rIC is unavailable (SSR-safe by hook location)
      timeoutId = window.setTimeout(warm, 0);
    }
    return () => {
      if (idleId && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback!(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const [identity, setIdentity] =
    React.useState<IdentityDraft>(DEFAULT_IDENTITY);
  const [openIdentity, setOpenIdentity] = React.useState(false);
  const [resources, setResources] =
    React.useState<ResourcesDraft>(DEFAULT_RESOURCES);
  const [traits, setTraits] = React.useState<TraitsDraft>(DEFAULT_TRAITS);
  const [conditions, setConditions] = React.useState<ConditionsDraft>([]);
  const [classDraft, setClassDraft] = React.useState<ClassDraft>(DEFAULT_CLASS);
  const [openClass, setOpenClass] = React.useState(false);
  const [openDomains, setOpenDomains] = React.useState(false);
  const [openEquipment, setOpenEquipment] = React.useState(false);
  const [equipmentSection, setEquipmentSection] = React.useState<
    'primary' | 'secondary' | 'armor' | undefined
  >(undefined);
  const [openInventory, setOpenInventory] = React.useState(false);

  const [domainsDraft, setDomainsDraft] =
    React.useState<DomainsDraft>(DEFAULT_DOMAINS);
  const [equipment, setEquipment] = React.useState(() =>
    readEquipmentFromStorage(id)
  );
  const [inventory, setInventory] = React.useState(() =>
    readInventoryFromStorage(id)
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
  }, [id]);

  // Items for identity
  const ancestryItems: ComboboxItem[] = React.useMemo(
    () => ANCESTRIES.map(a => ({ value: a.name, label: a.name })),
    []
  );
  const communityItems: ComboboxItem[] = React.useMemo(
    () => COMMUNITIES.map(c => ({ value: c.name, label: c.name })),
    []
  );

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
    if (openIdentity) form.reset(identity);
  }, [openIdentity, identity, form]);
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
        <div className="mx-auto flex max-w-screen-sm flex-wrap items-center justify-between gap-2 px-4 py-0 sm:flex-nowrap">
          <h1 className="text-sm font-medium sm:text-lg sm:font-semibold">
            <button
              type="button"
              aria-label="Edit name"
              onClick={() => setOpenIdentity(true)}
              className="cursor-pointer text-left hover:underline"
            >
              {identity.name ? (
                identity.name
              ) : (
                <span className="text-muted-foreground font-normal">
                  Set a name
                </span>
              )}
            </button>
          </h1>
          <div className="flex items-center gap-1">
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
            resources={{ hp: resources.hp, stress: resources.stress }}
            updateHp={updateHp}
            updateHpMax={updateHpMax}
            updateStress={updateStress}
            updateStressMax={updateStressMax}
          />
        </section>

        {/* Quick stats: Evasion, Hope, Proficiency */}
        <section
          id="core"
          aria-label="Core scores"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <CoreScoresCard
            scores={{
              evasion: resources.evasion,
              hope: resources.hope,
              proficiency: resources.proficiency,
            }}
            updateEvasion={delta => updateNumber('evasion', delta, 0)}
            updateHope={delta => updateHope(delta)}
            updateHopeMax={delta => updateHopeMax(delta)}
            updateProficiency={delta => updateNumber('proficiency', delta, 1)}
          />
        </section>

        {/* Identity section */}
        <section
          id="identity"
          aria-label="Identity"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <IdentityCard
            identity={identity}
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
            ancestryItems={ancestryItems}
            communityItems={communityItems}
            submit={submit}
            onCancel={() => setOpenIdentity(false)}
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

        {/* Class & Subclass */}
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
