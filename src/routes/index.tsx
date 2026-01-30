// Homepage with comprehensive feature overview

import { createFileRoute, Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Backpack,
  Beaker,
  BookOpen,
  Crown,
  Dices,
  FolderOpen,
  Globe,
  Leaf,
  Plus,
  Scroll,
  Shield,
  ShieldAlert,
  Sparkles,
  Sword,
  Swords,
  Users,
  UsersRound,
  Wand2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/' as const)({
  component: Index,
});

// ─────────────────────────────────────────────────────────────────────────────
// Data Types
// ─────────────────────────────────────────────────────────────────────────────

interface QuickAction {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

interface FeatureSection {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  to: string;
  badge?: string;
  features: { text: string; to?: string }[];
}

interface ReferenceCategory {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  count?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const quickActions: QuickAction[] = [
  {
    to: '/character/new',
    label: 'New Character',
    description: 'Create a new character with guided setup',
    icon: Plus,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    to: '/character',
    label: 'My Characters',
    description: 'View and manage your characters',
    icon: Users,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
  },
  {
    to: '/gm',
    label: 'GM Tools',
    description: 'Dashboard for Game Masters',
    icon: Crown,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    to: '/gm/campaigns',
    label: 'My Campaigns',
    description: 'Manage your campaign frames',
    icon: FolderOpen,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    to: '/homebrew',
    label: 'My Homebrew',
    description: 'Create and manage custom content',
    icon: Beaker,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    to: '/homebrew/browse',
    label: 'Browse Homebrew',
    description: 'Discover community creations',
    icon: Globe,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
];

const featureSections: FeatureSection[] = [
  {
    title: 'Character Builder',
    description:
      'Create and manage Daggerheart characters with an intuitive interface. Auto-save, cloud sync, and mobile-friendly design.',
    icon: Users,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-l-blue-500',
    to: '/character',
    badge: 'Start Here',
    features: [
      { text: 'Guided creation wizard', to: '/character/new' },
      { text: 'Quick View dashboard', to: '/character' },
      { text: 'Level-up progression tracking' },
      { text: 'Cloud sync & auto-save' },
      { text: 'Damage calculator with thresholds' },
      { text: 'Companion management' },
    ],
  },
  {
    title: 'GM Tools',
    description:
      'Everything you need to run Daggerheart campaigns. Battle tracker, campaign management, and session tools.',
    icon: Crown,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-l-amber-500',
    to: '/gm',
    badge: 'For GMs',
    features: [
      { text: 'GM Dashboard', to: '/gm' },
      { text: 'Campaign management', to: '/gm/campaigns' },
      { text: 'Battle tracker', to: '/gm/saved-encounters' },
      { text: 'Campaign frame templates', to: '/gm/campaigns/new' },
      { text: 'Session notes & prep' },
      { text: 'Fear pool tracking' },
    ],
  },
  {
    title: 'Combat Encounters',
    description:
      'Run combat encounters with adversary rosters, fear tracking, spotlight management, and auto-save.',
    icon: Swords,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-l-red-500',
    to: '/gm/saved-encounters',
    features: [
      { text: 'Standalone encounters', to: '/gm/saved-encounters' },
      { text: 'Campaign-linked battles' },
      { text: 'Adversary roster management' },
      { text: 'Fear pool tracking' },
      { text: 'Spotlight history' },
      { text: 'Environment effects' },
    ],
  },
  {
    title: 'Homebrew Content',
    description:
      'Create custom adversaries, domain cards, classes, ancestries, and more. Share with the community or keep private.',
    icon: Beaker,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-l-purple-500',
    to: '/homebrew',
    badge: 'Create & Share',
    features: [
      { text: 'My Homebrew library', to: '/homebrew' },
      { text: 'Browse community content', to: '/homebrew/browse' },
      { text: 'Create new content', to: '/homebrew/new' },
      { text: 'Fork & customize' },
      { text: 'Private or public visibility' },
      { text: 'Campaign-only sharing' },
    ],
  },
  {
    title: 'Campaign Management',
    description:
      'Create campaigns using pre-built frames like Witherwild or Five Banners. Define themes, tones, and session zero questions.',
    icon: FolderOpen,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-l-emerald-500',
    to: '/gm/campaigns',
    features: [
      { text: 'My Campaigns', to: '/gm/campaigns' },
      { text: 'New Campaign', to: '/gm/campaigns/new' },
      { text: 'Campaign frame templates' },
      { text: 'Themes & distinctions' },
      { text: 'Session zero questions' },
      { text: 'Invite players (coming soon)' },
    ],
  },
  {
    title: 'Rules & Guides',
    description:
      'Browse the complete Daggerheart rules with easy-to-follow breakdowns for players and GMs alike.',
    icon: BookOpen,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-l-indigo-500',
    to: '/rules',
    features: [
      { text: 'Core Mechanics', to: '/rules/core-mechanics' },
      { text: 'Character Creation', to: '/rules/character-creation' },
      { text: 'Combat & Consequences', to: '/rules/combat' },
      { text: 'Downtime & Advancement', to: '/rules/downtime-advancement' },
      { text: 'GM Guide', to: '/rules/gm-guide' },
      { text: 'Campaign Frames', to: '/rules/campaign-frames' },
    ],
  },
];

const referenceCategories: ReferenceCategory[] = [
  {
    to: '/references/equipment',
    title: 'Equipment',
    description: 'Weapons, armor & mobility',
    icon: Sword,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    count: '100+',
  },
  {
    to: '/references/classes',
    title: 'Classes',
    description: 'All 9 classes & subclasses',
    icon: Shield,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    count: '9',
  },
  {
    to: '/references/ancestries',
    title: 'Ancestries',
    description: 'Traits & characteristics',
    icon: UsersRound,
    iconColor: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    count: '17',
  },
  {
    to: '/references/communities',
    title: 'Communities',
    description: 'Backgrounds & bonds',
    icon: Users,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    count: '9',
  },
  {
    to: '/references/domain-cards',
    title: 'Domain Cards',
    description: 'Spells & abilities',
    icon: Sparkles,
    iconColor: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    count: '189',
  },
  {
    to: '/references/inventory',
    title: 'Inventory',
    description: 'Items & consumables',
    icon: Backpack,
    iconColor: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    count: '80+',
  },
  {
    to: '/references/adversaries',
    title: 'Adversaries',
    description: 'Monsters & enemies',
    icon: ShieldAlert,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    count: 'GM',
  },
  {
    to: '/references/environments',
    title: 'Environments',
    description: 'Scenes & hazards',
    icon: Leaf,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    count: 'GM',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="from-primary/5 via-background to-background relative overflow-hidden bg-linear-to-b px-4 py-16 text-center md:py-24">
      {/* Background decorations */}
      <div className="bg-primary/10 animate-pulse-slow absolute top-10 left-10 h-32 w-32 rounded-full blur-3xl" />
      <div className="bg-primary/5 animate-pulse-slow animation-delay-1000 absolute right-10 bottom-20 h-40 w-40 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto">
        <div className="mb-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <div className="bg-primary/10 rounded-xl p-2 sm:p-3">
            <Dices className="text-primary size-8 sm:size-10 md:size-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-primary">Daggerheart</span> Tools
          </h1>
        </div>

        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-base sm:text-lg md:text-xl">
          The complete companion app for Daggerheart. Build characters, run
          campaigns, track battles, create homebrew, and browse the full SRD.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="group gap-2 shadow-lg">
            <Link to="/character/new">
              <Sparkles className="size-5" />
              Create Character
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="group gap-2">
            <Link to="/gm">
              <Crown className="size-5" />
              GM Tools
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function QuickActionsSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Quick Actions</h2>
        <p className="text-muted-foreground">Jump straight to what you need</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <Link key={action.to} to={action.to} className="group block">
              <Card
                className={`h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${action.borderColor} border-2`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${action.bgColor}`}
                    >
                      <Icon className={`size-5 ${action.iconColor}`} />
                    </div>
                    {action.label}
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="bg-muted/30 px-4 py-12">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
            Everything You Need
          </h2>
          <p className="text-muted-foreground">
            A complete toolkit for players and Game Masters
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureSections.map(section => {
            const Icon = section.icon;
            return (
              <Link
                key={section.to}
                to={section.to}
                className="group block h-full"
              >
                <Card
                  className={`group-hover:border-primary/50 relative h-full border-l-4 transition-all hover:shadow-lg ${section.borderColor}`}
                >
                  {section.badge && (
                    <Badge className="absolute top-3 right-3 text-xs">
                      {section.badge}
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <div
                      className={`mb-2 flex size-12 items-center justify-center rounded-xl ${section.bgColor}`}
                    >
                      <Icon className={`size-6 ${section.iconColor}`} />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5 text-sm">
                      {section.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-muted-foreground flex items-center gap-2"
                        >
                          <ArrowRight className="size-3 shrink-0" />
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ReferencesSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Reference Guide</h2>
        <p className="text-muted-foreground">
          Browse the complete SRD database
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {referenceCategories.map(category => {
          const Icon = category.icon;
          return (
            <Link key={category.to} to={category.to} className="group block">
              <Card className="group-hover:border-primary/50 relative h-full text-center transition-all hover:scale-[1.02] hover:shadow-lg">
                {category.count && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 text-xs"
                  >
                    {category.count}
                  </Badge>
                )}
                <CardHeader className="pb-2">
                  <div
                    className={`mx-auto flex size-12 items-center justify-center rounded-xl ${category.bgColor}`}
                  >
                    <Icon className={`size-6 ${category.iconColor}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary text-base transition-colors">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/references">
            Browse All References
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/rules">
            <Scroll className="size-4" />
            Learn the Rules
          </Link>
        </Button>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="from-primary/5 to-background relative bg-linear-to-b px-4 py-16 text-center">
      <div className="relative z-10 container mx-auto max-w-2xl">
        <div className="bg-primary/10 mx-auto mb-6 w-fit rounded-full p-4">
          <Dices className="text-primary size-12" />
        </div>
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Ready to begin your adventure?
        </h2>
        <p className="text-muted-foreground mb-8">
          Create your first character, start a campaign as GM, or explore the
          reference guides.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="group gap-2 shadow-lg">
            <Link to="/character/new">
              <Sparkles className="size-5" />
              Create Character
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/gm">
              <Wand2 className="size-5" />
              GM Tools
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

function Index() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <HeroSection />
      <QuickActionsSection />
      <FeaturesSection />
      <ReferencesSection />
      <CTASection />
    </div>
  );
}
