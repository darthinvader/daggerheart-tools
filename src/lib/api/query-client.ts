import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys for type-safe cache management
export const characterQueryKeys = {
  all: ['characters'] as const,
  list: () => [...characterQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...characterQueryKeys.all, 'detail', id] as const,
};
