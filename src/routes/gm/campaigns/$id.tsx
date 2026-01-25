import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Copy,
  Dice5,
  Eye,
  Flag,
  HelpCircle,
  Lightbulb,
  Map,
  MapPin,
  MessageSquare,
  Mountain,
  Plus,
  Save,
  Scroll,
  Sparkles,
  Target,
  Trash2,
  TreePine,
  User,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  addLocation,
  addNPC,
  addQuest,
  addSession,
  deleteLocation,
  deleteNPC,
  deleteQuest,
  deleteSession,
  getCampaign,
  updateCampaign,
  updateCampaignFrame,
  updateLocation,
  updateNPC,
  updateQuest,
  updateSession,
} from '@/features/campaigns/campaign-storage';
import {
  CAMPAIGN_THEME_OPTIONS,
  CAMPAIGN_TONE_OPTIONS,
} from '@/lib/data/campaign-frames';
import type {
  Campaign,
  CampaignDistinction,
  CampaignFrame,
  CampaignLocation,
  CampaignMechanic,
  CampaignNPC,
  CampaignPrinciple,
  CampaignQuest,
  SessionNote,
  SessionZeroQuestion,
} from '@/lib/schemas/campaign';

const validTabs = [
  'overview',
  'world',
  'mechanics',
  'sessions',
  'characters',
  'locations',
  'quests',
  'session-zero',
  'gm-tools',
  'players',
] as const;

type TabValue = (typeof validTabs)[number];

