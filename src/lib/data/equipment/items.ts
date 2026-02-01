/* eslint-disable max-lines */
import type {
  ArmorModification,
  Consumable,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '../../schemas/equipment';

// UTILITY ITEMS (Rolls 1-60) - Complete implementation from SRD
export const UTILITY_ITEMS: UtilityItem[] = [
  // Common Items (rolls 1-12)
  {
    name: 'Premium Bedroll',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Restful Sleep',
        description: 'During downtime, you automatically clear a Stress.',
      },
    ],
  },
  {
    name: 'Piper Whistle',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Long Range Signal',
        description:
          'This handcrafted whistle has a distinctive sound. When you blow this whistle, its piercing tone can be heard within a 1-mile radius.',
      },
    ],
  },
  {
    name: 'Charging Quiver',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Damage Boost',
        description:
          'When you succeed on an attack with an arrow stored in this quiver, gain a bonus to the damage roll equal to your current tier.',
      },
    ],
  },
  {
    name: "Alistair's Torch",
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Magical Light',
        description:
          "You can light this magic torch at will. The flame's light fills a much larger space than it should, enough to illuminate a cave bright as day.",
      },
    ],
  },
  {
    name: 'Speaking Orbs',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Communication',
        description:
          'This pair of orbs allows any creatures holding them to communicate with each other across any distance.',
      },
    ],
  },
  {
    name: 'Manacles',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Restraint',
        description: 'This pair of locking cuffs comes with a key.',
      },
    ],
  },
  {
    name: 'Arcane Cloak',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Magical Disguise',
        description:
          'A creature with a Spellcast trait wearing this cloak can adjust its color, texture, and size at will.',
      },
    ],
  },
  {
    name: 'Woven Net',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Trap',
        description:
          'You can make a Finesse Roll using this net to trap a small creature. A trapped target can break free with a successful Attack Roll (16).',
      },
    ],
  },
  {
    name: 'Fire Jar',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Instant Fire',
        description:
          'You can pour out the strange liquid contents of this jar to instantly produce fire. The contents regenerate when you take a long rest.',
      },
    ],
  },
  {
    name: 'Suspended Rod',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Gravity Defiance',
        description:
          "This flat rod is inscribed with runes. When you activate the rod, it is immediately suspended in place. Until the rod is deactivated, it can't move, doesn't abide by the rules of gravity, and remains in place.",
      },
    ],
  },
  {
    name: 'Glamour Stone',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Disguise',
        description:
          'Activate this pebble-sized stone to memorize the appearance of someone you can see. Spend a Hope to magically recreate this guise on yourself as an illusion.',
      },
    ],
  },
  {
    name: 'Empty Chest',
    tier: '1',
    category: 'Utility',
    rarity: 'Common',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Hidden Storage',
        description:
          'This magical chest appears empty. When you speak a specific trigger word or action and open the chest, you can see the items stored within it.',
      },
    ],
  },

  // Continue with items 13-36 (Uncommon)
  {
    name: 'Companion Case',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Protection',
        description:
          'This case can fit a small animal companion. While the companion is inside, the animal and case are immune to all damage and harmful effects.',
      },
    ],
  },
  {
    name: 'Piercing Arrows',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 3,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Enhanced Damage',
        description:
          'Three times per rest when you succeed on an attack with one of these arrows, you can add your Proficiency to the damage roll.',
      },
    ],
  },
  {
    name: 'Skeleton Key',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Lockpicking Aid',
        description:
          'When you use this key to open a locked door, you gain advantage on the Finesse Roll.',
      },
    ],
  },
  {
    name: 'Arcane Prism',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Spellcast Enhancement',
        description:
          "Position this prism in a location of your choosing and activate it. All allies within Close range of it gain a +1 bonus to their Spellcast Rolls. While activated, the prism can't be moved. Once the prism is deactivated, it can't be activated again until your next long rest.",
      },
    ],
  },
  {
    name: 'Homing Compasses',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Tracking',
        description:
          'These two compasses point toward each other no matter how far apart they are.',
      },
    ],
  },
  {
    name: 'Corrector Sprite',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'short_rest',
    features: [
      {
        name: 'Combat Advice',
        description:
          'This tiny sprite sits in the curve of your ear canal and whispers helpful advice during combat. Once per short rest, you can gain advantage on an attack roll.',
      },
    ],
  },
  {
    name: 'Gecko Gloves',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Wall Climbing',
        description: 'You can climb up vertical surfaces and across ceilings.',
      },
    ],
  },
  {
    name: 'Lorekeeper',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Enemy Knowledge',
        description:
          'You can store the name and details of up to three hostile creatures inside this book. You gain a +1 bonus to action rolls against those creatures.',
      },
    ],
  },
  {
    name: 'Glider',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Safe Fall',
        description:
          'While falling, you can mark a Stress to deploy this small parachute and glide safely to the ground.',
      },
    ],
  },
  {
    name: 'Ring of Silence',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Silent Movement',
        description:
          'Spend a Hope to activate this ring. Your footsteps are silent until your next rest.',
      },
    ],
  },
  {
    name: 'Calming Pendant',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Stress Protection',
        description:
          "When you would mark your last Stress, roll a d6. On a result of 5 or higher, don't mark it.",
      },
    ],
  },
  {
    name: 'Dual Flask',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Dual Storage',
        description:
          "This flask can hold two different liquids. You can swap between them by flipping a small switch on the flask's side.",
      },
    ],
  },
  {
    name: 'Bag of Ficklesand',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Variable Weight & Distraction',
        description:
          "You can convince this small bag of sand to be much heavier or lighter with a successful Presence Roll (10). Additionally, on a successful Finesse Roll (10), you can blow a bit of sand into a target's face to make them temporarily Vulnerable.",
      },
    ],
  },
  {
    name: 'Ring of Resistance',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Damage Reduction',
        description:
          'Once per long rest, you can activate this ring after a successful attack against you to halve the damage.',
      },
    ],
  },
  {
    name: 'Phoenix Feather',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 3,
    features: [
      {
        name: 'Death Protection',
        description:
          'If you have at least one Phoenix Feather on you when you fall unconscious, you gain a +1 bonus to the roll you make to determine whether you gain a scar.',
      },
    ],
  },
  {
    name: 'Box of Many Goods',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Random Items',
        description:
          "Once per long rest, you can open this small box and roll a d12. On a result of 1–6, it's empty. On a result of 7–10, it contains one random common consumable. On a result of 11–12, it contains two random common consumables.",
      },
    ],
  },
  {
    name: 'Airblade Charm',
    tier: '2',
    category: 'Utility',
    rarity: 'Uncommon',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 3,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Ranged Melee',
        description:
          'You can attach this charm to a weapon with a Melee range. Three times per rest, you can activate the charm and attack a target within Close range.',
      },
    ],
  },

  // Continue with items 37-48 (Rare)
  {
    name: 'Portal Seed',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 3,
    features: [
      {
        name: 'Portal Creation',
        description:
          'You can plant this seed in the ground to grow a portal in that spot. The portal is ready to use in 24 hours. You can use this portal to travel to any other location where you planted a portal seed. A portal can be destroyed by dealing any amount of magic damage to it.',
      },
    ],
  },
  {
    name: "Paragon's Chain",
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Principled Power',
        description:
          'As a downtime move, you can meditate on an ideal or principle you hold dear and focus your will into this chain. Once per long rest, you can spend a Hope to roll a d20 as your Hope Die for rolls that directly align with that principle.',
      },
    ],
  },
  {
    name: 'Elusive Amulet',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Perfect Hiding',
        description:
          'Once per long rest, you can activate this amulet to become Hidden until you move. While Hidden in this way, you remain unseen even if an adversary moves to where they would normally see you.',
      },
    ],
  },
  {
    name: 'Hopekeeper Locket',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Hope Storage',
        description:
          'During a long rest, if you have 6 Hope, you can spend a Hope to imbue this locket with your bountiful resolve. When you have 0 Hope, you can use the locket to immediately gain a Hope. The locket must be re-imbued before it can be used this way again.',
      },
    ],
  },
  {
    name: 'Infinite Bag',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Pocket Dimension',
        description:
          'When you store items in this bag, they are kept in a pocket dimension that never runs out of space. You can retrieve an item at any time.',
      },
    ],
  },
  {
    name: 'Shard of Memory',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'long_rest',
    features: [
      {
        name: 'Domain Recall',
        description:
          'Once per long rest, you can spend 2 Hope to recall a domain card from your vault instead of paying its Recall Cost.',
      },
    ],
  },
  {
    name: 'Flickerfly Pendant',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Extended Reach',
        description:
          'While you carry this pendant, your weapons with a Melee range that deal physical damage have a gossamer sheen and can attack targets within Very Close range.',
      },
    ],
  },
  {
    name: 'Lakestrider Boots',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Water Walking',
        description:
          'You can walk on the surface of water as if it were soft ground.',
      },
    ],
  },
  {
    name: 'Clay Companion',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'unlimited',
    isConsumable: false,
    maxQuantity: 1,
    features: [
      {
        name: 'Shapeshifting Companion',
        description:
          'When you sculpt this ball of clay into a clay animal companion, it behaves as that animal. For example, a clay spider can spin clay webs, while a clay bird can fly. The clay companion retains memory and identity across different shapes, but they can adopt new mannerisms with each form.',
      },
    ],
  },
  {
    name: 'Ring of Unbreakable Resolve',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'session',
    features: [
      {
        name: 'Fear Negation',
        description:
          'Once per session, when the GM spends a Fear, you can spend 4 Hope to cancel the effects of that spent Fear.',
      },
    ],
  },
  {
    name: 'Belt of Unity',
    tier: '3',
    category: 'Utility',
    rarity: 'Rare',
    usageType: 'limited',
    isConsumable: false,
    maxQuantity: 1,
    charges: 1,
    rechargePeriod: 'session',
    features: [
      {
        name: 'Enhanced Tag Team',
        description:
          'Once per session, you can spend 5 Hope to lead a Tag Team Roll with three PCs instead of two.',
      },
    ],
  },
];

