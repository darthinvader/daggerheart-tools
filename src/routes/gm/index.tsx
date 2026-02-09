import {
  createFileRoute,
  type ErrorComponentProps,
  Link,
} from '@tanstack/react-router';
import {
  Clock,
  Crown,
  FolderOpen,
  FolderPlus,
  MapPin,
  Music,
  Scroll,
  Sparkles,
  Swords,
  Target,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { listCampaigns } from '@/features/campaigns/campaign-storage';
import type { Campaign } from '@/lib/schemas/campaign';

export const Route = createFileRoute('/gm/')({
  component: GmDashboard,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500',
  draft: 'bg-zinc-500/10 text-zinc-400',
  paused: 'bg-amber-500/10 text-amber-500',
  completed: 'bg-blue-500/10 text-blue-500',
};

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3">
        {icon}
        <div>
          <p className="text-2xl leading-none font-bold">{value}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardHeader() {
  return (
    <div className="mb-8">
      <span className="text-2xl font-bold">
        <Crown className="mr-2 inline-block size-6 text-amber-500" />
        GM Tools
      </span>
      <p className="text-muted-foreground mt-2">
        Manage your campaigns, track battles, and run your Daggerheart sessions
      </p>
    </div>
  );
}

function QuickActionsSection() {
  return (
    <>
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

        <Link to="/gm/scheduling" className="block">
          <Card className="h-full cursor-pointer border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10 transition-all hover:scale-[1.02] hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Clock className="size-5 text-purple-500" />
                </div>
                Session Scheduling
              </CardTitle>
              <CardDescription>
                Create availability polls and share voting links with your
                players
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/gm/soundboard" className="block">
          <Card className="h-full cursor-pointer border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-pink-500/10 transition-all hover:scale-[1.02] hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-pink-500/10">
                  <Music className="size-5 text-pink-500" />
                </div>
                Soundboard
              </CardTitle>
              <CardDescription>
                Ambient music, SFX, and background tracks via YouTube,
                SoundCloud, or direct audio links
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
}

function StatsLoadingSkeleton() {
  return (
    <div className="mb-8">
      <div className="bg-muted mb-4 h-7 w-48 animate-pulse rounded" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function WelcomeCard() {
  return (
    <Card className="mb-8 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-amber-500" />
          Welcome, GM!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Start by creating a Campaign Frame — choose a pre-built setting or
          build your own from scratch. Then add NPCs, locations, quests, and run
          sessions to bring your world to life.
        </p>
        <Button asChild size="sm" className="mt-2">
          <Link to="/gm/campaigns/new">Create Your First Campaign</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function WorldAtAGlanceSection({ campaigns }: { campaigns: Campaign[] }) {
  const stats = {
    campaigns: campaigns.length,
    npcs: campaigns.reduce((sum, c) => sum + (c.npcs?.length ?? 0), 0),
    locations: campaigns.reduce(
      (sum, c) => sum + (c.locations?.length ?? 0),
      0
    ),
    quests: campaigns.reduce((sum, c) => sum + (c.quests?.length ?? 0), 0),
    sessions: campaigns.reduce((sum, c) => sum + (c.sessions?.length ?? 0), 0),
    battles: campaigns.reduce((sum, c) => sum + (c.battles?.length ?? 0), 0),
  };

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Your World at a Glance</h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          icon={<FolderOpen className="h-4 w-4 text-blue-500" />}
          label="Campaigns"
          value={stats.campaigns}
        />
        <StatCard
          icon={<User className="h-4 w-4 text-indigo-500" />}
          label="NPCs"
          value={stats.npcs}
        />
        <StatCard
          icon={<MapPin className="h-4 w-4 text-rose-500" />}
          label="Locations"
          value={stats.locations}
        />
        <StatCard
          icon={<Target className="h-4 w-4 text-orange-500" />}
          label="Quests"
          value={stats.quests}
        />
        <StatCard
          icon={<Scroll className="h-4 w-4 text-amber-500" />}
          label="Sessions"
          value={stats.sessions}
        />
        <StatCard
          icon={<Swords className="h-4 w-4 text-red-500" />}
          label="Battles"
          value={stats.battles}
        />
      </div>
    </>
  );
}

function CampaignStatsSection({
  campaigns,
  isLoading,
}: {
  campaigns: Campaign[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (campaigns.length === 0) {
    return <WelcomeCard />;
  }

  return <WorldAtAGlanceSection campaigns={campaigns} />;
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      to="/gm/campaigns/$id"
      params={{ id: campaign.id }}
      search={{ tab: 'overview' }}
      className="block"
    >
      <Card className="transition-all hover:scale-[1.01] hover:shadow-md">
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
            <div className="min-w-0">
              <p className="truncate font-medium">{campaign.name}</p>
              <p className="text-muted-foreground text-xs">
                {campaign.sessions?.length ?? 0} sessions ·{' '}
                {campaign.npcs?.length ?? 0} NPCs ·{' '}
                {campaign.quests?.length ?? 0} quests
              </p>
            </div>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[campaign.status] ?? STATUS_COLORS.draft}`}
            >
              {campaign.status}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-xs whitespace-nowrap">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(campaign.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RecentCampaignsSection({
  campaigns,
  isLoading,
}: {
  campaigns: Campaign[];
  isLoading: boolean;
}) {
  if (isLoading || campaigns.length === 0) {
    return null;
  }

  const recentCampaigns = [...campaigns]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Recent Campaigns</h2>
      <div className="mb-8 space-y-2">
        {recentCampaigns.map(campaign => (
          <CampaignRow key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </>
  );
}

function FeaturesSection() {
  return (
    <>
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
    </>
  );
}

function GmDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listCampaigns()
      .then(setCampaigns)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      <QuickActionsSection />
      <CampaignStatsSection campaigns={campaigns} isLoading={isLoading} />
      <RecentCampaignsSection campaigns={campaigns} isLoading={isLoading} />
      <FeaturesSection />
    </div>
  );
}
