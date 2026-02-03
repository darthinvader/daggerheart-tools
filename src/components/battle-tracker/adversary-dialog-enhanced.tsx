import { BookOpen, PlusCircle } from 'lucide-react';

import { AdversaryDetailPanel } from '@/components/battle-tracker/adversary-detail-panel';
import {
  HelpSidebarSection,
  ResultsGridSection,
  SearchFiltersSection,
  SelectionPanelSection,
} from '@/components/battle-tracker/adversary-dialog-sections';
import { CustomAdversaryBuilder } from '@/components/battle-tracker/custom-adversary-builder';
import { useAdversaryDialogState } from '@/components/battle-tracker/use-adversary-dialog-state';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Adversary } from '@/lib/schemas/adversaries';

interface AddAdversaryDialogEnhancedProps {
  isOpen: boolean;
  adversaries: Adversary[];
  onOpenChange: (open: boolean) => void;
  onAdd: (adversary: Adversary) => void;
}

export function AddAdversaryDialogEnhanced({
  isOpen,
  adversaries,
  onOpenChange,
  onAdd,
}: AddAdversaryDialogEnhancedProps) {
  const state = useAdversaryDialogState({ adversaries, onAdd, onOpenChange });

  return (
    <Dialog open={isOpen} onOpenChange={state.handleOpenChange}>
      <DialogContent className="flex h-full w-full flex-col gap-0 p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-[95vw]">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Add Adversaries</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => state.setShowCustomBuilder(true)}
                className="gap-1.5"
              >
                <PlusCircle className="size-4" />
                Custom
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={state.toggleHelp}
                className="gap-1.5"
              >
                <BookOpen className="size-4" />
                {state.showHelp ? 'Hide' : 'GM'} Help
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <SearchFiltersSection
              search={state.search}
              tierFilter={state.tierFilter}
              roleFilter={state.roleFilter}
              showFilters={state.showFilters}
              activeFilters={state.activeFilters}
              onSearchChange={state.setSearch}
              onTierChange={state.setTierFilter}
              onRoleChange={state.setRoleFilter}
              onToggleFilters={state.toggleFilters}
              onClearFilters={state.clearFilters}
            />

            <ResultsGridSection
              filtered={state.filtered}
              totalSelected={state.totalSelected}
              expandedId={state.expandedId}
              viewingAdversary={state.viewingAdversary}
              selections={state.selections}
              onViewAdversary={state.setViewingAdversary}
              onToggleExpand={state.toggleExpand}
              onIncrement={name => state.updateSelection(name, 1)}
              onDecrement={name => state.updateSelection(name, -1)}
            />

            <SelectionPanelSection
              selections={state.selections}
              totalSelected={state.totalSelected}
              onRemove={state.removeSelection}
              onClearAll={state.clearAllSelections}
              onAddSelected={state.handleAddSelected}
            />
          </div>

          {/* Adversary Detail Panel */}
          {state.viewingAdversary && (
            <AdversaryDetailPanel
              adversary={state.viewingAdversary}
              onClose={() => state.setViewingAdversary(null)}
              onAdd={() =>
                state.updateSelection(state.viewingAdversary!.name, 1)
              }
              canAdd
            />
          )}

          <HelpSidebarSection
            show={state.showHelp}
            viewingAdversary={state.viewingAdversary}
          />
        </div>
      </DialogContent>

      <CustomAdversaryBuilder
        isOpen={state.showCustomBuilder}
        onOpenChange={state.setShowCustomBuilder}
        onSave={state.handleAddCustomAdversary}
      />
    </Dialog>
  );
}
