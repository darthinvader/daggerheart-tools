/**
 * BeastformSection
 *
 * Optional character sheet section for beastform management.
 * Druids see it by default; non-Druids enable via Settings dialog.
 * Hidden entirely when disabled. Renders BeastformBanner when active.
 */

import { PawPrint } from 'lucide-react';

import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { Button } from '@/components/ui/button';
import { useBeastformActions, useBeastformState } from '@/hooks/use-beastform';

import { BeastformBanner } from './beastform-banner';
import { BeastformPanel } from './beastform-panel';

interface BeastformSectionProps {
  state: DemoState;
  handlers: DemoHandlers;
  readOnly?: boolean;
}

export function BeastformSection({
  state,
  handlers,
  readOnly,
}: BeastformSectionProps) {
  const beastformState = useBeastformState(
    state.classSelection?.className ?? null,
    state.progression.currentLevel,
    state.beastform,
    state.beastformEnabled
  );
  const beastformActions = useBeastformActions(handlers.setBeastform);

  // isDruid from the hook actually means "canUseBeastform" (isDruid || beastformEnabled)
  const showBeastform = beastformState.isDruid;
  const isNativeDruid =
    (state.classSelection?.className ?? '').toLowerCase() === 'druid';

  // When disabled, hide entirely — use the Settings dialog to toggle on
  if (!showBeastform) return null;

  return (
    <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <PawPrint className="size-5 shrink-0 text-emerald-500" />
          <h3 className="truncate text-lg font-semibold">Beastform</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!readOnly && (
            <BeastformPanel
              availableForms={beastformState.availableForms}
              isActive={beastformState.isActive}
              onActivateWithStress={beastformActions.activateWithStress}
              onActivateWithEvolution={beastformActions.activateWithEvolution}
              onDeactivate={beastformActions.deactivate}
              readOnly={readOnly}
            />
          )}
          {!isNativeDruid && !beastformState.isActive && !readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs"
              onClick={() => {
                beastformActions.deactivate();
                handlers.setBeastformEnabled(false);
              }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {beastformState.isActive && beastformState.activeForm ? (
        <div className="p-3 sm:p-4">
          <BeastformBanner
            activeForm={beastformState.activeForm}
            activationMethod={state.beastform.activationMethod}
            evolutionBonusTrait={state.beastform.evolutionBonusTrait}
            evolvedBaseFormId={state.beastform.evolvedBaseFormId}
            hybridBaseFormIds={state.beastform.hybridBaseFormIds}
            selectedAdvantages={state.beastform.selectedAdvantages}
            selectedFeatures={state.beastform.selectedFeatures}
            onDeactivate={beastformActions.deactivate}
            readOnly={readOnly}
          />
        </div>
      ) : (
        <div className="text-muted-foreground p-6 text-center text-sm">
          No beastform active. Use the button above to transform.
        </div>
      )}
    </section>
  );
}
