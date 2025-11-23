import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/' as const)({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome to Daggerheart Tools</h3>
    </div>
  );
}
