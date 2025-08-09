import { createFileRoute, redirect } from '@tanstack/react-router';

// Redirect /characters/new to a fresh UUID-based character route
export const Route = createFileRoute('/characters/new')({
  beforeLoad: () => {
    const id =
      globalThis.crypto && 'randomUUID' in globalThis.crypto
        ? globalThis.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    throw redirect({ to: '/characters/$id', params: { id }, replace: true });
  },
  component: () => null,
});
