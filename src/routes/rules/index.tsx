import { createFileRoute, Link } from '@tanstack/react-router';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RULES_INDEX_CARDS } from '@/lib/data/rules/rules-content';

export const Route = createFileRoute('/rules/')({
  component: RulesIndexPage,
});

function RulesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          📜 Daggerheart Rules Guide
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          Quick, friendly rule breakdowns for players and GMs. Pick a section to
          dive in.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {RULES_INDEX_CARDS.map(card => (
          <Link key={card.to} to={card.to} className="group">
            <Card className="group-hover:border-primary/50 h-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl">
              <div className={`h-2 bg-linear-to-r ${card.gradient}`} />
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 rounded-xl p-3 ${card.tint} transition-transform group-hover:scale-110`}
                  >
                    <span className={`text-2xl ${card.accent}`}>
                      {card.emoji}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="group-hover:text-primary text-xl transition-colors">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
