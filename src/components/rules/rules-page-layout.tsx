import { ChevronRight } from 'lucide-react';
import * as React from 'react';

import {
  RulesPageDetailPanel,
  tagToneClasses,
} from '@/components/rules/rules-page-detail-panel';
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
import { RulesSectionIcons } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface RulesPageLayoutProps {
  page: RulesPage;
}

export function RulesPageLayout({ page }: RulesPageLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<
    RulesPage['sections'][number] | null
  >(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          {(() => {
            const PageIcon = RulesSectionIcons[page.iconKey];
            return PageIcon ? (
              <PageIcon className="mr-2 inline-block size-8" />
            ) : null;
          })()}
          {page.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          {page.description}
        </p>
        {page.quickFacts && page.quickFacts.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {page.quickFacts.map(fact => (
              <SmartTooltip
                key={fact.label}
                content={fact.tooltip ?? fact.value}
              >
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary"
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
            <Card
              key={section.id}
              className="group border-border/50 hover:border-primary/50 relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => setActiveSection(section)}
            >
              {/* Gradient top bar */}
              <div className={cn('h-1.5 bg-linear-to-r', page.gradient)} />

              {/* Subtle glow effect on hover */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100',
                  'from-primary/5 bg-linear-to-br via-transparent to-transparent'
                )}
              />

              <CardHeader className="relative">
                <div className="flex items-start gap-3">
                  {/* Icon with gradient background */}
                  <div
                    className={cn(
                      'shrink-0 rounded-xl p-2.5 shadow-sm transition-transform group-hover:scale-110',
                      'from-muted to-muted/50 bg-linear-to-br',
                      'ring-border/50 ring-1'
                    )}
                  >
                    {(() => {
                      const SectionIcon = RulesSectionIcons[section.iconKey];
                      return SectionIcon ? (
                        <SectionIcon className="text-primary size-6" />
                      ) : null;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="group-hover:text-primary text-xl transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {section.summary}
                    </CardDescription>
                    <div className="text-primary/60 mt-2 flex items-center gap-1 text-xs font-medium">
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
                          className={cn(
                            'text-xs shadow-sm',
                            tagToneClasses(tag.tone)
                          )}
                        >
                          {tag.label}
                        </Badge>
                      </SmartTooltip>
                    ))}
                  </div>
                )}

                <ul className="space-y-2 text-sm">
                  {section.bullets.slice(0, 3).map((bullet, bulletIdx) => (
                    <li
                      key={bulletIdx}
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
          ))}
        </div>

        <RulesPageDetailPanel
          activeSection={activeSection}
          onClose={() => setActiveSection(null)}
        />
      </div>
    </div>
  );
}
