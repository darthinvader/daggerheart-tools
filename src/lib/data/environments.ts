import type { Environment } from '../schemas/environments';

export const ENVIRONMENTS: Environment[] = [
  {
    name: 'Abandoned Grove',
    tier: '1',
    type: 'Exploration',
    description:
      'A former druidic grove lying fallow and fully reclaimed by nature.',
    impulses: ['Draw in the curious', 'Echo the past'],
    difficulty: 11,
    potentialAdversaries: [
      'Beasts (Bear, Dire Wolf, Glass Snake)',
      'Grove Guardians (Minor Treant, Sylvan Soldier, Young Dryad)',
    ],
    features: [
      'Overgrown Battlefield - Passive: There has been a battle here. A PC can make an Instinct Roll to identify evidence of that fight. On a success with Hope, learn all three pieces of information below. On a success with Fear, learn two. On a failure, a PC can mark a Stress to learn one and gain advantage on the next action roll to investigate this environment. A PC with an appropriate background or Experience can learn an additional detail and ask a follow-up question about the scene and get a truthful (if not always complete) answer. Details: Traces of a battle (broken weapons and branches, gouges in the ground) litter the ground. A moss-covered tree trunk is actually the corpse of a treant. Still-standing trees are twisted in strange ways, as if by powerful magic.',
      'Barbed Vines - Action: Pick a point within the grove. All targets within Very Close range of that point must succeed on an Agility Reaction Roll or take 1d8+3 physical damage and become Restrained by barbed vines. Restrained creatures are freed with a successful Finesse or Strength roll or by dealing at least 6 damage to the vines.',
      'You Are Not Welcome Here - Action: A Young Dryad, two Sylvan Soldiers, and a number of Minor Treants equal to the number of PCs appear to confront the party for their intrusion.',
      'Defiler - Action: Spend a Fear to summon a Minor Chaos Elemental drawn to the echoes of violence and discord. They appear within Far range of a chosen PC and immediately take the spotlight.',
    ],
  },
  {
    name: 'Ambushed',
    tier: '1',
    type: 'Event',
    description: 'An ambush is set to catch an unsuspecting party off-guard.',
    impulses: ['Overwhelm', 'Scatter', 'Surround'],
    difficulty: 'Special (see "Relative Strength")',
    potentialAdversaries: ['Any'],
    features: [
      'Relative Strength - Passive: The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
      'Surprise! - Action: The ambushers reveal themselves to the party, you gain 2 Fear, and the spotlight immediately shifts to one of the ambushing adversaries.',
    ],
  },
  {
    name: 'Ambushers',
    tier: '1',
    type: 'Event',
    description:
      'An ambush is set by the PCs to catch unsuspecting adversaries off-guard.',
    impulses: ['Escape', 'Group up', 'Protect the most vulnerable'],
    difficulty: 'Special (see "Relative Strength")',
    potentialAdversaries: ['Any'],
    features: [
      'Relative Strength - Passive: The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
      'Where Did They Come From? - Reaction: When a PC starts the ambush on unsuspecting adversaries, you lose 2 Fear and the first attack roll a PC makes has advantage.',
    ],
  },
  {
    name: 'Bustling Marketplace',
    tier: '1',
    type: 'Social',
    description:
      'The economic heart of the settlement, with local artisans, traveling merchants, and patrons across social classes.',
    impulses: [
      'Buy low and sell high',
      'Tempt and tantalize with wares from near and far',
    ],
    difficulty: 10,
    potentialAdversaries: [
      'Guards (Bladed Guard, Head Guard)',
      'Masked Thief',
      'Merchant',
    ],
    features: [
      'Tip the Scales - Passive: PCs can gain advantage on a Presence Roll by offering a handful of gold as part of the interaction.',
      'Unexpected Find - Action: Reveal to the PCs that one of the merchants has something they want or need, such as food from their home, a rare book, magical components, a dubious treasure map, or a magical key.',
      "Sticky Fingers - Action: A thief tries to steal something from a PC. The PC must succeed on an Instinct Roll to notice the thief or lose an item of the GM's choice as the thief escapes to a Close distance. To retrieve the stolen item, the PCs must complete a Progress Countdown (6) to chase down the thief before the thief completes a Consequence Countdown (4) and escapes to their hideout.",
      'Crowd Closes In - Reaction: When one of the PCs splits from the group, the crowds shift and cut them off from the party.',
    ],
  },
  {
    name: 'Cliffside Ascent',
    tier: '1',
    type: 'Traversal',
    description:
      'A steep, rocky cliffside tall enough to make traversal dangerous.',
    impulses: [
      'Cast the unready down to a rocky doom',
      'Draw people in with promise of what lies at the top',
    ],
    difficulty: 12,
    potentialAdversaries: [
      'Construct',
      'Deeproot Defender',
      'Giant Scorpion',
      'Glass Snake',
    ],
    features: [
      'The Climb - Passive: Climbing up the cliffside uses a Progress Countdown (12). It ticks down according to the following criteria when the PCs make an action roll to climb: Critical Success: Tick down 3. Success with Hope: Tick down 2. Success with Fear: Tick down 1. Failure with Hope: No advancement. Failure with Fear: Tick up 1. When the countdown triggers, the party has made it to the top of the cliff.',
      'Pitons Left Behind - Passive: Previous climbers left behind large metal rods that climbers can use to aid their ascent. If a PC using the pitons fails an action roll to climb, they can mark a Stress instead of ticking the countdown up.',
      "Fall - Action: Spend a Fear to have a PC's handhold fail, plummeting them toward the ground. If they aren't saved on the next action, they hit the ground and tick up the countdown by 2. The PC takes 1d12 physical damage if the countdown is between 8 and 12, 2d12 between 4 and 7, and 3d12 at 3 or lower.",
    ],
  },
  {
    name: 'Local Tavern',
    tier: '1',
    type: 'Social',
    description: 'A lively tavern that serves as the social hub for its town.',
    impulses: ['Provide opportunities for adventurers', 'Nurture community'],
    difficulty: 10,
    potentialAdversaries: [
      'Guards (Bladed Guard, Head Guard)',
      'Mercenaries (Harrier, Sellsword, Spellblade, Weaponmaster)',
      'Merchant',
    ],
    features: [
      "What's the Talk of the Town? - Passive: A PC can ask the bartender, staff, or patrons about local events, rumors, and potential work with a Presence Roll. On a success, they can pick two of the below details to learn—or three if they critically succeed. On a failure, they can pick one and mark a Stress as the local carries on about something irrelevant. Details: A fascinating rumor with a connection to a PC's background. A promising job for the party involving a nearby threat or situation. Local folklore that relates to something they've seen. Town gossip that hints at a community problem.",
      'Sing For Your Supper - Passive: A PC can perform one time for the guests by making a Presence Roll. On a success, they earn 1d4 handfuls of gold (2d4 if they critically succeed). On a failure, they mark a Stress.',
      'Mysterious Stranger - Action: Reveal a stranger concealing their identity, lurking in a shaded booth.',
      "Someone Comes to Town - Action: Introduce a significant NPC who wants to hire the party for something or who relates to a PC's background.",
      'Bar Fight! - Action: Spend a Fear to have a bar fight erupt in the tavern. When a PC tries to move through the tavern while the fight persists, they must succeed on an Agility or Presence Roll or take 1d6+2 physical damage from a wild swing or thrown object. A PC can try to activate this feature by succeeding on an action roll that would provoke tavern patrons.',
    ],
  },
  {
    name: 'Outpost Town',
    tier: '1',
    type: 'Social',
    description:
      'A small town on the outskirts of a nation or region, close to a dungeon, tombs, or other adventuring destinations.',
    impulses: [
      'Drive the desperate to certain doom',
      'Profit off of ragged hope',
    ],
    difficulty: 12,
    potentialAdversaries: [
      'Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper)',
      'Masked Thief',
      'Merchant',
    ],
    features: [
      "Rumors Abound - Passive: Gossip is the fastest-traveling currency in the realm. A PC can inquire about major events by making a Presence Roll. What they learn depends on the outcome of their roll: Critical Success: Learn about two major events. The PC can ask one follow-up question about one of the rumors and get a truthful (if not always complete) answer. Success with Hope: Learn about two events, at least one of which is relevant to the character's background. Success with Fear: Learn an alarming rumor related to the character's background. Any Failure: The locals respond poorly to their inquiries. The PC must mark a Stress to learn one relevant rumor.",
      'Society of the Broken Compass - Passive: An adventuring society maintains a chapterhouse here, where heroes trade boasts and rumors, drink to their imagined successes, and scheme to undermine their rivals.',
      'Rival Party - Passive: Another adventuring party is here, seeking the same treasure or leads as the PCs.',
      "It'd Be a Shame If Something Happened to Your Store - Action: The PCs witness as agents of a local crime boss shake down a general goods store.",
      'Wrong Place, Wrong Time - Reaction: At night, or when the party is alone in a back alley, you can spend a Fear to introduce a group of thieves who try to rob them. The thieves appear at Close range of a chosen PC and include a Jagged Knife Kneebreaker, as many Lackeys as there are PCs, and a Lieutenant. For a larger party, add a Hexer or Sniper.',
    ],
  },
  {
    name: 'Raging River',
    tier: '1',
    type: 'Traversal',
    description:
      'A swift-moving river without a bridge crossing, deep enough to sweep away most people.',
    impulses: ['Bar crossing', 'Carry away the unready', 'Divide the land'],
    difficulty: 10,
    potentialAdversaries: [
      'Beasts (Bear, Glass Snake)',
      'Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper)',
    ],
    features: [
      'Dangerous Crossing - Passive: Crossing the river requires the party to complete a Progress Countdown (4). A PC who rolls a failure with Fear is immediately targeted by the "Undertow" action without requiring a Fear to be spent on the feature.',
      'Undertow - Action: Spend a Fear to catch a PC in the undertow. They must make an Agility Reaction Roll. On a failure, they take 1d6+1 physical damage and are moved a Close distance down the river, becoming Vulnerable until they get out of the river. On a success, they must mark a Stress.',
      'Patient Hunter - Action: Spend a Fear to summon a Glass Snake within Close range of a chosen PC. The Snake appears in or near the river and immediately takes the spotlight to use their "Spinning Serpent" action.',
    ],
  },
  {
    name: 'Cult Ritual',
    tier: '2',
    type: 'Event',
    description:
      'A Fallen cult assembles around a sigil of the defeated gods and a bonfire that burns a sickly shade of green.',
    impulses: [
      'Profane the land',
      'Unite the Mortal Realm with the Circles Below',
    ],
    difficulty: 14,
    potentialAdversaries: [
      'Cult of the Fallen (Cult Adept, Cult Fang, Cult Initiate, Secret-Keeper)',
    ],
    features: [
      "Desecrated Ground - Passive: Cultists dedicated this place to the Fallen Gods, and their foul influence seeps into it. Reduce the PCs' Hope Die to a d10 while in this environment. The desecration can be removed with a Progress Countdown (6).",
      "Blasphemous Might - Action: A portion of the ritual's power is diverted into a cult member to fight off interlopers. Choose one adversary to become Imbued with terrible magic until the scene ends or they're defeated. An Imbued adversary immediately takes the spotlight and gains one of the following benefits, or all three if you spend a Fear: They gain advantage on all attacks. They deal an extra 1d10 damage on a successful attack. They gain the following feature: Relentless (2) - Passive: This adversary can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.",
      "The Summoning - Reaction: Countdown (6). When the PCs enter the scene or the cult begins the ritual to summon a demon, activate the countdown. Designate one adversary to lead the ritual. The countdown ticks down when a PC rolls with Fear. When it triggers, summon a Minor Demon within Very Close range of the ritual's leader. If the leader is defeated, the countdown ends with no effect as the ritual fails.",
      "Complete the Ritual - Reaction: If the ritual's leader is targeted by an attack or spell, an ally within Very Close range of them can mark a Stress to be targeted by that attack or spell instead.",
    ],
  },
  {
    name: 'Hallowed Temple',
    tier: '2',
    type: 'Social',
    description:
      'A bustling but well-kept temple that provides healing and hosts regular services, overseen by a priest or seraph.',
    impulses: [
      'Connect the Mortal Realm with the Hallows Above',
      'Display the power of the divine',
      'Provide aid and succor to the faithful',
    ],
    difficulty: 13,
    potentialAdversaries: ['Guards (Archer Guard, Bladed Guard, Head Guard)'],
    features: [
      'A Place of Healing - Passive: A PC who takes a rest in the Hallowed Temple automatically clears all HP.',
      "Divine Guidance - Passive: A PC who prays to a deity while in the Hallowed Temple can make an Instinct Roll to receive answers. If the god they beseech isn't welcome in this temple, the roll is made with disadvantage. Critical Success: The PC gains clear information. Additionally, they gain 1d4 Hope, which can be distributed between the party if they share the vision and guidance they received. Success with Hope: The PC receives clear information. Success with Fear: The PC receives brief flashes of insight and an emotional impression conveying an answer. Any Failure: The PC receives only vague flashes. They can mark a Stress to receive one clear image without context.",
      'Relentless Hope - Reaction: Once per scene, each PC can mark a Stress to turn a result with Fear into a result with Hope.',
      'Divine Censure - Reaction: When the PCs have trespassed, blasphemed, or offended the clergy, you can spend a Fear to summon a High Seraph and 1d4 Bladed Guards within Close range of the senior priest to reinforce their will.',
    ],
  },
  {
    name: 'Haunted City',
    tier: '2',
    type: 'Exploration',
    description:
      'An abandoned city populated by the restless spirits of eras past.',
    impulses: [
      'Misdirect and disorient',
      'Replay apocalypses both public and personal',
    ],
    difficulty: 14,
    potentialAdversaries: [
      'Ghosts (Spectral Archer, Spectral Captain, Spectral Guardian)',
      'Ghostly versions of other adversaries (see "Ghostly Form")',
    ],
    features: [
      'Buried Knowledge - Passive: The city has countless mysteries to unfold. A PC who seeks knowledge about the fallen city can make an Instinct or Knowledge Roll to learn about this place and discover (potentially haunted) loot. Critical Success: Gain valuable information and a related useful item. Success with Hope: Gain valuable information. Success with Fear: Uncover vague or incomplete information. Any Failure: Mark a Stress to find a lead after an exhaustive search.',
      'Ghostly Form - Passive: Adversaries who appear here are of a ghostly form. They have resistance to physical damage and can mark a Stress to move up to Close range through solid objects.',
      'Dead Ends - Action: The ghosts of an earlier era manifest scenes from their bygone era, such as a street festival, a revolution, or a heist. These hauntings change the layout of the city around the PCs, blocking the way behind them, forcing a detour, or presenting them with a challenge, such as mistaking them for rival thieves during the heist.',
      'Apocalypse Then - Action: Spend a Fear to manifest the echo of a past disaster that ravaged the city. Activate a Progress Countdown (5) as the disaster replays around the PCs. To complete the countdown and escape the catastrophe, the PCs must overcome threats such as rampaging fires, stampeding civilians, collapsing buildings, or crumbling streets, while recalling history and finding clues to escape the inevitable.',
    ],
  },
  {
    name: 'Mountain Pass',
    tier: '2',
    type: 'Traversal',
    description:
      'Stony peaks that pierce the clouds, with a twisting path winding its way up and over through many switchbacks.',
    impulses: [
      'Exact a chilling toll in supplies and stamina',
      'Reveal magical tampering',
      'Slow down travel',
    ],
    difficulty: 15,
    potentialAdversaries: [
      'Beasts (Bear, Giant Eagle, Glass Snake)',
      'Chaos Skull',
      'Minotaur Wrecker',
      'Mortal Hunter',
    ],
    features: [
      'Engraved Sigils - Passive: Large markings and engravings have been made in the mountainside. A PC with a relevant background or Experience identifies them as weather magic increasing the power of the icy winds. A PC who succeeds on a Knowledge Roll can recall information about the sigils, potential information about their creators, and the knowledge of how to dispel them. If a PC critically succeeds, they recognize that the sigils are of a style created by ridgeborne enchanters and they gain advantage on a roll to dispel the sigils.',
      'Avalanche - Action: Spend a Fear to carve the mountain with an icy torrent, causing an avalanche. All PCs in its path must succeed on an Agility or Strength Reaction Roll or be bowled over and carried down the mountain. A PC using rope, pitons, or other climbing gear gains advantage on this roll. Targets who fail are knocked down the mountain to Far range, take 2d20 physical damage, and must mark a Stress. Targets who succeed must mark a Stress.',
      "Raptor Nest - Reaction: When the PCs enter the raptors' hunting grounds, two Giant Eagles appear at Very Far range of a chosen PC, identifying the PCs as likely prey.",
      'Icy Winds - Reaction: Countdown (Loop 4). When the PCs enter the mountain pass, activate the countdown. When it triggers, all characters traveling through the pass must succeed on a Strength Reaction Roll or mark a Stress. A PC wearing clothes appropriate for extreme cold gains advantage on these rolls.',
    ],
  },
  {
    name: 'Burning Heart of the Woods',
    tier: '3',
    type: 'Exploration',
    description:
      'Thick indigo ash fills the air around a towering moss-covered tree that burns eternally with flames a sickly shade of blue.',
    impulses: [
      'Beat out an uncanny rhythm for all to follow',
      'Corrupt the woods',
    ],
    difficulty: 16,
    potentialAdversaries: [
      'Beasts (Bear, Glass Snake)',
      'Elementals (Elemental Spark)',
      'Verdant Defenders (Dryad, Oak Treant, Stag Knight)',
    ],
    features: [
      'Chaos Magic Locus - Passive: When a PC makes a Spellcast Roll, they must roll two Fear Dice and take the higher result.',
      'The Indigo Flame - Passive: PCs who approach the central tree can make a Knowledge Roll to try to identify the magic that consumed this environment. On a success: They learn three of the below details. On a success with Fear, they learn two. On a failure: They can mark a Stress to learn one and gain advantage on the next action roll to investigate this environment. Details: This is a result of Fallen magic. The corruption is spread through the ashen moss. It can be cleansed only by a ritual of nature magic with a Progress Countdown (8).',
      'Grasping Vines - Action: Animated vines bristling with thorns whip out from the underbrush to ensnare the PCs. A target must succeed on an Agility Reaction Roll or become Restrained and Vulnerable until they break free, clearing both conditions, with a successful Finesse or Strength Roll or by dealing 10 damage to the vines. When the target makes a roll to escape, they take 1d8+4 physical damage and lose a Hope.',
      'Charcoal Constructs - Action: Warped animals wreathed in indigo flame trample through a point of your choice. All targets within Close range of that point must make an Agility Reaction Roll. Targets who fail take 3d12+3 physical damage. Targets who succeed take half damage instead.',
      'Choking Ash - Reaction: Countdown (Loop d6). When the PCs enter the Burning Heart of the Woods, activate the countdown. When it triggers, all characters must make a Strength or Instinct Reaction Roll. Targets who fail take 4d6+5 direct physical damage. Targets who succeed take half damage. Protective masks or clothes give advantage on the reaction roll.',
    ],
  },
  {
    name: 'Castle Siege',
    tier: '3',
    type: 'Event',
    description:
      'An active siege with an attacking force fighting to gain entry to a fortified castle.',
    impulses: [
      'Bleed out the will to fight',
      'Breach the walls',
      'Build tension',
    ],
    difficulty: 17,
    potentialAdversaries: [
      'Mercenaries (Harrier, Sellsword, Spellblade, Weaponmaster)',
      'Noble Forces (Archer Squadron, Conscript, Elite Soldier, Knight of the Realm)',
    ],
    features: [
      'Secret Entrance - Passive: A PC can find or recall a secret way into the castle with a successful Instinct or Knowledge Roll.',
      "Siege Weapons (Environment Change) - Action: Consequence Countdown (6). The attacking force deploys siege weapons to try to raze the defenders' fortifications. Activate the countdown when the siege begins (for a protracted siege, make this a long-term countdown instead). When it triggers, the defenders' fortifications have been breached and the attackers flood inside. You gain 2 Fear, then shift to the Pitched Battle environment and spotlight it.",
      'Reinforcements! - Action: Summon a Knight of the Realm, a number of Tier 3 Minions equal to the number of PCs, and two adversaries of your choice within Far range of a chosen PC as reinforcements. The Knight of the Realm immediately takes the spotlight.',
      'Collateral Damage - Reaction: When an adversary is defeated, you can spend a Fear to have a stray attack from a siege weapon hit a point on the battlefield. All targets within Very Close range of that point must make an Agility Reaction Roll. Targets who fail take 3d8+3 physical or magic damage and must mark a Stress. Targets who succeed must mark a Stress.',
    ],
  },
  {
    name: 'Pitched Battle',
    tier: '3',
    type: 'Event',
    description:
      'A massive combat between two large groups of armed combatants.',
    impulses: [
      'Seize people, land, and wealth',
      'Spill blood for greed and glory',
    ],
    difficulty: 17,
    potentialAdversaries: [
      'Mercenaries (Sellsword, Harrier, Spellblade, Weaponmaster)',
      'Noble Forces (Archer Squadron, Conscript, Elite Soldier, Knight of the Realm)',
    ],
    features: [
      'Adrift on a Sea of Steel - Passive: Traversing a battlefield during an active combat is extremely dangerous. A PC must succeed on an Agility Roll to move at all, and can only go up to Close range on a success. If an adversary is within Melee range of them, they must mark a Stress to make an Agility Roll to move.',
      'Raze and Pillage - Action: The attacking force raises the stakes by lighting a fire, stealing a valuable asset, kidnapping an important person, or killing the populace.',
      'War Magic - Action: Spend a Fear as a mage from one side uses large-scale destructive magic. Pick a point on the battlefield within Very Far range of the mage. All targets within Close range of that point must make an Agility Reaction Roll. Targets who fail take 3d12+8 magic damage and must mark a Stress.',
      'Reinforcements! - Action: Summon a Knight of the Realm, a number of Tier 3 Minions equal to the number of PCs, and two adversaries of your choice within Far range of a chosen PC as reinforcements. The Knight of the Realm immediately takes the spotlight.',
    ],
  },
  {
    name: 'Chaos Realm',
    tier: '4',
    type: 'Traversal',
    description:
      'An otherworldly space where the laws of reality are unstable and dangerous.',
    impulses: ['Annihilate certainty', 'Consume power', 'Defy logic'],
    difficulty: 20,
    potentialAdversaries: [
      'Outer Realms Monstrosities (Abomination, Corruptor, Thrall)',
    ],
    features: [
      "Impossible Architecture - Passive: Up is down, down is right, right is starward. Gravity and directionality themselves are in flux, and any attempt to move through this realm is an odyssey unto itself, requiring a Progress Countdown (8). On a failure, a PC must mark a Stress in addition to the roll's other consequences.",
      'Everything You Are This Place Will Take from You - Action: Countdown (Loop 1d4). Activate the countdown. When it triggers, all PCs must succeed on a Presence Reaction Roll or their highest trait is temporarily reduced by 1d4 unless they mark a number of Stress equal to its value. Any lost trait points are regained if the PC critically succeeds or escapes the Chaos Realm.',
      'Unmaking - Action: Spend a Fear to force a PC to make a Strength Reaction Roll. On a failure, they take 4d10 direct magic damage. On a success, they must mark a Stress.',
      "Outer Realms Predators - Action: Spend a Fear to summon an Outer Realms Abomination, an Outer Realms Corruptor, and 2d6 Outer Realms Thralls, who appear at Close range of a chosen PC in defiance of logic and causality. Immediately spotlight one of these adversaries, and you can spend an additional Fear to automatically succeed on that adversary's standard attack.",
      'Disorienting Reality - Reaction: On a result with Fear, you can ask the PC to describe which of their fears the Chaos Realm evokes as a vision of reality unmakes and reconstitutes itself to the PC. The PC loses a Hope. If it is their last Hope, you gain a Fear.',
    ],
  },
  {
    name: 'Divine Usurpation',
    tier: '4',
    type: 'Event',
    description:
      'A massive ritual designed to breach the gates of the Hallows Above and unseat the New Gods themselves.',
    impulses: ['Collect power', 'Overawe', 'Silence dissent'],
    difficulty: 20,
    potentialAdversaries: [
      'Arch-Necromancer',
      'Fallen Shock Troops',
      'Mortal Hunter',
      'Oracle of Doom',
      'Perfected Zombie',
    ],
    features: [
      'Final Preparations - Passive: When the environment first takes the spotlight, designate one adversary as the Usurper seeking to overthrow the gods. Activate a Long-Term Countdown (8) as the Usurper assembles what they need to conduct the ritual. When it triggers, spotlight this environment to use the "Beginning of the End" feature. While this environment remains in play, you can hold up to 15 Fear.',
      'Divine Blessing - Passive: When a PC critically succeeds, they can spend 2 Hope to refresh an ability normally limited by uses (such as once per rest, once per session).',
      'Defilers Abound - Action: Spend 2 Fear to summon 1d4+2 Fallen Shock Troops that appear within Close range of the Usurper to assist their divine siege. Immediately spotlight the Shock Troops to use a "Group Attack" action.',
      'Godslayer - Action: If the Divine Siege Countdown (see "Beginning of the End") has triggered, you can spend 3 Fear to describe the Usurper slaying one of the gods of the Hallows Above, feasting upon their power and growing stronger. The Usurper clears 2 HP. Increase their Difficulty, damage, attack modifier, or give them a new feature from the slain god.',
      'Beginning of the End - Reaction: When the "Final Preparations" long-term countdown triggers, the Usurper begins hammering on the gates of the Hallows themselves. Activate a Divine Siege Countdown (10). Spotlight the Usurper to describe the Usurper\'s assault and tick down this countdown by 1. If the Usurper takes Major or greater damage, tick up the countdown by 1. When it triggers, the Usurper shatters the barrier between the Mortal Realm and the Hallows Above to slay the gods and take their place. You gain a Fear for each unmarked HP the Usurper has. You can immediately use the "Godslayer" feature without spending Fear to make an additional GM move.',
      'Ritual Nexus - Reaction: On any failure with Fear against the Usurper, the PC must mark 1d4 Stress from the backlash of magical power.',
    ],
  },
  {
    name: 'Imperial Court',
    tier: '4',
    type: 'Social',
    description:
      'The majestic domain of a powerful empire, lavishly appointed with stolen treasures.',
    impulses: [
      'Justify and perpetuate imperial rule',
      'Seduce rivals with promises of power and comfort',
    ],
    difficulty: 20,
    potentialAdversaries: [
      'Bladed Guard',
      'Courtesan',
      'Knight of the Realm',
      'Monarch',
      'Spy',
    ],
    features: [
      "All Roads Lead Here - Passive: While in the Imperial Court, a PC has disadvantage on Presence Rolls made to take actions that don't fit the imperial way of life or support the empire's dominance.",
      'Rival Vassals - Passive: The PCs can find imperial subjects, vassals, and supplicants in the court, each vying for favor, seeking proximity to power, exchanging favors for loyalty, and elevating their status above others. Some might be desperate to undermine their rivals, while others might even be open to discussions that verge on sedition.',
      "The Gravity of Empire - Action: Spend a Fear to present a PC with a golden opportunity or offer to satisfy a major goal in exchange for obeying or supporting the empire. The target must make a Presence Reaction Roll. On a failure, they must mark all their Stress or accept the offer. If they have already marked all their Stress, they must accept the offer or exile themselves from the empire. On a success, they must mark 1d4 Stress as they're taxed by temptation.",
      "Imperial Decree - Action: Spend a Fear to tick down a long-term countdown related to the empire's agenda by 1d4. If this triggers the countdown, a proclamation related to the agenda is announced at court as the plan is executed.",
      'Eyes Everywhere - Reaction: On a result with Fear, you can spend a Fear to have someone loyal to the empire overhear seditious talk within the court. A PC must succeed on an Instinct Reaction Roll to notice that the group has been overheard so they can try to intercept the witness before the PCs are exposed.',
    ],
  },
  {
    name: "Necromancer's Ossuary",
    tier: '4',
    type: 'Exploration',
    description:
      'A dusty crypt with a library, twisting corridors, and abundant sarcophagi, spattered with the blood of ill-fated invaders.',
    impulses: [
      'Confound intruders',
      'Delve into secrets best left buried',
      'Manifest unlife',
      'Unleash a tide of undead',
    ],
    difficulty: 19,
    potentialAdversaries: [
      "Arch-Necromancer's Host (Perfected Zombie, Zombie Legion)",
    ],
    features: [
      'No Place for the Living - Passive: A feature or action that clears HP requires spending a Hope to use. If it already costs Hope, a PC must spend an additional Hope.',
      "Centuries of Knowledge - Passive: A PC can investigate the library and laboratory and make a Knowledge Roll to learn information related to arcana, local history, and the Necromancer's plans.",
      'Skeletal Burst - Action: All targets within Close range of a point you choose in this environment must succeed on an Agility Reaction Roll or take 4d8+8 physical damage from skeletal shrapnel as part of the ossuary detonates around them.',
      'Aura of Death - Action: Once per scene, roll a d4. Each undead within Far range of the Necromancer can clear HP and Stress equal to the result rolled. The undead can choose how that number is divided between HP and Stress.',
      'They Just Keep Coming! - Action: Spend a Fear to summon 1d6 Rotted Zombies, two Perfected Zombies, or a Zombie Legion, who appear at Close range of a chosen PC.',
    ],
  },
];
