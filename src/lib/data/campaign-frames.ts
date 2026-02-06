import type { CampaignFrame } from '../schemas/campaign';

/**
 * Pre-built campaign frame templates from the Daggerheart rulebook.
 * GMs can use these as starting points or inspiration for their own campaigns.
 */
export const CAMPAIGN_FRAME_TEMPLATES: CampaignFrame[] = [
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
    worldNotes: '',
  },
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
    ancestryGuidance: [
      {
        id: 'clanks-materials',
        type: 'ancestry',
        name: 'Clanks',
        description:
          'Clanks from Haven are commonly made from iron and steel, while clanks from Fanewick are typically constructed from wood and stone.',
        questions: [],
      },
      {
        id: 'fungril-growth',
        type: 'ancestry',
        name: 'Fungril',
        description:
          'Since the Witherwild spread throughout Fanewick, some fungril inhabiting the forests have grown noticeably larger than fungril from other regions.',
        questions: [],
      },
      {
        id: 'horned-ancestries',
        type: 'ancestry',
        name: 'Drakona, Fauns, Firbolgs, and Infernis',
        description:
          'After the Witherwild corrupted Fanewick, some drakona, fauns, firbolgs, and infernis have noticed their horns growing faster and longer.',
        questions: [],
      },
      {
        id: 'galapa-ribbets-displaced',
        type: 'ancestry',
        name: 'Galapa and Ribbets',
        description:
          "Many families of galapa and ribbets who lived in the bogs of Fanewick were displaced when Haven's army invaded.",
        questions: [],
      },
      {
        id: 'havenites-sickness',
        type: 'ancestry',
        name: "Havenites and the Serpent's Sickness",
        description:
          "Anyone, but especially those from Haven, may carry the Serpent's Sickness, which stiffens their movements and gives them limited time to survive without a cure.",
        questions: [],
      },
    ],
    classGuidance: [
      {
        id: 'druids-rangers-sorcerers',
        type: 'class',
        name: 'Druids, Rangers, and Sorcerers',
        description:
          "Druids, rangers, and sorcerers are commonly found throughout Fanewick. If players choose one of these classes, they should consider how their character's connection to the natural world might be impacted by the Witherwild.",
        questions: [],
      },
      {
        id: 'warriors-wizards',
        type: 'class',
        name: 'Warriors and Wizards',
        description:
          'Warriors and wizards are prevalent in Haven. A large wizarding school in Haven teaches fighters and healers, and the Haven Army is largely composed of warriors and School of War wizards. If a PC is either of these classes, consider their personal relationship to the Haven Army.',
        questions: [],
      },
      {
        id: 'vengeance-guardian',
        type: 'class',
        name: 'Vengeance Guardian',
        description:
          'Many Wicklings who seek revenge on Haven or to expel them from Fanewick become Vengeance guardians. If players choose this subclass, they should consider what ideals or institutions their character protects.',
        questions: [],
      },
      {
        id: 'syndicate-rogue',
        type: 'class',
        name: 'Syndicate Rogue',
        description:
          'The Haven Army sends spies into Fanewick communities to gain information on planned attacks and manipulate public perception. When selecting the Syndicate rogue subclass, players should consider how their character might be connected to or impacted by these covert operatives.',
        questions: [],
      },
    ],
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
    incitingIncident: {
      title: 'The Hunt for the Fanewraith',
      description:
        "The Reaping Eye is stowed in a secure vault beneath the central tower of Haven's wizarding school, seemingly impossible to recover. A secretive and dangerous rebel group, led by a mysterious figure known only as the Fanewraith, has hatched a plan to end the curse of the Witherwild: find the Great Owl, Nikta, and pluck out the Sowing Eye. While this may solve the immediate problem, the long-term consequences are not being considered, just as they weren't when Haven invaded.\n\nHaven's beleaguered spymaster, Kreil Dirn, has uncovered the Fanewraith's plot and is horrified by the possibility of her success. Knowing he can't send a troop of Haven soldiers deep into the woods to hunt down and stop the Fanewraith from stealing the Sowing Eye, Kreil uses his vast network of informants and spies to find a group of adventurers who can bring the Fanewraith to swift justice.\n\nThe party is sent an invitation from Haven to meet with Kreil. But is his information correct? Does he have his own motivation or secret ambition? Whether they come from Fanewick or Haven, the party must extend some trust to a person who is equally as dangerous and mercurial as the \"enemy\" they pursue.",
      hooks: [
        'What will the party do when they find the Fanewraith? Bring her to justice? Side with her? Attempt to recover the Reaping Eye?',
        'Kreil advises the party to start their hunt for the Fanewraith in the treetop village of Alula, where he suspects she runs her operation.',
        'The party must navigate the tension between saving Fanewick from the Witherwild and preventing the Fanewraith from causing even greater harm.',
      ],
    },
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
    worldNotes: '',
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
    ancestryGuidance: [
      {
        id: 'all-ancestries-available',
        type: 'ancestry',
        name: 'All Ancestries',
        description:
          'All ancestries are available and can be found across the five nations. Consider how your ancestry might influence your standing or treatment in different nations, and what historical ties your people might have to the ongoing conflicts.',
        questions: [],
      },
      {
        id: 'ancestry-national-identity',
        type: 'ancestry',
        name: 'Ancestry and National Identity',
        description:
          'Some ancestries may be more common in certain nations. Consider whether your ancestry aligns with national stereotypes or defies them, and how that affects your relationships across borders.',
        questions: [],
      },
      {
        id: 'ancestry-war-impact',
        type: 'ancestry',
        name: "War's Impact on Ancestries",
        description:
          'The Ten Years War affected all peoples of Althas. Consider how your ancestry fared during the conflict and whether your people were conscripted, displaced, or affected by the fighting.',
        questions: [],
      },
    ],
    classGuidance: [
      {
        id: 'political-classes',
        type: 'class',
        name: 'Political and Social Classes',
        description:
          'Bards, rogues, and seraphs excel in the political intrigue central to this campaign. Their social abilities are particularly valuable for navigating the complex web of alliances, secrets, and diplomacy between nations.',
        questions: [],
      },
      {
        id: 'military-classes',
        type: 'class',
        name: 'Military Classes',
        description:
          'Warriors, guardians, and rangers are common veterans of the Ten Years War. Consider which nation you served and what you witnessed during the conflict that still haunts you.',
        questions: [],
      },
      {
        id: 'arcane-classes',
        type: 'class',
        name: 'Arcane Classes in Polaris',
        description:
          'Wizards and sorcerers are especially prominent in Polaris, where magic academics, engineers, and architects push the boundaries of arcane knowledge. Other nations may view magical practitioners with suspicion or admiration.',
        questions: [],
      },
      {
        id: 'divine-classes-hilltop',
        type: 'class',
        name: 'Divine Classes and Hilltop',
        description:
          "Seraphs and divine practitioners often have ties to Hilltop, the rich theocracy that exerts a monopoly on access to the gods. Consider your relationship with Hilltop's religious authority.",
        questions: [],
      },
    ],
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
    incitingIncident: {
      title: 'The Lightning Valley Incident',
      description:
        'Clover of Towers, the child of Jesthaen revolutionary hero Adamant Towers, was kidnapped on the way to a political marriage to Enchanter Kalashae, a rising star in Polaris\'s High Circle of mages.\n\nPolaris is wary of Jesthaen\'s claim that Clover has been kidnapped and demands that Jesthaen follow through with the political marriage. Voldaen denies all involvement and sends a diplomatic investigative party to Lightning Valley, a border town known both for the giant lightning rods that protect the town from magical storms and for hosting the talks that ended official hostilities between Voldaen and the revolutionary faction. However, days later, reports tell of some kind of "disaster" during the initial meetings between Voldaen and Jesthaen\'s representatives.\n\nThe party is sent to Lightning Valley to investigate what happened. There, they find representatives from other nations doing the same: the apprentice of a disappeared mage-inquisitor, a divine seeker from Hilltop investigating potential divine implications, a Voldaen judge who once served as the town magistrate "returning to visit family," and a merchant-diplomat from Armada.',
      hooks: [
        "Did Clover suffer the same fate as the original investigators, or was the kidnapping part of their own plan to escape their mother's expectations?",
        'Which of the rival investigators will be the first to learn where Clover went? Who escalates to violence first, and what version of that story catches on like wildfire?',
        'Sheriff Oziver of Lightning Valley is trying to keep the peace but is quickly becoming overwhelmed. He knows that a city guard was the last to be seen with Clover.',
        'Multiple NPCs have hidden agendas: Kostren of Hilltop is exaggerating visions to stoke conflict, Zeshthon of Voldaen seeks embargoed tapestries, and Goledraelle of Armada is secretly a spy.',
      ],
    },
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
    worldNotes: '',
  },
  {
    id: 'beast-feast',
    name: 'Beast Feast',
    complexity: '2',
    pitch:
      "The magical Lure created by Hylaeus the Forest Mage has protected the village of Elmore for centuries, drawing dangerous creatures into the Plover Caves. But now the Lure is fading, and beasts stalk the woods once more. In a Beast Feast campaign, you'll play everyday heroes from humble beginnings diving into the caves to reignite the ancient spell—and cook up delicious meals from the monsters you slay!",
    toneAndFeel: ['Adventurous', 'Whimsical', 'Humorous', 'Heroic', 'Hopeful'],
    themes: [
      'Coming of Age',
      'Community',
      'Survival',
      'Transformation and Change',
      'Found Family',
    ],
    touchstones: [
      'Delicious in Dungeon',
      'Monster Hunter World',
      'One Piece',
      'Stardew Valley',
    ],
    overview:
      "Long ago, Hylaeus the Forest Mage cast a powerful spell creating a Lure that draws dangerous creatures into the Plover Caves, protecting the peaceful village of Elmore. The caves are now filled with strange creatures from across the region—and the remnants of adventurers brave or foolhardy enough to venture in. When the village's beloved mayor was attacked, it became clear the Lure is fading. Now, the villagers must descend into the caves to reignite the ancient magic. Food is scarce above ground, so adventurers must hunt and cook their meals from the beasts they encounter!",
    communityGuidance: [
      {
        id: 'elmore-villager',
        type: 'community',
        name: 'Elmore Villagers',
        description:
          'All characters are villagers from Elmore—bakers, weavers, farmers, and cobblers with nary a sword in sight. Consider what quaint job your character holds and how it prepared them for heroism.',
        questions: [
          'What was your job in Elmore before this adventure?',
          'What tool from your trade have you adapted as a weapon?',
          'Who in the village are you determined to protect?',
        ],
      },
      {
        id: 'underborne-caves',
        type: 'community',
        name: 'Underborne',
        description:
          'Underborne folk may be from the Plover Caves or similar environments. Their eyes need not adjust to darkness, and cave life feels like home.',
        questions: [
          'What makes the Plover Caves unique from your home caverns?',
          'What dish from your cave system do you hope to recreate here?',
          'How did a cave creature injury change you?',
        ],
      },
      {
        id: 'loreborne-researcher',
        type: 'community',
        name: 'Loreborne',
        description:
          'As devourers of knowledge, loreborne see the Plover Caves as a unique opportunity to study an ecosystem that brings together creatures from across the region.',
        questions: [
          'What rumor about cave beasts have you heard?',
          'What specific knowledge are you seeking underground?',
          'Who will you share your research with when you return?',
        ],
      },
    ],
    ancestryGuidance: [
      {
        id: 'clanks-taste',
        type: 'ancestry',
        name: 'Clanks',
        description:
          'Clanks can consume organic matter but may lack the ability to taste. They might enjoy culinary arts for texture or aesthetics instead.',
        questions: [],
      },
      {
        id: 'fungril-screaming',
        type: 'ancestry',
        name: 'Fungril',
        description:
          'Fungril can hear mushrooms screaming as they are harvested. Since most cave plants are fungi, adventurers may need alternatives.',
        questions: [],
      },
      {
        id: 'underborne-ancestries',
        type: 'ancestry',
        name: 'Underborne Ancestries',
        description:
          'Ancestries comfortable in underground environments thrive in the Plover Caves. The darkness and cramped spaces feel natural to those from similar subterranean homes.',
        questions: [],
      },
      {
        id: 'surface-ancestries',
        type: 'ancestry',
        name: 'Surface Dwellers',
        description:
          'Surface-dwelling ancestries may find the caves disorienting at first. Consider how your character adapts to the perpetual darkness and strange ecosystems below Elmore.',
        questions: [],
      },
    ],
    classGuidance: [
      {
        id: 'all-classes-peaceful',
        type: 'class',
        name: 'All Classes',
        description:
          "The people of Elmore have lived peacefully for generations. Thanks to Hylaeus, the region's dangerous creatures are enticed to the caves; meanwhile, other towns or armies have largely left the unassuming village alone. When players select martial abilities or spells, they should consider how and why their characters learned these techniques or what skills they've adapted on this journey.",
        questions: [],
      },
      {
        id: 'druids-rangers-nature',
        type: 'class',
        name: 'Druids and Rangers',
        description:
          'Druids and rangers have unique knowledge of the natural world that translates well to understanding cave ecosystems. They can identify edible plants, track beasts, and navigate the underground wilderness.',
        questions: [],
      },
      {
        id: 'rogues-scouts',
        type: 'class',
        name: 'Rogues',
        description:
          'Rogues excel at navigating the treacherous cave terrain, disarming natural hazards, and getting the drop on unsuspecting beasts. Their skills for stealth and survival are invaluable in the Plover Caves.',
        questions: [],
      },
      {
        id: 'bards-cooks',
        type: 'class',
        name: 'Bards',
        description:
          'Bards bring creativity and flair to the culinary arts, turning monster slaying into performance art. Their ability to inspire allies makes group cooking sessions memorable events.',
        questions: [],
      },
    ],
    playerPrinciples: [
      {
        id: 'humble-origins',
        title: 'Build on Humble Origins',
        description:
          'Think about what quaint or mundane job your character holds and how it prepared them for heroism. A florist knows plants, a clockmaker has dexterous fingers, a chef excels with knives.',
        target: 'player',
      },
      {
        id: 'slay-and-filet',
        title: 'Slay and Filet',
        description:
          "Have you tried eating it? No? Then how do you know it's not food? Carry curious mindset—every beast might become a delicious meal.",
        target: 'player',
      },
      {
        id: 'comedy-heart',
        title: 'Balance Comedy and Heart',
        description:
          'Embrace silly names, low-stakes goals, weird quirks, and zany aesthetics. But also let your character be vulnerable and bond with allies over important moments.',
        target: 'player',
      },
    ],
    gmPrinciples: [
      {
        id: 'make-delicious',
        title: 'Make It Delicious',
        description:
          'Describe the world through a culinary lens. Highlight edible parts of beasts, use food-related colors and names, lean on smell and taste to draw players in.',
        target: 'gm',
      },
      {
        id: 'give-purpose',
        title: 'Give Them Purpose',
        description:
          'While the long-term goal is reaching the Lure, introduce short-term goals and session-to-session story developments. Let players return to Elmore to contrast worlds.',
        target: 'gm',
      },
      {
        id: 'personal-conflict',
        title: 'Create Personal Conflict',
        description:
          'Introduce rivals competing for ingredients! Make resources scarce so parties must race to claim catches before others do.',
        target: 'gm',
      },
    ],
    distinctions: [
      {
        id: 'master-chef',
        title: 'Aspiring Master Chef',
        description:
          'You dream of creating the perfect dish. You can identify the culinary value of any beast or bloom with a quick examination.',
      },
      {
        id: 'cave-guide',
        title: 'Plover Cave Guide',
        description:
          'You know the upper layers of the caves well. You have advantage on navigation checks in the Shallows and Twilight layers.',
      },
    ],
    mechanics: [
      {
        id: 'cooking-mechanic',
        name: 'Monster Cooking',
        description:
          'After slaying a beast, harvest ingredients and cook meals that provide temporary benefits. Each ingredient has 1-3 flavor profiles that contribute dice to the cooking roll.',
        rules: [
          'Harvest ingredients from slain beasts based on HP: 1-4 HP = 1 ingredient, 5-7 HP = 2, 8-10 HP = 3, 12+ HP = 4 ingredients.',
          'Each ingredient has flavor profiles (Sweet d4, Salty d6, Bitter d8, Sour d10, Savory d12, Weird d20) that contribute dice to your pool.',
          'During downtime, roll all flavor dice. Matched results add their value to your Meal Rating.',
          'Use tokens from matched recipes instead of discarding dice.',
          'A PC can hold ingredients equal to their highest character trait value.',
        ],
      },
      {
        id: 'bloom-gathering',
        name: 'Bloom Gathering',
        description:
          'Gather wild blooms from the cave environment. Roll your Hope Die to determine the flavor type.',
        rules: [
          '1-2: Sweet (d4), 3-4: Salty (d6), 5-6: Bitter (d8), 7-8: Sour (d10), 9-10: Savory (d12), 11-12: Weird (d20).',
          'Blooms provide a single die of their flavor type.',
          'Some rare blooms may have special features.',
        ],
      },
      {
        id: 'featured-ingredients',
        name: 'Featured Ingredients',
        description:
          'Leader and Solo adversaries have featured ingredients with special effects.',
        rules: [
          'Featured ingredients have a Feature with a name and mechanical effect.',
          'Effects can be beneficial (stat bonuses) or risky (death moves on certain rolls).',
          'Examples: "Built for Speed" grants +1 Agility, "Risky" may cause a death move.',
        ],
      },
      {
        id: 'cookbook-recipes',
        name: 'Party Cookbook',
        description:
          'Record successful meal combinations in the party cookbook. Familiar recipes become easier to prepare!',
        rules: [
          'When you make a meal with the same flavor profile as a recorded recipe, add tokens equal to your current tier.',
          'Tokens can be discarded instead of dice when cooking.',
          'The more you practice a combination, the easier it becomes.',
        ],
      },
      {
        id: 'cave-layers',
        name: 'Cave Layer System',
        description:
          'The Plover Caves are divided into layers of increasing danger and reward.',
        rules: [
          'The Shallows (Layer 1): Common creatures, basic ingredients.',
          'Twilight (Layer 2): Uncommon creatures, quality ingredients.',
          'Abyss (Layer 3): Rare creatures, exceptional ingredients.',
          'Hadral (Layer 4+): Legendary creatures, the Lure lies here.',
        ],
      },
      {
        id: 'berrys-restaurants',
        name: "Berry's Restaurants",
        description:
          'Chain of small cave restaurants serving catch of the day. Hubs for gossip, entertainment, and warnings about nearby beasts.',
        rules: [
          'Spend gold for a meal when too tired to cook.',
          'Gather rumors about rare ingredients or dangerous creatures.',
          'Meet rival adventurers and potential allies.',
        ],
      },
    ],
    incitingIncident: {
      title: 'The Ghost Scorpion Hunt',
      description:
        'After the attack on Mayor Dougle, the local alchemist, Carat, approaches the party. Worried for the safety of the town, they ask the party to delve into the Plover Caves to locate a particular ingredient: ghost scorpion venom. Carat can transmute twelve drops of this venom into a spicy paste, which they can spread around the borders of the village to temporarily keep dangerous creatures at bay.\n\nCarat explains that ghost scorpions tend to make their nests by flattening the tall grasses of the Overgrowth into strange circular patterns. To get to the Overgrowth, the party can follow the smell of jasmine through the northernmost chamber of the Shallows. But if they ever smell lavender... RUN.\n\nThis first expedition into the Plover Caves will introduce the party to the dangers and delights that await them below. They will learn to hunt, harvest, and cook their first beast feast, setting the stage for their ultimate goal: reaching the Lure deep in the Hadral layer to reignite its protective magic.',
      hooks: [
        'What will the characters encounter that makes them realize the failing Lure is a problem that needs addressing?',
        "What will they accomplish that shows them they're capable of exploring further in?",
        'What about the community will coax them into returning, and what competition will light a fire in their veins?',
        'What culinary experience will change their view on beast-feasting forever?',
      ],
    },
    sessionZeroQuestions: [
      {
        id: 'job-q1',
        question: 'What was your mundane job in Elmore village?',
        category: 'character',
      },
      {
        id: 'food-q1',
        question: "What's your character's favorite food or cooking style?",
        category: 'character',
      },
      {
        id: 'stakes-q1',
        question: 'Who in Elmore are you most determined to protect?',
        category: 'relationships',
      },
      {
        id: 'tone-q3',
        question: 'How silly vs. serious should the culinary elements be?',
        category: 'themes',
      },
      {
        id: 'danger-q1',
        question: 'How dangerous should the caves feel?',
        category: 'themes',
      },
    ],
    isTemplate: true,
    worldNotes: '',
  },
  {
    id: 'age-of-umbra',
    name: 'The Age of Umbra',
    complexity: '3',
    pitch:
      "A century has passed since the God-King Othedias betrayed the Pantheon, provoking divine punishment and abandonment by the gods that left the realm of the Halcyon Domain shattered, desolate, and eternally cursed. Throughout this shadow-choked land of decaying fortresses and dreadful monstrosities, surviving communities cling to hope in the face of lightless oblivion. In an Age of Umbra campaign, you'll play heroic survivors who protect their community from the terrors beyond their walls, venture out into the unknown to hunt the nightmares that twist and grow with each fallen soul, seek answers to the curses that corrupt this world, and perhaps even discover a way to change its fate.",
    toneAndFeel: [
      'Ancient',
      'Daunting',
      'Epic',
      'Grim',
      'Ominous',
      'Terrifying',
      'Tragic',
    ],
    themes: [
      'Apocalypse',
      'Corruption',
      'Darkness vs Light',
      'Hope',
      'Redemption',
      'Survival',
    ],
    touchstones: [
      'Dark Souls',
      'Kingdom Death: Monster',
      'Berserk',
      'The Seventh Seal',
      'Blasphemous',
    ],
    overview:
      "The Age of Umbra is a dark and broken age within the realm known as the Halcyon Domain, which rots in the wake of its Pantheon's abandonment. Grandiose cities and awe-inspiring cathedrals to the Veiled Gods now crumble slowly into ruin. God-King Othedias conspired with his Grand Ordinants and Aetherlords to enact clandestine machinations that could shift the balance in celestial power, enraging the pantheon. His blasphemy was met with cataclysmic retribution—the gods rained destruction upon the land, forsaking the surviving peoples to an existence of growing desolation. The cycle of the soul has been sundered, cursing all who live with the 'soul blight,' a mark ensuring that upon death, they will rise as corrupted revenants. Those who remain rebuild what they can among the ruins, referring to themselves as the Enduring, huddling within reinforced battlements where Sacred Pyres burn as beacons of hope and safety.",
    communityGuidance: [
      {
        id: 'highborne-slyborne',
        type: 'community',
        name: 'Highborne and Slyborne',
        description:
          'Some communities carve out surviving sections of Old World cityscapes, enjoying the spoils of sacking remnants of past high society. Highborne communities are extremely rare, often based on ghosts of Old World political power or newly forged tyrannies. Slyborne are skulkers and thieves who flourish alongside those of influence, whether working for highborne factions or manipulating them for personal gain.',
        questions: [
          'Who are the leaders of your community, and how close are you to their inner circles?',
          'How did you or your bloodline accumulate resources or reputation within your community?',
          'Among the upper echelon of your community, who do you trust the most? Who do you trust the least?',
        ],
      },
      {
        id: 'loreborne-orderborne',
        type: 'community',
        name: 'Loreborne and Orderborne',
        description:
          'Many grandiose cities and centers of higher learning dotted the Halcyon Domain during the prosperous previous age, but these monuments are now ruled by cults of shattered will, overtaken by monstrous entities, or lost to ruin. Loreborne and orderborne characters hail from crumbling bastions of Old World academia, such as those who claim refuge in the Celsian Athenaeum.',
        questions: [
          'What secret about the Old World have you been entrusted with or discovered alongside your community?',
          'How much of your community still remains? If it has fallen completely, what led to its destruction?',
          'What heirloom of the Old World do you carry with you, and what is its significance?',
        ],
      },
      {
        id: 'ridgeborne-umbra',
        type: 'community',
        name: 'Ridgeborne',
        description:
          'The mountain ranges of the Halcyon Domain are varied and imposing. Networks of ancient bridges stretch across mountain passes, becoming deeply important to nearby ridgeborne communities. Some villages keep vigil over mountainside tombs and sites of Old World knowledge, clinging to ancient oaths that fade with each generation.',
        questions: [
          'Who is a childhood friend or rival you formed a kinship with? What task had them leave home, never to be seen again?',
          "What mountain predator's call fills you with abject fear, and why?",
          'One of your village elders entrusted you with an heirloom. What is it, and who did they request you keep it from?',
        ],
      },
      {
        id: 'seaborne-umbra',
        type: 'community',
        name: 'Seaborne',
        description:
          'The scattering of coastal cities spanning the Halcyon Domain shores are defined by an existence straddling the dangerous waters of the Ashen Seas and the ever-expanding threat of shadow. These communities remain important places of commerce and resources, with mighty fishmongers and sailors battling deadly threats from under the waves.',
        questions: [
          'What is the one tale you have heard about the depths of the sea that still makes you nervous?',
          'When you were younger, you swam deep beneath the waters and encountered something unexpected. What was it?',
          'A traveler once came through your town and said something that shook you to your core. What was it?',
        ],
      },
      {
        id: 'underborne-umbra',
        type: 'community',
        name: 'Underborne',
        description:
          'Numerous underground societies claimed space within caverns beneath the surface. Some cavernous metropolises, now half-buried by crumbling earth, fight to survive against terrors that stalk the underworld tunnels. Others build anew within vacant remains of societies of yore.',
        questions: [
          'When you are alone in quiet places, what sound do you believe you hear, and what do you think it means?',
          'You spent much of your upbringing within a reclaimed subterranean structure. What was its original purpose?',
          'What is a place beneath your community that everyone knows to avoid at all costs? What happened when you snuck into it?',
        ],
      },
      {
        id: 'wildborne-umbra',
        type: 'community',
        name: 'Wildborne',
        description:
          'The natural world beyond any settlement is as dangerous as it is beautiful. Sprawling, haunted woodlands hide vibrant glades of natural aether, where bioluminescent flora offers signs of solace or magical protection. Some wildborne societies remain within ancient fanes to hold hope for a better future, living symbiotically with rare uncorrupted pockets of nature.',
        questions: [
          'What landmark within the forest has appeared in your dreams since childhood? What do you think it means?',
          'Which nature spirit does your community rely on most for protection? What early signs of their corruption worry you?',
          'What did you witness within the wilds that makes you fear your home does not have much time left?',
        ],
      },
      {
        id: 'wanderborne-umbra',
        type: 'community',
        name: 'Wanderborne',
        description:
          "Many wanderborne communities either flee destruction to start anew or uproot frequently for fear of attracting the wilds' worst horrors. Others are survivors with common purpose, braving deadly chaos while questing for answers.",
        questions: [
          'Why does your community keep picking up roots and moving on? What do some fear is following them?',
          'What is the one place you lived that you quietly wish you could return to?',
          'You have had a recurring nightmare about a particular location. What about this place frightens you?',
        ],
      },
    ],
    ancestryGuidance: [
      {
        id: 'all-ancestries-umbra',
        type: 'ancestry',
        name: 'All Ancestries',
        description:
          'Consider how the harsher setting and environment can intermingle with ancestries to inspire dark, weird, and unique interpretations.',
        questions: [],
      },
      {
        id: 'clanks-umbra',
        type: 'ancestry',
        name: 'Clanks',
        description:
          'Clanks are often carved from stone and iron and were originally developed as vessels for holy spirits and messengers. Many stopped functioning and became statues when the gods left the Halcyon Domain.',
        questions: [],
      },
      {
        id: 'ribbets-umbra',
        type: 'ancestry',
        name: 'Ribbets',
        description:
          'Ribbets are large, often 6 to 8 feet tall, and prefer to skulk on all fours when not leaping or standing still.',
        questions: [],
      },
      {
        id: 'drakona-umbra',
        type: 'ancestry',
        name: 'Drakona',
        description:
          'In the Halcyon Domain, Drakona are taller and more reptilian in both physicality and proportions. They lean forward as they move, using their tails to balance their weight.',
        questions: [],
      },
      {
        id: 'faeries-umbra',
        type: 'ancestry',
        name: 'Faeries',
        description:
          'Faeries are more sensitive to the soul blight than other ancestries, causing their physical appearance to develop in jagged and monstrous ways.',
        questions: [],
      },
    ],
    classGuidance: [
      {
        id: 'aetherweavers',
        type: 'class',
        name: 'Bards, Druids, Rogues, Rangers, Sorcerers, and Wizards',
        description:
          'The forces of spellcraft and magic—especially dark magic—that flow through the world are referred to as the Aetherweave, and those who can manipulate it are known as Aetherweavers. This art is difficult to teach and rarely wielded instinctively. With many secrets lost, the presence of an Aetherweaver is remarkable and often met with awe, fear, and sometimes mistrust.',
        questions: [],
      },
      {
        id: 'splendor-domain',
        type: 'class',
        name: 'Splendor Domain (Seraphs and Wizards)',
        description:
          "Since the gods' abandonment and the fall of the Grand Ordinants, access to divine powers and healing rituals is a fading art. Many fear the essence of such magic is dying with the light. Some see hope in those with these abilities, while others express hate for the absent gods. Seraphs and wizards displaying Splendor domain abilities might make a profound impact or draw unwanted attention.",
        questions: [],
      },
    ],
    playerPrinciples: [
      {
        id: 'community-survival',
        title: 'Treat Community as a Means of Survival',
        description:
          'You have grown up in a world of despair, raised to rage against the dying of the light. No matter the differences between you and others, forging and protecting the bonds of community is paramount. If the Enduring cannot work together, then all truly is lost.',
        target: 'player',
      },
      {
        id: 'not-all-darkness',
        title: 'Remember That Not All Darkness Is Evil',
        description:
          'Most shadow that plagues this land is born of tragedy. Many threats have a history—a sad and solemn story—that set them on this terrible path. With creativity, you can often parlay with or redeem what hunts you before resorting to destruction.',
        target: 'player',
      },
      {
        id: 'embrace-lethality',
        title: 'Embrace Lethality',
        description:
          'The Age of Umbra is a realm of hardship, challenge, and loss, allowing for momentous revelations and incomparable victories. Very few heroes who venture out carry the same faces when their journey ends. Find joy in the risks and relish opportunities for epic, memorable character deaths.',
        target: 'player',
      },
      {
        id: 'consider-role',
        title: 'Consider Your Role',
        description:
          'Everyone is driven to survive. Your backstory defines your previous role—hunter, scavenger, philosopher, storyteller, oracle, scoundrel, leader, or bandit. Do you continue to enjoy this role, or yearn to reinvent yourself in the dying light?',
        target: 'player',
      },
    ],
    gmPrinciples: [
      {
        id: 'omnipresent-threat',
        title: 'Relish in the Omnipresent Threat',
        description:
          'Enjoy setting the scene for each ominous locale, weaving descriptions of solemn colors and dark beauty with the perpetual sense that nowhere is truly safe. Play with shadows, noises, and monstrous shapes just as players grow comfortable.',
        target: 'gm',
      },
      {
        id: 'light-in-darkness',
        title: 'Shine Light in the Darkness Often',
        description:
          'While thrilling players with insurmountable odds and oppressive atmosphere, always highlight opportunities for hope, joy, and victory. Balance terrifying bleakness with scattered locales of untainted beauty and inspiring humanity.',
        target: 'gm',
      },
      {
        id: 'compassion-hardship',
        title: 'Emphasize Compassion Amidst Hardship',
        description:
          'When society faces annihilation, communities come together in wonderful ways. Create room for the downtrodden to find courage in fellow survivors. Let NPCs be vulnerable, share fears and aspirations, and forge bonds with characters.',
        target: 'gm',
      },
      {
        id: 'many-goals',
        title: 'Create Many Goals Across the Many Minds',
        description:
          'This realm breeds conflicted personalities, from genuinely altruistic to deeply selfish. Consider the wide range of communities, factions, and NPCs—some wish to carve sanctuaries, some embrace chaos, some seek ancient secrets.',
        target: 'gm',
      },
      {
        id: 'combat-puzzle',
        title: 'Build Combat as a Test, a Puzzle, and a Journey',
        description:
          'Much of what is monstrous has become so through corruption, guilt, or circumstance. Bring pathos to threats for conflicted showdowns. Consider alternative victory conditions—cleansing, befriending, or absolving foes.',
        target: 'gm',
      },
    ],
    distinctions: [
      {
        id: 'eternal-gloom',
        title: 'Eternal Gloom and Volatile Weather',
        description:
          'Since the Veiled Gods abandoned the world, endless gloom has engulfed the skies—nights are black as pitch, and even the zenith of day is a dreary haze. Somber grays are occasionally broken by heavy rains or strange weather events.',
      },
      {
        id: 'death-curse',
        title: 'Death Becomes a Curse',
        description:
          'Places not protected by Sacred Pyres are vulnerable to the Umbra, a flow of malevolent spirits that clings to lightless spaces. This necrotic energy courses through the land like dark wind, calling dead souls into its shape.',
      },
      {
        id: 'rarity-respite',
        title: 'The Rarity of Respite',
        description:
          'Everywhere the gloom touches, danger lurks. Ancient evils thrive while warped spirits corrupt what they subsume. Those who persist must seek rare places of safety where a Sacred Pyre burns.',
      },
      {
        id: 'shadow-society',
        title: 'The Shadow of Society',
        description:
          'The Old World was one of grandiose castle fortresses and imposing temples. The wrath of the Veiled Gods toppled much to ruin. What remains is a ghost of what was, with survivors forging new culture through hardship.',
      },
      {
        id: 'magic-suspicious',
        title: 'Magic Is Suspicious',
        description:
          'While rune-marked relics are considered boons, the Aetherweave is believed responsible for the wrath of the Veiled Gods. Superstitious disdain for spellcraft is pervasive, with tales of Aetherweaver hubris taught as cautionary fables.',
      },
    ],
    mechanics: [
      {
        id: 'umbra-touched',
        name: 'The Strength of Hate (Umbra-Touched)',
        description:
          'The Umbra seeps into beings, twisting them into malformed mockeries instilled with preternatural strength.',
        rules: [
          'Adversaries and environments can gain the Umbra-Touched type.',
          'All Umbra-Touched adversaries critically succeed on attacks against a PC on a die roll of 19-20.',
          'As PCs gain scars, they become corrupted—when dealing damage, they deal extra damage equal to their number of scars.',
          'When a PC marks their last Hope slot with a scar, they succumb to the Umbra and charge into the dark forever.',
        ],
      },
      {
        id: 'sacred-pyres',
        name: 'Fiery Beacons (Sacred Pyres)',
        description:
          'Every surviving settlement huddles around the safety of a Sacred Pyre, sparked by a Blessed Branch and continuously kindled by Pyrekeepers.',
        rules: [
          'Blessed Branches are rare hallowed artifacts carried as reliquaries.',
          'Characters can reignite extinguished Sacred Pyres or create new ones with a Blessed Branch.',
          'When ignited, all Enduring present gain 3 Hope, and the flame repels most monsters.',
          'Only a bit of kindling must be provided daily to maintain the slow-burning blaze.',
        ],
      },
      {
        id: 'lurking-darkness',
        name: 'Lurking Darkness',
        description:
          'The ever-present dangers of the Umbra threaten those who rest away from Sacred Pyres.',
        rules: [
          'When the party finishes a rest while not near a Sacred Pyre, roll a d12.',
          '1-2: Something monstrous finds them—an adversary initiates conflict.',
          '3-5: Something terrifying stalks nearby—gain 2 Fear.',
          '6-9: Imposing darkness intensifies—gain 1 Fear.',
          '10-11: Rest undisturbed—no effect.',
          '12: A hopeful omen—each PC gains 1 Hope.',
        ],
      },
      {
        id: 'keep-watch',
        name: 'Keep Watch (Downtime Move)',
        description:
          'Parties have access to an additional downtime move to protect against the Umbra.',
        rules: [
          'Keep Watch: Describe how you stay vigilant against what lurks beyond camp.',
          'When the GM makes a Lurking Darkness roll at the end of downtime, you roll your Hope Die and can choose to replace their roll with yours.',
          'If multiple players choose this move, take the highest die roll.',
        ],
      },
      {
        id: 'soul-blight',
        name: 'Soul Blight',
        description:
          'The sundered cycle of the soul curses all who die to rise again as corrupted revenants.',
        rules: [
          'If a humanoid NPC or PC dies, the GM can spend 1 Fear to immediately raise them as a Shambling Zombie.',
          'Alternatively, spend 2 Fear to raise them as a Brawny Zombie.',
          'The risen creature tirelessly seeks to kill everyone they once cared for.',
          'Once destroyed, the blighted soul joins the Umbra. Their features can appear on future Umbra-Touched adversaries.',
        ],
      },
    ],
    incitingIncident: {
      title: 'The Screaming Hunters of Okros',
      description:
        "Within the swampy flood plains of the Idol Hollows, the fort village of Okros has stood resilient for over fifty years. Its massive walls of melted shields and stone encircle the village and central Sacred Pyre, whose flames climb above the tallest ramparts.\n\nRecently, a seismic event conjured a massive sinkhole called the Shalk Chasm, uncovering long-buried structures from before the Old World. One of Okros's hunting bands, led by Huntmaster Evrados, delved into the chasm seeking resources. There, they stumbled upon an eroded, forgotten temple to an obscure Veiled God. The huntmaster was caught by a monster and dragged into the temple depths. Though remaining hunters sought to find him, a terrible odor forced them to withdraw.\n\nWhen the band returned and shared the news, Elder Akadona and the village speakers debated action. Their dispute was interrupted—by Evrados's voice screaming for help from beyond the walls. Scouts couldn't see him in the murky swamp, but the hunting band left the Sacred Pyre's light to rush to their huntmaster's aid. The screams mercifully halted... then broke out again, Evrados's lament joined by the wails of his hunters.\n\nThe denizens of Okros are now terrified. The shrieking never changes or wanes, exemplifying its unearthly nature. Elder Akadona has gathered the party to investigate what happened to the hunters, seeking to save them if possible, and end their suffering if not.",
      hooks: [
        'What monster is responsible for stealing the voices of those missing? What is its connection to the uncovered temple?',
        'Are Huntmaster Evrados and his team beyond rescue, or can they be saved?',
        'The gates of the settlement open, revealing the forlorn willows and mist-choked wetland valley beyond.',
        'What macabre revelations might require reaching out to the Celsians of Amber Reach for aid?',
      ],
    },
    sessionZeroQuestions: [
      {
        id: 'umbra-origin-q1',
        question:
          'If members of the party hail from different communities, why did they leave, and what called them to this particular settlement? Do their home communities still exist?',
        category: 'character',
      },
      {
        id: 'umbra-oracle-q1',
        question:
          'Are any characters burdened with burgeoning oracle sight? If so, what visions have begun to creep into their sleep?',
        category: 'character',
      },
      {
        id: 'umbra-darkness-q1',
        question:
          'What do your characters see when they stare into the inky void of night too long?',
        category: 'character',
      },
      {
        id: 'umbra-lethality-q1',
        question:
          'How deadly does the group wish this campaign to be? Would you enjoy possible churn of many character deaths, or want a more balanced flow where danger is real but not stacked so hard against you?',
        category: 'themes',
      },
    ],
    isTemplate: true,
    worldNotes: '',
  },
  {
    id: 'motherboard',
    name: 'Motherboard',
    complexity: '3',
    pitch:
      "Among the ancient ruins of the fallen world, the great walled cities of the Echo Vale sit as bastions of hope in an otherwise hostile land. Utilizing technology powered by a mysterious language that runs through metal threads tethered high above the valley, these citadels insulate their citizens from the Wastes, where autonomous machines roam wild and massive wandering cities scour the land for scrap. But when a malicious virus infects the machine beasts that work alongside the people of the valley, the once-docile creations turn violent. In a Motherboard campaign, you'll use technology instead of magic as you play extraordinary heroes leaving the safety of the walled cities to travel the Wastes and bring peace to the Vale once more.",
    toneAndFeel: [
      'Adventurous',
      'Epic',
      'Innovative',
      'Mysterious',
      'Post-Post-Apocalyptic',
      'Technological',
    ],
    themes: [
      'Artificial Intelligence',
      'Identity and Personhood',
      'Innovation',
      'Technology vs. Humanity',
    ],
    touchstones: [
      'Horizon Zero Dawn',
      'Mortal Engines',
      'Mad Max: Fury Road',
      'The Final Fantasy Series',
      'Fullmetal Alchemist',
      'Slugblaster',
    ],
    overview:
      "The Echo Vale is so named because its people live among the remains - the 'echoes' - of a fallen civilization and attempt to use ancient technology for new purposes. In the hundreds of years since the fallen ones' mysterious annihilation, the steel and concrete of the old world succumbed to the plants and animals of the valley. Throughout the Echo Vale roam autonomous machines called remnants - some resembling animals, others designed for functions like defense or labor. 'Tame' remnants live within cities, while 'wild' ones roam the Wastes, hunting for energy sources. Above the valley lies the Network, a dense web of glimmering metal wire that shepherds information and communication. At its center stands the Motherboard, from which all threads originate - believed by most to be a god, though some technomancers claim to speak to her in the machine language known as 'kohd.' Recently, a disaster known as the Remnant's Fury - a virus spreading through the Network - caused remnants to attack in the dead of night, threatening all who live under the Network.",
    communityGuidance: [
      {
        id: 'loreborne-motherboard',
        type: 'community',
        name: 'Loreborne',
        description:
          'Many loreborne communities are devoted to the history of the fallen world and the technology they left behind, whether spiritually or practically. Loreborne characters could be experts in machine workings, technomancers attempting to use kohd, or academics studying the history of the fallen civilization. If they have careers in any of these fields, they will be highly sought after wherever they go.',
        questions: [
          "You discovered something about the fallen ones you've never shared with anyone. What secret do you keep?",
          "You've trained as a technomancer for many years, but one thing baffles you about the remnants. What is it?",
          'You have a trick to get any machine up and running. What do you do, and who taught it to you?',
        ],
      },
      {
        id: 'wanderborne-motherboard',
        type: 'community',
        name: 'Wanderborne',
        description:
          "Wanderborne characters may be worshippers of the Motherboard who identify as Pilgrims of the Spire. These devotees leave the cities to traverse the Wastes, facing wild remnants and violent travelers to reach the central spire. Other wanderborne characters are citizens of roaming cities - civilizations ranging from a few homes to massive metropolises that move through the Wastes on mechanicals or atop giant remnants. After the Remnant's Fury, wandering cities atop remnants face a dangerous position: if they can't keep their remnant pacified, they risk losing their entire community.",
        questions: [
          "You're certain you once heard the voice of the Motherboard. What did she tell you?",
          "You don't believe the Motherboard is a god, but you traveled with the Pilgrims anyway. Why?",
          'The Pilgrims of the Spire protect a secret. What is it?',
          "You were part of the team that cares for your city's giant remnant. What do you know about its personality that others don't?",
          "Your wandering city's remnant follows the same path through the valley and will not stray from it. Why is this?",
        ],
      },
      {
        id: 'orderborne-motherboard',
        type: 'community',
        name: 'Orderborne',
        description:
          'In the Echo Vale, most orderborne characters belong to a group focused on protecting a larger community. They might defend a walled or wandering city, or work as contractors hired to hunt and scrap remnants in the Wastes. These characters use their skills for a price - sometimes housing, other times scrap parts, or simply profit. Groups associated with a city often have regimented operations, while contractors who travel the valley are more likely to have unique systems and skills.',
        questions: [
          'You were once a member of a small group of contractors, but now you are stationed in the Argent guard. What made you choose to stay within the walls?',
          'You have a trick for catching and scrapping wild remnants that city officials pay handsomely for. What is it, and who taught it to you?',
          'A loved one was badly injured in an accident during a scrap run. What happened, and why do you feel it was your fault?',
        ],
      },
      {
        id: 'ridgeborne-motherboard',
        type: 'community',
        name: 'Ridgeborne',
        description:
          'The mountains bordering the valley support the spider-like web of the Network, making their peaks neutral territory. All cities are expected to contribute citizens to the Tower Watch, an independent group who tends to the towers and wires and protects the Network from wildlife and weather. Players might choose ridgeborne if they want to build a character who belongs to the Tower Watch or one of the smaller cities that make a home on the cliffs for safety.',
        questions: [
          'Do you consider yourself at home in the lower valley? Why or why not?',
          'There is a secret that only the Tower Watch knows. What is it?',
          'You once saw someone fall from a tower into the Wastes below. What led to this?',
        ],
      },
      {
        id: 'underborne-motherboard',
        type: 'community',
        name: 'Underborne',
        description:
          'The fallen ones not only paved the valley in pliable gray stone, they also dug into the earth and created labyrinthine buildings underground. Underborne characters are likely members of communities that avoid the danger and strife of the valley above in the dark and twisting passages below. These underground cities fiercely protect their few aboveground entry points, but they still face danger from remnants that can dig beneath the earth - in particular, old farming remnants operating in the wild.',
        questions: [
          'The buildings that make up your underground community once had a unified purpose. What do you believe this purpose was?',
          'Members of your community have a unique way of dispatching remnants underground. How do they accomplish this?',
          'Your community protects something important. What is it?',
        ],
      },
    ],
    ancestryGuidance: [
      {
        id: 'clanks-unavailable',
        type: 'ancestry',
        name: 'Clanks',
        description:
          'Clanks are unavailable in a Motherboard campaign. All autonomous robotic beings are remnants, and though they have many unique forms, none have sapience.',
        questions: [],
      },
      {
        id: 'magical-ancestries-tech',
        type: 'ancestry',
        name: 'Magical Ancestries',
        description:
          "Some ancestries in Daggerheart have inherent magical features, like the Drakona's Elemental Breath. Consider how these would manifest in a world where magic comes from technology, then adapt the flavor of each feature accordingly.",
        questions: [],
      },
    ],
    classGuidance: [
      {
        id: 'spellcasters-tech',
        type: 'class',
        name: 'All Classes with Spellcasting',
        description:
          'Rather than magic, characters who use a Spellcasting trait instead utilize technology to carry out their abilities. Some come to technomancy through years of study, while others feel an innate call to the ancient ways. Characters with a spellcasting trait should decide how they utilize technology to mirror spellcraft and consider what tools, processes, or systems they need to accomplish their goals.',
        questions: [],
      },
      {
        id: 'sorcerers-wizards-tech',
        type: 'class',
        name: 'Sorcerers and Wizards',
        description:
          'Since magic is technology in this campaign, sorcerers are biohackers that incorporate technology into their physical form, whereas wizards tinker with what they find and combine programs and machines together to build something new.',
        questions: [],
      },
      {
        id: 'druids-tech',
        type: 'class',
        name: 'Druids',
        description:
          "When druids transform into a Beastform, it wraps around them as a mechanized suit that can enhance their senses, change the way they move, or grant them unique abilities. A druid's Beastform can look similar to the remnants of the Echo Vale or more closely resemble living animals.",
        questions: [],
      },
      {
        id: 'beastbound-rangers',
        type: 'class',
        name: 'Beastbound Rangers',
        description:
          "In a Motherboard campaign, a Beastbound ranger's companion can be a living creature, but organic fauna are considered both rare and valuable within the cities. Alternatively, they may have developed a close relationship with a remnant. Rangers with remnant companions can optionally track corruption from the Remnant's Fury using the Corruption Track mechanic.",
        questions: [],
      },
      {
        id: 'seraphs-motherboard',
        type: 'class',
        name: 'Seraphs',
        description:
          'Generally, seraphs worship the Motherboard as their god, kohd as a holy language, and treat the many programs and pieces of technology that come from them as power imparted by their faith. Others believe there are many gods, known as the Faint Divinities, that live within the Network, shifting their presence to different areas across the vale as needed. Players should determine why their character relates to technology on a spiritual level, rather than simply employing it.',
        questions: [],
      },
      {
        id: 'warriors-ikonis',
        type: 'class',
        name: 'Warriors',
        description:
          "The warrior's 'Combat Training' feature is replaced with 'Ikonis Training': You start with one Force augment already crafted and installed in your Ikonis.",
        questions: [],
      },
    ],
    playerPrinciples: [
      {
        id: 'replace-magic-tech',
        title: 'Replace Magic with Technology',
        description:
          'In a Motherboard campaign, all magic is technology. When your character casts spells, consider how the effect manifests in this world. Each time they use a weapon, consider how to align it with the repurposed and rebuilt technology of the fallen world. Does your character wear gauntlets with a screen that allows them to scroll through their grimoire? Does their staff crackle with electricity? How do they store information from the network when they are not connected?',
        target: 'player',
      },
      {
        id: 'contrast-tech-emotional',
        title: 'Contrast the Technological with the Emotional',
        description:
          "While the Echo Vale is filled with exciting technologies and unique adaptations, it's also filled with people experiencing hardship, fear, and love. As your character travels through the valley, fighting remnants and political adversaries, consider how the wider story affects them personally. Each time your character interacts with new people and technology, consider how they feel about them and take action based on their emotional response.",
        target: 'player',
      },
      {
        id: 'shared-language',
        title: 'Create a Shared Language',
        description:
          "The Echo Vale is built atop an ancient society that perished long ago. The lifestyle and language of the fallen ones was incredibly advanced, yet it still remains obscure to modern people. It's up to you to make a shared lexicon to describe the technology they use, working with the table to determine what your characters do and do not understand about the fallen world. This includes the terminology, application, and meaning of places and objects.",
        target: 'player',
      },
    ],
    gmPrinciples: [
      {
        id: 'ruins-of-tech',
        title: 'Fill the World with the Ruins of Technology',
        description:
          "Because the innovation of the fallen ones was so advanced, the people who live in the Echo Vale today have molded their lives around the technology that remains. Even so, they don't understand it well enough to rebuild the systems that gave the fallen world its immense power. Fill the world with the ruins of state-of-the-art buildings and machines, weather them with centuries of nature's intrusion, and then describe the less-advanced world built among them. You may also want to decide what led to the downfall of the past civilization, then use that to flavor the world they left behind.",
        target: 'gm',
      },
      {
        id: 'fantastical-grounded',
        title: 'Make the Details Fantastical and the Conflicts Grounded',
        description:
          'Though the Echo Vale is filled with fantastical technology that causes large-scale problems, each confrontation should center the struggles of its people, be they cultural, political, or spiritual. Use technology as window dressing for grounded conflict to blend the exciting details of the campaign with personal stakes for each character. You can use the abilities of remnants and the aspects of cities as allegories for the emotional experiences of the party.',
        target: 'gm',
      },
      {
        id: 'tradition-vs-progress',
        title: 'Pit Tradition Against Progress',
        description:
          "There are numerous conflicting ideologies among the cities and travelers of the Echo Vale, but most can be distilled into two schools of thought: Some people want to reject their predecessor's technology, allowing the people of today the chance to define themselves and make their own way in this new world. Others believe they must dig further into the past to harness the powerful machines the fallen world left behind.",
        target: 'gm',
      },
    ],
    distinctions: [
      {
        id: 'technomancy',
        title: 'Technomancy',
        description:
          "Imagine trying to explain our modern technology to our distant ancestors - it would seem like magic. This is how technology from the fallen world should be engaged with and described by the people of the Echo Vale. Reading the ancient language of kohd and pressing buttons on screens to perform supernatural feats is impossible without the Network. People who use technology are known as technomancers, and the way they use technology is only limited by your and your players' imaginations.",
      },
      {
        id: 'the-fallen-world',
        title: 'The Fallen World',
        description:
          'The fallen ones were a powerful people who developed the very systems that likely destroyed them, but the world they left behind is as rich as it is obscure. The shimmering wire Network overhead, steel skyscrapers, concrete buildings, and machines with their own consciousness fill the Echo Vale even as nature works to reclaim it. Here, rivers pass through cities, buildings fill with new growth, and ancient monitors hang on the wall like panes of shattered glass.',
      },
      {
        id: 'the-network',
        title: 'The Network',
        description:
          'A dense web of glimmering metal wire above the valley, shepherding information and communication across disparate cities. Wandering cities and travelers access the Network using tethers - large hooks thrown over the wires. Some technomancers can even intercept Network messages using tethers. Skimmers are ambitious individuals who climb up to the lines and use small hooks to slide along the cables.',
      },
      {
        id: 'remnants',
        title: 'Remnants',
        description:
          "Autonomous machines from the fallen world. Some resemble animals; others were designed for functions like defense, building, or domestic labor. 'Tame' remnants live within cities and gain energy from connections to the Network. 'Wild' ones roam the Wastes, producing energy through photosynthesis, killing other remnants for their power stores, or hunting people to siphon their energy. Some wild remnants are rumored to harvest information from the brains of creatures they kill.",
      },
      {
        id: 'the-motherboard',
        title: 'The Motherboard',
        description:
          "The tallest spire at the center of the Echo Vale from which all Network threads originate. Though no one has ever been able to enter this daunting tower, each city has their own beliefs about its ancient power. Most citizens revere the massive presence within as a god, believing it was worshipped by the fallen civilization. Others believe it is a master program as fallible as any other remnant. Without her operating system, the valley's technology would eventually fail.",
      },
      {
        id: 'kohd-language',
        title: 'Kohd - The Machine Language',
        description:
          'Kohd is the language of the fallen world\'s technology, long a mystery to the people of the Echo Vale. It consists of nodal word glyphs constructed using nine nodes, each representing letters. Each word is a circuit that flows from "Charge" to "Ground." GMs may give players opportunities to learn to decipher and write kohd over the course of a campaign, delivering unreadable Motherboard messages early on and revealing pieces of the language as they progress.',
      },
      {
        id: 'scrap-operations',
        title: 'Scrap Operations',
        description:
          'Because the modern world is built on ruins, it relies on the scraps left behind. Salvagers venture into the wastes to unearth ancient technology and hunt remnants for parts. Scrappers process and sell parts for mechanical repair and technomancy. Scrap shacks are often illegal businesses, though some cities require all parts to pass through government hands first. Mechanists and scrap hackers repair machines, while technomancers work with datacraft.',
      },
      {
        id: 'quantum-currency',
        title: 'Quantum',
        description:
          "Quantum is the currency that runs the Echo Vale's economy. How much quantum a person has is generally stored on a small black disc that can be inserted into devices throughout the valley. People often decorate and personalize their discs to distinguish them from one another. 10 quantum equals 1 handful of gold.",
      },
      {
        id: 'wandering-cities',
        title: 'Wandering Cities',
        description:
          'Wandering cities are a true testament to ingenuity. Most precariously balance atop a remnant or a specially crafted vehicle piloted by a driver or team. Notable examples include Carrowcroft Walkaway (a behemoth with layers of buildings atop a walking machine, guns jutting out at all angles), the May Trader Caravan (ragtag vehicles hunting wild remnants), the Library (built atop a spider-like remnant, protecting fallen world information), and Nereidus (a centipede-like ship with hundreds of oars snaking through coastal waters).',
      },
      {
        id: 'walled-cities',
        title: 'Walled Cities',
        description:
          "Most stationary cities were built into ancient ruins with new walls constructed around their borders. Argent is a heavily stratified city with the most well-preserved skyscrapers and largest collection of tame remnants - its Priv has sent messengers to all walled cities seeking to unify against the Remnant's Fury. Calcarus is a single ancient skyscraper filled with its own small forest. The Northern Oracle hosts a massive amphitheater of screens where the High Oracle claims to speak to the Motherboard. Switch Withawick is entirely underground, its citizens sensitive to light.",
      },
    ],
    mechanics: [
      {
        id: 'tech-damage',
        name: 'Tech Damage',
        description:
          'In a Motherboard campaign, magic damage is instead called tech damage. This damage is caused by technomancy - it might be a piercing shrill, a concussive blast, a blinding flash, swarming nanobots, a drone emitting a high-powered plasma beam, or any other product of supremely advanced technology.',
        rules: [],
      },
      {
        id: 'ikonis-weapons',
        name: 'Ikonis',
        description:
          'Characters receive a personalized weapon known as an Ikonis, given to citizens of the Echo Vale when they come of age. It starts as a simple rod of metal designed to receive modifications as the bearer ages, shaped according to their needs - a staff with webs of colorful wire, an ornate bow humming with energy, a heavy hammer, or a spear with knobs and triggers.',
        rules: [
          'All Ikonis are two-handed weapons with the Bonded feature: Gain a bonus to your damage rolls equal to your level.',
          'Start with 2 Augment slots at Tier 1, gaining one additional slot at each subsequent tier.',
          'Augments can be crafted as a downtime move when PCs have the scrap to do so.',
          'While installed, augments are treated as additional features for that weapon.',
          'Warriors start with one Force augment already crafted and installed (Ikonis Training feature).',
        ],
      },
      {
        id: 'augments',
        name: 'Augments',
        description:
          'Augments are modifications that can be installed in an Ikonis to grant additional features. PCs can build as many augments as they like, but can only install a number equal to their available Augment slots.',
        rules: [
          'Augments are crafted during downtime when sufficient scrap is available.',
          'Some augments have precompiles (prerequisites) such as being a certain tier, having specific traits, or belonging to a particular class.',
          'Augments can be freely swapped during downtime.',
          'Augments can always be broken back into their scrap for parts as needed.',
        ],
      },
      {
        id: 'network-tether',
        name: 'Network Tether',
        description:
          'Each PC adds a Network tether to their inventory at character creation. Tethers are typically large hooks attached to a data cable that allow travelers to toss the hook onto an overhead wire to charge their technology and gain access to the Network while moving through the Wastes.',
        rules: [
          'PCs must have access to the Network, via a tether or other means, to perform downtime moves.',
          'Tethers can be used to charge technology away from cities.',
          'Some technomancers can intercept Network messages using tethers with specialized equipment.',
        ],
      },
      {
        id: 'scrap-economy',
        name: 'Crafting and Trading with Scrap',
        description:
          'Gold is not used as currency. Instead, PCs gather scrap to trade for quantum. There are three categories of scrap: Shards (d6), Metals (d8), and Components (d10). When PCs defeat remnant adversaries, they roll dice to determine what scrap they receive.',
        rules: [
          'Shards (d6): 1=Gear, 2=Coil, 3=Wire, 4=Trigger, 5=Lens, 6=Crystal',
          'Metals (d8): 1=Aluminum, 3=Copper, 5=Cobalt, 6=Silver, 7=Platinum, 8=Gold',
          'Components (d10): 1=Fuse, 3=Circuit, 6=Disc, 8=Relay, 9=Capacitor, 10=Battery',
          '10 quantum = 1 handful of gold, 100 quantum = 1 bag of gold, 1000 quantum = 1 chest of gold.',
          'Relics are unique scrap from powerful remnants, worth 20 quantum each.',
          'All PCs start with 5 quantum.',
        ],
      },
      {
        id: 'scrap-rewards',
        name: 'Scrap Reward Table',
        description:
          'The GM determines scrap rewards after encounters based on difficulty and number of remnants.',
        rules: [
          'A few remnants, Easy fight: 2 Shards each',
          'A few remnants, Standard fight: 2 Shards, 1 Metal each',
          'Mostly remnants, Standard fight: 2 Shards, 2 Metals, 1 Component each',
          'All remnants, Very Difficult fight: 4 Shards, 3 Metals, 3 Components each',
          'Local scrap shacks trade scrap for quantum at face value (die result = quantum value).',
        ],
      },
      {
        id: 'corruption-track',
        name: 'Optional: Remnant Companion Corruption Track',
        description:
          "Beastbound rangers with a remnant companion can use these optional rules to make the remnant subject to the same threat of corruption from the Remnant's Fury.",
        rules: [
          'Record a Corruption track on the Companion sheet.',
          'At the beginning of downtime, the ranger rolls their Fear Die. On a 1, mark a Corruption and describe the temporary glitch.',
          'Specialized technomancers may be able to temporarily repair the remnant (clearing 1d4 Corruption).',
          'The only way to truly save them is to stop the malicious virus coming from the Motherboard.',
          "If the companion's last Corruption is marked, the remnant becomes violent and can no longer be commanded or repaired.",
        ],
      },
    ],
    incitingIncident: {
      title: 'The Scrap Factory Massacre',
      description:
        "After the outbreak of the Remnant's Fury, Argent's city guard scrambled to subdue violent machines. But wave after wave succumbed to the malicious virus, and politicians grew desperate to avoid widespread fear.\n\nPriv Maelor Rhodek, the city's charismatic leader, sent a messenger to assemble a team with skill and experience to handle remnants, go undercover as civilians in the machinists' Build Sector, and figure out what's causing the attacks.\n\nPriv Rhodek gives her word that any scrap acquired while protecting the city is theirs to keep. In return, she asks that they collect as many remnant cores as possible so her technomancers can diagnose the cause of violence. She also gives the party the name of a surprising contact: Mac the Scrap Jack, who runs an illegal scrap operation.\n\nMac gives the party a Hotspot - an illegal device that can be carried as a backpack and, when set down and activated, stalls nearby remnants for a few moments. He also makes an offer: save one remnant core and bring it to him instead of Rhodek. He'll pay quantum and let them look at the data to see what's 'causing all this ruckus with the rems.'",
      hooks: [
        'Will the party bring all cores to Priv Rhodek, or save one for Mac and risk trouble from the city guard?',
        'Does the party have compassion for once-tame remnants, or dispose of them indiscriminately?',
        "Will they talk to factory workers to learn more about the Remnant's Fury?",
        "If they perform well, will Priv Rhodek reveal more about the Motherboard's involvement?",
        "Carrowcroft Walkaway has had its sights on Argent's technology for decades. There's a rumor they somehow infiltrated the Motherboard and initiated the virus.",
      ],
    },
    sessionZeroQuestions: [
      {
        id: 'remnant-relationship',
        question:
          "What is your character's relationship with remnants? How do they rely on them?",
        category: 'character',
      },
      {
        id: 'tech-daily-life',
        question:
          "How did your character use technology or technomancy in their daily life before the Remnant's Fury? What, if anything, has changed since that catastrophic event?",
        category: 'character',
      },
      {
        id: 'fallen-structure',
        question:
          'Describe a structure built by the fallen civilization that your character has seen before. What do you think it was originally used for? What is it used for now?',
        category: 'world',
      },
      {
        id: 'remnant-deterioration',
        question:
          'How do remnants physically change as they begin to deteriorate into violence?',
        category: 'world',
      },
      {
        id: 'wandering-city-visit',
        question:
          'Describe a wandering city your character once visited. What was unique about it?',
        category: 'world',
      },
    ],
    isTemplate: true,
    worldNotes: '',
  },
  {
    id: 'colossus-drylands',
    name: 'Colossus of the Drylands',
    complexity: '4',
    pitch:
      "The Drylands were a place that put the old stories aside. While superstitious miners have long said that the crystals growing wild in this desert are made from the very life-essence of Forgotten Gods, the folk around here had real work to do, and actual deities were left for campfire stories. That is, until a massive colossus answered the call of something ancient and apocalyptic, rising from the earth and devastating the lands. In a Colossus of the Drylands campaign, you'll play a heroic posse of mavericks who must save their home from a legion of colossi and a primordial god seeking vengeance.",
    toneAndFeel: [
      'Awe-Inspiring',
      'Dusty',
      'Eerie',
      'Gritty',
      'Larger than Life',
      'Terrifying',
    ],
    themes: [
      'Breaking Cycles',
      'The Burden of Heroism',
      'Faith vs. Doubt',
      'Greed',
      'Ordinary People Accomplishing the Extraordinary',
    ],
    touchstones: [
      'Shadow of the Colossus',
      'Red Dead Redemption',
      'Deadlands',
      'On the Shoulders of Colossus',
    ],
    overview:
      "Deep beneath Godfell Mountain, Kudamat the First Doom - a Forgotten God - struggles to break free of his confinement. The numerous veins of essentia running from the mountain come from his power. When the New Gods defeated the Forgotten Gods in the Earliest Age, they split Kudamat's being into nine soul shards and tasked mortals with hiding them. Now Kudamat has found his shards and is siphoning power to restore his godhood, creating colossal guardians - the Children of Godfell - to protect each shard while he grows stronger. If left unchecked, he will reclaim all nine shards and break free to bring doom to this world.",
    communityGuidance: [
      {
        id: 'loreborne-drylands',
        type: 'community',
        name: 'Loreborne',
        description:
          'Many hold fervent beliefs about the Forgotten Gods, New Gods, and essentia crystals. Loreborne take a scholarly or evangelical approach - some follow the "forgotten ways" using raw essentia, others abstain entirely believing it profanity to the New Gods.',
        questions: [
          'What were you taught about the origins of the Mortal Realm, and how did colossi emerging affect that worldview?',
          "Kudamat's return changed many beliefs, but not yours. What past experience makes your faith unshakeable?",
          'You refuse essentia magic because you follow the "new ways." How has devotion to the New Gods helped or hindered you?',
        ],
      },
      {
        id: 'orderborne-drylands',
        type: 'community',
        name: 'Orderborne',
        description:
          'Sheriffs and deputies are often the most powerful members of their town, usually in the pocket of rich essentia moguls. Other orderborne are organized outlaw bands - some with moral goals, others just needing crystals to sell.',
        questions: [
          'What incident during your time working for the sheriff prepared you to help panicking civilians?',
          'You and your posse have killed to get what you need. What rules do you have about who you will never harm?',
          'You once took a bribe to do something you regret. What happened and what was your reward?',
        ],
      },
      {
        id: 'highborne-drylands',
        type: 'community',
        name: 'Highborne',
        description:
          'Most true highborne come from elsewhere, seeking to enrich themselves using essentia industries. Some were born into wealth; others are fallen business owners forced to move out for their "next big venture."',
        questions: [
          "What disaster befell your family's fortune that precipitated your move to the Drylands?",
          'What local custom do you find refreshing that people from home would balk at?',
          'How have your highborne affectations gotten you in trouble in the Drylands?',
        ],
      },
      {
        id: 'ridgeborne-underborne-drylands',
        type: 'community',
        name: 'Ridgeborne and Underborne',
        description:
          'Both communities thrive in this region of mountains, mines, and high deserts. Some ridgeborne are bold enough to live on Godfell Mountain itself. Underborne essentia miners create small communities who spend most of their life excavating crystals - one of the most dangerous yet common jobs.',
        questions: [
          'You were born in the Drylands. What do you know about this land that new prospectors will never understand?',
          'You are afraid of the dark but venture into mines every day. What keeps you going back?',
          'You found something unexpected near Godfell Mountain. What was it and who did you tell?',
        ],
      },
      {
        id: 'slyborne-drylands',
        type: 'community',
        name: 'Slyborne',
        description:
          'The Drylands appeal to those seeking fortune from exploitation. Some are bad actors wanting quick riches through fake land sales or snake oil. Others like the "Harlan Family" work to stop major operations from stripping essentia from the desert.',
        questions: [
          'What darkness in your past did you attempt to leave behind when coming to the Drylands?',
          "You once betrayed a close accomplice. What happened and why haven't you spoken since?",
          'You had to go through a terrifying initiation to join your posse. What did you do and how has it changed you?',
        ],
      },
      {
        id: 'wanderborne-drylands',
        type: 'community',
        name: 'Wanderborne',
        description:
          'Wanderborne are just as likely to originate from within the region as elsewhere. Some communities are as old as Godfell Mountain with stores of essentia they visit across the desert. Others are new groups of unprepared prospectors more likely to die by sun or snake than find ease.',
        questions: [
          'What common practice of outpost living do you find utterly baffling or uncomfortable?',
          'You have a small cache of emergency items hidden in the desert. What did you hide?',
          'You used to live in an outpost but something terrible happened. What happened and why will you never return?',
        ],
      },
    ],
    ancestryGuidance: [
      {
        id: 'all-ancestries-drylands',
        type: 'ancestry',
        name: 'All Ancestries',
        description:
          'Many folks of all ancestries profess to feel the presence of essentia in the ground - especially while Kudamat siphons power from his soul shards. Some use these claims to get high-paying positions in mining operations.',
        questions: [],
      },
      {
        id: 'clanks-drylands',
        type: 'ancestry',
        name: 'Clanks',
        description:
          'Clanks are powered by essentia. Consider how your character regularly obtains this resource and what happens if they cannot get enough.',
        questions: [],
      },
      {
        id: 'infernis-drylands',
        type: 'ancestry',
        name: 'Infernis',
        description:
          "Consider how your character's relationship with their heritage from the demons of the Circles Below plays into the various faiths of the Drylands.",
        questions: [],
      },
      {
        id: 'amphibious-ancestries-drylands',
        type: 'ancestry',
        name: 'Fungril, Galapa, and Ribbets',
        description:
          'Those native to the Drylands are adapted to the desert. Others commonly live near the few lakes or devise systems to travel with large amounts of water.',
        questions: [],
      },
    ],
    classGuidance: [
      {
        id: 'druids-drylands',
        type: 'class',
        name: 'Druids',
        description:
          'Druids in the Drylands are more equipped than many to navigate the inhospitable environment. They are familiar with unique qualities of desert flora and fauna, and their spells and abilities reflect that.',
        questions: [],
      },
      {
        id: 'rangers-drylands',
        type: 'class',
        name: 'Rangers',
        description:
          'Many rangers are "lone riders" who prefer only their mount\'s company, riding from outpost to outpost. They are often defenders of the weak who stand up against local law enforcement.',
        questions: [],
      },
      {
        id: 'seraphs-drylands',
        type: 'class',
        name: 'Seraphs',
        description:
          'Many seraphs have strong relationships with faith, worshiping Forgotten Gods (like Kudamat) or New Gods. This affects their relationship with essentia - the former use crystals prolifically, the latter may have fraught relationships with magic.',
        questions: [],
      },
      {
        id: 'syndicate-rogue-drylands',
        type: 'class',
        name: 'Syndicate Rogue',
        description:
          'These rogues often operate as deputies, mining operation overseers, or outlaw posse members. It takes a master of charm, negotiation, and clandestine activity to accomplish their covert goals.',
        questions: [],
      },
    ],
    playerPrinciples: [
      {
        id: 'embrace-drylands',
        title: 'Embrace the Drylands',
        description:
          'Consider how your place in the Drylands impacts your aesthetics and approach. Find reasons to love the land despite its harshness as you work desperately to protect it.',
        target: 'player',
      },
      {
        id: 'face-unstoppable',
        title: 'Face the Unstoppable',
        description:
          'You stand against creatures taller than the largest buildings whose destructive power matches the most devastating natural disasters. Decide what makes you equipped to destroy colossi and what is personally at stake should you fail.',
        target: 'player',
      },
      {
        id: 'navigate-faith',
        title: 'Navigate Your Faith',
        description:
          'Consider the beliefs you held before the first colossus rose and how they might have changed since. Some believe gods never existed, others worship Forgotten Gods using essentia, still others commit crimes to close mines in the name of New Gods.',
        target: 'player',
      },
      {
        id: 'ride-like-wind',
        title: 'Ride Like the Wind',
        description:
          'Just about everyone born in the Drylands can ride a mount from when they could walk. Choose your mount - horse, buffalo, bear, dire wolf, giant lizard, shadow beast, or something else. The colossal children of a vengeful god are rising, and you have no time to waste.',
        target: 'player',
      },
    ],
    gmPrinciples: [
      {
        id: 'contrast-mundane-extraordinary',
        title: 'Contrast the Mundane and the Extraordinary',
        description:
          'Before the first colossus, things were ordinary - folks sought fortunes, spent earnings at the bar, kept their mounts fed. Now apocalyptic foes threaten the land, yet debt collectors still come and refineries still hunger for fuel. The cataclysmic becomes more apocalyptic when juxtaposed against mundane moments.',
        target: 'gm',
      },
      {
        id: 'emphasize-scope-scale',
        title: 'Emphasize Scope and Scale',
        description:
          'The Drylands are big. Mesas are massive, the sky stretches endlessly, darkness of nights feels infinite. Confrontations with colossi should remind players they are but ants to them. A single footstep could level a town. Let both colossi and landscape feel immense.',
        target: 'gm',
      },
      {
        id: 'colossi-allegory',
        title: 'Make Colossi an Allegory for Personal Woe',
        description:
          "Colossi are destructive beings but can serve as allegories for PCs' personal journeys. Use them to address campaign themes informed by PC choices and backstories. Note themes or struggles players want to highlight - then make them gigantic.",
        target: 'gm',
      },
      {
        id: 'creative-solutions',
        title: 'Offer Chances for Creative Solutions to Colossal Problems',
        description:
          'Some players will simply climb and stab until colossi die. Others will devise elaborate plans, traps, or even attempt to tame them. Each colossus should have unique personality, physicality, and weakness that encourages ingenuity.',
        target: 'gm',
      },
    ],
    distinctions: [
      {
        id: 'children-of-godfell',
        title: 'The Children of Godfell',
        description:
          "Each of Kudamat's nine soul shards are protected by a colossus - physical manifestations of the god's will formed from elements of the shard's surroundings, each unique in personality, form, and capabilities. Examples include Aandira the One Who Devours, Aikar Shepherd of the Meek, Aphedos the Creeping Darkness, Balorma the Blooming Hornwolf, and Chakantis He Who Knows the End.",
      },
      {
        id: 'soul-shards',
        title: 'The Soul Shards',
        description:
          'Nine pieces of Kudamat hidden by mortals in the Earliest Age. Regions overrun with aberrations and supercharged essentia indicate a shard nearby. Once a colossus is slain, the soul shard shatters, causing essentia to erupt in a mile radius. Destroying shards prevents Kudamat from absorbing further power.',
      },
      {
        id: 'essentia',
        title: 'Essentia',
        description:
          'Crystals of power formed from the bleeding essence of trapped Forgotten Gods. All magic in the Drylands is powered by essentia - without crystals or batteries, magic users cannot access this power. Manufactured essentia cells are now widely available, making magic more accessible and the Drylands increasingly wealthy.',
      },
      {
        id: 'aberrations',
        title: 'The Aberrations',
        description:
          'Terrible beasts emerging from divine power surging through essentia veins. Smaller than colossi but share the same goal: keep all creatures away from soul shards. Some resemble the colossi they serve, wielding similar forms or abilities.',
      },
      {
        id: 'drylands-outposts',
        title: 'Drylands Outposts',
        description:
          "Settlements ranging from small encampments to bustling towns - always called 'outposts' because everyone knows that once local essentia veins are cleaned out, the town will be packed up overnight. Notable outposts include the Cinderline, Havalaugh, the Iron Kettle, Pryor, and Defiance.",
      },
    ],
    mechanics: [
      {
        id: 'firearms',
        name: 'Firearms',
        description:
          'The Drylands have developed firearms powered by essentia. Revolvers (Finesse, Far range, d6+tier damage), Rifles (Agility, Very Far range, d8+tier damage), and Shotguns (Strength, Very Close range, d6+tier damage) are available as primary weapons.',
        rules: [
          'Revolver: Six Shot - place 6 Ammo tokens, spend 1 to attack, mark Stress to regain all tokens.',
          'Rifle: Sightline - spend 2 Hope to gain advantage on attack roll.',
          'Shotgun: Scattershot - target all creatures in front within range.',
        ],
      },
      {
        id: 'dynamite',
        name: 'Dynamite',
        description:
          'Consumable explosive. Toss within Close range. All creatures within Very Close of landing must make Reaction Roll (14). Fail: 1d20+5 physical damage. Succeed: mark a Stress. Deals double damage to inanimate objects or structures.',
        rules: [],
      },
      {
        id: 'lasso-weapon',
        name: 'Lasso Secondary Weapon',
        description:
          'Agility, Very Close range, d4+tier damage. On successful attack, can Rope target instead of dealing damage - target is Restrained and Vulnerable while you remain within Very Close range. Make Strength Reaction Roll to keep them Roped when they try to clear.',
        rules: [],
      },
      {
        id: 'hunts-interludes',
        name: 'Hunts and Interludes',
        description:
          'Play alternates between two distinct phases. During hunt phases (lasting days to a week), the colossus threat should always feel present as Kudamat siphons power. During interlude phases (lasting days to weeks), PCs take on smaller personal tasks throughout the region.',
        rules: [
          'Hunt phase: Riding into outposts, gathering information, saving innocents from aberrations, tracking and battling colossi.',
          'Interlude phase: Taking on personal tasks - stopping bandits, finding missing trains, investigating strange occurrences.',
        ],
      },
      {
        id: 'colossus-adversaries',
        name: 'Colossal Adversaries',
        description:
          'Colossi use multiple segment stat blocks (legs, arms, torso, head, etc.) within a colossus framework. Segments can be Broken (cannot act) or Destroyed (no longer functions). Defeat requires destroying all segments or finding alternative victory conditions.',
        rules: [
          'PCs on a segment have advantage on attacks against it.',
          'Segment standard attacks cannot target PCs currently on that segment.',
          'PCs may initiate any number of Tag Team Rolls during colossus fights.',
          'Build colossi as puzzles - require destroying certain segments first, exploit weaknesses, or use specific weapons.',
          'Use notecards to represent colossus segments for spatial awareness.',
        ],
      },
      {
        id: 'emergence-of-kudamat',
        name: 'Emergence of Kudamat',
        description:
          "Track Kudamat's power as the campaign progresses using the Siphoning Track. Each rest during hunts marks the track. When a colossus is defeated or the track fills, roll d12s equal to marked slots and add the highest value to Kudamat's Power.",
        rules: [
          "When all nine colossi are slain or Kudamat's Power reaches 100, he emerges from Godfell Mountain.",
          'Build Kudamat as a Colossus with Severe threshold equal to his Power value and Major threshold equal to half (rounded up).',
          'PCs level up immediately upon defeating each colossus - reaching level 10 after all nine are defeated.',
        ],
      },
    ],
    incitingIncident: {
      title: 'The First Colossus',
      description:
        "When the first colossus rose outside Wyllin's Gulch, most people spent a considerable amount of time panicking. The sheriff raised a small army to fight it, a band of brave miners piled old equipment in its path, and the factories shuttered to protect their stores of essentia. But every effort was ineffective in stopping the massive creature's path of destruction.\n\nAfter seeing most of his deputies die in a single crushing blow, Mayor Logan Hartly put out an ad: 'Help Wanted. Whoever can dispatch the colossus and its pack of aberrations will receive a chest of fully processed essentia.' It's a good deal for anyone who can fight the gigantic force of nature and live to tell the tale.\n\nMeanwhile, Baron Ryder Destry learned that Kudamat's efforts to siphon power have supercharged the essentia veins, making the stones ten times as valuable. He's offering 'an army's supply of powerful essentia' to anyone who will collaborate with the colossus to stand guard around the soul shard until Kudamat completes his ritual. He swears his factory guard can keep Wyllin's Gulch safe while he mines the powerful essentia day and night.",
      hooks: [
        "Will the party take Mayor Hartly's offer to destroy the colossus, or give up the effort to stand alongside it while Destry mines supercharged essentia?",
        'Can they play both sides?',
        'Will Hartly keep her word if they manage to topple the colossus?',
        "Can the party kill the massive creation before it destroys Wyllin's Gulch or the smaller outposts nearby?",
        'Once they destroy this colossus, are the stories true - will another rise to fulfill the Prophecy of the Drylands?',
      ],
    },
    sessionZeroQuestions: [
      {
        id: 'native-or-newcomer',
        question:
          'Is your character native to the Drylands or did they come from elsewhere? How have they been treated by locals and incoming prospectors?',
        category: 'character',
      },
      {
        id: 'favorite-geography',
        question:
          "What is your character's favorite thing about the Drylands geography? Do they have a notable landmark they are drawn to?",
        category: 'character',
      },
      {
        id: 'colossus-loss',
        question:
          'Since the rise of the colossi, who or what has your character lost, and how did that event change them?',
        category: 'character',
      },
      {
        id: 'kudamat-prosperity',
        question:
          'Some believe Kudamat will bring prosperity when he rises. Does your character believe this? How do they interact with people who do?',
        category: 'world',
      },
      {
        id: 'past-outpost',
        question:
          'Describe an outpost your character visited in the past. What did they love about it? What worried them?',
        category: 'world',
      },
      {
        id: 'aberrations-seen',
        question:
          'What terrors has your character seen roaming the desert now that Kudamat is raising ever more aberrations?',
        category: 'world',
      },
      {
        id: 'themes-colossi',
        question:
          'What themes are you most interested in exploring with your character, and how might they manifest in some of the colossi?',
        category: 'themes',
      },
    ],
    isTemplate: true,
    worldNotes: '',
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
