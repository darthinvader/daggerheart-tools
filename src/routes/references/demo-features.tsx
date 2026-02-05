import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { DowntimeMoves } from '@/components/downtime-moves';
import type { DowntimeActivity } from '@/components/downtime-moves';
import { GameActions } from '@/components/game-actions';
import { RestModal } from '@/components/rest';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BEAST_FEAST_ARMOR,
  BEAST_FEAST_MAGIC_WEAPONS,
  BEAST_FEAST_PRIMARY_WEAPONS,
  BEAST_INGREDIENT_TYPES,
  BLOOM_INGREDIENT_TYPES,
  DIFFICULTY_FLAVOR_GUIDANCE,
  EXAMPLE_INGREDIENTS,
  EXAMPLE_SPECIAL_INGREDIENTS,
  FLAVOR_DIE_MAP,
  type FlavorType,
  INGREDIENT_PROPERTIES,
} from '@/lib/schemas/beast-feast-cooking';

export const Route = createFileRoute('/references/demo-features')({
  component: DemoFeaturesPage,
});

// =====================================================================================
// Beast Feast Cooking Demo
// =====================================================================================

const flavorColors: Record<FlavorType, string> = {
  Sweet: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/40',
  Salty:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  Bitter:
    'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  Sour: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/40',
  Savory: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
  Weird:
    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40',
};

function FlavorBadge({
  flavor,
  strength,
}: {
  flavor: FlavorType;
  strength: number;
}) {
  return (
    <Badge variant="outline" className={flavorColors[flavor]}>
      {flavor} ({FLAVOR_DIE_MAP[flavor]}) ×{strength}
    </Badge>
  );
}

function BeastFeastSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Beast Feast Campaign Frame</h2>
        <p className="text-muted-foreground">
          A complete cooking system for the Beast Feast campaign frame. Players
          harvest ingredients from slain beasts and gathered blooms, then cook
          meals during downtime to clear HP, Stress, and gain Hope.
        </p>
      </div>

      <Tabs defaultValue="flavors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="flavors">Flavors</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
          <TabsTrigger value="weapons">Weapons</TabsTrigger>
          <TabsTrigger value="armor">Armor</TabsTrigger>
        </TabsList>

        <TabsContent value="flavors" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flavor Types & Dice</CardTitle>
              <CardDescription>
                Each flavor has an associated die. Smaller dice are more common,
                larger dice are rarer and more powerful.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(Object.entries(FLAVOR_DIE_MAP) as [FlavorType, string][]).map(
                  ([flavor, die]) => (
                    <div
                      key={flavor}
                      className={`flex items-center justify-between rounded-lg border p-3 ${flavorColors[flavor]}`}
                    >
                      <span className="font-medium">{flavor}</span>
                      <Badge variant="secondary">{die}</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty to Flavor Mapping</CardTitle>
              <CardDescription>
                Adversary difficulty determines which flavors their ingredients
                have.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(DIFFICULTY_FLAVOR_GUIDANCE).map(
                  ([difficulty, flavors]) => (
                    <div key={difficulty} className="rounded-lg border p-3">
                      <div className="mb-2 font-medium capitalize">
                        {difficulty}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {flavors.map(f => (
                          <FlavorBadge key={f} flavor={f} strength={1} />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Beast Ingredient Types (d20)</CardTitle>
                <CardDescription>
                  Roll to determine what type of ingredient you harvest.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {BEAST_INGREDIENT_TYPES.map((type, i) => (
                    <Badge key={type} variant="outline">
                      {i + 1}. {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bloom Ingredient Types (d20)</CardTitle>
                <CardDescription>
                  Roll to determine what type of bloom you gather.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {BLOOM_INGREDIENT_TYPES.map((type, i) => (
                    <Badge key={type} variant="outline">
                      {i + 1}. {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ingredient Properties (d20)</CardTitle>
              <CardDescription>
                Roll to add interesting properties to any ingredient.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {INGREDIENT_PROPERTIES.map((prop, i) => (
                  <div key={prop} className="text-muted-foreground text-sm">
                    <span className="text-foreground font-medium">
                      {i + 1}.
                    </span>{' '}
                    {prop}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Ingredients</CardTitle>
              <CardDescription>
                Sample ingredients with their flavor profiles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {EXAMPLE_INGREDIENTS.map(ing => (
                  <div key={ing.name} className="rounded-lg border p-3">
                    <div className="mb-1 font-medium">{ing.name}</div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {ing.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {ing.flavorProfiles.map((fp, i) => (
                        <FlavorBadge
                          key={i}
                          flavor={fp.name}
                          strength={fp.strength}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="special" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Ingredients</CardTitle>
              <CardDescription>
                Rare ingredients from Leader/Solo adversaries that have unique
                features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {EXAMPLE_SPECIAL_INGREDIENTS.map(ing => (
                  <div key={ing.name} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="font-semibold">{ing.name}</div>
                      <Badge variant="secondary">{ing.feature.name}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {ing.feature.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {ing.flavorProfiles.map((fp, i) => (
                        <FlavorBadge
                          key={i}
                          flavor={fp.name}
                          strength={fp.strength}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weapons" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Primary Weapons</CardTitle>
              <CardDescription>
                Starting physical weapons for Beast Feast characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left font-medium">Weapon</th>
                      <th className="p-2 text-left font-medium">Trait</th>
                      <th className="p-2 text-left font-medium">Range</th>
                      <th className="p-2 text-left font-medium">Damage</th>
                      <th className="p-2 text-left font-medium">Burden</th>
                      <th className="p-2 text-left font-medium">Feature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BEAST_FEAST_PRIMARY_WEAPONS.map(w => (
                      <tr key={w.name} className="border-b">
                        <td className="p-2 font-medium">{w.name}</td>
                        <td className="p-2">{w.trait}</td>
                        <td className="p-2">{w.range}</td>
                        <td className="p-2">{w.damage}</td>
                        <td className="p-2">{w.burden}</td>
                        <td className="text-muted-foreground p-2 text-xs">
                          {w.feature ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Magic Weapons</CardTitle>
              <CardDescription>
                Starting magic weapons for Beast Feast characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left font-medium">Weapon</th>
                      <th className="p-2 text-left font-medium">Trait</th>
                      <th className="p-2 text-left font-medium">Range</th>
                      <th className="p-2 text-left font-medium">Damage</th>
                      <th className="p-2 text-left font-medium">Burden</th>
                      <th className="p-2 text-left font-medium">Feature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BEAST_FEAST_MAGIC_WEAPONS.map(w => (
                      <tr key={w.name} className="border-b">
                        <td className="p-2 font-medium">{w.name}</td>
                        <td className="p-2">{w.trait}</td>
                        <td className="p-2">{w.range}</td>
                        <td className="p-2">{w.damage}</td>
                        <td className="p-2">{w.burden}</td>
                        <td className="text-muted-foreground p-2 text-xs">
                          {w.feature ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="armor" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Beast Feast Armor</CardTitle>
              <CardDescription>
                Starting armor options for Beast Feast characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {BEAST_FEAST_ARMOR.map(a => (
                  <div key={a.name} className="rounded-lg border p-4">
                    <div className="mb-2 font-semibold">{a.name}</div>
                    <div className="text-muted-foreground space-y-1 text-sm">
                      <div>
                        <span className="text-foreground font-medium">
                          Thresholds:
                        </span>{' '}
                        {a.baseThresholds}
                      </div>
                      <div>
                        <span className="text-foreground font-medium">
                          Armor Score:
                        </span>{' '}
                        {a.baseScore}
                      </div>
                      {a.feature && (
                        <div className="text-primary mt-2 text-xs">
                          {a.feature}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =====================================================================================
// Rest System Demo
// =====================================================================================

function RestSystemSection() {
  const [isRestOpen, setIsRestOpen] = useState(false);
  const [currentHp, setCurrentHp] = useState(3);
  const [currentStress, setCurrentStress] = useState(2);
  const [armorMarked, setArmorMarked] = useState(2);

  const maxHp = 6;
  const maxStress = 6;
  const totalArmorSlots = 4;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Rest System</h2>
        <p className="text-muted-foreground">
          Per the SRD, each rest allows 2 downtime moves. Short rests provide
          d4+Tier recovery, while long rests provide full recovery.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current State</CardTitle>
          <CardDescription>
            Adjust values and try the rest system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">HP Marked</div>
              <div className="text-2xl font-bold">
                {currentHp}/{maxHp}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-sm">Stress</div>
              <div className="text-2xl font-bold">
                {currentStress}/{maxStress}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-sm">Armor Marked</div>
              <div className="text-2xl font-bold">
                {armorMarked}/{totalArmorSlots}
              </div>
            </div>
          </div>

          <Button onClick={() => setIsRestOpen(true)} className="w-full">
            Open Rest Modal
          </Button>
        </CardContent>
      </Card>

      <RestModal
        isOpen={isRestOpen}
        onClose={() => setIsRestOpen(false)}
        currentHp={currentHp}
        maxHp={maxHp}
        currentStress={currentStress}
        maxStress={maxStress}
        currentArmorMarked={armorMarked}
        totalArmorSlots={totalArmorSlots}
        tier={1}
        onRestComplete={result => {
          // Process move results to update state
          for (const moveResult of result.moveResults) {
            if (moveResult.moveId === 'tend-wounds') {
              setCurrentHp(prev => Math.max(0, prev - moveResult.amount));
            } else if (moveResult.moveId === 'clear-stress') {
              setCurrentStress(prev => Math.max(0, prev - moveResult.amount));
            } else if (moveResult.moveId === 'repair-armor') {
              setArmorMarked(prev => Math.max(0, prev - moveResult.amount));
            }
          }
          setIsRestOpen(false);
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Rest Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Short Rest (~1 hour)</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• 2 downtime moves</li>
                <li>• GM gains 1 Fear per PC</li>
                <li>• Roll d4+Tier for recovery</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Long Rest (several hours)</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• 2 downtime moves</li>
                <li>• GM gains 2 Fear per PC</li>
                <li>• Full HP/Stress/Armor recovery</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================================================
// Game Actions Demo
// =====================================================================================

function GameActionsSection() {
  const [currentStress, setCurrentStress] = useState(3);
  const [currentHope, setCurrentHope] = useState(5);
  const [tagTeamUsed, setTagTeamUsed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Game Actions</h2>
        <p className="text-muted-foreground">
          Special actions available during gameplay: Critical Success clears
          stress, and Tag Team lets you assist an ally.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Try the Actions</CardTitle>
          <CardDescription>
            Current Stress: {currentStress} | Current Hope: {currentHope} | Tag
            Team: {tagTeamUsed ? 'Used' : 'Available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameActions
            state={{
              currentStress,
              maxStress: 6,
              currentHope,
              tagTeamUsedThisSession: tagTeamUsed,
            }}
            callbacks={{
              onStressChange: setCurrentStress,
              onHopeChange: setCurrentHope,
              onTagTeamUsed: () => setTagTeamUsed(true),
            }}
          />

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentStress(3);
                setCurrentHope(5);
                setTagTeamUsed(false);
              }}
            >
              Reset State
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Rules (SRD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Critical Success (Page 29)</h4>
              <p className="text-muted-foreground text-sm">
                When you roll a critical success, you clear 1 Stress.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Tag Team (Page 32)</h4>
              <p className="text-muted-foreground text-sm">
                Costs 3 Hope. Once per session. When an ally near you makes a
                roll, you can assist them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================================================
// Downtime Moves Demo
// =====================================================================================

function DowntimeMovesSection() {
  const [activities, setActivities] = useState<DowntimeActivity[]>([]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Downtime Moves</h2>
        <p className="text-muted-foreground">
          During rests, characters can perform downtime activities. Each rest
          allows 2 downtime moves (you can repeat the same move).
        </p>
      </div>

      <DowntimeMoves activities={activities} onChange={setActivities} />

      <Card>
        <CardHeader>
          <CardTitle>Available Downtime Moves (SRD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="font-medium">Tend to Wounds</div>
              <p className="text-muted-foreground text-sm">
                Clear HP equal to your rest roll (d4+Tier for short, full for
                long).
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium">Clear Stress</div>
              <p className="text-muted-foreground text-sm">
                Clear Stress equal to your rest roll.
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium">Repair Armor</div>
              <p className="text-muted-foreground text-sm">
                Restore armor slots equal to your rest roll.
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium">Prepare</div>
              <p className="text-muted-foreground text-sm">
                Gain 2 Hope by preparing for the journey ahead.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================================================
// Main Page
// =====================================================================================

function DemoFeaturesPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Demo Features</h1>
        <p className="text-muted-foreground text-lg">
          Interactive demonstrations of game systems and mechanics that are
          implemented but not yet integrated into character sheets.
        </p>
      </div>

      <Tabs defaultValue="beast-feast" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="beast-feast">Beast Feast</TabsTrigger>
          <TabsTrigger value="rest">Rest System</TabsTrigger>
          <TabsTrigger value="actions">Game Actions</TabsTrigger>
          <TabsTrigger value="downtime">Downtime</TabsTrigger>
        </TabsList>

        <TabsContent value="beast-feast" className="mt-6">
          <BeastFeastSection />
        </TabsContent>

        <TabsContent value="rest" className="mt-6">
          <RestSystemSection />
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <GameActionsSection />
        </TabsContent>

        <TabsContent value="downtime" className="mt-6">
          <DowntimeMovesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
