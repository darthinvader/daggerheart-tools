/**
 * Domain Card Form Section Components
 *
 * Extracted section components for the domain card form to reduce complexity.
 */
import {
  BookOpen,
  Coins,
  Layers,
  Plus,
  Sparkles,
  Tag,
  TrendingUp,
  Wand2,
  X,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { ALL_KNOWN_DOMAINS } from '@/lib/schemas/core';

// =====================================================================================
// Constants
// =====================================================================================

export const DOMAIN_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Arcana: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
  },
  Blade: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-500',
  },
  Bone: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
  },
  Codex: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
  },
  Grace: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-500',
  },
  Midnight: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-500',
  },
  Sage: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
  },
  Splendor: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
  },
  Valor: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-500',
  },
};

export const CARD_TYPE_CONFIG: Record<string, { icon: string; color: string }> =
  {
    Spell: { icon: '✨', color: 'text-purple-400' },
    Ability: { icon: '⚔️', color: 'text-orange-400' },
    Grimoire: { icon: '📖', color: 'text-blue-400' },
  };

export const TAG_SUGGESTIONS = [
  'Attack',
  'Damage',
  'Healing',
  'Utility',
  'Buff',
  'Debuff',
  'Control',
  'Movement',
  'Defense',
  'Summoning',
  'Illusion',
  'Transformation',
] as const;

export const CARD_TYPES = ['Spell', 'Ability', 'Grimoire'] as const;
export const LEVELS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
] as const;

// =====================================================================================
// Types
// =====================================================================================

interface DomainStyle {
  bg: string;
  border: string;
  text: string;
}

// =====================================================================================
// BasicInfoSection
// =====================================================================================

interface BasicInfoSectionProps {
  name: string;
  domain: string;
  type: string;
  level: number;
  domainStyle: DomainStyle;
  updateField: (key: string, value: unknown) => void;
}

