import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createDaggerheartDefault,
  createGregorianLike,
  createHarptos,
} from '@/lib/calendar/calendar-presets';
import type { CalendarMonth, CalendarState } from '@/lib/schemas/calendar';
import {
  CALENDAR_SCHEMA_VERSION,
  CalendarStateSchema,
} from '@/lib/schemas/calendar';
import { generateId } from '@/lib/utils';

// =====================================================================================
// CalendarSetup — Preset picker + custom wizard
// =====================================================================================

interface CalendarSetupProps {
  onSetup: (calendar: CalendarState) => void;
}

const PRESETS = [
  {
    value: 'daggerheart-default' as const,
    label: 'Daggerheart Default',
    desc: '12 months × 30 days, 7-day weeks, 2 moons, 4 seasons',
    factory: createDaggerheartDefault,
  },
  {
    value: 'gregorian' as const,
    label: 'Gregorian',
    desc: '12 months (28–31 days), 7-day weeks, 1 moon',
    factory: createGregorianLike,
  },
  {
    value: 'harptos' as const,
    label: 'Harptos (Forgotten Realms)',
    desc: '12 months + 5 festival days, 10-day tendays, 1 moon',
    factory: createHarptos,
  },
];

// =====================================================================================
// Helpers
// =====================================================================================

/** Call `action` when Enter or Space is pressed, matching native button behavior. */
function handleActivationKeyDown(
  e: KeyboardEvent<HTMLElement>,
  action: () => void
) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
}

function buildCustomCalendarState(
  months: CalendarMonth[],
  weekdays: string[],
  epochLabel: string,
  eraName: string
): CalendarState {
  const calendarId = generateId();
  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: calendarId,
    calendars: [
      {
        id: calendarId,
        name: 'Main Calendar',
        color: '#6366f1',
        preset: 'custom',
        definition: {
          months,
          weekdays,
          moons: [],
          seasons: [],
        },
        currentDay: 0,
        epochLabel,
        eraName,
        events: [],
        customCategories: [],
      },
    ],
  };
}

// =====================================================================================
// Sub-components — Preset picker mode
// =====================================================================================

interface PresetCardProps {
  label: string;
  desc: string;
  onSelect: () => void;
}

function PresetCard({ label, desc, onSelect }: PresetCardProps) {
  return (
    <Card
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={e => handleActivationKeyDown(e, onSelect)}
    >
      <CardContent className="p-4">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground text-sm">{desc}</div>
      </CardContent>
    </Card>
  );
}

interface PresetPickerProps {
  onPreset: (factory: () => CalendarState) => void;
  onCustom: () => void;
}

function PresetPicker({ onPreset, onCustom }: PresetPickerProps) {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-8">
      <h3 className="text-center text-lg font-semibold">
        Set Up Your Calendar
      </h3>
      <p className="text-muted-foreground text-center text-sm">
        Choose a preset or create a custom calendar.
      </p>
      <div className="space-y-2">
        {PRESETS.map(preset => (
          <PresetCard
            key={preset.value}
            label={preset.label}
            desc={preset.desc}
            onSelect={() => onPreset(preset.factory)}
          />
        ))}
        <PresetCard
          label="Custom Calendar"
          desc="Define your own months, weekdays, and more."
          onSelect={onCustom}
        />
      </div>
    </div>
  );
}

// =====================================================================================
// Sub-components — Custom calendar form sections
// =====================================================================================

interface EraEpochSectionProps {
  eraName: string;
  epochLabel: string;
  onEraNameChange: (value: string) => void;
  onEpochLabelChange: (value: string) => void;
}

function EraEpochSection({
  eraName,
  epochLabel,
  onEraNameChange,
  onEpochLabelChange,
}: EraEpochSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label htmlFor="era-name">Era Name</Label>
        <Input
          id="era-name"
          value={eraName}
          onChange={e => onEraNameChange(e.target.value)}
          placeholder="e.g. Age of Dawn"
          maxLength={100}
        />
      </div>
      <div>
        <Label htmlFor="epoch-label">Epoch Label</Label>
        <Input
          id="epoch-label"
          value={epochLabel}
          onChange={e => onEpochLabelChange(e.target.value)}
          placeholder="e.g. AD"
          maxLength={100}
        />
      </div>
    </div>
  );
}

interface MonthRowProps {
  month: CalendarMonth;
  index: number;
  canRemove: boolean;
  onUpdate: (
    idx: number,
    field: keyof CalendarMonth,
    value: string | number
  ) => void;
  onRemove: (idx: number) => void;
}

