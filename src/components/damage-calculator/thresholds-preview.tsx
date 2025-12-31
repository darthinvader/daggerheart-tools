interface ThresholdsPreviewProps {
  major: number;
  severe: number;
  critical?: number;
  enableCritical?: boolean;
}

export function ThresholdsPreview({
  major,
  severe,
  critical,
  enableCritical,
}: ThresholdsPreviewProps) {
  return (
    <div className="bg-muted/50 flex flex-wrap gap-3 rounded-lg p-3 text-sm">
      <div>
        <span className="text-muted-foreground">Major:</span>{' '}
        <span className="font-medium">{major}+</span>
      </div>
      <div>
        <span className="text-muted-foreground">Severe:</span>{' '}
        <span className="font-medium">{severe}+</span>
      </div>
      {enableCritical && critical !== undefined && (
        <div>
          <span className="text-muted-foreground">Critical:</span>{' '}
          <span className="font-medium">{critical}+</span>
        </div>
      )}
    </div>
  );
}
