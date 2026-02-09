/**
 * Custom Adversary Builder Sections
 *
 * Extracted section components to reduce CustomAdversaryBuilder complexity.
 */
import {
  Heart,
  Plus,
  PlusCircle,
  Sparkles,
  Swords,
  Target,
  Trash2,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TIERS } from '@/lib/constants';
import type { Adversary } from '@/lib/schemas/adversaries';
import { cn } from '@/lib/utils';

import { ROLE_ICONS, ROLE_POINT_COSTS } from './adversary-card-shared';

// ============== Types ==============

export interface CustomAdversaryState {
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

export const ROLES: Adversary['role'][] = [
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

export const FEATURE_TYPES = ['Passive', 'Action', 'Reaction'] as const;

export const TIER_DEFAULTS: Record<
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

export function getInitialState(): CustomAdversaryState {
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

// ============== Section Components ==============

interface BasicInfoSectionProps {
  state: CustomAdversaryState;
  onTierChange: (tier: Adversary['tier']) => void;
  onRoleChange: (role: Adversary['role']) => void;
  onFieldChange: <K extends keyof CustomAdversaryState>(
    field: K,
    value: CustomAdversaryState[K]
  ) => void;
}

export function BasicInfoSection({
  state,
  onTierChange,
  onRoleChange,
  onFieldChange,
}: BasicInfoSectionProps) {
  return (
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
            onChange={e => onFieldChange('name', e.target.value)}
            placeholder="Enter adversary name..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tier">Tier</Label>
          <Select
            value={state.tier}
            onValueChange={v => onTierChange(v as Adversary['tier'])}
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
            onValueChange={v => onRoleChange(v as Adversary['role'])}
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
            onChange={e => onFieldChange('description', e.target.value)}
            placeholder="Describe this adversary..."
            rows={2}
          />
        </div>
      </div>
    </section>
  );
}

interface CombatStatsSectionProps {
  state: CustomAdversaryState;
  onFieldChange: <K extends keyof CustomAdversaryState>(
    field: K,
    value: CustomAdversaryState[K]
  ) => void;
}

export function CombatStatsSection({
  state,
  onFieldChange,
}: CombatStatsSectionProps) {
  return (
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
            onChange={e => onFieldChange('hp', parseInt(e.target.value) || 0)}
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
              onFieldChange('stress', parseInt(e.target.value) || 0)
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
              onFieldChange('difficulty', parseInt(e.target.value) || 0)
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
                onFieldChange('thresholdMajor', parseInt(e.target.value) || 0)
              }
              className="h-8 w-12 px-1 text-center"
              min={1}
            />
            <span>/</span>
            <Input
              type="number"
              value={state.thresholdSevere}
              onChange={e =>
                onFieldChange('thresholdSevere', parseInt(e.target.value) || 0)
              }
              className="h-8 w-12 px-1 text-center"
              min={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface AttackSectionProps {
  state: CustomAdversaryState;
  onFieldChange: <K extends keyof CustomAdversaryState>(
    field: K,
    value: CustomAdversaryState[K]
  ) => void;
}

export function AttackSection({ state, onFieldChange }: AttackSectionProps) {
  return (
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
            onChange={e => onFieldChange('attackName', e.target.value)}
            placeholder="Sword Strike"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attackModifier">Modifier</Label>
          <Input
            id="attackModifier"
            value={state.attackModifier}
            onChange={e => onFieldChange('attackModifier', e.target.value)}
            placeholder="+2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attackRange">Range</Label>
          <Select
            value={state.attackRange}
            onValueChange={v => onFieldChange('attackRange', v)}
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
            onChange={e => onFieldChange('attackDamage', e.target.value)}
            placeholder="d6 phy"
          />
        </div>
      </div>
    </section>
  );
}

interface MotivesTacticsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function MotivesTacticsSection({
  value,
  onChange,
}: MotivesTacticsSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold">Motives & Tactics</h3>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="How does this adversary behave in combat?"
        rows={2}
      />
    </section>
  );
}

interface ExperiencesSectionProps {
  experiences: string[];
  newExperience: string;
  onNewExperienceChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ExperiencesSection({
  experiences,
  newExperience,
  onNewExperienceChange,
  onAdd,
  onRemove,
}: ExperiencesSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold">
        Experiences ({experiences.length})
      </h3>
      <div className="flex gap-2">
        <Input
          value={newExperience}
          onChange={e => onNewExperienceChange(e.target.value)}
          placeholder="e.g., Stealth +3"
          onKeyDown={e => e.key === 'Enter' && onAdd()}
        />
        <Button size="icon" variant="outline" onClick={onAdd}>
          <Plus className="size-4" />
        </Button>
      </div>
      {experiences.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experiences.map((exp, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {exp}
              <button
                onClick={() => onRemove(i)}
                className="hover:bg-destructive/20 ml-1 rounded"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

interface FeaturesSectionProps {
  features: Array<{ name: string; type: string; description: string }>;
  newFeature: { name: string; type: string; description: string };
  onNewFeatureChange: (
    feature: Partial<{ name: string; type: string; description: string }>
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function FeaturesSection({
  features,
  newFeature,
  onNewFeatureChange,
  onAdd,
  onRemove,
}: FeaturesSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="size-4 text-purple-500" />
        Features ({features.length})
      </h3>
      <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <Input
            value={newFeature.name}
            onChange={e => onNewFeatureChange({ name: e.target.value })}
            placeholder="Feature name"
          />
          <Select
            value={newFeature.type}
            onValueChange={v => onNewFeatureChange({ type: v })}
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
            onClick={onAdd}
            disabled={!newFeature.name.trim()}
          >
            <PlusCircle className="size-4" />
            Add
          </Button>
        </div>
        <Textarea
          value={newFeature.description}
          onChange={e => onNewFeatureChange({ description: e.target.value })}
          placeholder="Feature description..."
          rows={2}
        />
      </div>
      {features.length > 0 && (
        <ul className="space-y-2">
          {features.map((f, i) => (
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
                      f.type === 'Passive' && 'border-gray-500 text-gray-500',
                      f.type === 'Action' && 'border-green-500 text-green-500',
                      f.type === 'Reaction' && 'border-blue-500 text-blue-500'
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
                onClick={() => onRemove(i)}
              >
                <Trash2 className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
