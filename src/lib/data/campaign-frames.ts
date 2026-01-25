import type { CampaignFrame } from '../schemas/campaign';

/**
 * Pre-built campaign frame templates from the Daggerheart rulebook.
 * GMs can use these as starting points or inspiration for their own campaigns.
 */
export const CAMPAIGN_FRAME_TEMPLATES: CampaignFrame[] = [
  {
    id: 'witherwild',
    name: 'The Witherwild',
    complexity: '1',
    pitch:
      "Fanewick was once a place of great abundance and peace - dangerous to those unfamiliar with the land, but a cornucopia to those who respected its ways. When Haven invaded the wilds and forced the land into eternal spring, a dangerous bloom known as the Witherwild took hold and now threatens the lives of all who live there. In a Witherwild campaign, you will play unlikely heroes from humble beginnings who are reckoning with their newfound duty to save Fanewick's people from dangerous corruption.",
    toneAndFeel: [
      'Adventurous',
      'Dynamic',
      'Epic',
      'Heroic',
      'Thrilling',
      'Uncanny',
      'Whimsical',
    ],
    themes: [
      'Cultural Clash',
      'Ends Justify Means',
      'Grief',
      'People vs. Nature',
      'Transformation and Change',
      'Survival',
    ],
    touchstones: [
      'Princess Mononoke',
      'The Legend of Zelda',
      'The Dark Crystal',
      'Nausicaa of the Valley of the Wind',
    ],
    overview:
      'Fanewick is a wild and untamed land, long avoided by outside forces. The woods are dark and twisting, filled with Faint Divinities who perform small miracles and services for its inhabitants, but are just as likely to lure travelers off narrow paths to their ruin. When Haven invaded and forced the land into eternal spring, a dangerous bloom known as the Witherwild took hold. This corruption induces horrific changes and massive growth on anything it touches, transforming them into Withered beings.',
    communityGuidance: [
      {
        id: 'loreborne-highborne',
        type: 'community',
        name: 'Loreborne and Highborne',
        description:
          "In Fanewick, knowledge is the most valuable commodity. Loreborne are the wealthiest and might be hunters, historians, or artisans. In Haven, the highborne have inherited riches built over generations - though none were immune to the Serpent's Sickness.",
        questions: [
          'What knowledge did your community teach you that you must now protect or share?',
          'What are you able to accomplish because of your upbringing that others do not understand?',
          'You once traded important knowledge for something terrible. What did you impart and what did you gain?',
        ],
      },
      {
        id: 'orderborne',
        type: 'community',
        name: 'Orderborne',
        description:
          'Players might choose orderborne if they want to play current or former members of the Haven Army. Though the army brings violence, they also carry overwhelming grief for a homeland succumbing to disease.',
        questions: [
          'What regrets do you carry with you from your conquest of foreign soil?',
          'What kindness did an enemy combatant bestow upon you in an hour of need?',
          'You once acted against orders in service of your conscience. What did you do and how did it change you?',
        ],
      },
      {
        id: 'ridgeborne',
        type: 'community',
        name: 'Ridgeborne',
        description:
          'Players from the remote ridges of Fanewick live in isolated communities with unique traditions. The arrival of Haven forces threatens their way of life.',
        questions: [
          'What tradition from your ridge community do you still practice?',
          'How did your community first learn of the Witherwild threat?',
          'What did you leave behind when you descended from the ridges?',
        ],
      },
    ],
    ancestryGuidance: [],
    classGuidance: [],
    playerPrinciples: [
      {
        id: 'embrace-change',
        title: 'Embrace Change',
        description:
          'The world is transforming. Let your character grow and adapt with it.',
        target: 'player',
      },
      {
        id: 'protect-community',
        title: 'Protect Your Community',
        description:
          'Your bonds to others define you. Fight for those who cannot fight for themselves.',
        target: 'player',
      },
      {
        id: 'question-authority',
        title: 'Question Authority',
        description:
          'Those in power may not have your best interests at heart. Think critically about commands.',
        target: 'player',
      },
    ],
    gmPrinciples: [
      {
        id: 'corruption-spreads',
        title: 'The Corruption Spreads',
        description:
          'The Witherwild is always growing. Show its effects on the land and people.',
        target: 'gm',
      },
      {
        id: 'no-pure-villains',
        title: 'No Pure Villains',
        description:
          'Even antagonists have understandable motivations. Haven soldiers are also victims.',
        target: 'gm',
      },
      {
        id: 'nature-reclaims',
        title: 'Nature Reclaims',
        description:
          'The wild fights back against those who would tame it. Show the beauty and danger.',
        target: 'gm',
      },
    ],
    distinctions: [
      {
        id: 'withered-touched',
        title: 'Withered-Touched',
        description:
          'You have been exposed to the Witherwild corruption and bear its mark. You can sense Withered creatures within close range.',
      },
      {
        id: 'haven-refugee',
        title: 'Haven Refugee',
        description:
          'You fled Haven as the Serpent Sickness spread, seeking safety in Fanewick. You have advantage on rolls to resist disease.',
      },
    ],
    mechanics: [
      {
        id: 'witherwild-corruption',
        name: 'Witherwild Corruption',
        description:
          'Track corruption levels as PCs encounter Withered threats.',
        rules: [
          'When exposed to Witherwild energy, mark corruption.',
          'At 3 corruption, gain a minor mutation.',
        ],
      },
      {
        id: 'fanewick-spirits',
        name: 'Fanewick Spirits',
        description: 'Faint Divinities can be bargained with for boons.',
        rules: [
          'Spirits require offerings.',
          'Roll to negotiate - success grants a boon, failure may anger them.',
        ],
      },
    ],
    sessionZeroQuestions: [
      {
        id: 'origin-q1',
        question: 'Are you from Fanewick or Haven originally?',
        category: 'character',
      },
      {
        id: 'origin-q2',
        question: 'What is your relationship to the natural world?',
        category: 'character',
      },
      {
        id: 'tone-q1',
        question: 'How dark should the corruption elements get?',
        category: 'themes',
      },
      {
        id: 'world-q1',
        question:
          'What creatures inhabit the deep woods that we should know about?',
        category: 'world',
      },
    ],
    isTemplate: true,
  },
  {
    id: 'five-banners',
    name: 'Five Banners Burning',
    complexity: '2',
    pitch:
      'Five years into an armistice that ended a decade of warfare, the threat of renewed conflict looms over the continent of Althas. Five nations in a delicate web of alliances and rivalries seek to exploit opportunities granted by rapid magical, political, and social change. In a Five Banners Burning campaign, you will play heroes caught up in the ever-escalating conflict between nations, contending with competing loyalties, generational grudges, and opportunistic villains.',
    toneAndFeel: ['Political', 'Dramatic', 'Morally Complex', 'Epic', 'Tense'],
    themes: [
      'War and Peace',
      'Loyalty and Betrayal',
      'Legacy and Change',
      'Power and Corruption',
      'Unity and Division',
    ],
    touchstones: [
      'Game of Thrones',
      'Avatar: The Last Airbender',
      'The Witcher',
      'Fire Emblem',
    ],
    overview:
      'The continent of Althas has known ten years of brutal warfare between five great nations. Now, five years into a fragile peace, old wounds fester and new ambitions arise. Each nation schemes for advantage while heroes navigate the treacherous waters of diplomacy, espionage, and open conflict.',
    communityGuidance: [
      {
        id: 'nobility',
        type: 'community',
        name: 'Nobility',
        description:
          'The noble houses of each nation hold tremendous power but are bound by tradition and expectation.',
        questions: [
          'Which nation does your noble house serve?',
          'What did your family lose in the war?',
          'What secret alliance does your house maintain?',
        ],
      },
      {
        id: 'common-folk',
        type: 'community',
        name: 'Common Folk',
        description:
          'The common people bear the heaviest burden of war and peace alike.',
        questions: [
          'How did the war affect your village or city?',
          'What skill did you develop to survive the conflict?',
          'Who did you lose that you still mourn?',
        ],
      },
      {
        id: 'underworld',
        type: 'community',
        name: 'The Underworld',
        description:
          'Especially prominent in Jesthaen and Armada where criminal organizations have improved their nations fortunes - from smugglers supporting revolution to pirate families founding Armada.',
        questions: [
          'What criminal organization do you have ties to?',
          'What line will you not cross?',
          'Who in the underworld owes you a favor?',
        ],
      },
    ],
    ancestryGuidance: [],
    classGuidance: [],
    playerPrinciples: [
      {
        id: 'navigate-loyalties',
        title: 'Navigate Competing Loyalties',
        description:
          'Your allegiances will be tested. Choose wisely where your true loyalty lies.',
        target: 'player',
      },
      {
        id: 'actions-have-consequences',
        title: 'Actions Have Consequences',
        description:
          'Every choice ripples outward. Consider the political implications of your deeds.',
        target: 'player',
      },
      {
        id: 'seek-truth',
        title: 'Seek the Truth',
        description:
          'In a world of propaganda and secrets, finding the truth is itself an act of heroism.',
        target: 'player',
      },
    ],
    gmPrinciples: [
      {
        id: 'escalate-tensions',
        title: 'Escalate Tensions',
        description:
          'Peace is fragile. Push the nations toward conflict through events and provocations.',
        target: 'gm',
      },
      {
        id: 'gray-morality',
        title: 'Embrace Gray Morality',
        description:
          'Every faction believes they are right. Show the legitimate grievances of all sides.',
        target: 'gm',
      },
      {
        id: 'personal-stakes',
        title: 'Make It Personal',
        description:
          'Tie the grand political conflicts to the personal stories of the characters.',
        target: 'gm',
      },
    ],
    distinctions: [
      {
        id: 'war-veteran',
        title: 'War Veteran',
        description:
          'You fought in the Ten Years War and bear its scars. Advantage on rolls to resist fear in combat.',
      },
      {
        id: 'diplomat',
        title: 'Trained Diplomat',
        description:
          'You have been trained in the art of negotiation and statecraft. Advantage on rolls to discern political motivations.',
      },
    ],
    mechanics: [
      {
        id: 'faction-reputation',
        name: 'Faction Reputation',
        description: 'Track your standing with each of the five nations.',
        rules: [
          'Actions that favor one nation may harm your reputation with their rivals.',
        ],
      },
      {
        id: 'intelligence-network',
        name: 'Intelligence Network',
        description: 'Build a network of informants and spies.',
        rules: [
          'Spend downtime to establish contacts who can provide information.',
        ],
      },
    ],
    sessionZeroQuestions: [
      {
        id: 'nation-q1',
        question: 'Which nation do you call home?',
        category: 'character',
      },
      {
        id: 'war-q1',
        question: 'What role did you play in the Ten Years War?',
        category: 'character',
      },
      {
        id: 'peace-q1',
        question: 'Do you believe the peace will last?',
        category: 'character',
      },
      {
        id: 'tone-q2',
        question: 'How much political intrigue versus combat should we have?',
        category: 'themes',
      },
    ],
    isTemplate: true,
  },
  {
    id: 'blank',
    name: 'Blank Campaign Frame',
    complexity: '1',
    pitch: '',
    toneAndFeel: [],
    themes: [],
    touchstones: [],
    overview: '',
    communityGuidance: [],
    ancestryGuidance: [],
    classGuidance: [],
    playerPrinciples: [],
    gmPrinciples: [],
    distinctions: [],
    mechanics: [],
    sessionZeroQuestions: [],
    isTemplate: true,
  },
];

