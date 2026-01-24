import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { NOTE_CATEGORIES } from './constants';
import type { CharacterNote, NoteCategory } from './types';

interface NoteEditorProps {
  note: CharacterNote;
  onChange: (note: CharacterNote) => void;
}

export function NoteEditor({ note, onChange }: NoteEditorProps) {
  const handleChange = <K extends keyof CharacterNote>(
    key: K,
    value: CharacterNote[K]
  ) => {
    onChange({
      ...note,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Label htmlFor="note-title" className="sr-only">
            Title
          </Label>
          <Input
            id="note-title"
            placeholder="Note title..."
            value={note.title}
            onChange={e => handleChange('title', e.target.value)}
            className="text-lg font-medium"
          />
        </div>
        <Select
          value={note.category}
          onValueChange={v => handleChange('category', v as NoteCategory)}
        >
          <SelectTrigger className="w-35">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTE_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                <cat.icon className="size-4" /> {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-h-0 flex-1">
        <Label htmlFor="note-content" className="sr-only">
          Content
        </Label>
        <Textarea
          id="note-content"
          placeholder="Write your notes here..."
          value={note.content}
          onChange={e => handleChange('content', e.target.value)}
          className="h-full min-h-50 resize-none"
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
    </div>
  );
}
