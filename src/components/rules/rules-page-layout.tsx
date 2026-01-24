import * as React from 'react';

import { DetailPanel } from '@/components/references';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { RulesPage, RulesTag } from '@/lib/data/rules/rules-content';
import { cn } from '@/lib/utils';

interface RulesPageLayoutProps {
  page: RulesPage;
}

function tagToneClasses(tone?: RulesTag['tone']) {
  switch (tone) {
    case 'success':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'warning':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    default:
      return 'border-border bg-muted/40 text-foreground';
  }
}

export function RulesPageLayout({ page }: RulesPageLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<
    RulesPage['sections'][number] | null
  >(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          {page.emoji} {page.title}
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
              className="group hover:border-primary/50 cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => setActiveSection(section)}
            >
              <div className={cn('h-1.5 bg-linear-to-r', page.gradient)} />
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="bg-muted rounded-lg p-2 text-2xl">
                    {section.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {section.summary}
                    </CardDescription>
                    <div className="text-muted-foreground mt-2 text-xs">
                      Click for deep dive
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {section.tags && section.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map(tag => (
                      <SmartTooltip key={tag.label} content={tag.description}>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', tagToneClasses(tag.tone))}
                        >
                          {tag.label}
                        </Badge>
                      </SmartTooltip>
                    ))}
                  </div>
                )}

                <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <DetailPanel
          isOpen={Boolean(activeSection)}
          onClose={() => setActiveSection(null)}
          title={
            activeSection
              ? `${activeSection.emoji} ${activeSection.title}`
              : 'Rule detail'
          }
        >
          {activeSection && (
            <div className="space-y-5">
              <p className="text-muted-foreground text-sm">
                {activeSection.summary}
              </p>

              {activeSection.tags && activeSection.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeSection.tags.map(tag => (
                    <SmartTooltip key={tag.label} content={tag.description}>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', tagToneClasses(tag.tone))}
                      >
                        {tag.label}
                      </Badge>
                    </SmartTooltip>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold">What it covers</h3>
                <ul className="text-muted-foreground mt-2 list-disc space-y-2 pl-5 text-sm">
                  {activeSection.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>

              {activeSection.details && activeSection.details.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">How it works</h3>
                  <ul className="text-muted-foreground mt-2 list-disc space-y-2 pl-5 text-sm">
                    {activeSection.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSection.mechanics &&
                activeSection.mechanics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold">Mechanics</h3>
                    <ul className="text-muted-foreground mt-2 list-disc space-y-2 pl-5 text-sm">
                      {activeSection.mechanics.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {activeSection.math && activeSection.math.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Math & thresholds</h3>
                  <ul className="text-muted-foreground mt-2 list-disc space-y-2 pl-5 text-sm">
                    {activeSection.math.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSection.examples && activeSection.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Example</h3>
                  <ul className="text-muted-foreground mt-2 list-disc space-y-2 pl-5 text-sm">
                    {activeSection.examples.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSection.tips && activeSection.tips.length > 0 && (
                <Alert className="border-emerald-500/30 bg-emerald-500/10">
                  <AlertTitle>🌿 Pro Tip</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc space-y-1 pl-5">
                      {activeSection.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {activeSection.cautions && activeSection.cautions.length > 0 && (
                <Alert className="border-amber-500/30 bg-amber-500/10">
                  <AlertTitle>⚠️ Heads Up</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc space-y-1 pl-5">
                      {activeSection.cautions.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DetailPanel>
      </div>
    </div>
  );
}
