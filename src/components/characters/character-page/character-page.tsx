import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as React from 'react';

import { AncestryBlock } from '@/components/characters/character-page/blocks/ancestry-block';
import { ClassBlock } from '@/components/characters/character-page/blocks/class-block';
import { CommunityBlock } from '@/components/characters/character-page/blocks/community-block';
import { ConditionsBlock } from '@/components/characters/character-page/blocks/conditions-block';
import { DomainsBlock } from '@/components/characters/character-page/blocks/domains-block';
import { EquipmentBlock } from '@/components/characters/character-page/blocks/equipment-block';
import { ExperiencesBlock } from '@/components/characters/character-page/blocks/experiences-block';
import { IdentityBlock } from '@/components/characters/character-page/blocks/identity-block';
import { InventoryBlock } from '@/components/characters/character-page/blocks/inventory-block';
import { LevelingBlock } from '@/components/characters/character-page/blocks/leveling-block';
import { ResourcesBlock } from '@/components/characters/character-page/blocks/resources-block';
import { TraitsBlock } from '@/components/characters/character-page/blocks/traits-block';
import { useExperiences } from '@/components/characters/character-page/hooks/useExperiences';
import { useLeveling } from '@/components/characters/character-page/hooks/useLeveling';
// drawers consumed inside block components
import { SheetHeader } from '@/components/layout/sheet-header';
import type { ComboboxItem } from '@/components/ui/combobox';
import { createConditionActions } from '@/features/characters/logic/conditions';
import { useInventoryActions } from '@/features/characters/logic/inventory-actions';
import { createResourceActions } from '@/features/characters/logic/resources';
import {
  accessibleDomainsFor,
  getClassItems,
  getSubclassItems,
  normalizeDomainLoadout,
} from '@/features/characters/logic/route-helpers';
import { createTraitActions } from '@/features/characters/logic/traits';
import {
  type ClassDraft,
  ClassDraftSchema,
  DEFAULT_CLASS,
  type DomainsDraft,
  DomainsDraftSchema,
  type EquipmentDraft,
  type IdentityDraft,
  IdentityDraftSchema,
  type InventoryDraft,
  readClassFromStorage,
  readConditionsFromStorage,
  readCustomFeaturesFromStorage,
  readDomainsFromStorage,
  readEquipmentFromStorage,
  readFeaturesFromStorage,
  readIdentityFromStorage,
  readInventoryFromStorage,
  readResourcesFromStorage,
  readTraitsFromStorage,
  writeClassToStorage,
  writeCustomFeaturesToStorage,
  writeDomainsToStorage,
  writeEquipmentToStorage,
  writeFeaturesToStorage,
  writeIdentityToStorage,
  writeInventoryToStorage,
  writeLevelToStorage,
  writeLevelingToStorage,
} from '@/features/characters/storage';

