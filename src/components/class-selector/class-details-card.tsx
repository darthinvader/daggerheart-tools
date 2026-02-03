import { Badge } from '@/components/ui/badge';
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
import { Wrench } from '@/lib/icons';
import type { HomebrewClass } from '@/lib/schemas/class-selection';
import type { ClassFeature, HopeFeature } from '@/lib/schemas/core';

import {
  BackgroundQuestionsSection,
  ClassItemsSection,
  ConnectionsSection,
  createBackgroundQuestionsHandlers,
  createClassItemsHandlers,
  createConnectionsHandlers,
} from './class-details-card-sections';
import { ClassFeaturesList } from './class-features-list';
import { DomainSelectors } from './domain-selectors';
import { HopeFeatureSection } from './hope-feature-section';

interface ClassDetailsCardProps {
  draft: HomebrewClass;
  updateDraft: (updates: Partial<HomebrewClass>) => void;
  handleDomainChange: (index: 0 | 1, domain: string) => void;
  addClassFeature: () => void;
  updateClassFeature: (index: number, updates: Partial<ClassFeature>) => void;
  removeClassFeature: (index: number) => void;
}

export function ClassDetailsCard({
  draft,
  updateDraft,
  handleDomainChange,
  addClassFeature,
  updateClassFeature,
  removeClassFeature,
}: ClassDetailsCardProps) {
  const itemsHandlers = createClassItemsHandlers(draft, updateDraft);
  const questionsHandlers = createBackgroundQuestionsHandlers(
    draft,
    updateDraft
  );
  const connectionsHandlers = createConnectionsHandlers(draft, updateDraft);

  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge className="inline-flex items-center gap-1">
            <Wrench className="size-3" /> Homebrew
          </Badge>
          <CardTitle className="text-base">Create Class</CardTitle>
        </div>
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
              hopeFeature: { ...draft.hopeFeature, ...updates } as HopeFeature,
            })
          }
        />
        <ClassFeaturesList
          features={draft.classFeatures ?? []}
          onAdd={addClassFeature}
          onUpdate={updateClassFeature}
          onRemove={removeClassFeature}
        />

        <ClassItemsSection items={draft.classItems ?? []} {...itemsHandlers} />

        <BackgroundQuestionsSection
          questions={draft.backgroundQuestions ?? []}
          {...questionsHandlers}
        />

        <ConnectionsSection
          connections={draft.connections ?? []}
          {...connectionsHandlers}
        />
      </CardContent>
    </Card>
  );
}
