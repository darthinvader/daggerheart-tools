import {
  BookOpen,
  Calculator,
  ChevronRight,
  Cog,
  FileText,
  Lightbulb,
  List,
  Sparkles,
} from 'lucide-react';

import { DetailPanel } from '@/components/references';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { RulesPage, RulesTag } from '@/lib/data/rules/rules-content';
import { AlertTriangle, Leaf, RulesSectionIcons } from '@/lib/icons';
import { cn } from '@/lib/utils';

// Color themes for different detail sections
const sectionThemes = {
  covers: {
    icon: List,
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/20',
  },
  works: {
    icon: Cog,
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-500/20',
  },
  mechanics: {
    icon: Sparkles,
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-500/20',
  },
  math: {
    icon: Calculator,
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-500/20',
  },
  examples: {
    icon: FileText,
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-500/20',
  },
} as const;

interface SectionBlockProps {
  theme: keyof typeof sectionThemes;
  title: string;
  items: string[];
}

function SectionBlock({ theme, title, items }: SectionBlockProps) {
  const { icon: Icon, bg, border, text, iconBg } = sectionThemes[theme];

  return (
    <div className={cn('rounded-xl border p-4', bg, border)}>
      <div className="mb-3 flex items-center gap-2">
        <div className={cn('rounded-lg p-1.5', iconBg)}>
          <Icon className={cn('size-4', text)} />
        </div>
        <h3 className={cn('text-sm font-semibold', text)}>{title}</h3>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2">
            <ChevronRight
              className={cn('mt-0.5 size-3.5 shrink-0 opacity-60', text)}
            />
            <span className="text-foreground/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function tagToneClasses(tone?: RulesTag['tone']) {
  switch (tone) {
    case 'success':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'warning':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    default:
      return 'border-border bg-muted/40 text-foreground';
  }
}

interface RulesPageDetailPanelProps {
  activeSection: RulesPage['sections'][number] | null;
  onClose: () => void;
}

export function RulesPageDetailPanel({
  activeSection,
  onClose,
}: RulesPageDetailPanelProps) {
  return (
    <DetailPanel
      isOpen={Boolean(activeSection)}
      onClose={onClose}
      title={
        activeSection ? (
          <span className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-lg p-1.5',
                'from-primary/20 to-primary/5 bg-linear-to-br'
              )}
            >
              {(() => {
                const DetailIcon = RulesSectionIcons[activeSection.iconKey];
                return DetailIcon ? (
                  <DetailIcon className="text-primary size-5" />
                ) : null;
              })()}
            </span>
            <span className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text">
              {activeSection.title}
            </span>
          </span>
        ) : (
          'Rule detail'
        )
      }
    >
      {activeSection && (
        <div className="space-y-4">
          {/* Summary with decorative quote styling */}
          <div className="border-border/50 bg-muted/30 relative rounded-xl border p-4">
            <BookOpen className="text-muted-foreground/40 absolute top-3 right-3 size-5" />
            <p className="text-muted-foreground pr-8 text-sm leading-relaxed italic">
              {activeSection.summary}
            </p>
          </div>

          {/* Tags with enhanced styling */}
          {activeSection.tags && activeSection.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeSection.tags.map(tag => (
                <SmartTooltip key={tag.label} content={tag.description}>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-medium shadow-sm transition-transform hover:scale-105',
                      tagToneClasses(tag.tone)
                    )}
                  >
                    {tag.label}
                  </Badge>
                </SmartTooltip>
              ))}
            </div>
          )}

          <Separator className="via-border bg-linear-to-r from-transparent to-transparent" />

          {/* What it covers - colorful section */}
          <SectionBlock
            theme="covers"
            title="What it covers"
            items={activeSection.bullets}
          />

          {/* How it works */}
          {activeSection.details && activeSection.details.length > 0 && (
            <SectionBlock
              theme="works"
              title="How it works"
              items={activeSection.details}
            />
          )}

          {/* Mechanics */}
          {activeSection.mechanics && activeSection.mechanics.length > 0 && (
            <SectionBlock
              theme="mechanics"
              title="Mechanics"
              items={activeSection.mechanics}
            />
          )}

          {/* Math & thresholds */}
          {activeSection.math && activeSection.math.length > 0 && (
            <SectionBlock
              theme="math"
              title="Math & Thresholds"
              items={activeSection.math}
            />
          )}

          {/* Examples */}
          {activeSection.examples && activeSection.examples.length > 0 && (
            <SectionBlock
              theme="examples"
              title="Examples"
              items={activeSection.examples}
            />
          )}

          <Separator className="via-border bg-linear-to-r from-transparent to-transparent" />

          {/* Pro Tips - enhanced alert */}
          {activeSection.tips && activeSection.tips.length > 0 && (
            <Alert className="overflow-hidden rounded-xl border-emerald-500/40 bg-linear-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5">
              <div className="absolute -top-4 -right-4 size-24 rounded-full bg-emerald-500/10 blur-2xl" />
              <AlertTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <div className="rounded-lg bg-emerald-500/20 p-1.5">
                  <Leaf className="size-4" />
                </div>
                <span className="font-semibold">Pro Tip</span>
              </AlertTitle>
              <AlertDescription className="mt-3">
                <ul className="space-y-2 text-sm">
                  {activeSection.tips.map(tip => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-emerald-800 dark:text-emerald-200"
                    >
                      <Lightbulb className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Cautions - enhanced alert */}
          {activeSection.cautions && activeSection.cautions.length > 0 && (
            <Alert className="overflow-hidden rounded-xl border-amber-500/40 bg-linear-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5">
              <div className="absolute -top-4 -right-4 size-24 rounded-full bg-amber-500/10 blur-2xl" />
              <AlertTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <div className="rounded-lg bg-amber-500/20 p-1.5">
                  <AlertTriangle className="size-4" />
                </div>
                <span className="font-semibold">Heads Up</span>
              </AlertTitle>
              <AlertDescription className="mt-3">
                <ul className="space-y-2 text-sm">
                  {activeSection.cautions.map(note => (
                    <li
                      key={note}
                      className="flex items-start gap-2 text-amber-800 dark:text-amber-200"
                    >
                      <ChevronRight className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </DetailPanel>
  );
}
