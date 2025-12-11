import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/character')({
  component: Character,
});

function Character() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Character</h1>
      <p className="text-muted-foreground mt-2">Coming soon...</p>
    </div>
  );
}
