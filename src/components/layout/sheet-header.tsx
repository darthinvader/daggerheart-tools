import * as React from 'react';

import { Link } from '@tanstack/react-router';

import { CharacterJsonMenu } from '@/components/characters/character-json-menu';
import { SheetHeaderMobileChips } from '@/components/layout/sheet-header-mobile-chips';
import { Button } from '@/components/ui/button';
import { useThresholdsSettings } from '@/features/characters/logic/use-thresholds';
import type {
  ConditionsDraft,
  IdentityDraft,
  ResourcesDraft,
  TraitsDraft,
} from '@/features/characters/storage';
import type { ClassDraft } from '@/features/characters/storage';
import type { DomainsDraft } from '@/features/characters/storage';
import type { EquipmentDraft } from '@/features/characters/storage';
import type { InventoryDraft } from '@/features/characters/storage';

export type SheetHeaderProps = {
  id: string;
  identity: IdentityDraft;
  resources: ResourcesDraft;
  traits: TraitsDraft;
  conditions: ConditionsDraft;
  classDraft: ClassDraft;
  domainsDraft: DomainsDraft;
  equipment: EquipmentDraft;
  inventory: InventoryDraft;
  level: number;
  // Allow quick adjustments from header interactions
  onDeltaHp?: (delta: number) => void;
  onDeltaStress?: (delta: number) => void;
  onDeltaHope?: (delta: number) => void;
  onDeltaArmorScore?: (delta: number) => void;
  setIdentity: React.Dispatch<React.SetStateAction<IdentityDraft>>;
  setResources: React.Dispatch<React.SetStateAction<ResourcesDraft>>;
  setTraits: React.Dispatch<React.SetStateAction<TraitsDraft>>;
  setConditions: React.Dispatch<React.SetStateAction<ConditionsDraft>>;
  setClassDraft: React.Dispatch<React.SetStateAction<ClassDraft>>;
  setDomainsDraft: React.Dispatch<React.SetStateAction<DomainsDraft>>;
  setEquipment: React.Dispatch<React.SetStateAction<EquipmentDraft>>;
  setInventory: React.Dispatch<React.SetStateAction<InventoryDraft>>;
  onEditName(): void;
};

export function SheetHeader({
  id,
  identity,
  resources,
  traits,
  conditions,
  classDraft,
  domainsDraft,
  equipment,
  inventory,
  level,
  onDeltaHp,
  onDeltaStress,
  onDeltaHope,
  onDeltaArmorScore,
  setIdentity,
  setResources,
  setTraits,
  setConditions,
  setClassDraft,
  setDomainsDraft,
  setEquipment,
  setInventory,
  onEditName,
}: SheetHeaderProps) {
  type SectionId = 'traits' | 'core' | 'resources' | 'class' | 'gold';
  // Compute thresholds values on demand (uses level + armor from storage)
  const { settings, displayMajor, displaySevere, displayDs } =
    useThresholdsSettings({
      id,
    });

  // Track per-section passed state (revealed when a section's bottom passes the header)
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const [passed, setPassed] = React.useState<Record<SectionId, boolean>>({
    traits: false,
    core: false,
    resources: false,
    class: false,
    gold: false,
  });

  React.useEffect(() => {
    const ids: SectionId[] = ['traits', 'core', 'resources', 'class', 'gold'];
    const measure = () => {
      const headerH = headerRef.current?.getBoundingClientRect().height ?? 56;
      const next: Record<SectionId, boolean> = {
        traits: false,
        core: false,
        resources: false,
        class: false,
        gold: false,
      };
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < headerH - 4) next[id] = true;
      }
      // Only update state if changed
      setPassed(prev =>
        prev.traits === next.traits &&
        prev.core === next.core &&
        prev.resources === next.resources &&
        prev.class === next.class &&
        prev.gold === next.gold
          ? prev
          : next
      );
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure as EventListener);
      window.removeEventListener('resize', measure as EventListener);
    };
  }, []);

  const showTraits = passed.traits;
  const showCore = passed.core;
  const showResources = passed.resources;
  const showClass = passed.class;
  const showGold = passed.gold;
  // Show thresholds together with Core (do not wait for thresholds section)
  const showThresholds = showCore;
  const anyVisible =
    showTraits || showCore || showClass || showResources || showGold;

  // Trait labels are only used in the mobile chips component

  return (
    <div
      id="sheet-header"
      ref={headerRef}
      className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 border-b backdrop-blur"
    >
      <div className="mx-auto grid w-full max-w-screen-sm grid-cols-[1fr_auto] items-center gap-2 px-4 py-0">
        <div className="text-foreground min-w-0 text-2xl leading-tight font-semibold">
          <button
            type="button"
            aria-label={
              identity.name ? 'Click To Edit Name' : 'Click To Add A Name'
            }
            onClick={onEditName}
            className="line-clamp-2 block max-w-full cursor-pointer text-left text-2xl font-semibold break-words hover:underline"
            title={identity.name || 'Click To Add A Name'}
          >
            {identity.name ? (
              identity.name
            ) : (
              <span className="text-muted-foreground font-normal">
                Click To Add A Name
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center justify-end gap-1">
          <Button asChild size="sm" variant="ghost">
            <Link to="/characters">Back</Link>
          </Button>
          <CharacterJsonMenu
            id={id}
            identity={identity}
            resources={resources}
            traits={traits}
            conditions={conditions}
            classDraft={classDraft}
            domainsDraft={domainsDraft}
            equipment={equipment}
            inventory={inventory}
            setIdentity={setIdentity}
            setResources={setResources}
            setTraits={setTraits}
            setConditions={setConditions}
            setClassDraft={setClassDraft}
            setDomainsDraft={setDomainsDraft}
            setEquipment={setEquipment}
            setInventory={setInventory}
          />
        </div>
      </div>

      {/* Mobile progressive info bar: hidden until at least one chip is visible */}
      {anyVisible && (
        <SheetHeaderMobileChips
          showClass={showClass}
          showTraits={showTraits}
          showCore={showCore}
          showThresholds={showThresholds}
          showResources={showResources}
          showGold={showGold}
          classDraft={classDraft}
          level={level}
          traits={traits}
          resources={resources}
          displayMajor={displayMajor}
          displaySevere={displaySevere}
          displayDs={displayDs}
          enableCritical={settings?.enableCritical}
          onDeltaHp={onDeltaHp}
          onDeltaStress={onDeltaStress}
          onDeltaHope={onDeltaHope}
          onDeltaArmorScore={onDeltaArmorScore}
        />
      )}
    </div>
  );
}
