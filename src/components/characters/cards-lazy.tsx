// React.lazy wrappers for heavy cards to reduce initial route weight
// Keep props identical to the original components
import * as React from 'react';

export const EquipmentCardLazy = React.lazy(() =>
  import('./equipment-card').then(m => ({ default: m.EquipmentCard }))
);
export const InventoryCardLazy = React.lazy(() =>
  import('./inventory-card').then(m => ({ default: m.InventoryCard }))
);
export const ClassCardLazy = React.lazy(() =>
  import('./class-card').then(m => ({ default: m.ClassCard }))
);
export const DomainsCardLazy = React.lazy(() =>
  import('./domains-card').then(m => ({ default: m.DomainsCard }))
);
