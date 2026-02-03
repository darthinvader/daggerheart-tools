/**
 * Hook for consolidating all homebrew dashboard mutations
 * Extracted to reduce HomebrewDashboard component complexity
 */
import {
  useCreateHomebrewContent,
  useDeleteHomebrewContent,
  useEmptyRecycleBin,
  usePermanentlyDeleteHomebrewContent,
  useRestoreHomebrewContent,
  useUpdateHomebrewContent,
} from '@/features/homebrew';

export function useHomebrewDashboardMutations() {
  const createMutation = useCreateHomebrewContent();
  const updateMutation = useUpdateHomebrewContent();
  const deleteMutation = useDeleteHomebrewContent();
  const restoreMutation = useRestoreHomebrewContent();
  const permanentDeleteMutation = usePermanentlyDeleteHomebrewContent();
  const emptyRecycleBinMutation = useEmptyRecycleBin();

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    restoreMutation,
    permanentDeleteMutation,
    emptyRecycleBinMutation,
  };
}