// WEAPON MODIFICATIONS (Gems, Stones, etc.)
export const WEAPON_MODIFICATIONS: WeaponModification[] = [
  {
    name: 'Bloodstone',
    tier: '2',
    category: 'Weapon Modification',
    rarity: 'Uncommon',
    modificationType: 'stone',
    isConsumable: false,
    maxQuantity: 3,
    compatibleWeapons: ["Any weapon that doesn't already have a feature"],
    featureAdded: {
      name: 'Brutal',
      description:
        'When you roll the maximum value on a damage die, roll an additional damage die.',
    },
    features: [
      {
        name: 'Weapon Enhancement',
        description:
          "You can attach this stone to a weapon that doesn't already have a feature. The weapon gains the Brutal feature.",
      },
    ],
  },
  {
    name: 'Greatstone',
    tier: '2',
    category: 'Weapon Modification',
    rarity: 'Uncommon',
    modificationType: 'stone',
    isConsumable: false,
    maxQuantity: 3,
    compatibleWeapons: ["Any weapon that doesn't already have a feature"],
    featureAdded: {
      name: 'Powerful',
      description:
        'On a successful attack, roll an additional damage die and discard the lowest result.',
    },
    features: [
      {
        name: 'Weapon Enhancement',
        description:
          "You can attach this stone to a weapon that doesn't already have a feature. The weapon gains the Powerful feature.",
      },
    ],
  },
  {
    name: 'Gem of Alacrity',
    tier: '3',
    category: 'Weapon Modification',
    rarity: 'Rare',
    modificationType: 'gem',
    isConsumable: false,
    maxQuantity: 1,
    compatibleWeapons: ['Any weapon'],
    traitChange: {
      trait: 'Agility',
      description:
        'You can attach this gem to a weapon, allowing you to use your Agility when making an attack with that weapon.',
    },
    features: [
      {
        name: 'Trait Change',
        description:
          'You can attach this gem to a weapon, allowing you to use your Agility when making an attack with that weapon.',
      },
    ],
  },
  {
    name: 'Gem of Might',
    tier: '3',
    category: 'Weapon Modification',
    rarity: 'Rare',
    modificationType: 'gem',
    isConsumable: false,
    maxQuantity: 1,
    compatibleWeapons: ['Any weapon'],
    traitChange: {
      trait: 'Strength',
      description:
        'You can attach this gem to a weapon, allowing you to use your Strength when making an attack with that weapon.',
    },
    features: [
      {
        name: 'Trait Change',
        description:
          'You can attach this gem to a weapon, allowing you to use your Strength when making an attack with that weapon.',
      },
    ],
  },
  {
    name: 'Gem of Precision',
    tier: '3',
    category: 'Weapon Modification',
    rarity: 'Rare',
    modificationType: 'gem',
    isConsumable: false,
    maxQuantity: 1,
    compatibleWeapons: ['Any weapon'],
    traitChange: {
      trait: 'Finesse',
      description:
        'You can attach this gem to a weapon, allowing you to use your Finesse when making an attack with that weapon.',
    },
    features: [
      {
        name: 'Trait Change',
        description:
          'You can attach this gem to a weapon, allowing you to use your Finesse when making an attack with that weapon.',
      },
    ],
  },
  {
    name: 'Gem of Insight',
    tier: '3',
    category: 'Weapon Modification',
    rarity: 'Rare',
    modificationType: 'gem',
    isConsumable: false,
    maxQuantity: 1,
    compatibleWeapons: ['Any weapon'],
    traitChange: {
      trait: 'Instinct',
      description:
        'You can attach this gem to a weapon, allowing you to use your Instinct when making an attack with that weapon.',
    },
    features: [
      {
        name: 'Trait Change',
        description:
          'You can attach this gem to a weapon, allowing you to use your Instinct when making an attack with that weapon.',
      },
    ],
  },
  {
    name: 'Gem of Audacity',
    tier: '3',
    category: 'Weapon Modification',
    rarity: 'Rare',
    modificationType: 'gem',
    isConsumable: false,
    maxQuantity: 1,
    compatibleWeapons: ['Any weapon'],
    traitChange: {
      trait: 'Presence',
      description:
        'You can attach this gem to a weapon, allowing you to use your Presence when making an attack with that weapon.',
    },
    features: [
      {
        name: 'Trait Change',
        description:
          'You can attach this gem to a weapon, allowing you to use your Presence when making an attack with that weapon.',
      },
    ],
  },
  {
    name: 'Gem of Sagacity',
    tier: '3',
    category: 'Weapon Modification',
    rarity: 'Rare',
    modificationType: 'gem',
    isConsumable: false,
    maxQuantity: 1,
    compatibleWeapons: ['Any weapon'],
    traitChange: {
      trait: 'Knowledge',
      description:
        'You can attach this gem to a weapon, allowing you to use your Knowledge when making an attack with that weapon.',
    },
    features: [
      {
        name: 'Trait Change',
        description:
          'You can attach this gem to a weapon, allowing you to use your Knowledge when making an attack with that weapon.',
      },
    ],
  },
];

