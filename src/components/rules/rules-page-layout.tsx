import { Link } from '@tanstack/react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { RulesPageDetailPanel } from '@/components/rules/rules-page-detail-panel';
import { tagToneClasses } from '@/components/rules/rules-utils';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { RulesPage } from '@/lib/data/rules/rules-content';
import { RULES_INDEX_CARDS } from '@/lib/data/rules/rules-content';
import { RulesSectionIcons } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface RulesSectionCardProps {
  section: RulesPage['sections'][number];
  gradient: string;
  onClick: () => void;
}

function RulesSectionCard({
  section,
  gradient,
  onClick,
}: RulesSectionCardProps) {
  const SectionIcon = RulesSectionIcons[section.iconKey];
  return (
    <Card
      className="group border-border/50 hover:border-primary/50 relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      <div className={cn('h-1.5 bg-gradient-to-r', gradient)} />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100',
          'from-primary/5 bg-gradient-to-br via-transparent to-transparent'
        )}
      />
      <CardHeader className="relative">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'shrink-0 rounded-xl p-2.5 shadow-sm transition-transform group-hover:scale-110',
              'from-muted to-muted/50 bg-gradient-to-br',
              'ring-border/50 ring-1'
            )}
          >
            {SectionIcon && <SectionIcon className="text-primary size-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="group-hover:text-primary text-xl transition-colors">
              {section.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm leading-relaxed">
              {section.summary}
            </CardDescription>
            <div className="text-primary/60 mt-2 flex items-center gap-1 text-xs font-medium sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              <ChevronRight className="size-3.5" />
              Tap to explore
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4 pt-0">
        {section.tags && section.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {section.tags.map(tag => (
              <SmartTooltip key={tag.label} content={tag.description}>
                <Badge
                  variant="outline"
                  className={cn('text-xs shadow-sm', tagToneClasses(tag.tone))}
                >
                  {tag.label}
                </Badge>
              </SmartTooltip>
            ))}
          </div>
        )}
        <ul className="space-y-2 text-sm">
          {section.bullets.slice(0, 3).map((bullet, idx) => (
            <li
              key={idx}
              className="text-muted-foreground flex items-start gap-2"
            >
              <span className="bg-primary/20 mt-2 size-1.5 shrink-0 rounded-full" />
              <span className="line-clamp-1">{bullet}</span>
            </li>
          ))}
          {section.bullets.length > 3 && (
            <li className="text-muted-foreground/70 text-xs italic">
              +{section.bullets.length - 3} more...
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

export function RulesPageLayout({ page }: { page: RulesPage }) {
  const [activeSection, setActiveSection] = React.useState<
    RulesPage['sections'][number] | null
  >(null);
  const PageIcon = RulesSectionIcons[page.iconKey];

  const currentIndex = RULES_INDEX_CARDS.findIndex(
    c => c.to === `/rules/${page.id}`
  );
  const prevCard =
    currentIndex > 0 ? RULES_INDEX_CARDS[currentIndex - 1] : null;
  const nextCard =
    currentIndex < RULES_INDEX_CARDS.length - 1
      ? RULES_INDEX_CARDS[currentIndex + 1]
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sticky back link – always visible on mobile, inline on desktop */}
      <div className="bg-background/80 sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-2 px-4 py-2 backdrop-blur-sm sm:static sm:mx-0 sm:mb-6 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <Link
          to="/rules"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Rules
        </Link>
        <ChevronRight className="text-muted-foreground/50 size-3.5" />
        <span className="text-foreground text-sm font-medium">
          {page.title}
        </span>
      </div>

      <div className="mb-10 text-center">
        <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          {PageIcon && <PageIcon className="mr-2 inline-block size-8" />}
          {page.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          {page.description}
        </p>
        {page.quickFacts && page.quickFacts.length > 0 && (
          <div className="max-sm:scrollbar-none mt-6 flex justify-center gap-2 overflow-x-auto pb-2 max-sm:-mx-4 max-sm:justify-start max-sm:px-4">
            {page.quickFacts.map(fact => (
              <SmartTooltip
                key={fact.label}
                content={fact.tooltip ?? fact.value}
              >
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary shrink-0"
                >
                  {fact.label}: {fact.value}
                </Badge>
              </SmartTooltip>
            ))}
          </div>
        )}
      </div>
      <div className="lg:flex lg:gap-6">
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
          {page.sections.map(section => (
            <RulesSectionCard
              key={section.id}
              section={section}
              gradient={page.gradient}
              onClick={() => setActiveSection(section)}
            />
          ))}
        </div>
        <RulesPageDetailPanel
          activeSection={activeSection}
          onClose={() => setActiveSection(null)}
        />
      </div>

      {/* Prev / Next page navigation */}
      <div className="mt-10 flex items-center justify-between border-t pt-6">
        {prevCard ? (
          <Link
            to={prevCard.to}
            className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="max-sm:sr-only">{prevCard.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <span />
        )}
        {nextCard ? (
          <Link
            to={nextCard.to}
            className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors"
          >
            <span className="max-sm:sr-only">{nextCard.title}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
