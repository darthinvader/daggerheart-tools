import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ICON_SIZE_MD, Package, Plus, Wrench, Zap } from '@/lib/icons';
import type { HomebrewDomainCard } from '@/lib/schemas/loadout';

import { CardFormFields } from './card-form-fields';

interface HomebrewCardFormProps {
  onAdd: (card: HomebrewDomainCard) => void;
  onAddToLoadout?: (card: HomebrewDomainCard) => void;
  onAddToVault?: (card: HomebrewDomainCard) => void;
  isLoadoutFull?: boolean;
  isVaultFull?: boolean;
}

const EMPTY_CARD = {
  name: '',
  level: 1,
  domain: 'Arcana',
  type: 'Spell',
  description: '',
  hopeCost: 1,
  recallCost: 0,
  stressCost: 0,
  isActivated: true,
};

export function HomebrewCardForm({
  onAdd,
  onAddToLoadout,
  onAddToVault,
  isLoadoutFull = false,
  isVaultFull = false,
}: HomebrewCardFormProps) {
  const [draft, setDraft] = useState(EMPTY_CARD);

  const updateDraft = useCallback((updates: Partial<typeof EMPTY_CARD>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const createCard = useCallback(
    (): HomebrewDomainCard => ({ ...draft, isHomebrew: true }),
    [draft]
  );

  const resetAndAdd = useCallback(
    (
      action: (card: HomebrewDomainCard) => void,
      extraAction?: (card: HomebrewDomainCard) => void
    ) => {
      if (!draft.name || !draft.description) return;
      const card = createCard();
      action(card);
      extraAction?.(card);
      setDraft(EMPTY_CARD);
    },
    [draft, createCard]
  );

  const canAdd = draft.name.trim() && draft.description.trim();

  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge>
            <Wrench size={ICON_SIZE_MD} className="mr-1 inline-block" />
            Homebrew
          </Badge>
          <CardTitle className="text-base">Create Domain Card</CardTitle>
        </div>
        <CardDescription>
          Design a custom domain card for your character.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardFormFields draft={draft} onUpdate={updateDraft} />
        <div className="flex flex-wrap justify-end gap-2">
          {onAddToLoadout && (
            <Button
              onClick={() => resetAndAdd(onAdd, onAddToLoadout)}
              disabled={!canAdd || isLoadoutFull}
              variant="outline"
            >
              <Zap size={ICON_SIZE_MD} className="mr-1 inline-block" />
              Add to Loadout
            </Button>
          )}
          {onAddToVault && (
            <Button
              onClick={() => resetAndAdd(onAdd, onAddToVault)}
              disabled={!canAdd || isVaultFull}
              variant="outline"
            >
              <Package size={ICON_SIZE_MD} className="mr-1 inline-block" />
              Add to Vault
            </Button>
          )}
          <Button onClick={() => resetAndAdd(onAdd)} disabled={!canAdd}>
            <Plus size={ICON_SIZE_MD} className="mr-1 inline-block" />
            Add Card to Collection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
