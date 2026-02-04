import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import type { LucideProps } from '@/lib/icons';
import { Axe, Power, Sword, Wheelchair } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { ClickableCard } from './clickable-card';
import type { EquipmentState } from './equipment-editor';
import { ArmorSummaryCard, WeaponSummaryCard } from './summary';
import type {
  ArmorDisplayData,
  WeaponDisplayData,
} from './summary/data-helpers';
import type { EditingSection } from './use-equipment-editor';

type IconComponent = ComponentType<LucideProps>;

interface WeaponCardProps {
  icon: IconComponent;
  label: string;
  data: WeaponDisplayData;
  isHomebrew: boolean;
  section: EditingSection;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
  isActivated?: boolean;
  onToggleActivated?: () => void;
}

export function WeaponCard({
  icon,
  label,
  data,
  isHomebrew,
  section,
  readOnly,
  openSection,
  isActivated = true,
  onToggleActivated,
}: WeaponCardProps) {
  return (
    <div className={cn('relative', !isActivated && 'opacity-50')}>
      <ClickableCard onClick={() => openSection(section)} disabled={readOnly}>
        <WeaponSummaryCard
          icon={icon}
          label={label}
          name={data.name}
          isHomebrew={isHomebrew}
          isEmpty={data.isEmpty}
          damage={data.damage}
          range={data.range}
          trait={data.trait}
          burden={data.burden}
          features={data.features}
          tier={data.tier}
          description={data.description}
        />
      </ClickableCard>
      {onToggleActivated && !data.isEmpty && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 z-10 h-7 w-7 p-0"
          onClick={e => {
            e.stopPropagation();
            onToggleActivated();
          }}
          title={isActivated ? 'Deactivate equipment' : 'Activate equipment'}
        >
          <Power
            className={cn(
              'h-4 w-4',
              isActivated ? 'text-green-500' : 'text-muted-foreground'
            )}
          />
        </Button>
      )}
    </div>
  );
}

interface ArmorCardProps {
  data: ArmorDisplayData;
  isHomebrew: boolean;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
  isActivated?: boolean;
  onToggleActivated?: () => void;
}

export function ArmorCard({
  data,
  isHomebrew,
  readOnly,
  openSection,
  isActivated = true,
  onToggleActivated,
}: ArmorCardProps) {
  return (
    <div className={cn('relative', !isActivated && 'opacity-50')}>
      <ClickableCard onClick={() => openSection('armor')} disabled={readOnly}>
        <ArmorSummaryCard
          name={data.name}
          isHomebrew={isHomebrew}
          isEmpty={data.isEmpty}
          baseScore={data.baseScore}
          major={data.major}
          severe={data.severe}
          evasionMod={data.evasionMod}
          agilityMod={data.agilityMod}
          armorType={data.armorType}
          features={data.features}
          tier={data.tier}
          description={data.description}
        />
      </ClickableCard>
      {onToggleActivated && !data.isEmpty && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 z-10 h-7 w-7 p-0"
          onClick={e => {
            e.stopPropagation();
            onToggleActivated();
          }}
          title={isActivated ? 'Deactivate equipment' : 'Activate equipment'}
        >
          <Power
            className={cn(
              'h-4 w-4',
              isActivated ? 'text-green-500' : 'text-muted-foreground'
            )}
          />
        </Button>
      )}
    </div>
  );
}

interface WheelchairCardProps {
  data: WeaponDisplayData & {
    frameType?: string;
    wheelchairFeatures?: string[];
  };
  isHomebrew: boolean;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
  isActivated?: boolean;
  onToggleActivated?: () => void;
}

