import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from '@/lib/icons';

interface CompactToolbarProps {
  onCustomClick: () => void;
  onAddClick: () => void;
}

export function CompactToolbar({
  onCustomClick,
  onAddClick,
}: CompactToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCustomClick}>
          <Sparkles className="mr-1 size-4" /> Custom Item
        </Button>
        <Button size="sm" onClick={onAddClick}>
          <Plus className="mr-1 size-4" /> Add Items
        </Button>
      </div>
    </div>
  );
}
