import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
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

type CategoryOption = { value: string; label: string };

const BUILTIN_CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'session', label: 'Session' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'combat', label: 'Combat' },
  { value: 'travel', label: 'Travel' },
  { value: 'downtime', label: 'Downtime' },
  { value: 'custom', label: 'Custom' },
];

// -------------------------------------------------------------------------------------
// Sub-components
// -------------------------------------------------------------------------------------

function MoonPhasesSection({
  moonPhases,
}: {
  moonPhases: readonly MoonPhaseInfo[];
}) {
  if (moonPhases.length === 0) return null;

  return (
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
  );
}

function EventCard({
  event,
  categoryLabel,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  categoryLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between rounded-md border p-2 text-sm">
      <div className="flex-1">
        <div className="font-medium">{event.title}</div>
        {event.description && (
          <div className="text-muted-foreground">{event.description}</div>
        )}
        <span className="text-muted-foreground text-xs capitalize">
          {categoryLabel}
        </span>
      </div>
      <div className="ml-2 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onEdit}
          aria-label={`Edit ${event.title}`}
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive h-7 w-7"
          onClick={onDelete}
          aria-label={`Delete ${event.title}`}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function EventsList({
  events,
  adding,
  getCategoryLabel,
  onStartEditing,
  onDeleteEvent,
}: {
  events: readonly CalendarEvent[];
  adding: boolean;
  getCategoryLabel: (value: string) => string;
  onStartEditing: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}) {
  if (events.length === 0 && !adding) {
    return (
      <p className="text-muted-foreground text-sm">
        No events — select &quot;Add Event&quot; to create one.
      </p>
    );
  }

  return (
    <>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          categoryLabel={getCategoryLabel(event.category)}
          onEdit={() => onStartEditing(event)}
          onDelete={() => onDeleteEvent(event.id)}
        />
      ))}
    </>
  );
}

function EventForm({
  title,
  description,
  category,
  editingId,
  categoryOptions,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}: {
  title: string;
  description: string;
  category: string;
  editingId: string | null;
  categoryOptions: CategoryOption[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}) {
  const submitLabel = editingId ? 'Update' : 'Add';

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Input
        placeholder="Event title"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        maxLength={200}
        required
        autoFocus
        aria-label="Event title"
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => onDescriptionChange(e.target.value)}
        maxLength={2000}
        rows={2}
        aria-label="Event description"
      />
      <Select value={category} onValueChange={onCategoryChange}>
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
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AddEventButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="w-full">
      <Plus className="mr-1 h-3 w-3" />
      Add Event
    </Button>
  );
}

// -------------------------------------------------------------------------------------
// Form-state hook
// -------------------------------------------------------------------------------------

function useEventForm(
  dayIndex: number,
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void,
  onUpdateEvent: (event: CalendarEvent) => void
) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('custom');

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setCategory('custom');
    setAdding(false);
    setEditingId(null);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      const payload = {
        absoluteDay: dayIndex,
        title: title.trim(),
        description: description.trim(),
        category,
      };

      if (editingId) {
        onUpdateEvent({ id: editingId, ...payload });
      } else {
        onAddEvent(payload);
      }

      resetForm();
    },
    [
      dayIndex,
      title,
      description,
      category,
      editingId,
      onAddEvent,
      onUpdateEvent,
      resetForm,
    ]
  );

  const startEditing = useCallback((event: CalendarEvent) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setAdding(true);
  }, []);

  const startAdding = useCallback(() => setAdding(true), []);

  return {
    adding,
    editingId,
    title,
    description,
    category,
    setTitle,
    setDescription,
    setCategory,
    resetForm,
    handleSubmit,
    startEditing,
    startAdding,
  };
}

// -------------------------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------------------------

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
  const getCategoryLabel = useCallback(
    (value: string): string => {
      const match = categoryOptions.find(o => o.value === value);
      return match?.label ?? value;
    },
    [categoryOptions]
  );

  const {
    adding,
    editingId,
    title,
    description,
    category,
    setTitle,
    setDescription,
    setCategory,
    resetForm,
    handleSubmit,
    startEditing,
    startAdding,
  } = useEventForm(dayIndex, onAddEvent, onUpdateEvent);

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
        <MoonPhasesSection moonPhases={moonPhases} />

        <EventsList
          events={events}
          adding={adding}
          getCategoryLabel={getCategoryLabel}
          onStartEditing={startEditing}
          onDeleteEvent={onDeleteEvent}
        />

        {adding ? (
          <EventForm
            title={title}
            description={description}
            category={category}
            editingId={editingId}
            categoryOptions={categoryOptions}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onCategoryChange={setCategory}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        ) : (
          <AddEventButton onClick={startAdding} />
        )}
      </CardContent>
    </Card>
  );
}
