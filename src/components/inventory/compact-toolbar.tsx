import { Button } from '@/components/ui/button';

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
          ✨ Custom Item
        </Button>
        <Button size="sm" onClick={onAddClick}>
          ➕ Add Items
        </Button>
      </div>
    </div>
  );
}
