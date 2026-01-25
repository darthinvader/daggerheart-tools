/* eslint-disable max-lines */
// Session components - EditableSessions and SessionCard are tightly coupled

import {
  Calendar,
  ChevronDown,
  Map,
  Plus,
  Scroll,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import {
  addSession,
  deleteSession,
  updateSession,
} from '@/features/campaigns/campaign-storage';
import type { CampaignNPC, SessionNote } from '@/lib/schemas/campaign';

interface EditableSessionsProps {
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  campaignId: string;
  onSessionsChange: () => void;
}

export function EditableSessions({
  sessions,
  npcs,
  campaignId,
  onSessionsChange,
}: EditableSessionsProps) {
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
      <Button onClick={handleAddSession} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Session {nextSessionNumber}
      </Button>

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

interface SessionCardProps {
  session: SessionNote;
  npcs: CampaignNPC[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}
type SessionTextFieldKey = 'title' | 'summary' | 'questProgress';

interface SessionCardContentProps {
  session: SessionNote;
  npcs: CampaignNPC[];
  isExpanded: boolean;
  highlightInput: string;
  locationInput: string;
  onToggle: () => void;
  onDelete: () => void;
  onTextChange: (field: SessionTextFieldKey, value: string) => void;
  onDateChange: (value: string) => void;
  onBlur: () => void;
  onHighlightInputChange: (value: string) => void;
  onLocationInputChange: (value: string) => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (index: number) => void;
  onAddLocation: () => void;
  onRemoveLocation: (index: number) => void;
  onToggleNpcInvolved: (npcId: string) => void;
}

function hasSessionChanges(current: SessionNote, original: SessionNote) {
  return (
    current.title !== original.title ||
    current.summary !== original.summary ||
    current.date !== original.date ||
    current.questProgress !== original.questProgress
  );
}

function addTrimmedItem(items: string[], input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return { items, added: false };
  }
  return { items: [...items, trimmed], added: true };
}

function removeItemAtIndex(items: string[], index: number) {
  return items.filter((_, currentIndex) => currentIndex !== index);
}

function toggleNpcInvolvedList(items: string[], npcId: string) {
  return items.includes(npcId)
    ? items.filter(id => id !== npcId)
    : [...items, npcId];
}

interface SessionHeaderProps {
  session: SessionNote;
  isExpanded: boolean;
  onDelete: (event: MouseEvent<HTMLButtonElement>) => void;
}

function SessionHeader({ session, isExpanded, onDelete }: SessionHeaderProps) {
  return (
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
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}

interface SessionTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function SessionTextField({
  label,
  value,
  placeholder,
  type = 'text',
  onChange,
  onBlur,
}: SessionTextFieldProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="mt-1"
      />
    </div>
  );
}

interface SessionTextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  icon?: ReactNode;
}

function SessionTextAreaField({
  label,
  value,
  placeholder,
  rows = 2,
  onChange,
  onBlur,
  icon,
}: SessionTextAreaFieldProps) {
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

interface SessionBadgeListFieldProps {
  label: string;
  items: string[];
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  icon?: ReactNode;
  variant?: 'secondary' | 'outline';
}

function SessionBadgeListField({
  label,
  items,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onAdd,
  onRemove,
  icon,
  variant = 'secondary',
}: SessionBadgeListFieldProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1 space-y-2">
        <div className="flex flex-wrap gap-1">
          {items.map((item, index) => (
            <Badge
              key={`${item}-${index}`}
              variant={variant}
              className="gap-1 pr-1"
            >
              {icon}
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="hover:bg-muted ml-1 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            placeholder={inputPlaceholder}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={onAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SessionNPCSelectorProps {
  npcs: CampaignNPC[];
  selectedNPCs: string[];
  onToggleNPC: (npcId: string) => void;
}

function SessionNPCSelector({
  npcs,
  selectedNPCs,
  onToggleNPC,
}: SessionNPCSelectorProps) {
  return (
    <div>
      <Label className="text-xs">NPCs Involved</Label>
      <div className="mt-1 flex flex-wrap gap-2">
        {npcs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No NPCs available</p>
        ) : (
          npcs.map(npc => {
            const isSelected = selectedNPCs.includes(npc.id);
            return (
              <Button
                key={npc.id}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className="h-7"
                onClick={() => onToggleNPC(npc.id)}
              >
                <User className="mr-1 h-3 w-3" />
                {npc.name}
              </Button>
            );
          })
        )}
      </div>
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
}: SessionCardProps) {
  const [localSession, setLocalSession] = useState(session);
  const [highlightInput, setHighlightInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const updateLocalSession = useCallback(
    (updates: Partial<SessionNote>) => {
      setLocalSession(current => ({ ...current, ...updates }));
      onUpdate(updates);
    },
    [onUpdate]
  );

  const handleBlur = useCallback(() => {
    if (hasSessionChanges(localSession, session)) {
      onUpdate(localSession);
    }
  }, [localSession, onUpdate, session]);

  const handleTextChange = useCallback(
    (field: SessionTextFieldKey, value: string) => {
      updateLocalSession({ [field]: value } as Partial<SessionNote>);
    },
    [updateLocalSession]
  );

  const handleDateChange = useCallback(
    (value: string) => {
      updateLocalSession({ date: value });
    },
    [updateLocalSession]
  );

  const addHighlight = useCallback(() => {
    const result = addTrimmedItem(localSession.highlights, highlightInput);
    if (!result.added) {
      return;
    }
    updateLocalSession({ highlights: result.items });
    setHighlightInput('');
  }, [highlightInput, localSession.highlights, updateLocalSession]);

  const removeHighlight = useCallback(
    (index: number) => {
      updateLocalSession({
        highlights: removeItemAtIndex(localSession.highlights, index),
      });
    },
    [localSession.highlights, updateLocalSession]
  );

  const addLocation = useCallback(() => {
    const result = addTrimmedItem(localSession.locations, locationInput);
    if (!result.added) {
      return;
    }
    updateLocalSession({ locations: result.items });
    setLocationInput('');
  }, [localSession.locations, locationInput, updateLocalSession]);

  const removeLocation = useCallback(
    (index: number) => {
      updateLocalSession({
        locations: removeItemAtIndex(localSession.locations, index),
      });
    },
    [localSession.locations, updateLocalSession]
  );

  const toggleNpcInvolved = useCallback(
    (npcId: string) => {
      updateLocalSession({
        npcsInvolved: toggleNpcInvolvedList(localSession.npcsInvolved, npcId),
      });
    },
    [localSession.npcsInvolved, updateLocalSession]
  );

  return (
    <SessionCardContent
      session={localSession}
      npcs={npcs}
      isExpanded={isExpanded}
      highlightInput={highlightInput}
      locationInput={locationInput}
      onToggle={onToggle}
      onDelete={onDelete}
      onTextChange={handleTextChange}
      onDateChange={handleDateChange}
      onBlur={handleBlur}
      onHighlightInputChange={setHighlightInput}
      onLocationInputChange={setLocationInput}
      onAddHighlight={addHighlight}
      onRemoveHighlight={removeHighlight}
      onAddLocation={addLocation}
      onRemoveLocation={removeLocation}
      onToggleNpcInvolved={toggleNpcInvolved}
    />
  );
}

function SessionCardContent({
  session,
  npcs,
  isExpanded,
  highlightInput,
  locationInput,
  onToggle,
  onDelete,
  onTextChange,
  onDateChange,
  onBlur,
  onHighlightInputChange,
  onLocationInputChange,
  onAddHighlight,
  onRemoveHighlight,
  onAddLocation,
  onRemoveLocation,
  onToggleNpcInvolved,
}: SessionCardContentProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <SessionHeader
            session={session}
            isExpanded={isExpanded}
            onDelete={event => {
              event.stopPropagation();
              onDelete();
            }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <SessionTextField
                label="Session Title"
                value={session.title}
                onChange={value => onTextChange('title', value)}
                onBlur={onBlur}
              />
              <SessionTextField
                label="Date Played"
                type="date"
                value={session.date ?? ''}
                onChange={onDateChange}
              />
            </div>

            <SessionTextAreaField
              label="Session Summary"
              value={session.summary}
              rows={4}
              placeholder="What happened during this session..."
              onChange={value => onTextChange('summary', value)}
              onBlur={onBlur}
            />

            <SessionBadgeListField
              label="Key Highlights"
              items={session.highlights}
              inputValue={highlightInput}
              inputPlaceholder="Add a highlight..."
              onInputChange={onHighlightInputChange}
              onAdd={onAddHighlight}
              onRemove={onRemoveHighlight}
              variant="outline"
            />

            <SessionBadgeListField
              label="Locations Visited"
              items={session.locations}
              inputValue={locationInput}
              inputPlaceholder="Add a location..."
              onInputChange={onLocationInputChange}
              onAdd={onAddLocation}
              onRemove={onRemoveLocation}
              icon={<Map className="h-3 w-3" />}
              variant="secondary"
            />

            <SessionNPCSelector
              npcs={npcs}
              selectedNPCs={session.npcsInvolved}
              onToggleNPC={onToggleNpcInvolved}
            />

            <SessionTextAreaField
              label="Quest/Story Progress"
              value={session.questProgress}
              placeholder="Notes on story or quest advancement..."
              onChange={value => onTextChange('questProgress', value)}
              onBlur={onBlur}
            />

            {session.playerNotes.length > 0 && (
              <div>
                <Label className="text-xs">Player Notes</Label>
                <div className="mt-1 space-y-2">
                  {session.playerNotes.map((pn, i) => (
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
