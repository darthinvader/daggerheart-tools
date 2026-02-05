import { Check, MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  generateSessionZeroItemId,
  type SessionZeroQuestionAnswer,
} from '@/lib/schemas';
import { cn } from '@/lib/utils';

// =====================================================================================
// Types
// =====================================================================================

export type QuestionCategory =
  | 'character'
  | 'world'
  | 'relationships'
  | 'themes'
  | 'safety'
  | 'logistics'
  | 'custom';

export interface SessionZeroQAProps {
  /** The list of questions and answers */
  questions: SessionZeroQuestionAnswer[];
  /** Callback when questions change */
  onChange: (questions: SessionZeroQuestionAnswer[]) => void;
  /** Optional class name for the container */
  className?: string;
  /** Whether the component is read-only */
  readOnly?: boolean;
}

// =====================================================================================
// Constants
// =====================================================================================

const CATEGORY_CONFIG: Record<
  QuestionCategory,
  { label: string; color: string }
> = {
  character: { label: 'Character', color: 'bg-blue-500/10 text-blue-600' },
  world: { label: 'World', color: 'bg-green-500/10 text-green-600' },
  relationships: {
    label: 'Relationships',
    color: 'bg-purple-500/10 text-purple-600',
  },
  themes: { label: 'Themes', color: 'bg-amber-500/10 text-amber-600' },
  safety: { label: 'Safety', color: 'bg-red-500/10 text-red-600' },
  logistics: { label: 'Logistics', color: 'bg-slate-500/10 text-slate-600' },
  custom: { label: 'Custom', color: 'bg-gray-500/10 text-gray-600' },
};

const PRESET_QUESTIONS: Omit<SessionZeroQuestionAnswer, 'id'>[] = [
  // Character questions
  {
    question: 'What is your character most afraid of?',
    category: 'character',
    answer: '',
  },
  {
    question: 'What does your character want more than anything?',
    category: 'character',
    answer: '',
  },
  {
    question: 'What is a secret your character is hiding?',
    category: 'character',
    answer: '',
  },
  {
    question: 'What would your character sacrifice everything for?',
    category: 'character',
    answer: '',
  },

  // World questions
  {
    question: 'What is a place in this world that feels like home to you?',
    category: 'world',
    answer: '',
  },
  {
    question:
      'Name one faction, organization, or group your character has a connection to.',
    category: 'world',
    answer: '',
  },
  {
    question: 'What is something unique about the magic or technology here?',
    category: 'world',
    answer: '',
  },

  // Relationship questions
  {
    question: 'Which party member does your character trust the most? Why?',
    category: 'relationships',
    answer: '',
  },
  {
    question:
      'Who from your past might show up during the campaign? Ally or enemy?',
    category: 'relationships',
    answer: '',
  },
  {
    question:
      'What does your character think of the person sitting to their left?',
    category: 'relationships',
    answer: '',
  },

  // Theme questions
  {
    question: 'What themes are you most excited to explore in this campaign?',
    category: 'themes',
    answer: '',
  },
  {
    question: 'What kind of tone do you want for your personal story arc?',
    category: 'themes',
    answer: '',
  },
  {
    question: 'Are there any genres or story elements you want to see?',
    category: 'themes',
    answer: '',
  },

  // Safety questions
  {
    question: 'Are there any topics you want to avoid in this campaign?',
    category: 'safety',
    answer: '',
  },
  {
    question:
      'How do you prefer to handle romantic or intimate content if it arises?',
    category: 'safety',
    answer: '',
  },
  {
    question:
      'What level of violence and consequences are you comfortable with?',
    category: 'safety',
    answer: '',
  },

  // Logistics questions
  {
    question: 'What time commitment works best for you?',
    category: 'logistics',
    answer: '',
  },
  {
    question: 'How do you prefer to communicate between sessions?',
    category: 'logistics',
    answer: '',
  },
  {
    question: 'What happens if a player needs to miss a session?',
    category: 'logistics',
    answer: '',
  },
];

// =====================================================================================
// Helper Components
// =====================================================================================

interface QuestionCardProps {
  question: SessionZeroQuestionAnswer;
  onUpdate: (updated: SessionZeroQuestionAnswer) => void;
  onDelete: () => void;
  readOnly?: boolean;
}

