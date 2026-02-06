/**
 * Metadata for a single undo/redo stack entry.
 * The actual state snapshot is stored alongside this in the consuming hook.
 */
export interface UndoEntryMeta {
  /** Unique identifier for this entry. */
  readonly id: string;
  /** Human-readable label describing the action (e.g. "Update character HP"). */
  readonly label: string;
  /** Unix-ms timestamp when the mutation occurred. */
  readonly timestamp: number;
}

/** Maximum number of undo entries to retain. */
export const MAX_UNDO_DEPTH = 50;
