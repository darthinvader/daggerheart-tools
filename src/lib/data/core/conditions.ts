// Default/common conditions with brief descriptions sourced from in-repo texts
// Only include details that are explicitly present in our data; otherwise mark as contextual.

export type ConditionInfo = {
  name: string;
  description: string;
};

export const DEFAULT_CONDITIONS: ConditionInfo[] = [
  {
    name: 'Stunned',
    description:
      "While Stunned, a creature can't use reactions and can't take any other actions until they clear this condition.",
  },
  {
    name: 'Dazed',
    description:
      'While Dazed, a target acts on a delay (their turn moves to the end of the round) and has disadvantage on attack rolls.',
  },
  {
    name: 'Invisible',
    description:
      "While invisible, you can't be seen by mundane sight and have advantage on Agility Rolls to move unseen.",
  },
  {
    name: 'Cloaked',
    description:
      "While Cloaked, you remain unseen if stationary when an adversary moves where they'd normally see you; you stop being Cloaked when you move into line of sight or make an attack.",
  },
  {
    name: 'Charmed',
    description:
      'While Charmed (per source effect), a target is compelled to fixate on you; they cannot attack, cannot move, and have disadvantage on noticing anything else.',
  },
  {
    name: 'Horrified',
    description: 'While Horrified, a target is Vulnerable (per source effect).',
  },
  {
    name: 'Restrained',
    description:
      'Restrained by an effect (e.g., bindings, shadow, etc.). Specific clear conditions are defined by the source (see card/feature).',
  },
  {
    name: 'Vulnerable',
    description:
      'Made more susceptible to harm by the source effect. The exact impact is defined by the originating card/feature.',
  },
  {
    name: 'Poisoned',
    description:
      'Affected by a toxin; the effect varies by the specific poison or source item.',
  },
  {
    name: 'Frenzied',
    description:
      "While Frenzied, you can't use Armor Slots and gain bonuses defined by the source (e.g., +10 damage, +8 Severe threshold from a Blade feature).",
  },
];

export const DEFAULT_CONDITION_MAP: Record<string, string> = Object.fromEntries(
  DEFAULT_CONDITIONS.map(c => [c.name.toLowerCase(), c.description])
);
