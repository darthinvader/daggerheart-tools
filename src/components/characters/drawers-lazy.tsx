import * as React from 'react';

export const IdentityDrawerLazy = React.lazy(() =>
  import('@/components/characters/identity-drawer').then(m => ({
    default: m.IdentityDrawer,
  }))
);
export const AncestryDrawerLazy = React.lazy(() =>
  import('@/components/characters/ancestry-drawer').then(m => ({
    default: m.AncestryDrawer,
  }))
);
export const CommunityDrawerLazy = React.lazy(() =>
  import('@/components/characters/community-drawer').then(m => ({
    default: m.CommunityDrawer,
  }))
);
export const ClassDrawerLazy = React.lazy(() =>
  import('@/components/characters/class-drawer').then(m => ({
    default: m.ClassDrawer,
  }))
);
export const DomainsDrawerLazy = React.lazy(() =>
  import('@/components/characters/domains-drawer').then(m => ({
    default: m.DomainsDrawer,
  }))
);
export const EquipmentDrawerLazy = React.lazy(() =>
  import('@/components/characters/equipment-drawer').then(m => ({
    default: m.EquipmentDrawer,
  }))
);
export const InventoryDrawerLazy = React.lazy(() =>
  import('@/components/characters/inventory-drawer').then(m => ({
    default: m.InventoryDrawer,
  }))
);
export const LevelUpDrawerLazy = React.lazy(() =>
  import('@/components/characters/leveling/level-up-drawer').then(m => ({
    default: m.LevelUpDrawer,
  }))
);
