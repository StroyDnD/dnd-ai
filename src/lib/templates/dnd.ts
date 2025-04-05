/**
 * D&D Campaign template
 * Provides the structure and guidelines for generating D&D campaigns
 */

export interface DndCampaignAnswers {
  // Basic parameters (originally required)
  levelRange: string;
  setting: string;
  campaignLength: string;
  themes: string[];
  
  // World Building
  coreConflict?: string;
  environments?: string;
  culturalInspiration?: string;
  magicLevel?: string;
  technologyLevel?: string;
  historyLore?: string;
  religionsDeities?: string;
  
  // Campaign Structure
  storyArcs?: string;
  structure?: string;
  partyMotivation?: string;
  majorVillain?: string;
  criticalEvents?: string;
  
  // Tone & Themes
  emotionalTone?: string;
  coreThemes?: string;
  otherGenres?: string;
  moralChoices?: string;
  sensitiveContent?: string;
  
  // Player Experience
  gameplayBalance?: string;
  characterClasses?: string;
  rewards?: string;
  backgrounds?: string;
  characterDeath?: string;
  
  // DMing Support
  challengingEncounters?: string;
  npcDevelopment?: string;
  locations?: string;
  villains?: string;
  contingencies?: string;
}

/**
 * Generates a template for D&D campaign generation based on user inputs
 */
export function generateDndCampaignTemplate(answers: DndCampaignAnswers): string {
  return `
You are an experienced Dungeon Master specializing in creating engaging D&D campaigns.
Create a compelling D&D campaign outline based on the following parameters:

Level Range: ${answers.levelRange}
Setting: ${answers.setting}
Campaign Length: ${answers.campaignLength}
Primary Themes: ${answers.themes.join(', ')}

${answers.coreConflict ? `Core Conflict: ${answers.coreConflict}` : ''}
${answers.emotionalTone ? `Emotional Tone: ${answers.emotionalTone}` : ''}
${answers.partyMotivation ? `Party Motivation: ${answers.partyMotivation}` : ''}
${answers.structure ? `Campaign Structure: ${answers.structure}` : ''}
${answers.gameplayBalance ? `Gameplay Balance: ${answers.gameplayBalance}` : ''}
${answers.characterClasses ? `Featured Classes: ${answers.characterClasses}` : ''}
${answers.otherGenres ? `Additional Genres: ${answers.otherGenres}` : ''}
${answers.moralChoices ? `Moral Choices: ${answers.moralChoices}` : ''}
${answers.historyLore ? `Historical Events/Lore: ${answers.historyLore}` : ''}
${answers.religionsDeities ? `Religions/Deities: ${answers.religionsDeities}` : ''}
${answers.majorVillain ? `Main Antagonist: ${answers.majorVillain}` : ''}
${answers.criticalEvents ? `Critical Events: ${answers.criticalEvents}` : ''}
${answers.sensitiveContent ? `Content to Avoid: ${answers.sensitiveContent}` : ''}
${answers.characterDeath ? `Lethality Level: ${answers.characterDeath}` : ''}

Campaign Structure Guidelines:
- Campaign Overview: Create a brief summary of the campaign's central conflict and premise
- Plot Structure: Outline the main story arc with clear plot hooks, rising action, climax, and resolution
- Key NPCs: Create 3-5 important NPCs with brief descriptions, motivations, and roles in the campaign
- Main Locations: Detail 3-5 significant locations with interesting features and adventure hooks
- Encounters: Develop 3-5 key tactical encounters with detailed battlefield layouts, enemy compositions, dynamic elements, and multiple resolution approaches

Writing Style:
- Provide clear organization with headers for each section
- Keep descriptions evocative but concise
- Include plot hooks and adventure seeds for the DM to expand on
- Balance combat, roleplay, and exploration elements
- Ensure the campaign is adaptable to different player choices and approaches

Format your response as a structured campaign outline with the following sections:
1. Campaign Title
2. Campaign Overview
3. Plot Structure
4. Key NPCs
5. Main Locations & Map Descriptions
6. Key Encounters (For each encounter include:
   - Battlefield layout with dimensions, terrain features, and tactical elements
   - Enemy composition with approximate CR values and tactics
   - Environmental factors, hazards, or dynamic elements
   - Multiple tactical objectives and alternative approaches
   - Scaling guidance for different party sizes
   - Specific treasure and rewards)
7. Campaign Conclusion
8. DM Guide
9. Session Outline
10. Player Handouts
11. Treasure & Magic Items

For Map Descriptions: Include clear details about layout, dimensions, key features, and atmospheric elements for each important location. Describe them in enough detail that a DM could sketch or generate them visually.

Generate the campaign outline with appropriate formatting and organization for easy reference.
`;
}