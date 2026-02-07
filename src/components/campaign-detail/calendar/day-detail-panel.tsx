import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CalendarDate } from '@/lib/calendar/calendar-engine';
import type { CalendarEvent, CustomCategory } from '@/lib/schemas/calendar';

import type { MoonPhaseInfo } from '../use-calendar-state';
import { MoonPhaseIcon } from './moon-phase-icon';

// =====================================================================================
// DayDetailPanel — Events CRUD for a selected day
// =====================================================================================

interface DayDetailPanelProps {
  dayIndex: number;
  date: CalendarDate;
  monthName: string;
  weekday: string;
  events: readonly CalendarEvent[];
  moonPhases: readonly MoonPhaseInfo[];
  customCategories: readonly CustomCategory[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

const BUILTIN_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'session', label: 'Session' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'combat', label: 'Combat' },
  { value: 'travel', label: 'Travel' },
  { value: 'downtime', label: 'Downtime' },
  { value: 'custom', label: 'Custom' },
];

export function DayDetailPanel({
  dayIndex,
  date,
  monthName,
  weekday,
  events,
  moonPhases,
  customCategories,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onClose,
}: DayDetailPanelProps) {
  const categoryOptions = useMemo(() => {
    const custom = customCategories.map(c => ({ value: c.id, label: c.name }));
    return [...BUILTIN_CATEGORY_OPTIONS, ...custom];
  }, [customCategories]);

  /** Resolve a category value (built-in name or custom UUID) to a display label. */
  const getCategoryLabel = (value: string): string => {
    const match = categoryOptions.find(o => o.value === value);
    return match?.label ?? value;
  };
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('custom');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('custom');
    setAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onUpdateEvent({
        id: editingId,
        absoluteDay: dayIndex,
        title: title.trim(),
        description: description.trim(),
        category,
      });
    } else {
      onAddEvent({
        absoluteDay: dayIndex,
        title: title.trim(),
        description: description.trim(),
        category,
      });
    }
    resetForm();
  };

  const startEditing = (event: CalendarEvent) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setAdding(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">
          {weekday}, {monthName} {date.dayOfMonth + 1}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close day details"
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Moon phases for this day */}
        {moonPhases.length > 0 && (
          <div className="flex gap-2">
            {moonPhases.map(mp => (
              <span
                key={mp.name}
                className="text-muted-foreground flex items-center gap-1 text-xs"
              >
                <MoonPhaseIcon
                  phase={mp.phase}
                  moonName={mp.name}
                  phaseName={mp.phaseName}
                  illumination={mp.illumination}
                  size={14}
                />
                {mp.phaseName}
              </span>
            ))}
          </div>
        )}

        {/* Events list */}
        {events.length === 0 && !adding && (
          <p className="text-muted-foreground text-sm">
            No events — select &quot;Add Event&quot; to create one.
          </p>
        )}
        {events.map(event => (
          <div
            key={event.id}
            className="flex items-start justify-between rounded-md border p-2 text-sm"
          >
            <div className="flex-1">
              <div className="font-medium">{event.title}</div>
              {event.description && (
                <div className="text-muted-foreground">{event.description}</div>
              )}
              <span className="text-muted-foreground text-xs capitalize">
                {getCategoryLabel(event.category)}
              </span>
            </div>
            <div className="ml-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => startEditing(event)}
                aria-label={`Edit ${event.title}`}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-7 w-7"
                onClick={() => onDeleteEvent(event.id)}
                aria-label={`Delete ${event.title}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add/Edit event form */}
        {adding ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              placeholder="Event title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
              required
              autoFocus
              aria-label="Event title"
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={2000}
              rows={2}
              aria-label="Event description"
            />
            <Select value={category} onValueChange={v => setCategory(v)}>
              <SelectTrigger aria-label="Event category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                {editingId ? 'Update' : 'Add'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdding(true)}
            className="w-full"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Event
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
