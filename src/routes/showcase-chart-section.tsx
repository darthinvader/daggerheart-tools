import { createFileRoute } from '@tanstack/react-router';

// Note: This placeholder route exists only to satisfy the route scanner.
// The real component lives at components/showcase/showcase-chart-section.tsx
// and is lazy-loaded inside routes/showcase.tsx.
export const Route = createFileRoute('/showcase-chart-section')({
  component: () => null,
});
