import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/utils';

import { EditSectionContent } from './edit-section-content';
import type { EquipmentState } from './equipment-editor';
import {
  type EditingSection,
  getSectionIcon,
  getSectionTitle,
} from './use-equipment-editor';

interface EquipmentEditDialogProps {
  editingSection: EditingSection;
  draftEquipment: EquipmentState;
  updateDraft: (updates: Partial<EquipmentState>) => void;
  handleAddCustomSlot: () => void;
  closeSection: () => void;
  handleSave: () => void;
  hideDialogHeader?: boolean;
  allowedTiers?: string[];
}

export function EquipmentEditDialog({
  editingSection,
  draftEquipment,
  updateDraft,
  handleAddCustomSlot,
  closeSection,
  handleSave,
  hideDialogHeader = false,
  allowedTiers,
}: EquipmentEditDialogProps) {
  return (
    <Dialog open={editingSection !== null} onOpenChange={() => closeSection()}>
      <DialogContent
        className={cn(
          'grid max-h-[90vh] gap-0 overflow-hidden p-0',
          hideDialogHeader
            ? 'grid-rows-[1fr_auto]'
            : 'grid-rows-[auto_1fr_auto]',
          'w-[98vw] max-w-5xl sm:w-[95vw] sm:max-w-5xl'
        )}
        aria-describedby={hideDialogHeader ? undefined : undefined}
      >
        {hideDialogHeader && (
          <VisuallyHidden>
            <DialogTitle>{getSectionTitle(editingSection)}</DialogTitle>
          </VisuallyHidden>
        )}
        {!hideDialogHeader && (
          <DialogHeader className="shrink-0 border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              {(() => {
                const SectionIcon = getSectionIcon(editingSection);
                return <SectionIcon className="size-5" />;
              })()}
              {getSectionTitle(editingSection)}
            </DialogTitle>
            <DialogDescription>
              Select or customize your{' '}
              {getSectionTitle(editingSection)?.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
        )}

        <div className="flex h-full min-h-0 flex-col overflow-y-auto p-6">
          <EditSectionContent
            editingSection={editingSection}
            draftEquipment={draftEquipment}
            updateDraft={updateDraft}
            handleAddCustomSlot={handleAddCustomSlot}
            hideDialogHeader={hideDialogHeader}
            allowedTiers={allowedTiers}
          />
        </div>

        <DialogFooter className="shrink-0 border-t p-4">
          <Button variant="outline" onClick={closeSection}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
