/**
 * Hook for managing HomebrewDashboard form and dialog state
 */
import { useCallback, useState } from 'react';

import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

interface UseHomebrewDashboardDialogsOptions {
  createMutation: {
    mutateAsync: (data: {
      contentType: HomebrewContentType;
      content: HomebrewContent['content'] & { name: string };
      name: string;
      description: string;
      tags: string[];
      visibility: HomebrewVisibility;
      campaignLinks: string[];
    }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (data: {
      id: string;
      updates: {
        content: HomebrewContent['content'];
        name: string;
        visibility: HomebrewVisibility;
      };
    }) => Promise<unknown>;
  };
}

export function useHomebrewDashboardDialogs({
  createMutation,
  updateMutation,
}: UseHomebrewDashboardDialogsOptions) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);
  const [selectedType, setSelectedType] =
    useState<HomebrewContentType>('adversary');
  const [editingItem, setEditingItem] = useState<HomebrewContent | null>(null);

  const handleCreate = useCallback((type: HomebrewContentType) => {
    setSelectedType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((item: HomebrewContent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);

  const handleEdit = useCallback((item: HomebrewContent) => {
    setSelectedType(item.contentType);
    setEditingItem(item);
    setIsFormOpen(true);
    setIsViewOpen(false);
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: {
      content: HomebrewContent['content'];
      visibility: HomebrewVisibility;
    }) => {
      const typedFormData = payload.content as {
        name: string;
      } & HomebrewContent['content'];
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          updates: {
            content: typedFormData,
            name: typedFormData.name,
            visibility: payload.visibility,
          },
        });
      } else {
        await createMutation.mutateAsync({
          contentType: selectedType,
          content: typedFormData,
          name: typedFormData.name,
          description: '',
          tags: [],
          visibility: payload.visibility,
          campaignLinks: [],
        });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    },
    [editingItem, selectedType, createMutation, updateMutation]
  );

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(null);
  }, []);

  const handleCloseView = useCallback(() => {
    setIsViewOpen(false);
    setViewingItem(null);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsFormOpen(false);
      setEditingItem(null);
    }
  }, []);

  const handleViewOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsViewOpen(false);
      setViewingItem(null);
    }
  }, []);

  return {
    // State
    isFormOpen,
    isViewOpen,
    viewingItem,
    selectedType,
    editingItem,
    // Actions
    handleCreate,
    handleView,
    handleEdit,
    handleFormSubmit,
    handleCloseForm,
    handleCloseView,
    handleFormOpenChange,
    handleViewOpenChange,
  };
}
