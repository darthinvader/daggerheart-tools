import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { HomebrewEditModal } from './homebrew-edit-modal';
import { LoadoutContent } from './loadout-content';
import {
  createHomebrewSaveHandler,
  createMaxActiveCardsHandler,
  createMoveCardHandler,
  createSwapToActiveHandler,
  createSwapToVaultHandler,
} from './loadout-handlers';
import { LoadoutSelector } from './loadout-selector';

type LoadoutDisplayProps = {
  selection: LoadoutSelection;
  onChange?: (selection: LoadoutSelection) => void;
  classDomains: string[];
  tier?: string;
  className?: string;
  readOnly?: boolean;
};

export function LoadoutDisplay({
  selection,
  onChange,
  classDomains,
  tier = '1',
  className,
  readOnly = false,
}: LoadoutDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelection, setDraftSelection] =
    useState<LoadoutSelection>(selection);
  const [maxActiveCards, setMaxActiveCards] = useState(5);
  const [homebrewEditCard, setHomebrewEditCard] =
    useState<DomainCardLite | null>(null);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) setDraftSelection(selection);
    setIsEditing(prev => !prev);
  }, [isEditing, selection]);

  const handleSave = useCallback(
    () => onChange?.(draftSelection),
    [draftSelection, onChange]
  );
  const handleCancel = useCallback(
    () => setDraftSelection(selection),
    [selection]
  );
  const handleChange = useCallback(
    (newSelection: LoadoutSelection) => setDraftSelection(newSelection),
    []
  );
  const handleComplete = useCallback(
    (completedSelection: LoadoutSelection) =>
      setDraftSelection(completedSelection),
    []
  );

  const activeCardsLength = selection?.activeCards?.length ?? 0;
  const handleChangeMaxActiveCards = useMemo(
    () => createMaxActiveCardsHandler(setMaxActiveCards, activeCardsLength),
    [activeCardsLength]
  );
  const handleSwapToVault = useMemo(
    () => createSwapToVaultHandler(selection, onChange),
    [selection, onChange]
  );
  const handleSwapToActive = useMemo(
    () => createSwapToActiveHandler(selection, maxActiveCards, onChange),
    [selection, maxActiveCards, onChange]
  );
  const handleMoveCard = useMemo(
    () => createMoveCardHandler(selection, maxActiveCards, onChange),
    [selection, maxActiveCards, onChange]
  );
  const handleHomebrewSave = useMemo(
    () => createHomebrewSaveHandler(onChange),
    [onChange]
  );

  return (
    <EditableSection
      title="Domain Loadout"
      emoji="📜"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Build Your Domain Loadout"
      editDescription="Select domain cards for your active loadout and vault."
      editContent={
        <LoadoutSelector
          value={draftSelection}
          onChange={handleChange}
          onComplete={handleComplete}
          classDomains={classDomains}
          tier={tier}
          hideHeader
        />
      }
    >
      <LoadoutContent
        selection={selection}
        onSwapToVault={readOnly ? undefined : handleSwapToVault}
        onSwapToActive={readOnly ? undefined : handleSwapToActive}
        onMoveCard={readOnly ? undefined : handleMoveCard}
        maxActiveCards={maxActiveCards}
        onChangeMaxActiveCards={
          readOnly ? undefined : handleChangeMaxActiveCards
        }
        onConvertToHomebrew={readOnly ? undefined : setHomebrewEditCard}
        onEdit={!readOnly ? handleEditToggle : undefined}
      />
      <HomebrewEditModal
        card={homebrewEditCard}
        selection={selection}
        onClose={() => setHomebrewEditCard(null)}
        onSave={handleHomebrewSave}
      />
    </EditableSection>
  );
}
