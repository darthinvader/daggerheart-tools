// Utilities for Leveling summaries and abbreviations
export function abbrLevelUpOption(name: string): string {
  if (name.startsWith('Gain a +1 bonus to two unmarked character traits'))
    return 'Traits +1×2';
  if (name.startsWith('Permanently gain a +1 bonus to two Experiences'))
    return 'Exps +1×2';
  if (name.startsWith('Choose an additional domain card')) return 'Domain +1';
  if (name.startsWith('Permanently gain a +1 bonus to your Evasion'))
    return 'Evasion +1';
  if (name.startsWith('Permanently gain one Hit Point slot')) return 'HP +1';
  if (name.startsWith('Permanently gain one Stress slot')) return 'Stress +1';
  if (name.startsWith('Increase your Proficiency')) return 'Prof +1';
  if (name.startsWith('Take an upgraded subclass card')) return 'Subclass ↑';
  if (name.startsWith('Multiclass')) return 'Multiclass';
  return name;
}

export function formatLevelUpSummary(sel: Record<string, number> | undefined) {
  const entries = Object.entries(sel || {}).filter(
    ([, v]) => (v as number) > 0
  );
  if (entries.length === 0) return 'No selections';
  return entries
    .map(([k, v]) => {
      const label = abbrLevelUpOption(k);
      return v > 1 ? `${label} x${v}` : label;
    })
    .join(' • ');
}
