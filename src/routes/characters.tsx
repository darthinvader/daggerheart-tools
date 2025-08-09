import { Plus } from 'lucide-react';

import { Link, createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

function Characters() {
  return (
    <div className="mx-auto max-w-screen-sm space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Characters</h1>
        <Link to="/characters/new" preload="intent">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </Link>
      </div>

      <div className="text-muted-foreground rounded-md border p-6 text-sm">
        No characters yet. Create one to get started.
      </div>
    </div>
  );
}

export const Route = createFileRoute('/characters')({
  component: Characters,
});
