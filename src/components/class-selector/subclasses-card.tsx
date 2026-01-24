import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Theater } from '@/lib/icons';
import type { HomebrewClass } from '@/lib/schemas/class-selection';
import type { SubclassFeature } from '@/lib/schemas/core';

import { SubclassFormCard } from './subclass-form-card';

interface SubclassesCardProps {
  subclasses: HomebrewClass['subclasses'];
  addSubclass: () => void;
  updateSubclass: (
    index: number,
    updates: Partial<HomebrewClass['subclasses'][number]>
  ) => void;
  removeSubclass: (index: number) => void;
  addFeature: (subclassIndex: number) => void;
  updateFeature: (
    subclassIndex: number,
    featureIndex: number,
    updates: Partial<SubclassFeature>
  ) => void;
  removeFeature: (subclassIndex: number, featureIndex: number) => void;
}

export function SubclassesCard({
  subclasses,
  addSubclass,
  updateSubclass,
  removeSubclass,
  addFeature,
  updateFeature,
  removeFeature,
}: SubclassesCardProps) {
  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="inline-flex items-center">
              <Theater className="size-3" />
            </Badge>
            <CardTitle className="text-base">Subclasses</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={addSubclass}>
            ➕ Add Subclass
          </Button>
        </div>
        <CardDescription>
          Create at least one subclass for your homebrew class.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subclasses.map((subclass, index) => (
          <SubclassFormCard
            key={index}
            subclass={subclass}
            index={index}
            canRemove={subclasses.length > 1}
            onUpdate={updates => updateSubclass(index, updates)}
            onRemove={() => removeSubclass(index)}
            onAddFeature={() => addFeature(index)}
            onUpdateFeature={(featureIndex, updates) =>
              updateFeature(index, featureIndex, updates)
            }
            onRemoveFeature={featureIndex => removeFeature(index, featureIndex)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
