type Props = {
  effect: string;
  setEffect: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  targetType: string;
  setTargetType: (v: string) => void;
};

export function ConsumableFields({
  effect,
  setEffect,
  duration,
  setDuration,
  targetType,
  setTargetType,
}: Props) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Effect</span>
        <input
          className="rounded border px-2 py-1"
          value={effect}
          onChange={e => setEffect(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Duration</span>
        <input
          className="rounded border px-2 py-1"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Target</span>
        <input
          className="rounded border px-2 py-1"
          value={targetType}
          onChange={e => setTargetType(e.target.value)}
        />
      </label>
    </>
  );
}
