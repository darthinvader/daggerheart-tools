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
import { useEffect, useState } from 'react';

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

  const handleBlur = () => {
    onUpdate(localQuest);
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      const newObjectives = [
        ...localQuest.objectives,
        {
          id: crypto.randomUUID(),
          text: newObjective.trim(),
          completed: false,
        },
      ];
      setLocalQuest({ ...localQuest, objectives: newObjectives });
      onUpdate({ objectives: newObjectives });
      setNewObjective('');
    }
  };

  const toggleObjective = (id: string) => {
    const newObjectives = localQuest.objectives.map(obj =>
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    );
    setLocalQuest({ ...localQuest, objectives: newObjectives });
    onUpdate({ objectives: newObjectives });
  };

  const removeObjective = (id: string) => {
    const newObjectives = localQuest.objectives.filter(obj => obj.id !== id);
    setLocalQuest({ ...localQuest, objectives: newObjectives });
    onUpdate({ objectives: newObjectives });
  };

  const completedCount = localQuest.objectives.filter(o => o.completed).length;
  const totalCount = localQuest.objectives.length;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={`border-l-4 ${QUEST_TYPE_COLORS[localQuest.type]}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto flex-1 justify-start p-0"
              >
                <div className="flex items-center gap-3">
                  <Target
                    className={`h-5 w-5 ${QUEST_PRIORITY_COLORS[localQuest.priority]}`}
                  />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{localQuest.title}</h4>
                      <Badge
                        variant="outline"
                        className={QUEST_STATUS_COLORS[localQuest.status]}
                      >
                        {localQuest.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs capitalize">
                      {localQuest.type} quest
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
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Quest</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{localQuest.title}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={localQuest.title}
                  onChange={e =>
                    setLocalQuest({ ...localQuest, title: e.target.value })
                  }
                  onBlur={handleBlur}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={localQuest.type}
                  onValueChange={v => {
                    const newType = v as CampaignQuest['type'];
                    setLocalQuest({ ...localQuest, type: newType });
                    onUpdate({ type: newType });
                  }}
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
                  value={localQuest.status}
                  onValueChange={v => {
                    const newStatus = v as CampaignQuest['status'];
                    setLocalQuest({ ...localQuest, status: newStatus });
                    onUpdate({ status: newStatus });
                  }}
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
                  value={localQuest.priority}
                  onValueChange={v => {
                    const newPriority = v as CampaignQuest['priority'];
                    setLocalQuest({ ...localQuest, priority: newPriority });
                    onUpdate({ priority: newPriority });
                  }}
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

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localQuest.description}
                onChange={e =>
                  setLocalQuest({ ...localQuest, description: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What is this quest about?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Objectives</Label>
              <div className="mt-1 space-y-2">
                {localQuest.objectives.map(obj => (
                  <div
                    key={obj.id}
                    className="bg-muted/50 flex items-center gap-2 rounded-md p-2"
                  >
                    <button
                      type="button"
                      onClick={() => toggleObjective(obj.id)}
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
                      onClick={() => removeObjective(obj.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={e => setNewObjective(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addObjective();
                      }
                    }}
                    placeholder="Add an objective..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addObjective}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Quest Giver</Label>
                <Input
                  value={localQuest.giver}
                  onChange={e =>
                    setLocalQuest({ ...localQuest, giver: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="Who gave this quest?"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Location</Label>
                <Input
                  value={localQuest.location}
                  onChange={e =>
                    setLocalQuest({ ...localQuest, location: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="Where does it take place?"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Rewards</Label>
              <Textarea
                value={localQuest.rewards}
                onChange={e =>
                  setLocalQuest({ ...localQuest, rewards: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What do they get for completing this?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-1 text-xs">
                <Eye className="h-3 w-3" />
                Foreshadowing
              </Label>
              <Textarea
                value={localQuest.foreshadowing}
                onChange={e =>
                  setLocalQuest({
                    ...localQuest,
                    foreshadowing: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Hints to drop before revealing the quest..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Consequences</Label>
              <Textarea
                value={localQuest.consequences}
                onChange={e =>
                  setLocalQuest({ ...localQuest, consequences: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What happens if they fail or ignore this?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">GM Notes</Label>
              <Textarea
                value={localQuest.notes}
                onChange={e =>
                  setLocalQuest({ ...localQuest, notes: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Additional notes..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
