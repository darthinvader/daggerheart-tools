import { Minus, Plus } from 'lucide-react';

import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type Gold = { handfuls: number; bags: number; chests: number };

export type GoldCardProps = {
  gold: Gold;
  update?: (kind: 'handfuls' | 'bags' | 'chests', delta: number) => void; // legacy support
  set?: (kind: 'handfuls' | 'bags' | 'chests', value: number) => void;
};

// Use emojis that read as medieval loot; rely on opacity for selection state
const EMOJIS = {
  handfuls: { on: '🪙', off: '🪙' }, // coin
  bags: { on: '💰', off: '💰' }, // money bag
  chests: { on: '🧰', off: '🧰' }, // toolbox as chest stand-in
} as const;

const LABELS: Record<keyof Gold, string> = {
  handfuls: 'Handfuls',
  bags: 'Bags',
  chests: 'Chests',
};

function Row({
  kind,
  value,
  set,
  update,
}: {
  kind: keyof Gold;
  value: number;
  set?: (kind: 'handfuls' | 'bags' | 'chests', value: number) => void;
  update?: (kind: 'handfuls' | 'bags' | 'chests', delta: number) => void;
}) {
  // Render 1..9 as tappable emojis; tap label to set 0
  const onEmoji = EMOJIS[kind].on;
  const offEmoji = EMOJIS[kind].off;
  const handleSet = (v: number) => set?.(kind, v);
  const dec = () => {
    if (set) return set(kind, Math.max(0, value - 1));
    if (update) return update(kind, value - 1 < 0 ? -value : -1);
  };
  const inc = () => {
    if (set) return set(kind, value + 1);
    if (update) return update(kind, +1);
  };
  return (
    <div className="grid grid-cols-[max-content_min-content_1fr_min-content] items-center gap-1.5">
      {/* Label (fixed width for aligned columns) */}
      <button
        type="button"
        onClick={() => handleSet(0)}
        aria-label={`Set ${LABELS[kind]} to 0`}
        className="w-20 truncate text-left sm:w-24"
      >
        <div className="text-xs leading-tight font-medium sm:text-sm">
          {LABELS[kind]}
        </div>
      </button>
      {/* Minus right after label */}
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-5 w-5"
        aria-label={`Decrease ${LABELS[kind]}`}
        onClick={dec}
        disabled={value <= 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      {/* Emoji/value strip */}
      <div className="flex min-w-0 items-center gap-0 overflow-x-auto">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(i => (
          <button
            key={i}
            type="button"
            aria-label={`Set ${LABELS[kind]} to ${i}`}
            onClick={() => handleSet(i)}
            className={`h-4 w-4 [touch-action:manipulation] rounded text-[12px] leading-none ${
              i <= value ? '' : 'opacity-[0.45]'
            }`}
          >
            {i <= value ? onEmoji : offEmoji}
          </button>
        ))}
        <span className="ml-1 min-w-[1.25rem] text-center text-[10px] tabular-nums sm:text-xs">
          {value}
        </span>
      </div>
      {/* Plus at far right */}
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="h-5 w-5"
        aria-label={`Increase ${LABELS[kind]}`}
        onClick={inc}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function GoldCard({ gold, update: _update, set }: GoldCardProps) {
  return (
    <Card>
      <CharacterCardHeader title="Gold" />
      <CardContent className="space-y-3">
        {/* Summary row */}
        <div className="text-muted-foreground text-sm">
          Total: {gold.handfuls} handfuls, {gold.bags} bags, {gold.chests}{' '}
          chests
        </div>
        <Row kind="handfuls" value={gold.handfuls} set={set} update={_update} />
        <Row kind="bags" value={gold.bags} set={set} update={_update} />
        <Row kind="chests" value={gold.chests} set={set} update={_update} />
      </CardContent>
    </Card>
  );
}
