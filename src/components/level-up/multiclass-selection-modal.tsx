import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ALL_CLASSES,
  type GameSubclass,
  getSubclassesForClass,
} from '@/lib/data/classes';
import { ClassIcons, Scroll } from '@/lib/icons';

import { SubclassSelectionGrid } from './subclass-selection-grid';

export type MulticlassSelectionResult = {
  className: string;
  subclassName: string;
  domains: string[];
};

export type MulticlassSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: MulticlassSelectionResult) => void;
  currentClassName?: string;
};

export function MulticlassSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  currentClassName,
}: MulticlassSelectionModalProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubclass, setSelectedSubclass] = useState<GameSubclass | null>(
    null
  );

  const availableClasses = useMemo(() => {
    return ALL_CLASSES.filter(c => c.name !== currentClassName);
  }, [currentClassName]);

  const availableSubclasses = useMemo(() => {
    if (!selectedClass) return [];
    return getSubclassesForClass(selectedClass);
  }, [selectedClass]);

  const selectedClassData = useMemo(() => {
    return ALL_CLASSES.find(c => c.name === selectedClass);
  }, [selectedClass]);

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setSelectedSubclass(null);
  };

  const handleSubclassSelect = (subclass: GameSubclass) => {
    setSelectedSubclass(subclass);
  };

  const handleConfirm = () => {
    if (selectedClassData && selectedSubclass) {
      onConfirm({
        className: selectedClass,
        subclassName: selectedSubclass.name,
        domains: [...selectedClassData.domains],
      });
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setSelectedClass('');
    setSelectedSubclass(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && resetAndClose()}>
      <DialogContent className="flex max-h-[90vh] w-[98vw] max-w-4xl flex-col overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Multiclass</DialogTitle>
          <DialogDescription>
            Choose a new class and subclass to multiclass into. This will give
            you access to their domain cards.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Class</label>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class..." />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map(cls => {
                  const ClassIcon = ClassIcons[cls.name] ?? Scroll;
                  return (
                    <SelectItem key={cls.name} value={cls.name}>
                      <span className="flex items-center gap-2">
                        <ClassIcon size={16} className="inline-block" />
                        <span>{cls.name}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedClassData && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Domains:</span>
                {selectedClassData.domains.map(domain => (
                  <Badge key={domain} variant="secondary">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {availableSubclasses.length > 0 && (
            <SubclassSelectionGrid
              subclasses={availableSubclasses}
              selectedSubclass={selectedSubclass}
              selectedClassName={selectedClass}
              onSelect={handleSubclassSelect}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedClass || !selectedSubclass}
          >
            Confirm Multiclass
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
