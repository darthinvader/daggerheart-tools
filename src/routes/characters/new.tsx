import { createFileRoute, redirect } from '@tanstack/react-router';

import { generateId } from '@/lib/utils';

// Redirect /characters/new to a fresh UUID-based character route
export const Route = createFileRoute('/characters/new')({
  beforeLoad: () => {
    const id = generateId();
    throw redirect({ to: '/characters/$id', params: { id }, replace: true });
  },
  component: () => null,
});
