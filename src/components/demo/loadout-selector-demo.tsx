import { useState } from 'react';

import { LoadoutSelector } from '@/components/loadout-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  DomainCardLite,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';
import {
  CARD_TYPE_COLORS,
  DOMAIN_COLORS,
  DOMAIN_EMOJIS,
  LOADOUT_RULES_BY_TIER,
} from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

const DEMO_CONFIGS = {
  '1': {
    label: 'Tier 1 (Lv 1)',
    emoji: '🌱',
    domains: ['Blade', 'Bone'],
    description: 'New adventurer with basic domain cards (Level 1)',
  },
  '2-4': {
    label: 'Tier 2 (Lv 2-4)',
    emoji: '⚔️',
    domains: ['Arcana', 'Codex'],
    description: 'Seasoned adventurer with intermediate cards (Levels 1-4)',
  },
  '5-7': {
    label: 'Tier 3 (Lv 5-7)',
    emoji: '🔥',
    domains: ['Midnight', 'Sage'],
    description: 'Veteran hero with advanced cards (Levels 1-7)',
  },
  '8-10': {
    label: 'Tier 4 (Lv 8-10)',
    emoji: '👑',
    domains: ['Splendor', 'Valor'],
    description: 'Legendary champion with all cards (Levels 1-10)',
  },
} as const;

type DemoTier = keyof typeof DEMO_CONFIGS;

