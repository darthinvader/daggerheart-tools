import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { SessionEntry } from './types';

interface NotableEventsEditorProps {
  events: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

function NotableEventsEditor({
  events,
  onAdd,
  onUpdate,
  onRemove,
}: NotableEventsEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Notable Events</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {events.map((event, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={event}
              onChange={e => onUpdate(i, e.target.value)}
              placeholder="What happened?"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-muted-foreground text-sm">No events recorded</p>
        )}
      </div>
    </div>
  );
}

interface SessionEditorProps {
  session: SessionEntry;
  onChange: (session: SessionEntry) => void;
}

export function SessionEditor({ session, onChange }: SessionEditorProps) {
  const handleChange = <K extends keyof SessionEntry>(
    key: K,
    value: SessionEntry[K]
  ) => {
    onChange({ ...session, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="session-title">Title (optional)</Label>
          <Input
            id="session-title"
            value={session.title ?? ''}
            onChange={e => handleChange('title', e.target.value || undefined)}
            placeholder="e.g., The Dragon's Lair"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-date">Date</Label>
          <Input
            id="session-date"
            type="date"
            value={session.date.split('T')[0]}
            onChange={e =>
              handleChange('date', new Date(e.target.value).toISOString())
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="session-summary">Summary</Label>
        <Textarea
          id="session-summary"
          value={session.summary ?? ''}
          onChange={e => handleChange('summary', e.target.value || undefined)}
          placeholder="What happened this session?"
          className="min-h-24 resize-y sm:min-h-32"
          rows={5}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="session-xp">XP Gained</Label>
          <Input
            id="session-xp"
            type="number"
            min={0}
            value={session.xpGained}
            onChange={e =>
              handleChange(
                'xpGained',
                Math.max(0, parseInt(e.target.value) || 0)
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-gold">Gold Gained</Label>
          <Input
            id="session-gold"
            type="number"
            min={0}
            value={session.goldGained}
            onChange={e =>
              handleChange(
                'goldGained',
                Math.max(0, parseInt(e.target.value) || 0)
              )
            }
          />
        </div>
      </div>

      <NotableEventsEditor
        events={session.notableEvents}
        onAdd={() =>
          handleChange('notableEvents', [...session.notableEvents, ''])
        }
        onUpdate={(index, value) => {
          const events = [...session.notableEvents];
          events[index] = value;
          handleChange('notableEvents', events);
        }}
        onRemove={index =>
          handleChange(
            'notableEvents',
            session.notableEvents.filter((_, i) => i !== index)
          )
        }
      />
    </div>
  );
}
