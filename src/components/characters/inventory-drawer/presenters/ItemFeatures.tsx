export function ItemFeatures({ item }: { item: unknown }) {
  const meta = item as {
    description?: string;
    features?: Array<{ name: string; description?: string }>;
  };

  if (!meta.description && !Array.isArray(meta.features)) return null;

  return (
    <>
      {meta.description ? (
        <div className="text-foreground/90 mt-2 text-xs whitespace-pre-wrap">
          {meta.description}
        </div>
      ) : null}
      {Array.isArray(meta.features) && meta.features.length ? (
        <>
          <div className="mt-1 flex flex-wrap gap-1">
            {meta.features.map((f, i) => (
              <span
                key={i}
                className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[11px]"
              >
                {f.name}
              </span>
            ))}
          </div>
          <ul className="mt-1 list-disc pl-4 text-xs">
            {meta.features.slice(0, 3).map((f, i) => (
              <li key={i}>
                <span className="font-medium">{f.name}:</span> {f.description}
              </li>
            ))}
            {meta.features.length > 3 ? (
              <li className="text-muted-foreground">…</li>
            ) : null}
          </ul>
        </>
      ) : null}
    </>
  );
}
