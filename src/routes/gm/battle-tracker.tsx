import { createFileRoute } from '@tanstack/react-router';

import { BattleTrackerV2 } from '@/components/battle-tracker/battle-tracker-v2';

export const Route = createFileRoute('/gm/battle-tracker')({
  component: BattleTrackerV2,
});