function ExpandableCardItem({
  card,
  variant,
}: {
  card: DomainCardLite;
  variant: 'active' | 'vault';
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const emoji = DOMAIN_EMOJIS[card.domain] ?? '📜';
  const domainColor = DOMAIN_COLORS[card.domain] ?? 'text-foreground';
  const typeColor = CARD_TYPE_COLORS[card.type] ?? 'text-foreground';
  const recallCost = card.hopeCost ?? card.recallCost ?? 0;

  return (
    <div className="bg-background rounded border p-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={cn('text-xs', domainColor)}>
          {emoji} {card.domain}
        </Badge>
        <span className="text-sm font-medium">{card.name}</span>
        <Badge variant="secondary" className="text-xs">
          Lv{card.level}
        </Badge>
        <Badge variant="outline" className={cn('text-xs', typeColor)}>
          {card.type}
        </Badge>
        {recallCost > 0 && (
          <SmartTooltip
            content={
              <p>
                Recall Cost: {recallCost} Stress to swap{' '}
                {variant === 'vault' ? 'into loadout' : 'from vault'}
              </p>
            }
          >
            <Badge variant="outline" className="cursor-help text-xs">
              ⚡{recallCost}
            </Badge>
          </SmartTooltip>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto h-5 px-1 text-xs"
        >
          {isExpanded ? '▲ Less' : '▼ More'}
        </Button>
      </div>
      <p
        className={cn(
          'text-muted-foreground mt-1 text-xs',
          !isExpanded && 'line-clamp-2'
        )}
      >
        {card.description}
      </p>
    </div>
  );
}

function LoadoutDetails({
  selection,
  rules,
}: {
  selection: LoadoutSelection;
  rules: LoadoutRules;
}) {
  const totalHopeCost = [
    ...selection.activeCards,
    ...selection.vaultCards,
  ].reduce((sum, card) => sum + (card.hopeCost ?? card.recallCost ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📜</span>
        <h4 className="text-xl font-semibold">Loadout Summary</h4>
        {selection.expandedDomainAccess && (
          <SmartTooltip
            content={
              <p>
                You have access to cards from all domains, not just your class
                domains.
              </p>
            }
          >
            <Badge variant="secondary" className="cursor-help">
              🌐 Expanded Access
            </Badge>
          </SmartTooltip>
        )}
      </div>

      <Separator />

      {/* Active Cards */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <SmartTooltip
              className="max-w-xs"
              content={
                <p>Cards in your loadout that you can use during play.</p>
              }
            >
              <span className="flex cursor-help items-center gap-2">
                <span>⚡</span>
                <span>Active Cards</span>
              </span>
            </SmartTooltip>
            <Badge variant="outline" className="font-mono">
              {selection.activeCards.length}/{rules.maxActiveCards}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selection.activeCards.length > 0 ? (
            <div className="space-y-2">
              {selection.activeCards.map(card => (
                <ExpandableCardItem
                  key={card.name}
                  card={card}
                  variant="active"
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No active cards</p>
          )}
        </CardContent>
      </Card>

      {/* Vault Cards */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <SmartTooltip
              className="max-w-xs"
              content={
                <p>
                  Inactive cards stored in your vault. Swap during rest or pay
                  Recall Cost to swap immediately.
                </p>
              }
            >
              <span className="flex cursor-help items-center gap-2">
                <span>📦</span>
                <span>Vault Cards</span>
              </span>
            </SmartTooltip>
            <Badge variant="outline" className="font-mono">
              {selection.vaultCards.length} cards
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selection.vaultCards.length > 0 ? (
            <div className="space-y-2">
              {selection.vaultCards.map(card => (
                <ExpandableCardItem
                  key={card.name}
                  card={card}
                  variant="vault"
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No vault cards</p>
          )}
        </CardContent>
      </Card>

      {/* Homebrew Cards */}
      {selection.homebrewCards.length > 0 && (
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span>🏠</span>
              <span>Homebrew Cards</span>
              <Badge variant="secondary" className="text-xs">
                {selection.homebrewCards.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selection.homebrewCards.map(card => (
                <Badge key={card.name} variant="outline">
                  🏠 {card.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="bg-muted/50 rounded-lg p-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            Total Cards:{' '}
            <strong>
              {selection.activeCards.length + selection.vaultCards.length}
            </strong>
          </div>
          <div>
            Total Recall Cost: <strong>{totalHopeCost}</strong>
          </div>
          <div>
            Class Domains: <strong>{selection.classDomains.join(', ')}</strong>
          </div>
          <div>
            Mode: <strong>{selection.mode}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadoutSelectorDemo() {
  const [tier, setTier] = useState<DemoTier>('1');
  const [selection, setSelection] = useState<LoadoutSelection | null>(null);
  const [customMaxActive, setCustomMaxActive] = useState<number>(5);

  const config = DEMO_CONFIGS[tier];
  const baseRules = LOADOUT_RULES_BY_TIER[tier];
  const rules: LoadoutRules = {
    ...baseRules,
    maxActiveCards: customMaxActive,
  };

  const handleTierChange = (newTier: string) => {
    setTier(newTier as DemoTier);
    setSelection(null);
  };

  const handleComplete = (sel: LoadoutSelection) => {
    setSelection(sel);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium">Select Character Tier</h4>
          <Tabs value={tier} onValueChange={handleTierChange}>
            <TabsList className="grid w-full grid-cols-4">
              {(Object.keys(DEMO_CONFIGS) as DemoTier[]).map(t => (
                <TabsTrigger key={t} value={t} className="text-xs sm:text-sm">
                  {DEMO_CONFIGS[t].emoji} {DEMO_CONFIGS[t].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm">
              <strong>
                {config.emoji} {config.label}:
              </strong>{' '}
              {config.description}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Domains: <strong>{config.domains.join(' & ')}</strong> | Max Card
              Level: <strong>{rules.maxCardLevel}</strong>
            </p>
          </div>

          <div className="bg-muted/50 space-y-2 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <SmartTooltip
                className="max-w-xs"
                content={
                  <p>
                    Per RAW, max is 5. Adjust for homebrew rules or special
                    features.
                  </p>
                }
              >
                <Label htmlFor="max-active" className="cursor-help text-sm">
                  ⚡ Max Active Cards:
                </Label>
              </SmartTooltip>
              <Input
                id="max-active"
                type="number"
                min={1}
                max={20}
                value={customMaxActive}
                onChange={e =>
                  setCustomMaxActive(Math.max(1, Number(e.target.value)))
                }
                className="h-8 w-20"
              />
            </div>
            <p className="text-muted-foreground text-xs">
              📦 Vault has no limit (stores all inactive cards)
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <h3 className="text-lg font-semibold">Loadout Builder</h3>
          <div className="bg-card rounded-lg border p-4">
            <LoadoutSelector
              key={`${tier}-${customMaxActive}`}
              classDomains={[...config.domains]}
              tier={tier}
              onComplete={handleComplete}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Final Selection</h3>
          <div className="bg-card sticky top-4 max-h-[80vh] overflow-y-auto rounded-lg border p-4">
            {selection ? (
              <LoadoutDetails selection={selection} rules={rules} />
            ) : (
              <p className="text-muted-foreground text-sm">
                Complete your loadout selection to see the full configuration
                here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
