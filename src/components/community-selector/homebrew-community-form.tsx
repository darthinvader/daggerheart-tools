import { useCallback, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { HomebrewCommunity } from '@/lib/schemas/identity';

import { HomebrewIcon, TraitsIcon } from './community-icons';

interface HomebrewCommunityFormProps {
  homebrew: HomebrewCommunity | null;
  onChange: (homebrew: HomebrewCommunity) => void;
}

const EMPTY_HOMEBREW: HomebrewCommunity = {
  name: '',
  description: '',
  commonTraits: [],
  feature: { name: '', description: '' },
};

export function HomebrewCommunityForm({
  homebrew,
  onChange,
}: HomebrewCommunityFormProps) {
  const [formState, setFormState] = useState<HomebrewCommunity>(
    homebrew ?? EMPTY_HOMEBREW
  );
  const [traitsText, setTraitsText] = useState(
    homebrew?.commonTraits.join('\n') ?? ''
  );

  const updateForm = useCallback(
    (updates: Partial<HomebrewCommunity>) => {
      const updated = { ...formState, ...updates };
      setFormState(updated);
      onChange(updated);
    },
    [formState, onChange]
  );

  const handleTraitsChange = useCallback(
    (value: string) => {
      setTraitsText(value);
      const traits = value
        .split('\n')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);
      updateForm({ commonTraits: traits });
    },
    [updateForm]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <HomebrewIcon />
        Create Homebrew Community
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="community-name">Community Name</Label>
          <Input
            id="community-name"
            placeholder="Enter community name..."
            value={formState.name}
            onChange={e => updateForm({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-description">Description</Label>
          <Textarea
            id="community-description"
            placeholder="Describe your community's background and culture..."
            value={formState.description}
            onChange={e => updateForm({ description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-traits" className="flex items-center gap-2">
            <TraitsIcon /> Common Traits (one per line)
          </Label>
          <Textarea
            id="community-traits"
            placeholder={`Enter traits, one per line:
brave
resourceful
cunning
loyal`}
            value={traitsText}
            onChange={e => handleTraitsChange(e.target.value)}
            rows={5}
          />
          <p className="text-muted-foreground text-sm">
            {formState.commonTraits.length} trait(s) added
          </p>
          {formState.commonTraits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formState.commonTraits.map(trait => (
                <span
                  key={trait}
                  className="text-muted-foreground rounded-full border px-2 py-1 text-xs capitalize"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="mb-4 font-semibold">Community Feature</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-name">Feature Name</Label>
              <Input
                id="feature-name"
                placeholder="Enter feature name..."
                value={formState.feature.name}
                onChange={e =>
                  updateForm({
                    feature: { ...formState.feature, name: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature-description">Feature Description</Label>
              <Textarea
                id="feature-description"
                placeholder="Describe what this feature does..."
                value={formState.feature.description}
                onChange={e =>
                  updateForm({
                    feature: {
                      ...formState.feature,
                      description: e.target.value,
                    },
                  })
                }
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
