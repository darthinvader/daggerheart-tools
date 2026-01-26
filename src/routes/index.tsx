// Homepage with page-specific feature cards and sections

import { createFileRoute, Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Backpack,
  BedDouble,
  BookOpen,
  Calculator,
  ChevronRight,
  Dices,
  ExternalLink,
  Heart,
  Leaf,
  PawPrint,
  Scroll,
  Shield,
  ShieldAlert,
  Sparkles,
  Sword,
  Swords,
  Timer,
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
import { SmartTooltip } from '@/components/ui/smart-tooltip';

export const Route = createFileRoute('/' as const)({
  component: Index,
});

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface ReferenceCategory {
  to: string;
  title: string;
  description: string;
  tooltip: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  count?: string;
}

const referenceCategories: ReferenceCategory[] = [
  {
    to: '/references/equipment',
    title: 'Equipment',
    description: 'Weapons, armor & mobility',
    tooltip:
      'Browse all weapons by tier, armor types including combat wheelchairs, and compare damage dice.',
    icon: Sword,
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    count: '100+',
  },
  {
    to: '/references/classes',
    title: 'Classes',
    description: 'Subclasses & features',
    tooltip:
      'All 9 classes with subclasses, foundation features, domain assignments, and progression trees.',
    icon: Shield,
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    count: '9',
  },
  {
    to: '/references/ancestries',
    title: 'Ancestries',
    description: 'Traits & characteristics',
    tooltip:
      'Unique ancestry features, physical characteristics, and cultural backgrounds for character creation.',
    icon: UsersRound,
    iconColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10 group-hover:bg-teal-500/20',
    count: '17',
  },
  {
    to: '/references/communities',
    title: 'Communities',
    description: 'Backgrounds & bonds',
    tooltip:
      'Community backgrounds that define your connections, upbringing, and unique community features.',
    icon: Users,
    iconColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10 group-hover:bg-green-500/20',
    count: '21',
  },
  {
    to: '/references/domain-cards',
    title: 'Domain Cards',
    description: 'Spells & abilities',
    tooltip:
      'Search all domain cards by domain, tier, or keyword. Filter by ability type and recall cost.',
    icon: Sparkles,
    iconColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 group-hover:bg-violet-500/20',
    count: '200+',
  },
  {
    to: '/references/inventory',
    title: 'Inventory',
    description: 'Items & consumables',
    tooltip:
      'Utility items, potions, relics, weapon modifications, and crafting recipes organized by category.',
    icon: Backpack,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
    count: '80+',
  },
  {
    to: '/references/adversaries',
    title: 'Adversaries',
    description: 'Foes & encounters',
    tooltip:
      'Adversary roles (Solo, Leader, Bruiser, etc.), tiers, and traits for building challenging encounters.',
    icon: ShieldAlert,
    iconColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10 group-hover:bg-red-500/20',
    count: 'GM',
  },
  {
    to: '/references/environments',
    title: 'Environments',
    description: 'Scenes & hazards',
    tooltip:
      'Scene tags, environmental hazards, and encounter flavor to bring your locations to life.',
    icon: Leaf,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    count: 'GM',
  },
];

interface FeatureHighlight {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  to: string;
}

const featureHighlights: FeatureHighlight[] = [
  {
    title: 'Quick View',
    description:
      'See your entire character at a glance—stats, abilities, and resources in one dashboard.',
    icon: Zap,
    iconColor: 'text-yellow-500',
    to: '/character',
  },
  {
    title: 'Damage Calc',
    description:
      'Calculate damage with armor reduction, threshold tracking, and armor sacrifice.',
    icon: Calculator,
    iconColor: 'text-red-500',
    to: '/character',
  },
  {
    title: 'Rest & Recovery',
    description:
      'Short rests, long rests, and respite with automatic HP, stress, and hope recovery.',
    icon: BedDouble,
    iconColor: 'text-blue-500',
    to: '/character',
  },
  {
    title: 'Session Tracker',
    description:
      'Log adventures, track downtime activities, and record campaign progress.',
    icon: Timer,
    iconColor: 'text-purple-500',
    to: '/character',
  },
  {
    title: 'Companions',
    description:
      'Create animal companions with stats, training progress, and stress tracking.',
    icon: PawPrint,
    iconColor: 'text-orange-500',
    to: '/character',
  },
  {
    title: 'Death & Scars',
    description:
      'Handle death moves with dramatic outcomes and track permanent scars on hope.',
    icon: Heart,
    iconColor: 'text-pink-500',
    to: '/character',
  },
];

interface FeatureCard {
  title: string;
  description: string;
  icon: LucideIcon;
  features: { text: string; to?: string }[];
  borderColor: string;
  to: string;
  badge?: string;
}

const mainFeatures: FeatureCard[] = [
  {
    title: 'Character Builder',
    description:
      'Create characters with an intuitive onboarding wizard. Mobile-friendly tabbed interface with auto-save.',
    icon: Users,
    borderColor: 'border-l-blue-500',
    to: '/character/new',
    badge: 'Start Here',
    features: [
      { text: 'Guided creation wizard', to: '/character/new' },
      { text: 'Quick View dashboard', to: '/character' },
      { text: 'Cloud sync & auto-save' },
      { text: 'Level-up progression', to: '/rules/downtime-advancement' },
    ],
  },
  {
    title: 'Combat Tools',
    description:
      'Handle the heat of battle with damage calculators, threshold tracking, and loadout management.',
    icon: Swords,
    borderColor: 'border-l-red-500',
    to: '/character',
    features: [
      { text: 'Damage calculator with armor' },
      { text: 'HP/Stress thresholds', to: '/rules/combat' },
      { text: 'Armor slot management' },
      { text: 'Conditions & status effects' },
    ],
  },
  {
    title: 'Session Management',
    description:
      'Track adventures between sessions with rest management, downtime moves, and session logging.',
    icon: Timer,
    borderColor: 'border-l-purple-500',
    to: '/character',
    features: [
      { text: 'Short, long rest & respite', to: '/rules/downtime-advancement' },
      { text: 'Downtime activities', to: '/rules/downtime-advancement' },
      { text: 'Session notes & countdowns' },
      { text: 'Death move resolution', to: '/rules/combat' },
    ],
  },
  {
    title: 'Companion System',
    description:
      'Manage animal companions with their own stat blocks, training progress, and stress tracking.',
    icon: PawPrint,
    borderColor: 'border-l-orange-500',
    to: '/character',
    badge: 'Beastmaster',
    features: [
      { text: 'Companion stat blocks' },
      { text: 'Training progression' },
      { text: 'Companion stress & actions' },
      { text: 'Link to class features', to: '/references/classes' },
    ],
  },
  {
    title: 'Equipment & Inventory',
    description:
      'Organize gear, weapons, armor, domain cards, and consumables with powerful filtering.',
    icon: Backpack,
    borderColor: 'border-l-amber-500',
    to: '/references/equipment',
    features: [
      { text: 'Weapons & armor loadouts', to: '/references/equipment' },
      { text: 'Domain card deck', to: '/references/domain-cards' },
      { text: 'Gold & resource tracking' },
      { text: 'Inventory organization', to: '/references/inventory' },
    ],
  },
  {
    title: 'Reference & Rules',
    description:
      'Browse complete SRD data and friendly rule breakdowns for players and GMs alike.',
    icon: BookOpen,
    borderColor: 'border-l-indigo-500',
    to: '/references',
    features: [
      { text: 'Searchable SRD database', to: '/references' },
      { text: 'Adversaries & environments', to: '/references/adversaries' },
      { text: 'Illustrated rules guide', to: '/rules' },
      { text: 'Quick-reference lookups', to: '/references' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function FeatureHighlightCard({ feature }: { feature: FeatureHighlight }) {
  const Icon = feature.icon;
  return (
    <SmartTooltip content={feature.description} side="bottom">
      <Link to={feature.to} className="group block">
        <div className="bg-card/80 hover:bg-card group-focus-visible:ring-ring flex flex-col items-center rounded-xl border p-2.5 backdrop-blur-sm transition-all duration-200 group-focus-visible:ring-2 hover:scale-105 hover:shadow-lg sm:p-4">
          <Icon
            className={`mb-1.5 h-5 w-5 sm:mb-2 sm:h-6 sm:w-6 ${feature.iconColor}`}
          />
          <span className="text-center text-[10px] leading-tight font-medium sm:text-xs">
            {feature.title}
          </span>
        </div>
      </Link>
    </SmartTooltip>
  );
}

function ReferenceCategoryCard({ category }: { category: ReferenceCategory }) {
  const Icon = category.icon;
  return (
    <SmartTooltip content={category.tooltip} side="bottom">
      <Link to={category.to} className="group block h-full">
        <Card className="group-hover:border-primary/50 group-focus-visible:ring-ring relative h-full overflow-hidden text-center transition-all duration-200 group-focus-visible:ring-2 hover:scale-[1.02] hover:shadow-xl">
          {category.count && (
            <Badge
              variant="secondary"
              className="absolute top-1.5 right-1.5 px-1.5 py-0 text-[9px] sm:top-2 sm:right-2 sm:px-2 sm:py-0.5 sm:text-[10px]"
            >
              {category.count}
            </Badge>
          )}
          <CardHeader className="p-3 pb-1.5 sm:p-6 sm:pb-2">
            <div
              className={`mx-auto rounded-lg p-2 transition-all duration-200 sm:rounded-xl sm:p-3 ${category.bgColor}`}
            >
              <Icon className={`size-5 sm:size-6 ${category.iconColor}`} />
            </div>
            <CardTitle className="group-hover:text-primary text-sm font-semibold transition-colors sm:text-base">
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <CardDescription className="hidden text-xs sm:block">
              {category.description}
            </CardDescription>
            <div className="text-primary mt-1 flex items-center justify-center gap-0.5 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100 sm:mt-2 sm:gap-1 sm:text-xs">
              Explore <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </SmartTooltip>
  );
}

function MainFeatureCard({ feature }: { feature: FeatureCard }) {
  const Icon = feature.icon;
  return (
    <Link to={feature.to} className="group block h-full">
      <Card
        className={`group-hover:border-primary/50 group-focus-visible:ring-ring relative h-full border-l-4 transition-all duration-200 group-focus-visible:ring-2 hover:shadow-lg ${feature.borderColor}`}
      >
        {feature.badge && (
          <Badge className="absolute top-2 right-2 px-1.5 py-0 text-[9px] sm:top-3 sm:right-3 sm:px-2 sm:py-0.5 sm:text-[10px]">
            {feature.badge}
          </Badge>
        )}
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <Icon className="text-primary mb-1.5 h-8 w-8 transition-transform group-hover:scale-110 sm:mb-2 sm:h-10 sm:w-10" />
          <CardTitle className="group-hover:text-primary text-base transition-colors sm:text-lg">
            {feature.title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <ul className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
            {feature.features.map((item, idx) =>
              item.to ? (
                <li key={idx} className="flex items-center gap-1.5 sm:gap-2">
                  <ChevronRight className="text-muted-foreground h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                  <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-primary underline-offset-2 transition-colors hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    {item.text}
                  </Link>
                </li>
              ) : (
                <li
                  key={idx}
                  className="text-muted-foreground flex items-center gap-1.5 sm:gap-2"
                >
                  <ChevronRight className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                  {item.text}
                </li>
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}

function HeroSection() {
  return (
    <section className="from-primary/5 via-background to-background relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-b px-4 py-16 text-center md:py-24">
      <div className="bg-primary/10 animate-pulse-slow absolute top-10 left-10 h-32 w-32 rounded-full blur-3xl" />
      <div className="bg-primary/5 animate-pulse-slow animation-delay-1000 absolute right-10 bottom-20 h-40 w-40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="mb-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <div className="bg-primary/10 rounded-xl p-2 sm:p-3">
            <Dices className="text-primary h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-primary">Daggerheart</span> Tools
          </h1>
        </div>

        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl px-2 text-base sm:text-lg md:text-xl">
          The complete companion app for{' '}
          <SmartTooltip content="The collaborative fantasy TTRPG by Darrington Press">
            <span className="text-foreground cursor-help border-b border-dashed">
              Daggerheart
            </span>
          </SmartTooltip>
          . Build characters, calculate damage, track sessions, manage
          companions, and browse the full SRD—all from your phone or desktop.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="default"
            className="text-primary-foreground group gap-2 shadow-lg sm:text-base"
          >
            <Link to="/character/new">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              Create Character
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="default"
            variant="outline"
            className="group gap-2"
          >
            <Link to="/character">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              View Characters
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/rules"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs transition-colors sm:text-sm"
          >
            <Scroll className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Rules
          </Link>
          <Link
            to="/references"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs transition-colors sm:text-sm"
          >
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            References
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-10 grid w-full max-w-5xl grid-cols-2 gap-2 px-2 sm:mt-12 sm:grid-cols-3 sm:gap-3 sm:px-4 md:mt-16 lg:grid-cols-6">
        {featureHighlights.map(feature => (
          <FeatureHighlightCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function MainFeaturesSection() {
  return (
    <section className="bg-muted/30 px-3 py-10 sm:px-4 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-xl font-bold sm:mb-3 sm:text-2xl md:text-3xl">
            Everything you need
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-sm sm:text-base">
            A complete toolkit for players and GMs.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mainFeatures.map(feature => (
            <MainFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferenceGuideSection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-3 flex flex-col items-center justify-center gap-1 sm:mb-4 sm:flex-row sm:gap-2">
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              Reference Guide
            </h2>
            <SmartTooltip content="All data sourced from the official Daggerheart SRD">
              <span className="text-muted-foreground cursor-help">
                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </SmartTooltip>
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-sm sm:text-base">
            Browse game data with search and filtering. Tap any card for
            details.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
          {referenceCategories.map(category => (
            <ReferenceCategoryCard key={category.to} category={category} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-8">
          <Button asChild variant="outline" className="group gap-2">
            <Link to="/references">
              Browse All References
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/rules">
              <Scroll className="h-4 w-4" />
              Learn the Rules
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function RulesQuickAccessSection() {
  return (
    <section className="bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <Link to="/rules" className="group block">
          <Card className="group-hover:border-primary/50 group-focus-visible:ring-ring overflow-hidden transition-all duration-200 group-focus-visible:ring-2 hover:shadow-xl">
            <div className="h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardContent className="flex flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:gap-6 sm:px-6 sm:py-8">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                <div className="rounded-lg bg-indigo-500/10 p-3 transition-transform group-hover:scale-110 sm:rounded-xl sm:p-4">
                  <Scroll className="h-6 w-6 text-indigo-600 sm:h-8 sm:w-8 dark:text-indigo-400" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="group-hover:text-primary text-lg font-semibold transition-colors sm:text-xl">
                    Rules Guide
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">
                    Core mechanics, combat, downtime, and GM tools
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start sm:gap-2">
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[9px] sm:px-2 sm:py-0.5 sm:text-[10px]"
                    >
                      Core
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[9px] sm:px-2 sm:py-0.5 sm:text-[10px]"
                    >
                      Combat
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[9px] sm:px-2 sm:py-0.5 sm:text-[10px]"
                    >
                      Downtime
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[9px] sm:px-2 sm:py-0.5 sm:text-[10px]"
                    >
                      GM
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="group/btn sm:size-default shrink-0 gap-2"
              >
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative px-4 py-12 text-center sm:py-20">
      <div className="from-primary/5 to-background absolute inset-0 bg-linear-to-b" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3 sm:mb-6 sm:p-4">
          <Dices className="text-primary h-8 w-8 sm:h-12 sm:w-12" />
        </div>
        <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
          Ready to begin your adventure?
        </h2>
        <p className="text-muted-foreground mb-6 px-2 text-sm sm:mb-8 sm:text-base">
          Create your first character in minutes with our guided wizard, or dive
          into the reference guides to prepare for your next session.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="default"
            className="text-primary-foreground group gap-2 shadow-lg"
          >
            <Link to="/character/new">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              Create Character
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="default"
            variant="outline"
            className="group gap-2"
          >
            <Link to="/references">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              References
            </Link>
          </Button>
        </div>

        <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:mt-8 sm:gap-x-6 sm:gap-y-2 sm:text-sm">
          <Link
            to="/rules/core-mechanics"
            className="hover:text-primary transition-colors"
          >
            Core Mechanics
          </Link>
          <span className="text-muted-foreground/50 hidden sm:inline">•</span>
          <Link
            to="/rules/combat"
            className="hover:text-primary transition-colors"
          >
            Combat
          </Link>
          <span className="text-muted-foreground/50 hidden sm:inline">•</span>
          <Link
            to="/rules/character-creation"
            className="hover:text-primary transition-colors"
          >
            Character Creation
          </Link>
          <span className="text-muted-foreground/50 hidden sm:inline">•</span>
          <Link
            to="/rules/gm-guide"
            className="hover:text-primary transition-colors"
          >
            GM Guide
          </Link>
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
      <MainFeaturesSection />
      <ReferenceGuideSection />
      <RulesQuickAccessSection />
      <CTASection />
    </div>
  );
}
