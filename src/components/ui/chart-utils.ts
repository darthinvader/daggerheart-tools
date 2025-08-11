// Minimal structural types to avoid `any` while staying generic
import type * as React from 'react';

type Indexable = Record<string, unknown>;
type PayloadWithInner = { payload?: Indexable } & Indexable;

// Minimal shape of an item in the chart config
export type ChartConfigItemShape = {
  label?: React.ReactNode;
  icon?: React.ComponentType;
} & Indexable;

// Helper to extract item config from a Recharts payload, given a config map.
export function getPayloadConfigFromPayload<
  TItem extends ChartConfigItemShape,
  TItemKey extends string,
>(
  config: Record<string, TItem>,
  payload: unknown,
  key: TItemKey
): TItem | undefined {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const p = payload as PayloadWithInner;
  const inner = (
    typeof p.payload === 'object' && p.payload !== null
      ? (p.payload as Indexable)
      : undefined
  ) as Indexable | undefined;

  let configLabelKey: string = key;

  if (typeof p[key] === 'string') {
    configLabelKey = p[key] as string;
  } else if (inner && typeof inner[key] === 'string') {
    configLabelKey = inner[key] as string;
  }

  return (
    configLabelKey in config
      ? (config as Record<string, TItem>)[configLabelKey]
      : (config as Record<string, TItem>)[key]
  ) as TItem | undefined;
}