export function BasicInfoSection({
  name,
  domain,
  type,
  level,
  domainStyle,
  updateField,
}: BasicInfoSectionProps) {
  return (
    <section
      className={`space-y-4 rounded-lg border p-4 ${domainStyle.border} ${domainStyle.bg}`}
    >
      <h3 className="flex items-center gap-2 font-semibold">
        <Layers className={`size-4 ${domainStyle.text}`} />
        Basic Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Card Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={e => updateField('name', e.target.value)}
            placeholder="e.g., Arcane Bolt"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain" className="flex items-center gap-1">
            <BookOpen className="size-3" /> Domain *
          </Label>
          <Select value={domain} onValueChange={v => updateField('domain', v)}>
            <SelectTrigger id="domain">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {ALL_KNOWN_DOMAINS.map(d => (
                <SelectItem key={d} value={d}>
                  <span
                    className={`flex items-center gap-2 ${DOMAIN_COLORS[d]?.text ?? ''}`}
                  >
                    {d}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="flex items-center gap-1">
            <Wand2 className="size-3" /> Card Type *
          </Label>
          <Select value={type} onValueChange={v => updateField('type', v)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CARD_TYPES.map(t => (
                <SelectItem key={t} value={t}>
                  <span className="flex items-center gap-2">
                    <span>{CARD_TYPE_CONFIG[t]?.icon}</span> {t}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className="flex items-center gap-1">
            <Zap className="size-3" /> Level *
          </Label>
          <Select
            value={String(level)}
            onValueChange={v => updateField('level', parseInt(v, 10))}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map(l => (
                <SelectItem key={l} value={l}>
                  Level {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

// =====================================================================================
// CostsSection
// =====================================================================================

interface CostsSectionProps {
  hopeCost?: number;
  stressCost?: number;
  recallCost?: number;
  updateOptionalNumber: (key: string, value: string) => void;
}

export function CostsSection({
  hopeCost,
  stressCost,
  recallCost,
  updateOptionalNumber,
}: CostsSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Coins className="size-4 text-amber-500" />
        Costs
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hopeCost" className="flex items-center gap-1">
            <span className="text-cyan-400">✦</span> Hope Cost
          </Label>
          <Input
            id="hopeCost"
            type="number"
            min={0}
            value={hopeCost ?? ''}
            onChange={e => updateOptionalNumber('hopeCost', e.target.value)}
            placeholder="0"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Hope spent to use this card
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stressCost" className="flex items-center gap-1">
            <span className="text-red-400">⚡</span> Stress Cost
          </Label>
          <Input
            id="stressCost"
            type="number"
            min={0}
            value={stressCost ?? ''}
            onChange={e => updateOptionalNumber('stressCost', e.target.value)}
            placeholder="0"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Stress taken to use this card
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recallCost" className="flex items-center gap-1">
            <span className="text-blue-400">↺</span> Recall Cost
          </Label>
          <Input
            id="recallCost"
            type="number"
            min={0}
            value={recallCost ?? ''}
            onChange={e => updateOptionalNumber('recallCost', e.target.value)}
            placeholder="0"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Hope to recall from discard
          </p>
        </div>
      </div>
    </section>
  );
}

// =====================================================================================
// DescriptionSection
// =====================================================================================

interface DescriptionSectionProps {
  description: string;
  updateField: (key: string, value: string) => void;
}

export function DescriptionSection({
  description,
  updateField,
}: DescriptionSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Sparkles className="size-4 text-emerald-500" />
        Description
      </h3>

      <div className="space-y-2">
        <Label htmlFor="description">Card Effect *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Describe what this card does..."
          rows={6}
          required
        />
      </div>
    </section>
  );
}

// =====================================================================================
// TagsSection
// =====================================================================================

interface TagsSectionProps {
  tags: string[];
  newTag: string;
  setNewTag: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  addSuggestion: (tag: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  domainStyle: DomainStyle;
}

export function TagsSection({
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  addSuggestion,
  handleKeyDown,
  domainStyle,
}: TagsSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-500/30 bg-slate-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Tag className="size-4 text-slate-400" />
        Tags
      </h3>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className={`gap-1 ${domainStyle.bg} ${domainStyle.border}`}
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

      {/* Quick Add Tags */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">Quick Add</Label>
        <div className="flex flex-wrap gap-1">
          {TAG_SUGGESTIONS.filter(t => !tags.includes(t)).map(tag => (
            <Button
              key={tag}
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-slate-600/50"
              onClick={() => addSuggestion(tag)}
            >
              <Plus className="mr-1 size-3" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="Add a custom tag..."
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="outline" size="icon" onClick={addTag}>
          <Plus className="size-4" />
        </Button>
      </div>
    </section>
  );
}

// =====================================================================================
// StatModifiersSection
// =====================================================================================

interface StatModifiersSectionProps {
  hasModifiers: boolean;
  setHasModifiers: (value: boolean) => void;
  getModifierValue: (key: string) => string;
  updateModifier: (key: string, value: string) => void;
  domainStyle: DomainStyle;
}

export function StatModifiersSection({
  hasModifiers,
  setHasModifiers,
  getModifierValue,
  updateModifier,
  domainStyle,
}: StatModifiersSectionProps) {
  return (
    <section
      className={`space-y-4 rounded-lg border p-4 ${domainStyle.border} ${domainStyle.bg}`}
    >
      <Collapsible open={hasModifiers} onOpenChange={setHasModifiers}>
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold">
              <TrendingUp className={`size-4 ${domainStyle.text}`} />
              Stat Modifiers
            </h3>
            <Badge variant="outline" className="text-xs">
              {hasModifiers ? 'Enabled' : 'Click to add'}
            </Badge>
          </div>
        </CollapsibleTrigger>
        <p className="text-muted-foreground text-sm">
          Explicit stat bonuses this card provides when equipped/active.
        </p>

        <CollapsibleContent className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Evasion</Label>
              <Input
                type="number"
                value={getModifierValue('evasion')}
                onChange={e => updateModifier('evasion', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Proficiency</Label>
              <Input
                type="number"
                value={getModifierValue('proficiency')}
                onChange={e => updateModifier('proficiency', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Armor Score</Label>
              <Input
                type="number"
                value={getModifierValue('armorScore')}
                onChange={e => updateModifier('armorScore', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Attack Rolls</Label>
              <Input
                type="number"
                value={getModifierValue('attackRolls')}
                onChange={e => updateModifier('attackRolls', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Spellcast Rolls</Label>
              <Input
                type="number"
                value={getModifierValue('spellcastRolls')}
                onChange={e => updateModifier('spellcastRolls', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Major Threshold</Label>
              <Input
                type="number"
                value={getModifierValue('majorThreshold')}
                onChange={e => updateModifier('majorThreshold', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Severe Threshold</Label>
            <Input
              type="number"
              value={getModifierValue('severeThreshold')}
              onChange={e => updateModifier('severeThreshold', e.target.value)}
              className="max-w-[200px]"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
