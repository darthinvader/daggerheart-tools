/**
 * Hook for managing SessionCard entity relationships and handlers
 * Extracted from SessionCard to reduce complexity
 */
import { useCallback } from 'react';

import type {
  SessionNote,
  SessionNPCInvolvement,
} from '@/lib/schemas/campaign';
import { useEntityIdListHandlers } from './entity-card-utils';

interface NPCPickerResultHook {
  npcId: string;
  npcName?: string;
  role?: string;
  actionsTaken?: string;
  notes?: string;
  locationIds?: string[];
}

interface UseSessionCardHandlersOptions {
  localSession: SessionNote;
  setLocalSession: React.Dispatch<React.SetStateAction<SessionNote>>;
  scheduleAutoSave: (entity: SessionNote) => void;
}

export function useSessionCardHandlers({
  localSession,
  setLocalSession,
  scheduleAutoSave,
}: UseSessionCardHandlersOptions) {
  // Entity ID list handlers
  const locationHandlers = useEntityIdListHandlers<SessionNote>('locationIds', {
    localEntity: localSession,
    setLocalEntity: setLocalSession,
    scheduleAutoSave,
  });

  const questHandlers = useEntityIdListHandlers<SessionNote>('questIds', {
    localEntity: localSession,
    setLocalEntity: setLocalSession,
    scheduleAutoSave,
  });

  const orgHandlers = useEntityIdListHandlers<SessionNote>('organizationIds', {
    localEntity: localSession,
    setLocalEntity: setLocalSession,
    scheduleAutoSave,
  });

  const handleDateChange = useCallback(
    (value: string) => {
      setLocalSession(current => {
        const updated = { ...current, date: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalSession, scheduleAutoSave]
  );

  // NPC Involvement factory
  const createSessionNPCInvolvement = useCallback(
    (result: NPCPickerResultHook): SessionNPCInvolvement => ({
      id: crypto.randomUUID(),
      npcId: result.npcId,
      npcName: result.npcName ?? '',
      role: result.role ?? '',
      actionsTaken: result.actionsTaken ?? '',
      notes: result.notes ?? '',
      locationIds: result.locationIds ?? [],
      questIds: [],
    }),
    []
  );

  return {
    locationHandlers,
    questHandlers,
    orgHandlers,
    handleDateChange,
    createSessionNPCInvolvement,
  };
}
