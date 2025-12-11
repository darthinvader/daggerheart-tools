import { createFileRoute } from '@tanstack/react-router';

import { LabeledCounterDemo } from '@/components/demo/labeled-counter-demo';
import { ResponsiveModalDemo } from '@/components/demo/responsive-modal-demo';

export const Route = createFileRoute('/demonstration')({
  component: Demonstration,
});

function Demonstration() {
  return (
    <div className="container mx-auto space-y-12 py-8">
      <section>
        <h1 className="mb-6 text-2xl font-bold">
          Labeled Counter Demonstration
        </h1>
        <LabeledCounterDemo />
      </section>

      <section>
        <h1 className="mb-6 text-2xl font-bold">
          Responsive Modal Demonstration
        </h1>
        <div className="bg-card rounded-lg border p-6">
          <ResponsiveModalDemo />
        </div>
      </section>
    </div>
  );
}
