/* eslint-disable max-lines */
// Quest components - EditableQuests and QuestCard are tightly coupled

import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Eye,
  Plus,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  addQuest,
  deleteQuest,
  updateQuest,
} from '@/features/campaigns/campaign-storage';
import type { CampaignQuest } from '@/lib/schemas/campaign';

const QUEST_TYPE_COLORS = {
  main: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
  side: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  personal:
    'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
  faction:
    'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  rumor:
    'bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30',
  hook: 'bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30',
};

const QUEST_STATUS_COLORS = {
  available: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  active: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  completed: 'bg-green-500/20 text-green-700 dark:text-green-400',
  failed: 'bg-red-500/20 text-red-700 dark:text-red-400',
  abandoned: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

const QUEST_PRIORITY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
};

type QuestTextFieldKey =
  | 'title'
  | 'description'
  | 'giver'
  | 'location'
  | 'rewards'
  | 'foreshadowing'
  | 'consequences'
  | 'notes';

type QuestObjective = CampaignQuest['objectives'][number];

interface QuestCardContentProps {
  quest: CampaignQuest;
  isExpanded: boolean;
  showDeleteConfirm: boolean;
  newObjective: string;
  completedCount: number;
  totalCount: number;
  onToggle: () => void;
  onOpenDelete: () => void;
  onCloseDelete: (open: boolean) => void;
  onConfirmDelete: () => void;
  onTextChange: (field: QuestTextFieldKey, value: string) => void;
  onTypeChange: (value: CampaignQuest['type']) => void;
  onStatusChange: (value: CampaignQuest['status']) => void;
  onPriorityChange: (value: CampaignQuest['priority']) => void;
  onBlur: () => void;
  onNewObjectiveChange: (value: string) => void;
  onAddObjective: () => void;
  onToggleObjective: (id: string) => void;
  onRemoveObjective: (id: string) => void;
}

function addQuestObjective(
  objectives: QuestObjective[],
  input: string
): { objectives: QuestObjective[]; added: boolean } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { objectives, added: false };
  }
  return {
    objectives: [
      ...objectives,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ],
    added: true,
  };
}

function toggleQuestObjective(
  objectives: QuestObjective[],
  id: string
): QuestObjective[] {
  return objectives.map(objective =>
    objective.id === id
      ? { ...objective, completed: !objective.completed }
      : objective
  );
}

function removeQuestObjective(
  objectives: QuestObjective[],
  id: string
): QuestObjective[] {
  return objectives.filter(objective => objective.id !== id);
}

function getQuestObjectiveCounts(objectives: QuestObjective[]) {
  const completedCount = objectives.filter(
    objective => objective.completed
  ).length;
  return { completedCount, totalCount: objectives.length };
}

interface EditableQuestsProps {
  quests: CampaignQuest[];
  campaignId: string;
  onQuestsChange: () => void;
}

export function EditableQuests({
  quests,
  campaignId,
  onQuestsChange,
}: EditableQuestsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredQuests = quests
    .filter(q => !statusFilter || q.status === statusFilter)
    .filter(q => !typeFilter || q.type === typeFilter);

  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const statusOrder = {
    active: 0,
    available: 1,
    completed: 2,
    failed: 3,
    abandoned: 4,
  };
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleAddQuest = async () => {
    await addQuest(campaignId, {
      title: 'New Quest',
      type: 'side',
      status: 'available',
      description: '',
      objectives: [],
      rewards: '',
      giver: '',
      location: '',
      relatedNpcs: [],
      notes: '',
      foreshadowing: '',
      consequences: '',
      priority: 'medium',
      tags: [],
    });
    onQuestsChange();
  };

  const handleUpdateQuest = async (
    questId: string,
    updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    await updateQuest(campaignId, questId, updates);
    onQuestsChange();
  };

  const handleDeleteQuest = async (questId: string) => {
    await deleteQuest(campaignId, questId);
    onQuestsChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddQuest} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Quest
        </Button>
        <Select
          value={statusFilter ?? 'all'}
          onValueChange={v => setStatusFilter(v === 'all' ? null : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter ?? 'all'}
          onValueChange={v => setTypeFilter(v === 'all' ? null : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="main">Main</SelectItem>
            <SelectItem value="side">Side</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="faction">Faction</SelectItem>
            <SelectItem value="rumor">Rumor</SelectItem>
            <SelectItem value="hook">Hook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedQuests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Target className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground">No quests created yet</p>
            <p className="text-muted-foreground text-sm">
              Add main quests, side quests, and plot hooks
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedQuests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            isExpanded={expandedId === quest.id}
            onToggle={() =>
              setExpandedId(expandedId === quest.id ? null : quest.id)
            }
            onUpdate={updates => handleUpdateQuest(quest.id, updates)}
            onDelete={() => handleDeleteQuest(quest.id)}
          />
        ))
      )}
    </div>
  );
}

