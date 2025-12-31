import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import type { Gold } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { GoldTracker } from './gold-tracker';

interface GoldDisplayProps {
  gold: Gold;
  onChange?: (gold: Gold) => void;
  className?: string;
  readOnly?: boolean;
  compactMode?: boolean;
}

const EMOJI_FIST = '🤛';
const EMOJI_MONEYBAG = '💰';
const EMOJI_TROPHY = '🏆';
const EMOJI_COIN = '🪙';

function GoldCompactDisplay({ gold }: { gold: Gold }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">💰</span>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1 border-amber-500/30 bg-amber-500/10"
        >
          {EMOJI_TROPHY} {gold.chests} {gold.chests === 1 ? 'Chest' : 'Chests'}
        </Badge>
        <Badge
          variant="outline"
          className="gap-1 border-yellow-500/30 bg-yellow-500/10"
        >
          {EMOJI_MONEYBAG} {gold.bags} {gold.bags === 1 ? 'Bag' : 'Bags'}
        </Badge>
        <Badge
          variant="outline"
          className="gap-1 border-orange-500/30 bg-orange-500/10"
        >
          {EMOJI_FIST} {gold.handfuls}{' '}
          {gold.handfuls === 1 ? 'Handful' : 'Handfuls'}
        </Badge>
        {gold.showCoins && (
          <Badge
            variant="outline"
            className="gap-1 border-stone-500/30 bg-stone-500/10"
          >
            {EMOJI_COIN} {gold.coins ?? 0}{' '}
            {(gold.coins ?? 0) === 1 ? 'Coin' : 'Coins'}
          </Badge>
        )}
      </div>
    </div>
  );
}

function GoldDetailedDisplay({ gold }: { gold: Gold }) {
  const totalInCoins =
    (gold.coins ?? 0) +
    gold.handfuls * 10 +
    gold.bags * 100 +
    gold.chests * 1000;

  const displayDenom = gold.displayDenomination ?? 'handfuls';

  const calculateTotal = (
    denomination: 'coins' | 'handfuls' | 'bags' | 'chests'
  ) => {
    switch (denomination) {
      case 'coins':
        return totalInCoins;
      case 'handfuls':
        return totalInCoins / 10;
      case 'bags':
        return totalInCoins / 100;
      case 'chests':
        return totalInCoins / 1000;
    }
  };

  const formatTotal = () => {
    const value = calculateTotal(displayDenom);
    const decimals =
      displayDenom === 'coins'
        ? 0
        : displayDenom === 'handfuls'
          ? 1
          : displayDenom === 'bags'
            ? 2
            : 3;
    return parseFloat(value.toFixed(decimals)).toString();
  };

  const denominationLabels = {
    coins: 'Coins',
    handfuls: 'Handfuls',
    bags: 'Bags',
    chests: 'Chests',
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'grid gap-4',
          gold.showCoins ? 'grid-cols-4' : 'grid-cols-3'
        )}
      >
        {gold.showCoins && (
          <div className="rounded-lg border border-stone-500/30 bg-stone-500/10 p-4 text-center">
            <span className="text-3xl">{EMOJI_COIN}</span>
            <p className="text-2xl font-bold text-stone-600 dark:text-stone-400">
              {gold.coins ?? 0}
            </p>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              Coins
            </p>
            <p className="text-muted-foreground mt-1 text-xs">1/10 handful</p>
          </div>
        )}
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 text-center">
          <span className="text-3xl">{EMOJI_FIST}</span>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {gold.handfuls}
          </p>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Handfuls
          </p>
          <p className="text-muted-foreground mt-1 text-xs">≈ 10 coins each</p>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
          <span className="text-3xl">{EMOJI_MONEYBAG}</span>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {gold.bags}
          </p>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Bags
          </p>
          <p className="text-muted-foreground mt-1 text-xs">≈ 10 handfuls</p>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <span className="text-3xl">{EMOJI_TROPHY}</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {gold.chests}
          </p>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Chests
          </p>
          <p className="text-muted-foreground mt-1 text-xs">≈ 10 bags</p>
        </div>
      </div>

      <div className="rounded-lg border bg-linear-to-r from-yellow-500/5 to-amber-500/5 p-3">
        <p className="text-muted-foreground text-center text-sm">
          Total wealth:{' '}
          <strong className="text-foreground">{formatTotal()}</strong>{' '}
          {denominationLabels[displayDenom]}
        </p>
      </div>
    </div>
  );
}

export function GoldDisplay({
  gold,
  onChange,
  className,
  readOnly = false,
  compactMode = false,
}: GoldDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftGold, setDraftGold] = useState<Gold>(gold);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftGold(gold);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, gold]);

  const handleSave = useCallback(() => {
    onChange?.(draftGold);
  }, [draftGold, onChange]);

  const handleCancel = useCallback(() => {
    setDraftGold(gold);
  }, [gold]);

  const handleChange = useCallback(
    (state: {
      coins: number;
      handfuls: number;
      bags: number;
      chests: number;
      showCoins: boolean;
      displayDenomination: 'coins' | 'handfuls' | 'bags' | 'chests';
    }) => {
      setDraftGold({
        handfuls: state.handfuls,
        bags: state.bags,
        chests: state.chests,
        coins: state.coins,
        showCoins: state.showCoins,
        displayDenomination: state.displayDenomination,
      });
    },
    []
  );

  return (
    <EditableSection
      title="Gold"
      emoji="💰"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="md"
      className={cn(className)}
      editTitle="Manage Gold"
      editDescription="Track your character's gold in handfuls, bags, and chests."
      editContent={
        <GoldTracker
          initialCoins={draftGold.coins ?? 0}
          initialHandfuls={draftGold.handfuls}
          initialBags={draftGold.bags}
          initialChests={draftGold.chests}
          showCoinsInitially={draftGold.showCoins ?? false}
          displayDenomination={draftGold.displayDenomination ?? 'handfuls'}
          onChange={handleChange}
        />
      }
    >
      {compactMode ? (
        <GoldCompactDisplay gold={gold} />
      ) : (
        <GoldDetailedDisplay gold={gold} />
      )}
    </EditableSection>
  );
}
