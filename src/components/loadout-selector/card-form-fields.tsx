import { ChevronRight, Plus, Tag, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ALL_DOMAIN_NAMES } from '@/lib/data/domains';
import { CardTypeIcons, DomainIcons, ICON_SIZE_MD } from '@/lib/icons';
import type { FeatureStatModifiers } from '@/lib/schemas/core';

interface HomebrewCardDraft {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost: number;
  recallCost: number;
  stressCost: number;
  tags?: string[];
  modifiers?: FeatureStatModifiers;
}

interface CardFormFieldsProps {
  draft: HomebrewCardDraft;
  onUpdate: (updates: Partial<HomebrewCardDraft>) => void;
}

const TAG_SUGGESTIONS = [
  'Attack',
  'Damage',
  'Healing',
  'Buff',
  'Debuff',
  'Control',
  'Utility',
  'Defense',
  'Movement',
  'Summon',
  'Area',
  'Single Target',
];

function CostField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={0}
        max={6}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function CardFormFields({ draft, onUpdate }: CardFormFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="card-name">Card Name</Label>
          <Input
            id="card-name"
            placeholder="Enter card name..."
            value={draft.name}
            onChange={e => onUpdate({ name: e.target.value.toUpperCase() })}
          />
        </div>
        <div className="space-y-2">
          <Label>Domain</Label>
          <Select
            value={draft.domain}
            onValueChange={v => onUpdate({ domain: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {ALL_DOMAIN_NAMES.map(domain => {
                const DomainIcon = DomainIcons[domain];
                return (
                  <SelectItem key={domain} value={domain}>
                    {DomainIcon && (
                      <DomainIcon
                        size={ICON_SIZE_MD}
                        className="mr-1 inline-block"
                      />
                    )}
                    {domain}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={draft.type} onValueChange={v => onUpdate({ type: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spell">
                <CardTypeIcons.Spell
                  size={ICON_SIZE_MD}
                  className="mr-1 inline-block"
                />
                Spell
              </SelectItem>
              <SelectItem value="Ability">
                <CardTypeIcons.Ability
                  size={ICON_SIZE_MD}
                  className="mr-1 inline-block"
                />
                Ability
              </SelectItem>
              <SelectItem value="Grimoire">
                <CardTypeIcons.Grimoire
                  size={ICON_SIZE_MD}
                  className="mr-1 inline-block"
                />
                Grimoire
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="card-level">Level</Label>
          <Input
            id="card-level"
            type="number"
            min={1}
            max={10}
            value={draft.level}
            onChange={e => onUpdate({ level: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CostField
          id="card-hope-cost"
          label="Hope Cost"
          value={draft.hopeCost}
          onChange={v => onUpdate({ hopeCost: v })}
        />
        <CostField
          id="card-recall-cost"
          label="Recall Cost"
          value={draft.recallCost}
          onChange={v => onUpdate({ recallCost: v })}
        />
        <CostField
          id="card-stress-cost"
          label="Stress Cost"
          value={draft.stressCost}
          onChange={v => onUpdate({ stressCost: v })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-description">Description</Label>
        <Textarea
          id="card-description"
          placeholder="Describe the card's effect..."
          value={draft.description}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={4}
        />
      </div>

      {/* Tags Section */}
      <TagsSection
        tags={draft.tags ?? []}
        onChange={tags => onUpdate({ tags })}
      />

      {/* Stat Modifiers Section */}
      <ModifiersSection
        modifiers={draft.modifiers}
        onChange={modifiers => onUpdate({ modifiers })}
      />
    </>
  );
}

interface TagsSectionProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function TagsSection({ tags, onChange }: TagsSectionProps) {
  const [newTag, setNewTag] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setNewTag('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="text-muted-foreground size-4" />
        <Label>Tags</Label>
      </div>
      <div className="flex gap-2">
        <Input
          value={newTag}
          placeholder="Add a tag..."
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTag(newTag)}
        />
        <Button type="button" variant="outline" onClick={() => addTag(newTag)}>
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TAG_SUGGESTIONS.filter(s => !tags.includes(s)).map(suggestion => (
          <Badge
            key={suggestion}
            variant="outline"
            className="hover:bg-primary/10 cursor-pointer"
            onClick={() => addTag(suggestion)}
          >
            + {suggestion}
          </Badge>
        ))}
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} className="flex items-center gap-1 bg-violet-500/20">
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
                className="hover:bg-destructive/20 ml-1 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface ModifiersSectionProps {
  modifiers: FeatureStatModifiers | undefined;
  onChange: (modifiers: FeatureStatModifiers | undefined) => void;
}

function cleanModifiers(
  modifiers: FeatureStatModifiers
): FeatureStatModifiers | undefined {
  const cleaned = Object.fromEntries(
    Object.entries(modifiers).filter(([, v]) => v !== 0 && v !== undefined)
  );
  return Object.keys(cleaned).length > 0
    ? (cleaned as FeatureStatModifiers)
    : undefined;
}

function ModifiersSection({ modifiers, onChange }: ModifiersSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasModifiers, setHasModifiers] = useState(!!modifiers);

  const handleToggle = (enabled: boolean) => {
    setHasModifiers(enabled);
    onChange(enabled ? {} : undefined);
  };

  const updateModifier = (key: keyof FeatureStatModifiers, value: number) => {
    const updated = { ...modifiers, [key]: value };
    onChange(cleanModifiers(updated));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <ChevronRight
            className={`size-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
          <TrendingUp className="text-muted-foreground size-4" />
          Stat Modifiers
          {hasModifiers && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Active
            </Badge>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <Label>Enable Stat Modifiers</Label>
          <Switch checked={hasModifiers} onCheckedChange={handleToggle} />
        </div>

        {hasModifiers && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ModifierInput
              label="Evasion"
              value={modifiers?.evasion ?? 0}
              onChange={v => updateModifier('evasion', v)}
            />
            <ModifierInput
              label="Proficiency"
              value={modifiers?.proficiency ?? 0}
              onChange={v => updateModifier('proficiency', v)}
            />
            <ModifierInput
              label="Armor Score"
              value={modifiers?.armorScore ?? 0}
              onChange={v => updateModifier('armorScore', v)}
            />
            <ModifierInput
              label="Attack Rolls"
              value={modifiers?.attackRolls ?? 0}
              onChange={v => updateModifier('attackRolls', v)}
            />
            <ModifierInput
              label="Spellcast Rolls"
              value={modifiers?.spellcastRolls ?? 0}
              onChange={v => updateModifier('spellcastRolls', v)}
            />
            <ModifierInput
              label="Major Threshold"
              value={modifiers?.majorThreshold ?? 0}
              onChange={v => updateModifier('majorThreshold', v)}
            />
            <ModifierInput
              label="Severe Threshold"
              value={modifiers?.severeThreshold ?? 0}
              onChange={v => updateModifier('severeThreshold', v)}
            />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ModifierInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="h-8"
      />
    </div>
  );
}
