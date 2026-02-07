import {
  useMutation,
  type UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2, LogIn, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useAuth } from '@/components/providers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchCampaignInvitePreview,
  joinCampaignByInviteCode,
} from '@/features/campaigns/campaign-storage';
import { useCharactersQuery } from '@/features/characters/use-characters-query';
import type { CharacterSummary } from '@/lib/api/characters';

export const Route = createFileRoute('/campaigns/join')({
  component: JoinCampaignPage,
  errorComponent: ({ error }) => <RouteErrorFallback error={error} />,
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === 'string' ? search.code : undefined,
  }),
});

function useJoinCampaignState(code: string | undefined) {
  const { isAuthenticated, user } = useAuth();
  const [inviteCode, setInviteCode] = useState(code ?? '');
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [joinedCampaignId, setJoinedCampaignId] = useState<string | null>(null);

  const playerName = useMemo(() => {
    const metadata = user?.user_metadata as {
      full_name?: string;
      name?: string;
    };
    return (
      metadata?.full_name ??
      metadata?.name ??
      user?.email?.split('@')[0] ??
      'Player'
    );
  }, [user]);

  const { data: invitePreview, isLoading: isInviteLoading } = useQuery({
    queryKey: ['campaign-invite-preview', inviteCode],
    queryFn: () => fetchCampaignInvitePreview(inviteCode),
    enabled: isAuthenticated && inviteCode.trim().length > 0,
    retry: false,
  });

  const { data: characters, isLoading: isCharactersLoading } =
    useCharactersQuery();
  const activeCharacters = (characters ?? []).filter(
    character => !character.deletedAt
  );

  const joinMutation = useMutation({
    mutationFn: async () => {
      const selectedCharacter = activeCharacters.find(
        character => character.id === selectedCharacterId
      );

      return joinCampaignByInviteCode({
        inviteCode: inviteCode.trim(),
        playerName,
        characterId: selectedCharacter?.id ?? null,
        characterName: selectedCharacter?.name ?? null,
      });
    },
    onSuccess: campaignId => {
      setJoinedCampaignId(campaignId);
    },
  });

  const inviteIsValid = Boolean(invitePreview);
  const canJoin =
    isAuthenticated &&
    inviteIsValid &&
    Boolean(selectedCharacterId) &&
    !joinMutation.isPending;

  return {
    isAuthenticated,
    inviteCode,
    setInviteCode,
    invitePreview,
    inviteIsValid,
    isInviteLoading,
    activeCharacters,
    isCharactersLoading,
    selectedCharacterId,
    setSelectedCharacterId,
    joinMutation,
    canJoin,
    joinedCampaignId,
  };
}

function JoinCampaignAuthCard() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-xl">
            <Users className="text-primary size-7" />
          </div>
          <CardTitle className="text-2xl">Join a Campaign</CardTitle>
          <CardDescription className="text-base">
            Sign in to accept an invite and attach one of your characters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link to="/login">
              <LogIn className="mr-2 size-5" />
              Sign in to continue
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InviteDetailsCard({
  inviteCode,
  onInviteCodeChange,
  invitePreview,
  isInviteLoading,
  inviteIsValid,
}: {
  inviteCode: string;
  onInviteCodeChange: (value: string) => void;
  invitePreview: Awaited<ReturnType<typeof fetchCampaignInvitePreview>>;
  isInviteLoading: boolean;
  inviteIsValid: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Invite Details</CardTitle>
        <CardDescription>
          Use the 12-character code your GM shared with you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invite-code" className="text-xs">
            Invite Code
          </Label>
          <Input
            id="invite-code"
            value={inviteCode}
            onChange={event =>
              onInviteCodeChange(event.target.value.toUpperCase())
            }
            placeholder="ABCDEFGHJKLM"
            maxLength={12}
          />
        </div>

        {inviteCode.trim().length > 0 && !isInviteLoading && !inviteIsValid && (
          <Alert variant="destructive">
            <AlertTitle>Invalid invite code</AlertTitle>
            <AlertDescription>
              Double-check the code or ask your GM for a fresh invite.
            </AlertDescription>
          </Alert>
        )}

        {inviteIsValid && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Campaign found</AlertTitle>
            <AlertDescription>
              {invitePreview?.name} ({invitePreview?.status})
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function CharacterSelectCard({
  activeCharacters,
  isCharactersLoading,
  selectedCharacterId,
  onSelectCharacter,
  joinMutation,
  canJoin,
  joinedCampaignId,
}: {
  activeCharacters: CharacterSummary[];
  isCharactersLoading: boolean;
  selectedCharacterId: string;
  onSelectCharacter: (value: string) => void;
  joinMutation: UseMutationResult<string, Error, void, unknown>;
  canJoin: boolean;
  joinedCampaignId: string | null;
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Select Your Character</CardTitle>
        <CardDescription>
          Choose which character will join this campaign.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCharacters.length === 0 && !isCharactersLoading ? (
          <Alert variant="destructive">
            <AlertTitle>No characters available</AlertTitle>
            <AlertDescription>
              Create a character before joining a campaign.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs">Character</Label>
            <Select
              value={selectedCharacterId}
              onValueChange={onSelectCharacter}
              disabled={isCharactersLoading || activeCharacters.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a character" />
              </SelectTrigger>
              <SelectContent>
                {activeCharacters.map(character => (
                  <SelectItem key={character.id} value={character.id}>
                    {character.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {joinMutation.isError && (
          <Alert variant="destructive">
            <AlertTitle>Could not join</AlertTitle>
            <AlertDescription>
              Please try again or ask your GM for help.
            </AlertDescription>
          </Alert>
        )}

        {joinedCampaignId && joinMutation.isSuccess && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Joined successfully</AlertTitle>
            <AlertDescription>
              You have been added to the campaign. Your GM can now see your
              character selection.
            </AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full"
          onClick={() => joinMutation.mutate(undefined)}
          disabled={!canJoin}
        >
          {joinMutation.isPending ? 'Joining...' : 'Join Campaign'}
        </Button>
        <div className="text-muted-foreground text-center text-xs">
          Need a character?{' '}
          <Link to="/character" className="text-primary">
            Manage your characters
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function JoinCampaignPage() {
  const { code } = Route.useSearch();
  const state = useJoinCampaignState(code);

  if (!state.isAuthenticated) {
    return <JoinCampaignAuthCard />;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-xl">
          <Users className="text-primary size-7" />
        </div>
        <h1 className="text-3xl font-bold">Join a Campaign</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Enter the invite code and choose which character to bring
        </p>
      </div>

      <InviteDetailsCard
        inviteCode={state.inviteCode}
        onInviteCodeChange={state.setInviteCode}
        invitePreview={state.invitePreview}
        isInviteLoading={state.isInviteLoading}
        inviteIsValid={state.inviteIsValid}
      />

      <CharacterSelectCard
        activeCharacters={state.activeCharacters}
        isCharactersLoading={state.isCharactersLoading}
        selectedCharacterId={state.selectedCharacterId}
        onSelectCharacter={state.setSelectedCharacterId}
        joinMutation={state.joinMutation}
        canJoin={state.canJoin}
        joinedCampaignId={state.joinedCampaignId}
      />
    </div>
  );
}
