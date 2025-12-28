import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import { EquipmentEditor, type EquipmentState } from './equipment-editor';
import { EquipmentSummary } from './equipment-summary';

interface EquipmentDisplayProps {
  equipment: EquipmentState;
  onChange?: (equipment: EquipmentState) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyEquipment() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">🛡️</span>
      <p className="text-muted-foreground mt-2">No equipment selected</p>
      <p className="text-muted-foreground text-sm">
        Click edit to equip weapons and armor
      </p>
    </div>
  );
}

function QuickStats({ equipment }: { equipment: EquipmentState }) {
  const hasWeapons = equipment.primaryWeapon || equipment.secondaryWeapon;
  const hasArmor = equipment.armor;
  const hasWheelchair =
    equipment.useCombatWheelchair && equipment.combatWheelchair;
  const customCount = equipment.customSlots.length;

  return (
    <div className="flex flex-wrap gap-2">
      {hasWeapons && (
        <SmartTooltip content="Equipped weapons">
          <Badge
            variant="outline"
            className="gap-1 border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30"
          >
            ⚔️ {equipment.primaryWeapon ? '1' : '0'}
            {equipment.secondaryWeapon ? '+1' : ''} Weapon
            {equipment.primaryWeapon && equipment.secondaryWeapon ? 's' : ''}
          </Badge>
        </SmartTooltip>
      )}
      {hasArmor && (
        <SmartTooltip content={`Armor: ${equipment.armor?.name ?? 'Unknown'}`}>
          <Badge
            variant="outline"
            className="gap-1 border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
          >
            🛡️ Armored
          </Badge>
        </SmartTooltip>
      )}
      {hasWheelchair && (
        <SmartTooltip content="Combat wheelchair equipped">
          <Badge
            variant="outline"
            className="gap-1 border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30"
          >
            ♿ Wheelchair
          </Badge>
        </SmartTooltip>
      )}
      {customCount > 0 && (
        <SmartTooltip content={`${customCount} custom equipment slot(s)`}>
          <Badge variant="outline" className="gap-1">
            ✨ {customCount} Custom
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}

function EquipmentContent({ equipment }: { equipment: EquipmentState }) {
  const hasEquipment =
    equipment.primaryWeapon ||
    equipment.secondaryWeapon ||
    equipment.armor ||
    (equipment.useCombatWheelchair && equipment.combatWheelchair) ||
    equipment.customSlots.length > 0;

  if (!hasEquipment) {
    return <EmptyEquipment />;
  }

  return (
    <div className="space-y-4">
      <QuickStats equipment={equipment} />
      <Separator />
      <EquipmentSummary
        primaryWeapon={equipment.primaryWeapon}
        primaryWeaponMode={equipment.primaryWeaponMode}
        homebrewPrimaryWeapon={equipment.homebrewPrimaryWeapon}
        secondaryWeapon={equipment.secondaryWeapon}
        secondaryWeaponMode={equipment.secondaryWeaponMode}
        homebrewSecondaryWeapon={equipment.homebrewSecondaryWeapon}
        armor={equipment.armor}
        armorMode={equipment.armorMode}
        homebrewArmor={equipment.homebrewArmor}
        useCombatWheelchair={equipment.useCombatWheelchair}
        combatWheelchair={equipment.combatWheelchair}
        wheelchairMode={equipment.wheelchairMode}
        homebrewWheelchair={equipment.homebrewWheelchair}
        customSlots={equipment.customSlots}
      />
    </div>
  );
}

export function EquipmentDisplay({
  equipment,
  onChange,
  className,
  readOnly = false,
}: EquipmentDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftEquipment, setDraftEquipment] =
    useState<EquipmentState>(equipment);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftEquipment(equipment);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, equipment]);

  const handleSave = useCallback(() => {
    onChange?.(draftEquipment);
  }, [draftEquipment, onChange]);

  const handleCancel = useCallback(() => {
    setDraftEquipment(equipment);
  }, [equipment]);

  const handleChange = useCallback((newEquipment: EquipmentState) => {
    setDraftEquipment(newEquipment);
  }, []);

  return (
    <EditableSection
      title="Equipment"
      emoji="🛡️"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Manage Equipment"
      editDescription="Select and customize your weapons, armor, and special equipment."
      editContent={
        <EquipmentEditor value={draftEquipment} onChange={handleChange} />
      }
    >
      <EquipmentContent equipment={equipment} />
    </EditableSection>
  );
}
