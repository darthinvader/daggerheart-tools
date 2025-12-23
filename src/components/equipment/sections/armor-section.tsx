import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ALL_STANDARD_ARMOR } from '@/lib/data/equipment';
import type { StandardArmor } from '@/lib/schemas/equipment';

import { ArmorCardCompact } from '../armor-card-compact';
import { EquipmentSection } from '../equipment-section';
import { HomebrewArmorForm } from '../homebrew-armor-form';
import { SectionHeader } from '../section-header';

interface ArmorSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'standard' | 'homebrew';
  onModeChange: (homebrew: boolean) => void;
  armor: StandardArmor | null;
  onArmorChange: (armor: StandardArmor | null) => void;
  homebrewArmor: Partial<StandardArmor>;
  onHomebrewChange: (value: Partial<StandardArmor>) => void;
}

export function ArmorSection({
  isOpen,
  onOpenChange,
  mode,
  onModeChange,
  armor,
  onArmorChange,
  homebrewArmor,
  onHomebrewChange,
}: ArmorSectionProps) {
  const selectedName =
    mode === 'homebrew'
      ? homebrewArmor.name
        ? `🔧 ${homebrewArmor.name}`
        : '🔧 Homebrew'
      : armor?.name;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CardHeader className="pb-3">
          <SectionHeader
            icon={<span className="text-lg">🛡️</span>}
            emoji=""
            title="Armor"
            isOpen={isOpen}
            onToggle={() => onOpenChange(!isOpen)}
            isHomebrew={mode === 'homebrew'}
            onHomebrewChange={onModeChange}
            selectedName={selectedName}
          />
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {mode === 'homebrew' ? (
              <HomebrewArmorForm
                value={homebrewArmor}
                onChange={onHomebrewChange}
              />
            ) : (
              <EquipmentSection
                title="Armor"
                icon="🛡️"
                items={ALL_STANDARD_ARMOR}
                selectedItem={armor}
                onSelect={onArmorChange}
                renderCard={(a, isSelected, onSelect) => (
                  <ArmorCardCompact
                    key={a.name}
                    armor={a}
                    isSelected={isSelected}
                    onClick={onSelect}
                  />
                )}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
