import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Calendar } from '@/lib/schemas/calendar';

// =====================================================================================
// DeleteCalendarDialog — Confirmation dialog for calendar deletion (B1)
// =====================================================================================

interface DeleteCalendarDialogProps {
  calendar: Calendar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (calendarId: string) => void;
}

export function DeleteCalendarDialog({
  calendar,
  open,
  onOpenChange,
  onConfirm,
}: DeleteCalendarDialogProps) {
  if (!calendar) return null;

  const eventCount = calendar.events.length;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &ldquo;{calendar.name}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This calendar has {eventCount} event{eventCount !== 1 ? 's' : ''}.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm(calendar.id);
              onOpenChange(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
