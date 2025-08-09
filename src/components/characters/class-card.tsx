import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ClassCardProps = {
  selectedClass?: string;
  selectedSubclass?: string;
  onEdit?: () => void;
  disabled?: boolean;
};

export function ClassCard({
  selectedClass,
  selectedSubclass,
  onEdit,
  disabled = false,
}: ClassCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class & Subclass</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-sm">
          {selectedClass ? (
            <div className="space-y-0.5">
              <div className="font-medium">{selectedClass}</div>
              <div className="text-muted-foreground text-xs">
                {selectedSubclass ?? 'Select a subclass'}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Pick a class</div>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          disabled={disabled}
        >
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}
