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
import type { DomainCard } from '@/lib/schemas/domains';
import type { HomebrewDomainCard } from '@/lib/schemas/loadout';

import { CardFormFields } from './card-form-fields';

type HomebrewDraft = {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost: number;
};

function createDraftFromCard(card: DomainCard | null): HomebrewDraft {
  if (!card) {
    return {
      name: '',
      level: 1,
      domain: 'Arcana',
      type: 'Spell',
      description: '',
      hopeCost: 1,
    };
  }
  return {
    name: card.name,
    level: card.level,
    domain: card.domain,
    type: card.type,
    description: card.description,
    hopeCost: card.hopeCost ?? 1,
  };
}

interface HomebrewFromCardModalProps {
  card: DomainCard | null;
  onClose: () => void;
  onSave: (card: HomebrewDomainCard, destination: 'loadout' | 'vault') => void;
  isLoadoutFull?: boolean;
  isVaultFull?: boolean;
}

// Inner component that resets when card changes via key
function HomebrewFromCardModalContent({
  card,
  onClose,
  onSave,
  isLoadoutFull,
  isVaultFull,
}: HomebrewFromCardModalProps & { card: DomainCard }) {
  const [draft, setDraft] = useState<HomebrewDraft>(() =>
    createDraftFromCard(card)
  );

  const createHomebrewCard = useCallback(
    (): HomebrewDomainCard => ({
      ...draft,
      isHomebrew: true,
    }),
    [draft]
  );

  const handleSaveToLoadout = useCallback(() => {
    if (!draft.name.trim() || !draft.description.trim()) return;
    onSave(createHomebrewCard(), 'loadout');
  }, [draft, createHomebrewCard, onSave]);

  const handleSaveToVault = useCallback(() => {
    if (!draft.name.trim() || !draft.description.trim()) return;
    onSave(createHomebrewCard(), 'vault');
  }, [draft, createHomebrewCard, onSave]);

  const canSave = draft.name.trim() && draft.description.trim();

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-162.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🛠️</span>
            <span>Edit as Homebrew</span>
          </DialogTitle>
          <DialogDescription>
            Customize this card and add it to your loadout or vault as a
            homebrew version.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <CardFormFields
            draft={draft}
            onUpdate={updates => setDraft(prev => ({ ...prev, ...updates }))}
          />
        </div>
        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveToVault}
            disabled={!canSave || isVaultFull}
          >
            📦 Add to Vault
          </Button>
          <Button
            onClick={handleSaveToLoadout}
            disabled={!canSave || isLoadoutFull}
          >
            ⚡ Add to Loadout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Wrapper that only renders content when card exists, using key to reset state
export function HomebrewFromCardModal({
  card,
  onClose,
  onSave,
  isLoadoutFull = false,
  isVaultFull = false,
}: HomebrewFromCardModalProps) {
  if (!card) return null;

  return (
    <HomebrewFromCardModalContent
      key={card.name}
      card={card}
      onClose={onClose}
      onSave={onSave}
      isLoadoutFull={isLoadoutFull}
      isVaultFull={isVaultFull}
    />
  );
}
