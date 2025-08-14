import { useForm } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  getOptionsForTier,
  getPointsForLevel,
  getTierForLevel,
  validateLevelUpDecisions,
} from '@/features/characters/logic/progression';

export type LevelUpFormValues = {
  level: number;
  notes?: string;
  selections: Record<string, number>;
};

export type LevelUpDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
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
  submit,
  onCancel,
}: LevelUpDrawerProps) {
  const form = useForm<LevelUpFormValues>({
    mode: 'onChange',
    defaultValues: { level, notes: '', selections: {} },
  });

  React.useEffect(() => {
    if (open) form.reset({ level, notes: '', selections: {} });
  }, [open, level, form]);

  const tier = getTierForLevel(level);
  const options = getOptionsForTier(tier) as Record<
    string,
    { cost: number; maxSelections: number }
  >;
  const budget = getPointsForLevel();

  const totalCost = React.useMemo(() => {
    try {
      const res = validateLevelUpDecisions(
        form.getValues().selections ?? {},
        tier
      );
      return res.totalCost;
    } catch {
      return Infinity; // indicates invalid
    }
  }, [form, tier]);

  const remaining = Number.isFinite(totalCost)
    ? Math.max(0, budget - (totalCost as number))
    : 0;

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title={`Level Up to ${level}`}
      onCancel={onCancel}
      onSubmit={() => submit(form.getValues())}
      submitDisabled={!form.formState.isValid || !Number.isFinite(totalCost)}
      footer={
        <div className="text-muted-foreground text-sm">
          Points: {budget} • Spent:{' '}
          {Number.isFinite(totalCost) ? totalCost : '—'} • Remaining:{' '}
          {Number.isFinite(totalCost) ? remaining : '—'}
        </div>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Optional notes for this level"
              value={form.watch('notes') ?? ''}
              onChange={e => form.setValue('notes', e.target.value)}
            />
          </div>
          {tier === '1' ? (
            <div className="text-muted-foreground text-sm">
              No point spending at level 1.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(options).map(([key, def]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-sm font-medium">{key}</div>
                    <div className="text-muted-foreground text-xs">
                      Cost {def.cost}, up to {def.maxSelections}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        const cur =
                          form.getValues(`selections.${key}` as const) ?? 0;
                        if (cur <= 0) return;
                        form.setValue(`selections.${key}` as const, cur - 1, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      −
                    </Button>
                    <Input
                      className="w-16 text-center"
                      type="number"
                      inputMode="numeric"
                      value={
                        (form.getValues().selections?.[key] ?? 0) as number
                      }
                      onChange={e => {
                        const val = Math.max(
                          0,
                          Math.floor(Number(e.target.value) || 0)
                        );
                        form.setValue(`selections.${key}` as const, val, {
                          shouldValidate: true,
                        });
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        const cur =
                          form.getValues(`selections.${key}` as const) ?? 0;
                        form.setValue(`selections.${key}` as const, cur + 1, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </Form>
    </DrawerScaffold>
  );
}
