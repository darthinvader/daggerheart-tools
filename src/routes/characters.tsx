import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/characters')({
  component: CharactersIndex,
});

function CharactersIndex() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Characters</h1>
        <a
          href="/characters/new/identity"
          className="inline-flex items-center rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
        >
          New Character
        </a>
      </div>
      <p className="text-sm text-gray-500">
        No characters yet. Create one to get started.
      </p>
    </div>
  );
}
