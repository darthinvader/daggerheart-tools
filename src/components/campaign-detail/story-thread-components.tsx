// Story Thread components - Collapsible list with status badges

import { ChevronDown, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { StoryThread } from '@/lib/schemas/campaign';

import { useStoryThreadEntityHandlers } from './use-story-thread-entity-handlers';

// =====================================================================================
// Constants
// =====================================================================================

const STATUS_CONFIG = {
  seeding: {
    label: 'Seeding',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  developing: {
    label: 'Developing',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  climax: {
    label: 'Climax',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
  resolved: {
    label: 'Resolved',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
} as const;

const STATUS_OPTIONS = [
  { value: 'seeding', label: 'Seeding' },
  { value: 'developing', label: 'Developing' },
  { value: 'climax', label: 'Climax' },
  { value: 'resolved', label: 'Resolved' },
] as const;

// =====================================================================================
// Types
// =====================================================================================

interface EditableStoryThreadsProps {
  storyThreads: StoryThread[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onStoryThreadsChange: () => void;
}

// =====================================================================================
// StoryThreadCard
// =====================================================================================

interface StoryThreadCardProps {
  thread: StoryThread;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    threadId: string,
    updates: Partial<Omit<StoryThread, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  onDelete: (threadId: string) => Promise<void>;
}

function StoryThreadCard({
  thread,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: StoryThreadCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const statusConfig = STATUS_CONFIG[thread.status];

  return (
    <>
      <Card>
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="hover:bg-accent/50 flex w-full items-center gap-3 p-4 text-left transition-colors"
            >
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              />
              <Sparkles className="h-4 w-4 shrink-0 text-purple-500" />
              <span className="min-w-0 flex-1 truncate font-medium">
                {thread.title}
              </span>
              <Badge className={statusConfig.className} variant="outline">
                {statusConfig.label}
              </Badge>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4 border-t pt-4">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor={`thread-title-${thread.id}`}>Title</Label>
                <Input
                  id={`thread-title-${thread.id}`}
                  value={thread.title}
                  onChange={e => onUpdate(thread.id, { title: e.target.value })}
                  placeholder="Story thread title"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={thread.status}
                  onValueChange={v =>
                    onUpdate(thread.id, {
                      status: v as StoryThread['status'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor={`thread-desc-${thread.id}`}>Description</Label>
                <Textarea
                  id={`thread-desc-${thread.id}`}
                  value={thread.description}
                  onChange={e =>
                    onUpdate(thread.id, { description: e.target.value })
                  }
                  placeholder="What this story thread is about..."
                  rows={3}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor={`thread-notes-${thread.id}`}>Notes</Label>
                <Textarea
                  id={`thread-notes-${thread.id}`}
                  value={thread.notes}
                  onChange={e => onUpdate(thread.id, { notes: e.target.value })}
                  placeholder="GM notes..."
                  rows={2}
                />
              </div>

              {/* Delete */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story Thread</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{thread.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(thread.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// =====================================================================================
// Main Component
// =====================================================================================

export function EditableStoryThreads({
  storyThreads,
  campaignId,
  onSaveStart,
  onPendingChange: _onPendingChange,
  onStoryThreadsChange,
}: EditableStoryThreadsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    handleAddStoryThread,
    handleUpdateStoryThread,
    handleDeleteStoryThread,
  } = useStoryThreadEntityHandlers({
    campaignId,
    onSaveStart,
    onStoryThreadsChange,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={handleAddStoryThread} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Story Thread
        </Button>
      </div>

      {storyThreads.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Sparkles className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No story threads yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Track foreshadowing and plot development arcs
            </p>
            <Button onClick={handleAddStoryThread} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Story Thread
            </Button>
          </CardContent>
        </Card>
      ) : (
        storyThreads.map(thread => (
          <StoryThreadCard
            key={thread.id}
            thread={thread}
            isExpanded={expandedId === thread.id}
            onToggle={() =>
              setExpandedId(prev => (prev === thread.id ? null : thread.id))
            }
            onUpdate={handleUpdateStoryThread}
            onDelete={handleDeleteStoryThread}
          />
        ))
      )}
    </div>
  );
}
