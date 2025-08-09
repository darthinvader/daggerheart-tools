import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import * as React from 'react';

import { Link, createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, type ComboboxItem } from '@/components/ui/combobox';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';
import { COMMUNITIES } from '@/lib/data/characters/communities';
import {
  AncestryNameEnum,
  CharacterTraitEnum,
  CommunityNameEnum,
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
const TraitsSchema = z.record(CharacterTraitEnum, TraitStateSchema);
type TraitsDraft = z.infer<typeof TraitsSchema>;

const DEFAULT_TRAITS: TraitsDraft = {
  Agility: { value: 0, marked: false },
  Strength: { value: 0, marked: false },
  Finesse: { value: 0, marked: false },
  Instinct: { value: 0, marked: false },
  Presence: { value: 0, marked: false },
  Knowledge: { value: 0, marked: false },
};

// Assumption: starting budget of 6 points at level 1 (easily adjustable)
const STARTING_TRAIT_POINTS = 6;

function getTraitsKey(id: string) {
  return `dh:characters:${id}:traits:v1`;
}
function readTraitsFromStorage(id: string): TraitsDraft {
  const key = getTraitsKey(id);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_TRAITS;
    const parsed = JSON.parse(raw);
    return TraitsSchema.parse(parsed);
  } catch {
    return DEFAULT_TRAITS;
  }
}
function writeTraitsToStorage(id: string, value: TraitsDraft) {
  const key = getTraitsKey(id);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function CharacterSheet() {
  const { id } = Route.useParams();

  const [identity, setIdentity] =
    React.useState<IdentityDraft>(DEFAULT_IDENTITY);
  const [openIdentity, setOpenIdentity] = React.useState(false);
  const [resources, setResources] =
    React.useState<ResourcesDraft>(DEFAULT_RESOURCES);
  const [traits, setTraits] = React.useState<TraitsDraft>(DEFAULT_TRAITS);

  React.useEffect(() => {
    setIdentity(readIdentityFromStorage(id));
    setResources(readResourcesFromStorage(id));
    setTraits(readTraitsFromStorage(id));
  }, [id]);

  const ancestryItems: ComboboxItem[] = React.useMemo(
    () => ANCESTRIES.map(a => ({ value: a.name, label: a.name })),
    []
  );
  const communityItems: ComboboxItem[] = React.useMemo(
    () => COMMUNITIES.map(c => ({ value: c.name, label: c.name })),
    []
  );

  const form = useForm<IdentityDraft>({
    resolver: zodResolver(IdentityDraftSchema) as never,
    mode: 'onChange',
    defaultValues: identity,
  });

  React.useEffect(() => {
    if (openIdentity) form.reset(identity);
  }, [openIdentity, identity, form]);

  const onSubmit = (values: IdentityDraft) => {
    setIdentity(values);
    writeIdentityToStorage(id, values);
    setOpenIdentity(false);
  };
  const submit = form.handleSubmit(values => onSubmit(values as IdentityDraft));

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
    () =>
      (Object.keys(traits) as Array<keyof typeof traits>).reduce(
        (sum, key) => sum + traits[key].value,
        0
      ),
    [traits]
  );
  const traitPointsRemaining = STARTING_TRAIT_POINTS - traitPointsSpent;
  const canIncrement = (key: keyof TraitsDraft) => {
    if (traitPointsRemaining <= 0) return false;
    return traits[key].value < 10; // cap guard
  };
  const incTrait = (key: keyof TraitsDraft, delta: 1 | -1) => {
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
  const toggleMarked = (key: keyof TraitsDraft) => {
    setTraits(prev => {
      const next: TraitsDraft = {
        ...prev,
        [key]: { ...prev[key], marked: !prev[key].marked },
      } as TraitsDraft;
      writeTraitsToStorage(id, next);
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
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Identity snapshot only; HP/Stress live in Resources below */}
          <div className="space-y-1">
            <div className="text-foreground text-base font-semibold">
              {identity.name || 'Unnamed Character'}{' '}
              {identity.pronouns ? (
                <span className="text-muted-foreground text-sm font-normal">
                  ({identity.pronouns})
                </span>
              ) : null}
            </div>
            <div className="text-muted-foreground text-sm">
              {identity.ancestry} · {identity.community}
            </div>
            <div className="text-muted-foreground text-xs opacity-70">
              id: {id}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats: Evasion, Hope, Proficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Core Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Evasion */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">Evasion</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Decrease Evasion"
                size="sm"
                variant="outline"
                onClick={() => updateNumber('evasion', -1, 0)}
              >
                -
              </Button>
              <div className="min-w-12 text-center tabular-nums">
                {resources.evasion}
              </div>
              <Button
                aria-label="Increase Evasion"
                size="sm"
                variant="outline"
                onClick={() => updateNumber('evasion', 1, 0)}
              >
                +
              </Button>
            </div>
          </div>
          {/* Hope */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">Hope</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Decrease Hope"
                size="sm"
                variant="outline"
                onClick={() => updateNumber('hope', -1, 0)}
              >
                -
              </Button>
              <div className="min-w-12 text-center tabular-nums">
                {resources.hope}
              </div>
              <Button
                aria-label="Increase Hope"
                size="sm"
                variant="outline"
                onClick={() => updateNumber('hope', 1, 0)}
              >
                +
              </Button>
            </div>
          </div>
          {/* Proficiency */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">Proficiency</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Decrease Proficiency"
                size="sm"
                variant="outline"
                onClick={() => updateNumber('proficiency', -1, 1)}
              >
                -
              </Button>
              <div className="min-w-12 text-center tabular-nums">
                {resources.proficiency}
              </div>
              <Button
                aria-label="Increase Proficiency"
                size="sm"
                variant="outline"
                onClick={() => updateNumber('proficiency', 1, 1)}
              >
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity section */}
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-muted-foreground text-sm">
            {identity.name ? (
              <div className="space-y-0.5">
                <div className="text-foreground font-medium">
                  {identity.name}{' '}
                  <span className="text-muted-foreground">
                    ({identity.pronouns})
                  </span>
                </div>
                <div>
                  {identity.ancestry} · {identity.community}
                </div>
              </div>
            ) : (
              <span>Name, pronouns, ancestry, community…</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenIdentity(true)}
          >
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Identity Drawer */}
      <Drawer open={openIdentity} onOpenChange={setOpenIdentity}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Identity</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-[max(8px,env(safe-area-inset-bottom))]">
            <Form {...form}>
              <form className="space-y-4" onSubmit={submit} noValidate>
                <FormField
                  control={form.control as never}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoFocus
                          inputMode="text"
                          placeholder="Character name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as never}
                  name="pronouns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="text"
                          placeholder="e.g., they/them"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control as never}
                    name="ancestry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ancestry</FormLabel>
                        <FormControl>
                          <Combobox
                            items={ancestryItems}
                            value={field.value}
                            onChange={v => field.onChange(v ?? field.value)}
                            placeholder="Search ancestry..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as never}
                    name="community"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community</FormLabel>
                        <FormControl>
                          <Combobox
                            items={communityItems}
                            value={field.value}
                            onChange={v => field.onChange(v ?? field.value)}
                            placeholder="Search community..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control as never}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="text"
                          placeholder="Appearance, demeanor, goals..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as never}
                  name="calling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calling</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="text"
                          placeholder="Archetype, vocation, destiny..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DrawerFooter>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenIdentity(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!form.formState.isValid}>
                      Save
                    </Button>
                  </div>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Remaining sections (stubs) */}
      <Card>
        <CardHeader>
          <CardTitle>Class & Subclass</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Class selection and subclass…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Traits{' '}
            <span className="text-muted-foreground text-sm font-normal">
              (Remaining: {Math.max(0, traitPointsRemaining)})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.keys(traits) as Array<keyof TraitsDraft>).map(key => (
            <div
              key={key as string}
              className="flex items-center justify-between gap-2"
            >
              <div className="text-sm">
                <div className="font-medium">{key}</div>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={traits[key].marked}
                    onCheckedChange={() => toggleMarked(key)}
                    aria-label={`Mark ${String(key)}`}
                  />
                  Marked
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  aria-label={`Decrease ${String(key)}`}
                  size="sm"
                  variant="outline"
                  onClick={() => incTrait(key, -1)}
                >
                  -
                </Button>
                <div className="min-w-12 text-center tabular-nums">
                  {traits[key].value}
                </div>
                <Button
                  aria-label={`Increase ${String(key)}`}
                  size="sm"
                  variant="outline"
                  onClick={() => canIncrement(key) && incTrait(key, 1)}
                  disabled={!canIncrement(key)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* HP Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">HP</div>
              <div className="text-muted-foreground text-xs">
                Max {resources.hp.max}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Decrease HP"
                size="sm"
                variant="outline"
                onClick={() => updateHp(-1)}
              >
                -
              </Button>
              <div className="min-w-12 text-center tabular-nums">
                {resources.hp.current}
              </div>
              <Button
                aria-label="Increase HP"
                size="sm"
                variant="outline"
                onClick={() => updateHp(1)}
              >
                +
              </Button>
              <div className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
                <Button
                  aria-label="Decrease HP max"
                  size="icon"
                  variant="ghost"
                  onClick={() => updateHpMax(-1)}
                >
                  -
                </Button>
                <span>max</span>
                <Button
                  aria-label="Increase HP max"
                  size="icon"
                  variant="ghost"
                  onClick={() => updateHpMax(1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          {/* Stress Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">Stress</div>
              <div className="text-muted-foreground text-xs">
                Max {resources.stress.max}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Decrease Stress"
                size="sm"
                variant="outline"
                onClick={() => updateStress(-1)}
              >
                -
              </Button>
              <div className="min-w-12 text-center tabular-nums">
                {resources.stress.current}
              </div>
              <Button
                aria-label="Increase Stress"
                size="sm"
                variant="outline"
                onClick={() => updateStress(1)}
              >
                +
              </Button>
              <div className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
                <Button
                  aria-label="Decrease Stress max"
                  size="icon"
                  variant="ghost"
                  onClick={() => updateStressMax(-1)}
                >
                  -
                </Button>
                <span>max</span>
                <Button
                  aria-label="Increase Stress max"
                  size="icon"
                  variant="ghost"
                  onClick={() => updateStressMax(1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Domains & Loadout</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Loadout, Vault, selection…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Equipment & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Weapons, armor, items, gold…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Bottom action bar removed per UX: it obscured content on mobile */}
    </div>
  );
}

export const Route = createFileRoute('/characters/$id')({
  component: CharacterSheet,
});
