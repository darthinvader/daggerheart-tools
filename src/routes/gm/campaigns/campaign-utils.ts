export function getComplexityInfo(complexity: string) {
  switch (complexity) {
    case '1':
      return {
        label: 'Low',
        color: 'bg-green-500/10 text-green-600 border-green-500/30',
        description: 'Traditional fantasy, minimal custom mechanics',
      };
    case '2':
      return {
        label: 'Medium',
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
        description: 'Some additional mechanics and deeper political themes',
      };
    case '3':
      return {
        label: 'High',
        color: 'bg-red-500/10 text-red-600 border-red-500/30',
        description: 'Requires comfortable homebrewing and custom content',
      };
    default:
      return {
        label: 'Unknown',
        color: 'bg-gray-500/10 text-gray-600',
        description: '',
      };
  }
}
