import { AncestryDisplay } from '@/components/ancestry-selector';
import { CommunityDisplay } from '@/components/community-selector';
import { IdentityDisplay } from '@/components/identity-editor';

import type { TabProps } from '../demo-types';

export function IdentityTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-4 pt-3 sm:space-y-6 sm:pt-4">
      <div className="animate-fade-up">
        <IdentityDisplay
          identity={state.identity}
          onChange={handlers.setIdentity}
        />
      </div>
      <div className="dagger-divider" />
      <div className="animate-fade-up stagger-1 grid gap-4 sm:gap-6 lg:grid-cols-2">
        <AncestryDisplay
          selection={state.ancestry}
          onChange={handlers.setAncestry}
        />
        <CommunityDisplay
          selection={state.community}
          onChange={handlers.setCommunity}
        />
      </div>
    </div>
  );
}