function MonthRow({
  month,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: MonthRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={month.name}
        onChange={e => onUpdate(index, 'name', e.target.value)}
        placeholder="Month name"
        className="flex-1"
        maxLength={60}
        aria-label={`Month ${index + 1} name`}
      />
      <Input
        type="number"
        value={month.days}
        onChange={e => onUpdate(index, 'days', Number(e.target.value))}
        min={1}
        max={100}
        className="w-20"
        aria-label={`Days in ${month.name}`}
      />
      <span className="text-muted-foreground text-xs">days</span>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onRemove(index)}
          aria-label={`Remove ${month.name}`}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

interface MonthsSectionProps {
  months: CalendarMonth[];
  onUpdate: (
    idx: number,
    field: keyof CalendarMonth,
    value: string | number
  ) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
}

function MonthsSection({
  months,
  onUpdate,
  onRemove,
  onAdd,
}: MonthsSectionProps) {
  const canRemove = months.length > 1;
  const canAdd = months.length < 50;

  return (
    <div>
      <Label>Months</Label>
      <div className="mt-1 space-y-1">
        {months.map((month, idx) => (
          <MonthRow
            key={idx}
            month={month}
            index={idx}
            canRemove={canRemove}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
        {canAdd && (
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-3 w-3" />
            Add Month
          </Button>
        )}
      </div>
    </div>
  );
}

interface WeekdaysSectionProps {
  weekdays: string[];
  onWeekdaysChange: (weekdays: string[]) => void;
}

function WeekdaysSection({ weekdays, onWeekdaysChange }: WeekdaysSectionProps) {
  const handleCountChange = (v: string) => {
    const count = Number(v);
    onWeekdaysChange(
      Array.from({ length: count }, (_, i) => weekdays[i] || `Day ${i + 1}`)
    );
  };

  const handleNameChange = (idx: number, value: string) => {
    onWeekdaysChange(weekdays.map((w, i) => (i === idx ? value : w)));
  };

  return (
    <div>
      <Label>Weekday Names</Label>
      <Select value={String(weekdays.length)} onValueChange={handleCountChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 20 }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {i + 1} days per week
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-1 flex flex-wrap gap-1">
        {weekdays.map((wd, idx) => (
          <Input
            key={idx}
            value={wd}
            onChange={e => handleNameChange(idx, e.target.value)}
            className="w-24"
            maxLength={60}
            aria-label={`Weekday ${idx + 1} name`}
          />
        ))}
      </div>
    </div>
  );
}

// =====================================================================================
// Sub-component — Custom calendar form (wraps all sections)
// =====================================================================================

interface CustomCalendarFormProps {
  onSetup: (calendar: CalendarState) => void;
  onBack: () => void;
}

function CustomCalendarForm({ onSetup, onBack }: CustomCalendarFormProps) {
  const [months, setMonths] = useState<CalendarMonth[]>([
    { name: 'Month 1', days: 30 },
  ]);
  const [weekdays, setWeekdays] = useState<string[]>([
    'Day 1',
    'Day 2',
    'Day 3',
    'Day 4',
    'Day 5',
    'Day 6',
    'Day 7',
  ]);
  const [epochLabel, setEpochLabel] = useState('');
  const [eraName, setEraName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (months.length === 0 || weekdays.length === 0) return;

    const state = buildCustomCalendarState(
      months,
      weekdays,
      epochLabel,
      eraName
    );
    const result = CalendarStateSchema.safeParse(state);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setValidationError(
        firstError?.message ?? 'Invalid calendar configuration'
      );
      return;
    }
    setValidationError(null);
    onSetup(result.data);
  };

  const addMonth = () => {
    setMonths(prev => [
      ...prev,
      { name: `Month ${prev.length + 1}`, days: 30 },
    ]);
  };

  const removeMonth = (idx: number) => {
    setMonths(prev => prev.filter((_, i) => i !== idx));
  };

  const updateMonth = (
    idx: number,
    field: keyof CalendarMonth,
    value: string | number
  ) => {
    setMonths(prev =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Custom Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Era / Epoch */}
            <EraEpochSection
              eraName={eraName}
              epochLabel={epochLabel}
              onEraNameChange={setEraName}
              onEpochLabelChange={setEpochLabel}
            />

            {/* Months */}
            <MonthsSection
              months={months}
              onUpdate={updateMonth}
              onRemove={removeMonth}
              onAdd={addMonth}
            />

            {/* Weekdays */}
            <WeekdaysSection
              weekdays={weekdays}
              onWeekdaysChange={setWeekdays}
            />

            {validationError && (
              <p className="text-destructive text-sm" role="alert">
                {validationError}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit">Create Calendar</Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================================================
// Main exported component
// =====================================================================================

export function CalendarSetup({ onSetup }: CalendarSetupProps) {
  const [mode, setMode] = useState<'pick' | 'custom'>('pick');

  const handlePreset = (factory: () => CalendarState) => {
    onSetup(factory());
  };

  if (mode === 'pick') {
    return (
      <PresetPicker
        onPreset={handlePreset}
        onCustom={() => setMode('custom')}
      />
    );
  }

  return (
    <CustomCalendarForm onSetup={onSetup} onBack={() => setMode('pick')} />
  );
}
