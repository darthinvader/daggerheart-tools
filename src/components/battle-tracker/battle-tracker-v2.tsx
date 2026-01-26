import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  BookOpen,
  Crosshair,
  Dices,
  Flame,
  Leaf,
  Link2,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  Swords,
  TreePine,
  User,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { AddAdversaryDialogEnhanced } from './adversary-dialog-enhanced';
import { BattleTrackerDialogs } from './battle-tracker-dialogs';
import { DetailSidebar } from './detail-sidebar';
import { EditAdversaryDialog, EditEnvironmentDialog } from './edit-dialogs';
import { AddEnvironmentDialogEnhanced } from './environment-dialog-enhanced';
import { FightBuilderWizard } from './fight-builder-wizard';
import { AdversaryCard, CharacterCard } from './roster-cards';
import { RosterColumn } from './roster-column';
import type {
  AdversaryTracker,
  EnvironmentTracker,
  TrackerSelection,
} from './types';
import {
  useBattleDialogState,
  useBattleRosterState,
} from './use-battle-tracker-state';
import { DEFAULT_CHARACTER_DRAFT } from './utils';

type Selection = TrackerSelection | null;
type Spotlight = { id: string; kind: string } | null;

export function BattleTrackerV2() {
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();

  // Edit dialog state
  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);
  const [isFightBuilderOpen, setIsFightBuilderOpen] = useState(false);

  const handleAddCharacter = () => {
    const newId = rosterActions.addCharacter(dialogState.characterDraft);
    if (!newId) return;
    dialogActions.setCharacterDraft(DEFAULT_CHARACTER_DRAFT);
    dialogActions.setIsAddCharacterOpen(false);
  };

  const handleAddAdversary = (
    adversary: Parameters<typeof rosterActions.addAdversary>[0]
  ) => {
    rosterActions.addAdversary(adversary);
    dialogActions.setIsAddAdversaryOpen(false);
  };

  const handleAddEnvironment = (
    environment: Parameters<typeof rosterActions.addEnvironment>[0]
  ) => {
    rosterActions.addEnvironment(environment);
    dialogActions.setIsAddEnvironmentOpen(false);
  };

  const handleAddFromWizard = (
    adversaries: {
      adversary: Parameters<typeof rosterActions.addAdversary>[0];
      count: number;
    }[]
  ) => {
    adversaries.forEach(({ adversary, count }) => {
      for (let i = 0; i < count; i++) {
        rosterActions.addAdversary(adversary);
      }
    });
  };

  const handleSaveAdversary = (updates: Partial<AdversaryTracker>) => {
    if (!editingAdversary) return;
    rosterActions.updateAdversary(editingAdversary.id, prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSaveEnvironment = (updates: Partial<EnvironmentTracker>) => {
    if (!editingEnvironment) return;
    rosterActions.updateEnvironment(editingEnvironment.id, prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <TrackerHeader
        characterCount={rosterState.characters.length}
        adversaryCount={rosterState.adversaries.length}
        onAddCharacter={() => dialogActions.setIsAddCharacterOpen(true)}
        onAddAdversary={() => dialogActions.setIsAddAdversaryOpen(true)}
        onOpenFightBuilder={() => setIsFightBuilderOpen(true)}
      />

      {/* Quick Tips Bar */}
      <QuickTipsBar />

      {/* GM Resources Bar - Fear, GM Die, Environment - Above the columns */}
      <GMResourcesBar
        characterCount={rosterState.characters.length}
        environments={rosterState.environments}
        fearPool={rosterState.fearPool}
        selection={rosterState.selection}
        spotlight={rosterState.spotlight}
        useMassiveThreshold={rosterState.useMassiveThreshold}
        onFearChange={rosterActions.setFearPool}
        onUseMassiveThresholdChange={rosterActions.setUseMassiveThreshold}
        onAddEnvironment={() => dialogActions.setIsAddEnvironmentOpen(true)}
        onSelectEnvironment={env => rosterActions.handleSelect(env)}
        onRemoveEnvironment={env => rosterActions.handleRemove(env)}
        onSpotlightEnvironment={env => rosterActions.handleSpotlight(env)}
        onEditEnvironment={env => setEditingEnvironment(env)}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_minmax(320px,400px)]">
        <RosterColumn
          title="Characters"
          icon={<User className="size-4" />}
          count={rosterState.characters.length}
          emptyText="No characters added"
        >
          {rosterState.characters.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              isSelected={
                rosterState.selection?.id === char.id &&
                rosterState.selection.kind === 'character'
              }
              isSpotlight={
                rosterState.spotlight?.id === char.id &&
                rosterState.spotlight.kind === 'character'
              }
              useMassiveThreshold={rosterState.useMassiveThreshold}
              onSelect={() => rosterActions.handleSelect(char)}
              onRemove={() => rosterActions.handleRemove(char)}
              onSpotlight={() => rosterActions.handleSpotlight(char)}
              onChange={rosterActions.updateCharacter}
            />
          ))}
        </RosterColumn>

        <RosterColumn
          title="Adversaries"
          icon={<Swords className="size-4" />}
          count={rosterState.adversaries.length}
          emptyText="No adversaries added"
        >
          {rosterState.adversaries.map(adv => (
            <AdversaryCard
              key={adv.id}
              adversary={adv}
              isSelected={
                rosterState.selection?.id === adv.id &&
                rosterState.selection.kind === 'adversary'
              }
              isSpotlight={
                rosterState.spotlight?.id === adv.id &&
                rosterState.spotlight.kind === 'adversary'
              }
              useMassiveThreshold={rosterState.useMassiveThreshold}
              onSelect={() => rosterActions.handleSelect(adv)}
              onRemove={() => rosterActions.handleRemove(adv)}
              onSpotlight={() => rosterActions.handleSpotlight(adv)}
              onChange={rosterActions.updateAdversary}
              onEdit={() => setEditingAdversary(adv)}
            />
          ))}
        </RosterColumn>

        <DetailSidebar
          item={rosterState.selectedItem}
          spotlight={rosterState.spotlight}
          spotlightHistory={rosterState.spotlightHistory}
          characters={rosterState.characters}
          adversaries={rosterState.adversaries}
          environments={rosterState.environments}
          useMassiveThreshold={rosterState.useMassiveThreshold}
          onClearSpotlight={() => rosterActions.setSpotlight(null)}
          onSetSpotlight={rosterActions.setSpotlight}
          onCharacterChange={rosterActions.updateCharacter}
          onAdversaryChange={rosterActions.updateAdversary}
          onEnvironmentChange={rosterActions.updateEnvironment}
        />
      </div>

      <BattleTrackerDialogs
        dialogState={dialogState}
        dialogActions={dialogActions}
        onAddCharacter={handleAddCharacter}
        onAddAdversary={handleAddAdversary}
        onAddEnvironment={handleAddEnvironment}
      />

      {/* Enhanced Add Dialogs */}
      <AddAdversaryDialogEnhanced
        isOpen={dialogState.isAddAdversaryOpen}
        adversaries={dialogState.filteredAdversaries}
        onOpenChange={dialogActions.setIsAddAdversaryOpen}
        onAdd={handleAddAdversary}
      />

      <AddEnvironmentDialogEnhanced
        isOpen={dialogState.isAddEnvironmentOpen}
        environments={dialogState.filteredEnvironments}
        onOpenChange={dialogActions.setIsAddEnvironmentOpen}
        onAdd={handleAddEnvironment}
      />

      {/* Edit Dialogs */}
      <EditAdversaryDialog
        adversary={editingAdversary}
        isOpen={editingAdversary !== null}
        onOpenChange={open => !open && setEditingAdversary(null)}
        onSave={handleSaveAdversary}
      />

      <EditEnvironmentDialog
        environment={editingEnvironment}
        isOpen={editingEnvironment !== null}
        onOpenChange={open => !open && setEditingEnvironment(null)}
        onSave={handleSaveEnvironment}
      />

      {/* Fight Builder Wizard */}
      <FightBuilderWizard
        isOpen={isFightBuilderOpen}
        onOpenChange={setIsFightBuilderOpen}
        onAddAdversaries={handleAddFromWizard}
        currentCharacterCount={rosterState.characters.length}
      />
    </div>
  );
}

