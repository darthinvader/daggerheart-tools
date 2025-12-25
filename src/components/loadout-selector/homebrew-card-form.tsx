import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { ALL_DOMAIN_NAMES } from '@/lib/data/domains';
import type { HomebrewDomainCard } from '@/lib/schemas/loadout';
import { DOMAIN_EMOJIS } from '@/lib/schemas/loadout';

interface HomebrewCardFormProps {
  onAdd: (card: HomebrewDomainCard) => void;
}

const EMPTY_CARD: Omit<HomebrewDomainCard, 'isHomebrew'> = {
  name: '',
  level: 1,
  domain: 'Arcana',
  type: 'Spell',
  description: '',
  hopeCost: 1,
};

export function HomebrewCardForm({ onAdd }: HomebrewCardFormProps) {
  const [draft, setDraft] = useState(EMPTY_CARD);

  const updateDraft = useCallback((updates: Partial<typeof EMPTY_CARD>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const handleAdd = useCallback(() => {
    if (!draft.name || !draft.description) return;
    onAdd({
      ...draft,
      isHomebrew: true,
    });
    setDraft(EMPTY_CARD);
  }, [draft, onAdd]);

  const canAdd = draft.name.trim() && draft.description.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎨</span>
          <span>Create Homebrew Card</span>
        </CardTitle>
        <CardDescription>
          Design a custom domain card for your character.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="card-name">Card Name</Label>
            <Input
              id="card-name"
              placeholder="Enter card name..."
              value={draft.name}
              onChange={e =>
                updateDraft({ name: e.target.value.toUpperCase() })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Domain</Label>
            <Select
              value={draft.domain}
              onValueChange={v => updateDraft({ domain: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {ALL_DOMAIN_NAMES.map(domain => (
                  <SelectItem key={domain} value={domain}>
                    {DOMAIN_EMOJIS[domain]} {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={draft.type}
              onValueChange={v => updateDraft({ type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spell">✨ Spell</SelectItem>
                <SelectItem value="Ability">💪 Ability</SelectItem>
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
              onChange={e => updateDraft({ level: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-cost">Hope Cost</Label>
            <Input
              id="card-cost"
              type="number"
              min={0}
              max={6}
              value={draft.hopeCost}
              onChange={e => updateDraft({ hopeCost: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-description">Description</Label>
          <Textarea
            id="card-description"
            placeholder="Describe the card's effect..."
            value={draft.description}
            onChange={e => updateDraft({ description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleAdd} disabled={!canAdd}>
            ➕ Add Card to Collection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