// ARMOR MODIFICATIONS (stones/enchantments applied to armor)
export const ARMOR_MODIFICATIONS: ArmorModification[] = [
  {
    name: 'Valorstone',
    tier: '2',
    category: 'Armor Modification',
    rarity: 'Uncommon',
    modificationType: 'stone',
    isConsumable: false,
    maxQuantity: 3,
    compatibleArmor: ["Any armor that doesn't already have a feature"],
    featureAdded: {
      name: 'Resilient',
      description:
        'Before you mark your last Armor Slot, roll a d6. On a result of 6, reduce the severity by one threshold without marking an Armor Slot.',
    },
    features: [
      {
        name: 'Armor Enhancement',
        description:
          "You can attach this stone to armor that doesn't already have a feature. The armor gains the Resilient feature.",
      },
    ],
  },
];

// RELICS (Legendary items that provide permanent bonuses)
export const RELICS: Relic[] = [
  {
    name: 'Stride Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    traitBonus: {
      trait: 'Agility',
      bonus: 1,
    },
    statModifiers: {
      evasion: 0,
      proficiency: 0,
      armorScore: 0,
      majorThreshold: 0,
      severeThreshold: 0,
      attackRolls: 0,
      spellcastRolls: 0,
      traits: {
        Agility: 1,
        Strength: 0,
        Finesse: 0,
        Instinct: 0,
        Presence: 0,
        Knowledge: 0,
      },
    },
    features: [
      {
        name: 'Permanent Agility Boost',
        description: 'You gain a +1 bonus to your Agility.',
      },
    ],
  },
  {
    name: 'Bolster Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    traitBonus: {
      trait: 'Strength',
      bonus: 1,
    },
    statModifiers: {
      evasion: 0,
      proficiency: 0,
      armorScore: 0,
      majorThreshold: 0,
      severeThreshold: 0,
      attackRolls: 0,
      spellcastRolls: 0,
      traits: {
        Agility: 0,
        Strength: 1,
        Finesse: 0,
        Instinct: 0,
        Presence: 0,
        Knowledge: 0,
      },
    },
    features: [
      {
        name: 'Permanent Strength Boost',
        description: 'You gain a +1 bonus to your Strength.',
      },
    ],
  },
  {
    name: 'Control Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    traitBonus: {
      trait: 'Finesse',
      bonus: 1,
    },
    statModifiers: {
      evasion: 0,
      proficiency: 0,
      armorScore: 0,
      majorThreshold: 0,
      severeThreshold: 0,
      attackRolls: 0,
      spellcastRolls: 0,
      traits: {
        Agility: 0,
        Strength: 0,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: 0,
      },
    },
    features: [
      {
        name: 'Permanent Finesse Boost',
        description: 'You gain a +1 bonus to your Finesse.',
      },
    ],
  },
  {
    name: 'Attune Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    traitBonus: {
      trait: 'Instinct',
      bonus: 1,
    },
    statModifiers: {
      evasion: 0,
      proficiency: 0,
      armorScore: 0,
      majorThreshold: 0,
      severeThreshold: 0,
      attackRolls: 0,
      spellcastRolls: 0,
      traits: {
        Agility: 0,
        Strength: 0,
        Finesse: 0,
        Instinct: 1,
        Presence: 0,
        Knowledge: 0,
      },
    },
    features: [
      {
        name: 'Permanent Instinct Boost',
        description: 'You gain a +1 bonus to your Instinct.',
      },
    ],
  },
  {
    name: 'Charm Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    traitBonus: {
      trait: 'Presence',
      bonus: 1,
    },
    statModifiers: {
      evasion: 0,
      proficiency: 0,
      armorScore: 0,
      majorThreshold: 0,
      severeThreshold: 0,
      attackRolls: 0,
      spellcastRolls: 0,
      traits: {
        Agility: 0,
        Strength: 0,
        Finesse: 0,
        Instinct: 0,
        Presence: 1,
        Knowledge: 0,
      },
    },
    features: [
      {
        name: 'Permanent Presence Boost',
        description: 'You gain a +1 bonus to your Presence.',
      },
    ],
  },
  {
    name: 'Enlighten Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    traitBonus: {
      trait: 'Knowledge',
      bonus: 1,
    },
    statModifiers: {
      evasion: 0,
      proficiency: 0,
      armorScore: 0,
      majorThreshold: 0,
      severeThreshold: 0,
      attackRolls: 0,
      spellcastRolls: 0,
      traits: {
        Agility: 0,
        Strength: 0,
        Finesse: 0,
        Instinct: 0,
        Presence: 0,
        Knowledge: 1,
      },
    },
    features: [
      {
        name: 'Permanent Knowledge Boost',
        description: 'You gain a +1 bonus to your Knowledge.',
      },
    ],
  },
  {
    name: 'Honing Relic',
    tier: '4',
    category: 'Relic',
    rarity: 'Legendary',
    isConsumable: false,
    maxQuantity: 1,
    exclusivity: 'You can only carry one relic.',
    experienceBonus: {
      experience: 'Any Experience of your choice',
      bonus: 1,
    },
    metadata: {
      requiresExperienceSelection: true,
    },
    features: [
      {
        name: 'Experience Enhancement',
        description: 'You gain a +1 bonus to an Experience of your choice.',
      },
    ],
  },
];

