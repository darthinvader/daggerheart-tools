import { useForm } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  getOptionsForTier,
  getPointsForLevel,
  getTierForLevel,
  validateLevelUpDecisions,
} from '@/features/characters/logic/progression';
import type { LevelUpEntry } from '@/features/characters/progression-storage';

export type LevelUpFormValues = {
  level: number;
  notes?: string;
  selections: Record<string, number>;
  selectAny?: boolean;
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
      selectAny: false,
    },
  });

  React.useEffect(() => {
    if (open)
      form.reset({
        level: targetLevel,
        notes: '',
        selections: {},
        selectAny: false,
      });
  }, [open, targetLevel, form]);

  const tier = getTierForLevel(targetLevel);
  const options = getOptionsForTier(tier) as Record<
    string,
    { cost: number; maxSelections: number }
  >;
  const budget = getPointsForLevel();

  // Resolve prior choices in this tier for gating (multiclass vs subclass)
  const priorTierFlags = React.useMemo(() => {
    const all = history ?? [];
    const inSameTier = all.filter(e => getTierForLevel(e.level) === tier);
    const beforeThisLevel = inSameTier.filter(e => e.level < targetLevel);
    let hadSubclassUpgradeInTier = false;
    let hadMulticlassInTier = false;
    // Ever means across the whole history, not just this tier
    const hadMulticlassEver = (history ?? []).some(e =>
      Object.entries(e.selections || {}).some(
        ([k, v]) => k.startsWith('Multiclass:') && v > 0
      )
    );
    for (const e of beforeThisLevel) {
      const entries = Object.entries(e.selections || {});
      for (const [k, v] of entries) {
        if (k.startsWith('Take an upgraded subclass card') && v > 0)
          hadSubclassUpgradeInTier = true;
        if (k.startsWith('Multiclass:') && v > 0) hadMulticlassInTier = true;
      }
    }
    return { hadSubclassUpgradeInTier, hadMulticlassInTier, hadMulticlassEver };
  }, [history, targetLevel, tier]);

  // Tally per-option selections already taken in this tier before target level
  const priorTaken: Record<string, number> = React.useMemo(() => {
    const all = history ?? [];
    const inSameTier = all.filter(e => getTierForLevel(e.level) === tier);
    const before = inSameTier.filter(e => e.level < targetLevel);
    const tally: Record<string, number> = {};
    for (const e of before) {
      for (const [k, v] of Object.entries(e.selections || {})) {
        tally[k] = (tally[k] ?? 0) + (Number(v) || 0);
      }
    }
    return tally;
  }, [history, tier, targetLevel]);

  const selections = form.watch('selections');
  const selectAny =
    (form.watch('selectAny' as unknown as keyof LevelUpFormValues) as
      | boolean
      | undefined) ?? false;
  const totalCost = React.useMemo(() => {
    if (selectAny) return 0; // bypass cost
    try {
      const res = validateLevelUpDecisions(selections ?? {}, tier);
      return res.totalCost;
    } catch {
      return Infinity; // indicates invalid
    }
  }, [selections, tier, selectAny]);

  const remaining = Number.isFinite(totalCost)
    ? Math.max(0, budget - (totalCost as number))
    : 0;

  // Autosave on drawer close when selection state is valid
  useDrawerAutosaveOnClose({
    open,
    trigger: () =>
      Promise.resolve(selectAny ? true : Number.isFinite(totalCost)),
    submit: () => submit(form.getValues()),
    skipRef: skipAutoSaveRef,
  });

  const achievements: string[] = React.useMemo(() => {
    const arr: string[] = [];
    if (targetLevel === 2) arr.push('+2 Experience, +1 Proficiency');
    if (targetLevel === 5)
      arr.push('+2 Experience, +1 Proficiency, clear trait marks');
    if (targetLevel === 8)
      arr.push('+2 Experience, +1 Proficiency, clear trait marks');
    return arr;
  }, [targetLevel]);

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

  const tierNote =
    tier === '2-4'
      ? 'Tier 2: choose any two options from this list.'
      : tier === '5-7'
        ? 'Tier 3: choose any two options from this or previous tiers.'
        : tier === '8-10'
          ? 'Tier 4: choose any two options from this or previous tiers.'
          : '';

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title={`Level Up to ${targetLevel}`}
      onCancel={handleCancel}
      onSubmit={handleSave}
      submitDisabled={!selectAny && !Number.isFinite(totalCost)}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div className="text-muted-foreground text-sm">
            {selectAny ? (
              <>Select Any enabled</>
            ) : (
              <>
                Points: {budget} • Spent:{' '}
                {Number.isFinite(totalCost) ? totalCost : '—'} • Remaining:{' '}
                {Number.isFinite(totalCost) ? remaining : '—'}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!selectAny && !Number.isFinite(totalCost)}
            >
              Save
            </Button>
          </div>
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
          {achievements.length > 0 && (
            <Alert>
              <AlertTitle>Level achievements</AlertTitle>
              <AlertDescription>{achievements.join(' • ')}</AlertDescription>
            </Alert>
          )}
          {tier !== '1' && (
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="text-muted-foreground">{tierNote}</div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Select Any</span>
                <Switch
                  checked={Boolean(selectAny)}
                  onCheckedChange={val =>
                    form.setValue('selectAny' as never, Boolean(val) as never)
                  }
                />
              </div>
            </div>
          )}
          {tier !== '1' && (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                Clear selections
              </Button>
            </div>
          )}
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
              {Object.entries(options).map(([key, def]) => {
                const cur = (selections?.[key] ?? 0) as number;
                const already = priorTaken[key] ?? 0;
                const remainingAllTime = Math.max(
                  0,
                  def.maxSelections - already
                );
                const atMax = cur >= remainingAllTime;
                const isSubclassUpgrade = key.startsWith(
                  'Take an upgraded subclass card'
                );
                const isMulticlass = key.startsWith('Multiclass:');
                const selectedMulticlassThisLevel = Object.entries(
                  selections || {}
                ).some(([k, v]) => k.startsWith('Multiclass:') && v > 0);
                const selectedSubclassThisLevel = Object.entries(
                  selections || {}
                ).some(
                  ([k, v]) =>
                    k.startsWith('Take an upgraded subclass card') && v > 0
                );
                const gatedDisabled =
                  (isSubclassUpgrade &&
                    (priorTierFlags.hadMulticlassInTier ||
                      selectedMulticlassThisLevel)) ||
                  (isMulticlass &&
                    (priorTierFlags.hadSubclassUpgradeInTier ||
                      priorTierFlags.hadMulticlassEver ||
                      selectedSubclassThisLevel));
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{key}</div>
                      <div className="text-muted-foreground text-xs">
                        Cost {def.cost}, up to {def.maxSelections} • Taken{' '}
                        {already} • Remaining {remainingAllTime}
                      </div>
                      {atMax && (
                        <div className="text-muted-foreground text-xs">
                          Max selections reached
                        </div>
                      )}
                      {gatedDisabled && (
                        <div className="text-muted-foreground text-xs">
                          {isMulticlass
                            ? 'Disabled: you have already upgraded subclass in this tier or multiclassed previously.'
                            : 'Disabled: you chose multiclass in this tier.'}
                        </div>
                      )}
                      {key.startsWith('Increase your Proficiency') && (
                        <div className="text-muted-foreground text-xs">
                          Uses both points this level; also increase weapon
                          damage dice by 1.
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={String(cur)}
                        onValueChange={val => {
                          const next = Math.max(
                            0,
                            Math.min(Number(val) || 0, remainingAllTime)
                          );
                          if (selectAny) {
                            form.setValue(`selections.${key}` as const, next, {
                              shouldValidate: true,
                            });
                            return;
                          }
                          // Compute budget-aware maximum
                          const budgetLocal = getPointsForLevel();
                          let otherCost = 0;
                          for (const [k2, v2] of Object.entries(
                            selections || {}
                          )) {
                            if (k2 === key) continue;
                            const def2 = (
                              options as Record<
                                string,
                                { cost: number; maxSelections: number }
                              >
                            )[k2];
                            if (
                              !def2 ||
                              !Number.isFinite(v2) ||
                              (v2 as number) <= 0
                            )
                              continue;
                            otherCost += (v2 as number) * def2.cost;
                          }
                          const maxByBudget = Math.max(
                            0,
                            Math.floor((budgetLocal - otherCost) / def.cost)
                          );
                          const safeVal = Math.min(next, maxByBudget);
                          form.setValue(`selections.${key}` as const, safeVal, {
                            shouldValidate: true,
                          });
                        }}
                        disabled={gatedDisabled}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: Math.max(0, remainingAllTime) + 1 },
                            (_, i) => i
                          ).map(n => {
                            if (selectAny) {
                              return (
                                <SelectItem key={n} value={String(n)}>
                                  {n}
                                </SelectItem>
                              );
                            }
                            // Determine if choosing n would exceed budget given other picks
                            let otherCost = 0;
                            for (const [k2, v2] of Object.entries(
                              selections || {}
                            )) {
                              if (k2 === key) continue;
                              const def2 = (
                                options as Record<
                                  string,
                                  { cost: number; maxSelections: number }
                                >
                              )[k2];
                              if (
                                !def2 ||
                                !Number.isFinite(v2) ||
                                (v2 as number) <= 0
                              )
                                continue;
                              otherCost += (v2 as number) * def2.cost;
                            }
                            const canAfford =
                              otherCost + n * def.cost <= budget;
                            return (
                              <SelectItem
                                key={n}
                                value={String(n)}
                                disabled={!canAfford}
                              >
                                {n}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </Form>
    </DrawerScaffold>
  );
}
