import { Link, createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function NewCharacterSheet() {
  // Skeleton page for single-route creation. Sections will open drawers later.
  return (
    <div className="mx-auto max-w-screen-sm space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Character</h1>
        <Button asChild variant="ghost">
          <Link to="/characters">Close</Link>
        </Button>
      </div>

      {/* Summary section (sticky in future iteration) */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Name, Class, Level, quick HP/Stress controls will go here.
        </CardContent>
      </Card>

      {/* Identity section */}
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Name, pronouns, ancestry, community…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Class & Subclass */}
      <Card>
        <CardHeader>
          <CardTitle>Class & Subclass</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Class selection and subclass…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Traits */}
      <Card>
        <CardHeader>
          <CardTitle>Traits</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Six core traits with steppers…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            HP, Stress, Armor, Evasion, Hope…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Domains */}
      <Card>
        <CardHeader>
          <CardTitle>Domains & Loadout</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Loadout, Vault, selection…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Weapons, armor, items, gold…
          </div>
          <Button size="sm" variant="outline" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>

      <div className="sticky bottom-20 z-[1] sm:static">
        <div className="bg-card/90 supports-[backdrop-filter]:bg-card/60 rounded-md border p-3 backdrop-blur">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" asChild>
              <Link to="/characters">Cancel</Link>
            </Button>
            <Button disabled>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/characters/new')({
  component: NewCharacterSheet,
});
