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
import { useEffect, useState } from 'react';

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
