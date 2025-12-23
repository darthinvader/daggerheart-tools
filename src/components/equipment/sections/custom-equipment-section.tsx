import { ChevronDown, ChevronUp, Plus, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { type CustomEquipment, CustomSlotEditor } from '../custom-slot-editor';

interface CustomEquipmentSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slots: CustomEquipment[];
  onAdd: () => void;
  onUpdate: (id: string, equipment: CustomEquipment) => void;
  onDelete: (id: string) => void;
}

export function CustomEquipmentSection({
  isOpen,
  onOpenChange,
  slots,
  onAdd,
  onUpdate,
  onDelete,
}: CustomEquipmentSectionProps) {
  return (
    <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-0 hover:bg-transparent"
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  💎 Custom Equipment
                </span>
                {slots.length > 0 && (
                  <Badge variant="secondary">{slots.length}</Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="mr-1 h-4 w-4" />
              Add Slot
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Rings, necklaces, cloaks, and other custom gear
          </p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {slots.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-2">
                  No custom equipment yet
                </p>
                <Button variant="outline" onClick={onAdd}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Your First Custom Slot
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {slots.map(slot => (
                  <CustomSlotEditor
                    key={slot.id}
                    equipment={slot}
                    onUpdate={eq => onUpdate(slot.id, eq)}
                    onDelete={() => onDelete(slot.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
