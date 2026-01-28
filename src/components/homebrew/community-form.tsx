/**
 * Homebrew Community Form
 *
 * Form for creating and editing homebrew communities.
 * Uses singular feature object per schema.
 */
import { Home, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { HomebrewCommunity } from '@/lib/schemas/homebrew';
import { createDefaultCommunityContent } from '@/lib/schemas/homebrew';

// Predefined common traits from official communities
const COMMON_TRAIT_SUGGESTIONS = [
  'amiable',
  'ambitious',
  'benevolent',
  'bold',
  'calculating',
  'candid',
  'clever',
  'composed',
  'conniving',
  'cooperative',
  'direct',
  'eloquent',
  'elusive',
  'enterprising',
  'exuberant',
  'fierce',
  'formidable',
  'hardy',
  'indomitable',
  'innovative',
  'inquisitive',
  'inscrutable',
  'loyal',
  'magnanimous',
  'mirthful',
  'nurturing',
  'ostentatious',
  'patient',
  'pensive',
  'perceptive',
  'prudent',
  'reclusive',
  'reliable',
  'reserved',
  'resolute',
  'resourceful',
  'rhapsodic',
  'sagacious',
  'sardonic',
  'savvy',
  'shrewd',
  'stoic',
  'stubborn',
  'tenacious',
  'unflappable',
  'unorthodox',
  'unpretentious',
  'vibrant',
  'weathered',
  'witty',
] as const;

interface CommunityFormProps {
  initialData?: HomebrewCommunity['content'];
  onSubmit: (data: HomebrewCommunity['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CommunityForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CommunityFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultCommunityContent()
  );
  const [commonTraits, setCommonTraits] = useState<string[]>(
    initialData?.commonTraits ?? []
  );
  const [newTrait, setNewTrait] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewCommunity['content'] = {
        ...formData,
        commonTraits: commonTraits.filter(t => t.trim()),
      };

      onSubmit(content);
    },
    [formData, commonTraits, onSubmit]
  );

  const addTrait = (trait: string) => {
    if (trait.trim() && !commonTraits.includes(trait.trim())) {
      setCommonTraits(prev => [...prev, trait.trim()]);
    }
  };

  const addCustomTrait = () => {
    if (newTrait.trim() && !commonTraits.includes(newTrait.trim())) {
      setCommonTraits(prev => [...prev, newTrait.trim()]);
      setNewTrait('');
    }
  };

  const removeTrait = (trait: string) => {
    setCommonTraits(prev => prev.filter(t => t !== trait));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Home className="size-4" /> Community Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Community Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Stormwatchers"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe this community's culture, values, and way of life..."
                rows={4}
                required
              />
            </div>
          </section>

          <Separator />

          {/* Common Traits */}
          <section className="space-y-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Users className="size-4 text-teal-500" />
              Common Traits
            </h3>
            <p className="text-muted-foreground text-sm">
              Characteristics commonly found among members of this community.
            </p>

            <div className="flex flex-wrap gap-2">
              {commonTraits.map(trait => (
                <Badge
                  key={trait}
                  variant="secondary"
                  className="gap-1 capitalize"
                >
                  {trait}
                  <button
                    type="button"
                    onClick={() => removeTrait(trait)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Quick Add</Label>
              <div className="flex flex-wrap gap-1">
                {COMMON_TRAIT_SUGGESTIONS.filter(t => !commonTraits.includes(t))
                  .slice(0, 12)
                  .map(trait => (
                    <Button
                      key={trait}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs capitalize"
                      onClick={() => addTrait(trait)}
                    >
                      <Plus className="mr-1 size-3" /> {trait}
                    </Button>
                  ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={newTrait}
                onChange={e => setNewTrait(e.target.value)}
                placeholder="Custom trait (e.g., Resourceful)"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTrait();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addCustomTrait}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </section>

          <Separator />

          {/* Community Feature */}
          <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-purple-500" />
              Community Feature
            </h3>
            <p className="text-muted-foreground text-sm">
              The special ability granted to characters from this community.
            </p>

            <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="featureName">Feature Name *</Label>
                <Input
                  id="featureName"
                  value={formData.feature.name}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      feature: {
                        ...prev.feature,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., Storm Reader"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featureDesc">Description *</Label>
                <Textarea
                  id="featureDesc"
                  value={formData.feature.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      feature: {
                        ...prev.feature,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe what this feature does..."
                  rows={4}
                  required
                />
              </div>
            </div>
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
          {isSubmitting ? 'Saving...' : 'Save Community'}
        </Button>
      </div>
    </form>
  );
}
