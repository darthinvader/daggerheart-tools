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
import { ICON_SIZE_MD, Package, Wrench, Zap } from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import type { HomebrewDomainCard } from '@/lib/schemas/loadout';
import { getCardCosts, getTotalHopeCost } from '@/lib/utils/card-costs';

import { CardFormFields } from './card-form-fields';

type HomebrewDraft = {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost: number;
  recallCost: number;
  stressCost: number;
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
      recallCost: 0,
      stressCost: 0,
    };
  }
  const costs = getCardCosts(card);
  const totalHope = getTotalHopeCost(costs.activationCosts);
  const stressCost = costs.activationCosts
    .filter(cost => cost.type === 'Stress')
    .reduce((sum, cost) => sum + (cost.amount === 'any' ? 0 : cost.amount), 0);

  return {
    name: card.name,
    level: card.level,
    domain: card.domain,
    type: card.type,
    description: card.description,
    hopeCost: totalHope === 'variable' ? 0 : totalHope,
    recallCost: card.recallCost ?? card.hopeCost ?? 0,
    stressCost,
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
      tags: card.tags,
      modifiers: card.modifiers,
      metadata: card.metadata,
      isActivated: true,
      isHomebrew: true,
    }),
    [draft, card]
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
      <DialogContent className="flex max-h-[85vh] w-[95vw] flex-col overflow-hidden sm:max-h-[90vh] sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Wrench size={ICON_SIZE_MD} />
            <span>Edit as Homebrew</span>
          </DialogTitle>
          <DialogDescription>
            Customize this card and add it to your loadout or vault as a
            homebrew version.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-4">
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
            <Package size={ICON_SIZE_MD} className="mr-1 inline-block" />
            Add to Vault
          </Button>
          <Button
            onClick={handleSaveToLoadout}
            disabled={!canSave || isLoadoutFull}
          >
            <Zap size={ICON_SIZE_MD} className="mr-1 inline-block" />
            Add to Loadout
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
