import { useContext } from 'react';

import { AnnounceContext } from './aria-live-announcer';
import type { AnnounceFn } from './aria-live-announcer';

export function useAnnounce(): AnnounceFn {
  const announce = useContext(AnnounceContext);
  if (!announce) {
    throw new Error('useAnnounce must be used within <AriaLiveAnnouncer>');
  }
  return announce;
}
