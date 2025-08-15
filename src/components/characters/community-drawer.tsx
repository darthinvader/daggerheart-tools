import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { CommunityList } from '@/components/characters/community/CommunityList';
import { HomebrewCommunityForm } from '@/components/characters/community/HomebrewCommunityForm';
import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const skipRef = React.useRef(false);
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
  // Filtering handled inside CommunityList presenter

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

  // Autosave on close if draft is valid by committing draft to the form first
  useDrawerAutosaveOnClose({
    open,
    trigger: () => Promise.resolve(canSave),
    submit: () => {
      commitDraftToForm();
      return submit();
    },
    skipRef: skipRef as React.MutableRefObject<boolean>,
  });

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Community"
      onCancel={() => {
        skipRef.current = true;
        onCancel();
      }}
      onSubmit={e => {
        if (e && 'preventDefault' in e)
          (e as BaseSyntheticEvent).preventDefault();
        commitDraftToForm();
        skipRef.current = true;
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
              <CommunityList
                query={query}
                onQueryChange={setQuery}
                selectedName={draftSelected || ''}
                onSelect={setDraftSelected}
              />
            </TabsContent>
            <TabsContent value="homebrew" className="mt-4 space-y-4">
              <HomebrewCommunityForm
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