/** Common tone options for campaign frames */
export const CAMPAIGN_TONE_OPTIONS = [
  'Adventurous',
  'Dark',
  'Dramatic',
  'Dynamic',
  'Epic',
  'Gritty',
  'Heroic',
  'Hopeful',
  'Humorous',
  'Introspective',
  'Morally Complex',
  'Mysterious',
  'Political',
  'Romantic',
  'Tense',
  'Thrilling',
  'Tragic',
  'Uncanny',
  'Whimsical',
];

/** Common theme options for campaign frames */
export const CAMPAIGN_THEME_OPTIONS = [
  'Colonialism',
  'Coming of Age',
  'Cultural Clash',
  'Ends Justify Means',
  'Family',
  'Freedom vs. Security',
  'Grief',
  'Identity',
  'Legacy and Change',
  'Loyalty and Betrayal',
  'Nature vs. Civilization',
  'People vs. Nature',
  'Power and Corruption',
  'Redemption',
  'Sacrifice',
  'Survival',
  'Transformation and Change',
  'Unity and Division',
  'War and Peace',
];

/**
 * Get a campaign frame template by ID
 */
export function getCampaignFrameTemplate(
  id: string
): CampaignFrame | undefined {
  return CAMPAIGN_FRAME_TEMPLATES.find(frame => frame.id === id);
}

/**
 * Create a new campaign frame from a template
 */
export function createCampaignFrameFromTemplate(
  templateId: string,
  newId: string
): CampaignFrame | undefined {
  const template = getCampaignFrameTemplate(templateId);
  if (!template) return undefined;

  return {
    ...template,
    id: newId,
    isTemplate: false,
  };
}
