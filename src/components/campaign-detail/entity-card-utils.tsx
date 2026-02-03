/**
 * Entity Card Utilities
 *
 * Shared hooks and components for campaign entity cards
 * (NPC, Quest, Location, Organization, Session)
 */
import { ChevronDown, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAutoSave } from '@/hooks/use-auto-save';

import { ENTITY_SYSTEM_KEYS, getEntityUpdates } from './entity-diff-utils';

// =====================================================================================
// useEntityCardState - Shared state management for entity cards
// =====================================================================================

interface UseEntityCardStateOptions<T> {
  /** The entity from props */
  entity: T;
  /** Function to normalize the entity (fill in defaults) */
  normalizer: (entity: T) => T;
  /** Called when changes should be saved */
  onUpdate: (updates: Partial<T>) => Promise<void>;
  /** Called when save starts */
  onSaveStart?: () => void;
  /** Called when there are pending unsaved changes */
  onPendingChange?: () => void;
}

interface EntityCardState<T> {
  /** Current local state */
  localEntity: T;
  /** Update local entity and schedule auto-save */
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  /** Schedule auto-save for the current state */
  scheduleAutoSave: (data: T) => void;
  /** Flush pending saves immediately */
  flush: () => void;
  /** Handle text field changes with auto-save */
  handleTextChange: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Handle blur to flush saves */
  handleBlur: () => void;
}

/**
 * Hook that encapsulates common entity card state management.
 * Handles ID tracking, local/base state sync, and auto-save integration.
 */
