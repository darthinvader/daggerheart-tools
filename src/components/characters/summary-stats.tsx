import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type SummaryStatsProps = {
  id: string;
  identity: {
    name: string;
    pronouns: string;
    ancestry: string;
    community: string;
  };
  resources: {
    hp: { current: number; max: number };
    stress: { current: number; max: number };
    evasion: number;
    hope: number;
    proficiency: number;
  };
};

export function SummaryStats({ id, identity, resources }: SummaryStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-foreground text-base font-semibold">
            {identity.name || 'Unnamed Character'}{' '}
            {identity.pronouns ? (
              <span className="text-muted-foreground text-sm font-normal">
                ({identity.pronouns})
              </span>
            ) : null}
          </div>
          <div className="text-muted-foreground text-sm">
            {identity.ancestry} · {identity.community}
          </div>
          <div className="text-muted-foreground text-xs">
            HP {resources.hp.current}/{resources.hp.max} · Stress{' '}
            {resources.stress.current}/{resources.stress.max} · Evasion{' '}
            {resources.evasion} · Hope {resources.hope} · Prof{' '}
            {resources.proficiency}{' '}
            <a
              href="#resources"
              className="text-primary ml-1 underline"
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById('resources');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Edit
            </a>
          </div>
          <div className="text-muted-foreground text-xs opacity-70">
            id: {id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
