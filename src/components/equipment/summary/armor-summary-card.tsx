import { Badge } from '@/components/ui/badge';

import { FeatureDisplay, ModifierDisplay } from './shared';

interface ArmorSummaryCardProps {
  name: string;
  isHomebrew: boolean;
  isEmpty: boolean;
  baseScore?: number;
  major?: number;
  severe?: number;
  evasionMod?: number;
  agilityMod?: number;
  armorType?: string;
  features?: Array<{ name: string; description?: string }>;
  tier?: string;
  description?: string;
}

export function ArmorSummaryCard({
  name,
  isHomebrew,
  isEmpty,
  baseScore,
  major,
  severe,
  evasionMod,
  agilityMod,
  armorType,
  features = [],
  tier,
  description,
}: ArmorSummaryCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border p-4 ${isEmpty ? 'border-dashed opacity-60' : 'bg-card'}`}
    >
      <ArmorHeader isHomebrew={isHomebrew} tier={tier} />
      <ArmorTitle name={name} isEmpty={isEmpty} />

      {!isEmpty && (
        <div className="mt-3 flex-1 space-y-2">
          {description && (
            <p className="text-muted-foreground text-sm italic">
              {description}
            </p>
          )}
          <ArmorStatBadges
            baseScore={baseScore}
            major={major}
            severe={severe}
          />
          <ArmorModifiers evasionMod={evasionMod} agilityMod={agilityMod} />
          <ArmorType type={armorType} />
          <FeatureDisplay features={features} />
        </div>
      )}
    </div>
  );
}

function ArmorHeader({
  isHomebrew,
  tier,
}: {
  isHomebrew: boolean;
  tier?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">🛡️</span>
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Armor
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHomebrew && (
          <Badge variant="outline" className="text-[10px]">
            🔧 Homebrew
          </Badge>
        )}
        {tier && (
          <Badge variant="outline" className="text-[10px]">
            Tier {tier}
          </Badge>
        )}
      </div>
    </div>
  );
}

function ArmorTitle({ name, isEmpty }: { name: string; isEmpty: boolean }) {
  return (
    <h3
      className={`text-lg font-bold ${isEmpty ? 'text-muted-foreground italic' : ''}`}
    >
      {name}
    </h3>
  );
}

function ArmorStatBadges({
  baseScore,
  major,
  severe,
}: {
  baseScore?: number;
  major?: number;
  severe?: number;
}) {
  if (baseScore === undefined && major === undefined && severe === undefined) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {baseScore !== undefined && (
        <Badge variant="secondary">🛡️ Score: {baseScore}</Badge>
      )}
      {major !== undefined && (
        <Badge variant="secondary">💥 Major: {major}</Badge>
      )}
      {severe !== undefined && (
        <Badge variant="secondary">⚡ Severe: {severe}</Badge>
      )}
    </div>
  );
}

function ArmorModifiers({
  evasionMod,
  agilityMod,
}: {
  evasionMod?: number;
  agilityMod?: number;
}) {
  if (evasionMod === undefined && agilityMod === undefined) return null;
  return (
    <div className="flex gap-4 text-sm">
      <ModifierDisplay label="Evasion" value={evasionMod} />
      <ModifierDisplay label="Agility" value={agilityMod} />
    </div>
  );
}

function ArmorType({ type }: { type?: string }) {
  if (!type) return null;
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">Type:</span>{' '}
      <span className="font-medium">{type}</span>
    </p>
  );
}
