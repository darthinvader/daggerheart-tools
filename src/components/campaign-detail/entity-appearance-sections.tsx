import { Calendar, Map, Scroll, Target } from 'lucide-react';
/**
 * Entity Appearance Sections
 *
 * Reusable read-only display components for session and quest appearances
 * in campaign entity cards (NPC, Location, Organization, Quest).
 */
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { SessionNote } from '@/lib/schemas/campaign';

// =====================================================================================
// Types
// =====================================================================================

interface SessionAppearance {
  sessionId: string;
  sessionNumber?: number;
  sessionTitle?: string;
  role?: string;
  actionsTaken?: string;
  locationIds?: string[];
  questIds?: string[];
}

interface QuestAppearance {
  questId: string;
  questTitle?: string;
  role?: string;
  actionsTaken?: string;
  locationIds?: string[];
  sessionIds?: string[];
}

interface Quest {
  id: string;
  title?: string;
}

// =====================================================================================
// SessionAppearancesSection
// =====================================================================================

interface SessionAppearancesSectionProps {
  appearances: SessionAppearance[];
  getLocationName: (id: string) => string;
  quests: Quest[];
}

export function SessionAppearancesSection({
  appearances,
  getLocationName,
  quests,
}: SessionAppearancesSectionProps) {
  if (appearances.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Calendar className="h-3 w-3 text-blue-500" />
        Session Appearances
      </Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {appearances.map(appearance => (
          <SessionAppearanceCard
            key={appearance.sessionId}
            appearance={appearance}
            getLocationName={getLocationName}
            quests={quests}
          />
        ))}
      </div>
    </div>
  );
}

interface SessionAppearanceCardProps {
  appearance: SessionAppearance;
  getLocationName: (id: string) => string;
  quests: Quest[];
}

function SessionAppearanceCard({
  appearance,
  getLocationName,
  quests,
}: SessionAppearanceCardProps) {
  const hasLinkedEntities =
    (appearance.locationIds ?? []).length > 0 ||
    (appearance.questIds ?? []).length > 0;

  return (
    <Card className="bg-muted/20">
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 flex-shrink-0 text-blue-500" />
          <div className="min-w-0 flex-1 truncate text-sm font-medium">
            S{appearance.sessionNumber}
            {appearance.sessionTitle && `: ${appearance.sessionTitle}`}
          </div>
          {appearance.role && (
            <Badge
              variant="secondary"
              className="flex-shrink-0 px-1 py-0 text-[10px]"
            >
              {appearance.role}
            </Badge>
          )}
        </div>
        {appearance.actionsTaken && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
            {appearance.actionsTaken}
          </p>
        )}
        {hasLinkedEntities && (
          <div className="mt-1 flex flex-wrap gap-1">
            {(appearance.locationIds ?? []).map(locId => (
              <Badge
                key={locId}
                variant="outline"
                className="gap-0.5 px-1 py-0 text-[10px]"
              >
                <Map className="h-2 w-2" />
                {getLocationName(locId)}
              </Badge>
            ))}
            {(appearance.questIds ?? []).map(questId => {
              const quest = quests.find(q => q.id === questId);
              return (
                <Badge
                  key={questId}
                  variant="outline"
                  className="gap-0.5 px-1 py-0 text-[10px]"
                >
                  <Scroll className="h-2 w-2" />
                  {quest?.title ?? 'Unknown'}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// QuestAppearancesSection
// =====================================================================================

interface QuestAppearancesSectionProps {
  appearances: QuestAppearance[];
  getLocationName: (id: string) => string;
  sessions: SessionNote[];
}

export function QuestAppearancesSection({
  appearances,
  getLocationName,
  sessions,
}: QuestAppearancesSectionProps) {
  if (appearances.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Target className="h-3 w-3 text-amber-500" />
        Quest Appearances
      </Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {appearances.map(appearance => (
          <QuestAppearanceCard
            key={appearance.questId}
            appearance={appearance}
            getLocationName={getLocationName}
            sessions={sessions}
          />
        ))}
      </div>
    </div>
  );
}

interface QuestAppearanceCardProps {
  appearance: QuestAppearance;
  getLocationName: (id: string) => string;
  sessions: SessionNote[];
}

function QuestAppearanceCard({
  appearance,
  getLocationName,
  sessions,
}: QuestAppearanceCardProps) {
  const hasLinkedEntities =
    (appearance.locationIds ?? []).length > 0 ||
    (appearance.sessionIds ?? []).length > 0;

  return (
    <Card className="bg-muted/20">
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <Target className="h-3 w-3 flex-shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1 truncate text-sm font-medium">
            {appearance.questTitle ?? 'Unknown Quest'}
          </div>
          {appearance.role && (
            <Badge
              variant="secondary"
              className="flex-shrink-0 px-1 py-0 text-[10px]"
            >
              {appearance.role}
            </Badge>
          )}
        </div>
        {appearance.actionsTaken && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
            {appearance.actionsTaken}
          </p>
        )}
        {hasLinkedEntities && (
          <div className="mt-1 flex flex-wrap gap-1">
            {(appearance.locationIds ?? []).map(locId => (
              <Badge
                key={locId}
                variant="outline"
                className="gap-0.5 px-1 py-0 text-[10px]"
              >
                <Map className="h-2 w-2" />
                {getLocationName(locId)}
              </Badge>
            ))}
            {(appearance.sessionIds ?? []).map((sessionId: string) => {
              const foundSession = sessions.find(s => s.id === sessionId);
              return (
                <Badge
                  key={sessionId}
                  variant="outline"
                  className="gap-0.5 px-1 py-0 text-[10px]"
                >
                  <Calendar className="h-2 w-2" />S
                  {foundSession?.sessionNumber ?? '?'}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
