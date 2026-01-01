import { useState } from 'react';

import {
  type AncestrySelection,
  AncestrySelector,
  FeatureCard,
} from '@/components/ancestry-selector';
import { Separator } from '@/components/ui/separator';
import { getAncestryByName } from '@/lib/schemas/identity';

function StandardSelectionDetails({
  selection,
}: {
  selection: Extract<AncestrySelection, { mode: 'standard' }>;
}) {
  const { ancestry } = selection;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">{ancestry.name}</h4>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1">
          📏 <strong>Height:</strong> {ancestry.heightRange}
        </span>
        <span className="flex items-center gap-1">
          🧬 <strong>Lifespan:</strong> {ancestry.lifespan}
        </span>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          📜 Description
        </h5>
        <p className="text-muted-foreground text-sm">{ancestry.description}</p>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          ⚔️ Features
        </h5>
        <div className="grid gap-3 md:grid-cols-2">
          <FeatureCard feature={ancestry.primaryFeature} variant="primary" />
          <FeatureCard
            feature={ancestry.secondaryFeature}
            variant="secondary"
          />
        </div>
      </div>

      {ancestry.physicalCharacteristics.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="mb-2 flex items-center gap-2 font-semibold">
              🎭 Physical Characteristics
            </h5>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              {ancestry.physicalCharacteristics.map(char => (
                <li key={char}>{char}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function MixedSelectionDetails({
  selection,
}: {
  selection: Extract<AncestrySelection, { mode: 'mixed' }>;
}) {
  const { mixedAncestry } = selection;
  const parentAncestries = mixedAncestry.parentAncestries ?? [];
  const primaryParent = parentAncestries[0]
    ? getAncestryByName(parentAncestries[0])
    : undefined;
  const secondaryParent = parentAncestries[1]
    ? getAncestryByName(parentAncestries[1])
    : undefined;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">{mixedAncestry.name}</h4>
      {parentAncestries.length > 0 && (
        <p className="text-muted-foreground text-sm">
          🔀 Parent Ancestries: {parentAncestries.join(' & ')}
        </p>
      )}

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          👥 Parent Details
        </h5>
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {primaryParent && (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
              <h6 className="font-medium text-amber-600 dark:text-amber-400">
                From {primaryParent.name}
              </h6>
              <div className="space-y-1 text-sm">
                <p>
                  📏 <strong>Height:</strong> {primaryParent.heightRange}
                </p>
                <p>
                  🧬 <strong>Lifespan:</strong> {primaryParent.lifespan}
                </p>
              </div>
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {primaryParent.description}
              </p>
            </div>
          )}

          <Separator className="md:hidden" />

          {secondaryParent && (
            <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
              <h6 className="font-medium text-blue-600 dark:text-blue-400">
                From {secondaryParent.name}
              </h6>
              <div className="space-y-1 text-sm">
                <p>
                  📏 <strong>Height:</strong> {secondaryParent.heightRange}
                </p>
                <p>
                  🧬 <strong>Lifespan:</strong> {secondaryParent.lifespan}
                </p>
              </div>
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {secondaryParent.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          ⚔️ Features
        </h5>
        <div className="grid gap-3 md:grid-cols-2">
          <FeatureCard
            feature={mixedAncestry.primaryFeature}
            variant="primary"
          />
          <FeatureCard
            feature={mixedAncestry.secondaryFeature}
            variant="secondary"
          />
        </div>
      </div>

      {((primaryParent && primaryParent.physicalCharacteristics.length > 0) ||
        (secondaryParent &&
          secondaryParent.physicalCharacteristics.length > 0)) && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              🎭 Physical Characteristics
            </h5>
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {primaryParent &&
                primaryParent.physicalCharacteristics.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                    <h6 className="mb-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                      {primaryParent.name}
                    </h6>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-xs">
                      {primaryParent.physicalCharacteristics.map(char => (
                        <li key={char}>{char}</li>
                      ))}
                    </ul>
                  </div>
                )}

              <Separator className="md:hidden" />

              {secondaryParent &&
                secondaryParent.physicalCharacteristics.length > 0 && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                    <h6 className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {secondaryParent.name}
                    </h6>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-xs">
                      {secondaryParent.physicalCharacteristics.map(char => (
                        <li key={char}>{char}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function HomebrewSelectionDetails({
  selection,
}: {
  selection: Extract<AncestrySelection, { mode: 'homebrew' }>;
}) {
  const { homebrew } = selection;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">
        {homebrew.name || '(Unnamed Homebrew)'}
      </h4>

      <div className="flex flex-wrap gap-4 text-sm">
        {homebrew.heightRange && (
          <span className="flex items-center gap-1">
            📏 <strong>Height:</strong> {homebrew.heightRange}
          </span>
        )}
        {homebrew.lifespan && (
          <span className="flex items-center gap-1">
            🧬 <strong>Lifespan:</strong> {homebrew.lifespan}
          </span>
        )}
      </div>

      {homebrew.description && (
        <>
          <Separator />
          <p className="text-muted-foreground">{homebrew.description}</p>
        </>
      )}

      {(homebrew.primaryFeature.name || homebrew.secondaryFeature.name) && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              ⚔️ Features
            </h5>
            <div className="grid gap-3 md:grid-cols-2">
              {homebrew.primaryFeature.name && (
                <FeatureCard
                  feature={homebrew.primaryFeature}
                  variant="primary"
                />
              )}
              {homebrew.secondaryFeature.name && (
                <FeatureCard
                  feature={homebrew.secondaryFeature}
                  variant="secondary"
                />
              )}
            </div>
          </div>
        </>
      )}

      {homebrew.physicalCharacteristics.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              🎭 Physical Characteristics
            </h5>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              {homebrew.physicalCharacteristics.map(char => (
                <li key={char}>{char}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export function AncestrySelectorDemo() {
  const [selection, setSelection] = useState<AncestrySelection>(null);

  const getModeLabel = (): string => {
    if (!selection) return '';
    switch (selection.mode) {
      case 'standard':
        return '📖 Standard Ancestry';
      case 'mixed':
        return '🔀 Mixed Ancestry';
      case 'homebrew':
        return '🛠️ Homebrew Ancestry';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-4">
        <h3 className="mb-4 font-semibold">Current Selection</h3>

        {!selection ? (
          <p className="text-muted-foreground">No ancestry selected</p>
        ) : (
          <div className="space-y-4">
            <p className="text-primary text-sm font-medium">{getModeLabel()}</p>

            {selection.mode === 'standard' && (
              <StandardSelectionDetails selection={selection} />
            )}
            {selection.mode === 'mixed' && (
              <MixedSelectionDetails selection={selection} />
            )}
            {selection.mode === 'homebrew' && (
              <HomebrewSelectionDetails selection={selection} />
            )}
          </div>
        )}
      </div>

      <AncestrySelector value={selection} onChange={setSelection} />
    </div>
  );
}
