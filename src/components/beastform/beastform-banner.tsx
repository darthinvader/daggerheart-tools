/**
 * BeastformBanner
 *
 * Banner displayed at the top of the character sheet when beastform is active.
 * Shows the active form name, trait bonus, and a button to drop the form.
 */

import { PawPrint, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BeastformDefinition } from '@/lib/data/beastforms';

interface BeastformBannerProps {
  activeForm: BeastformDefinition;
  activationMethod: 'stress' | 'evolution' | null;
  evolutionBonusTrait?: { trait: string; value: number } | null;
  onDeactivate: () => void;
  readOnly?: boolean;
}

export function BeastformBanner({
  activeForm,
  activationMethod,
  evolutionBonusTrait,
  onDeactivate,
  readOnly,
}: BeastformBannerProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-emerald-100 sm:px-4 sm:py-3"
      role="status"
      aria-label={`Beastform active: ${activeForm.name}`}
    >
      <PawPrint className="size-5 shrink-0 text-emerald-400" aria-hidden />
      <span className="font-semibold text-emerald-300">{activeForm.name}</span>
      <Badge
        variant="outline"
        className="border-emerald-500/50 text-emerald-200"
      >
        +{activeForm.traitBonus.value} {activeForm.traitBonus.trait}
      </Badge>
      {activeForm.evasionBonus > 0 && (
        <Badge
          variant="outline"
          className="border-emerald-500/50 text-emerald-200"
        >
          +{activeForm.evasionBonus} Evasion
        </Badge>
      )}
      {activationMethod === 'evolution' && evolutionBonusTrait && (
        <Badge variant="outline" className="border-amber-500/50 text-amber-200">
          Evolution +{evolutionBonusTrait.value} {evolutionBonusTrait.trait}
        </Badge>
      )}
      <span className="text-sm text-emerald-400/70">
        {activeForm.attack.damageDice} {activeForm.attack.trait} (
        {activeForm.attack.range})
      </span>
      {!readOnly && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-emerald-300 hover:bg-emerald-800/50 hover:text-emerald-100"
          onClick={onDeactivate}
          aria-label="Drop beastform"
        >
          <X className="mr-1 size-4" />
          Drop Form
        </Button>
      )}
    </div>
  );
}
