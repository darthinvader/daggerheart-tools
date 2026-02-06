import { Minus, Plus, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const MIN_DC = 5;
const MAX_DC = 30;

interface GlobalSaveDCProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

function clampDC(v: number): number {
  return Math.min(MAX_DC, Math.max(MIN_DC, v));
}

export default function GlobalSaveDC({
  value,
  onChange,
  className,
}: GlobalSaveDCProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  function commitEdit() {
    const parsed = parseInt(draft, 10);
    if (!Number.isNaN(parsed)) {
      onChange(clampDC(parsed));
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setDraft(String(value));
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-13 items-center gap-2 rounded-lg border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-2.5 py-2',
        className
      )}
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-1">
        <Target className="size-4 text-amber-500" />
        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
          DC
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-7 hover:bg-amber-500/20"
          onClick={() => onChange(clampDC(value - 1))}
          disabled={value <= MIN_DC}
          aria-label="Decrease DC"
        >
          <Minus className="size-3.5" />
        </Button>

        {isEditing ? (
          <Input
            ref={inputRef}
            type="number"
            min={MIN_DC}
            max={MAX_DC}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="h-8 w-12 border-amber-400/50 bg-amber-500/10 text-center text-lg font-black tabular-nums focus-visible:ring-amber-500"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(String(value));
              setIsEditing(true);
            }}
            className="flex h-8 min-w-10 cursor-pointer items-center justify-center rounded-md text-2xl font-black text-amber-600 tabular-nums transition-colors hover:bg-amber-500/20 dark:text-amber-400"
            aria-label={`DC ${value}, click to edit`}
          >
            {value}
          </button>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="size-7 hover:bg-amber-500/20"
          onClick={() => onChange(clampDC(value + 1))}
          disabled={value >= MAX_DC}
          aria-label="Increase DC"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
