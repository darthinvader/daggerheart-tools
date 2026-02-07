import { memo } from 'react';

// =====================================================================================
// MoonPhaseIcon — Pure SVG rendering of a moon phase from a 0–1 float
// =====================================================================================

interface MoonPhaseIconProps {
  /** 0–1 float: 0 = new, 0.5 = full. */
  phase: number;
  moonName: string;
  phaseName: string;
  illumination: number;
  size?: number;
}

export const MoonPhaseIcon = memo(function MoonPhaseIcon({
  phase,
  moonName,
  phaseName,
  illumination,
  size = 16,
}: MoonPhaseIconProps) {
  const r = size / 2;
  const cx = r;
  const cy = r;

  // Map phase (0–1) to illumination shape via a terminator curve
  // phase 0 = new (dark), 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  const p = ((phase % 1) + 1) % 1;

  // The illuminated edge is always a half-circle.
  // The terminator edge is an ellipse that varies from full-left to full-right.
  // k controls the terminator: -1 = concave left, 0 = straight, 1 = convex right
  const k = Math.cos(p * 2 * Math.PI);

  // Build the illuminated path
  // We sweep two arcs: one for the outer edge (semicircle), one for the terminator
  const terminatorRx = Math.abs(k) * r;

  // Determine which side is illuminated
  const isRightLit = p < 0.5;

  // Top and bottom points of the vertical axis
  const topY = cy - r;
  const botY = cy + r;

  let d: string;
  if (p < 0.001 || p > 0.999) {
    // New moon — fully dark
    d = '';
  } else if (Math.abs(p - 0.5) < 0.001) {
    // Full moon — fully lit
    d = `M ${cx},${topY} A ${r},${r} 0 1,1 ${cx},${botY} A ${r},${r} 0 1,1 ${cx},${topY} Z`;
  } else if (isRightLit) {
    // Waxing: right side lit
    d = `M ${cx},${topY} A ${r},${r} 0 0,1 ${cx},${botY} A ${terminatorRx},${r} 0 0,${k > 0 ? 0 : 1} ${cx},${topY} Z`;
  } else {
    // Waning: left side lit
    d = `M ${cx},${topY} A ${r},${r} 0 0,0 ${cx},${botY} A ${terminatorRx},${r} 0 0,${k > 0 ? 1 : 0} ${cx},${topY} Z`;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${moonName}: ${phaseName}, ${illumination}% illuminated`}
      role="img"
      className="inline-block"
    >
      {/* Dark background */}
      <circle cx={cx} cy={cy} r={r - 0.5} fill="currentColor" opacity={0.15} />
      {/* Illuminated portion */}
      {d && <path d={d} fill="currentColor" opacity={0.8} />}
    </svg>
  );
});
