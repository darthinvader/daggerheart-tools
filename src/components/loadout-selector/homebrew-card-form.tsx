import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🛠️</span>
          <span>Create Homebrew Card</span>
        </CardTitle>
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
              ⚡ Add to Loadout
            </Button>
          )}
          {onAddToVault && (
            <Button
              onClick={() => resetAndAdd(onAdd, onAddToVault)}
              disabled={!canAdd || isVaultFull}
              variant="outline"
            >
              📦 Add to Vault
            </Button>
          )}
          <Button onClick={() => resetAndAdd(onAdd)} disabled={!canAdd}>
            ➕ Add Card to Collection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
