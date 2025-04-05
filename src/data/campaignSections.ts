export interface Prompt {
  id: string;
  question: string;
  hint: string;
}

// Restructured as sections for D&D campaign creation instead of genres
export const campaignSections = {
  "World Building": [
    {
      id: "environments",
      question: "What mix of environments do you want?",
      hint: 'Specify the environments your campaign will include. For example: "Urban cities, dense forests, and ancient ruins" or "Desert wasteland and underground caverns"',
    },
    {
      id: "coreConflict",
      question: "What's the core conflict or central tension driving this world?",
      hint: 'Describe the primary conflict that shapes your world. For example: "An ancient evil awakening" or "War between rival kingdoms"',
    },
    {
      id: "culturalInspiration",
      question: "Which historical period or cultural inspiration would serve as your primary influence?",
      hint: 'Specify a time period or culture. For example: "Medieval Europe" or "Ancient Egypt" or "Viking Age Scandinavia"',
    },
    {
      id: "magicLevel",
      question: "What level of magic exists in this world?",
      hint: 'Describe how common or rare magic is. For example: "High magic with spellcasters in every town" or "Low magic where spells are rare and feared"',
    },
    {
      id: "technologyLevel",
      question: "What technological level exists alongside magic?",
      hint: 'Describe the technology level. For example: "Medieval with simple machines" or "Renaissance with early firearms" or "Steampunk with magic-powered devices"',
    },
    {
      id: "historyLore",
      question: "Describe any key historical events or lore you'd like to include.",
      hint: "E.g., 'Ancient wars', 'legendary heroes', or 'fallen empires'",
    },
    {
      id: "religionsDeities",
      question: "What religions or deities exist, and how do they influence the world?",
      hint: "E.g., 'Pantheon of rival gods', 'monotheistic zealots', or 'nature spirits worshipped by druids'",
    },
  ],
  "Campaign Structure": [
    {
      id: "levelRange",
      question: "What level range should this campaign cover?",
      hint: 'Specify the starting and ending levels. For example: "1-5" or "5-10" or "1-20 for a full campaign"',
    },
    {
      id: "storyArcs",
      question: "How many major story arcs would you like?",
      hint: 'Choose the number of major plot arcs. For example: "One epic storyline" or "Three interconnected arcs" or "Five milestone adventures"',
    },
    {
      id: "campaignLength",
      question: "What campaign length are you aiming for?",
      hint: 'Estimate the campaign duration. For example: "Short (5-10 sessions)" or "Medium (10-25 sessions)" or "Long (25+ sessions)"',
    },
    {
      id: "structure",
      question: "How linear vs. sandbox should the story structure be?",
      hint: 'Describe the narrative structure. For example: "Highly linear with clear objectives" or "Open sandbox with multiple paths" or "Guided sandbox with a central plot but freedom to explore"',
    },
    {
      id: "partyMotivation",
      question: "What's the primary motivation keeping the party together?",
      hint: 'Explain why the characters stay as a group. For example: "Shared goal of defeating a villain" or "All members of the same organization" or "Bound by a magical contract"',
    },
    {
      id: "majorVillain",
      question: "Who is the main antagonist or villain of your campaign?",
      hint: "Describe their goals, motivations, and background briefly.",
    },
    {
      id: "criticalEvents",
      question: "List any critical events or milestones you'd like to see in the campaign.",
      hint: "E.g., 'Coronation of a king', 'destruction of a city', or 'awakening of a dragon'",
    },
  ],
  "Tone & Themes": [
    {
      id: "emotionalTone",
      question: "What emotional tone do you want?",
      hint: 'Describe the overall mood. For example: "Dark and gritty" or "Heroic high fantasy" or "Humorous adventure" or "Mysterious and tense"',
    },
    {
      id: "coreThemes",
      question: "What core themes would you like to explore?",
      hint: 'List 2-3 themes to explore. For example: "Redemption, sacrifice, power" or "Freedom, responsibility, corruption" or "Faith, doubt, perseverance"',
    },
    {
      id: "otherGenres",
      question: "Which genres besides fantasy would you like to incorporate?",
      hint: 'Mention other genres to blend in. For example: "Horror elements" or "Mystery and intrigue" or "Political thriller" or "None, pure fantasy"',
    },
    {
      id: "moralChoices",
      question: "What kinds of moral choices should players face?",
      hint: 'Describe moral dilemmas. For example: "Greater good vs. individual needs" or "Honor vs. practical necessity" or "Justice vs. mercy"',
    },
    {
      id: "sensitiveContent",
      question: "Are there any sensitive or mature topics you prefer to avoid?",
      hint: "E.g., 'Graphic violence', 'political themes', 'religious conflicts'",
    },
  ],
  "Player Experience": [
    {
      id: "gameplayBalance",
      question: "What balance of combat/exploration/social interaction do you prefer?",
      hint: 'Specify your preferred gameplay mix. For example: "Combat-heavy (60/20/20)" or "Balanced (40/30/30)" or "Social-focused (20/20/60)"',
    },
    {
      id: "characterClasses",
      question: "Which character classes or builds do you want to particularly shine?",
      hint: 'List classes you want to highlight. For example: "Rogues and bards for a heist campaign" or "Paladins and clerics for an undead-focused adventure" or "All classes equally"',
    },
    {
      id: "rewards",
      question: "What distinctive rewards beyond standard treasure would you like to offer?",
      hint: 'Describe special rewards. For example: "Political influence" or "Rare magic items with story significance" or "Property and followers" or "Divine blessings"',
    },
    {
      id: "backgrounds",
      question: "What player backgrounds would connect well to this campaign?",
      hint: 'Suggest relevant character backgrounds. For example: "Soldier, Noble, and Sage for a war campaign" or "Criminal, Urchin, and Charlatan for an urban adventure"',
    },
    {
      id: "characterDeath",
      question: "How challenging or deadly should this campaign be?",
      hint: "E.g., 'Player deaths possible', 'difficult but fair', or 'casual, story-focused'",
    },
  ],
  "Practical DMing Support": [
    {
      id: "challengingEncounters",
      question: "What encounter types do you struggle to design?",
      hint: 'E.g., "Naval battles", "Large-scale war", or "Puzzles and riddles"',
    },
    {
      id: "npcDevelopment",
      question: "Which NPCs would benefit from deeper development?",
      hint: 'E.g., "The main villain", "Recurring allies", or "Quest givers"',
    },
    {
      id: "locations",
      question: "What locations would you like detailed maps for?",
      hint: 'E.g., "Main city hub", "Villain\'s fortress", or "Ancient temple"',
    },
    {
      id: "villains",
      question: "What recurring villains or factions should be fleshed out?",
      hint: 'E.g., "Main villain and lieutenants", "Rival adventuring party", or "Corrupt noble house"',
    },
    {
      id: "contingencies",
      question: "What plot complications could arise if players go off-track?",
      hint: 'E.g., "Alternative paths to main objective", "Side quests reconnecting to main plot"',
    },
  ],
} as const; 