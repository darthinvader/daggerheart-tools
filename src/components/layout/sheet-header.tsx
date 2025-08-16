import * as React from 'react';

import { Link } from '@tanstack/react-router';

import { CharacterJsonMenu } from '@/components/characters/character-json-menu';
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

  const traitAbbr: Array<{
    key: keyof typeof traits | string;
    label: string;
  }> = [
    { key: 'Agility', label: 'Agi' },
    { key: 'Strength', label: 'Str' },
    { key: 'Finesse', label: 'Fin' },
    { key: 'Instinct', label: 'Inst' },
    { key: 'Presence', label: 'Pres' },
    { key: 'Knowledge', label: 'Know' },
  ];

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
        <div className="border-t px-4 py-1 md:hidden">
          <div className="flex flex-wrap gap-2">
            {showClass && (
              <div className="bg-muted/60 rounded-md px-2 py-1">
                <div className="text-muted-foreground text-[10px] leading-3">
                  Class/Subclass
                </div>
                <div className="text-[11px] leading-4 font-semibold whitespace-nowrap">
                  {classDraft.className}
                  {classDraft.subclass ? ` / ${classDraft.subclass}` : ''}
                  <span className="text-muted-foreground ml-2">
                    Lvl {level}
                  </span>
                </div>
              </div>
            )}

            {showTraits && (
              <div className="bg-muted/60 text-foreground rounded-md px-2 py-1">
                <div className="text-muted-foreground grid grid-cols-6 gap-x-1 text-[10px] leading-3">
                  {traitAbbr.map(t => (
                    <div key={t.label} className="text-center">
                      <div>{t.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-x-1 text-[11px] leading-4 font-semibold">
                  {traitAbbr.map(t => (
                    <div key={t.label} className="text-center">
                      {Number(
                        (traits as Record<string, { value?: number }>)[
                          String(t.key)
                        ]?.value ?? 0
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCore && (
              <div className="bg-muted/60 rounded-md px-2 py-1">
                <div className="text-muted-foreground grid grid-cols-2 gap-x-2 text-[10px] leading-3">
                  <div className="text-center">Prof</div>
                  <div className="text-center">Evasion</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 text-[11px] leading-4 font-semibold">
                  <div className="text-center">{resources.proficiency}</div>
                  <div className="text-center">{resources.evasion}</div>
                </div>
              </div>
            )}

            {showThresholds && (
              <div className="bg-muted/60 rounded-md px-2 py-1">
                <div className="text-muted-foreground text-[10px] leading-3">
                  Thresholds
                </div>
                {/* Interleaved display with clickable numbers */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] leading-4">
                  <button
                    type="button"
                    className="bg-muted rounded px-1 py-0.5"
                    title="1 HP (Minor)"
                    onClick={() => onDeltaHp?.(-1)}
                  >
                    1
                  </button>
                  <span className="text-muted-foreground">
                    M: {displayMajor}
                  </span>
                  <button
                    type="button"
                    className="bg-muted rounded px-1 py-0.5"
                    title={`2 HP at Major: ${displayMajor}`}
                    onClick={() => onDeltaHp?.(-2)}
                  >
                    2
                  </button>
                  <span className="text-muted-foreground">
                    S: {displaySevere}
                  </span>
                  <button
                    type="button"
                    className="bg-muted rounded px-1 py-0.5"
                    title={`3 HP at Severe: ${displaySevere}`}
                    onClick={() => onDeltaHp?.(-3)}
                  >
                    3
                  </button>
                  {settings?.enableCritical && (
                    <>
                      <span className="text-muted-foreground">
                        MD: {displayDs}
                      </span>
                      <button
                        type="button"
                        className="border-destructive/20 bg-destructive/10 text-destructive rounded border px-1 py-0.5"
                        title={`4 HP at MD: ${displayDs}`}
                        onClick={() => onDeltaHp?.(-4)}
                      >
                        4
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {showResources && (
              <div className="bg-muted/60 rounded-md px-2 py-1">
                <div className="text-muted-foreground grid grid-cols-4 gap-x-2 text-[10px] leading-3">
                  <div className="text-center">HP</div>
                  <div className="text-center">Stress</div>
                  <div className="text-center">Hope</div>
                  <div className="text-center">Armor</div>
                </div>
                <div className="grid grid-cols-4 gap-x-2 text-[11px] leading-4 font-semibold">
                  {/* HP with +/- */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Decrease HP"
                      onClick={() => onDeltaHp?.(-1)}
                    >
                      -
                    </button>
                    <div className="min-w-8 text-center tabular-nums">
                      {resources.hp.current}
                    </div>
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Increase HP"
                      onClick={() => onDeltaHp?.(1)}
                    >
                      +
                    </button>
                  </div>
                  {/* Stress with +/- */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Decrease Stress"
                      onClick={() => onDeltaStress?.(-1)}
                    >
                      -
                    </button>
                    <div className="min-w-8 text-center tabular-nums">
                      {resources.stress.current}
                    </div>
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Increase Stress"
                      onClick={() => onDeltaStress?.(1)}
                    >
                      +
                    </button>
                  </div>
                  {/* Hope with +/- */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Decrease Hope"
                      onClick={() => onDeltaHope?.(-1)}
                    >
                      -
                    </button>
                    <div className="min-w-8 text-center tabular-nums">
                      {resources.hope.current}
                    </div>
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Increase Hope"
                      onClick={() => onDeltaHope?.(1)}
                    >
                      +
                    </button>
                  </div>
                  {/* Armor Score with +/- */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Decrease Armor Score"
                      onClick={() => onDeltaArmorScore?.(-1)}
                    >
                      -
                    </button>
                    <div className="min-w-8 text-center tabular-nums">
                      {resources.armorScore?.current ?? 0}
                    </div>
                    <button
                      type="button"
                      className="rounded border px-1 text-[11px]"
                      aria-label="Increase Armor Score"
                      onClick={() => onDeltaArmorScore?.(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Gold emoji chip shows only after passing the Gold section */}
            {showGold && (
              <div className="bg-muted/60 rounded-md px-2 py-1">
                <div className="text-muted-foreground text-center text-[10px] leading-3">
                  Gold
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] leading-4">
                  <span title="Handfuls">
                    🪙 {resources.gold?.handfuls ?? 0}
                  </span>
                  <span title="Bags">💰 {resources.gold?.bags ?? 0}</span>
                  <span title="Chests">🧰 {resources.gold?.chests ?? 0}</span>
                </div>
              </div>
            )}

            {/* Removed duplicate Gold detail chip — Gold is shown within Resources */}
          </div>
        </div>
      )}
    </div>
  );
}
