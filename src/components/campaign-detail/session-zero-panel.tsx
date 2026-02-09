// Session Zero Panel - Comprehensive CATS Method and Safety Tools interface
// Based on Chapter 3: Session Zero and Safety Tools from the Daggerheart rulebook

import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Globe,
  HelpCircle,
  Link2,
  MessageSquare,
  Plus,
  Settings,
  Shield,
  Target,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  calculateSessionZeroProgress,
  CONNECTION_TYPE_OPTIONS,
  createEmptySessionZero,
  generateSessionZeroItemId,
  SESSION_ZERO_CHECKLIST,
  SUGGESTED_TABLE_AGREEMENTS,
  TABLE_AGREEMENT_CATEGORIES,
} from '@/lib/schemas/campaign';
import type {
  CharacterConnection,
  SessionZero,
  TableAgreement,
  TonePreference,
  WorldbuildingNote,
} from '@/lib/schemas/campaign';
import type { SafetyLine, SafetyVeil } from '@/lib/schemas/session-zero';

import { OptionalRulesSection } from './optional-rules-section';

interface SessionZeroPanelProps {
  sessionZero: SessionZero | undefined;
  onChange: (sessionZero: SessionZero) => void;
  onBlur: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tone Selector Component
// ─────────────────────────────────────────────────────────────────────────────

function ToneSelector({
  preferences,
  onChange,
}: {
  preferences: TonePreference[];
  onChange: (preferences: TonePreference[]) => void;
}) {
  const updatePreference = useCallback(
    (tone: string, preference: TonePreference['preference']) => {
      const newPreferences = preferences.map(p =>
        p.tone === tone ? { ...p, preference } : p
      );
      onChange(newPreferences);
    },
    [preferences, onChange]
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {preferences.map(({ tone, preference }) => (
        <div
          key={tone}
          className={`flex items-center justify-between rounded-lg border p-2 transition-colors ${
            preference === 'desired'
              ? 'border-green-500 bg-green-500/10'
              : preference === 'avoided'
                ? 'border-red-500 bg-red-500/10 line-through'
                : 'border-border'
          }`}
        >
          <span className="text-sm font-medium">{tone}</span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={preference === 'desired' ? 'default' : 'ghost'}
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updatePreference(
                  tone,
                  preference === 'desired' ? 'neutral' : 'desired'
                )
              }
              title="Circle (desired)"
            >
              <CheckCircle2 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={preference === 'avoided' ? 'destructive' : 'ghost'}
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updatePreference(
                  tone,
                  preference === 'avoided' ? 'neutral' : 'avoided'
                )
              }
              title="Cross out (avoid)"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Safety Lines/Veils Editor
// ─────────────────────────────────────────────────────────────────────────────

function SafetyLinesEditor({
  lines,
  onChange,
}: {
  lines: SafetyLine[];
  onChange: (lines: SafetyLine[]) => void;
}) {
  const [newTopic, setNewTopic] = useState('');

  const addLine = useCallback(() => {
    if (!newTopic.trim()) return;
    const newLine: SafetyLine = {
      id: generateSessionZeroItemId('line'),
      topic: newTopic.trim(),
      isAnonymous: true,
      notes: '',
    };
    onChange([...lines, newLine]);
    setNewTopic('');
  }, [newTopic, lines, onChange]);

  const removeLine = useCallback(
    (id: string) => {
      onChange(lines.filter(l => l.id !== id));
    },
    [lines, onChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          aria-label="New safety line topic"
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
          placeholder="Add a topic that should never appear..."
          onKeyDown={e => e.key === 'Enter' && addLine()}
        />
        <Button type="button" onClick={addLine} disabled={!newTopic.trim()}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {lines.map(line => (
          <Badge
            key={line.id}
            variant="destructive"
            className="flex items-center gap-1 py-1"
          >
            <EyeOff className="h-3 w-3" />
            {line.topic}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-1 h-4 w-4 hover:bg-red-600"
              onClick={() => removeLine(line.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {lines.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No lines set. Add topics that should never appear in the game.
          </p>
        )}
      </div>
    </div>
  );
}

function SafetyVeilsEditor({
  veils,
  onChange,
}: {
  veils: SafetyVeil[];
  onChange: (veils: SafetyVeil[]) => void;
}) {
  const [newTopic, setNewTopic] = useState('');

  const addVeil = useCallback(() => {
    if (!newTopic.trim()) return;
    const newVeil: SafetyVeil = {
      id: generateSessionZeroItemId('veil'),
      topic: newTopic.trim(),
      isAnonymous: true,
      howToHandle: 'Fade to black / happens off-screen',
      notes: '',
    };
    onChange([...veils, newVeil]);
    setNewTopic('');
  }, [newTopic, veils, onChange]);

  const removeVeil = useCallback(
    (id: string) => {
      onChange(veils.filter(v => v.id !== id));
    },
    [veils, onChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          aria-label="New safety veil topic"
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
          placeholder="Add a topic that happens off-screen..."
          onKeyDown={e => e.key === 'Enter' && addVeil()}
        />
        <Button type="button" onClick={addVeil} disabled={!newTopic.trim()}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {veils.map(veil => (
          <Badge
            key={veil.id}
            variant="secondary"
            className="flex items-center gap-1 py-1"
          >
            <Eye className="h-3 w-3" />
            {veil.topic}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-1 h-4 w-4"
              onClick={() => removeVeil(veil.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {veils.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No veils set. Add topics that can exist but happen off-screen.
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Table Agreements Editor
// ─────────────────────────────────────────────────────────────────────────────

function TableAgreementsEditor({
  agreements,
  onChange,
}: {
  agreements: TableAgreement[];
  onChange: (agreements: TableAgreement[]) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newAgreement, setNewAgreement] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<TableAgreement['category']>('other');

  const addAgreement = useCallback(
    (text: string, category: TableAgreement['category'] = 'other') => {
      if (!text.trim()) return;
      const agreement: TableAgreement = {
        id: generateSessionZeroItemId('agreement'),
        category,
        agreement: text.trim(),
        isAgreed: false,
        notes: '',
      };
      onChange([...agreements, agreement]);
      setNewAgreement('');
    },
    [agreements, onChange]
  );

  const toggleAgreement = useCallback(
    (id: string) => {
      onChange(
        agreements.map(a => (a.id === id ? { ...a, isAgreed: !a.isAgreed } : a))
      );
    },
    [agreements, onChange]
  );

  const removeAgreement = useCallback(
    (id: string) => {
      onChange(agreements.filter(a => a.id !== id));
    },
    [agreements, onChange]
  );

  const groupedAgreements = useMemo(() => {
    const groups: Record<string, TableAgreement[]> = {};
    agreements.forEach(a => {
      if (!groups[a.category]) groups[a.category] = [];
      groups[a.category].push(a);
    });
    return groups;
  }, [agreements]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          value={selectedCategory}
          onValueChange={v =>
            setSelectedCategory(v as TableAgreement['category'])
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {TABLE_AGREEMENT_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={newAgreement}
          onChange={e => setNewAgreement(e.target.value)}
          placeholder="Add a table agreement..."
          onKeyDown={e =>
            e.key === 'Enter' && addAgreement(newAgreement, selectedCategory)
          }
          className="flex-1"
        />
        <Button
          type="button"
          onClick={() => addAgreement(newAgreement, selectedCategory)}
          disabled={!newAgreement.trim()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowSuggestions(!showSuggestions)}
      >
        {showSuggestions ? 'Hide' : 'Show'} Suggestions
      </Button>

      {showSuggestions && (
        <div className="bg-muted/50 space-y-2 rounded-lg p-3">
          {SUGGESTED_TABLE_AGREEMENTS.map(group => (
            <div key={group.category}>
              <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                {TABLE_AGREEMENT_CATEGORIES.find(
                  c => c.value === group.category
                )?.label ?? group.category}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.agreements.map(suggestion => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 text-xs"
                    onClick={() =>
                      addAgreement(
                        suggestion,
                        group.category as TableAgreement['category']
                      )
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(groupedAgreements).map(([category, items]) => (
          <div key={category}>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
              {TABLE_AGREEMENT_CATEGORIES.find(c => c.value === category)
                ?.label ?? category}
            </p>
            <div className="space-y-1">
              {items.map(agreement => (
                <div
                  key={agreement.id}
                  className="flex items-center gap-2 rounded border p-2"
                >
                  <Checkbox
                    checked={agreement.isAgreed}
                    onCheckedChange={() => toggleAgreement(agreement.id)}
                  />
                  <span
                    className={`flex-1 text-sm ${agreement.isAgreed ? 'text-green-700 dark:text-green-400' : ''}`}
                  >
                    {agreement.agreement}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeAgreement(agreement.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {agreements.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No agreements yet. Add agreements about scheduling, communication,
            and gameplay.
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Character Connections Editor
// ─────────────────────────────────────────────────────────────────────────────

function CharacterConnectionsEditor({
  connections,
  onChange,
}: {
  connections: CharacterConnection[];
  onChange: (connections: CharacterConnection[]) => void;
}) {
  const [newConnection, setNewConnection] = useState({
    from: '',
    to: '',
    type: 'other' as CharacterConnection['connectionType'],
    description: '',
  });

  const addConnection = useCallback(() => {
    if (!newConnection.from.trim() || !newConnection.to.trim()) return;
    const connection: CharacterConnection = {
      id: generateSessionZeroItemId('connection'),
      fromCharacterName: newConnection.from.trim(),
      toCharacterName: newConnection.to.trim(),
      connectionType: newConnection.type,
      description: newConnection.description.trim(),
      isReciprocal: true,
      notes: '',
    };
    onChange([...connections, connection]);
    setNewConnection({ from: '', to: '', type: 'other', description: '' });
  }, [newConnection, connections, onChange]);

  const removeConnection = useCallback(
    (id: string) => {
      onChange(connections.filter(c => c.id !== id));
    },
    [connections, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2">
        <Input
          value={newConnection.from}
          onChange={e =>
            setNewConnection(prev => ({ ...prev, from: e.target.value }))
          }
          placeholder="Character 1 name"
        />
        <Input
          value={newConnection.to}
          onChange={e =>
            setNewConnection(prev => ({ ...prev, to: e.target.value }))
          }
          placeholder="Character 2 name"
        />
        <Select
          value={newConnection.type}
          onValueChange={v =>
            setNewConnection(prev => ({
              ...prev,
              type: v as CharacterConnection['connectionType'],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Connection type" />
          </SelectTrigger>
          <SelectContent>
            {CONNECTION_TYPE_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={newConnection.description}
          onChange={e =>
            setNewConnection(prev => ({ ...prev, description: e.target.value }))
          }
          placeholder="Brief description..."
        />
        <Button
          type="button"
          onClick={addConnection}
          disabled={!newConnection.from.trim() || !newConnection.to.trim()}
          className="sm:col-span-2"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      <div className="space-y-2">
        {connections.map(conn => (
          <div
            key={conn.id}
            className="flex items-center gap-2 rounded-lg border p-3"
          >
            <Link2 className="text-muted-foreground h-4 w-4 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>{conn.fromCharacterName}</span>
                <ChevronRight className="h-3 w-3" />
                <span>{conn.toCharacterName}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-xs">
                  {CONNECTION_TYPE_OPTIONS.find(
                    o => o.value === conn.connectionType
                  )?.label ?? conn.connectionType}
                </Badge>
                {conn.description && <span>{conn.description}</span>}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeConnection(conn.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {connections.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No character connections yet. Add how the party members know each
            other.
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Worldbuilding Notes Editor
// ─────────────────────────────────────────────────────────────────────────────

function WorldbuildingNotesEditor({
  notes,
  onChange,
}: {
  notes: WorldbuildingNote[];
  onChange: (notes: WorldbuildingNote[]) => void;
}) {
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    category: 'other' as WorldbuildingNote['category'],
  });

  const addNote = useCallback(() => {
    if (!newNote.description.trim()) return;
    const note: WorldbuildingNote = {
      id: generateSessionZeroItemId('worldnote'),
      title: newNote.title.trim(),
      description: newNote.description.trim(),
      category: newNote.category,
      isCanon: true,
      notes: '',
    };
    onChange([...notes, note]);
    setNewNote({ title: '', description: '', category: 'other' });
  }, [newNote, notes, onChange]);

  const removeNote = useCallback(
    (id: string) => {
      onChange(notes.filter(n => n.id !== id));
    },
    [notes, onChange]
  );

  const categoryLabels: Record<WorldbuildingNote['category'], string> = {
    geography: 'Geography',
    culture: 'Culture',
    history: 'History',
    magic: 'Magic',
    politics: 'Politics',
    religion: 'Religion',
    technology: 'Technology',
    other: 'Other',
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
        <Input
          value={newNote.title}
          onChange={e =>
            setNewNote(prev => ({ ...prev, title: e.target.value }))
          }
          placeholder="Title (optional)"
        />
        <Select
          value={newNote.category}
          onValueChange={v =>
            setNewNote(prev => ({
              ...prev,
              category: v as WorldbuildingNote['category'],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          value={newNote.description}
          onChange={e =>
            setNewNote(prev => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe this worldbuilding element..."
          rows={2}
          className="sm:col-span-2"
        />
        <Button
          type="button"
          onClick={addNote}
          disabled={!newNote.description.trim()}
          className="sm:col-span-2"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="space-y-2">
        {notes.map(note => (
          <div key={note.id} className="rounded-lg border p-3">
            <div className="mb-1 flex items-start justify-between">
              <div>
                {note.title && (
                  <p className="text-sm font-medium">{note.title}</p>
                )}
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[note.category]}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeNote(note.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">{note.description}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No worldbuilding notes yet. Add details your players contributed.
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Session Zero Checklist
// ─────────────────────────────────────────────────────────────────────────────

function SessionZeroChecklist({
  completedSteps,
  onChange,
}: {
  completedSteps: SessionZero['completedSteps'];
  onChange: (steps: SessionZero['completedSteps']) => void;
}) {
  const toggleStep = useCallback(
    (stepId: keyof SessionZero['completedSteps']) => {
      onChange({
        ...completedSteps,
        [stepId]: !completedSteps[stepId],
      });
    },
    [completedSteps, onChange]
  );

  return (
    <div className="space-y-2">
      {SESSION_ZERO_CHECKLIST.map(step => {
        const isCompleted =
          completedSteps[step.id as keyof SessionZero['completedSteps']];
        return (
          <div
            key={step.id}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              isCompleted ? 'border-green-500/50 bg-green-500/10' : ''
            }`}
          >
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() =>
                toggleStep(step.id as keyof SessionZero['completedSteps'])
              }
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}
              >
                {step.label}
              </p>
              <p className="text-muted-foreground text-xs">
                {step.description}
              </p>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />~{step.estimatedMinutes} min
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Collapsible Section Wrapper
// ─────────────────────────────────────────────────────────────────────────────

interface CollapsibleSectionProps {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description?: string;
  badge?: ReactNode;
  afterTitle?: ReactNode;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}

function CollapsibleSection({
  id,
  icon: Icon,
  iconColor,
  title,
  description,
  badge,
  afterTitle,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(id)}>
      <Card>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon className={`h-4 w-4 ${iconColor}`} />
              {title}
              {afterTitle}
              {badge}
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Session Zero Panel
// ─────────────────────────────────────────────────────────────────────────────

export function SessionZeroPanel({
  sessionZero,
  onChange,
  onBlur,
}: SessionZeroPanelProps) {
  const data = sessionZero ?? createEmptySessionZero();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['cats', 'safety', 'checklist'])
  );

  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const update = useCallback(
    (updates: Partial<SessionZero>) => {
      const now = new Date().toISOString();
      onChange({
        ...data,
        ...updates,
        updatedAt: now,
      });
    },
    [data, onChange]
  );

  const updateAndBlur = useCallback(
    <K extends keyof SessionZero>(key: K) =>
      (value: SessionZero[K]) => {
        update({ [key]: value } as Partial<SessionZero>);
        onBlur();
      },
    [update, onBlur]
  );

  const progress = useMemo(() => calculateSessionZeroProgress(data), [data]);

  const hasOptionalRules = useMemo(
    () =>
      data.optionalRules?.massiveDamage ||
      data.optionalRules?.spotlightTrackers ||
      data.optionalRules?.definedRanges ||
      data.optionalRules?.goldCoins ||
      (data.optionalRules?.customHouseRules?.length ?? 0) > 0,
    [data.optionalRules]
  );

  const desiredTones = data.tonePreferences.filter(
    t => t.preference === 'desired'
  );
  const avoidedTones = data.tonePreferences.filter(
    t => t.preference === 'avoided'
  );

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-cyan-500" />
              Session Zero Progress
            </CardTitle>
            <Badge
              variant={data.completed ? 'default' : 'secondary'}
              className={data.completed ? 'bg-green-500' : ''}
            >
              {data.completed ? 'Completed' : `${progress}%`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {desiredTones.length > 0 && (
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-xs">
                    {desiredTones.map(t => t.tone).join(', ')}
                  </span>
                </div>
              )}
              {avoidedTones.length > 0 && (
                <div className="flex items-center gap-1">
                  <X className="h-3 w-3 text-red-500" />
                  <span className="text-muted-foreground text-xs">
                    Avoiding: {avoidedTones.map(t => t.tone).join(', ')}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.completed}
                onCheckedChange={checked => {
                  update({ completed: checked === true });
                  onBlur();
                }}
              />
              <Label className="text-sm">Mark Complete</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CATS Section */}
      <CollapsibleSection
        id="cats"
        icon={MessageSquare}
        iconColor="text-blue-500"
        title="CATS Method"
        afterTitle={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p>
                  <strong>C</strong>oncept, <strong>A</strong>im,{' '}
                  <strong>T</strong>one, <strong>S</strong>ubject - the
                  framework from Chapter 3 for Session Zero discussions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
        description="Define your campaign concept, goals, tone, and content"
        isOpen={openSections.has('cats')}
        onToggle={toggleSection}
      >
        <CardContent className="space-y-6">
          {/* Concept */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <span className="bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                C
              </span>
              Concept
            </Label>
            <Textarea
              value={data.concept}
              onChange={e => update({ concept: e.target.value })}
              onBlur={onBlur}
              placeholder="What's the big-picture pitch? If this campaign was a book series, how would you describe it?"
              rows={3}
            />
          </div>

          {/* Aim */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <span className="bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                A
              </span>
              Aim
            </Label>
            <Textarea
              value={data.aim}
              onChange={e => update({ aim: e.target.value })}
              onBlur={onBlur}
              placeholder="What are the creative and social goals? Weekly epic adventure? Casual fun with friends? Deep character exploration?"
              rows={3}
            />
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <span className="bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                T
              </span>
              Tone
            </Label>
            <p className="text-muted-foreground text-xs">
              Circle tones you want to focus on. Cross out tones to avoid.
            </p>
            <ToneSelector
              preferences={data.tonePreferences}
              onChange={updateAndBlur('tonePreferences')}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <span className="bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                S
              </span>
              Subject Matter to Explore
            </Label>
            <Textarea
              value={data.subjectsToExplore.join('\n')}
              onChange={e =>
                update({
                  subjectsToExplore: e.target.value
                    .split('\n')
                    .filter(s => s.trim()),
                })
              }
              onBlur={onBlur}
              placeholder="Themes and subjects you want to actively explore (one per line)"
              rows={3}
            />
          </div>
        </CardContent>
      </CollapsibleSection>

      {/* Safety Tools */}
      <CollapsibleSection
        id="safety"
        icon={Shield}
        iconColor="text-amber-500"
        title="Safety Tools"
        badge={
          data.safetyToolsReviewed ? (
            <Badge variant="outline" className="text-green-500">
              Reviewed
            </Badge>
          ) : undefined
        }
        description="Lines, Veils, and the X-Card for content safety"
        isOpen={openSections.has('safety')}
        onToggle={toggleSection}
      >
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.safetyToolsReviewed}
                onCheckedChange={checked => {
                  update({ safetyToolsReviewed: checked === true });
                  onBlur();
                }}
              />
              <Label>Safety tools reviewed with group</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.xCardEnabled}
                onCheckedChange={checked => {
                  update({ xCardEnabled: checked === true });
                  onBlur();
                }}
              />
              <Label>X-Card enabled</Label>
            </div>
          </div>

          {/* Lines */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-red-500" />
              <Label>Lines (Never Appears)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Topics that should never appear in any form during the game.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <SafetyLinesEditor
              lines={data.lines}
              onChange={updateAndBlur('lines')}
            />
          </div>

          {/* Veils */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-500" />
              <Label>Veils (Off-Screen)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Topics that can exist in the world but happen
                    &quot;off-screen&quot; or fade to black.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <SafetyVeilsEditor
              veils={data.veils}
              onChange={updateAndBlur('veils')}
            />
          </div>

          {/* Safety Notes */}
          <div className="space-y-2">
            <Label>Additional Safety Notes</Label>
            <Textarea
              value={data.safetyNotes}
              onChange={e => update({ safetyNotes: e.target.value })}
              onBlur={onBlur}
              placeholder="Any other safety considerations for this group..."
              rows={2}
            />
          </div>
        </CardContent>
      </CollapsibleSection>

      {/* Table Agreements */}
      <CollapsibleSection
        id="agreements"
        icon={Users}
        iconColor="text-green-500"
        title="Table Agreements"
        badge={
          data.tableAgreements.length > 0 ? (
            <Badge variant="outline">{data.tableAgreements.length}</Badge>
          ) : undefined
        }
        description="Social contract for scheduling, communication, and gameplay"
        isOpen={openSections.has('agreements')}
        onToggle={toggleSection}
      >
        <CardContent>
          <TableAgreementsEditor
            agreements={data.tableAgreements}
            onChange={updateAndBlur('tableAgreements')}
          />
        </CardContent>
      </CollapsibleSection>

      {/* Character Connections */}
      <CollapsibleSection
        id="connections"
        icon={Link2}
        iconColor="text-purple-500"
        title="Character Connections"
        badge={
          data.characterConnections.length > 0 ? (
            <Badge variant="outline">{data.characterConnections.length}</Badge>
          ) : undefined
        }
        description="How the party members know each other"
        isOpen={openSections.has('connections')}
        onToggle={toggleSection}
      >
        <CardContent>
          <CharacterConnectionsEditor
            connections={data.characterConnections}
            onChange={updateAndBlur('characterConnections')}
          />
        </CardContent>
      </CollapsibleSection>

      {/* Worldbuilding */}
      <CollapsibleSection
        id="worldbuilding"
        icon={Globe}
        iconColor="text-emerald-500"
        title="Worldbuilding Notes"
        badge={
          data.worldbuildingNotes.length > 0 ? (
            <Badge variant="outline">{data.worldbuildingNotes.length}</Badge>
          ) : undefined
        }
        description="Collaborative worldbuilding from session zero"
        isOpen={openSections.has('worldbuilding')}
        onToggle={toggleSection}
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Worldbuilding Summary</Label>
            <Textarea
              value={data.worldbuildingSummary}
              onChange={e => update({ worldbuildingSummary: e.target.value })}
              onBlur={onBlur}
              placeholder="Summary of collaborative worldbuilding..."
              rows={3}
            />
          </div>
          <WorldbuildingNotesEditor
            notes={data.worldbuildingNotes}
            onChange={updateAndBlur('worldbuildingNotes')}
          />
        </CardContent>
      </CollapsibleSection>

      {/* Optional Rules */}
      <CollapsibleSection
        id="optional-rules"
        icon={Settings}
        iconColor="text-orange-500"
        title="Optional Rules"
        badge={
          hasOptionalRules ? (
            <Badge variant="outline" className="text-green-500">
              Configured
            </Badge>
          ) : undefined
        }
        description="Tune risk and pacing with optional rules from Chapter 3"
        isOpen={openSections.has('optional-rules')}
        onToggle={toggleSection}
      >
        <CardContent>
          <OptionalRulesSection
            optionalRules={data.optionalRules}
            onChange={updateAndBlur('optionalRules')}
            onBlur={onBlur}
          />
        </CardContent>
      </CollapsibleSection>

      {/* Session Zero Checklist */}
      <CollapsibleSection
        id="checklist"
        icon={CheckCircle2}
        iconColor="text-cyan-500"
        title="Session Zero Checklist"
        description="Track progress through the session zero agenda"
        isOpen={openSections.has('checklist')}
        onToggle={toggleSection}
      >
        <CardContent>
          <SessionZeroChecklist
            completedSteps={data.completedSteps}
            onChange={updateAndBlur('completedSteps')}
          />
        </CardContent>
      </CollapsibleSection>

      {/* Session Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-slate-500" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Session Date</Label>
            <Input
              type="date"
              value={data.sessionDate ?? ''}
              onChange={e => update({ sessionDate: e.target.value })}
              onBlur={onBlur}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={data.durationMinutes ?? ''}
              onChange={e =>
                update({
                  durationMinutes: parseInt(e.target.value) || undefined,
                })
              }
              onBlur={onBlur}
              placeholder="e.g., 240"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea
              value={data.notes}
              onChange={e => update({ notes: e.target.value })}
              onBlur={onBlur}
              placeholder="Any additional notes about session zero..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
