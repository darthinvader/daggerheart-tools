import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderOpen, FolderPlus, Info, Swords, Users } from 'lucide-react';
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

      {/* Demo Notice */}
      <Card className="mb-8 border-amber-500/50 bg-amber-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Info className="h-5 w-5" />
            Demo Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Campaign data is currently stored locally in your browser. Database
            sync and player invitations will be available in a future update.
          </p>
        </CardContent>
      </Card>

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

        <Card className="h-full opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="text-muted-foreground h-5 w-5" />
              Battle Tracker
              <span className="bg-muted rounded px-2 py-0.5 text-xs">
                Coming Soon
              </span>
            </CardTitle>
            <CardDescription>
              Run combat encounters with adversaries and players
            </CardDescription>
          </CardHeader>
        </Card>
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
