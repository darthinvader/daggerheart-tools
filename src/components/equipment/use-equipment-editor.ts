import { useCallback, useState } from 'react';

import { generateId } from '@/lib/utils';

import type { CustomEquipment } from './custom-slot-editor';
import type { EquipmentState } from './equipment-editor';

type EditingSection =
  | 'primary'
  | 'secondary'
  | 'armor'
  | 'wheelchair'
  | 'custom'
  | null;

export function useEquipmentEditor(
  equipment: EquipmentState,
  onChange?: (equipment: EquipmentState) => void
) {
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [draftEquipment, setDraftEquipment] =
    useState<EquipmentState>(equipment);

  const openSection = useCallback(
    (section: EditingSection) => {
      setDraftEquipment(equipment);
      setEditingSection(section);
    },
    [equipment]
  );

  const closeSection = useCallback(() => {
    setEditingSection(null);
  }, []);

  const handleSave = useCallback(() => {
    onChange?.(draftEquipment);
    setEditingSection(null);
  }, [draftEquipment, onChange]);

  const updateDraft = useCallback((updates: Partial<EquipmentState>) => {
    setDraftEquipment(prev => ({ ...prev, ...updates }));
  }, []);

  const handleAddCustomSlot = useCallback(() => {
    const newSlot: CustomEquipment = {
      id: generateId(),
      name: '',
      slotName: 'Ring',
      slotIcon: '💍',
      description: '',
      features: [],
    };
    setDraftEquipment(prev => ({
      ...prev,
      customSlots: [...prev.customSlots, newSlot],
    }));
  }, []);

  return {
    editingSection,
    draftEquipment,
    openSection,
    closeSection,
    handleSave,
    updateDraft,
    handleAddCustomSlot,
  };
}

export function getSectionTitle(section: EditingSection): string {
  switch (section) {
    case 'primary':
      return 'Primary Weapon';
    case 'secondary':
      return 'Secondary Weapon';
    case 'armor':
      return 'Armor';
    case 'wheelchair':
      return 'Combat Wheelchair';
    case 'custom':
      return 'Custom Equipment';
    default:
      return 'Equipment';
  }
}

export function getSectionEmoji(section: EditingSection): string {
  switch (section) {
    case 'primary':
      return '⚔️';
    case 'secondary':
      return '🗡️';
    case 'armor':
      return '🛡️';
    case 'wheelchair':
      return '♿';
    case 'custom':
      return '💎';
    default:
      return '🛡️';
  }
}

export type { EditingSection };
