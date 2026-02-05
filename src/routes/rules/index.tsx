import { createFileRoute, Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RULES_INDEX_CARDS, RULES_PAGES } from '@/lib/data/rules/rules-content';
import { RulesSectionIcons, Scroll } from '@/lib/icons';

export const Route = createFileRoute('/rules/')({
  component: RulesIndexPage,
});

function RulesIndexPage() {
  const [search, setSearch] = React.useState('');

  const filteredCards = React.useMemo(() => {
    if (!search.trim()) return RULES_INDEX_CARDS;
    const query = search.toLowerCase();
    return RULES_INDEX_CARDS.filter(card => {
      const pageKey = card.to.replace('/rules/', '');
      const page = RULES_PAGES[pageKey];
      const sectionText = page
        ? page.sections
            .map(s => `${s.title} ${s.summary} ${s.bullets.join(' ')}`)
            .join(' ')
        : '';
      return (
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        sectionText.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          <Scroll className="mr-2 inline-block size-8" />
          Daggerheart Rules Guide
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          Quick, friendly rule breakdowns for players and GMs. Pick a section to
          dive in.
        </p>
        <div className="relative mx-auto mt-6 max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search rules... (e.g. death, armor, hope)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map(card => (
          <Link key={card.to} to={card.to} className="group">
            <Card className="group-hover:border-primary/50 h-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl">
              <div className={`h-2 bg-gradient-to-r ${card.gradient}`} />
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 rounded-xl p-3 ${card.tint} transition-transform group-hover:scale-110`}
                  >
                    {(() => {
                      const IconComp = RulesSectionIcons[card.iconKey];
                      return IconComp ? (
                        <IconComp className={`size-6 ${card.accent}`} />
                      ) : null;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="group-hover:text-primary text-xl transition-colors">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {card.description}
                    </CardDescription>
                    {(() => {
                      const pageKey = card.to.replace('/rules/', '');
                      const page = RULES_PAGES[pageKey];
                      if (!page) return null;
                      return (
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs font-medium"
                        >
                          {page.sections.length} section
                          {page.sections.length !== 1 ? 's' : ''}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <p className="text-muted-foreground mt-8 text-center text-sm">
          No rules matched &quot;{search}&quot;. Try a different keyword.
        </p>
      )}
    </div>
  );
}
