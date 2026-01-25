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
import { CardTypeIcons, DomainIcons, ICON_SIZE_MD } from '@/lib/icons';

interface HomebrewCardDraft {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost: number;
  recallCost: number;
  stressCost: number;
}

interface CardFormFieldsProps {
  draft: HomebrewCardDraft;
  onUpdate: (updates: Partial<HomebrewCardDraft>) => void;
}

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
    </>
  );
}