interface QuestCardProps {
  quest: CampaignQuest;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}

interface QuestHeaderProps {
  quest: CampaignQuest;
  isExpanded: boolean;
  completedCount: number;
  totalCount: number;
  onOpenDelete: () => void;
}

function QuestHeader({
  quest,
  isExpanded,
  completedCount,
  totalCount,
  onOpenDelete,
}: QuestHeaderProps) {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <Target
                className={`h-5 w-5 ${QUEST_PRIORITY_COLORS[quest.priority]}`}
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{quest.title}</h4>
                  <Badge
                    variant="outline"
                    className={QUEST_STATUS_COLORS[quest.status]}
                  >
                    {quest.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs capitalize">
                  {quest.type} quest
                  {totalCount > 0 &&
                    ` • ${completedCount}/${totalCount} objectives`}
                </p>
              </div>
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </Button>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenDelete}
          className="text-destructive hover:bg-destructive/10 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}

interface QuestDeleteDialogProps {
  questTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

function QuestDeleteDialog({
  questTitle,
  open,
  onOpenChange,
  onConfirmDelete,
}: QuestDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Quest</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{questTitle}"? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface QuestTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function QuestTextField({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
}: QuestTextFieldProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="mt-1"
      />
    </div>
  );
}

interface QuestTextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
  icon?: ReactNode;
}

function QuestTextAreaField({
  label,
  value,
  placeholder,
  rows = 2,
  onChange,
  onBlur,
  icon,
}: QuestTextAreaFieldProps) {
  return (
    <div>
      <Label className="flex items-center gap-1 text-xs">
        {icon}
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        className="mt-1"
      />
    </div>
  );
}

interface QuestObjectivesProps {
  objectives: CampaignQuest['objectives'];
  newObjective: string;
  onNewObjectiveChange: (value: string) => void;
  onAddObjective: () => void;
  onToggleObjective: (id: string) => void;
  onRemoveObjective: (id: string) => void;
}

