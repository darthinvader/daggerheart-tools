import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { ANCESTRIES } from '@/lib/data/characters/ancestries';

export type DraftMode = 'standard' | 'mixed' | 'homebrew';

export type MixedDraft = {
  name?: string;
  primaryFrom?: string;
  secondaryFrom?: string;
};

export type HomebrewDraft = {
  name: string;
  description?: string;
  heightRange?: string;
  lifespan?: string;
  physicalCharacteristics?: string[];
  primaryFeature: { name: string; description: string };
  secondaryFeature: { name: string; description: string };
};

type AncestryValuesLike = {
  ancestry?: string;
  ancestryDetails?: {
    type?: DraftMode;
    mixed?: { name?: string; primaryFrom?: string; secondaryFrom?: string };
    homebrew?: HomebrewDraft;
  };
};

export function useAncestryDraft<TForm extends AncestryValuesLike>({
  open,
  form,
}: {
  open: boolean;
  form: UseFormReturn<TForm>;
}) {
  const [tab, setTab] = React.useState<'select' | 'homebrew'>('select');
  const [draftMode, setDraftMode] = React.useState<DraftMode>('standard');
  const [draftSelected, setDraftSelected] = React.useState<string>('');
  const [draftMixed, setDraftMixed] = React.useState<MixedDraft>({});
  const [draftHomebrew, setDraftHomebrew] = React.useState<HomebrewDraft>({
    name: '',
    description: '',
    heightRange: '',
    lifespan: '',
    physicalCharacteristics: [],
    primaryFeature: { name: '', description: '' },
    secondaryFeature: { name: '', description: '' },
  });

  // Initialize drafts when drawer transitions to open
  const wasOpenRef = React.useRef<boolean>(open);
  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      const saved = form.getValues() as unknown as AncestryValuesLike;
      const savedType: DraftMode = saved.ancestryDetails?.type ?? 'standard';
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
            saved.ancestryDetails?.homebrew?.secondaryFeature?.description ||
            '',
        },
      });
    }
    wasOpenRef.current = open;
  }, [open, form]);

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

  const commitDraftToForm = React.useCallback(
    (e?: BaseSyntheticEvent) => {
      if (e && 'preventDefault' in e) e.preventDefault();
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
        const custom = draftMixed.name?.trim();
        const generated = `${draftMixed.primaryFrom || ''}-${
          draftMixed.secondaryFrom || ''
        }`;
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
    },
    [draftMode, draftSelected, draftMixed, draftHomebrew, form]
  );

  const filterAncestries = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return ANCESTRIES;
    return ANCESTRIES.filter(
      a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.primaryFeature.name.toLowerCase().includes(q) ||
        a.secondaryFeature.name.toLowerCase().includes(q)
    );
  };

  return {
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
  } as const;
}
