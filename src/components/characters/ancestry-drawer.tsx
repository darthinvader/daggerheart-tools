import { type UseFormReturn } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';

export type AncestryFormValues = {
  ancestry: string;
  ancestryDetails?: {
    type?: 'standard' | 'mixed' | 'homebrew';
    mixed?: { name?: string; primaryFrom?: string; secondaryFrom?: string };
    homebrew?: {
      name: string;
      description?: string;
      heightRange?: string;
      lifespan?: string;
      physicalCharacteristics?: string[];
      primaryFeature: { name: string; description: string };
      secondaryFeature: { name: string; description: string };
    };
  };
};

type MixedListProps = {
  label: string;
  selectedName: string;
  onSelect: (name: string) => void;
  featureType: 'primary' | 'secondary';
};
const MixedList = React.memo(function MixedList({
  label,
  selectedName,
  onSelect,
  featureType,
}: MixedListProps) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ANCESTRIES;
    return ANCESTRIES.filter(a => {
      const feat =
        featureType === 'primary' ? a.primaryFeature : a.secondaryFeature;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        feat.name.toLowerCase().includes(q) ||
        feat.description.toLowerCase().includes(q)
      );
    });
  }, [query, featureType]);

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={`Search ${label.toLowerCase()}…`}
        aria-label={`Search ${label.toLowerCase()}`}
      />
      <div className="flex max-h-[35vh] flex-col gap-1 overflow-auto rounded-md border p-1">
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-3 text-sm">
            No ancestries match your search.
          </div>
        )}
        {filtered.map(a => {
          const isSelected = a.name === selectedName;
          const feat =
            featureType === 'primary' ? a.primaryFeature : a.secondaryFeature;
          return (
            <button
              type="button"
              key={`${a.name}-${featureType}`}
              onClick={() => {
                if (a.name !== selectedName) onSelect(a.name);
              }}
              className={`hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2 ${isSelected ? 'bg-accent/30' : ''}`}
            >
              <div className="p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">🧬 {a.name}</div>
                  {isSelected && (
                    <span className="text-muted-foreground text-[11px]">
                      Selected
                    </span>
                  )}
                </div>
                {/* Intentionally hide ancestry description in Mixed mode for compactness */}
                <div className="mt-2 text-xs">
                  <div className="text-muted-foreground text-[10px] uppercase">
                    {featureType === 'primary'
                      ? '⭐ Primary Feature'
                      : '✨ Secondary Feature'}
                  </div>
                  <div className="font-medium">{feat.name}</div>
                  <div className="text-muted-foreground">
                    {feat.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export function AncestryDrawer({
  open,
  onOpenChange,
  form,
  submit,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AncestryFormValues>;
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [tab, setTab] = React.useState<'select' | 'homebrew'>('select');
  const [draftMode, setDraftMode] = React.useState<
    'standard' | 'mixed' | 'homebrew'
  >('standard');
  const [draftSelected, setDraftSelected] = React.useState<string>('');
  const [draftMixed, setDraftMixed] = React.useState<{
    name?: string;
    primaryFrom?: string;
    secondaryFrom?: string;
  }>({});
  const [draftHomebrew, setDraftHomebrew] = React.useState<
    NonNullable<NonNullable<AncestryFormValues['ancestryDetails']>['homebrew']>
  >({
    name: '',
    description: '',
    heightRange: '',
    lifespan: '',
    physicalCharacteristics: [],
    primaryFeature: { name: '', description: '' },
    secondaryFeature: { name: '', description: '' },
  });
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ANCESTRIES;
    return ANCESTRIES.filter(
      a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.primaryFeature.name.toLowerCase().includes(q) ||
        a.secondaryFeature.name.toLowerCase().includes(q)
    );
  }, [query]);

  // Local draft state is the single source of truth while the drawer is open.
  // We commit back to the form only on Submit to avoid watch/setValue feedback loops.

  // Initialize tab from saved data when drawer opens - using refs to avoid effect dependencies
  const lastOpenRef = React.useRef(open);
  if (open && !lastOpenRef.current) {
    // Drawer just opened — initialize drafts from form values
    const saved = form.getValues();
    const savedType = saved.ancestryDetails?.type ?? 'standard';
    setDraftMode(savedType);
    setTab(savedType === 'homebrew' ? 'homebrew' : 'select');
    setDraftSelected(saved.ancestry || '');
    setDraftMixed({
      name: saved.ancestryDetails?.mixed?.name || '',
      primaryFrom: saved.ancestryDetails?.mixed?.primaryFrom || '',
      secondaryFrom: saved.ancestryDetails?.mixed?.secondaryFrom || '',
    });
    setDraftHomebrew({
      name: saved.ancestryDetails?.homebrew?.name || '',
      description: saved.ancestryDetails?.homebrew?.description || '',
      heightRange: saved.ancestryDetails?.homebrew?.heightRange || '',
      lifespan: saved.ancestryDetails?.homebrew?.lifespan || '',
      physicalCharacteristics:
        saved.ancestryDetails?.homebrew?.physicalCharacteristics || [],
      primaryFeature: {
        name: saved.ancestryDetails?.homebrew?.primaryFeature?.name || '',
        description:
          saved.ancestryDetails?.homebrew?.primaryFeature?.description || '',
      },
      secondaryFeature: {
        name: saved.ancestryDetails?.homebrew?.secondaryFeature?.name || '',
        description:
          saved.ancestryDetails?.homebrew?.secondaryFeature?.description || '',
      },
    });
  }
  lastOpenRef.current = open;

  const canSave = React.useMemo(() => {
    if (draftMode === 'homebrew') {
      const nameOk = draftHomebrew.name.trim().length > 0;
      const pfOk =
        draftHomebrew.primaryFeature.name.trim().length > 0 &&
        draftHomebrew.primaryFeature.description.trim().length > 0;
      const sfOk =
        draftHomebrew.secondaryFeature.name.trim().length > 0 &&
        draftHomebrew.secondaryFeature.description.trim().length > 0;
      return nameOk && pfOk && sfOk;
    }
    if (draftMode === 'mixed') {
      return (
        (draftMixed.primaryFrom || '').trim().length > 0 &&
        (draftMixed.secondaryFrom || '').trim().length > 0
      );
    }
    return draftSelected.trim().length > 0;
  }, [draftMode, draftHomebrew, draftMixed, draftSelected]);

  const commitDraftToForm = React.useCallback(() => {
    if (draftMode === 'standard') {
      form.setValue('ancestry' as never, draftSelected as never, {
        shouldDirty: true,
      });
      form.setValue(
        'ancestryDetails' as never,
        { type: 'standard' } as unknown as never,
        { shouldDirty: true }
      );
      return;
    }
    if (draftMode === 'mixed') {
      // Compute ancestry string: custom name or combination of primary and secondary
      const custom = draftMixed.name?.trim();
      const generated = `${draftMixed.primaryFrom || ''}-${draftMixed.secondaryFrom || ''}`;
      const ancestryLabel = custom || generated;
      form.setValue('ancestry' as never, ancestryLabel as never, {
        shouldDirty: true,
      });
      form.setValue(
        'ancestryDetails' as never,
        {
          type: 'mixed',
          mixed: {
            name: custom || undefined,
            primaryFrom: draftMixed.primaryFrom || undefined,
            secondaryFrom: draftMixed.secondaryFrom || undefined,
          },
        } as unknown as never,
        { shouldDirty: true }
      );
      return;
    }
    // homebrew
    // Ensure ancestry string is synchronized for immediate submit consumers
    form.setValue(
      'ancestry' as never,
      (draftHomebrew.name || '').trim() as never,
      { shouldDirty: true }
    );
    form.setValue(
      'ancestryDetails' as never,
      { type: 'homebrew', homebrew: draftHomebrew } as unknown as never,
      { shouldDirty: true }
    );
  }, [draftMode, draftSelected, draftMixed, draftHomebrew, form]);

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Ancestry"
      onCancel={onCancel}
      onSubmit={e => {
        // prevent default if synthetic event provided
        if (e && 'preventDefault' in e)
          (e as BaseSyntheticEvent).preventDefault();
        commitDraftToForm();
        return submit();
      }}
      submitDisabled={!canSave}
    >
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            commitDraftToForm();
            void submit();
          }}
          noValidate
        >
          <Tabs
            value={tab}
            onValueChange={v => {
              const next = v as typeof tab;
              setTab(next);
              // When switching to Homebrew tab, also set draft mode to homebrew
              if (next === 'homebrew') setDraftMode('homebrew');
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select</TabsTrigger>
              <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
            </TabsList>
            <TabsContent value="select" className="mt-4 space-y-4">
              {/* Plain radio group (not inside FormField) to avoid Controller feedback loops */}
              <div>
                <FormLabel>Mode</FormLabel>
                <RadioGroup
                  value={draftMode}
                  onValueChange={v => {
                    const next = v as 'standard' | 'mixed' | 'homebrew';
                    setDraftMode(next);
                    if (next === 'homebrew') setTab('homebrew');
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="anc-mode-standard" value="standard" />
                    <label htmlFor="anc-mode-standard" className="text-sm">
                      Standard
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="anc-mode-mixed" value="mixed" />
                    <label htmlFor="anc-mode-mixed" className="text-sm">
                      Mixed
                    </label>
                  </div>
                </RadioGroup>
              </div>
              {(() => {
                const modeLocal = draftMode;
                if (modeLocal === 'standard') {
                  const selected = draftSelected || '';
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          value={query}
                          onChange={e => setQuery(e.target.value)}
                          placeholder="Search ancestries…"
                          aria-label="Search ancestries"
                        />
                      </div>
                      <div className="flex max-h-[45vh] flex-col gap-1 overflow-auto rounded-md border p-1">
                        {filtered.length === 0 && (
                          <div className="text-muted-foreground p-3 text-sm">
                            No ancestries match your search.
                          </div>
                        )}
                        {filtered.map(a => {
                          const isSelected = a.name === selected;
                          return (
                            <button
                              type="button"
                              key={a.name}
                              onClick={() => {
                                setDraftSelected(a.name);
                              }}
                              className={`hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2 ${isSelected ? 'bg-accent/30' : ''}`}
                            >
                              <div className="p-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-sm font-medium">
                                    🧬 {a.name}
                                  </div>
                                  {isSelected && (
                                    <span className="text-muted-foreground text-[11px]">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <div className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                                  {a.description}
                                </div>
                                {isSelected && (
                                  <div className="mt-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <div className="text-muted-foreground text-[10px] uppercase">
                                          🧍 Height
                                        </div>
                                        <div>{a.heightRange}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground text-[10px] uppercase">
                                          ⏳ Lifespan
                                        </div>
                                        <div>{a.lifespan}</div>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <div className="text-muted-foreground text-[10px] uppercase">
                                        🧩 Physical Traits
                                      </div>
                                      <ul className="ml-4 list-disc">
                                        {a.physicalCharacteristics.map(c => (
                                          <li key={c}>{c}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                      <div>
                                        <div className="font-medium">
                                          ⭐ {a.primaryFeature.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                          {a.primaryFeature.description}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          ✨ {a.secondaryFeature.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                          {a.secondaryFeature.description}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                // Mixed mode
                return (
                  <div className="space-y-3">
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium">Mixed Ancestry</div>
                      <div className="text-muted-foreground mb-2 text-xs">
                        Combine a primary feature from one ancestry with a
                        secondary feature from another.
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <FormLabel>Mixed ancestry name (optional)</FormLabel>
                          <Input
                            value={draftMixed.name || ''}
                            onChange={e =>
                              setDraftMixed(m => ({
                                ...m,
                                name: e.target.value,
                              }))
                            }
                            placeholder="e.g., Elf-Orc"
                          />
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <MixedList
                          label="Primary Feature From"
                          selectedName={draftMixed.primaryFrom || ''}
                          onSelect={name => {
                            setDraftMixed(m =>
                              m.primaryFrom === name
                                ? m
                                : { ...m, primaryFrom: name }
                            );
                          }}
                          featureType="primary"
                        />
                        <MixedList
                          label="Secondary Feature From"
                          selectedName={draftMixed.secondaryFrom || ''}
                          onSelect={name => {
                            setDraftMixed(m =>
                              m.secondaryFrom === name
                                ? m
                                : { ...m, secondaryFrom: name }
                            );
                          }}
                          featureType="secondary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </TabsContent>
            <TabsContent value="homebrew" className="mt-4 space-y-4">
              <div className="rounded-md border p-3">
                <div className="text-sm font-medium">Homebrew Ancestry</div>
                <div className="text-muted-foreground text-xs">
                  Define a custom ancestry with features.
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={draftHomebrew.name}
                      onChange={e =>
                        setDraftHomebrew(h => ({ ...h, name: e.target.value }))
                      }
                      placeholder="Custom ancestry name"
                    />
                  </div>
                  <div className="space-y-1">
                    <FormLabel>Height Range</FormLabel>
                    <Input
                      value={draftHomebrew.heightRange || ''}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          heightRange: e.target.value,
                        }))
                      }
                      placeholder="e.g., 5 to 6 feet"
                    />
                  </div>
                  <div className="space-y-1">
                    <FormLabel>Lifespan</FormLabel>
                    <Input
                      value={draftHomebrew.lifespan || ''}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          lifespan: e.target.value,
                        }))
                      }
                      placeholder="e.g., ~120 years"
                    />
                  </div>
                  <FormItem>
                    <FormLabel>Primary Feature</FormLabel>
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Feature name"
                        value={draftHomebrew.primaryFeature.name}
                        onChange={e =>
                          setDraftHomebrew(h => ({
                            ...h,
                            primaryFeature: {
                              ...h.primaryFeature,
                              name: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="sr-only">
                      Primary Feature Description
                    </FormLabel>
                    <Textarea
                      placeholder="Feature description"
                      rows={2}
                      value={draftHomebrew.primaryFeature.description}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          primaryFeature: {
                            ...h.primaryFeature,
                            description: e.target.value,
                          },
                        }))
                      }
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Secondary Feature</FormLabel>
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Feature name"
                        value={draftHomebrew.secondaryFeature.name}
                        onChange={e =>
                          setDraftHomebrew(h => ({
                            ...h,
                            secondaryFeature: {
                              ...h.secondaryFeature,
                              name: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="sr-only">
                      Secondary Feature Description
                    </FormLabel>
                    <Textarea
                      placeholder="Feature description"
                      rows={2}
                      value={draftHomebrew.secondaryFeature.description}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          secondaryFeature: {
                            ...h.secondaryFeature,
                            description: e.target.value,
                          },
                        }))
                      }
                    />
                  </FormItem>
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Lore, appearance, culture..."
                      rows={3}
                      value={draftHomebrew.description || ''}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          description: e.target.value,
                        }))
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </DrawerScaffold>
  );
}
