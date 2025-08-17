export function ThresholdsChip({
  displayMajor,
  displaySevere,
  displayDs,
  enableCritical,
  onDeltaHp,
}: {
  displayMajor: number | string;
  displaySevere: number | string;
  displayDs: number | string;
  enableCritical?: boolean;
  onDeltaHp?: (delta: number) => void;
}) {
  return (
    <div className="bg-muted/60 rounded-md px-2 py-1">
      <div className="text-muted-foreground text-[10px] leading-3">
        Thresholds
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px] leading-4">
        <button
          type="button"
          className="bg-muted rounded px-1 py-0.5"
          title="1 HP (Minor)"
          onClick={() => onDeltaHp?.(-1)}
        >
          1
        </button>
        <span className="text-muted-foreground">M: {displayMajor}</span>
        <button
          type="button"
          className="bg-muted rounded px-1 py-0.5"
          title={`2 HP at Major: ${displayMajor}`}
          onClick={() => onDeltaHp?.(-2)}
        >
          2
        </button>
        <span className="text-muted-foreground">S: {displaySevere}</span>
        <button
          type="button"
          className="bg-muted rounded px-1 py-0.5"
          title={`3 HP at Severe: ${displaySevere}`}
          onClick={() => onDeltaHp?.(-3)}
        >
          3
        </button>
        {enableCritical && (
          <>
            <span className="text-muted-foreground">MD: {displayDs}</span>
            <button
              type="button"
              className="border-destructive/20 bg-destructive/10 text-destructive rounded border px-1 py-0.5"
              title={`4 HP at MD: ${displayDs}`}
              onClick={() => onDeltaHp?.(-4)}
            >
              4
            </button>
          </>
        )}
      </div>
    </div>
  );
}
