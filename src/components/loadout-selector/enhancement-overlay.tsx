import { Check, Pencil, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const MAX_CHARS = 200;

interface EditingFormProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

function EditingForm({
  draft,
  onDraftChange,
  onSave,
  onCancel,
  textareaRef,
}: EditingFormProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onDraftChange(e.target.value.slice(0, MAX_CHARS));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    }
    if (e.key === 'Escape') onCancel();
  }

  return (
    <div className="mt-1 space-y-1">
      <Textarea
        ref={textareaRef}
        value={draft}
        onChange={handleChange}
        maxLength={MAX_CHARS}
        rows={2}
        className="min-h-10 text-xs"
        placeholder="Enhancement text\u2026"
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[10px]">
          {draft.length}/{MAX_CHARS}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-5"
            onClick={onCancel}
            aria-label="Cancel editing"
          >
            <X className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-5 text-emerald-600"
            onClick={onSave}
            aria-label="Save enhancement"
          >
            <Check className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface EnhancementDisplayProps {
  text: string;
  readOnly?: boolean;
  onEdit: () => void;
}

function EnhancementDisplay({
  text,
  readOnly,
  onEdit,
}: EnhancementDisplayProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') onEdit();
  }

  return (
    <div
      className={cn(
        'bg-muted/50 mt-1 rounded px-2 py-1',
        !readOnly && 'hover:bg-muted cursor-pointer'
      )}
      onClick={readOnly ? undefined : onEdit}
      role={readOnly ? undefined : 'button'}
      tabIndex={readOnly ? undefined : 0}
      onKeyDown={readOnly ? undefined : handleKeyDown}
      aria-label={readOnly ? undefined : 'Edit enhancement text'}
    >
      <p className="text-muted-foreground text-xs italic">{text}</p>
    </div>
  );
}

interface EnhancementOverlayProps {
  text?: string;
  onChange?: (text: string) => void;
  readOnly?: boolean;
}

export function EnhancementOverlay({
  text,
  onChange,
  readOnly,
}: EnhancementOverlayProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function startEditing() {
    setDraft(text ?? '');
    setEditing(true);
    // Focus after render
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function save() {
    onChange?.(draft.trim());
    setEditing(false);
  }

  function cancel() {
    setDraft(text ?? '');
    setEditing(false);
  }

  if (editing) {
    return (
      <EditingForm
        draft={draft}
        onDraftChange={setDraft}
        onSave={save}
        onCancel={cancel}
        textareaRef={textareaRef}
      />
    );
  }

  if (text) {
    return (
      <EnhancementDisplay
        text={text}
        readOnly={readOnly}
        onEdit={startEditing}
      />
    );
  }

  if (readOnly) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground mt-1 h-6 gap-1 px-1 text-[10px]"
      onClick={startEditing}
    >
      <Pencil className="size-3" />
      Add Enhancement
    </Button>
  );
}
