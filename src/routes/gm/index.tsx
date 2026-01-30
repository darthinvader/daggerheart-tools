import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderOpen, FolderPlus, Swords, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/gm/')({
  component: GmDashboard,
});

function GmDashboard() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">GM Tools</h1>
        <p className="text-muted-foreground text-lg">
          Manage your campaigns, track battles, and run your Daggerheart
          sessions
        </p>
      </div>

      {/* Quick Actions */}
      <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/gm/campaigns/new" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="text-primary h-5 w-5" />
                New Campaign
              </CardTitle>
              <CardDescription>
                Create a new campaign using a campaign frame template
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/gm/campaigns" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="text-primary h-5 w-5" />
                My Campaigns
              </CardTitle>
              <CardDescription>
                View and manage your saved campaigns
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/gm/saved-encounters" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="text-primary h-5 w-5" />
                Combat Encounters
              </CardTitle>
              <CardDescription>
                Manage and run combat encounters for your campaigns or one-off
                sessions
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Features Overview */}
      <h2 className="mb-4 text-2xl font-semibold">Features</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaign Frames</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Choose from pre-built frames (Witherwild, Five Banners)</li>
              <li>Customize pitch, themes, tones, and distinctions</li>
              <li>Define campaign mechanics and principles</li>
              <li>Create session zero discussion questions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4" />
              Player Management
              <span className="bg-muted rounded px-2 py-0.5 text-xs">
                Coming Soon
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Invite players via shareable links</li>
              <li>Track character sheets and progression</li>
              <li>Manage party resources and inventory</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
