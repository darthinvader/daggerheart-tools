import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { COMMUNITIES } from '@/lib/data/characters/communities';

export type CommunityFormValues = {
  community: string;
  communityDetails?: {
    type?: 'standard' | 'homebrew';
    homebrew?: {
      name: string;
      description?: string;
      commonTraits?: string[];
      feature: { name: string; description: string };
    };
  };
};

export function CommunityDrawer({
  open,
  onOpenChange,
  form,
  submit,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CommunityFormValues>;
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
}) {
  // Local draft model to mirror AncestryDrawer pattern
  const [tab, setTab] = React.useState<'select' | 'homebrew'>('select');
  const [draftMode, setDraftMode] = React.useState<'standard' | 'homebrew'>(
    'standard'
  );
  const [draftSelected, setDraftSelected] = React.useState<string>('');
  const [draftHomebrew, setDraftHomebrew] = React.useState<
    NonNullable<
      NonNullable<CommunityFormValues['communityDetails']>['homebrew']
    >
  >({
    name: '',
    description: '',
    commonTraits: [],
    feature: { name: '', description: '' },
  });
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMUNITIES;
    return COMMUNITIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.commonTraits?.some((t: string) => t.toLowerCase().includes(q)) ??
          false) ||
        c.feature.name.toLowerCase().includes(q) ||
        c.feature.description.toLowerCase().includes(q)
    );
  }, [query]);

  // Initialize from form when opening
  const lastOpenRef = React.useRef(open);
  if (open && !lastOpenRef.current) {
    const saved = form.getValues();
    const savedType = saved.communityDetails?.type ?? 'standard';
    setDraftMode(savedType);
    setTab(savedType === 'homebrew' ? 'homebrew' : 'select');
    setDraftSelected(saved.community || '');
    setDraftHomebrew({
      name: saved.communityDetails?.homebrew?.name || '',
      description: saved.communityDetails?.homebrew?.description || '',
      commonTraits: saved.communityDetails?.homebrew?.commonTraits || [],
      feature: {
        name: saved.communityDetails?.homebrew?.feature?.name || '',
        description:
          saved.communityDetails?.homebrew?.feature?.description || '',
      },
    });
  }
  lastOpenRef.current = open;

  const canSave = React.useMemo(() => {
    if (draftMode === 'homebrew') {
      const nameOk = draftHomebrew.name.trim().length > 0;
      const featOk =
        draftHomebrew.feature.name.trim().length > 0 &&
        draftHomebrew.feature.description.trim().length > 0;
      return nameOk && featOk;
    }
    return draftSelected.trim().length > 0;
  }, [draftMode, draftHomebrew, draftSelected]);

  const commitDraftToForm = React.useCallback(() => {
    if (draftMode === 'standard') {
      form.setValue('community' as never, draftSelected as never, {
        shouldDirty: true,
      });
      form.setValue(
        'communityDetails' as never,
        { type: 'standard' } as unknown as never,
        { shouldDirty: true }
      );
      return;
    }
    // homebrew
    form.setValue(
      'community' as never,
      (draftHomebrew.name || '').trim() as never,
      { shouldDirty: true }
    );
    form.setValue(
      'communityDetails' as never,
      { type: 'homebrew', homebrew: draftHomebrew } as unknown as never,
      { shouldDirty: true }
    );
  }, [draftMode, draftSelected, draftHomebrew, form]);

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Community"
      onCancel={onCancel}
      onSubmit={e => {
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
              // Keep draft mode in sync with the active tab so Save commits the intended shape
              setDraftMode(next === 'homebrew' ? 'homebrew' : 'standard');
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select</TabsTrigger>
              <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
            </TabsList>
            <TabsContent value="select" className="mt-4 space-y-4">
              {(() => {
                const selected = draftSelected || '';
                return (
                  <div className="space-y-3">
                    <Input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search communities…"
                      aria-label="Search communities"
                    />
                    <div className="flex max-h-[45vh] flex-col gap-1 overflow-auto rounded-md border p-1">
                      {filtered.length === 0 && (
                        <div className="text-muted-foreground p-3 text-sm">
                          No communities match your search.
                        </div>
                      )}
                      {filtered.map(c => {
                        const isSelected = c.name === selected;
                        return (
                          <button
                            type="button"
                            key={c.name}
                            onClick={() => setDraftSelected(c.name)}
                            className={`hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2 ${isSelected ? 'bg-accent/30 ring-ring ring-1' : ''}`}
                          >
                            <div className="p-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  🏘️ {c.name}
                                </div>
                                {isSelected && (
                                  <Badge variant="secondary">Selected</Badge>
                                )}
                              </div>
                              {c.commonTraits?.length ? (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {c.commonTraits.map((t: string) => (
                                    <Badge key={t} variant="outline">
                                      🏷️ {t}
                                    </Badge>
                                  ))}
                                </div>
                              ) : null}
                              {isSelected && (
                                <div className="bg-accent/10 mt-2 rounded-md border p-2 text-xs">
                                  <div className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
                                    <span>Feature</span>
                                    <Badge variant="outline">✨</Badge>
                                  </div>
                                  <div className="font-medium">
                                    {c.feature.name}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {c.description}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {c.feature.description}
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
              })()}
            </TabsContent>
            <TabsContent value="homebrew" className="mt-4 space-y-4">
              <div className="space-y-3 rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">Homebrew Community</div>
                  <div className="text-muted-foreground text-xs">
                    Define a custom community.
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={draftHomebrew.name}
                      onChange={e =>
                        setDraftHomebrew(h => ({ ...h, name: e.target.value }))
                      }
                      placeholder="Custom community"
                    />
                  </FormItem>
                </div>
                <FormItem>
                  <FormLabel>Feature</FormLabel>
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      placeholder="Feature name"
                      value={draftHomebrew.feature.name}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          feature: { ...h.feature, name: e.target.value },
                        }))
                      }
                    />
                    <Textarea
                      placeholder="Feature description"
                      value={draftHomebrew.feature.description}
                      onChange={e =>
                        setDraftHomebrew(h => ({
                          ...h,
                          feature: {
                            ...h.feature,
                            description: e.target.value,
                          },
                        }))
                      }
                      rows={2}
                    />
                  </div>
                </FormItem>
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Describe culture, roles, etc."
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
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </DrawerScaffold>
  );
}
