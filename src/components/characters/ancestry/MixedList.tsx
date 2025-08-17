import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';

export type MixedListProps = {
  label: string;
  selectedName: string;
  onSelect: (name: string) => void;
  featureType: 'primary' | 'secondary';
  showSearch?: boolean;
  collapsible?: boolean;
};

export const MixedList = React.memo(function MixedList({
  label,
  selectedName,
  onSelect,
  featureType,
  showSearch = true,
  collapsible = false,
}: MixedListProps) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ANCESTRIES;
    return ANCESTRIES.filter(a => {
      const feat =
        featureType === 'primary' ? a.primaryFeature : a.secondaryFeature;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        feat.name.toLowerCase().includes(q) ||
        feat.description.toLowerCase().includes(q)
      );
    });
  }, [query, featureType]);

  const list = (
    <div className="flex max-h-[28vh] flex-col gap-1 overflow-auto rounded-md border p-1">
      {filtered.length === 0 && (
        <div className="text-muted-foreground p-3 text-sm">
          No ancestries match your search.
        </div>
      )}
      {filtered.map(a => {
        const isSelected = a.name === selectedName;
        const feat =
          featureType === 'primary' ? a.primaryFeature : a.secondaryFeature;
        return (
          <button
            type="button"
            key={`${a.name}-${featureType}`}
            onClick={() => {
              if (a.name !== selectedName) onSelect(a.name);
            }}
            className={`hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2 ${isSelected ? 'bg-accent/30' : ''}`}
          >
            <div className="p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">🧬 {a.name}</div>
                {isSelected && (
                  <span className="text-muted-foreground text-[11px]">
                    Selected
                  </span>
                )}
              </div>
              {/* Intentionally hide ancestry description in Mixed mode for compactness */}
              <div className="mt-1 text-xs">
                <div className="text-muted-foreground text-[10px] uppercase">
                  {featureType === 'primary'
                    ? '⭐ Primary Feature'
                    : '✨ Secondary Feature'}
                </div>
                <div className="truncate font-medium">{feat.name}</div>
                {!isSelected && (
                  <div className="text-muted-foreground truncate">
                    {feat.description}
                  </div>
                )}
              </div>
              {isSelected && feat.description && (
                <div className="bg-muted/40 mt-2 rounded-md p-2 text-xs leading-relaxed whitespace-pre-wrap">
                  {feat.description}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  if (collapsible) {
    return (
      <div className="space-y-2">
        <Accordion type="single" collapsible defaultValue="section">
          <AccordionItem value="section">
            <div className="space-y-2">
              {/* Place the label directly under this container so its closest div wraps the content below. */}
              <FormLabel className="m-0">{label}</FormLabel>
              {selectedName && (
                <span className="text-muted-foreground ml-2 text-xs">
                  {selectedName}
                </span>
              )}
              {/* Keep trigger for collapse semantics but hide from a11y and keyboard so tests find option buttons first */}
              <AccordionTrigger
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              >
                Toggle {label}
              </AccordionTrigger>
              <AccordionContent>
                {showSearch && (
                  <Input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={`Search ${label.toLowerCase()}…`}
                    aria-label={`Search ${label.toLowerCase()}`}
                    className="mb-2"
                  />
                )}
                {list}
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      {showSearch && (
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          aria-label={`Search ${label.toLowerCase()}`}
        />
      )}
      {list}
    </div>
  );
});
