import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/characters/new/identity')({
  component: IdentityStep,
});

function IdentityStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Identity</h2>
      <p className="text-sm text-gray-600">
        Start by filling out your character’s identity. Form fields will be
        added here.
      </p>
    </div>
  );
}
