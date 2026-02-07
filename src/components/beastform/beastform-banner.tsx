/**
 * BeastformBanner
 *
 * Banner displayed inside the beastform section when beastform is active.
 * Shows the active form name, trait bonus, and a button to drop the form.
 * Collapsible detail section reveals advantages, features, and attack info.
 * For special forms (Evolved / Hybrid), shows the custom configuration.
 */

import {
  ChevronDown,
  ChevronUp,
  PawPrint,
  Shield,
  Swords,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
  BeastformDefinition,
  BeastformFeature,
} from '@/lib/data/beastforms';
import { getBeastformById } from '@/lib/data/beastforms';

interface BeastformBannerProps {
  activeForm: BeastformDefinition;
  activationMethod: 'stress' | 'evolution' | null;
  evolutionBonusTrait?: { trait: string; value: number } | null;
  evolvedBaseFormId?: string | null;
  hybridBaseFormIds?: string[] | null;
  selectedAdvantages?: string[] | null;
  selectedFeatures?: BeastformFeature[] | null;
  onDeactivate: () => void;
  readOnly?: boolean;
}

function BeastformDetails({
  expanded,
  evolvedBase,
  hybridBases,
  activeForm,
  displayAdvantages,
  displayFeatures,
}: {
  expanded: boolean;
  evolvedBase: BeastformDefinition | undefined;
  hybridBases: BeastformDefinition[];
  activeForm: BeastformDefinition;
  displayAdvantages: string[];
  displayFeatures: BeastformFeature[];
}) {
  if (!expanded) return null;

  return (
    <div className="space-y-3 border-t border-emerald-500/20 px-3 py-3 sm:px-4">
      {/* Evolved base info */}
      {evolvedBase && (
        <div className="rounded-md border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
          <strong>Evolved from:</strong> {evolvedBase.name}
        </div>
      )}

      {/* Hybrid bases info */}
      {hybridBases.length > 0 && (
        <div className="rounded-md border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
          <strong>Combined from:</strong>{' '}
          {hybridBases.map(f => f.name).join(', ')}
        </div>
      )}

      {/* Attack info */}
      <div className="flex items-center gap-2 text-sm">
        <Swords className="size-4 shrink-0 text-emerald-400" aria-hidden />
        <span className="font-medium text-emerald-300">Attack:</span>
        <span>
          {activeForm.attack.damageDice} {activeForm.attack.trait} (
          {activeForm.attack.range})
        </span>
      </div>

      {/* Advantages */}
      {displayAdvantages.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="size-4 shrink-0 text-emerald-400" aria-hidden />
            <span className="font-medium text-emerald-300">Advantages:</span>
          </div>
          <div className="flex flex-wrap gap-1 pl-6">
            {displayAdvantages.map(adv => (
              <Badge
                key={adv}
                variant="outline"
                className="border-emerald-600/40 text-xs text-emerald-200"
              >
                {adv}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {displayFeatures.length > 0 && (
        <div className="space-y-2">
          {displayFeatures.map(feature => (
            <div key={feature.name} className="pl-6">
              <span className="text-sm font-medium text-emerald-300">
                {feature.name}:
              </span>{' '}
              <span
                className="text-sm text-emerald-100/80"
                style={{ whiteSpace: 'pre-line' }}
              >
                {feature.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BeastformBanner({
  activeForm,
  activationMethod,
  evolutionBonusTrait,
  evolvedBaseFormId,
  hybridBaseFormIds,
  selectedAdvantages,
  selectedFeatures,
  onDeactivate,
  readOnly,
}: BeastformBannerProps) {
  const [expanded, setExpanded] = useState(false);

  const evolvedBase = useMemo(
    () => (evolvedBaseFormId ? getBeastformById(evolvedBaseFormId) : undefined),
    [evolvedBaseFormId]
  );

  const hybridBases = useMemo(
    () =>
      hybridBaseFormIds
        ?.map(id => getBeastformById(id))
        .filter((f): f is BeastformDefinition => f !== undefined) ?? [],
    [hybridBaseFormIds]
  );

  // For evolved forms, show the base form's advantages and features
  const displayAdvantages: string[] =
    selectedAdvantages ??
    (evolvedBase ? evolvedBase.advantages : activeForm.advantages);
  const displayFeatures: BeastformFeature[] =
    selectedFeatures ??
    (evolvedBase ? evolvedBase.features : activeForm.features);

  return (
    <div
      className="animate-beastform-pop rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-100"
      role="status"
      aria-label={`Beastform active: ${activeForm.name}`}
    >
      {/* Compact header row */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
        <PawPrint className="size-5 shrink-0 text-emerald-400" aria-hidden />
        <span className="font-semibold text-emerald-300">
          {activeForm.name}
        </span>
        {activeForm.traitBonus.value > 0 && (
          <Badge
            variant="outline"
            className="border-emerald-500/50 text-emerald-200"
          >
            +{activeForm.traitBonus.value} {activeForm.traitBonus.trait}
          </Badge>
        )}
        {activeForm.evasionBonus > 0 && (
          <Badge
            variant="outline"
            className="border-emerald-500/50 text-emerald-200"
          >
            +{activeForm.evasionBonus} Evasion
          </Badge>
        )}
        {activationMethod === 'evolution' && evolutionBonusTrait && (
          <Badge
            variant="outline"
            className="border-amber-500/50 text-amber-200"
          >
            Evolution +{evolutionBonusTrait.value} {evolutionBonusTrait.trait}
          </Badge>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-300 hover:bg-emerald-800/50 hover:text-emerald-100"
            onClick={() => setExpanded(prev => !prev)}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? 'Collapse beastform details'
                : 'Expand beastform details'
            }
          >
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-300 hover:bg-emerald-800/50 hover:text-emerald-100"
              onClick={onDeactivate}
              aria-label="Drop beastform"
            >
              <X className="mr-1 size-4" />
              Drop Form
            </Button>
          )}
        </div>
      </div>

      <BeastformDetails
        expanded={expanded}
        evolvedBase={evolvedBase}
        hybridBases={hybridBases}
        activeForm={activeForm}
        displayAdvantages={displayAdvantages}
        displayFeatures={displayFeatures}
      />
    </div>
  );
}
