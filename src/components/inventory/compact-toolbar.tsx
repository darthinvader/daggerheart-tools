import { Button } from '@/components/ui/button';
import { Plus } from '@/lib/icons';

interface CompactToolbarProps {
  onAddClick: () => void;
}

export function CompactToolbar({ onAddClick }: CompactToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-2">
        <Button size="sm" onClick={onAddClick}>
          <Plus className="mr-1 size-4" /> Add Items
        </Button>
      </div>
    </div>
  );
}
