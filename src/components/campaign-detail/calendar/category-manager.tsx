import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CustomCategory } from '@/lib/schemas/calendar';
import { generateId } from '@/lib/utils';

import { CalendarColorPicker } from './calendar-color-picker';

// =====================================================================================
// CategoryManager — CRUD for custom event categories (C4)
// =====================================================================================

interface CategoryManagerProps {
  categories: readonly CustomCategory[];
  onAdd: (category: CustomCategory) => void;
  onUpdate: (category: CustomCategory) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');

  const resetForm = () => {
    setName('');
    setColor('#6366f1');
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdate({ id: editingId, name: name.trim(), color });
    } else {
      onAdd({ id: generateId(), name: name.trim(), color });
    }
    resetForm();
  };

  const startEditing = (cat: CustomCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setColor(cat.color);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        setOpen(o);
        if (!o) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-3 w-3" />
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Event Categories</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {/* Existing categories list */}
          {categories.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No custom categories yet.
            </p>
          )}
          {categories.map(cat => (
            <div
              key={cat.id}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-sm">{cat.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => startEditing(cat)}
                aria-label={`Edit ${cat.name}`}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-7 w-7"
                onClick={() => onDelete(cat.id)}
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* Add / edit form */}
          <form onSubmit={handleSubmit} className="space-y-2 border-t pt-3">
            <div>
              <Label htmlFor="cat-name">
                {editingId ? 'Edit Category' : 'New Category'}
              </Label>
              <Input
                id="cat-name"
                placeholder="Category name"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
                required
                autoFocus={!!editingId}
              />
            </div>
            <div>
              <Label id="cat-color-label">Color</Label>
              <CalendarColorPicker
                value={color}
                onChange={setColor}
                labelId="cat-color-label"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                {editingId ? 'Update' : 'Add'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
