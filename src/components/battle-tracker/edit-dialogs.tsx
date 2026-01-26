import {
  Crosshair,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  Swords,
  Trash2,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type {
  AdversaryFeatureOverride,
  AdversaryTracker,
  EnvironmentTracker,
} from './types';

interface EditAdversaryDialogProps {
  adversary: AdversaryTracker | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<AdversaryTracker>) => void;
}

export function EditAdversaryDialog({
  adversary,
  isOpen,
  onOpenChange,
  onSave,
}: EditAdversaryDialogProps) {
  const [hp, setHp] = useState(() => adversary?.hp.current ?? 0);
  const [hpMax, setHpMax] = useState(() => adversary?.hp.max ?? 0);
  const [stress, setStress] = useState(() => adversary?.stress.current ?? 0);
  const [stressMax, setStressMax] = useState(() => adversary?.stress.max ?? 0);
  const [difficulty, setDifficulty] = useState(
    () => adversary?.difficultyOverride ?? adversary?.source.difficulty ?? 0
  );
  const [notes, setNotes] = useState(() => adversary?.notes ?? '');

  // Attack state
  const [attackName, setAttackName] = useState(
    () => adversary?.attackOverride?.name ?? adversary?.source.attack.name ?? ''
  );
  const [attackModifier, setAttackModifier] = useState(() =>
    String(
      adversary?.attackOverride?.modifier ??
        adversary?.source.attack.modifier ??
        ''
    )
  );
  const [attackRange, setAttackRange] = useState(
    () =>
      adversary?.attackOverride?.range ?? adversary?.source.attack.range ?? ''
  );
  const [attackDamage, setAttackDamage] = useState(
    () =>
      adversary?.attackOverride?.damage ?? adversary?.source.attack.damage ?? ''
  );

  // Thresholds state
  const [thresholdMajor, setThresholdMajor] = useState(() => {
    const t =
      adversary?.thresholdsOverride ??
      (typeof adversary?.source.thresholds === 'object'
        ? adversary.source.thresholds
        : null);
    return t?.major ?? 0;
  });
  const [thresholdSevere, setThresholdSevere] = useState(() => {
    const t =
      adversary?.thresholdsOverride ??
      (typeof adversary?.source.thresholds === 'object'
        ? adversary.source.thresholds
        : null);
    return t?.severe ?? 0;
  });
  const [thresholdMassive, setThresholdMassive] = useState(() => {
    const t =
      adversary?.thresholdsOverride ??
      (typeof adversary?.source.thresholds === 'object'
        ? adversary.source.thresholds
        : null);
    return t?.massive ?? null;
  });

  // Features state
  const [features, setFeatures] = useState<AdversaryFeatureOverride[]>(() => {
    if (adversary?.featuresOverride) return adversary.featuresOverride;
    return (adversary?.source.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: typeof f === 'string' ? f.split(':')[0].trim() : f.name,
      type: typeof f === 'string' ? undefined : f.type,
      description: typeof f === 'string' ? f : f.description,
      isCustom: false,
    }));
  });

  // New feature form
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureType, setNewFeatureType] = useState<string>('Passive');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  // Sync state when adversary changes or dialog opens
  /* eslint-disable react-hooks/set-state-in-effect -- Syncing local state from props when dialog opens is a valid pattern */
  useEffect(() => {
    if (adversary && isOpen) {
      setHp(adversary.hp.current);
      setHpMax(adversary.hp.max);
      setStress(adversary.stress.current);
      setStressMax(adversary.stress.max);
      setDifficulty(
        adversary.difficultyOverride ?? adversary.source.difficulty
      );
      setNotes(adversary.notes);

      // Attack
      setAttackName(
        adversary.attackOverride?.name ?? adversary.source.attack.name
      );
      setAttackModifier(
        String(
          adversary.attackOverride?.modifier ?? adversary.source.attack.modifier
        )
      );
      setAttackRange(
        adversary.attackOverride?.range ?? adversary.source.attack.range
      );
      setAttackDamage(
        adversary.attackOverride?.damage ?? adversary.source.attack.damage
      );

      // Thresholds
      const t =
        adversary.thresholdsOverride ??
        (typeof adversary.source.thresholds === 'object'
          ? adversary.source.thresholds
          : null);
      setThresholdMajor(t?.major ?? 0);
      setThresholdSevere(t?.severe ?? 0);
      setThresholdMassive(t?.massive ?? null);

      // Features
      if (adversary.featuresOverride) {
        setFeatures(adversary.featuresOverride);
      } else {
        setFeatures(
          adversary.source.features.map((f, i) => ({
            id: `feature-${i}`,
            name: typeof f === 'string' ? f.split(':')[0].trim() : f.name,
            type: typeof f === 'string' ? undefined : f.type,
            description: typeof f === 'string' ? f : f.description,
            isCustom: false,
          }))
        );
      }
    }
  }, [adversary, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = () => {
    const baseDifficulty = adversary?.source.difficulty ?? 0;
    const baseAttack = adversary?.source.attack;
    const baseThresholds =
      typeof adversary?.source.thresholds === 'object'
        ? adversary.source.thresholds
        : null;

    // Check if attack was modified
    const attackModified =
      attackName !== baseAttack?.name ||
      attackModifier !== String(baseAttack?.modifier) ||
      attackRange !== baseAttack?.range ||
      attackDamage !== baseAttack?.damage;

    // Check if thresholds were modified (handle null comparisons properly)
    const thresholdsModified =
      baseThresholds !== null &&
      (thresholdMajor !== (baseThresholds.major ?? 0) ||
        thresholdSevere !== (baseThresholds.severe ?? 0) ||
        thresholdMassive !== (baseThresholds.massive ?? null));

    onSave({
      hp: { current: hp, max: hpMax },
      stress: { current: stress, max: stressMax },
      difficultyOverride:
        difficulty !== baseDifficulty ? difficulty : undefined,
      attackOverride: attackModified
        ? {
            name: attackName,
            modifier: attackModifier,
            range: attackRange,
            damage: attackDamage,
          }
        : undefined,
      thresholdsOverride: thresholdsModified
        ? {
            major: thresholdMajor,
            severe: thresholdSevere,
            massive: thresholdMassive,
          }
        : undefined,
      featuresOverride: features,
      notes,
    });
    onOpenChange(false);
  };

  const addFeature = () => {
    if (!newFeatureName.trim()) return;
    setFeatures(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newFeatureName.trim(),
        type: newFeatureType,
        description: newFeatureDesc.trim(),
        isCustom: true,
      },
    ]);
    setNewFeatureName('');
    setNewFeatureDesc('');
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const resetToOriginal = () => {
    if (!adversary) return;
    setDifficulty(adversary.source.difficulty);
    setAttackName(adversary.source.attack.name);
    setAttackModifier(String(adversary.source.attack.modifier));
    setAttackRange(adversary.source.attack.range);
    setAttackDamage(adversary.source.attack.damage);
    const t =
      typeof adversary.source.thresholds === 'object'
        ? adversary.source.thresholds
        : null;
    setThresholdMajor(t?.major ?? 0);
    setThresholdSevere(t?.severe ?? 0);
    setThresholdMassive(t?.massive ?? null);
    setFeatures(
      adversary.source.features.map((f, i) => ({
        id: `feature-${i}`,
        name: typeof f === 'string' ? f.split(':')[0].trim() : f.name,
        type: typeof f === 'string' ? undefined : f.type,
        description: typeof f === 'string' ? f : f.description,
        isCustom: false,
      }))
    );
  };

  if (!adversary) return null;

  const baseDifficulty = adversary.source.difficulty;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit: {adversary.source.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Info Section */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">Tier {adversary.source.tier}</Badge>
                <Badge variant="outline">{adversary.source.role}</Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {adversary.source.description}
              </p>
            </div>

            <Separator />

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <StatEditor
                label="HP"
                current={hp}
                max={hpMax}
                onCurrentChange={setHp}
                onMaxChange={setHpMax}
              />
              <StatEditor
                label="Stress"
                current={stress}
                max={stressMax}
                onCurrentChange={setStress}
                onMaxChange={setStressMax}
              />
            </div>

            <Separator />

            {/* Difficulty Editor */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Crosshair className="size-4 text-blue-500" />
                Difficulty (to hit)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => setDifficulty(Math.max(1, difficulty - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={difficulty}
                    onChange={e =>
                      setDifficulty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center text-lg font-bold"
                  />
                  {difficulty !== baseDifficulty && (
                    <Badge variant="secondary" className="text-xs">
                      Base: {baseDifficulty}
                    </Badge>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => setDifficulty(difficulty + 1)}
                >
                  <Plus className="size-4" />
                </Button>
                {difficulty !== baseDifficulty && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDifficulty(baseDifficulty)}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Attack Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Swords className="size-4 text-red-500" />
                  Attack
                </Label>
                {(attackName !== adversary.source.attack.name ||
                  attackModifier !== String(adversary.source.attack.modifier) ||
                  attackRange !== adversary.source.attack.range ||
                  attackDamage !== adversary.source.attack.damage) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={() => {
                      setAttackName(adversary.source.attack.name);
                      setAttackModifier(
                        String(adversary.source.attack.modifier)
                      );
                      setAttackRange(adversary.source.attack.range);
                      setAttackDamage(adversary.source.attack.damage);
                    }}
                  >
                    <RotateCcw className="mr-1 size-3" />
                    Reset
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <Input
                    value={attackName}
                    onChange={e => setAttackName(e.target.value)}
                    placeholder="Attack name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Modifier
                  </Label>
                  <Input
                    value={attackModifier}
                    onChange={e => setAttackModifier(e.target.value)}
                    placeholder="+5"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Range</Label>
                  <Input
                    value={attackRange}
                    onChange={e => setAttackRange(e.target.value)}
                    placeholder="Melee / Very Close"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Damage
                  </Label>
                  <Input
                    value={attackDamage}
                    onChange={e => setAttackDamage(e.target.value)}
                    placeholder="2d6+3"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Thresholds Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="size-4 text-amber-500" />
                  Damage Thresholds
                </Label>
                {typeof adversary.source.thresholds !== 'string' &&
                  (thresholdMajor !==
                    (adversary.source.thresholds.major ?? 0) ||
                    thresholdSevere !==
                      (adversary.source.thresholds.severe ?? 0) ||
                    thresholdMassive !==
                      (adversary.source.thresholds.massive ?? null)) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => {
                        if (typeof adversary.source.thresholds !== 'string') {
                          setThresholdMajor(
                            adversary.source.thresholds.major ?? 0
                          );
                          setThresholdSevere(
                            adversary.source.thresholds.severe ?? 0
                          );
                          setThresholdMassive(
                            adversary.source.thresholds.massive ?? null
                          );
                        }
                      }}
                    >
                      <RotateCcw className="mr-1 size-3" />
                      Reset
                    </Button>
                  )}
              </div>
              {typeof adversary.source.thresholds === 'string' ? (
                <p className="text-muted-foreground bg-muted/50 rounded-md p-3 text-sm">
                  {adversary.source.thresholds}
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">
                      Major
                    </Label>
                    <Input
                      type="number"
                      value={thresholdMajor}
                      onChange={e =>
                        setThresholdMajor(parseInt(e.target.value) || 0)
                      }
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">
                      Severe
                    </Label>
                    <Input
                      type="number"
                      value={thresholdSevere}
                      onChange={e =>
                        setThresholdSevere(parseInt(e.target.value) || 0)
                      }
                      placeholder="12"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">
                      Massive (optional)
                    </Label>
                    <Input
                      type="number"
                      value={thresholdMassive ?? ''}
                      onChange={e =>
                        setThresholdMassive(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="20"
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Features Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="size-4 text-purple-500" />
                  Features
                </Label>
                {features.length !== adversary.source.features.length && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={resetToOriginal}
                  >
                    <RotateCcw className="mr-1 size-3" />
                    Reset All
                  </Button>
                )}
              </div>

              {/* Existing Features */}
              {features.length > 0 ? (
                <ul className="space-y-2">
                  {features.map(f => (
                    <li
                      key={f.id}
                      className="bg-muted/30 flex items-start justify-between gap-2 rounded-md p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{f.name}</span>
                          {f.type && (
                            <Badge variant="outline" className="text-xs">
                              {f.type}
                            </Badge>
                          )}
                          {f.isCustom && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {f.description}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive size-7 shrink-0"
                        onClick={() => removeFeature(f.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No features. Add one below.
                </p>
              )}

              {/* Add New Feature Form */}
              <div className="bg-muted/20 space-y-3 rounded-md border border-dashed p-3">
                <Label className="text-xs font-medium">Add New Feature</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    value={newFeatureName}
                    onChange={e => setNewFeatureName(e.target.value)}
                    placeholder="Feature name"
                    className="text-sm"
                  />
                  <Select
                    value={newFeatureType}
                    onValueChange={setNewFeatureType}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="passive">Passive</SelectItem>
                      <SelectItem value="reaction">Reaction</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <textarea
                  className="border-input bg-background w-full rounded-md border p-2 text-sm"
                  rows={2}
                  value={newFeatureDesc}
                  onChange={e => setNewFeatureDesc(e.target.value)}
                  placeholder="Feature description..."
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={addFeature}
                  disabled={!newFeatureName.trim() || !newFeatureDesc.trim()}
                  className="w-full"
                >
                  <Plus className="mr-1 size-4" />
                  Add Feature
                </Button>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="border-input bg-background w-full rounded-md border p-3 text-sm"
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add combat notes, status effects, etc..."
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditEnvironmentDialogProps {
  environment: EnvironmentTracker | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<EnvironmentTracker>) => void;
}

export function EditEnvironmentDialog({
  environment,
  isOpen,
  onOpenChange,
  onSave,
}: EditEnvironmentDialogProps) {
  const [countdown, setCountdown] = useState(() => environment?.countdown ?? 0);
  const [notes, setNotes] = useState(() => environment?.notes ?? '');
  const [features, setFeatures] = useState<EnvironmentTracker['features']>(
    () => environment?.features ?? []
  );

  // Sync state when environment changes or dialog opens
  /* eslint-disable react-hooks/set-state-in-effect -- Syncing local state from props when dialog opens is a valid pattern */
  useEffect(() => {
    if (environment && isOpen) {
      setCountdown(environment.countdown ?? 0);
      setNotes(environment.notes);
      setFeatures(environment.features);
    }
  }, [environment, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = () => {
    onSave({ countdown, notes, features });
    onOpenChange(false);
  };

  const toggleFeature = (id: string) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  if (!environment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit: {environment.source.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Info Section */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">
                  Tier {environment.source.tier}
                </Badge>
                <Badge variant="outline">{environment.source.type}</Badge>
                <Badge variant="outline">
                  Difficulty {environment.source.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {environment.source.description}
              </p>
            </div>

            <Separator />

            {/* Impulses */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Impulses</Label>
              <div className="flex flex-wrap gap-1.5">
                {environment.source.impulses.map(imp => (
                  <Badge key={imp} variant="secondary">
                    {imp}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Countdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Countdown Timer</Label>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCountdown(Math.max(0, countdown - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <Input
                  type="number"
                  value={countdown}
                  onChange={e =>
                    setCountdown(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-20 text-center"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCountdown(countdown + 1)}
                >
                  <Plus className="size-4" />
                </Button>
                <span className="text-muted-foreground text-sm">
                  {countdown === 0
                    ? 'No countdown'
                    : countdown === 1
                      ? '1 tick remaining'
                      : `${countdown} ticks remaining`}
                </span>
              </div>
            </div>

            <Separator />

            {/* Features (Toggle Active) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Features ({features.filter(f => f.active).length} /{' '}
                {features.length} active)
              </Label>
              <div className="space-y-2">
                {features.map(f => (
                  <label
                    key={f.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
                      f.active
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={f.active}
                      onChange={() => toggleFeature(f.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {f.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="env-notes">Notes</Label>
              <textarea
                id="env-notes"
                className="border-input bg-background w-full rounded-md border p-3 text-sm"
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add scene notes, ongoing effects, etc..."
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatEditor({
  label,
  current,
  max,
  onCurrentChange,
  onMaxChange,
}: {
  label: string;
  current: number;
  max: number;
  onCurrentChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => onCurrentChange(Math.max(0, current - 1))}
          >
            <Minus className="size-3" />
          </Button>
          <Input
            type="number"
            value={current}
            onChange={e =>
              onCurrentChange(Math.max(0, parseInt(e.target.value) || 0))
            }
            className="h-8 w-16 text-center"
          />
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => onCurrentChange(Math.min(max, current + 1))}
          >
            <Plus className="size-3" />
          </Button>
        </div>
        <span className="text-muted-foreground">/</span>
        <Input
          type="number"
          value={max}
          onChange={e =>
            onMaxChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="h-8 w-16 text-center"
          title="Max value"
        />
      </div>
    </div>
  );
}