export const Route = createFileRoute('/gm/campaigns/$id')({
  component: CampaignDetailPage,
  validateSearch: (search: Record<string, unknown>): { tab: TabValue } => {
    const tab = search.tab as string;
    if (tab && validTabs.includes(tab as TabValue)) {
      return { tab: tab as TabValue };
    }
    return { tab: 'overview' };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Tag Input Component
// ─────────────────────────────────────────────────────────────────────────────

function TagInput({
  tags,
  onChange,
  suggestions,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: readonly string[];
  placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions =
    suggestions?.filter(
      s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    ) ?? [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-muted ml-1 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder={placeholder ?? 'Type and press Enter to add'}
          className="h-9"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="bg-popover absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border shadow-md">
            {filteredSuggestions.slice(0, 8).map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className="hover:bg-muted w-full px-3 py-2 text-left text-sm"
                onMouseDown={() => addTag(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Editable List Components
// ─────────────────────────────────────────────────────────────────────────────

function EditableDistinctions({
  distinctions,
  onChange,
}: {
  distinctions: CampaignDistinction[];
  onChange: (distinctions: CampaignDistinction[]) => void;
}) {
  const addDistinction = () => {
    onChange([
      ...distinctions,
      {
        id: `distinction-${Date.now()}`,
        title: 'New Distinction',
        description: '',
      },
    ]);
  };

  const updateDistinction = (
    id: string,
    updates: Partial<CampaignDistinction>
  ) => {
    onChange(distinctions.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const removeDistinction = (id: string) => {
    onChange(distinctions.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-3">
      {distinctions.map(distinction => (
        <Collapsible
          key={distinction.id}
          defaultOpen={!distinction.description}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
                    <span className="font-medium">{distinction.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={e => {
                      e.stopPropagation();
                      removeDistinction(distinction.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={distinction.title}
                    onChange={e =>
                      updateDistinction(distinction.id, {
                        title: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={distinction.description}
                    onChange={e =>
                      updateDistinction(distinction.id, {
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
      <Button variant="outline" onClick={addDistinction} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Distinction
      </Button>
    </div>
  );
}

function EditableMechanics({
  mechanics,
  onChange,
}: {
  mechanics: CampaignMechanic[];
  onChange: (mechanics: CampaignMechanic[]) => void;
}) {
  const addMechanic = () => {
    onChange([
      ...mechanics,
      {
        id: `mechanic-${Date.now()}`,
        name: 'New Mechanic',
        description: '',
        rules: [],
      },
    ]);
  };

  const updateMechanic = (id: string, updates: Partial<CampaignMechanic>) => {
    onChange(mechanics.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const removeMechanic = (id: string) => {
    onChange(mechanics.filter(m => m.id !== id));
  };

  const addRule = (mechanicId: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      updateMechanic(mechanicId, { rules: [...mechanic.rules, ''] });
    }
  };

  const updateRule = (mechanicId: string, ruleIndex: number, value: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      const newRules = [...mechanic.rules];
      newRules[ruleIndex] = value;
      updateMechanic(mechanicId, { rules: newRules });
    }
  };

  const removeRule = (mechanicId: string, ruleIndex: number) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      updateMechanic(mechanicId, {
        rules: mechanic.rules.filter((_, i) => i !== ruleIndex),
      });
    }
  };

  return (
    <div className="space-y-3">
      {mechanics.map(mechanic => (
        <Collapsible key={mechanic.id} defaultOpen={!mechanic.description}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <span className="font-medium">{mechanic.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={e => {
                      e.stopPropagation();
                      removeMechanic(mechanic.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={mechanic.name}
                    onChange={e =>
                      updateMechanic(mechanic.id, { name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={mechanic.description}
                    onChange={e =>
                      updateMechanic(mechanic.id, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Rules</Label>
                  <div className="mt-1 space-y-2">
                    {mechanic.rules.map((rule, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={rule}
                          onChange={e =>
                            updateRule(mechanic.id, index, e.target.value)
                          }
                          placeholder={`Rule ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => removeRule(mechanic.id, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addRule(mechanic.id)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Rule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
      <Button variant="outline" onClick={addMechanic} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Mechanic
      </Button>
    </div>
  );
}

function EditableQuestions({
  questions,
  onChange,
}: {
  questions: SessionZeroQuestion[];
  onChange: (questions: SessionZeroQuestion[]) => void;
}) {
  const addQuestion = () => {
    onChange([
      ...questions,
      {
        id: `question-${Date.now()}`,
        question: '',
        category: 'custom',
      },
    ]);
  };

  const updateQuestion = (
    id: string,
    updates: Partial<SessionZeroQuestion>
  ) => {
    onChange(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div key={question.id} className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={question.question}
              onChange={e =>
                updateQuestion(question.id, { question: e.target.value })
              }
              placeholder={`Question ${index + 1}`}
              rows={2}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => removeQuestion(question.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addQuestion} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}

function EditablePrinciples({
  principles,
  onChange,
  target,
}: {
  principles: CampaignPrinciple[];
  onChange: (principles: CampaignPrinciple[]) => void;
  target: 'player' | 'gm';
}) {
  const addPrinciple = () => {
    onChange([
      ...principles,
      {
        id: `principle-${Date.now()}`,
        title: 'New Principle',
        description: '',
        target,
      },
    ]);
  };

  const updatePrinciple = (id: string, updates: Partial<CampaignPrinciple>) => {
    onChange(principles.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removePrinciple = (id: string) => {
    onChange(principles.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-3">
      {principles.map(principle => (
        <Card key={principle.id}>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={principle.title}
                  onChange={e =>
                    updatePrinciple(principle.id, { title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => removePrinciple(principle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={principle.description}
                onChange={e =>
                  updatePrinciple(principle.id, { description: e.target.value })
                }
                rows={2}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addPrinciple} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add {target === 'player' ? 'Player' : 'GM'} Principle
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Session Notes Components
// ─────────────────────────────────────────────────────────────────────────────

function EditableSessions({
  sessions,
  npcs,
  campaignId,
  onSessionsChange,
}: {
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  campaignId: string;
  onSessionsChange: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedSessions = [...sessions].sort(
    (a, b) => b.sessionNumber - a.sessionNumber
  );

  const nextSessionNumber =
    sessions.length > 0
      ? Math.max(...sessions.map(s => s.sessionNumber)) + 1
      : 1;

  const handleAddSession = async () => {
    await addSession(campaignId, {
      sessionNumber: nextSessionNumber,
      title: `Session ${nextSessionNumber}`,
      date: new Date().toISOString().split('T')[0],
      summary: '',
      highlights: [],
      playerNotes: [],
      npcsInvolved: [],
      locations: [],
      questProgress: '',
    });
    onSessionsChange();
  };

  const handleUpdateSession = async (
    sessionId: string,
    updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    await updateSession(campaignId, sessionId, updates);
    onSessionsChange();
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(campaignId, sessionId);
    onSessionsChange();
  };

  return (
    <div className="space-y-4">
      {/* Add Session Button */}
      <Button onClick={handleAddSession} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Session {nextSessionNumber}
      </Button>

      {/* Session List */}
      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Scroll className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground">No sessions recorded yet</p>
            <p className="text-muted-foreground text-sm">
              Start tracking your campaign by adding your first session
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedSessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            npcs={npcs}
            isExpanded={expandedId === session.id}
            onToggle={() =>
              setExpandedId(expandedId === session.id ? null : session.id)
            }
            onUpdate={updates => handleUpdateSession(session.id, updates)}
            onDelete={() => handleDeleteSession(session.id)}
          />
        ))
      )}
    </div>
  );
}

function SessionCard({
  session,
  npcs,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  session: SessionNote;
  npcs: CampaignNPC[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}) {
  const [localSession, setLocalSession] = useState(session);
  const [highlightInput, setHighlightInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const handleBlur = () => {
    if (
      localSession.title !== session.title ||
      localSession.summary !== session.summary ||
      localSession.date !== session.date ||
      localSession.questProgress !== session.questProgress
    ) {
      onUpdate(localSession);
    }
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      const newHighlights = [...localSession.highlights, highlightInput.trim()];
      setLocalSession({ ...localSession, highlights: newHighlights });
      onUpdate({ highlights: newHighlights });
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    const newHighlights = localSession.highlights.filter((_, i) => i !== index);
    setLocalSession({ ...localSession, highlights: newHighlights });
    onUpdate({ highlights: newHighlights });
  };

  const addLocation = () => {
    if (locationInput.trim()) {
      const newLocations = [...localSession.locations, locationInput.trim()];
      setLocalSession({ ...localSession, locations: newLocations });
      onUpdate({ locations: newLocations });
      setLocationInput('');
    }
  };

  const removeLocation = (index: number) => {
    const newLocations = localSession.locations.filter((_, i) => i !== index);
    setLocalSession({ ...localSession, locations: newLocations });
    onUpdate({ locations: newLocations });
  };

  const toggleNpcInvolved = (npcId: string) => {
    const newNpcs = localSession.npcsInvolved.includes(npcId)
      ? localSession.npcsInvolved.filter(id => id !== npcId)
      : [...localSession.npcsInvolved, npcId];
    setLocalSession({ ...localSession, npcsInvolved: newNpcs });
    onUpdate({ npcsInvolved: newNpcs });
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{session.sessionNumber}</Badge>
                    <span className="font-medium">{session.title}</span>
                  </div>
                  {session.date && (
                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {session.date}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Session Title</Label>
                <Input
                  value={localSession.title}
                  onChange={e =>
                    setLocalSession({ ...localSession, title: e.target.value })
                  }
                  onBlur={handleBlur}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Date Played</Label>
                <Input
                  type="date"
                  value={localSession.date ?? ''}
                  onChange={e => {
                    setLocalSession({ ...localSession, date: e.target.value });
                    onUpdate({ date: e.target.value });
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <Label className="text-xs">Session Summary</Label>
              <Textarea
                value={localSession.summary}
                onChange={e =>
                  setLocalSession({ ...localSession, summary: e.target.value })
                }
                onBlur={handleBlur}
                rows={4}
                placeholder="What happened during this session..."
                className="mt-1"
              />
            </div>

            {/* Highlights */}
            <div>
              <Label className="text-xs">Key Highlights</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localSession.highlights.map((highlight, i) => (
                    <Badge key={i} variant="outline" className="gap-1 pr-1">
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                    placeholder="Add a highlight..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addHighlight}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <Label className="text-xs">Locations Visited</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localSession.locations.map((location, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                      <Map className="h-3 w-3" />
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(i)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                    placeholder="Add a location..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addLocation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* NPCs Involved */}
            {npcs.length > 0 && (
              <div>
                <Label className="text-xs">NPCs Involved</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {npcs.map(npc => (
                    <Badge
                      key={npc.id}
                      variant={
                        localSession.npcsInvolved.includes(npc.id)
                          ? 'default'
                          : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleNpcInvolved(npc.id)}
                    >
                      <User className="mr-1 h-3 w-3" />
                      {npc.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quest Progress */}
            <div>
              <Label className="text-xs">Quest/Story Progress</Label>
              <Textarea
                value={localSession.questProgress}
                onChange={e =>
                  setLocalSession({
                    ...localSession,
                    questProgress: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Notes on story or quest advancement..."
                className="mt-1"
              />
            </div>

            {/* Player Notes */}
            {localSession.playerNotes.length > 0 && (
              <div>
                <Label className="text-xs">Player Notes</Label>
                <div className="mt-1 space-y-2">
                  {localSession.playerNotes.map((pn, i) => (
                    <Card key={i} className="bg-muted/50">
                      <CardContent className="py-2">
                        <div className="text-muted-foreground text-xs">
                          {pn.playerName}
                        </div>
                        <p className="text-sm">{pn.note}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NPC/Character Components
// ─────────────────────────────────────────────────────────────────────────────

const NPC_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'deceased', label: 'Deceased' },
  { value: 'missing', label: 'Missing' },
  { value: 'retired', label: 'Retired' },
] as const;

function EditableNPCs({
  npcs,
  campaignId,
  onNPCsChange,
}: {
  npcs: CampaignNPC[];
  campaignId: string;
  onNPCsChange: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = [...new Set(npcs.flatMap(npc => npc.tags))].sort();

  const filteredNPCs = tagFilter
    ? npcs.filter(npc => npc.tags.includes(tagFilter))
    : npcs;

  const sortedNPCs = [...filteredNPCs].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddNPC = async () => {
    await addNPC(campaignId, {
      name: 'New Character',
      title: '',
      description: '',
      personality: '',
      motivation: '',
      secrets: '',
      connections: [],
      locations: [],
      status: 'active',
      faction: '',
      notes: '',
      sessionAppearances: [],
      tags: [],
    });
    onNPCsChange();
  };

  const handleUpdateNPC = async (
    npcId: string,
    updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    await updateNPC(campaignId, npcId, updates);
    onNPCsChange();
  };

  const handleDeleteNPC = async (npcId: string) => {
    await deleteNPC(campaignId, npcId);
    onNPCsChange();
  };

  return (
    <div className="space-y-4">
      {/* Add NPC Button & Filter */}
      <div className="flex items-center gap-2">
        <Button onClick={handleAddNPC} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Character
        </Button>
        {allTags.length > 0 && (
          <Select
            value={tagFilter ?? 'all'}
            onValueChange={v => setTagFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* NPC List */}
      {sortedNPCs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <User className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground">No characters created yet</p>
            <p className="text-muted-foreground text-sm">
              Add NPCs, villains, and allies to track in your campaign
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedNPCs.map(npc => (
          <NPCCard
            key={npc.id}
            npc={npc}
            allNPCs={npcs}
            isExpanded={expandedId === npc.id}
            onToggle={() =>
              setExpandedId(expandedId === npc.id ? null : npc.id)
            }
            onUpdate={updates => handleUpdateNPC(npc.id, updates)}
            onDelete={() => handleDeleteNPC(npc.id)}
          />
        ))
      )}
    </div>
  );
}

function NPCCard({
  npc,
  allNPCs: _allNPCs, // Reserved for future connection features
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  npc: CampaignNPC;
  allNPCs: CampaignNPC[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}) {
  const [localNPC, setLocalNPC] = useState(npc);
  const [tagInput, setTagInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocalNPC(npc);
  }, [npc]);

  const handleBlur = () => {
    onUpdate(localNPC);
  };

  const addTag = () => {
    if (tagInput.trim() && !localNPC.tags.includes(tagInput.trim())) {
      const newTags = [...localNPC.tags, tagInput.trim()];
      setLocalNPC({ ...localNPC, tags: newTags });
      onUpdate({ tags: newTags });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = localNPC.tags.filter(t => t !== tag);
    setLocalNPC({ ...localNPC, tags: newTags });
    onUpdate({ tags: newTags });
  };

  const addLocation = () => {
    if (
      locationInput.trim() &&
      !localNPC.locations.includes(locationInput.trim())
    ) {
      const newLocations = [...localNPC.locations, locationInput.trim()];
      setLocalNPC({ ...localNPC, locations: newLocations });
      onUpdate({ locations: newLocations });
      setLocationInput('');
    }
  };

  const removeLocation = (location: string) => {
    const newLocations = localNPC.locations.filter(l => l !== location);
    setLocalNPC({ ...localNPC, locations: newLocations });
    onUpdate({ locations: newLocations });
  };

  const statusColor = {
    active: 'bg-green-500/20 text-green-700 dark:text-green-400',
    deceased: 'bg-red-500/20 text-red-700 dark:text-red-400',
    missing: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    retired: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{npc.name}</span>
                    {npc.title && (
                      <span className="text-muted-foreground text-sm">
                        — {npc.title}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className={statusColor[npc.status]}>
                      {npc.status}
                    </Badge>
                    {npc.faction && (
                      <span className="text-muted-foreground text-xs">
                        {npc.faction}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={e => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Character</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{npc.name}"? This action cannot
                be undone.
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
          <CardContent className="space-y-4 pt-0">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={localNPC.name}
                  onChange={e =>
                    setLocalNPC({ ...localNPC, name: e.target.value })
                  }
                  onBlur={handleBlur}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Title / Role</Label>
                <Input
                  value={localNPC.title}
                  onChange={e =>
                    setLocalNPC({ ...localNPC, title: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="The Merchant Prince, Village Elder..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Status</Label>
                <Select
                  value={localNPC.status}
                  onValueChange={v => {
                    const newStatus = v as CampaignNPC['status'];
                    setLocalNPC({ ...localNPC, status: newStatus });
                    onUpdate({ status: newStatus });
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NPC_STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Faction / Group</Label>
                <Input
                  value={localNPC.faction}
                  onChange={e =>
                    setLocalNPC({ ...localNPC, faction: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="Guild, kingdom, organization..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localNPC.description}
                onChange={e =>
                  setLocalNPC({ ...localNPC, description: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Physical appearance, mannerisms..."
                className="mt-1"
              />
            </div>

            {/* Personality */}
            <div>
              <Label className="text-xs">Personality</Label>
              <Textarea
                value={localNPC.personality}
                onChange={e =>
                  setLocalNPC({ ...localNPC, personality: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="How do they act? What quirks do they have?"
                className="mt-1"
              />
            </div>

            {/* Motivation */}
            <div>
              <Label className="text-xs">Motivation</Label>
              <Textarea
                value={localNPC.motivation}
                onChange={e =>
                  setLocalNPC({ ...localNPC, motivation: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What drives them? What do they want?"
                className="mt-1"
              />
            </div>

            {/* Secrets (GM Only) */}
            <div>
              <Label className="text-xs">Secrets (GM Only)</Label>
              <Textarea
                value={localNPC.secrets}
                onChange={e =>
                  setLocalNPC({ ...localNPC, secrets: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Hidden information players don't know..."
                className="mt-1"
              />
            </div>

            {/* Locations */}
            <div>
              <Label className="text-xs">Known Locations</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localNPC.locations.map(location => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <Map className="h-3 w-3" />
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(location)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                    placeholder="Add a location..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addLocation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-xs">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localNPC.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag (villain, ally, merchant...)"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Free Notes */}
            <div>
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={localNPC.notes}
                onChange={e =>
                  setLocalNPC({ ...localNPC, notes: e.target.value })
                }
                onBlur={handleBlur}
                rows={3}
                placeholder="Any other notes about this character..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Location Components
// ─────────────────────────────────────────────────────────────────────────────

const LOCATION_TYPE_ICONS = {
  city: Building,
  town: Building,
  village: Building,
  dungeon: Map,
  wilderness: TreePine,
  landmark: Mountain,
  building: Building,
  region: Map,
  other: MapPin,
};

const LOCATION_TYPE_COLORS = {
  city: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  town: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  village: 'bg-green-500/20 text-green-700 dark:text-green-400',
  dungeon: 'bg-red-500/20 text-red-700 dark:text-red-400',
  wilderness: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  landmark: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  building: 'bg-slate-500/20 text-slate-700 dark:text-slate-400',
  region: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  other: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

function EditableLocations({
  locations,
  campaignId,
  onLocationsChange,
}: {
  locations: CampaignLocation[];
  campaignId: string;
  onLocationsChange: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const allTypes = [...new Set(locations.map(loc => loc.type))].sort();

  const filteredLocations = typeFilter
    ? locations.filter(loc => loc.type === typeFilter)
    : locations;

  const sortedLocations = [...filteredLocations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddLocation = async () => {
    await addLocation(campaignId, {
      name: 'New Location',
      type: 'other',
      description: '',
      history: '',
      secrets: '',
      currentState: '',
      connectedLocations: [],
      npcsPresent: [],
      pointsOfInterest: [],
      tags: [],
      notes: '',
    });
    onLocationsChange();
  };

  const handleUpdateLocation = async (
    locationId: string,
    updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    await updateLocation(campaignId, locationId, updates);
    onLocationsChange();
  };

  const handleDeleteLocation = async (locationId: string) => {
    await deleteLocation(campaignId, locationId);
    onLocationsChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={handleAddLocation} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
        {allTypes.length > 0 && (
          <Select
            value={typeFilter ?? 'all'}
            onValueChange={v => setTypeFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {sortedLocations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground">No locations created yet</p>
            <p className="text-muted-foreground text-sm">
              Add cities, dungeons, and points of interest
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedLocations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            isExpanded={expandedId === location.id}
            onToggle={() =>
              setExpandedId(expandedId === location.id ? null : location.id)
            }
            onUpdate={updates => handleUpdateLocation(location.id, updates)}
            onDelete={() => handleDeleteLocation(location.id)}
          />
        ))
      )}
    </div>
  );
}

function LocationCard({
  location,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  location: CampaignLocation;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}) {
  const [localLocation, setLocalLocation] = useState(location);
  const [tagInput, setTagInput] = useState('');
  const [poiName, setPoiName] = useState('');
  const [poiDesc, setPoiDesc] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  const handleBlur = () => {
    onUpdate(localLocation);
  };

  const addTag = () => {
    if (tagInput.trim() && !localLocation.tags.includes(tagInput.trim())) {
      const newTags = [...localLocation.tags, tagInput.trim()];
      setLocalLocation({ ...localLocation, tags: newTags });
      onUpdate({ tags: newTags });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = localLocation.tags.filter(t => t !== tag);
    setLocalLocation({ ...localLocation, tags: newTags });
    onUpdate({ tags: newTags });
  };

  const addPOI = () => {
    if (poiName.trim()) {
      const newPOIs = [
        ...localLocation.pointsOfInterest,
        { name: poiName.trim(), description: poiDesc.trim() },
      ];
      setLocalLocation({ ...localLocation, pointsOfInterest: newPOIs });
      onUpdate({ pointsOfInterest: newPOIs });
      setPoiName('');
      setPoiDesc('');
    }
  };

  const removePOI = (index: number) => {
    const newPOIs = localLocation.pointsOfInterest.filter(
      (_, i) => i !== index
    );
    setLocalLocation({ ...localLocation, pointsOfInterest: newPOIs });
    onUpdate({ pointsOfInterest: newPOIs });
  };

  const TypeIcon = LOCATION_TYPE_ICONS[localLocation.type];

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto flex-1 justify-start p-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded ${LOCATION_TYPE_COLORS[localLocation.type]}`}
                  >
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">{localLocation.name}</h4>
                    <p className="text-muted-foreground text-xs capitalize">
                      {localLocation.type}
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
              <AlertDialogTitle>Delete Location</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{localLocation.name}"? This
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
            {/* Name & Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={localLocation.name}
                  onChange={e =>
                    setLocalLocation({ ...localLocation, name: e.target.value })
                  }
                  onBlur={handleBlur}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={localLocation.type}
                  onValueChange={v => {
                    const newType = v as CampaignLocation['type'];
                    setLocalLocation({ ...localLocation, type: newType });
                    onUpdate({ type: newType });
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="town">Town</SelectItem>
                    <SelectItem value="village">Village</SelectItem>
                    <SelectItem value="dungeon">Dungeon</SelectItem>
                    <SelectItem value="wilderness">Wilderness</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localLocation.description}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    description: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What does this place look like?"
                className="mt-1"
              />
            </div>

            {/* Current State */}
            <div>
              <Label className="text-xs">Current State</Label>
              <Textarea
                value={localLocation.currentState}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    currentState: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What's happening here now?"
                className="mt-1"
              />
            </div>

            {/* History */}
            <div>
              <Label className="text-xs">History & Lore</Label>
              <Textarea
                value={localLocation.history}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    history: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Background and history..."
                className="mt-1"
              />
            </div>

            {/* Secrets */}
            <div>
              <Label className="text-xs">Secrets (GM Only)</Label>
              <Textarea
                value={localLocation.secrets}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    secrets: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Hidden information..."
                className="mt-1"
              />
            </div>

            {/* Points of Interest */}
            <div>
              <Label className="text-xs">Points of Interest</Label>
              <div className="mt-1 space-y-2">
                {localLocation.pointsOfInterest.map((poi, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 flex items-start gap-2 rounded-md p-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{poi.name}</p>
                      {poi.description && (
                        <p className="text-muted-foreground text-xs">
                          {poi.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removePOI(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={poiName}
                    onChange={e => setPoiName(e.target.value)}
                    placeholder="POI name"
                    className="flex-1"
                  />
                  <Input
                    value={poiDesc}
                    onChange={e => setPoiDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="flex-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPOI();
                      }
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={addPOI}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-xs">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localLocation.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={localLocation.notes}
                onChange={e =>
                  setLocalLocation({ ...localLocation, notes: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Any other notes..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quest Components
// ─────────────────────────────────────────────────────────────────────────────

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

function EditableQuests({
  quests,
  campaignId,
  onQuestsChange,
}: {
  quests: CampaignQuest[];
  campaignId: string;
  onQuestsChange: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredQuests = quests
    .filter(q => !statusFilter || q.status === statusFilter)
    .filter(q => !typeFilter || q.type === typeFilter);

  // Sort by priority (urgent first) then by status (active first)
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

function QuestCard({
  quest,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  quest: CampaignQuest;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}) {
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
            {/* Title & Type */}
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

            {/* Status & Priority */}
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

            {/* Description */}
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

            {/* Objectives */}
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

            {/* Quest Giver & Location */}
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

            {/* Rewards */}
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

            {/* Foreshadowing */}
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

            {/* Consequences */}
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

            {/* Notes */}
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

// ─────────────────────────────────────────────────────────────────────────────
// GM Tools Panel
// ─────────────────────────────────────────────────────────────────────────────

const RANDOM_NPC_NAMES = [
  'Aldric the Bold',
  'Brynn of the Vale',
  'Caspian Nightwind',
  'Della Ironhand',
  'Eldrin Shadowmere',
  'Fira Brightspear',
  'Gundren Rockseeker',
  'Helena Stormborn',
  'Ignis Flameheart',
  'Jorath the Wise',
  'Kira Swiftblade',
  'Lysander Moonwhisper',
  'Morgana Duskweaver',
  'Nyx Thornwood',
  'Osric the Grey',
  'Petra Stoneheart',
];

const RANDOM_LOCATIONS = [
  'The Crooked Lantern Inn',
  'Blackwater Crossing',
  'The Gilded Serpent Tavern',
  'Thornwood Cemetery',
  'The Sunken Temple',
  'Mistfall Bridge',
  'The Shattered Gate',
  'Ironforge Mines',
  'The Whispering Woods',
  'Crimson Harbor',
  'The Dusty Road Market',
  'Moonlit Clearing',
  'The Forgotten Library',
  'Stormwatch Tower',
  'The Deep Hollow',
];

const RANDOM_HOOKS = [
  'A mysterious stranger offers a map to buried treasure',
  'Strange lights have been seen in the old ruins at night',
  'A merchant begs for help finding their missing child',
  'The local lord has posted a bounty on a dangerous beast',
  'An ancient artifact was stolen from the temple',
  'Travelers report seeing ghosts on the old trade road',
  'A sealed letter arrives with no sender',
  'The harvest has failed and dark omens are seen',
];

const IMPROV_PROMPTS = [
  'What does the room smell like?',
  'What unexpected sound catches their attention?',
  'What small detail makes this NPC memorable?',
  'What obstacle could complicate their plan?',
  'Who else might be interested in this quest?',
  'What rumor is going around about this place?',
  'What does this character want right now?',
  'What would make this scene more dramatic?',
];

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

function GMToolsPanel({
  _campaignId,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onNavigateToTab,
  checklistItems,
  onChecklistChange,
}: {
  _campaignId: string;
  onAddNPC: (name: string) => Promise<void>;
  onAddLocation: (name: string) => Promise<void>;
  onAddQuest: (title: string) => Promise<void>;
  onNavigateToTab: (tab: string) => void;
  checklistItems: ChecklistItem[];
  onChecklistChange: (items: ChecklistItem[]) => void;
}) {
  const [randomResult, setRandomResult] = useState<{
    value: string;
    type: 'npc' | 'location' | 'quest';
  } | null>(null);
  const [improv, setImprov] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const rollRandom = (list: string[], type: 'npc' | 'location' | 'quest') => {
    const result = list[Math.floor(Math.random() * list.length)];
    setRandomResult({ value: result, type });
    return result;
  };

  const handleAddAndGo = async () => {
    if (!randomResult || adding) return;
    setAdding(true);
    try {
      if (randomResult.type === 'npc') {
        await onAddNPC(randomResult.value);
        onNavigateToTab('characters');
      } else if (randomResult.type === 'location') {
        await onAddLocation(randomResult.value);
        onNavigateToTab('locations');
      } else if (randomResult.type === 'quest') {
        await onAddQuest(randomResult.value);
        onNavigateToTab('quests');
      }
      setRandomResult(null);
    } finally {
      setAdding(false);
    }
  };

  const getImprovPrompt = () => {
    const prompt =
      IMPROV_PROMPTS[Math.floor(Math.random() * IMPROV_PROMPTS.length)];
    setImprov(prompt);
  };

  const getTypeLabel = (type: 'npc' | 'location' | 'quest') => {
    switch (type) {
      case 'npc':
        return 'Character';
      case 'location':
        return 'Location';
      case 'quest':
        return 'Quest';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Random Generators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Dice5 className="h-4 w-4 text-purple-500" />
            Random Generators
          </CardTitle>
          <CardDescription>Quick inspiration when you need it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollRandom(RANDOM_NPC_NAMES, 'npc')}
                >
                  <User className="mr-1 h-3 w-3" />
                  NPC Name
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a random NPC name</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollRandom(RANDOM_LOCATIONS, 'location')}
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  Location
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a random location name</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollRandom(RANDOM_HOOKS, 'quest')}
                >
                  <Target className="mr-1 h-3 w-3" />
                  Plot Hook
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a random plot hook</TooltipContent>
            </Tooltip>
          </div>
          {randomResult && (
            <div className="bg-muted space-y-2 rounded-lg p-3">
              <p className="text-sm font-medium">{randomResult.value}</p>
              <Button
                size="sm"
                onClick={handleAddAndGo}
                disabled={adding}
                className="w-full"
              >
                {adding ? (
                  'Adding...'
                ) : (
                  <>
                    Add as {getTypeLabel(randomResult.type)}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Improv Helper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Improv Helper
          </CardTitle>
          <CardDescription>Prompts to spark your imagination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={getImprovPrompt}
            className="w-full"
          >
            Get a Prompt
          </Button>
          {improv && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {improv}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Quick Reference
          </CardTitle>
          <CardDescription>
            Common Daggerheart rules at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Fear/Hope Dice</p>
              <p className="text-muted-foreground text-xs">
                Higher Fear = GM makes a Fear move. Higher Hope = Player
                succeeds with Hope.
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Stress</p>
              <p className="text-muted-foreground text-xs">
                Clear 1 Stress per Short Rest. Clear all on Long Rest.
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Armor Slots</p>
              <p className="text-muted-foreground text-xs">
                Mark when hit to reduce damage. Clear on rest.
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Death&apos;s Door</p>
              <p className="text-muted-foreground text-xs">
                At 0 HP, you&apos;re dying. Roll with Death each turn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-4 w-4 text-green-500" />
            Session Prep Checklist
          </CardTitle>
          <CardDescription>
            Don&apos;t forget before the session starts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="mb-2 flex gap-2 border-b pb-2">
              <Input
                placeholder="Add new item..."
                value={newChecklistItem}
                onChange={e => setNewChecklistItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newChecklistItem.trim()) {
                    onChecklistChange([
                      {
                        id: crypto.randomUUID(),
                        text: newChecklistItem.trim(),
                        checked: false,
                      },
                      ...checklistItems,
                    ]);
                    setNewChecklistItem('');
                  }
                }}
                className="text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newChecklistItem.trim()) {
                    onChecklistChange([
                      {
                        id: crypto.randomUUID(),
                        text: newChecklistItem.trim(),
                        checked: false,
                      },
                      ...checklistItems,
                    ]);
                    setNewChecklistItem('');
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {checklistItems.map(item => (
              <div key={item.id} className="group flex items-center gap-2">
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={item.checked}
                    onChange={e => {
                      onChecklistChange(
                        checklistItems.map(i =>
                          i.id === item.id
                            ? { ...i, checked: e.target.checked }
                            : i
                        )
                      );
                    }}
                  />
                  <span
                    className={
                      item.checked ? 'text-muted-foreground line-through' : ''
                    }
                  >
                    {item.text}
                  </span>
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    onChecklistChange(
                      checklistItems.filter(i => i.id !== item.id)
                    );
                  }}
                >
                  <Trash2 className="text-destructive h-3 w-3" />
                </Button>
              </div>
            ))}
            {checklistItems.length === 0 && (
              <p className="text-muted-foreground text-sm italic">
                No items yet. Add your first checklist item above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

function CampaignDetailPage() {
  const { id } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const setActiveTab = (newTab: string) => {
    navigate({
      to: '/gm/campaigns/$id',
      params: { id },
      search: { tab: newTab as TabValue },
      replace: true,
    });
  };

  const loadCampaign = useCallback(async () => {
    const data = await getCampaign(id);
    if (data) {
      setCampaign(data);
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadCampaign();
      setLoading(false);
    };
    load();
  }, [loadCampaign]);

  const updateFrame = useCallback(
    (updates: Partial<CampaignFrame>) => {
      if (!campaign) return;
      setCampaign({
        ...campaign,
        frame: { ...campaign.frame, ...updates },
      });
      setHasChanges(true);
    },
    [campaign]
  );

  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true);
    try {
      await updateCampaign(id, { name: campaign.name });
      await updateCampaignFrame(id, campaign.frame);
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // GM Tools callbacks for adding items from random generators
  const handleAddNPCFromGenerator = async (name: string) => {
    if (!campaign) return;
    await addNPC(campaign.id, {
      name,
      title: '',
      description: '',
      personality: '',
      motivation: '',
      secrets: '',
      connections: [],
      locations: [],
      status: 'active',
      faction: '',
      notes: '',
      sessionAppearances: [],
      tags: [],
    });
    await loadCampaign();
  };

  const handleAddLocationFromGenerator = async (name: string) => {
    if (!campaign) return;
    await addLocation(campaign.id, {
      name,
      type: 'other',
      description: '',
      history: '',
      secrets: '',
      currentState: '',
      connectedLocations: [],
      npcsPresent: [],
      pointsOfInterest: [],
      tags: [],
      notes: '',
    });
    await loadCampaign();
  };

  const handleAddQuestFromGenerator = async (title: string) => {
    if (!campaign) return;
    await addQuest(campaign.id, {
      title,
      type: 'hook',
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
    await loadCampaign();
  };

  const copyInviteCode = () => {
    if (campaign?.inviteCode) {
      navigator.clipboard.writeText(campaign.inviteCode);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Campaign not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate({ to: '/gm/campaigns' })}
            >
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const frame = campaign.frame;

  return (
    <div className="container mx-auto max-w-7xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate({ to: '/gm/campaigns' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
          <div className="flex items-center gap-3">
            <Input
              value={campaign.name}
              onChange={e => {
                setCampaign({ ...campaign, name: e.target.value });
                setHasChanges(true);
              }}
              className="focus-visible:border-input focus-visible:bg-background h-auto border-transparent bg-transparent p-0 text-2xl font-bold focus-visible:px-2"
            />
          </div>
          {campaign.inviteCode && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {campaign.inviteCode}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={copyInviteCode}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <span className="text-muted-foreground text-xs">Invite Code</span>
            </div>
          )}
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full flex-wrap justify-start">
          <TabsTrigger value="overview">
            <Map className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="world">
            <BookOpen className="mr-2 h-4 w-4" />
            World
          </TabsTrigger>
          <TabsTrigger value="mechanics">
            <Sparkles className="mr-2 h-4 w-4" />
            Mechanics
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Scroll className="mr-2 h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="characters">
            <User className="mr-2 h-4 w-4" />
            Characters
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="mr-2 h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="quests">
            <Target className="mr-2 h-4 w-4" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="session-zero">
            <MessageSquare className="mr-2 h-4 w-4" />
            Session Zero
          </TabsTrigger>
          <TabsTrigger value="gm-tools">
            <Lightbulb className="mr-2 h-4 w-4" />
            GM Tools
          </TabsTrigger>
          <TabsTrigger value="players" disabled>
            <Users className="mr-2 h-4 w-4" />
            Players
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Pitch</CardTitle>
              <CardDescription>
                A brief introduction to present to your players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={frame.pitch}
                onChange={e => updateFrame({ pitch: e.target.value })}
                rows={4}
                placeholder="Describe your campaign in a few sentences..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tone & Feel</CardTitle>
              <CardDescription>
                Words that describe the campaign's atmosphere
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagInput
                tags={frame.toneAndFeel}
                onChange={tags => updateFrame({ toneAndFeel: tags })}
                suggestions={CAMPAIGN_TONE_OPTIONS}
                placeholder="Add tone words..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Themes</CardTitle>
              <CardDescription>
                Central ideas and conflicts explored in the campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagInput
                tags={frame.themes}
                onChange={tags => updateFrame({ themes: tags })}
                suggestions={CAMPAIGN_THEME_OPTIONS}
                placeholder="Add themes..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Touchstones</CardTitle>
              <CardDescription>
                Media references that inspired the campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagInput
                tags={frame.touchstones}
                onChange={tags => updateFrame({ touchstones: tags })}
                placeholder="Add movies, books, games..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
              <CardDescription>
                Background information to share with players before character
                creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={frame.overview}
                onChange={e => updateFrame({ overview: e.target.value })}
                rows={6}
                placeholder="Describe the setting, history, and current situation..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* World Tab */}
        <TabsContent value="world" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Setting Distinctions</CardTitle>
              <CardDescription>
                Unique elements that make your world special
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableDistinctions
                distinctions={frame.distinctions}
                onChange={distinctions => updateFrame({ distinctions })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inciting Incident</CardTitle>
              <CardDescription>
                The event that kicks off the campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Title (optional)</Label>
                <Input
                  value={frame.incitingIncident?.title ?? ''}
                  onChange={e =>
                    updateFrame({
                      incitingIncident: {
                        ...frame.incitingIncident,
                        title: e.target.value,
                        description: frame.incitingIncident?.description ?? '',
                        hooks: frame.incitingIncident?.hooks ?? [],
                      },
                    })
                  }
                  placeholder="The Call to Adventure"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={frame.incitingIncident?.description ?? ''}
                  onChange={e =>
                    updateFrame({
                      incitingIncident: {
                        ...frame.incitingIncident,
                        title: frame.incitingIncident?.title,
                        description: e.target.value,
                        hooks: frame.incitingIncident?.hooks ?? [],
                      },
                    })
                  }
                  rows={4}
                  placeholder="Describe the event that brings the party together..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Player Principles</CardTitle>
                <CardDescription>
                  Guidance for players during the campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditablePrinciples
                  principles={frame.playerPrinciples}
                  onChange={playerPrinciples =>
                    updateFrame({ playerPrinciples })
                  }
                  target="player"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">GM Principles</CardTitle>
                <CardDescription>
                  Guidance for running the campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditablePrinciples
                  principles={frame.gmPrinciples}
                  onChange={gmPrinciples => updateFrame({ gmPrinciples })}
                  target="gm"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mechanics Tab */}
        <TabsContent value="mechanics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Custom Mechanics</CardTitle>
              <CardDescription>
                Special rules unique to this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableMechanics
                mechanics={frame.mechanics}
                onChange={mechanics => updateFrame({ mechanics })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Notes</CardTitle>
              <CardDescription>
                Track what happens each session, key moments, and story progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableSessions
                sessions={campaign.sessions ?? []}
                npcs={campaign.npcs ?? []}
                campaignId={campaign.id}
                onSessionsChange={loadCampaign}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Characters Tab */}
        <TabsContent value="characters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Characters</CardTitle>
              <CardDescription>
                NPCs, villains, allies, and other characters in your story
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableNPCs
                npcs={campaign.npcs ?? []}
                campaignId={campaign.id}
                onNPCsChange={loadCampaign}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Locations</CardTitle>
              <CardDescription>
                Cities, dungeons, and points of interest in your world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableLocations
                locations={campaign.locations ?? []}
                campaignId={campaign.id}
                onLocationsChange={loadCampaign}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quests Tab */}
        <TabsContent value="quests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quests & Plot Hooks</CardTitle>
              <CardDescription>
                Main quests, side quests, and story threads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableQuests
                quests={campaign.quests ?? []}
                campaignId={campaign.id}
                onQuestsChange={loadCampaign}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* GM Tools Tab */}
        <TabsContent value="gm-tools" className="space-y-6">
          <GMToolsPanel
            campaignId={campaign.id}
            onAddNPC={handleAddNPCFromGenerator}
            onAddLocation={handleAddLocationFromGenerator}
            onAddQuest={handleAddQuestFromGenerator}
            onNavigateToTab={setActiveTab}
            checklistItems={
              campaign.sessionPrepChecklist?.length
                ? campaign.sessionPrepChecklist
                : [
                    {
                      id: 'default-1',
                      text: 'Review last session notes',
                      checked: false,
                    },
                    {
                      id: 'default-2',
                      text: 'Check active quests & objectives',
                      checked: false,
                    },
                    {
                      id: 'default-3',
                      text: 'Prepare 2-3 NPC voices/mannerisms',
                      checked: false,
                    },
                    {
                      id: 'default-4',
                      text: 'Have a "yes, and" backup plan',
                      checked: false,
                    },
                    {
                      id: 'default-5',
                      text: 'Note player character goals',
                      checked: false,
                    },
                    {
                      id: 'default-6',
                      text: 'Prepare one memorable description',
                      checked: false,
                    },
                    {
                      id: 'default-7',
                      text: 'Check the Fear track',
                      checked: false,
                    },
                  ]
            }
            onChecklistChange={items => {
              setCampaign({ ...campaign, sessionPrepChecklist: items });
              setHasChanges(true);
            }}
          />
        </TabsContent>

        {/* Session Zero Tab */}
        <TabsContent value="session-zero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Session Zero Questions
              </CardTitle>
              <CardDescription>
                Questions to ask your players during session zero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditableQuestions
                questions={frame.sessionZeroQuestions}
                onChange={sessionZeroQuestions =>
                  updateFrame({ sessionZeroQuestions })
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Players Tab (placeholder) */}
        <TabsContent value="players">
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                Player management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
