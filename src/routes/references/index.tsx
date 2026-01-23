import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Backpack,
  Shield,
  Sparkles,
  Sword,
  Users,
  UsersRound,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/references/')({
  component: ReferencesIndexPage,
});

const referenceCategories = [
  {
    to: '/references/equipment',
    title: 'Equipment',
    description:
      'Browse all weapons, armor, and combat wheelchairs organized by tier and category.',
    icon: Sword,
    gradient: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    to: '/references/classes',
    title: 'Classes & Subclasses',
    description:
      'Explore all classes with their subclasses, features, domains, and progression.',
    icon: Shield,
    gradient: 'from-purple-500 to-indigo-600',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    to: '/references/ancestries',
    title: 'Ancestries',
    description:
      'Discover ancestries with their unique physical characteristics and special features.',
    icon: UsersRound,
    gradient: 'from-teal-500 to-cyan-600',
    iconColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    to: '/references/communities',
    title: 'Communities',
    description:
      'Learn about community backgrounds, traits, and unique community features.',
    icon: Users,
    gradient: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    to: '/references/domain-cards',
    title: 'Domain Cards',
    description:
      'Search through all spells, abilities, and grimoires organized by domain.',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    iconColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    to: '/references/inventory',
    title: 'Inventory Items',
    description:
      'Find utility items, consumables, potions, relics, modifications, and recipes.',
    icon: Backpack,
    gradient: 'from-cyan-500 to-blue-600',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
];

function ReferencesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          Daggerheart Reference Guide
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          Your comprehensive resource for all Daggerheart game data. Browse
          equipment, classes, ancestries, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {referenceCategories.map(category => {
          const Icon = category.icon;
          return (
            <Link key={category.to} to={category.to} className="group">
              <Card className="group-hover:border-primary/50 h-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl">
                <div className={`h-2 bg-linear-to-r ${category.gradient}`} />
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-xl p-3 ${category.bgColor} transition-transform group-hover:scale-110`}
                    >
                      <Icon className={`size-7 ${category.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary text-xl transition-colors">
                        {category.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
