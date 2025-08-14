import * as React from 'react';

import { Link } from '@tanstack/react-router';

import { CharacterJsonMenu } from '@/components/characters/character-json-menu';
import { Button } from '@/components/ui/button';
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
  return (
    <div
      id="sheet-header"
      className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 border-b backdrop-blur"
    >
      <div className="mx-auto grid w-full max-w-screen-sm grid-cols-[1fr_auto] items-center gap-2 px-4 py-0">
        <div className="text-foreground min-w-0 text-lg leading-tight font-semibold">
          <button
            type="button"
            aria-label="Edit name"
            onClick={onEditName}
            className="line-clamp-2 block max-w-full cursor-pointer text-left text-lg font-semibold break-words hover:underline"
            title={identity.name || 'Set a name'}
          >
            {identity.name ? (
              identity.name
            ) : (
              <span className="text-muted-foreground font-normal">
                Set a name
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
    </div>
  );
}
