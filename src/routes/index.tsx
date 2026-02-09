// Homepage with comprehensive feature overview
// Designed with 2025/2026 landing page best practices:
// - Story-driven hero with micro-animations
// - Dual-path CTAs (Player vs GM)
// - Social proof stats
// - Bold typography with gradients
// - Interactive hover states with glow effects

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
  Heart,
  Leaf,
  Scroll,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Sword,
  Swords,
  Target,
  Users,
  UsersRound,
  Zap,
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
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/' as const)({
  component: Index,
});

// ─────────────────────────────────────────────────────────────────────────────
// Data Types
// ─────────────────────────────────────────────────────────────────────────────

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

// Stats for social proof
interface StatItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

const stats: StatItem[] = [
  { value: '9', label: 'Classes', icon: Shield },
  { value: '17', label: 'Ancestries', icon: UsersRound },
  { value: '189', label: 'Domain Cards', icon: Sparkles },
  { value: '100+', label: 'Equipment', icon: Sword },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

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
      { text: 'Ambient soundboard', to: '/gm/soundboard' },
      { text: 'Session scheduling', to: '/gm/scheduling' },
      { text: 'Quick battle mode', to: '/gm/battle-tracker' },
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
      { text: 'Invite players via shareable links' },
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
  {
    to: '/references/gm-moves',
    title: 'GM Moves',
    description: 'Actions & reactions',
    icon: Target,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    count: 'GM',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

// Reusable floating decorations for visual interest
function FloatingDecorations({
  variant = 'default',
}: {
  variant?: 'default' | 'alt' | 'warm';
}) {
  const colors = {
    default: {
      c1: 'text-primary/20',
      c2: 'text-violet-500/20',
      c3: 'text-blue-500/15',
      c4: 'text-emerald-500/15',
    },
    alt: {
      c1: 'text-amber-500/20',
      c2: 'text-rose-500/15',
      c3: 'text-cyan-500/15',
      c4: 'text-purple-500/20',
    },
    warm: {
      c1: 'text-orange-500/20',
      c2: 'text-amber-500/15',
      c3: 'text-rose-500/15',
      c4: 'text-yellow-500/20',
    },
  };
  const c = colors[variant];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn(
          'absolute top-[15%] left-[8%] animate-bounce [animation-duration:4s]',
          c.c1
        )}
      >
        <Star className="size-6 md:size-8" />
      </div>
      <div
        className={cn(
          'absolute top-[20%] right-[12%] animate-bounce [animation-delay:0.5s] [animation-duration:5s]',
          c.c2
        )}
      >
        <Sparkles className="size-7 md:size-9" />
      </div>
      <div
        className={cn(
          'absolute bottom-[25%] left-[15%] animate-bounce [animation-delay:1s] [animation-duration:4.5s]',
          c.c3
        )}
      >
        <Shield className="size-5 md:size-7" />
      </div>
      <div
        className={cn(
          'absolute right-[18%] bottom-[30%] animate-bounce [animation-delay:1.5s] [animation-duration:5.5s]',
          c.c4
        )}
      >
        <Sword className="size-5 md:size-6" />
      </div>
      <div
        className={cn(
          'absolute top-[40%] left-[5%] animate-pulse [animation-duration:3s]',
          c.c2
        )}
      >
        <Heart className="size-4 md:size-5" />
      </div>
      <div
        className={cn(
          'absolute top-[60%] right-[8%] animate-pulse [animation-delay:1s] [animation-duration:4s]',
          c.c1
        )}
      >
        <Dices className="size-5 md:size-6" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-16 md:pt-16 md:pb-20">
      {/* Animated background with multiple gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="from-primary/25 via-primary/15 absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 animate-pulse rounded-full bg-radial to-transparent blur-3xl" />
        <div className="absolute right-1/4 bottom-10 h-[400px] w-[400px] translate-x-1/2 animate-pulse rounded-full bg-radial from-violet-500/20 via-purple-500/10 to-transparent blur-3xl [animation-delay:1s]" />
        <div className="absolute top-1/3 left-1/2 h-[350px] w-[350px] -translate-x-1/2 animate-pulse rounded-full bg-radial from-amber-500/15 to-transparent blur-3xl [animation-delay:2s]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <FloatingDecorations variant="default" />

      <div className="relative z-10 container mx-auto flex flex-col items-center text-center">
        {/* Badge with glow */}
        <Badge
          variant="secondary"
          className="border-primary/20 shadow-primary/10 mb-6 gap-2 px-4 py-1.5 text-sm font-medium shadow-lg"
        >
          <Zap className="size-3.5 text-amber-500" />
          The Complete Daggerheart Companion
        </Badge>

        {/* Main headline with gradient - BOLDER */}
        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <div className="from-primary via-primary shadow-primary/30 rounded-2xl bg-gradient-to-br to-violet-600 p-3 shadow-xl sm:p-4">
            <Dices className="size-10 text-white sm:size-12 md:size-14" />
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="from-primary bg-gradient-to-r via-violet-500 to-purple-600 bg-clip-text text-transparent">
              Daggerheart
            </span>
            <br className="sm:hidden" />
            <span className="text-foreground"> Tools</span>
          </h1>
        </div>

        {/* Subheadline - story-driven with emphasis */}
        <p className="text-muted-foreground mb-4 max-w-xl text-lg font-medium sm:text-xl">
          Build your hero. Run epic campaigns.{' '}
          <span className="from-primary bg-gradient-to-r to-violet-600 bg-clip-text font-bold text-transparent">
            Everything you need in one place.
          </span>
        </p>
        <p className="text-muted-foreground/70 mb-8 text-sm">
          New to Daggerheart?{' '}
          <Link
            to="/rules"
            className="text-primary hover:text-primary/80 underline underline-offset-4"
          >
            Learn the rules
          </Link>{' '}
          to get started.
        </p>

        {/* Dual-path CTAs - LARGER with more visual impact */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Player Path */}
          <Link to="/character/new" className="group">
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10 px-6 py-5 transition-all duration-300 hover:scale-[1.03] hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20 dark:from-blue-500/20 dark:to-violet-500/20">
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg shadow-blue-500/30">
                  <Users className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold">I&apos;m a Player</div>
                  <div className="text-muted-foreground text-sm">
                    Create & manage characters
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground ml-2 size-6 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500" />
              </div>
            </div>
          </Link>

          {/* GM Path */}
          <Link to="/gm" className="group">
            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 px-6 py-5 transition-all duration-300 hover:scale-[1.03] hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/20 dark:from-amber-500/20 dark:to-rose-500/20">
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 shadow-lg shadow-amber-500/30">
                  <Crown className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold">I&apos;m a GM</div>
                  <div className="text-muted-foreground text-sm">
                    Run campaigns & battles
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground ml-2 size-6 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-500" />
              </div>
            </div>
          </Link>
        </div>

        {/* Social proof stats - with better visual treatment */}
        <div className="bg-muted/50 flex flex-wrap items-center justify-center gap-6 rounded-2xl border px-6 py-4 shadow-inner sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="group flex items-center gap-2">
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-1.5 transition-colors">
                  <Icon className="text-primary size-4" />
                </div>
                <div>
                  <span className="text-foreground text-xl font-bold">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground ml-1.5 text-sm">
                    {stat.label}
                  </span>
                </div>
                {idx < stats.length - 1 && (
                  <span className="text-border ml-3 hidden sm:inline">•</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5" />
      </div>

      {/* Floating decorations for visual interest */}
      <FloatingDecorations variant="alt" />

      <div className="relative z-10 container mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Everything You Need
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Complete toolkit for players and Game Masters
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.to}
                to={section.to}
                className={cn(
                  'group animate-fade-up block h-full',
                  `stagger-${idx + 1}`
                )}
              >
                <Card
                  className={cn(
                    'relative h-full overflow-hidden border-l-4 transition-all duration-300',
                    'hover:-translate-y-0.5 hover:shadow-lg',
                    section.borderColor,
                    'group-hover:border-l-primary'
                  )}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                      section.bgColor
                    )}
                  />
                  {section.badge && (
                    <Badge className="absolute top-2 right-2 text-xs">
                      {section.badge}
                    </Badge>
                  )}
                  <CardHeader className="relative pb-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
                          section.bgColor
                        )}
                      >
                        <Icon className={cn('size-5', section.iconColor)} />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-primary text-base transition-colors">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-xs leading-relaxed">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      {section.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-muted-foreground group-hover:text-foreground/80 flex items-center gap-1 transition-colors"
                        >
                          <ArrowRight className="text-primary/60 size-2.5 shrink-0" />
                          <span className="truncate">{feature.text}</span>
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
    <section className="bg-muted/30 relative overflow-hidden px-4 py-16">
      <div className="relative z-10 container mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Reference Guide
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Browse the complete Daggerheart SRD
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible md:grid-cols-3 lg:grid-cols-9">
          {referenceCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.to}
                to={category.to}
                className={cn(
                  'group animate-fade-up block min-w-[120px] sm:min-w-0',
                  `stagger-${(idx % 6) + 1}`
                )}
              >
                <Card
                  className={cn(
                    'relative h-full overflow-hidden text-center transition-all duration-300',
                    'hover:scale-[1.03] hover:shadow-lg',
                    'group-hover:border-primary/50'
                  )}
                >
                  {/* Glow effect */}
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                      category.bgColor
                    )}
                  />
                  {category.count && (
                    <Badge
                      variant="secondary"
                      className="absolute top-1 right-1 px-1.5 py-0 text-[10px] font-bold"
                    >
                      {category.count}
                    </Badge>
                  )}
                  <CardHeader className="relative p-3 pb-1">
                    <div
                      className={cn(
                        'mx-auto flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
                        category.bgColor
                      )}
                    >
                      <Icon className={cn('size-5', category.iconColor)} />
                    </div>
                    <CardTitle className="group-hover:text-primary mt-1.5 text-sm font-semibold transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/references">
              Browse All
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
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 text-center">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="from-primary/10 absolute inset-0 bg-gradient-to-t via-violet-500/5 to-transparent" />
      </div>

      {/* Floating decorations */}
      <FloatingDecorations variant="warm" />

      <div className="relative z-10 container mx-auto max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Sign in to save your progress
        </h2>

        <p className="text-muted-foreground mx-auto mb-8 max-w-md text-base">
          Sync characters across devices, manage campaigns, and access your
          content from anywhere. Free and always will be.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group shadow-primary/30 gap-2 shadow-lg"
          >
            <Link to="/login">
              <Sparkles className="size-5" />
              Sign In
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/character/new">
              <Users className="size-5" />
              Try Without Account
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground/60 mt-10 text-sm">
          Free • Open Source • Fan-made with love
        </p>
      </div>
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="from-primary/30 h-px max-w-24 flex-1 bg-gradient-to-r to-transparent" />
      <Sparkles className="text-primary/30 size-4 animate-pulse" />
      <div className="from-primary/30 h-px max-w-24 flex-1 bg-gradient-to-l to-transparent" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

function Index() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <HeroSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <ReferencesSection />
      <SectionDivider />
      <CTASection />
    </div>
  );
}
