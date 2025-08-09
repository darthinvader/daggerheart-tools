import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import * as React from 'react';

import { Link, createFileRoute } from '@tanstack/react-router';

import { ClassCard } from '@/components/characters/class-card';
import { ConditionsCard } from '@/components/characters/conditions-card';
import { CoreScoresCard } from '@/components/characters/core-scores-card';
import { IdentityCard } from '@/components/characters/identity-card';
// Lazy-load the Identity drawer to trim initial bundle
import { ResourcesCard } from '@/components/characters/resources-card';
import { SummaryStats } from '@/components/characters/summary-stats';
import { TraitsCard } from '@/components/characters/traits-card';
import { Button } from '@/components/ui/button';
// No Card imports needed here; stub sections use dedicated components
import type { ComboboxItem } from '@/components/ui/combobox';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';
import { COMMUNITIES } from '@/lib/data/characters/communities';
import { ALL_CLASSES } from '@/lib/data/classes';
import {
  AncestryNameEnum,
  ClassNameEnum,
  CommunityNameEnum,
  SubclassNameSchema,
} from '@/lib/schemas/core';

// Per-character Identity draft schema
const IdentityDraftSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pronouns: z.string().min(1, 'Pronouns are required'),
  ancestry: AncestryNameEnum,
  community: CommunityNameEnum,
  description: z.string().default(''),
  calling: z.string().default(''),
});
type IdentityDraft = z.infer<typeof IdentityDraftSchema>;

const DEFAULT_IDENTITY: IdentityDraft = {
  name: '',
  pronouns: 'they/them',
  ancestry: 'Human',
  community: 'Wanderborne',
  description: '',
  calling: '',
};

function getIdentityKey(id: string) {
  return `dh:characters:${id}:identity:v1`;
}

function readIdentityFromStorage(id: string): IdentityDraft {
  const key = getIdentityKey(id);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_IDENTITY;
    const parsed = JSON.parse(raw);
    return IdentityDraftSchema.parse(parsed);
  } catch {
    return DEFAULT_IDENTITY;
  }
}