function TrackerHeader({
  characterCount,
  adversaryCount,
  onAddCharacter,
  onAddAdversary,
  onOpenFightBuilder,
}: {
  characterCount: number;
  adversaryCount: number;
  onAddCharacter: () => void;
  onAddAdversary: () => void;
  onOpenFightBuilder: () => void;
}) {
  const battlePoints = 3 * characterCount + 2;

  return (
    <div className="mb-6 space-y-4">
      {/* Header Row - Back button, title, and actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/gm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              GM Tools
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">Battle Tracker</h1>
              <Badge
                variant="outline"
                className="hidden items-center gap-1 sm:flex"
              >
                <Sparkles className="size-3 text-amber-500" />
                Spotlight
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Spotlight-first combat for Daggerheart
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Campaign Link */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/gm/campaigns">
                    <Link2 className="mr-1.5 size-4" /> Campaign
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save battle to a campaign</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Fight Builder */}
          <Button
            size="sm"
            variant="default"
            onClick={onOpenFightBuilder}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Wand2 className="mr-1.5 size-4" /> Fight Builder
          </Button>

          <div className="bg-border hidden h-6 w-px sm:block" />

          <Button size="sm" variant="outline" onClick={onAddCharacter}>
            <User className="mr-1.5 size-4 text-blue-500" /> Character
          </Button>
          <Button size="sm" variant="outline" onClick={onAddAdversary}>
            <Swords className="mr-1.5 size-4 text-red-500" /> Adversary
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5">
          <User className="size-4 text-blue-500" />
          <span className="font-medium">{characterCount}</span>
          <span className="text-muted-foreground">PCs</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5">
          <Swords className="size-4 text-red-500" />
          <span className="font-medium">{adversaryCount}</span>
          <span className="text-muted-foreground">Adversaries</span>
        </div>
        {characterCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-help items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5">
                  <Sparkles className="size-4 text-amber-500" />
                  <span className="font-medium">{battlePoints}</span>
                  <span className="text-muted-foreground">Battle Points</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Encounter budget: (3 × {characterCount}) + 2 = {battlePoints}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

// =====================================================================================
// GM Resources Bar - Fear, GM Die, Environment (Above the columns)
// =====================================================================================

function GMResourcesBar({
  characterCount,
  environments,
  fearPool,
  selection,
  spotlight,
  useMassiveThreshold: _useMassiveThreshold,
  onFearChange,
  onUseMassiveThresholdChange: _onUseMassiveThresholdChange,
  onAddEnvironment,
  onSelectEnvironment,
  onRemoveEnvironment,
  onSpotlightEnvironment,
  onEditEnvironment,
}: {
  characterCount: number;
  environments: EnvironmentTracker[];
  fearPool: number;
  selection: Selection | null;
  spotlight: Spotlight | null;
  useMassiveThreshold: boolean;
  onFearChange: (value: number) => void;
  onUseMassiveThresholdChange: (value: boolean) => void;
  onAddEnvironment: () => void;
  onSelectEnvironment: (env: EnvironmentTracker) => void;
  onRemoveEnvironment: (env: EnvironmentTracker) => void;
  onSpotlightEnvironment: (env: EnvironmentTracker) => void;
  onEditEnvironment: (env: EnvironmentTracker) => void;
}) {
  const maxFear = 12;
  const activeEnvironment = environments[0] ?? null;
  const [gmDieResult, setGmDieResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollGmDie = () => {
    setIsRolling(true);
    setGmDieResult(null);
    let count = 0;
    const interval = setInterval(() => {
      setGmDieResult(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setGmDieResult(Math.floor(Math.random() * 20) + 1);
        setIsRolling(false);
      }
    }, 80);
  };

  return (
    <Card className="border-muted-foreground/20 from-muted/30 via-background to-muted/30 mb-4 border-2 border-dashed bg-gradient-to-r">
      <CardContent className="flex flex-wrap items-center justify-center gap-4 px-4 py-4">
        {/* Fear Counter */}
        <div className="flex min-h-[60px] items-center gap-3 rounded-lg border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-violet-500/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Flame className="size-5 text-purple-500" />
            <span className="font-bold text-purple-600 dark:text-purple-400">
              FEAR
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="outline"
              className="size-7 border-purple-300 hover:bg-purple-500/20"
              onClick={() => onFearChange(Math.max(0, fearPool - 1))}
              disabled={fearPool <= 0}
            >
              <Minus className="size-3" />
            </Button>
            <div className="flex items-baseline gap-0.5">
              <span className="min-w-[2ch] text-center text-2xl font-bold text-purple-600 dark:text-purple-400">
                {fearPool}
              </span>
              <span className="text-muted-foreground text-xs">/{maxFear}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="size-7 border-purple-300 hover:bg-purple-500/20"
              onClick={() => onFearChange(Math.min(maxFear, fearPool + 1))}
              disabled={fearPool >= maxFear}
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-purple-500 hover:text-purple-600"
                  onClick={() => onFearChange(characterCount)}
                >
                  Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset to starting Fear ({characterCount} = PC count)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* GM Die Roller */}
        <div className="flex min-h-[60px] items-center gap-3 rounded-lg border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Dices className="size-5 text-blue-500" />
            <span className="font-bold text-blue-600 dark:text-blue-400">
              GM Die
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 min-w-16 border-blue-300 hover:bg-blue-500/20 ${isRolling ? 'animate-pulse' : ''}`}
                  onClick={rollGmDie}
                  disabled={isRolling}
                >
                  {gmDieResult !== null ? (
                    <span
                      className={`text-lg font-bold ${gmDieResult === 20 ? 'text-green-500' : gmDieResult === 1 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}
                    >
                      {gmDieResult}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">d20</span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Roll the GM's d20 for adversary attacks</p>
                {gmDieResult === 20 && (
                  <p className="font-bold text-green-500">Critical Success!</p>
                )}
                {gmDieResult === 1 && (
                  <p className="text-red-500">Critical Failure</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Active Environment */}
        {activeEnvironment ? (
          <div
            className={`flex min-h-[60px] items-center gap-3 rounded-lg border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 ${
              spotlight?.id === activeEnvironment.id &&
              spotlight.kind === 'environment'
                ? 'ring-2 ring-amber-400'
                : ''
            } ${selection?.id === activeEnvironment.id && selection.kind === 'environment' ? 'ring-primary ring-2' : ''}`}
          >
            <button
              onClick={() => onSelectEnvironment(activeEnvironment)}
              className="flex items-center gap-2 text-left"
            >
              <span className="text-lg">
                {activeEnvironment.source.type === 'Exploration' ? (
                  '🗺️'
                ) : activeEnvironment.source.type === 'Social' ? (
                  '💬'
                ) : activeEnvironment.source.type === 'Event' ? (
                  '⚡'
                ) : activeEnvironment.source.type === 'Traversal' ? (
                  '🚶'
                ) : (
                  <TreePine className="size-4" />
                )}
              </span>
              <div className="min-w-0">
                <p className="max-w-[150px] truncate font-bold text-emerald-700 dark:text-emerald-400">
                  {activeEnvironment.source.name}
                </p>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span>T{activeEnvironment.source.tier}</span>
                  <span>·</span>
                  <Crosshair className="size-3" />
                  <span>{activeEnvironment.source.difficulty}</span>
                  <span>·</span>
                  <Zap className="size-3" />
                  <span>
                    {activeEnvironment.features.filter(f => f.active).length}/
                    {activeEnvironment.features.length}
                  </span>
                </div>
              </div>
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[120px] cursor-help text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="truncate italic">
                      "{activeEnvironment.source.impulses[0]}"
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="mb-1 font-medium">Impulses:</p>
                  <ul className="list-inside list-disc space-y-0.5 text-xs">
                    {activeEnvironment.source.impulses.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6 text-amber-500 hover:text-amber-600"
                      onClick={() => onSpotlightEnvironment(activeEnvironment)}
                    >
                      <Sparkles className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Spotlight</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground size-6"
                onClick={() => onEditEnvironment(activeEnvironment)}
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive size-6"
                onClick={() => onRemoveEnvironment(activeEnvironment)}
              >
                <X className="size-3" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 px-4 py-2 transition-colors hover:bg-emerald-500/10"
            onClick={onAddEnvironment}
          >
            <div className="flex items-center gap-1.5">
              <Leaf className="size-5 text-emerald-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Environment
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-300 text-emerald-600"
            >
              <Plus className="mr-1 size-3" /> Add
            </Badge>
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// Quick Tips Bar
// =====================================================================================

function QuickTipsBar() {
  const tips = [
    {
      icon: Sparkles,
      text: 'Spotlight flows — no initiative!',
      color: 'text-amber-500',
    },
    {
      icon: BookOpen,
      text: 'Spend Fear for features',
      color: 'text-purple-500',
    },
    { icon: Swords, text: 'Mix roles for dynamics', color: 'text-red-500' },
  ];

  return (
    <div className="text-muted-foreground mb-3 flex flex-wrap items-center justify-center gap-4 text-xs">
      {tips.map((tip, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <tip.icon className={`size-3 ${tip.color}`} />
          <span>{tip.text}</span>
        </div>
      ))}
    </div>
  );
}