function QuestObjectives({
  objectives,
  newObjective,
  onNewObjectiveChange,
  onAddObjective,
  onToggleObjective,
  onRemoveObjective,
}: QuestObjectivesProps) {
  return (
    <div>
      <Label className="text-xs">Objectives</Label>
      <div className="mt-1 space-y-2">
        {objectives.map(obj => (
          <div
            key={obj.id}
            className="bg-muted/50 flex items-center gap-2 rounded-md p-2"
          >
            <button
              type="button"
              onClick={() => onToggleObjective(obj.id)}
              className="flex-shrink-0"
            >
              {obj.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="text-muted-foreground h-5 w-5" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${obj.completed ? 'text-muted-foreground line-through' : ''}`}
            >
              {obj.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onRemoveObjective(obj.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newObjective}
            onChange={e => onNewObjectiveChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddObjective();
              }
            }}
            placeholder="Add an objective..."
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={onAddObjective}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuestCard({
  quest,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: QuestCardProps) {
  const [localQuest, setLocalQuest] = useState(quest);
  const [newObjective, setNewObjective] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocalQuest(quest);
  }, [quest]);

  const updateLocalQuest = useCallback(
    (updates: Partial<CampaignQuest>) => {
      setLocalQuest(current => ({ ...current, ...updates }));
      onUpdate(updates);
    },
    [onUpdate]
  );

  const handleBlur = useCallback(() => {
    onUpdate(localQuest);
  }, [localQuest, onUpdate]);

  const handleTextChange = useCallback(
    (field: QuestTextFieldKey, value: string) => {
      updateLocalQuest({ [field]: value } as Partial<CampaignQuest>);
    },
    [updateLocalQuest]
  );

  const handleTypeChange = useCallback(
    (value: CampaignQuest['type']) => {
      updateLocalQuest({ type: value });
    },
    [updateLocalQuest]
  );

  const handleStatusChange = useCallback(
    (value: CampaignQuest['status']) => {
      updateLocalQuest({ status: value });
    },
    [updateLocalQuest]
  );

  const handlePriorityChange = useCallback(
    (value: CampaignQuest['priority']) => {
      updateLocalQuest({ priority: value });
    },
    [updateLocalQuest]
  );

  const addObjective = useCallback(() => {
    const result = addQuestObjective(localQuest.objectives, newObjective);
    if (!result.added) {
      return;
    }
    updateLocalQuest({ objectives: result.objectives });
    setNewObjective('');
  }, [localQuest.objectives, newObjective, updateLocalQuest]);

  const toggleObjective = useCallback(
    (id: string) => {
      updateLocalQuest({
        objectives: toggleQuestObjective(localQuest.objectives, id),
      });
    },
    [localQuest.objectives, updateLocalQuest]
  );

  const removeObjective = useCallback(
    (id: string) => {
      updateLocalQuest({
        objectives: removeQuestObjective(localQuest.objectives, id),
      });
    },
    [localQuest.objectives, updateLocalQuest]
  );

  const { completedCount, totalCount } = getQuestObjectiveCounts(
    localQuest.objectives
  );

  return (
    <QuestCardContent
      quest={localQuest}
      isExpanded={isExpanded}
      showDeleteConfirm={showDeleteConfirm}
      newObjective={newObjective}
      completedCount={completedCount}
      totalCount={totalCount}
      onToggle={onToggle}
      onOpenDelete={() => setShowDeleteConfirm(true)}
      onCloseDelete={setShowDeleteConfirm}
      onConfirmDelete={onDelete}
      onTextChange={handleTextChange}
      onTypeChange={handleTypeChange}
      onStatusChange={handleStatusChange}
      onPriorityChange={handlePriorityChange}
      onBlur={handleBlur}
      onNewObjectiveChange={setNewObjective}
      onAddObjective={addObjective}
      onToggleObjective={toggleObjective}
      onRemoveObjective={removeObjective}
    />
  );
}

function QuestCardContent({
  quest,
  isExpanded,
  showDeleteConfirm,
  newObjective,
  completedCount,
  totalCount,
  onToggle,
  onOpenDelete,
  onCloseDelete,
  onConfirmDelete,
  onTextChange,
  onTypeChange,
  onStatusChange,
  onPriorityChange,
  onBlur,
  onNewObjectiveChange,
  onAddObjective,
  onToggleObjective,
  onRemoveObjective,
}: QuestCardContentProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={`border-l-4 ${QUEST_TYPE_COLORS[quest.type]}`}>
        <QuestHeader
          quest={quest}
          isExpanded={isExpanded}
          completedCount={completedCount}
          totalCount={totalCount}
          onOpenDelete={onOpenDelete}
        />

        <QuestDeleteDialog
          questTitle={quest.title}
          open={showDeleteConfirm}
          onOpenChange={onCloseDelete}
          onConfirmDelete={onConfirmDelete}
        />

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <QuestTextField
                label="Title"
                value={quest.title}
                onChange={value => onTextChange('title', value)}
                onBlur={onBlur}
              />
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={quest.type}
                  onValueChange={value =>
                    onTypeChange(value as CampaignQuest['type'])
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Quest</SelectItem>
                    <SelectItem value="side">Side Quest</SelectItem>
                    <SelectItem value="personal">Personal Quest</SelectItem>
                    <SelectItem value="faction">Faction Quest</SelectItem>
                    <SelectItem value="rumor">Rumor</SelectItem>
                    <SelectItem value="hook">Plot Hook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Status</Label>
                <Select
                  value={quest.status}
                  onValueChange={value =>
                    onStatusChange(value as CampaignQuest['status'])
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="abandoned">Abandoned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select
                  value={quest.priority}
                  onValueChange={value =>
                    onPriorityChange(value as CampaignQuest['priority'])
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <QuestTextAreaField
              label="Description"
              value={quest.description}
              placeholder="What is this quest about?"
              onChange={value => onTextChange('description', value)}
              onBlur={onBlur}
            />

            <QuestObjectives
              objectives={quest.objectives}
              newObjective={newObjective}
              onNewObjectiveChange={onNewObjectiveChange}
              onAddObjective={onAddObjective}
              onToggleObjective={onToggleObjective}
              onRemoveObjective={onRemoveObjective}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <QuestTextField
                label="Quest Giver"
                value={quest.giver}
                placeholder="Who gave this quest?"
                onChange={value => onTextChange('giver', value)}
                onBlur={onBlur}
              />
              <QuestTextField
                label="Location"
                value={quest.location}
                placeholder="Where does it take place?"
                onChange={value => onTextChange('location', value)}
                onBlur={onBlur}
              />
            </div>

            <QuestTextAreaField
              label="Rewards"
              value={quest.rewards}
              placeholder="What do they get for completing this?"
              onChange={value => onTextChange('rewards', value)}
              onBlur={onBlur}
            />

            <QuestTextAreaField
              label="Foreshadowing"
              value={quest.foreshadowing}
              placeholder="Hints to drop before revealing the quest..."
              icon={<Eye className="h-3 w-3" />}
              onChange={value => onTextChange('foreshadowing', value)}
              onBlur={onBlur}
            />

            <QuestTextAreaField
              label="Consequences"
              value={quest.consequences}
              placeholder="What happens if they fail or ignore this?"
              onChange={value => onTextChange('consequences', value)}
              onBlur={onBlur}
            />

            <QuestTextAreaField
              label="GM Notes"
              value={quest.notes}
              placeholder="Additional notes..."
              onChange={value => onTextChange('notes', value)}
              onBlur={onBlur}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
