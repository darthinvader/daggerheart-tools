import { createFileRoute, Link } from '@tanstack/react-router';
import { Crown, FolderOpen, FolderPlus, Swords, Users } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-2xl font-bold">
          <Crown className="mr-2 inline-block size-6 text-amber-500" />
          GM Tools
        </span>
        <p className="text-muted-foreground mt-2">
          Manage your campaigns, track battles, and run your Daggerheart
          sessions
        </p>
      </div>

      {/* Quick Actions */}
      <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/gm/campaigns/new" className="block">
          <Card className="h-full cursor-pointer border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 transition-all hover:scale-[1.02] hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                  <FolderPlus className="size-5 text-green-500" />
                </div>
                New Campaign
              </CardTitle>
              <CardDescription>
                Create a new campaign using a campaign frame template
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/gm/campaigns" className="block">
          <Card className="h-full cursor-pointer border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 transition-all hover:scale-[1.02] hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <FolderOpen className="size-5 text-blue-500" />
                </div>
                My Campaigns
              </CardTitle>
              <CardDescription>
                View and manage your saved campaigns
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/gm/saved-encounters" className="block">
          <Card className="h-full cursor-pointer border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/10 transition-all hover:scale-[1.02] hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                  <Swords className="size-5 text-red-500" />
                </div>
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
      <h2 className="mb-4 text-xl font-semibold">Features</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="size-5 text-amber-500" />
              Campaign Frames
            </CardTitle>
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

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5 text-purple-500" />
              Player Management
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
