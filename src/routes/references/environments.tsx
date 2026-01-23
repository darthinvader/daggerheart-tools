import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/references/environments')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/references/environments"!</div>;
}