export function WheelchairCard({
  data,
  isHomebrew,
  readOnly,
  openSection,
  isActivated = true,
  onToggleActivated,
}: WheelchairCardProps) {
  return (
    <div className={cn('relative', !isActivated && 'opacity-50')}>
      <ClickableCard
        onClick={() => openSection('wheelchair')}
        disabled={readOnly}
      >
        <WeaponSummaryCard
          icon={Wheelchair}
          label="Combat Wheelchair"
          name={data.name}
          isHomebrew={isHomebrew}
          isEmpty={data.isEmpty}
          damage={data.damage}
          range={data.range}
          trait={data.trait}
          burden={data.burden}
          features={data.features}
          tier={data.tier}
          frameType={data.frameType}
          wheelchairFeatures={data.wheelchairFeatures}
          description={data.description}
        />
      </ClickableCard>
      {onToggleActivated && !data.isEmpty && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 z-10 h-7 w-7 p-0"
          onClick={e => {
            e.stopPropagation();
            onToggleActivated();
          }}
          title={isActivated ? 'Deactivate equipment' : 'Activate equipment'}
        >
          <Power
            className={cn(
              'h-4 w-4',
              isActivated ? 'text-green-500' : 'text-muted-foreground'
            )}
          />
        </Button>
      )}
    </div>
  );
}

interface EquipmentGridProps {
  equipment: EquipmentState;
  primaryData: WeaponDisplayData;
  secondaryData: WeaponDisplayData;
  armorData: ArmorDisplayData;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
  onTogglePrimaryActivated?: () => void;
  onToggleSecondaryActivated?: () => void;
  onToggleArmorActivated?: () => void;
}

export function EquipmentGrid3Col({
  equipment,
  primaryData,
  secondaryData,
  armorData,
  readOnly,
  openSection,
  onTogglePrimaryActivated,
  onToggleSecondaryActivated,
  onToggleArmorActivated,
}: EquipmentGridProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <WeaponCard
        icon={Sword}
        label="Primary Weapon"
        data={primaryData}
        isHomebrew={equipment.primaryWeaponMode === 'homebrew'}
        section="primary"
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.primaryWeaponActivated !== false}
        onToggleActivated={onTogglePrimaryActivated}
      />
      <WeaponCard
        icon={Axe}
        label="Secondary Weapon"
        data={secondaryData}
        isHomebrew={equipment.secondaryWeaponMode === 'homebrew'}
        section="secondary"
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.secondaryWeaponActivated !== false}
        onToggleActivated={onToggleSecondaryActivated}
      />
      <ArmorCard
        data={armorData}
        isHomebrew={equipment.armorMode === 'homebrew'}
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.armorActivated !== false}
        onToggleActivated={onToggleArmorActivated}
      />
    </div>
  );
}

interface EquipmentGrid2x2Props extends EquipmentGridProps {
  wheelchairData: WeaponDisplayData & {
    frameType?: string;
    wheelchairFeatures?: string[];
  };
  onToggleWheelchairActivated?: () => void;
}

export function EquipmentGrid2x2({
  equipment,
  primaryData,
  secondaryData,
  armorData,
  wheelchairData,
  readOnly,
  openSection,
  onTogglePrimaryActivated,
  onToggleSecondaryActivated,
  onToggleArmorActivated,
  onToggleWheelchairActivated,
}: EquipmentGrid2x2Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <WeaponCard
        icon={Sword}
        label="Primary Weapon"
        data={primaryData}
        isHomebrew={equipment.primaryWeaponMode === 'homebrew'}
        section="primary"
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.primaryWeaponActivated !== false}
        onToggleActivated={onTogglePrimaryActivated}
      />
      <WeaponCard
        icon={Axe}
        label="Secondary Weapon"
        data={secondaryData}
        isHomebrew={equipment.secondaryWeaponMode === 'homebrew'}
        section="secondary"
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.secondaryWeaponActivated !== false}
        onToggleActivated={onToggleSecondaryActivated}
      />
      <ArmorCard
        data={armorData}
        isHomebrew={equipment.armorMode === 'homebrew'}
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.armorActivated !== false}
        onToggleActivated={onToggleArmorActivated}
      />
      <WheelchairCard
        data={wheelchairData}
        isHomebrew={equipment.wheelchairMode === 'homebrew'}
        readOnly={readOnly}
        openSection={openSection}
        isActivated={equipment.wheelchairActivated !== false}
        onToggleActivated={onToggleWheelchairActivated}
      />
    </div>
  );
}
