/**
 * Configuration file for application settings
 */

import type { DndCampaignAnswers } from './templates/dnd';

/**
 * App configuration
 */
export const config = {
  /**
   * Test mode flag - when true, predefined answers will be used instead of user input
   */
  testMode: true,
};

/**
 * Predefined test answers for D&D Campaign Generator
 * These will be used automatically when testMode is set to true
 */
export const testDndCampaignAnswers: DndCampaignAnswers = {
  // Basic parameters (required)
  levelRange: "Levels 3-12",
  setting: "Renaissance-era Mediterranean city-states with some Norse influences, with 40% urban settlements, 30% wilderness (forests and mountains), 20% coastal regions, 10% elemental planes. Magic: Moderate - magic is known but not commonplace; practitioners are respected but sometimes feared. Tech: Early renaissance (printing press exists, early firearms are rare curiosities)",
  campaignLength: "24-30 sessions (approximately 8-10 months of weekly play)",
  themes: ["Balance vs chaos", "Responsibility of power", "Finding strength in diversity"],
  
  // World Building
  coreConflict: "The ancient seals binding primordial elemental lords are weakening, causing elemental chaos across the realm",
  environments: "40% urban settlements, 30% wilderness (forests and mountains), 20% coastal regions, 10% elemental planes",
  culturalInspiration: "Renaissance-era Mediterranean city-states with some Norse influences",
  magicLevel: "Moderate - magic is known but not commonplace; practitioners are respected but sometimes feared",
  technologyLevel: "Early renaissance (printing press exists, early firearms are rare curiosities)",
  
  // Campaign Structure
  storyArcs: "3 arcs (Discovering the Threat, Finding the Ancient Lore, Confronting the Elemental Lords)",
  structure: "Semi-linear with key plot points but freedom to explore between them",
  partyMotivation: "Each character possesses a fragment of an ancient artifact that connects them to the elemental chaos",
  
  // Tone & Themes
  emotionalTone: "Primarily heroic adventure with moments of mystery and some darker elements",
  coreThemes: "Balance vs chaos, responsibility of power, finding strength in diversity",
  otherGenres: "Mystery, political intrigue, light horror elements",
  moralChoices: "Questions about sacrificing short-term good for long-term stability, when to trust former enemies, balancing personal vendettas against greater good",
  
  // Player Experience
  gameplayBalance: "50% combat, 30% social interaction, 20% exploration",
  characterClasses: "Druid (elemental connections), Warlock (pact implications), Artificer (combining magic and technology)",
  rewards: "Elemental-infused equipment, political titles and property, abilities to briefly control elemental phenomena",
  backgrounds: "Sage, Guild Artisan, Outlander, and Noble would connect particularly well to the storyline",
  
  // DMing Support
  challengingEncounters: "Large-scale battles with multiple objectives, politically delicate social encounters",
  npcDevelopment: "The leaders of each city-state, the cult working to free the elemental lords, ancient sages who know forgotten lore",
  locations: "The capital cities of each city-state, the elemental temples where seals are located",
  villains: "The Elemental Cult (main antagonists), rival adventuring party also seeking elemental power, merchant consortium profiting from the chaos",
  contingencies: "Players might decide to harness elemental power rather than contain it, city-states might go to war with each other instead of uniting"
}; 