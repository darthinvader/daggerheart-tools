/**
 * Class Details Card Section Components
 *
 * Extracted section components to reduce complexity.
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus, Trash2, Users, X } from '@/lib/icons';
import type { HomebrewClass } from '@/lib/schemas/class-selection';

// =====================================================================================
// ClassItemsSection
// =====================================================================================

interface ClassItemsSectionProps {
  items: string[];
  onAddItem: () => void;
  onUpdateItem: (index: number, value: string) => void;
  onRemoveItem: (index: number) => void;
}

export function ClassItemsSection({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: ClassItemsSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="text-muted-foreground size-4" />
          <Label>Class Items</Label>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="mr-1 size-3" />
          Add Item
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="group flex items-center gap-1 pr-1"
            >
              <Input
                className="h-5 w-24 border-none bg-transparent p-0 text-xs focus-visible:ring-0"
                value={item}
                placeholder="Item name..."
                onChange={e => onUpdateItem(i, e.target.value)}
              />
              <button
                type="button"
                className="hover:bg-destructive/20 rounded p-0.5"
                onClick={() => onRemoveItem(i)}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================================
// BackgroundQuestionsSection
// =====================================================================================

interface BackgroundQuestionsSectionProps {
  questions: string[];
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, value: string) => void;
  onRemoveQuestion: (index: number) => void;
}

export function BackgroundQuestionsSection({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
}: BackgroundQuestionsSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Background Questions</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddQuestion}
        >
          <Plus className="mr-1 size-3" />
          Add Question
        </Button>
      </div>
      {questions.map((q, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={q}
            placeholder="Enter a background question..."
            onChange={e => onUpdateQuestion(i, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveQuestion(i)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// =====================================================================================
// ConnectionsSection
// =====================================================================================

interface ConnectionsSectionProps {
  connections: string[];
  onAddConnection: () => void;
  onUpdateConnection: (index: number, value: string) => void;
  onRemoveConnection: (index: number) => void;
}

export function ConnectionsSection({
  connections,
  onAddConnection,
  onUpdateConnection,
  onRemoveConnection,
}: ConnectionsSectionProps) {
  return (
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
          onClick={onAddConnection}
        >
          <Plus className="mr-1 size-3" />
          Add Connection
        </Button>
      </div>
      {connections.map((c, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={c}
            placeholder="Enter a connection option..."
            onChange={e => onUpdateConnection(i, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveConnection(i)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// =====================================================================================
// Helper functions for handlers
// =====================================================================================

export function createClassItemsHandlers(
  draft: HomebrewClass,
  updateDraft: (updates: Partial<HomebrewClass>) => void
) {
  return {
    onAddItem: () =>
      updateDraft({
        classItems: [...(draft.classItems ?? []), ''],
      }),
    onUpdateItem: (index: number, value: string) => {
      const newItems = [...(draft.classItems ?? [])];
      newItems[index] = value;
      updateDraft({ classItems: newItems });
    },
    onRemoveItem: (index: number) => {
      const newItems = (draft.classItems ?? []).filter(
        (_, idx) => idx !== index
      );
      updateDraft({ classItems: newItems });
    },
  };
}

export function createBackgroundQuestionsHandlers(
  draft: HomebrewClass,
  updateDraft: (updates: Partial<HomebrewClass>) => void
) {
  return {
    onAddQuestion: () =>
      updateDraft({
        backgroundQuestions: [...(draft.backgroundQuestions ?? []), ''],
      }),
    onUpdateQuestion: (index: number, value: string) => {
      const newQuestions = [...(draft.backgroundQuestions ?? [])];
      newQuestions[index] = value;
      updateDraft({ backgroundQuestions: newQuestions });
    },
    onRemoveQuestion: (index: number) => {
      const newQuestions = (draft.backgroundQuestions ?? []).filter(
        (_, idx) => idx !== index
      );
      updateDraft({ backgroundQuestions: newQuestions });
    },
  };
}

export function createConnectionsHandlers(
  draft: HomebrewClass,
  updateDraft: (updates: Partial<HomebrewClass>) => void
) {
  return {
    onAddConnection: () =>
      updateDraft({
        connections: [...(draft.connections ?? []), ''],
      }),
    onUpdateConnection: (index: number, value: string) => {
      const newConnections = [...(draft.connections ?? [])];
      newConnections[index] = value;
      updateDraft({ connections: newConnections });
    },
    onRemoveConnection: (index: number) => {
      const newConnections = (draft.connections ?? []).filter(
        (_, idx) => idx !== index
      );
      updateDraft({ connections: newConnections });
    },
  };
}
