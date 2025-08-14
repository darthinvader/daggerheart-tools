import { type UseFormReturn } from 'react-hook-form';

// React import not required with automatic JSX runtime
import type { BaseSyntheticEvent } from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AncestryModeSwitch } from './ancestry/AncestryModeSwitch';
import { AncestryStandardList } from './ancestry/AncestryStandardList';
import { HomebrewAncestryForm } from './ancestry/HomebrewAncestryForm';
import { MixedList } from './ancestry/MixedList';
import { useAncestryDraft } from './ancestry/useAncestryDraft';

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

// MixedList moved to a dedicated presenter under ./ancestry/MixedList

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
  const {
    tab,
    setTab,
    draftMode,
    setDraftMode,
    draftSelected,
    setDraftSelected,
    draftMixed,
    setDraftMixed,
    draftHomebrew,
    setDraftHomebrew,
    canSave,
    commitDraftToForm,
    filterAncestries,
  } = useAncestryDraft<AncestryFormValues>({ open, form });

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
              <AncestryModeSwitch
                value={draftMode}
                onChange={val => {
                  setDraftMode(val);
                  if (val === 'homebrew') setTab('homebrew');
                }}
              />
              {(() => {
                const modeLocal = draftMode;
                if (modeLocal === 'standard') {
                  return (
                    <AncestryStandardList
                      selected={draftSelected || ''}
                      onSelect={name => setDraftSelected(name)}
                      filterAncestries={filterAncestries}
                    />
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
              <HomebrewAncestryForm
                value={draftHomebrew}
                onChange={setDraftHomebrew}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </DrawerScaffold>
  );
}
