import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// zod only used via imported schemas

import * as React from 'react';

import { Link, createFileRoute } from '@tanstack/react-router';

import { ClassCard } from '@/components/characters/class-card';
import { ConditionsCard } from '@/components/characters/conditions-card';
import { CoreScoresCard } from '@/components/characters/core-scores-card';
import { DomainsCard } from '@/components/characters/domains-card';
import { IdentityCard } from '@/components/characters/identity-card';
// Lazy-load heavy drawers to trim initial bundle
import { ResourcesCard } from '@/components/characters/resources-card';
import { SummaryStats } from '@/components/characters/summary-stats';
import { TraitsCard } from '@/components/characters/traits-card';
import { Button } from '@/components/ui/button';
// No Card imports needed here; stub sections use dedicated components
import type { ComboboxItem } from '@/components/ui/combobox';
// storage helpers moved to features/characters/storage
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
  IdentityDraftSchema,
  readClassFromStorage,
  readConditionsFromStorage,
  readDomainsFromStorage,
  readIdentityFromStorage,
  readResourcesFromStorage,
  readTraitsFromStorage,
  writeClassToStorage,
  writeConditionsToStorage,
  writeDomainsToStorage,
  writeIdentityToStorage,
  writeResourcesToStorage,
  writeTraitsToStorage,
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

  function writeDomainsToStorageLocal(id: string, value: DomainsDraft) {
    writeDomainsToStorage(id, value);
  }
  const [domainsDraft, setDomainsDraft] =
    React.useState<DomainsDraft>(DEFAULT_DOMAINS);

  // Hydrate from localStorage when id changes

  React.useEffect(() => {
    setIdentity(readIdentityFromStorage(id));
    setResources(readResourcesFromStorage(id));
    setTraits(readTraitsFromStorage(id));
    setConditions(readConditionsFromStorage(id));
    setClassDraft(readClassFromStorage(id));
    setDomainsDraft(readDomainsFromStorage(id));
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
    writeDomainsToStorageLocal(id, values);
    setOpenDomains(false);
  };
  const submitDomains = domainsForm.handleSubmit(v =>
    onSubmitDomains(v as DomainsDraft)
  );

  // All domain cards are now lazy-loaded inside the Domains drawer to reduce route weight.

  // Helpers for resources updates
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const updateStress = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        stress: {
          current: clamp(prev.stress.current + delta, 0, prev.stress.max),
          max: prev.stress.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };
  const updateStressMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(1, prev.stress.max + delta);
      const current = clamp(prev.stress.current, 0, max);
      const next: ResourcesDraft = { ...prev, stress: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };
  const updateHp = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        hp: {
          current: clamp(prev.hp.current + delta, 0, prev.hp.max),
          max: prev.hp.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };
  const updateHpMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(1, prev.hp.max + delta);
      const current = clamp(prev.hp.current, 0, max);
      const next: ResourcesDraft = { ...prev, hp: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };
  const updateHope = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        hope: {
          current: clamp(prev.hope.current + delta, 0, prev.hope.max),
          max: prev.hope.max,
        },
      } as ResourcesDraft;
      writeResourcesToStorage(id, next);
      return next;
    });
  };
  const updateHopeMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(1, prev.hope.max + delta);
      const current = clamp(prev.hope.current, 0, max);
      const next: ResourcesDraft = {
        ...prev,
        hope: { current, max },
      } as ResourcesDraft;
      writeResourcesToStorage(id, next);
      return next;
    });
  };
  const updateNumber = <K extends keyof ResourcesDraft>(
    key: K,
    delta: number,
    min: number
  ) => {
    setResources(prev => {
      const nextValue = Math.max(min, (prev[key] as number) + delta);
      const next: ResourcesDraft = {
        ...prev,
        [key]: nextValue,
      } as ResourcesDraft;
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  // Traits helpers
  const canIncrement = (_key: string) => true;
  const incTrait = (key: string, delta: 1 | -1) => {
    setTraits(prev => {
      const current = prev[key].value;
      const nextValue = delta === 1 ? current + 1 : current - 1;
      const next: TraitsDraft = {
        ...prev,
        [key]: { ...prev[key], value: nextValue },
      } as TraitsDraft;
      writeTraitsToStorage(id, next);
      return next;
    });
  };
  const toggleMarked = (key: string) => {
    setTraits(prev => {
      const next: TraitsDraft = {
        ...prev,
        [key]: { ...prev[key], marked: !prev[key].marked },
      } as TraitsDraft;
      writeTraitsToStorage(id, next);
      return next;
    });
  };

  // Conditions helpers
  const addCondition = (label: string) => {
    const value = label.trim();
    if (!value) return;
    setConditions(prev => {
      const next = Array.from(new Set([...prev, value])).slice(0, 12);
      writeConditionsToStorage(id, next);
      return next;
    });
  };
  const removeCondition = (label: string) => {
    setConditions(prev => {
      const next = prev.filter(c => c !== label);
      writeConditionsToStorage(id, next);
      return next;
    });
  };

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <h1 className="text-xl font-semibold">
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Currently, edits auto-persist; this provides user feedback.
              toast('Saved');
            }}
          >
            Save
          </Button>
          <Button asChild variant="ghost">
            <Link to="/characters">Go to Characters</Link>
          </Button>
        </div>
      </div>

      {/* Summary section */}
      <SummaryStats id={id} identity={identity} resources={resources} />

      {/* Conditions (gameplay-important) */}
      <ConditionsCard
        conditions={conditions}
        addCondition={addCondition}
        removeCondition={removeCondition}
      />

      {/* Resources prioritized for gameplay */}
      <ResourcesCard
        id="resources"
        resources={{ hp: resources.hp, stress: resources.stress }}
        updateHp={updateHp}
        updateHpMax={updateHpMax}
        updateStress={updateStress}
        updateStressMax={updateStressMax}
      />

      {/* Quick stats: Evasion, Hope, Proficiency */}
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

      {/* Identity section */}
      <IdentityCard identity={identity} onEdit={() => setOpenIdentity(true)} />

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

      {/* Class & Subclass */}
      <ClassCard
        disabled={false}
        onEdit={() => setOpenClass(true)}
        selectedClass={classDraft.className}
        selectedSubclass={classDraft.subclass}
      />
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
      <DomainsCard
        onEdit={() => setOpenDomains(true)}
        summary={{
          total: domainsDraft.loadout.length,
          byDomain: accessibleDomains.map(d => ({
            domain: d,
            count: domainsDraft.loadout.filter(c => String(c.domain) === d)
              .length,
          })),
          byType: [
            {
              type: 'Spell',
              count: domainsDraft.loadout.filter(c => c.type === 'Spell')
                .length,
            },
            {
              type: 'Ability',
              count: domainsDraft.loadout.filter(c => c.type === 'Ability')
                .length,
            },
          ],
          sample: domainsDraft.loadout.slice(0, 3).map(c => c.name),
        }}
        loadout={domainsDraft.loadout.map(c => ({
          ...c,
          description: c.description ?? '',
        }))}
      />
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
      <TraitsCard
        traits={traits as Record<string, { value: number; marked: boolean }>}
        canIncrement={k => canIncrement(k)}
        incTrait={(k, d) => incTrait(k, d)}
        toggleMarked={k => toggleMarked(k)}
      />

      {/* Domains & Equipment sections removed per UX: empty stubs don't add value */}
    </div>
  );
}

export const Route = createFileRoute('/characters/$id')({
  component: CharacterSheet,
});
