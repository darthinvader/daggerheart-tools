import { createFileRoute } from '@tanstack/react-router';

import { RulesPageLayout } from '@/components/rules/rules-page-layout';
import { RULES_PAGES } from '@/lib/data/rules/rules-content';

export const Route = createFileRoute('/rules/core-mechanics')({
  component: CoreMechanicsRulesPage,
});

function CoreMechanicsRulesPage() {
  return <RulesPageLayout page={RULES_PAGES['core-mechanics']} />;
}