function QuestionCard({
  question,
  onUpdate,
  onDelete,
  readOnly,
}: QuestionCardProps) {
  const textareaId = useId();
  const hasAnswer = question.answer.trim().length > 0;
  const category = question.category ?? 'custom';
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <Card
      className={cn(
        'transition-all',
        hasAnswer && 'border-green-500/30 bg-green-500/5'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn('text-xs', categoryConfig.color)}
              >
                {categoryConfig.label}
              </Badge>
              {hasAnswer && (
                <Check
                  className="size-4 text-green-600"
                  aria-label="Answered"
                />
              )}
            </div>
            <CardTitle className="text-base leading-snug font-medium">
              {question.question}
            </CardTitle>
            {question.answeredBy && (
              <CardDescription className="text-xs">
                Answered by {question.answeredBy}
              </CardDescription>
            )}
          </div>
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              aria-label="Delete question"
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {readOnly ? (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">
            {question.answer || 'No answer provided'}
          </p>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor={textareaId} className="sr-only">
              Your answer
            </Label>
            <Textarea
              id={textareaId}
              value={question.answer}
              onChange={e => onUpdate({ ...question, answer: e.target.value })}
              placeholder="Enter your answer..."
              className="min-h-20 resize-none"
              aria-label={`Answer for: ${question.question}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (question: SessionZeroQuestionAnswer) => void;
  existingQuestions: string[];
}

function AddQuestionDialog({
  open,
  onOpenChange,
  onAdd,
  existingQuestions,
}: AddQuestionDialogProps) {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCategory, setCustomCategory] =
    useState<QuestionCategory>('custom');
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(
    new Set()
  );

  // Filter out already existing questions from presets
  const availablePresets = useMemo(
    () => PRESET_QUESTIONS.filter(p => !existingQuestions.includes(p.question)),
    [existingQuestions]
  );

  const handleAddCustom = () => {
    if (!customQuestion.trim()) return;
    onAdd({
      id: generateSessionZeroItemId('qa'),
      question: customQuestion.trim(),
      category: customCategory,
      answer: '',
      askedAt: new Date().toISOString(),
    });
    setCustomQuestion('');
    onOpenChange(false);
  };

  const handleAddPresets = () => {
    if (selectedPresets.size === 0) return;
    selectedPresets.forEach(question => {
      const preset = PRESET_QUESTIONS.find(p => p.question === question);
      if (preset) {
        onAdd({
          id: generateSessionZeroItemId('qa'),
          question: preset.question,
          category: preset.category,
          answer: '',
          askedAt: new Date().toISOString(),
        });
      }
    });
    setSelectedPresets(new Set());
    onOpenChange(false);
  };

  const togglePreset = (question: string) => {
    const newSet = new Set(selectedPresets);
    if (newSet.has(question)) {
      newSet.delete(question);
    } else {
      newSet.add(question);
    }
    setSelectedPresets(newSet);
  };

  const handleClose = () => {
    setSelectedPresets(new Set());
    setCustomQuestion('');
    onOpenChange(false);
  };

  const questionId = useId();
  const categoryId = useId();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Questions</DialogTitle>
        </DialogHeader>

        <Tabs
          value={mode}
          onValueChange={v => setMode(v as 'preset' | 'custom')}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Questions</TabsTrigger>
            <TabsTrigger value="custom">Custom Question</TabsTrigger>
          </TabsList>

          <TabsContent
            value="preset"
            className="mt-4 flex min-h-0 flex-1 flex-col"
          >
            {availablePresets.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                All preset questions have been added
              </p>
            ) : (
              <div
                className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-md border p-4"
                role="group"
                aria-label="Preset questions"
              >
                {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
                  const questionsInCategory = availablePresets.filter(
                    p => p.category === category
                  );
                  if (questionsInCategory.length === 0) return null;
                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="text-muted-foreground text-sm font-medium">
                        {config.label}
                      </h4>
                      {questionsInCategory.map(preset => (
                        <button
                          key={preset.question}
                          type="button"
                          onClick={() => togglePreset(preset.question)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm transition-colors',
                            selectedPresets.has(preset.question)
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          )}
                          aria-pressed={selectedPresets.has(preset.question)}
                        >
                          <div
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center rounded border',
                              selectedPresets.has(preset.question)
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-input'
                            )}
                          >
                            {selectedPresets.has(preset.question) && (
                              <Check className="size-3" />
                            )}
                          </div>
                          <span>{preset.question}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={questionId} required>
                Question
              </Label>
              <Textarea
                id={questionId}
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                placeholder="Enter your question..."
                className="min-h-20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={categoryId}>Category</Label>
              <Select
                value={customCategory}
                onValueChange={v => setCustomCategory(v as QuestionCategory)}
              >
                <SelectTrigger id={categoryId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 gap-2 border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {mode === 'preset' ? (
            <Button
              onClick={handleAddPresets}
              disabled={selectedPresets.size === 0}
            >
              Add {selectedPresets.size > 0 && `(${selectedPresets.size})`}{' '}
              Selected
            </Button>
          ) : (
            <Button onClick={handleAddCustom} disabled={!customQuestion.trim()}>
              Add Question
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================================
// Main Component
// =====================================================================================

export function SessionZeroQA({
  questions,
  onChange,
  className,
  readOnly = false,
}: SessionZeroQAProps) {
  const safeQuestions = questions ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<
    QuestionCategory | 'all'
  >('all');

  const existingQuestionTexts = useMemo(
    () => safeQuestions.map(q => q.question),
    [safeQuestions]
  );

  // Group questions by category
  const groupedQuestions = useMemo(() => {
    const groups: Record<QuestionCategory, SessionZeroQuestionAnswer[]> = {
      character: [],
      world: [],
      relationships: [],
      themes: [],
      safety: [],
      logistics: [],
      custom: [],
    };
    safeQuestions.forEach(q => {
      const category = q.category ?? 'custom';
      groups[category].push(q);
    });
    return groups;
  }, [safeQuestions]);

  // Stats
  const stats = useMemo(() => {
    const total = safeQuestions.length;
    const answered = safeQuestions.filter(
      q => q.answer.trim().length > 0
    ).length;
    return { total, answered };
  }, [safeQuestions]);

  const handleUpdate = (updated: SessionZeroQuestionAnswer) => {
    onChange(safeQuestions.map(q => (q.id === updated.id ? updated : q)));
  };

  const handleDelete = (id: string) => {
    onChange(safeQuestions.filter(q => q.id !== id));
  };

  const handleAdd = (question: SessionZeroQuestionAnswer) => {
    onChange([...safeQuestions, question]);
  };

  // Filter questions based on selected category
  const filteredQuestions = useMemo(() => {
    if (categoryFilter === 'all') return safeQuestions;
    return groupedQuestions[categoryFilter];
  }, [categoryFilter, groupedQuestions, safeQuestions]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<QuestionCategory | 'all', number> = {
      all: safeQuestions.length,
      character: groupedQuestions.character.length,
      world: groupedQuestions.world.length,
      relationships: groupedQuestions.relationships.length,
      themes: groupedQuestions.themes.length,
      safety: groupedQuestions.safety.length,
      logistics: groupedQuestions.logistics.length,
      custom: groupedQuestions.custom.length,
    };
    return counts;
  }, [groupedQuestions, safeQuestions.length]);

  return (
    <section
      className={cn(
        'bg-card flex h-full flex-col rounded-xl border shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-semibold">Session Zero Questions</h3>
            <p className="text-muted-foreground text-sm">
              {stats.answered} of {stats.total} answered
            </p>
          </div>
        </div>
        {!readOnly && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 size-4" aria-hidden="true" />
            Add Questions
          </Button>
        )}
      </div>

      {/* Category filter */}
      {safeQuestions.length > 0 && (
        <div className="border-b px-4 py-3 sm:px-6">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setCategoryFilter('all')}
              aria-pressed={categoryFilter === 'all'}
            >
              All ({categoryCounts.all})
            </Button>
            {Object.entries(CATEGORY_CONFIG).map(([category, { label }]) => {
              const count = categoryCounts[category as QuestionCategory];
              if (count === 0) return null;
              return (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size="xs"
                  onClick={() =>
                    setCategoryFilter(category as QuestionCategory)
                  }
                  aria-pressed={categoryFilter === category}
                >
                  {label} ({count})
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {safeQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <MessageSquare
              className="text-muted-foreground/50 mb-3 size-10"
              aria-hidden="true"
            />
            <h4 className="mb-1 font-medium">No questions yet</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Add questions to help prepare for your session zero
            </p>
            {!readOnly && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-1 size-4" aria-hidden="true" />
                Add Questions
              </Button>
            )}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <X
              className="text-muted-foreground/50 mb-3 size-10"
              aria-hidden="true"
            />
            <h4 className="mb-1 font-medium">No questions in this category</h4>
            <p className="text-muted-foreground text-sm">
              Try selecting a different category or add new questions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onUpdate={handleUpdate}
                onDelete={() => handleDelete(question.id)}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Question Dialog */}
      <AddQuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAdd}
        existingQuestions={existingQuestionTexts}
      />
    </section>
  );
}
