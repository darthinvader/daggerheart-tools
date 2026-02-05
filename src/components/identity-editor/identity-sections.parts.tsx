import {
  Eye,
  Handshake,
  MessageSquare,
  Pencil,
  Scissors,
  Scroll,
  Shirt,
  Sparkles,
  Star,
  Theater,
  User,
  UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { IdentityFormValues } from '@/lib/schemas/character-state';

export function IdentityHeader({ identity }: { identity: IdentityFormValues }) {
  const hasHeader =
    identity.name?.trim() || identity.pronouns || identity.calling;

  if (!hasHeader) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <h4 className="text-2xl font-bold">{identity.name || 'Unnamed'}</h4>
      {identity.pronouns && (
        <SmartTooltip content="Pronouns">
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="size-3" /> {identity.pronouns}
          </Badge>
        </SmartTooltip>
      )}
      {identity.calling && (
        <SmartTooltip content="Calling - Your character's title or epithet">
          <Badge
            variant="outline"
            className="gap-1 border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
          >
            <Star className="size-3" /> {identity.calling}
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}

export function DescriptionSection({ description }: { description?: string }) {
  if (!description?.trim()) return null;

  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Pencil className="size-3" /> Description
        </h5>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </>
  );
}

export function AppearanceSection({
  details,
}: {
  details: IdentityFormValues['descriptionDetails'];
}) {
  const items: {
    key: string;
    label: string;
    icon: ReactNode;
    value: string | undefined;
  }[] = [
    {
      key: 'eyes',
      label: 'Eyes',
      icon: <Eye className="size-3" />,
      value: details.eyes,
    },
    {
      key: 'hair',
      label: 'Hair',
      icon: <Scissors className="size-3" />,
      value: details.hair,
    },
    {
      key: 'skin',
      label: 'Skin',
      icon: <UserRound className="size-3" />,
      value: details.skin,
    },
    {
      key: 'body',
      label: 'Body',
      icon: <User className="size-3" />,
      value: details.body,
    },
    {
      key: 'clothing',
      label: 'Clothing',
      icon: <Shirt className="size-3" />,
      value: details.clothing,
    },
    {
      key: 'mannerisms',
      label: 'Mannerisms',
      icon: <MessageSquare className="size-3" />,
      value: details.mannerisms,
    },
    {
      key: 'other',
      label: 'Other',
      icon: <Sparkles className="size-3" />,
      value: details.other,
    },
  ].filter(item => item.value);

  if (items.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Theater className="size-3" /> Appearance
        </h5>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div
              key={item.key}
              className="rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 p-3 dark:from-slate-900 dark:to-slate-800"
            >
              <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs tracking-wide uppercase">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <p className="text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function BackgroundSection({ background }: { background?: string }) {
  if (!background?.trim()) return null;

  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Scroll className="size-3" /> Background
        </h5>
        <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {background}
          </p>
        </div>
      </div>
    </>
  );
}

interface Connection {
  prompt: string;
  answer: string;
  withPlayer?: { id?: string; name?: string };
}

function ConnectionCard({ connection }: { connection: Connection }) {
  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {connection.prompt}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">{connection.answer}</p>
      {connection.withPlayer?.name && (
        <Badge variant="outline" className="mt-2 gap-1 text-xs">
          <Handshake className="size-3" /> With: {connection.withPlayer.name}
        </Badge>
      )}
    </div>
  );
}

export function ConnectionsSection({
  connections,
}: {
  connections?: Connection[];
}) {
  if (!connections?.length) return null;

  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Handshake className="size-3" /> Connections
        </h5>
        <div className="grid gap-3 sm:grid-cols-2">
          {connections.map((connection, index) => (
            <ConnectionCard key={index} connection={connection} />
          ))}
        </div>
      </div>
    </>
  );
}
