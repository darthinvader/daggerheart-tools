import { createFileRoute } from '@tanstack/react-router';

import { ResponsiveModalDemo } from '@/components/demo/responsive-modal-demo';

export const Route = createFileRoute('/demonstration')({
  component: Demonstration,
});

function Demonstration() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Responsive Modal Demonstration
      </h1>
      <div className="bg-card rounded-lg border p-6">
        <ResponsiveModalDemo />
      </div>
    </div>
  );
}