function writeIdentityToStorage(id: string, value: IdentityDraft) {
  const key = getIdentityKey(id);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Simple Conditions (tags) for gameplay tracking
const ConditionsSchema = z.array(z.string().min(1).max(40));
type ConditionsDraft = z.infer<typeof ConditionsSchema>;
function getConditionsKey(id: string) {
  return `dh:characters:${id}:conditions:v1`;
}
function readConditionsFromStorage(id: string): ConditionsDraft {
  try {
    const raw = localStorage.getItem(getConditionsKey(id));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return ConditionsSchema.parse(parsed);
  } catch {
    return [];
  }
}
function writeConditionsToStorage(id: string, value: ConditionsDraft) {
  try {
    localStorage.setItem(getConditionsKey(id), JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Resources (HP & Stress) quick-controls schema
const ScoreSchema = z.object({
  current: z.number().int().min(0),
  max: z.number().int().min(1),
});
const ResourcesSchema = z.object({
  hp: ScoreSchema.default({ current: 10, max: 10 }),
  stress: ScoreSchema.default({ current: 0, max: 6 }),
  evasion: z.number().int().min(0).default(10),
  hope: z.number().int().min(0).default(2),
  proficiency: z.number().int().min(1).default(1),
});
type ResourcesDraft = z.infer<typeof ResourcesSchema>;

const DEFAULT_RESOURCES: ResourcesDraft = {
  hp: { current: 10, max: 10 },
  stress: { current: 0, max: 6 },
  evasion: 10,
  hope: 2,
  proficiency: 1,
};

function getResourcesKey(id: string) {
  return `dh:characters:${id}:resources:v1`;
}
function readResourcesFromStorage(id: string): ResourcesDraft {
  const key = getResourcesKey(id);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_RESOURCES;
    const parsed = JSON.parse(raw);
    return ResourcesSchema.parse(parsed);
  } catch {
    return DEFAULT_RESOURCES;
  }
}
function writeResourcesToStorage(id: string, value: ResourcesDraft) {
  const key = getResourcesKey(id);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Traits (values + marked) with simple configurable budget
const TraitStateSchema = z.object({
  value: z.number().int().min(0).max(10).default(0),
  marked: z.boolean().default(false),
});
type TraitState = z.infer<typeof TraitStateSchema>;
type TraitsDraft = Record<string, TraitState>;

const DEFAULT_TRAITS: TraitsDraft = {
  Agility: { value: 0, marked: false },
  Strength: { value: 0, marked: false },
  Finesse: { value: 0, marked: false },
  Instinct: { value: 0, marked: false },
  Presence: { value: 0, marked: false },
  Knowledge: { value: 0, marked: false },
};

function getTraitsKey(id: string) {
  return `dh:characters:${id}:traits:v1`;
}
function readTraitsFromStorage(id: string): TraitsDraft {
  try {
    const raw = localStorage.getItem(getTraitsKey(id));
    if (!raw) return DEFAULT_TRAITS;
    const parsed = JSON.parse(raw);
    const schema = z.record(z.string(), TraitStateSchema);
    return schema.parse(parsed);
  } catch {
    return DEFAULT_TRAITS;
  }
}
function writeTraitsToStorage(id: string, value: TraitsDraft) {
  try {
    localStorage.setItem(getTraitsKey(id), JSON.stringify(value));
  } catch {
    // ignore
  }
}

const STARTING_TRAIT_POINTS = 6;

// Per-character Class selection draft
const ClassDraftSchema = z.object({
  className: ClassNameEnum,
  subclass: SubclassNameSchema,
});
type ClassDraft = z.infer<typeof ClassDraftSchema>;

const DEFAULT_CLASS: ClassDraft = {
  className: 'Warrior',
  subclass: 'Call of the Brave',
};

function getClassKey(id: string) {
  return `dh:characters:${id}:class:v1`;
}
function readClassFromStorage(id: string): ClassDraft {
  try {
    const raw = localStorage.getItem(getClassKey(id));
    if (!raw) return DEFAULT_CLASS;
    const parsed = JSON.parse(raw);
    return ClassDraftSchema.parse(parsed);
  } catch {
    return DEFAULT_CLASS;
  }
}
function writeClassToStorage(id: string, value: ClassDraft) {
  try {
    localStorage.setItem(getClassKey(id), JSON.stringify(value));
  } catch {
    // ignore
  }
}

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

  const [identity, setIdentity] =
    React.useState<IdentityDraft>(DEFAULT_IDENTITY);
  const [openIdentity, setOpenIdentity] = React.useState(false);
  const [resources, setResources] =
    React.useState<ResourcesDraft>(DEFAULT_RESOURCES);
  const [traits, setTraits] = React.useState<TraitsDraft>(DEFAULT_TRAITS);
  const [conditions, setConditions] = React.useState<ConditionsDraft>([]);
  const [classDraft, setClassDraft] = React.useState<ClassDraft>(DEFAULT_CLASS);
  const [openClass, setOpenClass] = React.useState(false);

  React.useEffect(() => {
    setIdentity(readIdentityFromStorage(id));
    setResources(readResourcesFromStorage(id));
    setTraits(readTraitsFromStorage(id));
    setConditions(readConditionsFromStorage(id));
    setClassDraft(readClassFromStorage(id));
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

  React.useEffect(() => {
    if (openIdentity) form.reset(identity);
  }, [openIdentity, identity, form]);
  React.useEffect(() => {
    if (openClass) classForm.reset(classDraft);
  }, [openClass, classDraft, classForm]);

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
  const traitPointsSpent = React.useMemo(
    () => Object.values(traits).reduce((sum, t) => sum + t.value, 0),
    [traits]
  );
  const traitPointsRemaining = STARTING_TRAIT_POINTS - traitPointsSpent;
  const canIncrement = (key: string) => {
    if (traitPointsRemaining <= 0) return false;
    return traits[key].value < 10; // cap guard
  };
  const incTrait = (key: string, delta: 1 | -1) => {
    setTraits(prev => {
      const current = prev[key].value;
      const nextValue = delta === 1 ? current + 1 : Math.max(0, current - 1);
      // prevent exceeding budget on increment
      if (delta === 1 && traitPointsRemaining <= 0) return prev;
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
        updateHope={delta => updateNumber('hope', delta, 0)}
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

      {/* Traits */}
      <TraitsCard
        traits={traits as Record<string, { value: number; marked: boolean }>}
        remaining={traitPointsRemaining}
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
