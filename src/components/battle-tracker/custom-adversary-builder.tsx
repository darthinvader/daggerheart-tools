/**
 * Custom Adversary Builder - Create custom adversaries from scratch
 */
import {
  Heart,
  Plus,
  PlusCircle,
  Save,
  Sparkles,
  Swords,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import type { Adversary } from '@/lib/schemas/adversaries';
import { cn } from '@/lib/utils';

import {
  ROLE_CARD_COLORS,
  ROLE_ICONS,
  ROLE_POINT_COSTS,
} from './adversary-card-shared';

// ============== Types ==============

interface CustomAdversaryState {
  name: string;
  description: string;
  tier: Adversary['tier'];
  role: Adversary['role'];
  hp: number;
  stress: number;
  difficulty: number;
  thresholdMajor: number;
  thresholdSevere: number;
  thresholdMassive: number | null;
  attackName: string;
  attackModifier: string;
  attackRange: string;
  attackDamage: string;
  motivesAndTactics: string;
  experiences: string[];
  features: Array<{ name: string; type: string; description: string }>;
}

const ROLES: Adversary['role'][] = [
  'Solo',
  'Leader',
  'Bruiser',
  'Standard',
  'Support',
  'Ranged',
  'Skulk',
  'Social',
  'Horde',
  'Minion',
];

const TIERS: Adversary['tier'][] = ['1', '2', '3', '4'];

const FEATURE_TYPES = ['Passive', 'Action', 'Reaction'] as const;

const TIER_DEFAULTS: Record<
  Adversary['tier'],
  {
    hp: number;
    stress: number;
    difficulty: number;
    major: number;
    severe: number;
  }
> = {
  '1': { hp: 6, stress: 3, difficulty: 10, major: 5, severe: 10 },
  '2': { hp: 12, stress: 5, difficulty: 13, major: 8, severe: 16 },
  '3': { hp: 18, stress: 7, difficulty: 16, major: 12, severe: 24 },
  '4': { hp: 24, stress: 9, difficulty: 19, major: 16, severe: 32 },
};

function getInitialState(): CustomAdversaryState {
  return {
    name: '',
    description: '',
    tier: '1',
    role: 'Standard',
    hp: 6,
    stress: 3,
    difficulty: 10,
    thresholdMajor: 5,
    thresholdSevere: 10,
    thresholdMassive: null,
    attackName: 'Attack',
    attackModifier: '+2',
    attackRange: 'Melee',
    attackDamage: 'd6 phy',
    motivesAndTactics: '',
    experiences: [],
    features: [],
  };
}

// ============== Component ==============

interface CustomAdversaryBuilderProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (adversary: Adversary) => void;
}

