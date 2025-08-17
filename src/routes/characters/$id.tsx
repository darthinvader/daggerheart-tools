import { createFileRoute } from '@tanstack/react-router';

import { CharacterPage } from '@/components/characters/character-page/character-page';

function CharacterRouteWrapper() {
  const { id } = Route.useParams();
  return <CharacterPage id={id} />;
}

export const Route = createFileRoute('/characters/$id')({
  component: CharacterRouteWrapper,
});
