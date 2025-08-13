function chipClass(bg: string, fg: string) {
  return `${bg} ${fg} rounded px-1 py-0.5`;
}

export function TierBadge({ label }: { label: string }) {
  return (
    <span
      className={chipClass(
        'bg-blue-100 dark:bg-blue-500/20',
        'text-blue-900 dark:text-blue-200'
      )}
    >
      ⛰️ {label}
    </span>
  );
}

export function RarityBadge({ label }: { label: string }) {
  return (
    <span
      className={chipClass(
        'bg-amber-100 dark:bg-amber-500/20',
        'text-amber-900 dark:text-amber-200'
      )}
    >
      �️ {label}
    </span>
  );
}

export function WeightBadge({ label }: { label: string }) {
  return (
    <span
      className={chipClass(
        'bg-purple-100 dark:bg-purple-500/20',
        'text-purple-900 dark:text-purple-200'
      )}
    >
      🏋️‍♀️ {label}
    </span>
  );
}
