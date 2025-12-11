import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/character/new')({
  component: NewCharacter,
});

function NewCharacter() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">New Character</h1>
      <p className="text-muted-foreground mt-2">Create a new character...</p>
    </div>
  );
}
