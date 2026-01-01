/**
 * Demo tabs - Re-exports from individual tab files
 * @see ./tabs/ for individual tab implementations
 */

// Re-export types
export type { DemoHandlers, DemoState, TabProps } from './demo-types';

// Re-export tabs
export {
  CombatTab,
  IdentityTab,
  ItemsTab,
  OverviewTab,
  QuickViewTab,
  SessionTab,
} from './tabs';
