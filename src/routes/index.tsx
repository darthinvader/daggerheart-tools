import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Backpack,
  BookOpen,
  Leaf,
  Shield,
  ShieldAlert,
  Sparkles,
  Sword,
  Users,
  UsersRound,
} from 'lucide-react';

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

const referenceCategories = [
  {
    to: '/references/equipment',
    title: 'Equipment',
    description: 'Weapons, armor, and combat wheelchairs',
    icon: Sword,
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    to: '/references/classes',
    title: 'Classes',
    description: 'Classes, subclasses, and features',
    icon: Shield,
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    to: '/references/ancestries',
    title: 'Ancestries',
    description: 'Unique traits and characteristics',
    icon: UsersRound,
    iconColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    to: '/references/communities',
    title: 'Communities',
    description: 'Backgrounds and community features',
    icon: Users,
    iconColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    to: '/references/domain-cards',
    title: 'Domain Cards',
    description: 'Spells, abilities, and grimoires',
    icon: Sparkles,
    iconColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    to: '/references/inventory',
    title: 'Inventory',
    description: 'Items, consumables, and relics',
    icon: Backpack,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    to: '/references/adversaries',
    title: 'Adversaries',
    description: 'Roles, tiers, and encounter traits',
    icon: ShieldAlert,
    iconColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    to: '/references/environments',
    title: 'Environments',
    description: 'Scene tags, hazards, and encounter flavor',
    icon: Leaf,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
];

function Index() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="from-primary/5 via-background to-background relative flex flex-1 flex-col items-center justify-center bg-linear-to-b px-4 py-16 text-center md:py-24">
        {/* Decorative elements */}
        <div className="bg-primary/10 absolute top-10 left-10 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute right-10 bottom-20 h-40 w-40 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">Daggerheart</span> Tools
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Your companion app for the Daggerheart TTRPG. Build characters,
            track resources, manage inventory, and browse adversaries and
            environments to enhance your tabletop experience.
          </p>

          <Button
            asChild
            size="lg"
            className="text-primary-foreground gap-2 text-lg"
          >
            <Link to="/character">
              <Users className="h-5 w-5" />
              View Characters
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Hero illustration placeholder */}
        <div className="from-primary/20 to-primary/5 border-primary/20 relative z-10 mt-12 flex aspect-video w-full max-w-4xl items-center justify-center rounded-2xl border-2 border-dashed bg-linear-to-br shadow-lg md:mt-16">
          <div className="p-8 text-center">
            <Sword className="text-primary/40 mx-auto mb-4 h-16 w-16 md:h-24 md:w-24" />
            <p className="text-muted-foreground text-sm md:text-base">
              Character builder and game companion
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            Everything you need for your adventure
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="text-primary mb-2 h-10 w-10" />
                <CardTitle>Character Builder</CardTitle>
                <CardDescription>
                  Create and manage your Daggerheart characters with an
                  intuitive, mobile-friendly interface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Choose ancestry, class, and community</li>
                  <li>• Track traits and experiences</li>
                  <li>• Manage level progression</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sword className="text-primary mb-2 h-10 w-10" />
                <CardTitle>Equipment & Inventory</CardTitle>
                <CardDescription>
                  Organize your gear, weapons, armor, and consumables with ease.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Track armor and weapons</li>
                  <li>• Manage gold and resources</li>
                  <li>• Organize inventory items</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="text-primary mb-2 h-10 w-10" />
                <CardTitle>Reference Guide</CardTitle>
                <CardDescription>
                  Browse complete game data: equipment, classes, ancestries,
                  communities, domain cards, adversaries, and environments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Searchable & filterable databases</li>
                  <li>• Side-by-side comparisons</li>
                  <li>• Complete SRD coverage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reference Guide Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">
              Comprehensive Reference Guide
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Browse complete game data with powerful search, filtering, and
              comparison features.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
            {referenceCategories.map(category => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.to}
                  to={category.to}
                  className="group block"
                >
                  <Card className="group-hover:border-primary/50 h-full text-center transition-all hover:scale-105 hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div
                        className={`mx-auto rounded-xl p-3 ${category.bgColor} transition-transform group-hover:scale-110`}
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

          <div className="mt-10 text-center md:mt-8">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/references">
                Browse All References
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Ready to begin your adventure?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start building your character now and dive into the world of
            Daggerheart.
          </p>
          <Button asChild size="lg" className="text-primary-foreground gap-2">
            <Link to="/character">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