export function CharacterPage({ id }: { id: string }) {
  // Core state
  const [identity, setIdentity] = React.useState<IdentityDraft>(() =>
    readIdentityFromStorage(id)
  );
  const [resources, setResources] = React.useState(() =>
    readResourcesFromStorage(id)
  );
  const [traits, setTraits] = React.useState(() => readTraitsFromStorage(id));
  const [conditions, setConditions] = React.useState(() =>
    readConditionsFromStorage(id)
  );
  const [classDraft, setClassDraft] = React.useState<ClassDraft>(() =>
    readClassFromStorage(id)
  );
  const [domainsDraft, setDomainsDraft] = React.useState<DomainsDraft>(() =>
    readDomainsFromStorage(id)
  );
  const [equipment, setEquipment] = React.useState<EquipmentDraft>(() =>
    readEquipmentFromStorage(id)
  );
  const [inventory, setInventory] = React.useState<InventoryDraft>(() =>
    readInventoryFromStorage(id)
  );
  const [featureSelections, setFeatureSelections] = React.useState<
    Record<string, string | number | boolean>
  >(() => readFeaturesFromStorage(id));
  const [customFeatures, setCustomFeatures] = React.useState(() =>
    readCustomFeaturesFromStorage(id)
  );
  const {
    currentLevel,
    levelHistory,
    setLevelHistory,
    setCurrentLevel,
    saveLevelUp,
    reload: reloadLeveling,
  } = useLeveling(id);
  const {
    experiences,
    add: addExperience,
    updateAt: updateExperienceAt,
    removeAt: removeExperienceAt,
    reload: reloadExperiences,
  } = useExperiences(id);

  // Drawers and UI state
  const [openIdentity, setOpenIdentity] = React.useState(false);
  const [openAncestry, setOpenAncestry] = React.useState(false);
  const [openCommunity, setOpenCommunity] = React.useState(false);
  const [openClass, setOpenClass] = React.useState(false);
  const [openDomains, setOpenDomains] = React.useState(false);
  const [openEquipment, setOpenEquipment] = React.useState(false);
  const [openInventory, setOpenInventory] = React.useState(false);
  const [openLevelUp, setOpenLevelUp] = React.useState(false);
  const [equipmentSection, setEquipmentSection] = React.useState<
    'primary' | 'secondary' | 'armor' | undefined
  >(undefined);

  // Reload all character data when id changes
  React.useEffect(() => {
    setIdentity(readIdentityFromStorage(id));
    setResources(readResourcesFromStorage(id));
    setTraits(readTraitsFromStorage(id));
    setConditions(readConditionsFromStorage(id));
    setClassDraft(readClassFromStorage(id));
    setDomainsDraft(readDomainsFromStorage(id));
    setEquipment(readEquipmentFromStorage(id));
    setInventory(readInventoryFromStorage(id));
    setFeatureSelections(readFeaturesFromStorage(id));
    setCustomFeatures(readCustomFeaturesFromStorage(id));
    reloadLeveling();
    reloadExperiences();
  }, [id, reloadLeveling, reloadExperiences]);

  // Forms
  const form = useForm<IdentityDraft>({
    resolver: zodResolver(IdentityDraftSchema) as never,
    mode: 'onChange',
    defaultValues: identity,
  });

  const classForm = useForm<ClassDraft>({
    resolver: zodResolver(ClassDraftSchema) as never,
    mode: 'onChange',
    defaultValues: classDraft,
  });
  const currentClassName = classForm.watch('className') ?? classDraft.className;
  const accessibleDomains = React.useMemo(
    () => accessibleDomainsFor(currentClassName),
    [currentClassName]
  );

  const domainsForm = useForm<DomainsDraft>({
    resolver: zodResolver(DomainsDraftSchema) as never,
    mode: 'onChange',
    defaultValues: domainsDraft,
  });

  // Ensure subclass stays valid for selected class
  const classItems: ComboboxItem[] = React.useMemo(() => getClassItems(), []);
  const subclassItemsFor = React.useCallback(
    (className: string): ComboboxItem[] => getSubclassItems(className),
    []
  );
  React.useEffect(() => {
    const subscription = classForm.watch((values, { name }) => {
      if (name === 'className') {
        const items = subclassItemsFor(
          values.className ?? DEFAULT_CLASS.className
        );
        if (!items.find(i => i.value === values.subclass)) {
          classForm.setValue(
            'subclass',
            items[0]?.value ?? DEFAULT_CLASS.subclass,
            { shouldValidate: true }
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [classForm, subclassItemsFor]);

  // Submit handlers
  const onSubmitIdentity = (values: IdentityDraft) => {
    setIdentity(values);
    writeIdentityToStorage(id, values);
    setOpenIdentity(false);
    setOpenAncestry(false);
    setOpenCommunity(false);
  };
  const submitIdentity = form.handleSubmit(v => onSubmitIdentity(v));

  const onSubmitClass = (values: ClassDraft) => {
    setClassDraft(values);
    writeClassToStorage(id, values);
    setOpenClass(false);
  };
  const submitClass = classForm.handleSubmit(v => onSubmitClass(v));

  const onSubmitDomains = (values: DomainsDraft) => {
    setDomainsDraft(values);
    writeDomainsToStorage(id, values);
    setOpenDomains(false);
  };
  const submitDomains = domainsForm.handleSubmit(v => onSubmitDomains(v));

  // Features persistence
  const onSaveFeatures = React.useCallback(
    (next: Record<string, string | number | boolean>) => {
      setFeatureSelections(next);
      writeFeaturesToStorage(id, next);
    },
    [id]
  );
  const onSaveCustomFeatures = React.useCallback(
    (list: ReturnType<typeof readCustomFeaturesFromStorage>) => {
      setCustomFeatures(list);
      writeCustomFeaturesToStorage(id, list);
    },
    [id]
  );

  // Equipment & Inventory forms
  const equipmentForm = useForm<EquipmentDraft>({
    mode: 'onChange',
    defaultValues: equipment,
  });
  const onSubmitEquipment = (values: EquipmentDraft) => {
    setEquipment(values);
    writeEquipmentToStorage(id, values);
    setOpenEquipment(false);
  };
  const submitEquipment = equipmentForm.handleSubmit(v => onSubmitEquipment(v));

  const inventoryForm = useForm<InventoryDraft>({
    mode: 'onChange',
    defaultValues: inventory,
  });
  const onSubmitInventory = (values: InventoryDraft) => {
    setInventory(values);
    writeInventoryToStorage(id, values);
    setOpenInventory(false);
  };
  const submitInventory = inventoryForm.handleSubmit(v => onSubmitInventory(v));

  const {
    incQty: incInventoryQty,
    setQty: setInventoryQty,
    removeAt: removeInventoryAt,
    setLocation: setInventoryLocation,
  } = useInventoryActions(id, setInventory);

  // Derived values
  const normalizedLoadout = React.useMemo(
    () => normalizeDomainLoadout(domainsDraft),
    [domainsDraft]
  );
  const {
    updateStress,
    updateStressMax,
    updateHp,
    updateHpMax,
    updateHope,
    updateHopeMax,
    updateNumber,
    updateArmorScore,
    updateArmorScoreMax,
    setGold,
  } = createResourceActions(id, setResources);
  const { canIncrement, incTrait, toggleMarked } = createTraitActions(
    id,
    setTraits
  );
  const { addCondition, removeCondition } = createConditionActions(
    id,
    setConditions
  );

  const onSaveLevelUp = React.useCallback(
    (values: {
      level: number;
      notes?: string;
      selections: Record<string, number>;
    }) => {
      saveLevelUp(values);
      setOpenLevelUp(false);
    },
    [saveLevelUp]
  );

  // Experiences handlers now provided by hook

  return (
    <div className="w-full pb-24">
      <SheetHeader
        id={id}
        identity={identity}
        resources={resources}
        traits={traits}
        conditions={conditions}
        classDraft={classDraft}
        domainsDraft={domainsDraft}
        equipment={equipment as EquipmentDraft}
        inventory={inventory as InventoryDraft}
        level={currentLevel}
        onDeltaHp={delta => updateHp(delta)}
        onDeltaStress={delta => updateStress(delta)}
        onDeltaHope={delta => updateHope(delta)}
        onDeltaArmorScore={delta => updateArmorScore(delta)}
        setIdentity={setIdentity}
        setResources={setResources}
        setTraits={setTraits}
        setConditions={setConditions}
        setClassDraft={setClassDraft}
        setDomainsDraft={setDomainsDraft}
        setEquipment={setEquipment}
        setInventory={setInventory}
        onEditName={() => setOpenIdentity(true)}
      />
      <div className="mx-auto max-w-screen-sm p-4">
        {/* Class, Subclass, and Features */}
        <ClassBlock
          classDraft={
            {
              className: classDraft.className,
              subclass: classDraft.subclass,
            } as never
          }
          open={openClass}
          onOpenChange={setOpenClass}
          form={classForm as never}
          submit={submitClass}
          classItems={classItems}
          subclassItems={subclassItemsFor(currentClassName)}
          level={currentLevel}
          selections={featureSelections}
          onSaveSelections={onSaveFeatures}
          custom={customFeatures as never}
          onSaveCustom={onSaveCustomFeatures as never}
        />

        {/* Level Up */}
        <LevelingBlock
          level={currentLevel}
          levelHistory={levelHistory as never}
          open={openLevelUp}
          onOpenChange={setOpenLevelUp}
          onUndo={(
            nextLevel: number,
            nextHistory: Array<{
              level: number;
              notes?: string;
              selections: Record<string, number>;
            }>
          ) => {
            writeLevelingToStorage(id, nextHistory);
            setLevelHistory(nextHistory);
            writeLevelToStorage(id, nextLevel);
            setCurrentLevel(nextLevel);
          }}
          onSubmit={onSaveLevelUp}
        />

        <TraitsBlock
          traits={traits as never}
          canIncrement={canIncrement}
          incTrait={incTrait}
          toggleMarked={toggleMarked}
        />

        <ResourcesBlock
          id={id}
          resources={resources as never}
          updateNumber={updateNumber}
          updateHp={updateHp}
          updateHpMax={updateHpMax}
          updateStress={updateStress}
          updateStressMax={updateStressMax}
          updateHope={updateHope}
          updateHopeMax={updateHopeMax}
          updateArmorScore={updateArmorScore}
          updateArmorScoreMax={updateArmorScoreMax}
          setGold={setGold as never}
        />

        <ExperiencesBlock
          experiences={experiences as never}
          addExperience={addExperience as never}
          updateExperienceAt={updateExperienceAt as never}
          removeExperienceAt={removeExperienceAt}
        />

        <ConditionsBlock
          conditions={conditions as never}
          addCondition={addCondition as never}
          removeCondition={removeCondition as never}
        />

        {/* Ancestry */}
        <AncestryBlock
          value={identity}
          open={openAncestry}
          onOpenChange={setOpenAncestry}
          onSubmit={onSubmitIdentity}
        />

        {/* Community */}
        <CommunityBlock
          value={identity}
          open={openCommunity}
          onOpenChange={setOpenCommunity}
          submit={() => onSubmitIdentity(form.getValues() as IdentityDraft)}
          form={form as never}
        />

        {/* Equipment */}
        <EquipmentBlock
          value={equipment as EquipmentDraft}
          open={openEquipment}
          onOpenChange={setOpenEquipment}
          form={equipmentForm as never}
          submit={submitEquipment}
          section={equipmentSection}
          onEdit={(section?: 'primary' | 'secondary' | 'armor') => {
            setEquipmentSection(section);
            setOpenEquipment(true);
          }}
        />

        {/* Inventory / Items */}
        <InventoryBlock
          value={inventory as InventoryDraft}
          open={openInventory}
          onOpenChange={setOpenInventory}
          form={inventoryForm as never}
          submit={submitInventory}
          incQty={incInventoryQty}
          setQty={setInventoryQty}
          removeAt={removeInventoryAt}
          setLocation={setInventoryLocation}
        />

        {/* Domains & Loadout */}
        <DomainsBlock
          value={domainsDraft}
          open={openDomains}
          onOpenChange={setOpenDomains}
          form={domainsForm as never}
          submit={submitDomains}
          accessibleDomains={accessibleDomains as string[]}
          loadout={normalizedLoadout as never}
        />

        {/* Identity */}
        <IdentityBlock
          value={identity}
          open={openIdentity}
          onOpenChange={setOpenIdentity}
          submit={submitIdentity}
          form={form as never}
        />
      </div>
    </div>
  );
}
