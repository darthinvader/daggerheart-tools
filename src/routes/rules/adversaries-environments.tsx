import { createFileRoute } from '@tanstack/react-router';

import { RulesPageLayout } from '@/components/rules/rules-page-layout';
import { RULES_PAGES } from '@/lib/data/rules/rules-content';

export const Route = createFileRoute('/rules/adversaries-environments')({
  component: AdversariesEnvironmentsRulesPage,
});

function AdversariesEnvironmentsRulesPage() {
  return <RulesPageLayout page={RULES_PAGES['adversaries-environments']} />;
}
