import { SheetHeader } from '@/components/layout/sheet-header';
import type {
  EquipmentDraft,
  IdentityDraft,
  InventoryDraft,
} from '@/features/characters/storage';

export function HeaderBlock(props: {
  id: string;
  identity: IdentityDraft;
  resources: any;
  traits: any;
  conditions: any;
  classDraft: any;
  domainsDraft: any;
  equipment: EquipmentDraft;
  inventory: InventoryDraft;
  level: number;
  onDeltaHp: (delta: number) => void;
  onDeltaStress: (delta: number) => void;
  onDeltaHope: (delta: number) => void;
  onDeltaArmorScore: (delta: number) => void;
  setIdentity: (v: IdentityDraft) => void;
  setResources: (v: any) => void;
  setTraits: (v: any) => void;
  setConditions: (v: any) => void;
  setClassDraft: (v: any) => void;
  setDomainsDraft: (v: any) => void;
  setEquipment: (v: EquipmentDraft) => void;
  setInventory: (v: InventoryDraft) => void;
  onEditName: () => void;
}) {
  return <SheetHeader {...props} />;
}
