/**
 * Homebrew Equipment Form
 *
 * Form for creating and editing homebrew weapons, armor, and combat wheelchairs.
 * Uses discriminated union (weapon | armor | wheelchair) per schema.
 */
import { Accessibility, Gem, Shield, Sword } from 'lucide-react';
import { useCallback } from 'react';

import { SLOT_PRESETS } from '@/components/equipment/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HomebrewEquipment } from '@/lib/schemas/homebrew';

import {
  ArmorSection,
  CustomEquipmentSection,
  EquipmentDescriptionSection,
  EquipmentFeaturesSection,
  EquipmentFormActions,
  WeaponSection,
  WheelchairSection,
} from './equipment-form-sections';
import { useEquipmentFormState } from './use-equipment-form-state';

/** Export the equipment content type for external use */
export type EquipmentFormData = HomebrewEquipment['content'];

interface EquipmentFormProps {
  initialData?: EquipmentFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: EquipmentFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: EquipmentFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
  /** Lock to a specific equipment type (hides tabs) */
  lockedType?: 'weapon' | 'armor' | 'wheelchair' | 'custom';
  /** Compact mode - removes ScrollArea wrapper for inline usage */
  compact?: boolean;
}

export function EquipmentForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
  lockedType,
  compact = false,
}: EquipmentFormProps) {
  // Use consolidated hook for all state management
  const {
    equipmentType,
    handleTypeChange,
    weaponData,
    setWeaponData,
    armorData,
    setArmorData,
    wheelchairData,
    setWheelchairData,
    customData,
    setCustomData,
    features,
    addFeature,
    removeFeature,
    updateFeature,
    handleDescriptionChange,
    currentDescription,
    isSubmitDisabled,
    currentData,
  } = useEquipmentFormState({ initialData, onChange, lockedType });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(currentData);
      }
    },
    [onSubmit, currentData]
  );

  // Form content that goes inside either ScrollArea or div based on compact mode
  const formContent = (
    <div className="space-y-6">
      {/* Equipment Type Tabs - hidden when lockedType is set */}
      <Tabs
        value={equipmentType}
        onValueChange={v =>
          handleTypeChange(v as 'weapon' | 'armor' | 'wheelchair' | 'custom')
        }
      >
        {!lockedType && (
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weapon" className="gap-2">
              <Sword className="size-4" /> Weapon
            </TabsTrigger>
            <TabsTrigger value="armor" className="gap-2">
              <Shield className="size-4" /> Armor
            </TabsTrigger>
            <TabsTrigger value="wheelchair" className="gap-2">
              <Accessibility className="size-4" /> Wheelchair
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-2">
              <Gem className="size-4" /> Custom
            </TabsTrigger>
          </TabsList>
        )}

        {/* Weapon Form */}
        <TabsContent
          value="weapon"
          className={lockedType ? '' : 'mt-4 space-y-6'}
        >
          <WeaponSection data={weaponData} onChange={setWeaponData} />
        </TabsContent>

        {/* Armor Form */}
        <TabsContent value="armor" className="mt-4 space-y-6">
          <ArmorSection data={armorData} onChange={setArmorData} />
        </TabsContent>

        {/* Combat Wheelchair Form */}
        <TabsContent value="wheelchair" className="mt-4 space-y-6">
          <WheelchairSection
            data={wheelchairData}
            onChange={setWheelchairData}
          />
        </TabsContent>

        {/* Custom Equipment Form */}
        <TabsContent value="custom" className="mt-4 space-y-6">
          <CustomEquipmentSection
            data={customData}
            onChange={setCustomData}
            slotPresets={SLOT_PRESETS}
          />
        </TabsContent>
      </Tabs>

      <Separator />

      <EquipmentFeaturesSection
        features={features}
        onAdd={addFeature}
        onRemove={removeFeature}
        onUpdate={updateFeature}
      />

      <EquipmentDescriptionSection
        description={currentDescription}
        onChange={handleDescriptionChange}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {compact ? (
        formContent
      ) : (
        <ScrollArea className="h-[60vh] pr-4">{formContent}</ScrollArea>
      )}

      {showActions && (
        <EquipmentFormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isDisabled={isSubmitDisabled}
          equipmentType={equipmentType}
        />
      )}
    </form>
  );
}
