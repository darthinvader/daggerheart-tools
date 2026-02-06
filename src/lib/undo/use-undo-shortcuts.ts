import { useEffect } from 'react';

/**
 * Tags whose focus should suppress the undo/redo keyboard shortcuts
 * to avoid interfering with native text-editing undo behaviour.
 */
const SUPPRESSED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/** Check whether the currently focused element is an editable field. */
function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  if (SUPPRESSED_TAGS.has(el.tagName)) return true;
  if (el instanceof HTMLElement && el.isContentEditable) return true;
  return false;
}

export interface UseUndoShortcutsOptions {
  /** Called on Ctrl+Z (⌘+Z on Mac). */
  onUndo: () => void;
  /** Called on Ctrl+Shift+Z / Ctrl+Y (⌘+Shift+Z on Mac). */
  onRedo: () => void;
  /** When `false` the listeners are not attached. Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Registers global keydown listeners for undo (Ctrl+Z) and redo (Ctrl+Shift+Z / Ctrl+Y).
 *
 * Shortcuts are suppressed when focus is inside an `<input>`, `<textarea>`,
 * `<select>`, or any element with `contenteditable`.
 */
export function useUndoShortcuts({
  onUndo,
  onRedo,
  enabled = true,
}: UseUndoShortcutsOptions): void {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Use metaKey on Mac, ctrlKey everywhere else
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier) return;

      // Don't intercept when the user is editing text
      if (isEditableElement(document.activeElement)) return;

      const isZ = event.key === 'z' || event.key === 'Z';
      const isY = event.key === 'y' || event.key === 'Y';
      if (!isZ && !isY) return;

      event.preventDefault();
      event.stopPropagation();

      // Ctrl+Shift+Z or Ctrl+Y → Redo
      if ((isZ && event.shiftKey) || isY) {
        onRedo();
      } else if (isZ) {
        onUndo();
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [onUndo, onRedo, enabled]);
}
