import { Link, type LinkProps } from '@tanstack/react-router';
import {
  ArrowUpRight,
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
import type { RulesPage } from '@/lib/data/rules/rules-content';
import { AlertTriangle, Leaf, RulesSectionIcons } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { tagToneClasses } from './rules-utils';

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

function SectionBlock({
  theme,
  title,
  items,
}: {
  theme: keyof typeof sectionThemes;
  title: string;
  items: string[];
}) {
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

function TipsAlert({ tips }: { tips: string[] }) {
  return (
    <Alert className="overflow-hidden rounded-xl border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5">
      <div className="absolute -top-4 -right-4 size-24 rounded-full bg-emerald-500/10 blur-2xl" />
      <AlertTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
        <div className="rounded-lg bg-emerald-500/20 p-1.5">
          <Leaf className="size-4" />
        </div>
        <span className="font-semibold">Pro Tip</span>
      </AlertTitle>
      <AlertDescription className="mt-3">
        <ul className="space-y-2 text-sm">
          {tips.map(tip => (
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
  );
}

function CautionsAlert({ cautions }: { cautions: string[] }) {
  return (
    <Alert className="overflow-hidden rounded-xl border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5">
      <div className="absolute -top-4 -right-4 size-24 rounded-full bg-amber-500/10 blur-2xl" />
      <AlertTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
        <div className="rounded-lg bg-amber-500/20 p-1.5">
          <AlertTriangle className="size-4" />
        </div>
        <span className="font-semibold">Heads Up</span>
      </AlertTitle>
      <AlertDescription className="mt-3">
        <ul className="space-y-2 text-sm">
          {cautions.map(note => (
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
  );
}

function PanelTitle({ section }: { section: RulesPage['sections'][number] }) {
  const DetailIcon = RulesSectionIcons[section.iconKey];
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-lg p-1.5',
          'from-primary/20 to-primary/5 bg-gradient-to-br'
        )}
      >
        {DetailIcon && <DetailIcon className="text-primary size-5" />}
      </span>
      <span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text">
        {section.title}
      </span>
    </span>
  );
}

function SectionContent({
  section,
}: {
  section: RulesPage['sections'][number];
}) {
  return (
    <div className="space-y-4">
      <div className="border-border/50 bg-muted/30 relative rounded-xl border p-4">
        <BookOpen className="text-muted-foreground/40 absolute top-3 right-3 size-5" />
        <p className="text-muted-foreground pr-8 text-sm leading-relaxed italic">
          {section.summary}
        </p>
      </div>
      {section.tags && section.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {section.tags.map(tag => (
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
      <Separator className="via-border bg-gradient-to-r from-transparent to-transparent" />
      <SectionBlock
        theme="covers"
        title="What it covers"
        items={section.bullets}
      />
      {section.details && section.details.length > 0 && (
        <SectionBlock
          theme="works"
          title="How it works"
          items={section.details}
        />
      )}
      {section.mechanics && section.mechanics.length > 0 && (
        <SectionBlock
          theme="mechanics"
          title="Mechanics"
          items={section.mechanics}
        />
      )}
      {section.math && section.math.length > 0 && (
        <SectionBlock
          theme="math"
          title="Math & Thresholds"
          items={section.math}
        />
      )}
      {section.examples && section.examples.length > 0 && (
        <SectionBlock
          theme="examples"
          title="Examples"
          items={section.examples}
        />
      )}
      <Separator className="via-border bg-gradient-to-r from-transparent to-transparent" />
      {section.tips && section.tips.length > 0 && (
        <TipsAlert tips={section.tips} />
      )}
      {section.cautions && section.cautions.length > 0 && (
        <CautionsAlert cautions={section.cautions} />
      )}
      {section.relatedSections && section.relatedSections.length > 0 && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
            <ArrowUpRight className="size-4" />
            Related Rules
          </h3>
          <ul className="space-y-2">
            {section.relatedSections.map(ref => (
              <li key={`${ref.pageId}-${ref.sectionId}`}>
                <Link
                  to={`/rules/${ref.pageId}` as LinkProps['to']}
                  className="flex items-center gap-2 text-sm text-sky-700 underline-offset-2 transition-colors hover:text-sky-500 hover:underline dark:text-sky-300"
                >
                  <ChevronRight className="size-3.5 shrink-0 opacity-60" />
                  {ref.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function RulesPageDetailPanel({
  activeSection,
  onClose,
}: {
  activeSection: RulesPage['sections'][number] | null;
  onClose: () => void;
}) {
  return (
    <DetailPanel
      isOpen={Boolean(activeSection)}
      onClose={onClose}
      title={
        activeSection ? <PanelTitle section={activeSection} /> : 'Rule detail'
      }
    >
      {activeSection && <SectionContent section={activeSection} />}
    </DetailPanel>
  );
}
