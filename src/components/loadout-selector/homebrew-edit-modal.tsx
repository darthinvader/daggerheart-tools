import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';

import { CardFormFields } from './card-form-fields';

type HomebrewDraft = {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost: number;
};

export type HomebrewEditModalProps = {
  card: DomainCardLite | null;
  selection: LoadoutSelection;
  onClose: () => void;
  onSave: (updated: LoadoutSelection) => void;
};

export function HomebrewEditModal({
  card,
  selection,
  onClose,
  onSave,
}: HomebrewEditModalProps) {
  const [draft, setDraft] = useState<HomebrewDraft>(() =>
    card
      ? {
          name: card.name,
          level: card.level,
          domain: card.domain,
          type: card.type,
          description: card.description ?? '',
          hopeCost: card.hopeCost ?? 0,
        }
      : {
          name: '',
          level: 1,
          domain: 'Arcana',
          type: 'Spell',
          description: '',
          hopeCost: 1,
        }
  );

  const handleSave = useCallback(() => {
    if (!card) return;

    const updatedCard: DomainCardLite = {
      name: draft.name,
      level: draft.level,
      domain: draft.domain,
      type: draft.type,
      description: draft.description,
      hopeCost: draft.hopeCost,
      recallCost: card.recallCost,
      isHomebrew: true,
    };

    const originalName = card.name;
    const inActive = selection.activeCards.some(c => c.name === originalName);

    const updated: LoadoutSelection = {
      ...selection,
      activeCards: inActive
        ? selection.activeCards.map(c =>
            c.name === originalName ? updatedCard : c
          )
        : selection.activeCards,
      vaultCards: !inActive
        ? selection.vaultCards.map(c =>
            c.name === originalName ? updatedCard : c
          )
        : selection.vaultCards,
    };

    onSave(updated);
    onClose();
  }, [card, draft, selection, onSave, onClose]);

  return (
    <Dialog open={card !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🛠️</span>
            <span>Edit as Homebrew</span>
          </DialogTitle>
          <DialogDescription>
            Customize this domain card. Changes will mark it as homebrew.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <CardFormFields
            draft={draft}
            onUpdate={updates => setDraft(prev => ({ ...prev, ...updates }))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!draft.name.trim() || !draft.description.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
