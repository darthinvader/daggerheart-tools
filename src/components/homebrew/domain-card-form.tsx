/**
 * Homebrew Domain Card Form
 *
 * Form for creating and editing homebrew domain cards.
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
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { ALL_KNOWN_DOMAINS } from '@/lib/schemas/core';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import type { HomebrewDomainCard } from '@/lib/schemas/homebrew';
import { createDefaultDomainCardContent } from '@/lib/schemas/homebrew';

// Domain color mapping for visual distinction
const DOMAIN_COLORS: Record<
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

// Card type icons and colors
const CARD_TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  Spell: { icon: '✨', color: 'text-purple-400' },
  Ability: { icon: '⚔️', color: 'text-orange-400' },
  Grimoire: { icon: '📖', color: 'text-blue-400' },
};

// Predefined tag suggestions
const TAG_SUGGESTIONS = [
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

const CARD_TYPES = ['Spell', 'Ability', 'Grimoire'] as const;
const LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;

interface DomainCardFormProps {
  initialData?: HomebrewDomainCard['content'];
  onSubmit: (data: HomebrewDomainCard['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function DomainCardForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DomainCardFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultDomainCardContent()
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [newTag, setNewTag] = useState('');
  const [hasModifiers, setHasModifiers] = useState(!!initialData?.modifiers);
  const [modifiers, setModifiers] = useState<Partial<FeatureStatModifiers>>(
    initialData?.modifiers ?? {}
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Clean up modifiers - only include if there are actual values
      const cleanModifiers = hasModifiers
        ? Object.fromEntries(
            Object.entries(modifiers).filter(
              ([, v]) => v !== undefined && v !== 0
            )
          )
        : undefined;
      const hasAnyModifiers =
        cleanModifiers && Object.keys(cleanModifiers).length > 0;

      const content: HomebrewDomainCard['content'] = {
        ...formData,
        tags: tags.filter(t => t.trim()),
        modifiers: hasAnyModifiers
          ? (cleanModifiers as FeatureStatModifiers)
          : undefined,
      };

      onSubmit(content);
    },
    [formData, tags, hasModifiers, modifiers, onSubmit]
  );

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  // Get style based on current domain
  const domainStyle = DOMAIN_COLORS[formData.domain] ?? DOMAIN_COLORS.Arcana;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
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
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Arcane Bolt"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain" className="flex items-center gap-1">
                  <BookOpen className="size-3" /> Domain *
                </Label>
                <Select
                  value={formData.domain}
                  onValueChange={v =>
                    setFormData(prev => ({ ...prev, domain: v }))
                  }
                >
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_KNOWN_DOMAINS.map(domain => (
                      <SelectItem key={domain} value={domain}>
                        <span
                          className={`flex items-center gap-2 ${DOMAIN_COLORS[domain]?.text ?? ''}`}
                        >
                          {domain}
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
                <Select
                  value={formData.type}
                  onValueChange={v =>
                    setFormData(prev => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARD_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          <span>{CARD_TYPE_CONFIG[type]?.icon}</span> {type}
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
                  value={String(formData.level)}
                  onValueChange={v =>
                    setFormData(prev => ({ ...prev, level: parseInt(v, 10) }))
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(level => (
                      <SelectItem key={level} value={level}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Costs */}
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
                  value={formData.hopeCost ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      hopeCost: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    }))
                  }
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
                  value={formData.stressCost ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      stressCost: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    }))
                  }
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
                  value={formData.recallCost ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      recallCost: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    }))
                  }
                  placeholder="0"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Hope to recall from discard
                </p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-emerald-500" />
              Description
            </h3>

            <div className="space-y-2">
              <Label htmlFor="description">Card Effect *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what this card does..."
                rows={6}
                required
              />
            </div>
          </section>

          {/* Tags */}
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
                    onClick={() => {
                      if (!tags.includes(tag)) {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...(prev.tags ?? []), tag],
                        }));
                      }
                    }}
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
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </section>

          <Separator />

          {/* Stat Modifiers */}
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
                      value={modifiers.evasion ?? 0}
                      onChange={e =>
                        setModifiers(prev => ({
                          ...prev,
                          evasion: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Proficiency</Label>
                    <Input
                      type="number"
                      value={modifiers.proficiency ?? 0}
                      onChange={e =>
                        setModifiers(prev => ({
                          ...prev,
                          proficiency: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Armor Score</Label>
                    <Input
                      type="number"
                      value={modifiers.armorScore ?? 0}
                      onChange={e =>
                        setModifiers(prev => ({
                          ...prev,
                          armorScore: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Attack Rolls</Label>
                    <Input
                      type="number"
                      value={modifiers.attackRolls ?? 0}
                      onChange={e =>
                        setModifiers(prev => ({
                          ...prev,
                          attackRolls: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Spellcast Rolls</Label>
                    <Input
                      type="number"
                      value={modifiers.spellcastRolls ?? 0}
                      onChange={e =>
                        setModifiers(prev => ({
                          ...prev,
                          spellcastRolls: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Major Threshold</Label>
                    <Input
                      type="number"
                      value={modifiers.majorThreshold ?? 0}
                      onChange={e =>
                        setModifiers(prev => ({
                          ...prev,
                          majorThreshold: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Severe Threshold</Label>
                  <Input
                    type="number"
                    value={modifiers.severeThreshold ?? 0}
                    onChange={e =>
                      setModifiers(prev => ({
                        ...prev,
                        severeThreshold: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="max-w-[200px]"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
          {isSubmitting ? 'Saving...' : 'Save Domain Card'}
        </Button>
      </div>
    </form>
  );
}
