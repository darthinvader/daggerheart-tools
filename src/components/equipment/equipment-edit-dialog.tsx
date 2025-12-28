import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { EditSectionContent } from './edit-section-content';
import type { EquipmentState } from './equipment-editor';
import {
  type EditingSection,
  getSectionEmoji,
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
}

export function EquipmentEditDialog({
  editingSection,
  draftEquipment,
  updateDraft,
  handleAddCustomSlot,
  closeSection,
  handleSave,
  hideDialogHeader = false,
}: EquipmentEditDialogProps) {
  return (
    <Dialog open={editingSection !== null} onOpenChange={() => closeSection()}>
      <DialogContent
        className={cn(
          'grid max-h-[90vh] gap-0 overflow-hidden p-0',
          hideDialogHeader
            ? 'grid-rows-[1fr_auto]'
            : 'grid-rows-[auto_1fr_auto]',
          'sm:max-w-[800px]'
        )}
      >
        {!hideDialogHeader && (
          <DialogHeader className="shrink-0 border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <span>{getSectionEmoji(editingSection)}</span>
              {getSectionTitle(editingSection)}
            </DialogTitle>
            <DialogDescription>
              Select or customize your{' '}
              {getSectionTitle(editingSection)?.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
        )}

        <div className="overflow-y-auto p-6">
          <EditSectionContent
            editingSection={editingSection}
            draftEquipment={draftEquipment}
            updateDraft={updateDraft}
            handleAddCustomSlot={handleAddCustomSlot}
            hideDialogHeader={hideDialogHeader}
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
