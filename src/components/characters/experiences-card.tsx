import { Pencil, Trash2 } from 'lucide-react';

import * as React from 'react';

import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const TRAITS = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

export type ExperienceItem = {
  name: string;
  trait?: (typeof TRAITS)[number];
  bonus: number;
  notes?: string;
};

export type ExperiencesCardProps = {
  experiences: ExperienceItem[];
  addExperience: (item: ExperienceItem) => void;
  updateExperienceAt: (index: number, next: ExperienceItem) => void;
  removeExperienceAt: (index: number) => void;
};

export function ExperiencesCard({
  experiences,
  addExperience,
  updateExperienceAt,
  removeExperienceAt,
}: ExperiencesCardProps) {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState<ExperienceItem | null>(null);
  const [addingOpen, setAddingOpen] = React.useState(false);
  const [addDraft, setAddDraft] = React.useState<ExperienceItem | null>(null);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setDraft(experiences[index] ?? null);
  };
  const cancelEdit = () => {
    setEditingIndex(null);
    setDraft(null);
  };
  const saveEdit = (index: number) => {
    if (draft) updateExperienceAt(index, draft);
    setEditingIndex(null);
    setDraft(null);
  };

  // Reusable editor form used by both inline edit and add drawer
  function ExperienceEditorForm({
    value,
    onChange,
  }: {
    value: ExperienceItem;
    onChange: (next: ExperienceItem) => void;
  }) {
    return (
      <div className="space-y-3">
        <Input
          className="min-w-0 text-base font-medium md:text-lg"
          placeholder="Title"
          value={value.name}
          onChange={e => onChange({ ...value, name: e.target.value })}
        />

        <div className="flex flex-nowrap items-center gap-3">
          <Select
            value={value.trait}
            onValueChange={(v: (typeof TRAITS)[number]) =>
              onChange({ ...value, trait: v })
            }
          >
            <SelectTrigger className="w-[120px] shrink-0">
              <SelectValue placeholder="Trait" />
            </SelectTrigger>
            <SelectContent>
              {TRAITS.map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              aria-label="Decrease bonus"
              size="sm"
              variant="outline"
              onClick={() =>
                onChange({ ...value, bonus: Math.max(1, value.bonus - 1) })
              }
              disabled={value.bonus <= 1}
            >
              −
            </Button>
            <div className="min-w-10 text-center tabular-nums">
              +{value.bonus}
            </div>
            <Button
              aria-label="Increase bonus"
              size="sm"
              variant="outline"
              onClick={() => onChange({ ...value, bonus: value.bonus + 1 })}
            >
              +
            </Button>
          </div>
        </div>

        <Textarea
          placeholder="Notes"
          value={value.notes ?? ''}
          onChange={e => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    );
  }

  return (
    <Card>
      <CharacterCardHeader title="Experiences" />
      <CardContent className="space-y-4">
        {/* Experiences list */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Experiences</div>
          {experiences.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No experiences yet
            </div>
          ) : (
            <ul className="space-y-3">
              {experiences.map((exp, i) => (
                <li key={i} className="rounded-md border p-3">
                  {editingIndex === i ? (
                    <div className="space-y-3">
                      <ExperienceEditorForm
                        value={draft ?? exp}
                        onChange={next => setDraft(next)}
                      />
                      {/* Actions: Cancel / Save */}
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          aria-label="Cancel edit"
                          variant="ghost"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          aria-label="Save experience"
                          variant="outline"
                          onClick={() => saveEdit(i)}
                          disabled={!draft?.name?.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Name on its own line, larger */}
                      <div
                        className="text-base font-medium md:text-lg"
                        title={exp.name}
                      >
                        {exp.name}
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-muted-foreground text-sm">
                            {exp.trait ? `${exp.trait}, ` : ''}+{exp.bonus}
                          </div>
                          {exp.notes ? (
                            <div className="text-muted-foreground mt-1 text-sm break-words whitespace-pre-wrap">
                              {exp.notes}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            aria-label="Edit experience"
                            title="Edit"
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(i)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                aria-label="Remove experience"
                                title="Remove"
                                size="icon"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove this experience?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex justify-end gap-2">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeExperienceAt(i)}
                                >
                                  Remove
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {/* Add new: if a title is provided, add immediately; otherwise open drawer */}
          <AddExperienceRow
            onOpen={(prefillName?: string) => {
              const name = (prefillName ?? '').trim();
              if (name) {
                addExperience({ name, bonus: 2 });
                return;
              }
              setAddDraft({ name: '', bonus: 2 });
              setAddingOpen(true);
            }}
          />
        </div>
      </CardContent>

      {/* Add Experience Drawer */}
      <DrawerScaffold
        open={addingOpen}
        onOpenChange={open => {
          setAddingOpen(open);
          if (!open) setAddDraft(null);
        }}
        title="New Experience"
        onCancel={() => {
          setAddingOpen(false);
          setAddDraft(null);
        }}
        onSubmit={() => {
          if (addDraft && addDraft.name.trim()) {
            addExperience(addDraft);
            setAddingOpen(false);
            setAddDraft(null);
          }
        }}
        submitLabel="Add"
        submitDisabled={!addDraft?.name?.trim()}
      >
        {addDraft ? (
          <div className="py-2">
            <ExperienceEditorForm
              value={addDraft}
              onChange={next => setAddDraft(next)}
            />
          </div>
        ) : null}
      </DrawerScaffold>
    </Card>
  );
}

// Small helper to initiate add with an optional prefill name via input or button
function AddExperienceRow({
  onOpen,
}: {
  onOpen: (prefillName?: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="New experience title"
        aria-label="New experience title"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const el = e.target as HTMLInputElement;
            const name = el.value.trim();
            onOpen(name);
            el.value = '';
          }
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const el = document.querySelector<HTMLInputElement>(
            'input[placeholder="New experience title"]'
          );
          const name = el?.value.trim();
          onOpen(name);
          if (el) el.value = '';
        }}
      >
        Add
      </Button>
    </div>
  );
}
