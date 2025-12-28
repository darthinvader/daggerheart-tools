import { ArrowDown, ArrowUp } from 'lucide-react';

import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';
import {
  DOMAIN_BG_COLORS,
  DOMAIN_COLORS,
  DOMAIN_EMOJIS,
} from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { LoadoutSelector } from './loadout-selector';

interface LoadoutDisplayProps {
  selection: LoadoutSelection;
  onChange?: (selection: LoadoutSelection) => void;
  classDomains: string[];
  tier?: string;
  className?: string;
  readOnly?: boolean;
}

function EmptyLoadout() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">📜</span>
      <p className="text-muted-foreground mt-2">No domain cards selected</p>
      <p className="text-muted-foreground text-sm">
        Click edit to build your domain loadout
      </p>
    </div>
  );
}

interface DomainCardDisplayProps {
  card: DomainCardLite;
  location: 'active' | 'vault';
  onSwap?: () => void;
  canSwapToActive?: boolean;
}

function DomainCardMini({
  card,
  location,
  onSwap,
  canSwapToActive,
}: DomainCardDisplayProps) {
  const emoji = DOMAIN_EMOJIS[card.domain] ?? '📜';
  const color = DOMAIN_COLORS[card.domain] ?? 'text-foreground';
  const bgColor = DOMAIN_BG_COLORS[card.domain] ?? '';

  return (
    <div className={cn('rounded-lg border p-3', bgColor)}>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className={cn('font-medium', color)}>{card.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs">
            Lv. {card.level}
          </Badge>
          {onSwap && (
            <SmartTooltip
              content={
                location === 'active' ? 'Move to vault' : 'Move to active'
              }
            >
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={onSwap}
                disabled={location === 'vault' && !canSwapToActive}
              >
                {location === 'active' ? (
                  <ArrowDown className="size-3" />
                ) : (
                  <ArrowUp className="size-3" />
                )}
              </Button>
            </SmartTooltip>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-xs">{card.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="secondary" className="text-xs">
          {card.type}
        </Badge>
        {card.hopeCost !== undefined && card.hopeCost > 0 && (
          <SmartTooltip content={`Costs ${card.hopeCost} Hope to use`}>
            <Badge variant="outline" className="gap-1 text-xs">
              ✨ {card.hopeCost}
            </Badge>
          </SmartTooltip>
        )}
        {card.recallCost !== undefined && card.recallCost > 0 && (
          <SmartTooltip content={`Costs ${card.recallCost} to recall`}>
            <Badge variant="outline" className="gap-1 text-xs">
              🔄 {card.recallCost}
            </Badge>
          </SmartTooltip>
        )}
        {card.isHomebrew && (
          <Badge variant="secondary" className="gap-1 text-xs">
            🛠️ Homebrew
          </Badge>
        )}
      </div>
    </div>
  );
}

function LoadoutStats({ selection }: { selection: LoadoutSelection }) {
  const uniqueDomains = [
    ...new Set([
      ...selection.activeCards.map(c => c.domain),
      ...selection.vaultCards.map(c => c.domain),
    ]),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <SmartTooltip content="Active cards ready to use">
        <Badge
          variant="outline"
          className="gap-1 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
        >
          ⚡ {selection.activeCards.length} Active
        </Badge>
      </SmartTooltip>
      <SmartTooltip content="Cards stored in vault">
        <Badge
          variant="outline"
          className="gap-1 border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
        >
          📦 {selection.vaultCards.length} Vault
        </Badge>
      </SmartTooltip>
      {uniqueDomains.length > 0 && (
        <SmartTooltip content={`Domains: ${uniqueDomains.join(', ')}`}>
          <Badge variant="outline" className="gap-1">
            🌐 {uniqueDomains.length} Domain
            {uniqueDomains.length !== 1 ? 's' : ''}
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}

interface LoadoutContentProps {
  selection: LoadoutSelection;
  onSwapToVault?: (cardName: string) => void;
  onSwapToActive?: (cardName: string) => void;
}

function LoadoutContent({
  selection,
  onSwapToVault,
  onSwapToActive,
}: LoadoutContentProps) {
  const hasCards =
    selection.activeCards.length > 0 || selection.vaultCards.length > 0;
  const canSwapToActive = selection.activeCards.length < 5;

  if (!hasCards) {
    return <EmptyLoadout />;
  }

  return (
    <div className="space-y-4">
      <LoadoutStats selection={selection} />

      {selection.activeCards.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              ⚡ Active Loadout
              <Badge variant="secondary" className="text-xs">
                {selection.activeCards.length}/5
              </Badge>
            </h5>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selection.activeCards.map(card => (
                <DomainCardMini
                  key={card.name}
                  card={card}
                  location="active"
                  onSwap={
                    onSwapToVault ? () => onSwapToVault(card.name) : undefined
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}

      {selection.vaultCards.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              📦 Vault
              <Badge variant="secondary" className="text-xs">
                {selection.vaultCards.length}
              </Badge>
            </h5>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selection.vaultCards.map(card => (
                <DomainCardMini
                  key={card.name}
                  card={card}
                  location="vault"
                  onSwap={
                    onSwapToActive ? () => onSwapToActive(card.name) : undefined
                  }
                  canSwapToActive={canSwapToActive}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function LoadoutDisplay({
  selection,
  onChange,
  classDomains,
  tier = '1',
  className,
  readOnly = false,
}: LoadoutDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelection, setDraftSelection] =
    useState<LoadoutSelection>(selection);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftSelection(selection);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, selection]);

  const handleSave = useCallback(() => {
    onChange?.(draftSelection);
  }, [draftSelection, onChange]);

  const handleCancel = useCallback(() => {
    setDraftSelection(selection);
  }, [selection]);

  const handleChange = useCallback((newSelection: LoadoutSelection) => {
    setDraftSelection(newSelection);
  }, []);

  const handleComplete = useCallback((completedSelection: LoadoutSelection) => {
    setDraftSelection(completedSelection);
  }, []);

  const handleSwapToVault = useCallback(
    (cardName: string) => {
      const card = selection.activeCards.find(c => c.name === cardName);
      if (!card) return;
      const updated: LoadoutSelection = {
        ...selection,
        activeCards: selection.activeCards.filter(c => c.name !== cardName),
        vaultCards: [...selection.vaultCards, card],
      };
      onChange?.(updated);
    },
    [selection, onChange]
  );

  const handleSwapToActive = useCallback(
    (cardName: string) => {
      if (selection.activeCards.length >= 5) return;
      const card = selection.vaultCards.find(c => c.name === cardName);
      if (!card) return;
      const updated: LoadoutSelection = {
        ...selection,
        vaultCards: selection.vaultCards.filter(c => c.name !== cardName),
        activeCards: [...selection.activeCards, card],
      };
      onChange?.(updated);
    },
    [selection, onChange]
  );

  return (
    <EditableSection
      title="Domain Loadout"
      emoji="📜"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="full"
      className={cn(className)}
      editTitle="Build Your Domain Loadout"
      editDescription="Select domain cards for your active loadout and vault."
      editContent={
        <LoadoutSelector
          value={draftSelection}
          onChange={handleChange}
          onComplete={handleComplete}
          classDomains={classDomains}
          tier={tier}
          hideHeader
        />
      }
    >
      <LoadoutContent
        selection={selection}
        onSwapToVault={readOnly ? undefined : handleSwapToVault}
        onSwapToActive={readOnly ? undefined : handleSwapToActive}
      />
    </EditableSection>
  );
}
