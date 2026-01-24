import { createFileRoute } from '@tanstack/react-router';

import { RulesPageLayout } from '@/components/rules/rules-page-layout';
import { RULES_PAGES } from '@/lib/data/rules/rules-content';

export const Route = createFileRoute('/rules/campaign-frames')({
  component: CampaignFramesRulesPage,
});

function CampaignFramesRulesPage() {
  return <RulesPageLayout page={RULES_PAGES['campaign-frames']} />;
}
