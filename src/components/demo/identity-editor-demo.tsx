import { useState } from 'react';

import {
  IdentityForm,
  type IdentityFormValues,
} from '@/components/identity-editor';
import { Button } from '@/components/ui/button';
import { DEFAULT_IDENTITY_FORM_VALUES } from '@/lib/schemas/character-state';

const SAMPLE_IDENTITY: IdentityFormValues = {
  name: 'Thorne Blackwood',
  pronouns: 'they/them',
  calling: 'The Wandering Blade',
  description:
    'A mysterious figure who travels the realm seeking redemption for past mistakes.',
  background:
    "Once a soldier in the King's Guard, Thorne left their post after witnessing atrocities they could not condone. Now they wander the land, helping those in need while staying one step ahead of their former comrades.",
  descriptionDetails: {
    eyes: 'Deep amber with flecks of gold',
    hair: 'Raven black, usually tied back',
    skin: 'Weathered olive complexion with old scars',
    body: 'Lean and athletic, built for speed',
    clothing: 'Worn leather armor under a dark traveling cloak',
    mannerisms: 'Speaks softly, always watching exits',
    other: 'A faded tattoo of crossed swords on their left forearm',
  },
  connections: [
    {
      prompt: 'Who saved your life?',
      answer:
        'A healer named Mira found me bleeding out after a battle and nursed me back to health.',
    },
    {
      prompt: 'Who do you owe a debt to?',
      answer:
        'The merchant Giles helped me escape the city when the Guard was hunting me.',
    },
  ],
};

export function IdentityEditorDemo() {
  const [mode, setMode] = useState<'empty' | 'prefilled'>('empty');
  const [lastSubmitted, setLastSubmitted] = useState<IdentityFormValues | null>(
    null
  );

  const handleSubmit = (values: IdentityFormValues) => {
    setLastSubmitted(values);
  };

  const handleCancel = () => {
    setLastSubmitted(null);
  };

  const defaultValues =
    mode === 'prefilled' ? SAMPLE_IDENTITY : DEFAULT_IDENTITY_FORM_VALUES;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Identity Editor</h2>
        <p className="text-muted-foreground mb-4">
          A comprehensive form for editing character identity including basic
          info, physical appearance, background, and connections.
        </p>

        <div className="mb-4 flex gap-2">
          <Button
            variant={mode === 'empty' ? 'default' : 'outline'}
            onClick={() => setMode('empty')}
          >
            Empty Form
          </Button>
          <Button
            variant={mode === 'prefilled' ? 'default' : 'outline'}
            onClick={() => setMode('prefilled')}
          >
            Pre-filled Example
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-lg border p-4">
        <IdentityForm
          key={mode}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </section>

      {lastSubmitted && (
        <section>
          <h3 className="mb-2 text-lg font-semibold">Last Submitted Values</h3>
          <pre className="bg-muted max-h-75 overflow-auto rounded-lg p-4 text-sm">
            {JSON.stringify(lastSubmitted, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
