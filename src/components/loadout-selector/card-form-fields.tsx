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
import { DOMAIN_EMOJIS } from '@/lib/schemas/loadout';

interface HomebrewCardDraft {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost: number;
}

interface CardFormFieldsProps {
  draft: HomebrewCardDraft;
  onUpdate: (updates: Partial<HomebrewCardDraft>) => void;
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
          <Select value={draft.type} onValueChange={v => onUpdate({ type: v })}>
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
            onChange={e => onUpdate({ level: Number(e.target.value) })}
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
            onChange={e => onUpdate({ hopeCost: Number(e.target.value) })}
          />
        </div>
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
    </>
  );
}
