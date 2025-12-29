import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { HomebrewClass } from '@/lib/schemas/class-selection';

import { ClassFeaturesList } from './class-features-list';
import { DomainSelectors } from './domain-selectors';
import { HopeFeatureSection } from './hope-feature-section';
import { SubclassFormCard } from './subclass-form-card';
import { useHomebrewClassState } from './use-homebrew-class-state';

interface HomebrewClassFormProps {
  homebrewClass: HomebrewClass | null;
  onChange: (homebrewClass: HomebrewClass) => void;
}

export function HomebrewClassForm({
  homebrewClass,
  onChange,
}: HomebrewClassFormProps) {
  const {
    draft,
    updateDraft,
    handleDomainChange,
    updateSubclass,
    addSubclass,
    removeSubclass,
    addFeature,
    updateFeature,
    removeFeature,
    addClassFeature,
    updateClassFeature,
    removeClassFeature,
  } = useHomebrewClassState({ homebrewClass, onChange });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎨</span>
            <span>Create Homebrew Class</span>
          </CardTitle>
          <CardDescription>
            Design your own custom class with unique abilities and features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                placeholder="Enter class name..."
                value={draft.name}
                onChange={e => updateDraft({ name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="hp">Starting HP</Label>
                <Input
                  id="hp"
                  type="number"
                  min={1}
                  max={20}
                  value={draft.startingHitPoints}
                  onChange={e =>
                    updateDraft({ startingHitPoints: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evasion">Starting Evasion</Label>
                <Input
                  id="evasion"
                  type="number"
                  min={8}
                  max={20}
                  value={draft.startingEvasion}
                  onChange={e =>
                    updateDraft({ startingEvasion: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-description">Description</Label>
            <Textarea
              id="class-description"
              placeholder="Describe your class..."
              value={draft.description}
              onChange={e => updateDraft({ description: e.target.value })}
              rows={3}
            />
          </div>

          <DomainSelectors
            primaryDomain={draft.domains[0]}
            secondaryDomain={draft.domains[1]}
            onDomainChange={handleDomainChange}
          />

          <HopeFeatureSection
            hopeFeature={draft.hopeFeature}
            onUpdate={updates =>
              updateDraft({
                hopeFeature: { ...draft.hopeFeature, ...updates },
              })
            }
          />

          <ClassFeaturesList
            features={draft.classFeatures ?? []}
            onAdd={addClassFeature}
            onUpdate={updateClassFeature}
            onRemove={removeClassFeature}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>🎭</span>
              <span>Subclasses</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addSubclass}>
              ➕ Add Subclass
            </Button>
          </div>
          <CardDescription>
            Create at least one subclass for your homebrew class.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.subclasses.map((subclass, index) => (
            <SubclassFormCard
              key={index}
              subclass={subclass}
              index={index}
              canRemove={draft.subclasses.length > 1}
              onUpdate={updates => updateSubclass(index, updates)}
              onRemove={() => removeSubclass(index)}
              onAddFeature={() => addFeature(index)}
              onUpdateFeature={(featureIndex, updates) =>
                updateFeature(index, featureIndex, updates)
              }
              onRemoveFeature={featureIndex =>
                removeFeature(index, featureIndex)
              }
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
