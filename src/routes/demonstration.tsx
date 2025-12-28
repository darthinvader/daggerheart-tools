import { Suspense, lazy } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { Skeleton } from '@/components/ui/skeleton';

const NavbarDemo = lazy(() =>
  import('@/components/demo/navbar-demo').then(m => ({ default: m.NavbarDemo }))
);
const LabeledCounterDemo = lazy(() =>
  import('@/components/demo/labeled-counter-demo').then(m => ({
    default: m.LabeledCounterDemo,
  }))
);
const ResponsiveModalDemo = lazy(() =>
  import('@/components/demo/responsive-modal-demo').then(m => ({
    default: m.ResponsiveModalDemo,
  }))
);
const IdentityEditorDemo = lazy(() =>
  import('@/components/demo/identity-editor-demo').then(m => ({
    default: m.IdentityEditorDemo,
  }))
);
const ThresholdsEditorDemo = lazy(() =>
  import('@/components/demo/thresholds-editor-demo').then(m => ({
    default: m.ThresholdsEditorDemo,
  }))
);
const SimpleListDemo = lazy(() =>
  import('@/components/demo/simple-list-demo').then(m => ({
    default: m.SimpleListDemo,
  }))
);
const GoldTrackerDemo = lazy(() =>
  import('@/components/demo/gold-tracker-demo').then(m => ({
    default: m.GoldTrackerDemo,
  }))
);
const AncestrySelectorDemo = lazy(() =>
  import('@/components/demo/ancestry-selector-demo').then(m => ({
    default: m.AncestrySelectorDemo,
  }))
);
const CommunitySelectorDemo = lazy(() =>
  import('@/components/demo/community-selector-demo').then(m => ({
    default: m.CommunitySelectorDemo,
  }))
);
const EquipmentEditorDemo = lazy(() =>
  import('@/components/demo/equipment-editor-demo').then(m => ({
    default: m.EquipmentEditorDemo,
  }))
);
const InventoryEditorDemo = lazy(() =>
  import('@/components/demo/inventory-editor-demo').then(m => ({
    default: m.InventoryEditorDemo,
  }))
);
const ClassSelectorDemo = lazy(() =>
  import('@/components/demo/class-selector-demo').then(m => ({
    default: m.ClassSelectorDemo,
  }))
);
const LoadoutSelectorDemo = lazy(() =>
  import('@/components/demo/loadout-selector-demo').then(m => ({
    default: m.LoadoutSelectorDemo,
  }))
);

// Display demos (show-only with edit modals)
const AncestryDisplayDemo = lazy(() =>
  import('@/components/demo/ancestry-display-demo').then(m => ({
    default: m.AncestryDisplayDemo,
  }))
);
const ClassDisplayDemo = lazy(() =>
  import('@/components/demo/class-display-demo').then(m => ({
    default: m.ClassDisplayDemo,
  }))
);
const CommunityDisplayDemo = lazy(() =>
  import('@/components/demo/community-display-demo').then(m => ({
    default: m.CommunityDisplayDemo,
  }))
);
const EquipmentDisplayDemo = lazy(() =>
  import('@/components/demo/equipment-display-demo').then(m => ({
    default: m.EquipmentDisplayDemo,
  }))
);
const GoldDisplayDemo = lazy(() =>
  import('@/components/demo/gold-display-demo').then(m => ({
    default: m.GoldDisplayDemo,
  }))
);
const IdentityDisplayDemo = lazy(() =>
  import('@/components/demo/identity-display-demo').then(m => ({
    default: m.IdentityDisplayDemo,
  }))
);
const InventoryDisplayDemo = lazy(() =>
  import('@/components/demo/inventory-display-demo').then(m => ({
    default: m.InventoryDisplayDemo,
  }))
);
const LoadoutDisplayDemo = lazy(() =>
  import('@/components/demo/loadout-display-demo').then(m => ({
    default: m.LoadoutDisplayDemo,
  }))
);
const ThresholdsDisplayDemo = lazy(() =>
  import('@/components/demo/thresholds-display-demo').then(m => ({
    default: m.ThresholdsDisplayDemo,
  }))
);
const ProgressionDisplayDemo = lazy(() =>
  import('@/components/demo/progression-display-demo').then(m => ({
    default: m.ProgressionDisplayDemo,
  }))
);

function DemoSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

function DemoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <Suspense fallback={<DemoSkeleton />}>{children}</Suspense>
    </section>
  );
}

export const Route = createFileRoute('/demonstration')({
  component: Demonstration,
});

function Demonstration() {
  return (
    <div className="container mx-auto space-y-12 py-8">
      <DemoSection title="Navbar Demonstration">
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
      </DemoSection>

      <DemoSection title="Labeled Counter Demonstration">
        <LabeledCounterDemo />
      </DemoSection>

      <DemoSection title="Responsive Modal Demonstration">
        <div className="bg-card rounded-lg border p-6">
          <ResponsiveModalDemo />
        </div>
      </DemoSection>

      <DemoSection title="Identity Editor Demonstration">
        <IdentityEditorDemo />
      </DemoSection>

      <DemoSection title="Thresholds Editor Demonstration">
        <ThresholdsEditorDemo />
      </DemoSection>

      <DemoSection title="Simple List Demonstration">
        <SimpleListDemo />
      </DemoSection>

      <DemoSection title="Gold Tracker Demonstration">
        <GoldTrackerDemo />
      </DemoSection>

      <DemoSection title="Ancestry Selector Demonstration">
        <AncestrySelectorDemo />
      </DemoSection>

      <DemoSection title="Community Selector Demonstration">
        <CommunitySelectorDemo />
      </DemoSection>

      <DemoSection title="⚔️ Equipment Editor Demonstration">
        <EquipmentEditorDemo />
      </DemoSection>

      <DemoSection title="🎒 Inventory Editor Demonstration">
        <InventoryEditorDemo />
      </DemoSection>

      <DemoSection title="⚔️ Class Selector Demonstration">
        <ClassSelectorDemo />
      </DemoSection>

      <DemoSection title="📜 Loadout Selector Demonstration">
        <LoadoutSelectorDemo />
      </DemoSection>

      {/* Display Components (Show-only with Edit Modals) */}
      <div className="border-t pt-12">
        <h2 className="mb-8 text-3xl font-bold">📋 Display Components</h2>
        <p className="text-muted-foreground mb-8">
          These components show character data in a read-only format with edit
          buttons that open modal dialogs for editing.
        </p>
      </div>

      <DemoSection title="🧬 Ancestry Display">
        <AncestryDisplayDemo />
      </DemoSection>

      <DemoSection title="⚔️ Class Display">
        <ClassDisplayDemo />
      </DemoSection>

      <DemoSection title="🏘️ Community Display">
        <CommunityDisplayDemo />
      </DemoSection>

      <DemoSection title="🛡️ Equipment Display">
        <EquipmentDisplayDemo />
      </DemoSection>

      <DemoSection title="💰 Gold Display">
        <GoldDisplayDemo />
      </DemoSection>

      <DemoSection title="👤 Identity Display">
        <IdentityDisplayDemo />
      </DemoSection>

      <DemoSection title="🎒 Inventory Display">
        <InventoryDisplayDemo />
      </DemoSection>

      <DemoSection title="📜 Loadout Display">
        <LoadoutDisplayDemo />
      </DemoSection>

      <DemoSection title="❤️ Thresholds Display">
        <ThresholdsDisplayDemo />
      </DemoSection>

      <DemoSection title="⬆️ Progression Display">
        <ProgressionDisplayDemo />
      </DemoSection>
    </div>
  );
}
