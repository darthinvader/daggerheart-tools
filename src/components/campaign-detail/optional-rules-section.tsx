// Optional Rules Configuration Section for Session Zero
// Based on Chapter 3: Optional rules should be agreed on during session zero

import { Grid, Plus, Settings, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  DefinedRanges,
  HouseRule,
  OptionalRulesConfig,
} from '@/lib/schemas/campaign';
import { generateSessionZeroItemId } from '@/lib/schemas/campaign';

// ─────────────────────────────────────────────────────────────────────────────
// Default Optional Rules Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_OPTIONAL_RULES: OptionalRulesConfig = {
  massiveDamage: false,
  spotlightTrackers: false,
  definedRanges: false,
  rangeDefinitions: undefined,
  goldCoins: false,
  customHouseRules: [],
  notes: '',
};

export const DEFAULT_RANGE_DEFINITIONS: DefinedRanges = {
  melee: 1,
  veryClose: 3,
  close: 6,
  far: 12,
  veryFar: 13,
};

// ─────────────────────────────────────────────────────────────────────────────
// Optional Rule Descriptions
// ─────────────────────────────────────────────────────────────────────────────

const OPTIONAL_RULE_INFO = {
  massiveDamage: {
    name: 'Massive Damage',
    description:
      'When damage equals or exceeds double the Severe threshold, mark 4 HP instead of 3. Adds a higher damage tier for particularly devastating hits.',
    rulesText: 'Damage ≥ 2× Severe = 4 HP marked',
  },
  spotlightTrackers: {
    name: 'Spotlight Trackers',
    description:
      'Adds structured turn order to scenes. Useful for groups who prefer more tactical combat with clear action economy.',
    rulesText: 'Track spotlight for each PC in combat',
  },
  definedRanges: {
    name: 'Defined Ranges',
    description:
      'Maps abstract ranges to a 1-inch grid for miniature play. Each range corresponds to a specific number of squares.',
    rulesText:
      'Melee: 1 sq, Very Close: ≤3 sq, Close: ≤6 sq, Far: ≤12 sq, Very Far: 13+ sq',
  },
  goldCoins: {
    name: 'Gold Coins',
    description:
      'Adds a more granular currency tier below handfuls. 10 coins = 1 handful. Useful for campaigns with more economic detail.',
    rulesText: '10 Coins = 1 Handful, 10 Handfuls = 1 Bag, 10 Bags = 1 Chest',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Optional Rule Toggle Component
// ─────────────────────────────────────────────────────────────────────────────

interface OptionalRuleToggleProps {
  ruleKey: keyof typeof OPTIONAL_RULE_INFO;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function OptionalRuleToggle({
  ruleKey,
  checked,
  onChange,
}: OptionalRuleToggleProps) {
  const info = OPTIONAL_RULE_INFO[ruleKey];

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        checked
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-border bg-background'
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id={`rule-${ruleKey}`}
          checked={checked}
          onCheckedChange={onChange}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`rule-${ruleKey}`}
              className="cursor-pointer text-sm font-medium"
            >
              {info.name}
            </Label>
            {checked && (
              <Badge variant="outline" className="text-xs text-green-600">
                Enabled
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {info.description}
          </p>
          <div className="bg-muted/50 mt-2 rounded p-2">
            <p className="text-muted-foreground text-xs font-medium">
              <Settings className="mr-1 inline-block h-3 w-3" />
              {info.rulesText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Range Definitions Editor
// ─────────────────────────────────────────────────────────────────────────────

interface RangeDefinitionsEditorProps {
  ranges: DefinedRanges | undefined;
  onChange: (ranges: DefinedRanges) => void;
}

function RangeDefinitionsEditor({
  ranges,
  onChange,
}: RangeDefinitionsEditorProps) {
  const currentRanges = ranges ?? DEFAULT_RANGE_DEFINITIONS;

  const updateRange = useCallback(
    (key: keyof DefinedRanges, value: number) => {
      onChange({
        ...currentRanges,
        [key]: Math.max(1, value),
      });
    },
    [currentRanges, onChange]
  );

  const rangeFields: Array<{ key: keyof DefinedRanges; label: string }> = [
    { key: 'melee', label: 'Melee' },
    { key: 'veryClose', label: 'Very Close' },
    { key: 'close', label: 'Close' },
    { key: 'far', label: 'Far' },
    { key: 'veryFar', label: 'Very Far' },
  ];

  return (
    <div className="bg-muted/30 mt-3 rounded-lg border p-3">
      <div className="mb-2 flex items-center gap-2">
        <Grid className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">
          Range Definitions (in squares)
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {rangeFields.map(({ key, label }) => (
          <div key={key} className="text-center">
            <Label className="text-muted-foreground text-xs">{label}</Label>
            <Input
              type="number"
              min={1}
              value={currentRanges[key]}
              onChange={e => updateRange(key, parseInt(e.target.value) || 1)}
              className="mt-1 h-8 text-center text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// House Rules Editor
// ─────────────────────────────────────────────────────────────────────────────

interface HouseRulesEditorProps {
  rules: HouseRule[];
  onChange: (rules: HouseRule[]) => void;
}

function HouseRulesEditor({ rules, onChange }: HouseRulesEditorProps) {
  const [newRule, setNewRule] = useState({ name: '', description: '' });

  const addRule = useCallback(() => {
    if (!newRule.name.trim() || !newRule.description.trim()) return;

    const rule: HouseRule = {
      id: generateSessionZeroItemId('house-rule'),
      name: newRule.name.trim(),
      description: newRule.description.trim(),
      enabled: true,
    };

    onChange([...rules, rule]);
    setNewRule({ name: '', description: '' });
  }, [newRule, rules, onChange]);

  const toggleRule = useCallback(
    (id: string) => {
      onChange(
        rules.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
      );
    },
    [rules, onChange]
  );

  const removeRule = useCallback(
    (id: string) => {
      onChange(rules.filter(r => r.id !== id));
    },
    [rules, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3">
        <p className="mb-2 text-sm font-medium">Add Custom House Rule</p>
        <div className="space-y-2">
          <Input
            value={newRule.name}
            onChange={e =>
              setNewRule(prev => ({ ...prev, name: e.target.value }))
            }
            placeholder="Rule name..."
          />
          <Textarea
            value={newRule.description}
            onChange={e =>
              setNewRule(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe the rule..."
            rows={2}
          />
          <Button
            type="button"
            onClick={addRule}
            disabled={!newRule.name.trim() || !newRule.description.trim()}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add House Rule
          </Button>
        </div>
      </div>

      {rules.length > 0 && (
        <div className="space-y-2">
          {rules.map(rule => (
            <div
              key={rule.id}
              className={`rounded-lg border p-3 transition-colors ${
                rule.enabled
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-border bg-muted/30 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${!rule.enabled ? 'line-through' : ''}`}
                    >
                      {rule.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeRule(rule.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p
                    className={`text-muted-foreground text-sm ${!rule.enabled ? 'line-through' : ''}`}
                  >
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rules.length === 0 && (
        <p className="text-muted-foreground text-center text-sm italic">
          No custom house rules added yet.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Optional Rules Section Component
// ─────────────────────────────────────────────────────────────────────────────

interface OptionalRulesSectionProps {
  optionalRules: OptionalRulesConfig | undefined;
  onChange: (rules: OptionalRulesConfig) => void;
  onBlur?: () => void;
}

export function OptionalRulesSection({
  optionalRules,
  onChange,
  onBlur,
}: OptionalRulesSectionProps) {
  const rules = optionalRules ?? DEFAULT_OPTIONAL_RULES;

  const updateRule = useCallback(
    <K extends keyof OptionalRulesConfig>(
      key: K,
      value: OptionalRulesConfig[K]
    ) => {
      onChange({ ...rules, [key]: value });
    },
    [rules, onChange]
  );

  return (
    <TooltipProvider>
      <div className="space-y-6" onBlur={onBlur}>
        {/* Description */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-sm">
            <strong>Optional Rules</strong> let you tune risk and pacing for
            your table. Discuss these during session zero and enable the ones
            that suit your group's playstyle.
          </p>
        </div>

        {/* Core Optional Rules */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Settings className="h-4 w-4" />
            Core Optional Rules
          </h4>

          <OptionalRuleToggle
            ruleKey="massiveDamage"
            checked={rules.massiveDamage}
            onChange={checked => updateRule('massiveDamage', checked)}
          />

          <OptionalRuleToggle
            ruleKey="spotlightTrackers"
            checked={rules.spotlightTrackers}
            onChange={checked => updateRule('spotlightTrackers', checked)}
          />

          <div>
            <OptionalRuleToggle
              ruleKey="definedRanges"
              checked={rules.definedRanges}
              onChange={checked => {
                updateRule('definedRanges', checked);
                if (checked && !rules.rangeDefinitions) {
                  updateRule('rangeDefinitions', DEFAULT_RANGE_DEFINITIONS);
                }
              }}
            />
            {rules.definedRanges && (
              <RangeDefinitionsEditor
                ranges={rules.rangeDefinitions}
                onChange={ranges => updateRule('rangeDefinitions', ranges)}
              />
            )}
          </div>

          <OptionalRuleToggle
            ruleKey="goldCoins"
            checked={rules.goldCoins}
            onChange={checked => updateRule('goldCoins', checked)}
          />
        </div>

        {/* Custom House Rules */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex cursor-help items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Custom House Rules
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Add your own house rules that the group has agreed upon during
                  session zero.
                </p>
              </TooltipContent>
            </Tooltip>
          </h4>

          <HouseRulesEditor
            rules={rules.customHouseRules}
            onChange={houseRules => updateRule('customHouseRules', houseRules)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="optional-rules-notes" className="text-sm font-medium">
            Notes
          </Label>
          <Textarea
            id="optional-rules-notes"
            value={rules.notes}
            onChange={e => updateRule('notes', e.target.value)}
            placeholder="Any additional notes about optional rules decisions..."
            rows={2}
          />
        </div>

        {/* Summary of Enabled Rules */}
        {(rules.massiveDamage ||
          rules.spotlightTrackers ||
          rules.definedRanges ||
          rules.goldCoins ||
          rules.customHouseRules.filter(r => r.enabled).length > 0) && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-300">
              Active Optional Rules
            </p>
            <div className="flex flex-wrap gap-2">
              {rules.massiveDamage && (
                <Badge variant="secondary">Massive Damage</Badge>
              )}
              {rules.spotlightTrackers && (
                <Badge variant="secondary">Spotlight Trackers</Badge>
              )}
              {rules.definedRanges && (
                <Badge variant="secondary">Defined Ranges</Badge>
              )}
              {rules.goldCoins && <Badge variant="secondary">Gold Coins</Badge>}
              {rules.customHouseRules
                .filter(r => r.enabled)
                .map(r => (
                  <Badge key={r.id} variant="outline">
                    {r.name}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
