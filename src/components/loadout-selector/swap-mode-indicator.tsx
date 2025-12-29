import { Button } from '@/components/ui/button';

type SwapModeIndicatorProps = {
  isSwapMode: boolean;
  onCancel: () => void;
};

export function SwapModeIndicator({
  isSwapMode,
  onCancel,
}: SwapModeIndicatorProps) {
  if (!isSwapMode) return null;

  return (
    <div className="rounded-lg border border-amber-500 bg-amber-500/10 p-2 text-center text-sm">
      <span className="text-amber-700 dark:text-amber-300">
        Select a card to swap positions with
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="ml-2 h-6 text-xs"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
