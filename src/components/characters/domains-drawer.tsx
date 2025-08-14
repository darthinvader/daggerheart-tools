import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

// Virtual list is used via AvailableCardsSection
import { CreationCompleteToggle } from '@/components/characters/domains-drawer/creation-complete-toggle';
import { DomainsListsSection } from '@/components/characters/domains-drawer/domains-lists-section';
import { DomainsTabs } from '@/components/characters/domains-drawer/domains-tabs';
import { LoadoutFooter } from '@/components/characters/domains-drawer/loadout-footer';
import { getLoadoutLimits } from '@/components/characters/domains-drawer/loadout-limits';
import { useAutosaveAndBaseline } from '@/components/characters/domains-drawer/use-autosave-and-baseline';
import { useDomainCardsLoader } from '@/components/characters/domains-drawer/use-domain-cards-loader';
import { useDomainFilters } from '@/components/characters/domains-drawer/use-domain-filters';
import { useDrawerStage } from '@/components/characters/domains-drawer/use-drawer-stage';
import { useHomebrewForm } from '@/components/characters/domains-drawer/use-homebrew-form';
import { useLoadoutLists } from '@/components/characters/domains-drawer/use-loadout-lists';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
// Tabs are handled inside DomainsTabs presenter
import { filterCards as filterCardsShared } from '@/features/characters/logic';
// Stage/overscan handled by useDrawerStage
// Using CSS dynamic viewport units (dvh) for correct keyboard interactions
import type { DomainCard } from '@/lib/schemas/domains';

// Homebrew form UI is lazy-loaded inside DomainsTabs

// import { cn } from '@/lib/utils';

export type DomainsFormValues = {
  loadout: DomainCard[];
  vault: DomainCard[];
  creationComplete?: boolean;
};

export type DomainsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<DomainsFormValues>;
  allCards?: DomainCard[];
  accessibleDomains: string[]; // Domain names allowed
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
  startingLimit?: number; // hard limit during creation
  softLimit?: number; // guidance after creation
};

function DomainsDrawerImpl({
  open,
  onOpenChange,
  form,
  allCards,
  accessibleDomains,
  submit,
  onCancel,
  startingLimit = 3,
  softLimit = 6,
}: DomainsDrawerProps) {
  // Track stage/ready/overscan using a small hook
  const {
    closing,
    startClosing,
    clearClosing,
    afterOpen,
    measureReady,
    virtualOverscan,
  } = useDrawerStage(open);
  // Debounced search + filters via shared hook
  // Replace local filter/search state with shared hook
  const {
    domainFilter,
    levelFilter,
    typeFilter,
    search,
    debouncedSearch,
    setDomainFilter,
    setLevelFilter,
    setTypeFilter,
    setSearch,
  } = useDomainFilters({
    domainFilter: 'All',
    levelFilter: 'All',
    typeFilter: 'All',
    search: '',
  });
  // Homebrew minimal fields; description carries the "what it does" text
  const { state: hb, setState: setHb, clear: clearHb } = useHomebrewForm();

  const { creationComplete, handleCancel, markSkip, resetToBaseline } =
    useAutosaveAndBaseline({ open, form, submit: () => submit() });

  // Cleanup handled in use-drawer-stage/use-closing-freeze

  const { cards, isLoadingCards } = useDomainCardsLoader(
    open,
    allCards ?? null
  );

  // Centralized list management
  const {
    currentLoadout,
    currentVault,
    inLoadout,
    addToLoadout,
    removeFromLoadout,
    removeFromVault,
  } = useLoadoutLists(form as never);

  // Use shared helpers for filtering
  const filterCards = React.useCallback(
    (cardsList: DomainCard[], restrictToAccessible: boolean) =>
      filterCardsShared(cardsList, {
        allowedDomains: restrictToAccessible ? accessibleDomains : undefined,
        domain: domainFilter,
        level: levelFilter,
        type: typeFilter,
        search: debouncedSearch,
      }),
    [accessibleDomains, domainFilter, levelFilter, typeFilter, debouncedSearch]
  );

  // provided by useDrawerStage

  // Virtualized list for large collections to improve performance.
  // Virtualized list extracted into a dedicated component for clarity

  // Handlers provided by hook

  const { disableAdd } = getLoadoutLimits(
    creationComplete,
    currentLoadout.length,
    startingLimit,
    softLimit
  );

  // Compute recall-cost budget used (read-only for now). Costs may be undefined; treat missing as 0.
  const recallBudgetUsed = React.useMemo(
    () => currentLoadout.reduce((sum, c) => sum + (c.recallCost ?? 0), 0),
    [currentLoadout]
  );

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={next => {
        // Transition into a temporary "closing" state to freeze scrolling/measurement
        if (!next && open) startClosing(450);
        else if (next) clearClosing();
        onOpenChange(next);
      }}
      title={
        <span className="text-base leading-snug break-words">
          Manage Domains & Loadout
        </span>
      }
      onCancel={() => handleCancel(onCancel)}
      onSubmit={() => {
        markSkip();
        return submit();
      }}
      footer={
        <LoadoutFooter
          recallBudgetUsed={recallBudgetUsed}
          canSave={form.formState.isValid}
          onReset={resetToBaseline}
          onSaveClick={markSkip}
          formId="domains-drawer-form"
        />
      }
    >
      {/* Wrap content to suppress interactions while closing */}
      <div
        className={
          closing ? 'pointer-events-none touch-none select-none' : undefined
        }
      >
        <Form {...form}>
          <form
            id="domains-drawer-form"
            className="space-y-4"
            onSubmit={submit}
            noValidate
          >
            <DomainsTabs
              open={open}
              afterOpen={afterOpen}
              measureReady={measureReady}
              closing={closing}
              virtualOverscan={virtualOverscan}
              accessibleDomains={accessibleDomains}
              cards={cards}
              isLoadingCards={isLoadingCards}
              inLoadout={inLoadout}
              disableAdd={disableAdd}
              addToLoadout={addToLoadout}
              removeFromLoadout={removeFromLoadout}
              domainFilter={domainFilter}
              levelFilter={levelFilter}
              typeFilter={typeFilter}
              search={search}
              debouncedSearch={debouncedSearch}
              setDomainFilter={setDomainFilter}
              setLevelFilter={setLevelFilter}
              setTypeFilter={setTypeFilter}
              setSearch={setSearch}
              filterCards={filterCards}
              hb={hb}
              onHomebrewChange={setHb}
              onHomebrewAdd={addToLoadout}
              onHomebrewClear={clearHb}
            />

            {/* Homebrew tab is handled inside DomainsTabs for consistency */}

            {/* * REVIEW: Limits and costs TBD — earlier count-based guidance removed. */}
            <CreationCompleteToggle form={form as never} />

            <DomainsListsSection
              form={form}
              afterOpen={afterOpen}
              currentLoadout={currentLoadout}
              currentVault={currentVault}
              inLoadout={inLoadout}
              disableAdd={disableAdd}
              addToLoadout={addToLoadout}
              removeFromLoadout={removeFromLoadout}
              removeFromVault={removeFromVault}
            />
          </form>
        </Form>
        {/* Lightweight, ephemeral blocker to absorb touch/scroll during close on mobile */}
        {closing ? (
          <div className="fixed inset-0 z-10" aria-hidden="true" />
        ) : null}
      </div>
    </DrawerScaffold>
  );
}
export const DomainsDrawer = React.memo(DomainsDrawerImpl);
