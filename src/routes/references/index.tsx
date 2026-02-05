import { createFileRoute, Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ADVERSARIES } from '@/lib/data/adversaries';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';
import { COMMUNITIES } from '@/lib/data/characters/communities';
import { ALL_CLASSES } from '@/lib/data/classes';
import { getAllDomainCards } from '@/lib/data/domains';
import { ENVIRONMENTS } from '@/lib/data/environments';
import {
  ALL_ARMOR,
  ALL_ARMOR_MODIFICATIONS,
  ALL_COMBAT_WHEELCHAIRS,
  ALL_CONSUMABLES,
  ALL_POTIONS,
  ALL_PRIMARY_WEAPONS,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_SECONDARY_WEAPONS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import { GM_MOVES } from '@/lib/data/gm-moves';
import {
  Backpack,
  Beaker,
  Compass,
  Home,
  Shield,
  Skull,
  Sparkles,
  Swords,
  TreePine,
  Users,
} from '@/lib/icons';

export const Route = createFileRoute('/references/')({
  component: ReferencesIndexPage,
});

interface ReferenceCategory {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  tint: string;
  itemCount?: number;
}

const allDomainCards = getAllDomainCards();

const equipmentCount =
  ALL_PRIMARY_WEAPONS.length +
  ALL_SECONDARY_WEAPONS.length +
  ALL_ARMOR.length +
  ALL_COMBAT_WHEELCHAIRS.length;

const inventoryCount =
  ALL_UTILITY_ITEMS.length +
  ALL_CONSUMABLES.length +
  ALL_POTIONS.length +
  ALL_RELICS.length +
  ALL_WEAPON_MODIFICATIONS.length +
  ALL_ARMOR_MODIFICATIONS.length +
  ALL_RECIPES.length;

const referenceCategories: ReferenceCategory[] = [
  {
    to: '/references/equipment',
    title: 'Equipment',
    description:
      'Browse all weapons, armor, and combat wheelchairs organized by tier and category.',
    icon: Swords,
    gradient: 'from-amber-500 to-orange-600',
    tint: 'bg-amber-500/10',
    itemCount: equipmentCount,
  },
  {
    to: '/references/classes',
    title: 'Classes & Subclasses',
    description:
      'Explore all classes with their subclasses, features, domains, and progression.',
    icon: Shield,
    gradient: 'from-purple-500 to-indigo-600',
    tint: 'bg-purple-500/10',
    itemCount: ALL_CLASSES.length,
  },
  {
    to: '/references/ancestries',
    title: 'Ancestries',
    description:
      'Discover ancestries with their unique physical characteristics and special features.',
    icon: Users,
    gradient: 'from-teal-500 to-cyan-600',
    tint: 'bg-teal-500/10',
    itemCount: ANCESTRIES.length,
  },
  {
    to: '/references/communities',
    title: 'Communities',
    description:
      'Learn about community backgrounds, traits, and unique community features.',
    icon: Home,
    gradient: 'from-green-500 to-emerald-600',
    tint: 'bg-green-500/10',
    itemCount: COMMUNITIES.length,
  },
  {
    to: '/references/domain-cards',
    title: 'Domain Cards',
    description:
      'Search through all spells, abilities, and grimoires organized by domain.',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    tint: 'bg-violet-500/10',
    itemCount: allDomainCards.length,
  },
  {
    to: '/references/inventory',
    title: 'Inventory Items',
    description:
      'Find utility items, consumables, potions, relics, modifications, and recipes.',
    icon: Backpack,
    gradient: 'from-cyan-500 to-blue-600',
    tint: 'bg-cyan-500/10',
    itemCount: inventoryCount,
  },
  {
    to: '/references/adversaries',
    title: 'Adversaries',
    description:
      'Review adversary roles, tiers, and traits for encounter planning.',
    icon: Skull,
    gradient: 'from-red-500 to-rose-600',
    tint: 'bg-red-500/10',
    itemCount: ADVERSARIES.length,
  },
  {
    to: '/references/environments',
    title: 'Environments',
    description: 'Reference scene environments, hazards, and encounter tags.',
    icon: TreePine,
    gradient: 'from-emerald-500 to-green-600',
    tint: 'bg-emerald-500/10',
    itemCount: ENVIRONMENTS.length,
  },
  {
    to: '/references/gm-moves',
    title: 'GM Moves',
    description:
      'Quick reference for GM moves organized by category: soft, medium, and hard.',
    icon: Compass,
    gradient: 'from-blue-500 to-cyan-600',
    tint: 'bg-blue-500/10',
    itemCount: GM_MOVES.length,
  },
  {
    to: '/references/demo-features',
    title: 'Demo Features',
    description:
      'Explore Beast Feast cooking, rest system, downtime moves, and other game mechanics.',
    icon: Beaker,
    gradient: 'from-fuchsia-500 to-pink-600',
    tint: 'bg-fuchsia-500/10',
  },
];

function ReferencesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          Daggerheart Reference Guide
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          Your comprehensive resource for all Daggerheart game data. Browse
          equipment, classes, ancestries, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {referenceCategories.map(category => (
          <Link key={category.to} to={category.to} className="group">
            <Card className="group-hover:border-primary/50 h-full overflow-hidden transition-all hover:shadow-xl">
              <div className={`h-1.5 bg-gradient-to-r ${category.gradient}`} />
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 rounded-xl p-3 ${category.tint} transition-transform group-hover:scale-110`}
                  >
                    <category.icon className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="group-hover:text-primary text-xl transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                    {category.itemCount != null && (
                      <span className="text-muted-foreground text-xs">
                        {category.itemCount} items
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
