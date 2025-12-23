import { createFileRoute } from '@tanstack/react-router';

import { GoldTrackerDemo } from '@/components/demo/gold-tracker-demo';
import { IdentityEditorDemo } from '@/components/demo/identity-editor-demo';
import { LabeledCounterDemo } from '@/components/demo/labeled-counter-demo';
import { NavbarDemo } from '@/components/demo/navbar-demo';
import { ResponsiveModalDemo } from '@/components/demo/responsive-modal-demo';
import { SimpleListDemo } from '@/components/demo/simple-list-demo';
import { ThresholdsEditorDemo } from '@/components/demo/thresholds-editor-demo';

export const Route = createFileRoute('/demonstration')({
  component: Demonstration,
});

function Demonstration() {
  return (
    <div className="container mx-auto space-y-12 py-8">
      <section>
        <h1 className="mb-6 text-2xl font-bold">Navbar Demonstration</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-muted-foreground mb-3 text-sm font-medium">
              Desktop View
            </h2>
            <NavbarDemo forceMode="desktop" />
          </div>
          <div>
            <h2 className="text-muted-foreground mb-3 text-sm font-medium">
              Mobile View
            </h2>
            <div className="max-w-xs">
              <NavbarDemo forceMode="mobile" />
            </div>
          </div>
        </div>
      </section>

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

      <section>
        <h1 className="mb-6 text-2xl font-bold">
          Identity Editor Demonstration
        </h1>
        <IdentityEditorDemo />
      </section>

      <section>
        <h1 className="mb-6 text-2xl font-bold">
          Thresholds Editor Demonstration
        </h1>
        <ThresholdsEditorDemo />
      </section>

      <section>
        <h1 className="mb-6 text-2xl font-bold">Simple List Demonstration</h1>
        <SimpleListDemo />
      </section>

      <section>
        <h1 className="mb-6 text-2xl font-bold">Gold Tracker Demonstration</h1>
        <GoldTrackerDemo />
      </section>
    </div>
  );
}
