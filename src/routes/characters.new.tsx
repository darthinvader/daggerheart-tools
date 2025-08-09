import { Outlet, createFileRoute } from '@tanstack/react-router';

// Layout route for /characters/new
export const Route = createFileRoute('/characters/new')({
  component: NewCharacterLayout,
});

function NewCharacterLayout() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Character</h1>
        <a href="/characters" className="text-blue-600 hover:underline">
          Exit
        </a>
      </div>
      <nav className="mb-4 flex gap-3 text-sm text-gray-600">
        <a href="/characters/new/identity" className="hover:underline">
          Identity
        </a>
        <span>·</span>
        <span>Class</span>
        <span>·</span>
        <span>Traits</span>
        <span>·</span>
        <span>Equipment</span>
        <span>·</span>
        <span>Domains</span>
        <span>·</span>
        <span>Review</span>
      </nav>
      <Outlet />
    </div>
  );
}
