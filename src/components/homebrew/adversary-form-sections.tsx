/**
 * Adversary Form Sections
 *
 * Extracted section components for the AdversaryForm to reduce complexity.
 */
import {
  Award,
  Heart,
  Plus,
  Skull,
  Sparkles,
  Swords,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

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
import type { HomebrewAdversary } from '@/lib/schemas/homebrew';
import { cn } from '@/lib/utils';

import type { AdversaryFeatureState } from './use-adversary-form-state';

// Constants exported for reuse
export const ROLES = [
  'Bruiser',
  'Horde',
  'Leader',
  'Minion',
  'Ranged',
  'Skulk',
  'Social',
  'Solo',
  'Standard',
  'Support',
] as const;

export const ROLE_COLORS: Record<string, string> = {
  Bruiser: 'border-orange-500/30 bg-orange-500/5',
  Horde: 'border-yellow-500/30 bg-yellow-500/5',
  Leader: 'border-purple-500/30 bg-purple-500/5',
  Minion: 'border-gray-500/30 bg-gray-500/5',
  Ranged: 'border-blue-500/30 bg-blue-500/5',
  Skulk: 'border-slate-500/30 bg-slate-500/5',
  Social: 'border-pink-500/30 bg-pink-500/5',
  Solo: 'border-red-500/30 bg-red-500/5',
  Standard: 'border-zinc-500/30 bg-zinc-500/5',
  Support: 'border-green-500/30 bg-green-500/5',
};

export { TIERS };

export const FEATURE_TYPES = [
  'Passive',
  'Action',
  'Reaction',
  'Feature',
] as const;

export const ATTACK_NAMES = [
  'Bite',
  'Claw',
  'Claws',
  'Club',
  'Daggers',
  'Fangs',
  'Fist Slam',
  'Gore',
  'Proboscis',
  'Slam',
  'Stomp',
  'Strike',
  'Sword',
  'Tail Swipe',
  'Talons',
  'Vines',
  'Web',
] as const;

export const ATTACK_RANGES = [
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
] as const;

export const PREDEFINED_EXPERIENCES = [
  'Ambusher',
  'Camouflage',
  'Climber',
  'Fearsome',
  'Flight',
  'Huge',
  'Keen Senses',
  'Magical Resistance',
  'Pack Tactics',
  'Poison',
  'Socialite',
  'Stealthy',
  'Swimmer',
  'Throw',
  'Tracker',
  'Tremor Sense',
  'Undead Fortitude',
] as const;

type AdversaryContent = HomebrewAdversary['content'];

interface BasicInfoSectionProps {
  formData: AdversaryContent;
  setFormData: Dispatch<SetStateAction<AdversaryContent>>;
  roleColor: string;
}

export function AdversaryBasicInfoSection({
  formData,
  setFormData,
  roleColor,
}: BasicInfoSectionProps) {
  return (
    <section className={cn('space-y-4 rounded-lg border p-4', roleColor)}>
      <h3 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
        <Skull className="size-4" /> Basic Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            placeholder="Adversary name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Tier *</Label>
            <Select
              value={String(formData.tier)}
              onValueChange={v =>
                setFormData(prev => ({
                  ...prev,
                  tier: v as typeof formData.tier,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIERS.map(tier => (
                  <SelectItem key={tier} value={tier}>
                    Tier {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              value={formData.role}
              onValueChange={v =>
                setFormData(prev => ({
                  ...prev,
                  role: v as typeof formData.role,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Describe the adversary's appearance and nature..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motives">Motives & Tactics</Label>
        <Textarea
          id="motives"
          value={formData.motivesAndTactics ?? ''}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              motivesAndTactics: e.target.value,
            }))
          }
          placeholder="What drives this adversary? How do they fight?"
          rows={2}
        />
      </div>
    </section>
  );
}

interface CombatStatsSectionProps {
  formData: AdversaryContent;
  setFormData: Dispatch<SetStateAction<AdversaryContent>>;
  updateThreshold: (type: 'major' | 'severe', value: string) => void;
  getThresholdValue: (
    data: AdversaryContent,
    type: 'major' | 'severe'
  ) => string;
  getMassiveThreshold: (data: AdversaryContent) => string;
}

export function AdversaryCombatStatsSection({
  formData,
  setFormData,
  updateThreshold,
  getThresholdValue,
  getMassiveThreshold,
}: CombatStatsSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-pink-500/30 bg-pink-500/5 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-pink-600 dark:text-pink-400">
        <Heart className="size-4" /> Combat Stats
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hp">Hit Points *</Label>
          <Input
            id="hp"
            type="number"
            min={1}
            value={formData.hp}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                hp: parseInt(e.target.value, 10) || 1,
              }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stress">Stress *</Label>
          <Input
            id="stress"
            type="number"
            min={0}
            value={formData.stress}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                stress: parseInt(e.target.value, 10) || 0,
              }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty *</Label>
          <Input
            id="difficulty"
            type="number"
            min={1}
            value={formData.difficulty}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                difficulty: parseInt(e.target.value, 10) || 10,
              }))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Damage Thresholds</Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">Major</span>
            <Input
              type="number"
              min={1}
              value={getThresholdValue(formData, 'major')}
              onChange={e => updateThreshold('major', e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">Severe</span>
            <Input
              type="number"
              min={1}
              value={getThresholdValue(formData, 'severe')}
              onChange={e => updateThreshold('severe', e.target.value)}
              placeholder="10"
            />
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">
              Massive (2× Severe)
            </span>
            <div className="bg-muted flex h-9 items-center rounded-md border px-3 text-sm">
              {getMassiveThreshold(formData)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface AttackSectionProps {
  formData: AdversaryContent;
  setFormData: Dispatch<SetStateAction<AdversaryContent>>;
  attackNameMode: 'preset' | 'custom';
  setAttackNameMode: Dispatch<SetStateAction<'preset' | 'custom'>>;
}

export function AdversaryAttackSection({
  formData,
  setFormData,
  attackNameMode,
  setAttackNameMode,
}: AttackSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
        <Swords className="size-4" /> Attack
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Attack Name *</Label>
          <Select
            value={
              attackNameMode === 'custom' ? 'custom' : formData.attack.name
            }
            onValueChange={v => {
              if (v === 'custom') {
                setAttackNameMode('custom');
              } else {
                setAttackNameMode('preset');
                setFormData(prev => ({
                  ...prev,
                  attack: { ...prev.attack, name: v },
                }));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select attack name" />
            </SelectTrigger>
            <SelectContent>
              {ATTACK_NAMES.map(name => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom...</SelectItem>
            </SelectContent>
          </Select>
          {attackNameMode === 'custom' && (
            <Input
              value={formData.attack.name}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  attack: { ...prev.attack, name: e.target.value },
                }))
              }
              placeholder="Custom attack name"
              required
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="attackModifier">Modifier *</Label>
          <Input
            id="attackModifier"
            value={String(formData.attack.modifier)}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                attack: { ...prev.attack, modifier: e.target.value },
              }))
            }
            placeholder="+2"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Range *</Label>
          <Select
            value={formData.attack.range}
            onValueChange={v =>
              setFormData(prev => ({
                ...prev,
                attack: { ...prev.attack, range: v },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {ATTACK_RANGES.map(range => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attackDamage">Damage *</Label>
          <Input
            id="attackDamage"
            value={formData.attack.damage}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                attack: { ...prev.attack, damage: e.target.value },
              }))
            }
            placeholder="1d6+2"
            required
          />
        </div>
      </div>
    </section>
  );
}

interface FeaturesSectionProps {
  features: AdversaryFeatureState[];
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, updates: Partial<AdversaryFeatureState>) => void;
}

export function AdversaryFeaturesSection({
  features,
  addFeature,
  removeFeature,
  updateFeature,
}: FeaturesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400">
          <Sparkles className="size-4" /> Features
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="mr-1 size-4" /> Add Feature
        </Button>
      </div>

      {features.length === 0 ? (
        <p className="text-muted-foreground text-sm">No features added yet.</p>
      ) : (
        <div className="space-y-3">
          {features.map(feature => (
            <div
              key={feature.id}
              className="space-y-2 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <Input
                      value={feature.name}
                      onChange={e =>
                        updateFeature(feature.id, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Feature name"
                    />
                    <Select
                      value={feature.type}
                      onValueChange={v =>
                        updateFeature(feature.id, { type: v })
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FEATURE_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={feature.description}
                    onChange={e =>
                      updateFeature(feature.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Feature description..."
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(feature.id)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface ExperiencesSectionProps {
  experiences: string[];
  customExperience: string;
  setCustomExperience: Dispatch<SetStateAction<string>>;
  addExperience: (exp: string) => void;
  removeExperience: (index: number) => void;
}

export function AdversaryExperiencesSection({
  experiences,
  customExperience,
  setCustomExperience,
  addExperience,
  removeExperience,
}: ExperiencesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
        <Award className="size-4" /> Experiences
      </h3>

      {/* Current experiences */}
      {experiences.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experiences.map((exp, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="gap-1 border-emerald-500/30 bg-emerald-500/10"
            >
              {exp}
              <button
                type="button"
                onClick={() => removeExperience(i)}
                className="hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Quick-add predefined experiences */}
      <div className="space-y-2">
        <span className="text-muted-foreground text-xs font-medium">
          Quick Add
        </span>
        <div className="flex flex-wrap gap-1">
          {PREDEFINED_EXPERIENCES.map(exp => (
            <Button
              key={exp}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                'h-7 text-xs',
                experiences.includes(exp) && 'opacity-50'
              )}
              disabled={experiences.includes(exp)}
              onClick={() => addExperience(exp)}
            >
              {exp}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom experience input */}
      <div className="flex gap-2">
        <Input
          value={customExperience}
          onChange={e => setCustomExperience(e.target.value)}
          placeholder="Add custom experience..."
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (customExperience.trim()) {
                addExperience(customExperience);
                setCustomExperience('');
              }
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (customExperience.trim()) {
              addExperience(customExperience);
              setCustomExperience('');
            }
          }}
        >
          Add
        </Button>
      </div>
    </section>
  );
}

interface TagsSectionProps {
  tags: string[];
  newTag: string;
  setNewTag: Dispatch<SetStateAction<string>>;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

export function AdversaryTagsSection({
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
}: TagsSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-cyan-600 dark:text-cyan-400">
        <Tag className="size-4" /> Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 border-cyan-500/30 bg-cyan-500/10"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addTag}>
          Add
        </Button>
      </div>
    </section>
  );
}
