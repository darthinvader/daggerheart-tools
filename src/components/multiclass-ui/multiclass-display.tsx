import { AlertCircle, BookOpen, Plus, Sparkles } from 'lucide-react';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { AddSecondaryDialog } from './add-secondary-dialog';
import { ClassLevelCard } from './class-level-card';
import {
  MAX_TOTAL_LEVEL,
  MIN_PRIMARY_LEVEL,
  MIN_SECONDARY_LEVEL,
  MULTICLASS_RULES,
} from './constants';
import {
  canAddSecondary,
  formatClassDisplay,
  getMaxPrimaryLevel,
  getMaxSecondaryLevel,
  getTotalLevel,
  validateMulticlassConfig,
} from './multiclass-utils';
import type { MulticlassConfig } from './types';

interface MulticlassDisplayProps {
  config: MulticlassConfig;
  onChange: (config: MulticlassConfig) => void;
}

export function MulticlassDisplay({
  config,
  onChange,
}: MulticlassDisplayProps) {
  const [showAddSecondary, setShowAddSecondary] = useState(false);

  const totalLevel = getTotalLevel(config);
  const errors = validateMulticlassConfig(config);
  const canAdd = canAddSecondary(config);

  const handlePrimaryLevelChange = (delta: number) => {
    const newLevel = Math.max(
      MIN_PRIMARY_LEVEL,
      Math.min(getMaxPrimaryLevel(config), config.primaryLevel + delta)
    );
    onChange({ ...config, primaryLevel: newLevel });
  };

  const handleSecondaryLevelChange = (delta: number) => {
    const newLevel = Math.max(
      MIN_SECONDARY_LEVEL,
      Math.min(getMaxSecondaryLevel(config), config.secondaryLevel + delta)
    );
    onChange({ ...config, secondaryLevel: newLevel });
  };

  const handleAddSecondary = (className: string) => {
    onChange({
      ...config,
      secondaryClass: className,
      secondaryLevel: 1,
    });
    setShowAddSecondary(false);
  };

  const handleRemoveSecondary = () => {
    onChange({ ...config, secondaryClass: null, secondaryLevel: 0 });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5" />
            Class & Level
          </h3>
          <span className="text-muted-foreground text-sm">
            {formatClassDisplay(config)}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Total Level</span>
            <span className="font-medium">
              {totalLevel} / {MAX_TOTAL_LEVEL}
            </span>
          </div>
          <Progress value={(totalLevel / MAX_TOTAL_LEVEL) * 100} />
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-inside list-disc">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <ClassLevelCard
            className={config.primaryClass}
            level={config.primaryLevel}
            minLevel={MIN_PRIMARY_LEVEL}
            maxLevel={getMaxPrimaryLevel(config)}
            isPrimary
            onLevelChange={handlePrimaryLevelChange}
          />

          {config.secondaryClass ? (
            <ClassLevelCard
              className={config.secondaryClass}
              level={config.secondaryLevel}
              minLevel={MIN_SECONDARY_LEVEL}
              maxLevel={MAX_TOTAL_LEVEL - config.primaryLevel}
              isPrimary={false}
              onLevelChange={handleSecondaryLevelChange}
              onRemove={handleRemoveSecondary}
            />
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-4">
              <Button
                variant="outline"
                onClick={() => setShowAddSecondary(true)}
                disabled={!canAdd}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Secondary Class
              </Button>
            </div>
          )}
        </div>

        <details className="text-sm">
          <summary className="text-muted-foreground flex cursor-pointer items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Multiclass Rules
          </summary>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 pl-5">
            {MULTICLASS_RULES.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </details>
      </div>

      <AddSecondaryDialog
        isOpen={showAddSecondary}
        onClose={() => setShowAddSecondary(false)}
        onConfirm={handleAddSecondary}
        primaryClass={config.primaryClass}
      />
    </>
  );
}
