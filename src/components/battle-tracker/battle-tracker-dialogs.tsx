import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';
import type { NewCharacterDraft } from './types';
import { DEFAULT_CHARACTER_DRAFT } from './utils';

interface BattleTrackerDialogsProps {
  dialogState: {
    isAddCharacterOpen: boolean;
    isAddAdversaryOpen: boolean;
    isAddEnvironmentOpen: boolean;
    characterDraft: NewCharacterDraft;
    adversarySearch: string;
    environmentSearch: string;
    filteredAdversaries: Adversary[];
    filteredEnvironments: Environment[];
  };
  dialogActions: {
    setIsAddCharacterOpen: (open: boolean) => void;
    setIsAddAdversaryOpen: (open: boolean) => void;
    setIsAddEnvironmentOpen: (open: boolean) => void;
    setCharacterDraft: (draft: NewCharacterDraft) => void;
    setAdversarySearch: (value: string) => void;
    setEnvironmentSearch: (value: string) => void;
  };
  onAddCharacter: () => void;
  onAddAdversary: (adversary: Adversary) => void;
  onAddEnvironment: (environment: Environment) => void;
}

export function BattleTrackerDialogs({
  dialogState,
  dialogActions,
  onAddCharacter,
  onAddAdversary,
  onAddEnvironment,
}: BattleTrackerDialogsProps) {
  return (
    <>
      <AddCharacterDialog
        isOpen={dialogState.isAddCharacterOpen}
        characterDraft={dialogState.characterDraft}
        onOpenChange={dialogActions.setIsAddCharacterOpen}
        onDraftChange={dialogActions.setCharacterDraft}
        onAdd={onAddCharacter}
      />
      <AddAdversaryDialog
        isOpen={dialogState.isAddAdversaryOpen}
        searchValue={dialogState.adversarySearch}
        adversaries={dialogState.filteredAdversaries}
        onOpenChange={dialogActions.setIsAddAdversaryOpen}
        onSearchChange={dialogActions.setAdversarySearch}
        onAdd={onAddAdversary}
      />
      <AddEnvironmentDialog
        isOpen={dialogState.isAddEnvironmentOpen}
        searchValue={dialogState.environmentSearch}
        environments={dialogState.filteredEnvironments}
        onOpenChange={dialogActions.setIsAddEnvironmentOpen}
        onSearchChange={dialogActions.setEnvironmentSearch}
        onAdd={onAddEnvironment}
      />
    </>
  );
}

function AddCharacterDialog({
  isOpen,
  characterDraft,
  onOpenChange,
  onDraftChange,
  onAdd,
}: {
  isOpen: boolean;
  characterDraft: NewCharacterDraft;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (draft: NewCharacterDraft) => void;
  onAdd: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Character</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={characterDraft.name}
              onChange={event =>
                onDraftChange({
                  ...characterDraft,
                  name: event.target.value,
                })
              }
              placeholder="Character name"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Evasion</label>
              <Input
                type="number"
                value={characterDraft.evasion}
                onChange={event =>
                  onDraftChange({
                    ...characterDraft,
                    evasion: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">HP Max</label>
              <Input
                type="number"
                value={characterDraft.hpMax}
                onChange={event =>
                  onDraftChange({
                    ...characterDraft,
                    hpMax: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stress Max</label>
              <Input
                type="number"
                value={characterDraft.stressMax}
                onChange={event =>
                  onDraftChange({
                    ...characterDraft,
                    stressMax: event.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onDraftChange(DEFAULT_CHARACTER_DRAFT);
            }}
          >
            Cancel
          </Button>
          <Button onClick={onAdd}>Add Character</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddAdversaryDialog({
  isOpen,
  searchValue,
  adversaries,
  onOpenChange,
  onSearchChange,
  onAdd,
}: {
  isOpen: boolean;
  searchValue: string;
  adversaries: Adversary[];
  onOpenChange: (open: boolean) => void;
  onSearchChange: (value: string) => void;
  onAdd: (adversary: Adversary) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col sm:h-auto sm:max-h-[85vh] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Adversary</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground size-4" />
          <Input
            value={searchValue}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search adversaries"
          />
        </div>
        <ScrollArea className="mt-4 h-full pr-3">
          <div className="space-y-3">
            {adversaries.map(adversary => (
              <Card key={adversary.name}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{adversary.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {adversary.role} · Tier {adversary.tier} · Diff{' '}
                      {adversary.difficulty}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => onAdd(adversary)}>
                    <Plus className="mr-1 size-4" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddEnvironmentDialog({
  isOpen,
  searchValue,
  environments,
  onOpenChange,
  onSearchChange,
  onAdd,
}: {
  isOpen: boolean;
  searchValue: string;
  environments: Environment[];
  onOpenChange: (open: boolean) => void;
  onSearchChange: (value: string) => void;
  onAdd: (environment: Environment) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col sm:h-auto sm:max-h-[85vh] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Environment</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground size-4" />
          <Input
            value={searchValue}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search environments"
          />
        </div>
        <ScrollArea className="mt-4 h-full pr-3">
          <div className="space-y-3">
            {environments.map(environment => (
              <Card key={environment.name}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{environment.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {environment.type} · Tier {environment.tier}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => onAdd(environment)}>
                    <Plus className="mr-1 size-4" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
