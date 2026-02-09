import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { useIsMobile } from '@/hooks/use-mobile';
import { Axe, Gem, Shield, Sword, Wheelchair } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { EditSectionContent } from './edit-section-content';
import type { EquipmentState } from './equipment-editor';
import { type EditingSection, getSectionTitle } from './use-equipment-editor';

function renderSectionIcon(section: EditingSection) {
  switch (section) {
    case 'primary':
      return <Sword className="size-5" />;
    case 'secondary':
      return <Axe className="size-5" />;
    case 'armor':
      return <Shield className="size-5" />;
    case 'wheelchair':
      return <Wheelchair className="size-5" />;
    case 'custom':
      return <Gem className="size-5" />;
    default:
      return <Shield className="size-5" />;
  }
}

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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer
        open={editingSection !== null}
        onOpenChange={() => closeSection()}
      >
        <DrawerContent className="flex max-h-[85vh] flex-col">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              {renderSectionIcon(editingSection)}
              {getSectionTitle(editingSection)}
            </DrawerTitle>
            <DrawerDescription>
              Select or customize your{' '}
              {getSectionTitle(editingSection)?.toLowerCase()}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <EditSectionContent
              editingSection={editingSection}
              draftEquipment={draftEquipment}
              updateDraft={updateDraft}
              handleAddCustomSlot={handleAddCustomSlot}
              hideDialogHeader={hideDialogHeader}
              allowedTiers={allowedTiers}
            />
          </div>

          <DrawerFooter className="border-t pt-4">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={closeSection}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={editingSection !== null} onOpenChange={() => closeSection()}>
      <DialogContent
        className={cn(
          'grid h-full w-full gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh]',
          hideDialogHeader
            ? 'grid-rows-[1fr_auto]'
            : 'grid-rows-[auto_1fr_auto]',
          'sm:w-[98vw] sm:max-w-5xl'
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
              {renderSectionIcon(editingSection)}
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
