import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/references/adversaries')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/references/adversaries"!</div>;
}
