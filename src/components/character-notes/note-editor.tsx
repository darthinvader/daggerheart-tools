import { useEffect, useRef, useState } from 'react';

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
  const [localContent, setLocalContent] = useState(note.content);
  const [localTitle, setLocalTitle] = useState(note.title);
  const [prevNoteId, setPrevNoteId] = useState(note.id);
  const noteRef = useRef(note);

  // Reset local state when note identity changes (switching notes)
  if (prevNoteId !== note.id) {
    setPrevNoteId(note.id);
    setLocalContent(note.content);
    setLocalTitle(note.title);
  }

  // Keep noteRef in sync outside of render
  useEffect(() => {
    noteRef.current = note;
  });

  // Debounce content changes to parent
  useEffect(() => {
    if (localContent === noteRef.current.content) return;
    const timer = setTimeout(() => {
      onChange({
        ...noteRef.current,
        content: localContent,
        updatedAt: new Date().toISOString(),
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [localContent, onChange]);

  // Debounce title changes to parent
  useEffect(() => {
    if (localTitle === noteRef.current.title) return;
    const timer = setTimeout(() => {
      onChange({
        ...noteRef.current,
        title: localTitle,
        updatedAt: new Date().toISOString(),
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [localTitle, onChange]);

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
            value={localTitle}
            onChange={e => setLocalTitle(e.target.value)}
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
          value={localContent}
          onChange={e => setLocalContent(e.target.value)}
          className="h-full min-h-50 resize-none"
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
    </div>
  );
}
