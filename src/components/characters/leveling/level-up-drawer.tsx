import { type UseFormRegisterReturn, useForm, useWatch } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { LevelOptionsList } from '@/components/characters/leveling/components/LevelOptionsList';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  computeAchievements,
  computePriorTaken,
  computePriorTierFlags,
  computeTotalCost,
  getTierNote,
} from '@/features/characters/logic/leveling-ui';
import {
  getOptionsForTier,
  getPointsForLevel,
  getTierForLevel,
} from '@/features/characters/logic/progression';
import type { LevelUpEntry } from '@/features/characters/progression-storage';

export type LevelUpFormValues = {
  level: number;
  notes?: string;
  selections: Record<string, number>;
};

export type LevelUpDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number; // current level
  history?: LevelUpEntry[];
  submit: (
    values: LevelUpFormValues,
    e?: BaseSyntheticEvent
  ) => void | Promise<void>;
  onCancel: () => void;
};

export function LevelUpDrawer({
  open,
  onOpenChange,
  level,
  history,
  submit,
  onCancel,
}: LevelUpDrawerProps) {
  const skipAutoSaveRef = React.useRef(false);
  const targetLevel = Math.max(1, Math.min(10, Math.floor(level + 1)));

  const form = useForm<LevelUpFormValues>({
    mode: 'onChange',
    defaultValues: {
      level: targetLevel,
      notes: '',
      selections: {},
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({ level: targetLevel, notes: '', selections: {} });
  }, [open, targetLevel, form]);

  const tier = getTierForLevel(targetLevel);
  const options = getOptionsForTier(tier) as Record<
    string,
    { cost: number; maxSelections: number }
  >;
  const budget = getPointsForLevel();

  // History lookups used for gating and remaining counts
  const priorTierFlags = React.useMemo(() => {
    return computePriorTierFlags(history, targetLevel, tier);
  }, [history, targetLevel, tier]);

  const priorTaken: Record<string, number> = React.useMemo(
    () => computePriorTaken(history, targetLevel, tier),
    [history, tier, targetLevel]
  );

  // Watch selections so Spent updates live while changing pick counts
  const selections = useWatch({ control: form.control, name: 'selections' });
  const totalCost = React.useMemo(
    () =>
      computeTotalCost(
        selections as Record<string, number> | undefined,
        options
      ),
    [selections, options]
  );

  // selection flags are computed inside LevelOptionsList

  // Autosave on drawer close
  useDrawerAutosaveOnClose({
    open,
    trigger: () => Promise.resolve(true),
    submit: () => submit(form.getValues()),
    skipRef: skipAutoSaveRef,
  });

  const achievements: string[] = React.useMemo(
    () => computeAchievements(targetLevel),
    [targetLevel]
  );

  const handleCancel = React.useCallback(() => {
    skipAutoSaveRef.current = true;
    onCancel();
  }, [onCancel]);

  const handleSave = React.useCallback(() => {
    skipAutoSaveRef.current = true;
    submit(form.getValues());
  }, [submit, form]);

  const handleClear = React.useCallback(() => {
    form.setValue('selections', {} as Record<string, number>, {
      shouldValidate: true,
    });
  }, [form]);

  const tierNote = getTierNote(tier);

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title={`Level Up to ${targetLevel}`}
      onCancel={handleCancel}
      onSubmit={handleSave}
      submitDisabled={false}
      footer={
        <FooterSummary
          budget={budget}
          totalCost={totalCost}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      }
    >
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            submit(form.getValues(), e);
          }}
          noValidate
        >
          <AchievementsAlert achievements={achievements} />
          <TierNoteAndClear
            tier={tier}
            tierNote={tierNote}
            onClear={handleClear}
          />

          <NotesField registerNotes={form.register('notes')} />

          {tier === '1' ? (
            <div className="text-muted-foreground text-sm">
              No point spending at level 1.
            </div>
          ) : (
            <LevelOptionsList
              options={options}
              selections={selections as Record<string, number>}
              priorTaken={priorTaken}
              priorTierFlags={priorTierFlags}
              onChange={(key, val) =>
                form.setValue(`selections.${key}` as const, val, {
                  shouldValidate: true,
                })
              }
            />
          )}
        </form>
      </Form>
    </DrawerScaffold>
  );
}

function FooterSummary({
  budget,
  totalCost,
  onCancel,
  onSave,
}: {
  budget: number;
  totalCost: number;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="text-muted-foreground text-sm">
        <>
          Points: {budget} • Spent: {totalCost}
        </>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave} disabled={false}>
          Save
        </Button>
      </div>
    </div>
  );
}

function NotesField({
  registerNotes,
}: {
  registerNotes: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Notes</label>
      <Textarea
        placeholder="Optional notes for this level"
        rows={3}
        {...registerNotes}
      />
    </div>
  );
}

function AchievementsAlert({ achievements }: { achievements: string[] }) {
  if (!achievements?.length) return null;
  return (
    <Alert>
      <AlertTitle>Level achievements</AlertTitle>
      <AlertDescription>{achievements.join(' • ')}</AlertDescription>
    </Alert>
  );
}

function TierNoteAndClear({
  tier,
  tierNote,
  onClear,
}: {
  tier: string;
  tierNote: string;
  onClear: () => void;
}) {
  if (tier === '1') return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="text-muted-foreground">{tierNote}</div>
        <div />
      </div>
      <div className="flex items-center justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear selections
        </Button>
      </div>
    </div>
  );
}
