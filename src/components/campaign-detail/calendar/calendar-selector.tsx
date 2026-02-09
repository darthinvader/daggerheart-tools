import {
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  calendarFromExport,
  exportCalendar,
  importCalendarDefinition,
} from '@/lib/calendar/calendar-export';
import type { Calendar } from '@/lib/schemas/calendar';
import {
  DEFAULT_CALENDAR_COLOR,
  MAX_CALENDARS_PER_CAMPAIGN,
} from '@/lib/schemas/calendar';
import { generateId } from '@/lib/utils';

// =====================================================================================
// CalendarSelector — Dropdown to switch / manage multiple calendars (A1)
// =====================================================================================

/** Trigger a browser download for a calendar export JSON. */
function triggerExportDownload(cal: Calendar): void {
  const json = exportCalendar(cal);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cal.name.replace(/[^a-zA-Z0-9-_ ]/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

interface CalendarSelectorProps {
  calendars: readonly Calendar[];
  activeCalendarId: string | undefined;
  onSwitch: (calendarId: string) => void;
  onCreate: (calendar: Calendar) => void;
  onDelete: (calendarId: string) => void;
  onRename: (calendarId: string, newName: string) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CalendarRenameFormProps {
  renameValue: string;
  onRenameValueChange: (value: string) => void;
  onCommitRename: () => void;
}

function CalendarRenameForm({
  renameValue,
  onRenameValueChange,
  onCommitRename,
}: CalendarRenameFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommitRename();
  };

  return (
    <form
      className="flex flex-1 items-center gap-1 px-2 py-1"
      onSubmit={handleSubmit}
    >
      <Input
        value={renameValue}
        onChange={e => onRenameValueChange(e.target.value)}
        maxLength={60}
        className="h-7 text-sm"
        autoFocus
        onBlur={onCommitRename}
        aria-label="Calendar name"
      />
    </form>
  );
}

interface CalendarItemActionsProps {
  cal: Calendar;
  canDelete: boolean;
  onStartRename: (cal: Calendar, e: React.MouseEvent) => void;
  onExport: (cal: Calendar, e: React.MouseEvent) => void;
  onDelete: (calId: string) => void;
  onCloseParent: () => void;
}

function CalendarItemActions({
  cal,
  canDelete,
  onStartRename,
  onExport,
  onDelete,
  onCloseParent,
}: CalendarItemActionsProps) {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloseParent();
    onDelete(cal.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={stopPropagation}
          aria-label={`${cal.name} options`}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem onClick={e => onStartRename(cal, e)}>
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={e => onExport(cal, e)}>
          <Download className="mr-2 h-3.5 w-3.5" />
          Export
        </DropdownMenuItem>
        {canDelete && (
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CalendarSelector({
  calendars,
  activeCalendarId,
  onSwitch,
  onCreate,
  onDelete,
  onRename,
}: CalendarSelectorProps) {
  const [open, setOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeName =
    calendars.find(c => c.id === activeCalendarId)?.name ?? 'Calendar';
  const atCapacity = calendars.length >= MAX_CALENDARS_PER_CAMPAIGN;
  const closeMenu = () => setOpen(false);

  const startRename = (cal: Calendar, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRenamingId(cal.id);
    setRenameValue(cal.name);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleExport = (cal: Calendar, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    triggerExportDownload(cal);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleNewCalendar = () => {
    // Clone the active calendar's definition with a fresh name/id/events
    const activeCalendar = calendars.find(c => c.id === activeCalendarId);
    if (!activeCalendar) return;
    const newCal: Calendar = {
      id: generateId(),
      name: `Calendar ${calendars.length + 1}`,
      color: DEFAULT_CALENDAR_COLOR,
      preset: activeCalendar.preset,
      definition: activeCalendar.definition,
      currentDay: 0,
      epochLabel: activeCalendar.epochLabel,
      eraName: activeCalendar.eraName,
      events: [],
      customCategories: [],
    };
    onCreate(newCal);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result as string;
      const result = importCalendarDefinition(raw);
      if (result.success) {
        const cal = calendarFromExport(result.data);
        onCreate(cal);
      } else {
        globalThis.alert(
          'Import failed: the selected file is not a valid calendar export.'
        );
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Switch calendar">
            <span
              className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  calendars.find(c => c.id === activeCalendarId)?.color ??
                  '#6366f1',
              }}
              aria-hidden="true"
            />
            {activeName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Calendars</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={activeCalendarId}
            onValueChange={onSwitch}
          >
            {calendars.map(cal => (
              <div key={cal.id} className="flex items-center">
                {renamingId === cal.id ? (
                  <CalendarRenameForm
                    renameValue={renameValue}
                    onRenameValueChange={setRenameValue}
                    onCommitRename={commitRename}
                  />
                ) : (
                  <DropdownMenuRadioItem value={cal.id} className="flex-1">
                    <span
                      className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cal.color }}
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate">{cal.name}</span>
                    <span className="text-muted-foreground ml-auto text-xs">
                      {cal.events.length}
                    </span>
                  </DropdownMenuRadioItem>
                )}

                <CalendarItemActions
                  cal={cal}
                  canDelete={calendars.length > 1}
                  onStartRename={startRename}
                  onExport={handleExport}
                  onDelete={onDelete}
                  onCloseParent={closeMenu}
                />
              </div>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={atCapacity} onClick={handleNewCalendar}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Calendar
            </DropdownMenuItem>
            <DropdownMenuItem disabled={atCapacity} onClick={handleImportClick}>
              <Upload className="mr-2 h-3.5 w-3.5" />
              Import Calendar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </>
  );
}
