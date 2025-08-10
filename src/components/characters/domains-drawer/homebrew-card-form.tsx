import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DomainCard } from '@/lib/schemas/domains';

type Props = {
  hbName: string;
  hbDomain: string;
  hbType: string;
  hbLevel: number;
  hbDescription: string;
  hbHopeCost: number | '';
  hbRecallCost: number | '';
  disableAdd: boolean;
  onChange: (
    next: Partial<
      Record<
        | 'hbName'
        | 'hbDomain'
        | 'hbType'
        | 'hbLevel'
        | 'hbDescription'
        | 'hbHopeCost'
        | 'hbRecallCost',
        string | number | ''
      >
    >
  ) => void;
  onAdd: (card: DomainCard) => void;
  onClear: () => void;
};

export function HomebrewCardForm({
  hbName,
  hbDomain,
  hbType,
  hbLevel,
  hbDescription,
  hbHopeCost,
  hbRecallCost,
  disableAdd,
  onChange,
  onAdd,
  onClear,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <Input
            value={hbName}
            onChange={e => onChange({ hbName: e.target.value })}
            placeholder="Custom card name"
          />
        </FormItem>
        <FormItem>
          <FormLabel>Domain</FormLabel>
          <Input
            value={hbDomain}
            onChange={e => onChange({ hbDomain: e.target.value })}
            placeholder="Any text (e.g., Homebrew)"
          />
        </FormItem>
        <FormItem>
          <FormLabel>Type</FormLabel>
          <Input
            value={hbType}
            onChange={e => onChange({ hbType: e.target.value })}
            placeholder="Spell or Ability"
          />
        </FormItem>
        <FormItem>
          <FormLabel>Level</FormLabel>
          <Input
            type="number"
            min={1}
            max={10}
            value={hbLevel}
            onChange={e => onChange({ hbLevel: Number(e.target.value) || 1 })}
          />
        </FormItem>
      </div>
      <FormItem>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={hbDescription}
          onChange={e => onChange({ hbDescription: e.target.value })}
          placeholder="Rules text, effects, costs, etc."
        />
      </FormItem>
      <div className="grid grid-cols-2 gap-2">
        <FormItem>
          <FormLabel>Hope Cost</FormLabel>
          <Input
            type="number"
            min={0}
            value={hbHopeCost}
            onChange={e => {
              const n = Number(e.target.value);
              onChange({ hbHopeCost: Number.isFinite(n) ? n : '' });
            }}
            placeholder="e.g. 1"
          />
        </FormItem>
        <FormItem>
          <FormLabel>Recall Cost</FormLabel>
          <Input
            type="number"
            min={0}
            value={hbRecallCost}
            onChange={e => {
              const n = Number(e.target.value);
              onChange({ hbRecallCost: Number.isFinite(n) ? n : '' });
            }}
            placeholder="e.g. 1"
          />
        </FormItem>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const trimmed = hbName.trim();
            if (!trimmed) return;
            const newCard: DomainCard = {
              name: trimmed,
              level: Math.max(1, Math.min(10, hbLevel)),
              domain: hbDomain.trim() || 'Homebrew',
              type: hbType.trim() || 'Spell',
              description: hbDescription.trim() || '',
              hopeCost:
                hbHopeCost === '' ? undefined : Math.max(0, Number(hbHopeCost)),
              recallCost:
                hbRecallCost === ''
                  ? undefined
                  : Math.max(0, Number(hbRecallCost)),
              metadata: { homebrew: true },
            } as DomainCard;
            onAdd(newCard);
          }}
          disabled={disableAdd}
        >
          Add to Loadout
        </Button>
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </>
  );
}
