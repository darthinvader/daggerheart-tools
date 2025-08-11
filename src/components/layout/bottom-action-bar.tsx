import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type BottomActionBarProps = {
  className?: string;
  onSave?: () => void;
  onTogglePlay?: () => void;
  isPlayMode?: boolean;
  saveDisabled?: boolean;
};

// Fixed bottom action bar that respects mobile safe-area insets and keyboard.
export function BottomActionBar({
  className,
  onSave,
  onTogglePlay,
  isPlayMode,
  saveDisabled,
}: BottomActionBarProps) {
  return (
    <div
      className={cn(
        'bg-background/70 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur',
        'px-2 pt-1 pb-[max(10px,env(safe-area-inset-bottom))]',
        className
      )}
      role="region"
      aria-label="Character actions"
    >
      <div className="mx-auto flex max-w-screen-sm items-center justify-between gap-1">
        <Button
          type="button"
          variant="outline"
          className="min-h-[44px] min-w-[44px]"
          onClick={onTogglePlay}
        >
          {isPlayMode ? 'Exit Play' : 'Play Mode'}
        </Button>
        <Button
          type="button"
          className="min-h-[44px] min-w-[44px]"
          onClick={onSave}
          disabled={saveDisabled}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
