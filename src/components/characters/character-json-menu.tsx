// React import not required with automatic JSX runtime
import { MoreHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  type ClassDraft,
  ClassDraftSchema,
  type ConditionsDraft,
  type DomainsDraft,
  DomainsDraftSchema,
  type EquipmentDraft,
  type IdentityDraft,
  IdentityDraftSchema,
  type InventoryDraft,
  type ResourcesDraft,
  type TraitsDraft,
  writeClassToStorage,
  writeConditionsToStorage,
  writeDomainsToStorage,
  writeEquipmentToStorage,
  writeIdentityToStorage,
  writeInventoryToStorage,
  writeResourcesToStorage,
  writeTraitsToStorage,
} from '@/features/characters/storage';

export type CharacterJsonMenuProps = {
  id: string;
  identity: IdentityDraft;
  resources: ResourcesDraft;
  traits: TraitsDraft;
  conditions: ConditionsDraft;
  classDraft: ClassDraft;
  domainsDraft: DomainsDraft;
  equipment: EquipmentDraft;
  inventory: InventoryDraft;
  setIdentity: (v: IdentityDraft) => void;
  setResources: (v: ResourcesDraft) => void;
  setTraits: (v: TraitsDraft) => void;
  setConditions: (v: ConditionsDraft) => void;
  setClassDraft: (v: ClassDraft) => void;
  setDomainsDraft: (v: DomainsDraft) => void;
  setEquipment: (v: EquipmentDraft) => void;
  setInventory: (v: InventoryDraft) => void;
};

export function CharacterJsonMenu(props: CharacterJsonMenuProps) {
  const {
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
  } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="More">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            const payload = {
              identity,
              resources,
              traits,
              conditions,
              classDraft,
              domainsDraft,
              equipment,
              inventory,
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${id}-character.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
        >
          Export JSON
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const raw = JSON.parse(text);
                const nextIdentity = IdentityDraftSchema.safeParse(raw.identity)
                  .success
                  ? (raw.identity as IdentityDraft)
                  : identity;
                const nextTraits =
                  (raw.traits as TraitsDraft | undefined) ?? traits;
                const nextConditions = Array.isArray(raw.conditions)
                  ? (raw.conditions as ConditionsDraft)
                  : conditions;
                const nextClass = ClassDraftSchema.safeParse(raw.classDraft)
                  .success
                  ? (raw.classDraft as ClassDraft)
                  : classDraft;
                const nextDomains = DomainsDraftSchema.safeParse(
                  raw.domainsDraft
                ).success
                  ? (raw.domainsDraft as DomainsDraft)
                  : domainsDraft;
                const nextEquipment =
                  (raw.equipment as EquipmentDraft | undefined) ?? equipment;
                const nextInventory =
                  (raw.inventory as InventoryDraft | undefined) ?? inventory;

                // Update state and persist
                setIdentity(nextIdentity);
                writeIdentityToStorage(id, nextIdentity);
                setResources(raw.resources ?? resources);
                writeResourcesToStorage(id, raw.resources ?? resources);
                setTraits(nextTraits);
                writeTraitsToStorage(id, nextTraits);
                setConditions(nextConditions);
                writeConditionsToStorage(id, nextConditions);
                setClassDraft(nextClass);
                writeClassToStorage(id, nextClass);
                setDomainsDraft(nextDomains);
                writeDomainsToStorage(id, nextDomains);
                setEquipment(nextEquipment);
                writeEquipmentToStorage(id, nextEquipment);
                setInventory(nextInventory);
                writeInventoryToStorage(id, nextInventory);
              } catch {
                // ignore invalid file
              }
            };
            input.click();
          }}
        >
          Import JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
