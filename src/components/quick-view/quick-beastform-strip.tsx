/**
 * QuickBeastformStrip
 *
 * Compact beastform indicator for the Quick View tab.
 * Shows form name, trait bonus, evasion bonus, attack summary,
 * advantages, and feature descriptions when beastform is active.
 * For special forms (Evolved / Hybrid), shows custom configuration data.
 * Hidden when inactive.
 */

import { PawPrint, Shield, Swords } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { getBeastformById } from '@/lib/data/beastforms';
import type {
  BeastformDefinition,
  BeastformFeature,
} from '@/lib/data/beastforms';
import type { BeastformState } from '@/lib/schemas/beastform';

interface QuickBeastformStripProps {
  beastform: BeastformState;
}

export function QuickBeastformStrip({ beastform }: QuickBeastformStripProps) {
  const form = useMemo(
    () =>
      beastform.active && beastform.formId
        ? getBeastformById(beastform.formId)
        : undefined,
    [beastform.active, beastform.formId]
  );

  const evolvedBase = useMemo(
    () =>
      beastform.evolvedBaseFormId
        ? getBeastformById(beastform.evolvedBaseFormId)
        : undefined,
    [beastform.evolvedBaseFormId]
  );

  const hybridBases = useMemo(
    () =>
      beastform.hybridBaseFormIds
        ?.map(id => getBeastformById(id))
        .filter((f): f is BeastformDefinition => f !== undefined) ?? [],
    [beastform.hybridBaseFormIds]
  );

  if (!form) return null;

  // Use custom data for special forms, else form's own data
  const displayAdvantages: string[] =
    beastform.selectedAdvantages ??
    (evolvedBase ? evolvedBase.advantages : form.advantages);
  const displayFeatures: BeastformFeature[] =
    beastform.selectedFeatures ??
    (evolvedBase ? evolvedBase.features : form.features);

  return (
    <div
      className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-sm"
      role="status"
      aria-label={`Beastform active: ${form.name}`}
    >
      <StripHeader
        form={form}
        beastform={beastform}
        evolvedBase={evolvedBase}
        hybridBases={hybridBases}
      />
      <StripDetails advantages={displayAdvantages} features={displayFeatures} />
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function StripHeader({
  form,
  beastform,
  evolvedBase,
  hybridBases,
}: {
  form: BeastformDefinition;
  beastform: BeastformState;
  evolvedBase: BeastformDefinition | undefined;
  hybridBases: BeastformDefinition[];
}) {
  const attackSummary = form.attack
    ? `${form.attack.damageDice} ${form.attack.trait} (${form.attack.range})`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <PawPrint className="size-4 shrink-0 text-emerald-400" aria-hidden />
      <span className="font-semibold text-emerald-300">{form.name}</span>
      {evolvedBase && (
        <span className="text-xs text-amber-300">({evolvedBase.name})</span>
      )}
      {hybridBases.length > 0 && (
        <span className="text-xs text-amber-300">
          ({hybridBases.map(f => f.name).join(' + ')})
        </span>
      )}

      {form.traitBonus.value > 0 && (
        <Badge
          variant="outline"
          className="border-emerald-500/50 text-xs text-emerald-200"
        >
          +{form.traitBonus.value} {form.traitBonus.trait}
        </Badge>
      )}

      {form.evasionBonus !== 0 && (
        <Badge
          variant="outline"
          className="border-emerald-500/50 text-xs text-emerald-200"
        >
          {form.evasionBonus > 0 ? '+' : ''}
          {form.evasionBonus} Evasion
        </Badge>
      )}

      {beastform.activationMethod === 'evolution' &&
        beastform.evolutionBonusTrait && (
          <Badge
            variant="outline"
            className="border-amber-500/50 text-xs text-amber-200"
          >
            +{beastform.evolutionBonusTrait.value}{' '}
            {beastform.evolutionBonusTrait.trait}
          </Badge>
        )}

      {attackSummary && (
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <Swords className="size-3" aria-hidden />
          {attackSummary}
        </span>
      )}
    </div>
  );
}

function StripDetails({
  advantages,
  features,
}: {
  advantages: string[];
  features: BeastformFeature[];
}) {
  if (advantages.length === 0 && features.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {advantages.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Shield className="size-3 shrink-0 text-emerald-400" aria-hidden />
          {advantages.map(adv => (
            <Badge
              key={adv}
              variant="outline"
              className="border-emerald-600/40 px-1.5 py-0 text-[0.625rem] text-emerald-200"
            >
              {adv}
            </Badge>
          ))}
        </div>
      )}
      {features.length > 0 && (
        <div className="space-y-1">
          {features.map(f => (
            <div key={f.name} className="text-xs">
              <span className="font-medium text-emerald-300">{f.name}:</span>{' '}
              <span className="text-emerald-200/70">{f.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