// RECIPES (Items that enable crafting)
export const RECIPES: Recipe[] = [
  {
    name: 'Minor Stamina Potion Recipe',
    tier: '1',
    category: 'Recipe',
    rarity: 'Common',
    isConsumable: false,
    maxQuantity: 1,
    craftedItem: 'Minor Stamina Potion',
    materials: ['bone of a creature'],
    downtimeRequired: true,
    instructions:
      'As a downtime move, you can use the bone of a creature to craft a Minor Stamina Potion.',
    features: [
      {
        name: 'Stamina Potion Crafting',
        description:
          'As a downtime move, you can use the bone of a creature to craft a Minor Stamina Potion.',
      },
    ],
  },
  {
    name: 'Minor Health Potion Recipe',
    tier: '1',
    category: 'Recipe',
    rarity: 'Common',
    isConsumable: false,
    maxQuantity: 1,
    craftedItem: 'Minor Health Potion',
    materials: ['vial of blood'],
    downtimeRequired: true,
    instructions:
      'As a downtime move, you can use a vial of blood to craft a Minor Health Potion.',
    features: [
      {
        name: 'Health Potion Crafting',
        description:
          'As a downtime move, you can use a vial of blood to craft a Minor Health Potion.',
      },
    ],
  },
  {
    name: 'Vial of Darksmoke Recipe',
    tier: '2',
    category: 'Recipe',
    rarity: 'Uncommon',
    isConsumable: false,
    maxQuantity: 1,
    craftedItem: 'Vial of Darksmoke',
    materials: [],
    downtimeRequired: true,
    instructions:
      'As a downtime move, you can mark a Stress to craft a Vial of Darksmoke.',
    features: [
      {
        name: 'Darksmoke Crafting',
        description:
          'As a downtime move, you can mark a Stress to craft a Vial of Darksmoke.',
      },
    ],
  },
  {
    name: 'Mythic Dust Recipe',
    tier: '3',
    category: 'Recipe',
    rarity: 'Rare',
    isConsumable: false,
    maxQuantity: 1,
    craftedItem: 'Mythic Dust',
    materials: ['handful of fine gold dust'],
    downtimeRequired: true,
    instructions:
      'As a downtime move, you can use a handful of fine gold dust to craft Mythic Dust.',
    features: [
      {
        name: 'Mythic Dust Crafting',
        description:
          'As a downtime move, you can use a handful of fine gold dust to craft Mythic Dust.',
      },
    ],
  },
];

