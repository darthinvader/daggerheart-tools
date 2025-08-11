import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}: {
  kind: keyof Gold;
  value: number;
  set?: (kind: 'handfuls' | 'bags' | 'chests', value: number) => void;
}) {
  // Render 1..9 as tappable emojis; tap label to set 0
  const onEmoji = EMOJIS[kind].on;
  const offEmoji = EMOJIS[kind].off;
  const handleSet = (v: number) => set?.(kind, v);
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => handleSet(0)}
        aria-label={`Set ${LABELS[kind]} to 0`}
        className="shrink-0 text-left"
      >
        <div className="text-sm leading-tight font-medium">{LABELS[kind]}</div>
      </button>
      <div className="flex flex-wrap items-center gap-0.5">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(i => (
          <button
            key={i}
            type="button"
            aria-label={`Set ${LABELS[kind]} to ${i}`}
            onClick={() => handleSet(i)}
            className="h-5 w-5 [touch-action:manipulation] rounded text-[14px] leading-none"
            style={{ opacity: i <= value ? 1 : 0.45 }}
          >
            {i <= value ? onEmoji : offEmoji}
          </button>
        ))}
        <span className="ml-1 min-w-6 text-center text-xs tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}

export function GoldCard({ gold, update: _update, set }: GoldCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gold</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary row */}
        <div className="text-muted-foreground text-sm">
          Total: {gold.handfuls} handfuls, {gold.bags} bags, {gold.chests}{' '}
          chests
        </div>
        <Row kind="handfuls" value={gold.handfuls} set={set} />
        <Row kind="bags" value={gold.bags} set={set} />
        <Row kind="chests" value={gold.chests} set={set} />
      </CardContent>
    </Card>
  );
}