export function useEntityCardState<T extends { id: string }>({
  entity,
  normalizer,
  onUpdate,
  onSaveStart,
  onPendingChange,
}: UseEntityCardStateOptions<T>): EntityCardState<T> {
  const [trackedId, setTrackedId] = useState(entity.id);
  const [localEntity, setLocalEntity] = useState(() => normalizer(entity));
  const [baseEntity, setBaseEntity] = useState(() => normalizer(entity));

  // Sync local state when prop changes
  if (trackedId !== entity.id) {
    setTrackedId(entity.id);
    setLocalEntity(normalizer(entity));
    setBaseEntity(normalizer(entity));
  }

  const getUpdates = useCallback(
    (current: T) =>
      getEntityUpdates(
        current,
        baseEntity,
        ENTITY_SYSTEM_KEYS as unknown as ReadonlyArray<keyof T>
      ),
    [baseEntity]
  );

  const { scheduleAutoSave, flush } = useAutoSave({
    onSave: async (data: T) => {
      const updates = getUpdates(data);
      if (Object.keys(updates).length === 0) return;
      setBaseEntity(prev => ({ ...prev, ...updates }));
      await onUpdate(updates);
    },
    onSaveStart,
    onPendingChange,
  });

  const handleTextChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setLocalEntity(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  return {
    localEntity,
    setLocalEntity,
    scheduleAutoSave,
    flush,
    handleTextChange,
    handleBlur,
  };
}

// =====================================================================================
// useEntityIdListHandlers - Handlers for adding/removing IDs from entity lists
// =====================================================================================

interface UseEntityIdListHandlersOptions<T> {
  localEntity?: T;
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  scheduleAutoSave: (data: T) => void;
}

/**
 * Creates add/remove handlers for an ID list field on an entity.
 * Returns memoized handlers that update the local entity and schedule auto-save.
 */
export function useEntityIdListHandlers<T>(
  field: keyof T,
  { setLocalEntity, scheduleAutoSave }: UseEntityIdListHandlersOptions<T>
) {
  const handleAdd = useCallback(
    (id: string) => {
      setLocalEntity(current => {
        const currentIds = (current[field] as string[] | undefined) ?? [];
        if (currentIds.includes(id)) return current;
        const updated = { ...current, [field]: [...currentIds, id] };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [field, setLocalEntity, scheduleAutoSave]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setLocalEntity(current => {
        const currentIds = (current[field] as string[] | undefined) ?? [];
        const updated = {
          ...current,
          [field]: currentIds.filter(existingId => existingId !== id),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [field, setLocalEntity, scheduleAutoSave]
  );

  const handleToggle = useCallback(
    (id: string) => {
      setLocalEntity(current => {
        const currentIds = (current[field] as string[] | undefined) ?? [];
        const newIds = currentIds.includes(id)
          ? currentIds.filter(existingId => existingId !== id)
          : [...currentIds, id];
        const updated = { ...current, [field]: newIds };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [field, setLocalEntity, scheduleAutoSave]
  );

  return { handleAdd, handleRemove, handleToggle };
}

// =====================================================================================
// useStringArrayHandlers - Handlers for adding/removing strings from entity arrays
// =====================================================================================

interface UseStringArrayHandlersOptions<T> {
  localEntity: T;
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  scheduleAutoSave: (data: T) => void;
}

/**
 * Creates add/remove handlers for a string array field on an entity.
 * Useful for rewards, tags, highlights, etc.
 */
export function useStringArrayHandlers<T>(
  field: keyof T,
  {
    localEntity,
    setLocalEntity,
    scheduleAutoSave,
  }: UseStringArrayHandlersOptions<T>
) {
  const handleAdd = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setLocalEntity(current => {
        const currentArr = (current[field] as string[] | undefined) ?? [];
        const updated = { ...current, [field]: [...currentArr, trimmed] };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [field, setLocalEntity, scheduleAutoSave]
  );

  const handleRemove = useCallback(
    (value: string) => {
      setLocalEntity(current => {
        const currentArr = (current[field] as string[] | undefined) ?? [];
        const updated = {
          ...current,
          [field]: currentArr.filter(item => item !== value),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [field, setLocalEntity, scheduleAutoSave]
  );

  return {
    handleAdd,
    handleRemove,
    currentArray:
      ((localEntity as Record<string, unknown>)[field as string] as
        | string[]
        | undefined) ?? [],
  };
}

// =====================================================================================
// useSelectChangeHandler - Generic select field change handler
// =====================================================================================

interface UseSelectChangeHandlerOptions<T> {
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  scheduleAutoSave: (data: T) => void;
}

/**
 * Creates a memoized select change handler for a specific field.
 * Reduces complexity by consolidating multiple similar handlers.
 */
export function useSelectChangeHandler<T, K extends keyof T>(
  field: K,
  { setLocalEntity, scheduleAutoSave }: UseSelectChangeHandlerOptions<T>
) {
  return useCallback(
    (value: T[K]) => {
      setLocalEntity(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [field, setLocalEntity, scheduleAutoSave]
  );
}

// =====================================================================================
// useObjectivesHandlers - Handlers for quest objectives (objects with id, text, completed)
// =====================================================================================

export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
}

interface UseObjectivesHandlersOptions<T> {
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  scheduleAutoSave: (data: T) => void;
  objectivesField: keyof T;
}

export interface ObjectivesHandlers {
  addObjective: (text: string) => void;
  toggleObjective: (id: string) => void;
  removeObjective: (id: string) => void;
}

/**
 * Hook for managing quest objectives (add, toggle, remove).
 * Works with arrays of { id, text, completed } objects.
 */
export function useObjectivesHandlers<T>({
  setLocalEntity,
  scheduleAutoSave,
  objectivesField,
}: UseObjectivesHandlersOptions<T>): ObjectivesHandlers {
  const addObjective = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setLocalEntity(current => {
        const currentObjectives =
          (current[objectivesField] as QuestObjective[] | undefined) ?? [];
        const newObj: QuestObjective = {
          id: crypto.randomUUID(),
          text: trimmed,
          completed: false,
        };
        const updated = {
          ...current,
          [objectivesField]: [...currentObjectives, newObj],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [objectivesField, setLocalEntity, scheduleAutoSave]
  );

  const toggleObjective = useCallback(
    (id: string) => {
      setLocalEntity(current => {
        const currentObjectives =
          (current[objectivesField] as QuestObjective[] | undefined) ?? [];
        const updated = {
          ...current,
          [objectivesField]: currentObjectives.map(obj =>
            obj.id === id ? { ...obj, completed: !obj.completed } : obj
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [objectivesField, setLocalEntity, scheduleAutoSave]
  );

  const removeObjective = useCallback(
    (id: string) => {
      setLocalEntity(current => {
        const currentObjectives =
          (current[objectivesField] as QuestObjective[] | undefined) ?? [];
        const updated = {
          ...current,
          [objectivesField]: currentObjectives.filter(obj => obj.id !== id),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [objectivesField, setLocalEntity, scheduleAutoSave]
  );

  return { addObjective, toggleObjective, removeObjective };
}

// =====================================================================================
// useModalState - Manages multiple modal open/close states
// =====================================================================================

type ModalStateMap<K extends string> = Record<K, boolean>;

interface UseModalStateResult<K extends string> {
  modals: ModalStateMap<K>;
  openModal: (key: K) => void;
  closeModal: (key: K) => void;
  setModalOpen: (key: K, open: boolean) => void;
}

/**
 * Hook to manage multiple modal states efficiently.
 * Replaces multiple useState calls for modal visibility.
 */
export function useModalState<K extends string>(
  keys: readonly K[]
): UseModalStateResult<K> {
  const [modals, setModals] = useState<ModalStateMap<K>>(() =>
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as ModalStateMap<K>
    )
  );

  const openModal = useCallback((key: K) => {
    setModals(prev => ({ ...prev, [key]: true }));
  }, []);

  const closeModal = useCallback((key: K) => {
    setModals(prev => ({ ...prev, [key]: false }));
  }, []);

  const setModalOpen = useCallback((key: K, open: boolean) => {
    setModals(prev => ({ ...prev, [key]: open }));
  }, []);

  return { modals, openModal, closeModal, setModalOpen };
}

// =====================================================================================
// useNPCInvolvementHandlers - Handlers for managing NPC involvement arrays
// =====================================================================================

export interface NPCPickerResult {
  npcId: string;
  npcName: string;
  role?: string;
  actionsTaken?: string;
  notes?: string;
  locationIds?: string[];
}

/** Base interface that all NPC involvements must satisfy */
interface BaseNPCInvolvement {
  id: string;
  npcId: string;
}

interface UseNPCInvolvementHandlersOptions<
  TEntity,
  TInvolvement extends BaseNPCInvolvement,
> {
  setLocalEntity: React.Dispatch<React.SetStateAction<TEntity>>;
  scheduleAutoSave: (data: TEntity) => void;
  involvementField: keyof TEntity;
  /** Factory function to create a new involvement from picker result */
  createInvolvement: (result: NPCPickerResult) => TInvolvement;
}

export function useNPCInvolvementHandlers<
  TEntity,
  TInvolvement extends BaseNPCInvolvement,
>({
  setLocalEntity,
  scheduleAutoSave,
  involvementField,
  createInvolvement,
}: UseNPCInvolvementHandlersOptions<TEntity, TInvolvement>) {
  const handleAddNPC = useCallback(
    (result: NPCPickerResult) => {
      setLocalEntity(current => {
        const currentInvolvements =
          (current[involvementField] as TInvolvement[] | undefined) ?? [];
        if (currentInvolvements.some(inv => inv.npcId === result.npcId)) {
          return current;
        }
        const newInvolvement = createInvolvement(result);
        const updated = {
          ...current,
          [involvementField]: [...currentInvolvements, newInvolvement],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [involvementField, setLocalEntity, scheduleAutoSave, createInvolvement]
  );

  /** Remove by npcId field */
  const handleRemoveNPC = useCallback(
    (npcId: string) => {
      setLocalEntity(current => {
        const currentInvolvements =
          (current[involvementField] as TInvolvement[] | undefined) ?? [];
        const updated = {
          ...current,
          [involvementField]: currentInvolvements.filter(
            inv => inv.npcId !== npcId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [involvementField, setLocalEntity, scheduleAutoSave]
  );

  /** Remove by id field (the involvement record id) */
  const handleRemoveNPCById = useCallback(
    (involvementId: string) => {
      setLocalEntity(current => {
        const currentInvolvements =
          (current[involvementField] as TInvolvement[] | undefined) ?? [];
        const updated = {
          ...current,
          [involvementField]: currentInvolvements.filter(
            inv => inv.id !== involvementId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [involvementField, setLocalEntity, scheduleAutoSave]
  );

  const handleUpdateNPCInvolvement = useCallback(
    (involvement: TInvolvement) => {
      setLocalEntity(current => {
        const currentInvolvements =
          (current[involvementField] as TInvolvement[] | undefined) ?? [];
        const updated = {
          ...current,
          [involvementField]: currentInvolvements.map(inv =>
            inv.id === involvement.id ? involvement : inv
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [involvementField, setLocalEntity, scheduleAutoSave]
  );

  return {
    handleAddNPC,
    handleRemoveNPC,
    handleRemoveNPCById,
    handleUpdateNPCInvolvement,
  };
}

// =====================================================================================
// usePickerHandlerWithModal - Creates a handler that adds an ID and closes a modal
// =====================================================================================

/**
 * Creates a callback that adds an item (or extracts ID from picker result) and closes a modal.
 * Useful for NPC/Location/Quest pickers that need to add to a list and close the picker.
 */
export function usePickerHandlerWithModal<T>(
  addHandler: (id: string) => void,
  closeModal: (key: T) => void,
  modalKey: T
) {
  return useCallback(
    (idOrResult: string | NPCPickerResult) => {
      const id = typeof idOrResult === 'string' ? idOrResult : idOrResult.npcId;
      addHandler(id);
      closeModal(modalKey);
    },
    [addHandler, closeModal, modalKey]
  );
}

// =====================================================================================
// DeleteConfirmDialog - Reusable delete confirmation dialog
// =====================================================================================

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityName: string;
  onDelete: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  entityType,
  entityName,
  onDelete,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {entityType}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{entityName}"? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// =====================================================================================
// EntityCardWrapper - Collapsible card wrapper with header
// =====================================================================================

interface EntityCardWrapperProps {
  isExpanded: boolean;
  onToggle: () => void;
  icon: ReactNode;
  iconBgClass: string;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  onDeleteClick: () => void;
  deleteTooltip?: string;
  children: ReactNode;
}

export function EntityCardWrapper({
  isExpanded,
  onToggle,
  icon,
  iconBgClass,
  title,
  subtitle,
  badges,
  onDeleteClick,
  deleteTooltip = 'Delete',
  children,
}: EntityCardWrapperProps) {
  return (
    <Card className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CardHeader className="bg-muted/30 py-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto flex-1 justify-start p-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${iconBgClass}`}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">
                        {title}
                      </span>
                      {badges}
                    </div>
                    {subtitle && (
                      <div className="text-muted-foreground truncate text-xs">
                        {subtitle}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    className={`ml-2 size-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </Button>
            </CollapsibleTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive size-8 shrink-0"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteClick();
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{deleteTooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-4">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