// CONSUMABLES (Rolls 1-60) - Complete implementation from SRD
export const CONSUMABLES: Consumable[] = [
  // Common Consumables (rolls 1-12)
  {
    name: 'Stride Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your next Agility Roll.',
    targetType: 'self',
    features: [
      {
        name: 'Agility Enhancement',
        description: 'You gain a +1 bonus to your next Agility Roll.',
      },
    ],
  },
  {
    name: 'Bolster Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your next Strength Roll.',
    targetType: 'self',
    features: [
      {
        name: 'Strength Enhancement',
        description: 'You gain a +1 bonus to your next Strength Roll.',
      },
    ],
  },
  {
    name: 'Control Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your next Finesse Roll.',
    targetType: 'self',
    features: [
      {
        name: 'Finesse Enhancement',
        description: 'You gain a +1 bonus to your next Finesse Roll.',
      },
    ],
  },
  {
    name: 'Attune Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your next Instinct Roll.',
    targetType: 'self',
    features: [
      {
        name: 'Instinct Enhancement',
        description: 'You gain a +1 bonus to your next Instinct Roll.',
      },
    ],
  },
  {
    name: 'Charm Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your next Presence Roll.',
    targetType: 'self',
    features: [
      {
        name: 'Presence Enhancement',
        description: 'You gain a +1 bonus to your next Presence Roll.',
      },
    ],
  },
  {
    name: 'Enlighten Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your next Knowledge Roll.',
    targetType: 'self',
    features: [
      {
        name: 'Knowledge Enhancement',
        description: 'You gain a +1 bonus to your next Knowledge Roll.',
      },
    ],
  },
  {
    name: 'Minor Health Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Clear 1d4 HP.',
    targetType: 'self',
    features: [
      {
        name: 'Health Restoration',
        description: 'Clear 1d4 HP.',
      },
    ],
  },
  {
    name: 'Minor Stamina Potion',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Clear 1d4 Stress.',
    targetType: 'self',
    features: [
      {
        name: 'Stress Relief',
        description: 'Clear 1d4 Stress.',
      },
    ],
  },
  {
    name: 'Grindletooth Venom',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can apply this venom to a weapon that deals physical damage to add a d6 to your next damage roll with that weapon.',
    targetType: 'weapon',
    features: [
      {
        name: 'Weapon Enhancement',
        description:
          'Add a d6 to your next damage roll with the enhanced weapon.',
      },
    ],
  },
  {
    name: 'Varik Leaves',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You can eat these paired leaves to immediately gain 2 Hope.',
    targetType: 'self',
    features: [
      {
        name: 'Hope Restoration',
        description: 'Gain 2 Hope immediately when consumed.',
      },
    ],
  },
  {
    name: 'Vial of Moondrip',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'When you drink the contents of this vial, you can see in total darkness until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Darkvision',
        description: 'You can see in total darkness until your next rest.',
      },
    ],
  },
  {
    name: 'Unstable Arcane Shard',
    tier: '1',
    category: 'Consumable',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 1d20 magic damage.',
    targetType: 'enemy',
    features: [
      {
        name: 'Explosive Magic',
        description:
          'Deals 1d20 magic damage to all targets you succeed against.',
      },
    ],
  },

  // Uncommon Consumables (rolls 13-36)
  {
    name: 'Potion of Stability',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You can drink this potion to choose one additional downtime move.',
    targetType: 'self',
    features: [
      {
        name: 'Extra Downtime',
        description: 'Choose one additional downtime move.',
      },
    ],
  },
  {
    name: 'Improved Grindletooth Venom',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can apply this venom to a weapon that deals physical damage to add a d8 to your next damage roll with that weapon.',
    targetType: 'weapon',
    features: [
      {
        name: 'Enhanced Weapon',
        description:
          'Add a d8 to your next damage roll with the enhanced weapon.',
      },
    ],
  },
  {
    name: 'Morphing Clay',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can spend a Hope to use this clay, altering your face enough to make you unrecognizable until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Facial Disguise',
        description: 'Spend a Hope to alter your face until your next rest.',
      },
    ],
  },
  {
    name: 'Vial of Darksmoke',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'When an adversary attacks you, use this vial and roll a number of d6s equal to your Agility. Add the highest result to your Evasion against the attack.',
    targetType: 'self',
    features: [
      {
        name: 'Evasion Boost',
        description:
          'Roll d6s equal to your Agility and add the highest to your Evasion.',
      },
    ],
  },
  {
    name: 'Jumping Root',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'Eat this root to leap up to Far range once without needing to roll.',
    targetType: 'self',
    features: [
      {
        name: 'Super Jump',
        description: 'Leap up to Far range once without needing to roll.',
      },
    ],
  },
  {
    name: 'Snap Powder',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Mark a Stress and clear a HP.',
    targetType: 'self',
    features: [
      {
        name: 'Emergency Healing',
        description: 'Mark a Stress and clear a HP.',
      },
    ],
  },
  {
    name: 'Health Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Clear 1d4+1 HP.',
    targetType: 'self',
    features: [
      {
        name: 'Enhanced Healing',
        description: 'Clear 1d4+1 HP.',
      },
    ],
  },
  {
    name: 'Stamina Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Clear 1d4+1 Stress.',
    targetType: 'self',
    features: [
      {
        name: 'Enhanced Stress Relief',
        description: 'Clear 1d4+1 Stress.',
      },
    ],
  },
  {
    name: 'Armor Stitcher',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can use this stitcher to spend any number of Hope and clear that many Armor Slots.',
    targetType: 'armor',
    features: [
      {
        name: 'Armor Repair',
        description: 'Spend Hope to clear that many Armor Slots.',
      },
    ],
  },
  {
    name: 'Gill Salve',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can apply this salve to your neck to breathe underwater for a number of minutes equal to your level.',
    targetType: 'self',
    duration: 'Minutes equal to level',
    features: [
      {
        name: 'Underwater Breathing',
        description: 'Breathe underwater for minutes equal to your level.',
      },
    ],
  },
  {
    name: 'Replication Parchment',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      "By touching this piece of parchment to another, you can perfectly copy the second parchment's contents. Once used, this parchment becomes mundane paper.",
    targetType: 'area',
    features: [
      {
        name: 'Document Copying',
        description: 'Perfectly copy the contents of another parchment.',
      },
    ],
  },
  {
    name: 'Improved Arcane Shard',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 2d20 magic damage.',
    targetType: 'enemy',
    features: [
      {
        name: 'Enhanced Explosive Magic',
        description:
          'Deals 2d20 magic damage to all targets you succeed against.',
      },
    ],
  },

  // Continue with Major Trait Potions (25-30)
  {
    name: 'Major Stride Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your Agility until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Extended Agility Boost',
        description:
          'You gain a +1 bonus to your Agility until your next rest.',
      },
    ],
  },
  {
    name: 'Major Bolster Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your Strength until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Extended Strength Boost',
        description:
          'You gain a +1 bonus to your Strength until your next rest.',
      },
    ],
  },
  {
    name: 'Major Control Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your Finesse until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Extended Finesse Boost',
        description:
          'You gain a +1 bonus to your Finesse until your next rest.',
      },
    ],
  },
  {
    name: 'Major Attune Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your Instinct until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Extended Instinct Boost',
        description:
          'You gain a +1 bonus to your Instinct until your next rest.',
      },
    ],
  },
  {
    name: 'Major Charm Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your Presence until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Extended Presence Boost',
        description:
          'You gain a +1 bonus to your Presence until your next rest.',
      },
    ],
  },
  {
    name: 'Major Enlighten Potion',
    tier: '2',
    category: 'Consumable',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'You gain a +1 bonus to your Knowledge until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Extended Knowledge Boost',
        description:
          'You gain a +1 bonus to your Knowledge until your next rest.',
      },
    ],
  },

  // Rare Consumables (rolls 31-47)
  {
    name: 'Blood of the Yorgi',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can drink this blood to disappear from where you are and immediately reappear at a point you can see within Very Far range.',
    targetType: 'self',
    features: [
      {
        name: 'Teleportation',
        description: 'Teleport to a point within Very Far range.',
      },
    ],
  },
  {
    name: "Homet's Secret Potion",
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'After drinking this potion, the next successful attack you make critically succeeds.',
    targetType: 'self',
    features: [
      {
        name: 'Guaranteed Critical',
        description: 'Next successful attack critically succeeds.',
      },
    ],
  },
  {
    name: 'Redthorn Saliva',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can apply this saliva to a weapon that deals physical damage to add a d12 to your next damage roll with that weapon.',
    targetType: 'weapon',
    features: [
      {
        name: 'Superior Weapon Enhancement',
        description:
          'Add a d12 to your next damage roll with the enhanced weapon.',
      },
    ],
  },
  {
    name: 'Channelstone',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can use this stone to take a spell or grimoire from your vault, use it once, and return it to your vault.',
    targetType: 'self',
    features: [
      {
        name: 'Temporary Spell Access',
        description:
          'Use a spell from your vault once without permanent recall.',
      },
    ],
  },
  {
    name: 'Mythic Dust',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can apply this dust to a weapon that deals magic damage to add a d12 to your next damage roll with that weapon.',
    targetType: 'weapon',
    features: [
      {
        name: 'Magic Weapon Enhancement',
        description: 'Add a d12 to your next damage roll with a magic weapon.',
      },
    ],
  },
  {
    name: 'Acidpaste',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'This paste eats away walls and other surfaces in bright flashes.',
    targetType: 'area',
    features: [
      {
        name: 'Surface Destruction',
        description: 'Dissolves walls and surfaces.',
      },
    ],
  },
  {
    name: 'Hopehold Flare',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'When you use this flare, allies within Close range roll a d6 when they spend a Hope. On a result of 6, they gain the effect of that Hope without spending it. The flare lasts until the end of the scene.',
    targetType: 'ally',
    duration: 'Until end of scene',
    features: [
      {
        name: 'Hope Conservation',
        description: 'Allies have a chance to not spend Hope when using it.',
      },
    ],
  },
  {
    name: 'Major Arcane Shard',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 4d20 magic damage.',
    targetType: 'enemy',
    features: [
      {
        name: 'Devastating Magic',
        description:
          'Deals 4d20 magic damage to all targets you succeed against.',
      },
    ],
  },
  {
    name: 'Featherbone',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can use this bone to control your falling speed for a number of minutes equal to your level.',
    targetType: 'self',
    duration: 'Minutes equal to level',
    features: [
      {
        name: 'Controlled Fall',
        description: 'Control falling speed for minutes equal to your level.',
      },
    ],
  },
  {
    name: 'Circle of the Void',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'Mark a Stress to create a void that extends up to Far range. No magic can be cast inside the void, and creatures within the void are immune to magic damage.',
    targetType: 'area',
    features: [
      {
        name: 'Magic Nullification',
        description: 'Create an anti-magic zone up to Far range.',
      },
    ],
  },
  {
    name: 'Sun Tree Sap',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'Consume this sap to roll a d6. On a result of 5–6, clear 2 HP. On a result of 2–4, clear 3 Stress. On a result of 1, see through the veil of death and return changed, gaining one scar.',
    targetType: 'self',
    features: [
      {
        name: 'Random Powerful Effect',
        description: 'Random healing effect with risk of gaining a scar.',
      },
    ],
  },
  {
    name: 'Dripfang Poison',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'A creature who consumes this poison takes 8d10 direct magic damage.',
    targetType: 'enemy',
    features: [
      {
        name: 'Lethal Poison',
        description: 'Deals 8d10 direct magic damage.',
      },
    ],
  },
  {
    name: 'Major Health Potion',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Clear 1d4+2 HP.',
    targetType: 'self',
    features: [
      {
        name: 'Superior Healing',
        description: 'Clear 1d4+2 HP.',
      },
    ],
  },
  {
    name: 'Major Stamina Potion',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'Clear 1d4+2 Stress.',
    targetType: 'self',
    features: [
      {
        name: 'Superior Stress Relief',
        description: 'Clear 1d4+2 Stress.',
      },
    ],
  },
  {
    name: 'Ogre Musk',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can use this musk to prevent anyone from tracking you by mundane or magical means until your next rest.',
    targetType: 'self',
    duration: 'Until next rest',
    features: [
      {
        name: 'Tracking Prevention',
        description: 'Prevent all tracking until your next rest.',
      },
    ],
  },
  {
    name: 'Wingsprout',
    tier: '3',
    category: 'Consumable',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You gain magic wings that allow you to fly for a number of minutes equal to your level.',
    targetType: 'self',
    duration: 'Minutes equal to level',
    features: [
      {
        name: 'Temporary Flight',
        description: 'Gain wings and fly for minutes equal to your level.',
      },
    ],
  },

  // Legendary Consumables (rolls 47-60)
  {
    name: 'Jar of Lost Voices',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can open this jar to release a deafening echo of voices for a number of minutes equal to your Instinct. Creatures within Far range unprepared for the sound take 6d8 magic damage.',
    targetType: 'area',
    duration: 'Minutes equal to Instinct',
    features: [
      {
        name: 'Sonic Devastation',
        description:
          'Deal 6d8 magic damage to unprepared creatures in Far range.',
      },
    ],
  },
  {
    name: 'Dragonbloom Tea',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can drink this tea to unleash a fiery breath attack. Make an Instinct Roll against all adversaries in front of you within Close range. Targets you succeed against take d20 physical damage using your Proficiency.',
    targetType: 'enemy',
    features: [
      {
        name: 'Dragon Breath',
        description:
          'Breath attack dealing d20 physical damage to targets in Close range.',
      },
    ],
  },
  {
    name: 'Bridge Seed',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'Thick vines grow from your location to a point of your choice within Far range, allowing you to climb up or across them. The vines dissipate on your next short rest.',
    targetType: 'area',
    duration: 'Until next short rest',
    features: [
      {
        name: 'Vine Bridge',
        description: 'Create climbable vines to a point within Far range.',
      },
    ],
  },
  {
    name: 'Sleeping Sap',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      "You can drink this potion to fall asleep for a full night's rest. You clear all Stress upon waking.",
    targetType: 'self',
    features: [
      {
        name: 'Instant Rest',
        description: 'Fall asleep for a full rest and clear all Stress.',
      },
    ],
  },
  {
    name: 'Feast of Xuria',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can eat this meal to clear all HP and Stress and gain 1d4 Hope.',
    targetType: 'self',
    features: [
      {
        name: 'Complete Restoration',
        description: 'Clear all HP and Stress, gain 1d4 Hope.',
      },
    ],
  },
  {
    name: 'Bonding Honey',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect: 'This honey can be used to glue two objects together permanently.',
    targetType: 'area',
    features: [
      {
        name: 'Permanent Bonding',
        description: 'Permanently glue two objects together.',
      },
    ],
  },
  {
    name: 'Shrinking Potion',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can drink this potion to halve your size until you choose to drop this form or your next rest. While in this form, you have a +2 bonus to Agility and a −1 penalty to your Proficiency.',
    targetType: 'self',
    duration: 'Until dropped or next rest',
    features: [
      {
        name: 'Size Reduction',
        description: 'Halve size, gain +2 Agility, -1 Proficiency.',
      },
    ],
  },
  {
    name: 'Growing Potion',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can drink this potion to double your size until you choose to drop this form or your next rest. While in this form, you have a +2 bonus to Strength and a +1 bonus to your Proficiency.',
    targetType: 'self',
    duration: 'Until dropped or next rest',
    features: [
      {
        name: 'Size Increase',
        description: 'Double size, gain +2 Strength, +1 Proficiency.',
      },
    ],
  },
  {
    name: 'Knowledge Stone',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'If you die while holding this stone, an ally can take a card from your loadout to place in their loadout or vault. After they take this knowledge, the stone crumbles.',
    targetType: 'ally',
    features: [
      {
        name: 'Knowledge Transfer',
        description: 'Transfer a card to an ally upon death.',
      },
    ],
  },
  {
    name: 'Sweet Moss',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can consume this moss during a rest to clear 1d4 HP or 1d4 Stress.',
    targetType: 'self',
    features: [
      {
        name: 'Rest Enhancement',
        description: 'Clear 1d4 HP or 1d4 Stress during a rest.',
      },
    ],
  },
  {
    name: 'Blinding Orb',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can activate this orb to create a flash of bright light. All targets within Close range become Vulnerable until they mark HP.',
    targetType: 'area',
    features: [
      {
        name: 'Blinding Flash',
        description:
          'Make all targets in Close range Vulnerable until they mark HP.',
      },
    ],
  },
  {
    name: 'Death Tea',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      "After you drink this tea, you instantly kill your target when you critically succeed on an attack. If you don't critically succeed on an attack before your next long rest, you die.",
    targetType: 'self',
    duration: 'Until next long rest',
    features: [
      {
        name: 'Death or Glory',
        description:
          "Critical hits instantly kill, but you die if you don't crit before next long rest.",
      },
    ],
  },
  {
    name: 'Mirror of Marigold',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'When you take damage, you can spend a Hope to negate that damage, after which the mirror shatters.',
    targetType: 'self',
    features: [
      {
        name: 'Damage Negation',
        description:
          'Spend a Hope to negate incoming damage, then the mirror breaks.',
      },
    ],
  },
  {
    name: 'Stardrop',
    tier: '4',
    category: 'Consumable',
    rarity: 'Legendary',
    isConsumable: true,
    maxQuantity: 5,
    effect:
      'You can use this stardrop to summon a hailstorm of comets that deals 8d20 physical damage to all targets within Very Far range.',
    targetType: 'area',
    features: [
      {
        name: 'Cosmic Devastation',
        description:
          'Deal 8d20 physical damage to all targets within Very Far range.',
      },
    ],
  },
];