export function CustomAdversaryBuilder({
  isOpen,
  onOpenChange,
  onSave,
}: CustomAdversaryBuilderProps) {
  const [state, setState] = useState<CustomAdversaryState>(getInitialState());
  const [newExperience, setNewExperience] = useState('');
  const [newFeature, setNewFeature] = useState({
    name: '',
    type: 'Action',
    description: '',
  });

  const updateField = <K extends keyof CustomAdversaryState>(
    field: K,
    value: CustomAdversaryState[K]
  ) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleTierChange = (tier: Adversary['tier']) => {
    const defaults = TIER_DEFAULTS[tier];
    setState(prev => ({
      ...prev,
      tier,
      hp: defaults.hp,
      stress: defaults.stress,
      difficulty: defaults.difficulty,
      thresholdMajor: defaults.major,
      thresholdSevere: defaults.severe,
    }));
  };

  const addExperience = () => {
    if (newExperience.trim()) {
      setState(prev => ({
        ...prev,
        experiences: [...prev.experiences, newExperience.trim()],
      }));
      setNewExperience('');
    }
  };

  const removeExperience = (index: number) => {
    setState(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (newFeature.name.trim()) {
      setState(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }],
      }));
      setNewFeature({ name: '', type: 'Action', description: '' });
    }
  };

  const removeFeature = (index: number) => {
    setState(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const adversary: Adversary = {
      name: state.name || 'Custom Adversary',
      description: state.description || 'A custom adversary.',
      tier: state.tier,
      role: state.role,
      hp: state.hp,
      stress: state.stress,
      difficulty: state.difficulty,
      thresholds: {
        major: state.thresholdMajor,
        severe: state.thresholdSevere,
        massive: state.thresholdMassive ?? undefined,
      },
      attack: {
        name: state.attackName || 'Attack',
        modifier: state.attackModifier || '+0',
        range: state.attackRange || 'Melee',
        damage: state.attackDamage || 'd6 phy',
      },
      motivesAndTactics: state.motivesAndTactics || undefined,
      experiences: state.experiences,
      features: state.features.map(f => ({
        name: f.name,
        type: f.type,
        description: f.description,
      })),
    };
    onSave(adversary);
    setState(getInitialState());
    onOpenChange(false);
  };

  const roleColors = ROLE_CARD_COLORS[state.role] ?? {
    border: 'border-gray-500',
    bg: 'bg-gray-500/5',
    badge: 'bg-gray-500/20 text-gray-700',
  };
  const pointCost = ROLE_POINT_COSTS[state.role] ?? 2;
  const isValid = state.name.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className={`border-b px-6 py-4 ${roleColors.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/20">
                <Sparkles className="size-5 text-purple-500" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  Create Custom Adversary
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Build a unique adversary for your encounter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={roleColors.badge}>
                {ROLE_ICONS[state.role]} {state.role}
              </Badge>
              <Badge variant="secondary">{pointCost} pts</Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-6">
            {/* Basic Info */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Target className="size-4 text-blue-500" />
                Basic Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={state.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Enter adversary name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier">Tier</Label>
                  <Select
                    value={state.tier}
                    onValueChange={v =>
                      handleTierChange(v as Adversary['tier'])
                    }
                  >
                    <SelectTrigger id="tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map(t => (
                        <SelectItem key={t} value={t}>
                          Tier {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={state.role}
                    onValueChange={v =>
                      updateField('role', v as Adversary['role'])
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => (
                        <SelectItem key={r} value={r}>
                          {ROLE_ICONS[r]} {r} ({ROLE_POINT_COSTS[r]} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={state.description}
                    onChange={e => updateField('description', e.target.value)}
                    placeholder="Describe this adversary..."
                    rows={2}
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Combat Stats */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Heart className="size-4 text-red-500" />
                Combat Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="hp">HP</Label>
                  <Input
                    id="hp"
                    type="number"
                    value={state.hp}
                    onChange={e =>
                      updateField('hp', parseInt(e.target.value) || 0)
                    }
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stress">Stress</Label>
                  <Input
                    id="stress"
                    type="number"
                    value={state.stress}
                    onChange={e =>
                      updateField('stress', parseInt(e.target.value) || 0)
                    }
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    value={state.difficulty}
                    onChange={e =>
                      updateField('difficulty', parseInt(e.target.value) || 0)
                    }
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thresholds</Label>
                  <div className="flex items-center gap-1 text-xs">
                    <Input
                      type="number"
                      value={state.thresholdMajor}
                      onChange={e =>
                        updateField(
                          'thresholdMajor',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="h-8 w-12 px-1 text-center"
                      min={1}
                    />
                    <span>/</span>
                    <Input
                      type="number"
                      value={state.thresholdSevere}
                      onChange={e =>
                        updateField(
                          'thresholdSevere',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="h-8 w-12 px-1 text-center"
                      min={1}
                    />
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Attack */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Swords className="size-4 text-red-500" />
                Attack
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="attackName">Attack Name</Label>
                  <Input
                    id="attackName"
                    value={state.attackName}
                    onChange={e => updateField('attackName', e.target.value)}
                    placeholder="Sword Strike"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attackModifier">Modifier</Label>
                  <Input
                    id="attackModifier"
                    value={state.attackModifier}
                    onChange={e =>
                      updateField('attackModifier', e.target.value)
                    }
                    placeholder="+2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attackRange">Range</Label>
                  <Select
                    value={state.attackRange}
                    onValueChange={v => updateField('attackRange', v)}
                  >
                    <SelectTrigger id="attackRange">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Melee">Melee</SelectItem>
                      <SelectItem value="Very Close">Very Close</SelectItem>
                      <SelectItem value="Close">Close</SelectItem>
                      <SelectItem value="Far">Far</SelectItem>
                      <SelectItem value="Very Far">Very Far</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attackDamage">Damage</Label>
                  <Input
                    id="attackDamage"
                    value={state.attackDamage}
                    onChange={e => updateField('attackDamage', e.target.value)}
                    placeholder="d6 phy"
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Motives & Tactics */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Motives & Tactics</h3>
              <Textarea
                value={state.motivesAndTactics}
                onChange={e => updateField('motivesAndTactics', e.target.value)}
                placeholder="How does this adversary behave in combat?"
                rows={2}
              />
            </section>

            <Separator />

            {/* Experiences */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">
                Experiences ({state.experiences.length})
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newExperience}
                  onChange={e => setNewExperience(e.target.value)}
                  placeholder="e.g., Stealth +3"
                  onKeyDown={e => e.key === 'Enter' && addExperience()}
                />
                <Button size="icon" variant="outline" onClick={addExperience}>
                  <Plus className="size-4" />
                </Button>
              </div>
              {state.experiences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {state.experiences.map((exp, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                      {exp}
                      <button
                        onClick={() => removeExperience(i)}
                        className="hover:bg-destructive/20 ml-1 rounded"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </section>

            <Separator />

            {/* Features */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-purple-500" />
                Features ({state.features.length})
              </h3>
              <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
                <div className="grid gap-2 sm:grid-cols-3">
                  <Input
                    value={newFeature.name}
                    onChange={e =>
                      setNewFeature(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Feature name"
                  />
                  <Select
                    value={newFeature.type}
                    onValueChange={v =>
                      setNewFeature(prev => ({ ...prev, type: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEATURE_TYPES.map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={addFeature}
                    disabled={!newFeature.name.trim()}
                  >
                    <PlusCircle className="size-4" />
                    Add
                  </Button>
                </div>
                <Textarea
                  value={newFeature.description}
                  onChange={e =>
                    setNewFeature(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Feature description..."
                  rows={2}
                />
              </div>
              {state.features.length > 0 && (
                <ul className="space-y-2">
                  {state.features.map((f, i) => (
                    <li
                      key={i}
                      className="bg-background/50 flex items-start gap-2 rounded-md border p-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              f.type === 'Passive' &&
                                'border-gray-500 text-gray-500',
                              f.type === 'Action' &&
                                'border-green-500 text-green-500',
                              f.type === 'Reaction' &&
                                'border-blue-500 text-blue-500'
                            )}
                          >
                            {f.type}
                          </Badge>
                          <span className="text-sm font-medium">{f.name}</span>
                        </div>
                        {f.description && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {f.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/20 size-6 shrink-0"
                        onClick={() => removeFeature(i)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {isValid ? (
                <span className="text-green-600 dark:text-green-400">
                  Ready to save
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  Name is required
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isValid}
                className="gap-2"
              >
                <Save className="size-4" />
                Create Adversary
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
