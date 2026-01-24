import { createFileRoute } from '@tanstack/react-router';

import { RulesPageLayout } from '@/components/rules/rules-page-layout';
import { RULES_PAGES } from '@/lib/data/rules/rules-content';

export const Route = createFileRoute('/rules/gm-guide')({
  component: GmGuideRulesPage,
});

function GmGuideRulesPage() {
  return <RulesPageLayout page={RULES_PAGES['gm-guide']} />;
}