// POTIONS (Subset of consumables with specific potion mechanics)
export const POTIONS: Potion[] = [
  {
    name: 'Minor Health Potion',
    tier: '1',
    category: 'Consumable',
    subcategory: 'Potion',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    potionType: 'Health',
    effect: 'Clear 1d4 HP.',
    healingAmount: '1d4',
    features: [
      {
        name: 'Health Restoration',
        description: 'Clears 1d4 Hit Points when consumed.',
      },
    ],
  },
  {
    name: 'Minor Stamina Potion',
    tier: '1',
    category: 'Consumable',
    subcategory: 'Potion',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    potionType: 'Stamina',
    effect: 'Clear 1d4 Stress.',
    healingAmount: '1d4',
    features: [
      {
        name: 'Stress Relief',
        description: 'Clears 1d4 Stress when consumed.',
      },
    ],
  },
  {
    name: 'Stride Potion',
    tier: '1',
    category: 'Consumable',
    subcategory: 'Potion',
    rarity: 'Common',
    isConsumable: true,
    maxQuantity: 5,
    potionType: 'Trait Boost',
    effect: 'You gain a +1 bonus to your next Agility Roll.',
    traitBonus: {
      trait: 'Agility',
      bonus: 1,
      duration: 'next_roll',
    },
    features: [
      {
        name: 'Agility Enhancement',
        description: 'Provides +1 bonus to next Agility roll.',
      },
    ],
  },
  {
    name: 'Health Potion',
    tier: '2',
    category: 'Consumable',
    subcategory: 'Potion',
    rarity: 'Uncommon',
    isConsumable: true,
    maxQuantity: 5,
    potionType: 'Health',
    effect: 'Clear 1d4+1 HP.',
    healingAmount: '1d4+1',
    features: [
      {
        name: 'Enhanced Health Restoration',
        description: 'Clears 1d4+1 Hit Points when consumed.',
      },
    ],
  },
  {
    name: 'Major Health Potion',
    tier: '3',
    category: 'Consumable',
    subcategory: 'Potion',
    rarity: 'Rare',
    isConsumable: true,
    maxQuantity: 5,
    potionType: 'Health',
    effect: 'Clear 1d4+2 HP.',
    healingAmount: '1d4+2',
    features: [
      {
        name: 'Superior Health Restoration',
        description: 'Clears 1d4+2 Hit Points when consumed.',
      },
    ],
  },
];

// Export collections
export const ALL_UTILITY_ITEMS = UTILITY_ITEMS;
export const ALL_CONSUMABLES = CONSUMABLES;
export const ALL_POTIONS = POTIONS;
export const ALL_RELICS = RELICS;
export const ALL_WEAPON_MODIFICATIONS = WEAPON_MODIFICATIONS;
export const ALL_ARMOR_MODIFICATIONS = ARMOR_MODIFICATIONS;
export const ALL_RECIPES = RECIPES;
