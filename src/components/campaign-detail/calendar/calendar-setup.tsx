import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

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

export function CalendarSetup({ onSetup }: CalendarSetupProps) {
  const [mode, setMode] = useState<'pick' | 'custom'>('pick');
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

  const handlePreset = (factory: () => CalendarState) => {
    onSetup(factory());
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (months.length === 0 || weekdays.length === 0) return;

    const calendarId = generateId();
    const state: CalendarState = {
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

  if (mode === 'pick') {
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
            <Card
              key={preset.value}
              className="hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handlePreset(preset.factory)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePreset(preset.factory);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="font-medium">{preset.label}</div>
                <div className="text-muted-foreground text-sm">
                  {preset.desc}
                </div>
              </CardContent>
            </Card>
          ))}
          <Card
            className="hover:bg-accent cursor-pointer transition-colors"
            onClick={() => setMode('custom')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMode('custom');
              }
            }}
          >
            <CardContent className="p-4">
              <div className="font-medium">Custom Calendar</div>
              <div className="text-muted-foreground text-sm">
                Define your own months, weekdays, and more.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Custom Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            {/* Era / Epoch */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="era-name">Era Name</Label>
                <Input
                  id="era-name"
                  value={eraName}
                  onChange={e => setEraName(e.target.value)}
                  placeholder="e.g. Age of Dawn"
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="epoch-label">Epoch Label</Label>
                <Input
                  id="epoch-label"
                  value={epochLabel}
                  onChange={e => setEpochLabel(e.target.value)}
                  placeholder="e.g. AD"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Months */}
            <div>
              <Label>Months</Label>
              <div className="mt-1 space-y-1">
                {months.map((month, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={month.name}
                      onChange={e => updateMonth(idx, 'name', e.target.value)}
                      placeholder="Month name"
                      className="flex-1"
                      maxLength={60}
                      aria-label={`Month ${idx + 1} name`}
                    />
                    <Input
                      type="number"
                      value={month.days}
                      onChange={e =>
                        updateMonth(idx, 'days', Number(e.target.value))
                      }
                      min={1}
                      max={100}
                      className="w-20"
                      aria-label={`Days in ${month.name}`}
                    />
                    <span className="text-muted-foreground text-xs">days</span>
                    {months.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeMonth(idx)}
                        aria-label={`Remove ${month.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {months.length < 50 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMonth}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Month
                  </Button>
                )}
              </div>
            </div>

            {/* Weekdays */}
            <div>
              <Label>Weekday Names</Label>
              <Select
                value={String(weekdays.length)}
                onValueChange={v => {
                  const count = Number(v);
                  setWeekdays(
                    Array.from(
                      { length: count },
                      (_, i) => weekdays[i] || `Day ${i + 1}`
                    )
                  );
                }}
              >
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
                    onChange={e => {
                      setWeekdays(prev =>
                        prev.map((w, i) => (i === idx ? e.target.value : w))
                      );
                    }}
                    className="w-24"
                    maxLength={60}
                    aria-label={`Weekday ${idx + 1} name`}
                  />
                ))}
              </div>
            </div>

            {validationError && (
              <p className="text-destructive text-sm" role="alert">
                {validationError}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit">Create Calendar</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode('pick')}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
