import { Badge } from '@/components/ui/badge';
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
import { Package, Plus, Trash2, Users, Wrench, X } from '@/lib/icons';
import type { HomebrewClass } from '@/lib/schemas/class-selection';
import type { ClassFeature, HopeFeature } from '@/lib/schemas/core';

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

        {/* Class Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="text-muted-foreground size-4" />
              <Label>Class Items</Label>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                updateDraft({
                  classItems: [...(draft.classItems ?? []), ''],
                })
              }
            >
              <Plus className="mr-1 size-3" />
              Add Item
            </Button>
          </div>
          {(draft.classItems ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draft.classItems?.map((item, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="group flex items-center gap-1 pr-1"
                >
                  <Input
                    className="h-5 w-24 border-none bg-transparent p-0 text-xs focus-visible:ring-0"
                    value={item}
                    placeholder="Item name..."
                    onChange={e => {
                      const newItems = [...(draft.classItems ?? [])];
                      newItems[i] = e.target.value;
                      updateDraft({ classItems: newItems });
                    }}
                  />
                  <button
                    type="button"
                    className="hover:bg-destructive/20 rounded p-0.5"
                    onClick={() => {
                      const newItems = (draft.classItems ?? []).filter(
                        (_, idx) => idx !== i
                      );
                      updateDraft({ classItems: newItems });
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Background Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Background Questions</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                updateDraft({
                  backgroundQuestions: [
                    ...(draft.backgroundQuestions ?? []),
                    '',
                  ],
                })
              }
            >
              <Plus className="mr-1 size-3" />
              Add Question
            </Button>
          </div>
          {(draft.backgroundQuestions ?? []).map((q, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={q}
                placeholder="Enter a background question..."
                onChange={e => {
                  const newQuestions = [...(draft.backgroundQuestions ?? [])];
                  newQuestions[i] = e.target.value;
                  updateDraft({ backgroundQuestions: newQuestions });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newQuestions = (draft.backgroundQuestions ?? []).filter(
                    (_, idx) => idx !== i
                  );
                  updateDraft({ backgroundQuestions: newQuestions });
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Connections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground size-4" />
              <Label>Connection Options</Label>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                updateDraft({
                  connections: [...(draft.connections ?? []), ''],
                })
              }
            >
              <Plus className="mr-1 size-3" />
              Add Connection
            </Button>
          </div>
          {(draft.connections ?? []).map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={c}
                placeholder="Enter a connection option..."
                onChange={e => {
                  const newConnections = [...(draft.connections ?? [])];
                  newConnections[i] = e.target.value;
                  updateDraft({ connections: newConnections });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newConnections = (draft.connections ?? []).filter(
                    (_, idx) => idx !== i
                  );
                  updateDraft({ connections: newConnections });
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
