import { cn } from '@/lib/utils';

type EndDropZoneProps = {
  location: 'active' | 'vault';
  index: number;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  isDragOver: boolean;
  isVisible: boolean;
};

export function EndDropZone({
  location,
  onDragOver,
  onDrop,
  isDragOver,
  isVisible,
}: EndDropZoneProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all',
        isDragOver
          ? 'border-primary bg-primary/10 ring-primary ring-2'
          : 'border-muted-foreground/30 bg-muted/30',
        location === 'active' ? 'border-green-500/50' : 'border-blue-500/50'
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span className="text-muted-foreground text-sm">
        Drop here to add to end
      </span>
    </div>
  );
}
