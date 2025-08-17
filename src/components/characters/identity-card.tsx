import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
// No header action; title is tappable via onTitleClick
import { Card, CardContent } from '@/components/ui/card';

export type IdentitySummary = {
  name: string;
  pronouns: string;
  description?: string;
  calling?: string;
  connections?: { prompt: string; answer: string }[];
};

export type IdentityCardProps = {
  identity: IdentitySummary;
  onEdit: () => void;
};

export function IdentityCard({ identity, onEdit }: IdentityCardProps) {
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  return (
    <Card>
      <CharacterCardHeader
        title="Identity"
        subtitle="Tap title or section to edit"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={onEdit}
      />
      <CardContent
        role="button"
        tabIndex={0}
        onClick={e => {
          if (isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className="hover:bg-accent/30 focus-visible:ring-ring cursor-pointer space-y-3 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-muted-foreground text-sm">
            {identity.name ? (
              <div className="space-y-0.5">
                <div className="text-foreground font-medium">
                  {identity.name}{' '}
                  <span className="text-muted-foreground">
                    ({identity.pronouns})
                  </span>
                </div>
                {identity.calling && (
                  <div className="text-xs">Calling: {identity.calling}</div>
                )}
                {identity.description && (
                  <div className="text-xs">{identity.description}</div>
                )}
              </div>
            ) : (
              <span>Name and pronouns…</span>
            )}
          </div>
        </div>
        {identity.connections && identity.connections.length > 0 && (
          <div className="rounded-md border p-2">
            <div className="text-xs font-medium">Connections</div>
            <ul className="mt-1 space-y-1">
              {identity.connections.map((c, i) => (
                <li key={i} className="text-muted-foreground text-xs">
                  <span className="text-foreground">{c.prompt}:</span>{' '}
                  {c.answer}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
