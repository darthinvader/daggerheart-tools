import type { DomainCard } from '@/lib/schemas/domains';
import type { DomainCardLite } from '@/lib/schemas/loadout';

export interface CardCosts {
  recallCost: number;
  activationCosts: ActivationCost[];
}

export interface ActivationCost {
  amount: number | 'any';
  type: 'Hope' | 'Stress';
  context?: string;
}

type CardCostSource = Pick<
  DomainCard | DomainCardLite,
  'description' | 'hopeCost' | 'recallCost' | 'stressCost'
>;

const HOPE_PATTERN =
  /(?:spend|mark|pay|costs?)\s+(?:(\d+)|(?:a|an|any\s+number\s+of))\s+hope/gi;
const STRESS_PATTERN =
  /(?:spend|mark|pay|costs?)\s+(?:(\d+)|(?:a|an))\s+stress/gi;

function extractCostsFromText(text: string): ActivationCost[] {
  const costs: ActivationCost[] = [];

  let match: RegExpExecArray | null;

  while ((match = HOPE_PATTERN.exec(text)) !== null) {
    const fullMatch = match[0].toLowerCase();
    if (fullMatch.includes('any number')) {
      costs.push({ amount: 'any', type: 'Hope' });
    } else {
      const amount = match[1] ? parseInt(match[1], 10) : 1;
      costs.push({ amount, type: 'Hope' });
    }
  }

  while ((match = STRESS_PATTERN.exec(text)) !== null) {
    const amount = match[1] ? parseInt(match[1], 10) : 1;
    costs.push({ amount, type: 'Stress' });
  }

  HOPE_PATTERN.lastIndex = 0;
  STRESS_PATTERN.lastIndex = 0;

  return costs;
}

export function getCardCosts(card: CardCostSource): CardCosts {
  const recallCost = card.recallCost ?? card.hopeCost ?? 0;
  const activationCosts = extractCostsFromText(card.description);

  const hasHopeCost = activationCosts.some(cost => cost.type === 'Hope');
  if (typeof card.hopeCost === 'number' && card.hopeCost > 0 && !hasHopeCost) {
    activationCosts.push({ amount: card.hopeCost, type: 'Hope' });
  }

  const hasStressCost = activationCosts.some(cost => cost.type === 'Stress');
  if (
    typeof card.stressCost === 'number' &&
    card.stressCost > 0 &&
    !hasStressCost
  ) {
    activationCosts.push({ amount: card.stressCost, type: 'Stress' });
  }

  return { recallCost, activationCosts };
}

export function formatActivationCost(cost: ActivationCost): string {
  if (cost.amount === 'any') {
    return `X ${cost.type}`;
  }
  return `${cost.amount} ${cost.type}`;
}

export function getTotalHopeCost(costs: ActivationCost[]): number | 'variable' {
  const hopeCosts = costs.filter(c => c.type === 'Hope');
  if (hopeCosts.length === 0) return 0;
  if (hopeCosts.some(c => c.amount === 'any')) return 'variable';
  return hopeCosts.reduce((sum, c) => sum + (c.amount as number), 0);
}
