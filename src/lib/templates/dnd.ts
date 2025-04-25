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

Format your response using a consistent structure that can be easily parsed:

1. First, provide a title for your campaign on the first line, prefixed with "# ".

2. Then, organize your content into these major sections, each with a specific format:

## SECTION: Campaign Overview
[Content for campaign overview]

## SECTION: Plot Structure
[Content for plot structure]

## SECTION: Key NPCs
[Content for key NPCs]

## SECTION: Main Locations
[Content for main locations]

## SECTION: Key Encounters
[Content for key encounters]

## SECTION: Campaign Conclusion
[Content for campaign conclusion]

## SECTION: DM Guide
[Content for DM guide]

## SECTION: Session Outline
[Content for session outline]

## SECTION: Player Handouts
[Content for player handouts]

## SECTION: Treasure & Magic Items
[Content for treasure & magic items]

## SECTION: LLM Map Assets
The campaign requires both a regional map of the setting and battle maps for key encounters. Follow these strict style guidelines to maintain consistency.

### SUBSECTION: Regional Map
* #### MAP TYPE: Regional
* #### MAP TITLE: [Evocative title for the region]
* #### MAP STYLE: Fantasy Parchment Isometric
* #### MAP INSTRUCTIONS: Create a regional fantasy map with these exact specifications:
  - BACKGROUND: Aged parchment with #D2BC9A base color and 15% darker gradient at edges
  - TERRAIN STYLE: Isometric/3D with hand-drawn appearance, not photorealistic
  - ELEVATION: Mountains and hills as stylized isometric ridges in brown (#A89078) with subtle shading
  - FORESTS: Top-down clusters of small trees in dark olive green (#4A5D23)
  - WATER: Rivers, lakes and seas in blue-gray (#7A9EAB) with thin white edges
  - SETTLEMENTS: Small iconic buildings (not modern) scaled by settlement importance
  - TYPOGRAPHY: Region names in uppercase serif font, settlement names in smaller serif font
  - BOUNDARIES: Political borders as thin dotted lines in dark brown (#5D4B35)
  - SCALE: Bar showing both miles and kilometers in bottom left corner
  - TITLE: Large decorative serif font in bottom left or corner, 20% larger than other text
  - SUBTITLE: Small descriptive text under title in same font family
  - PATHS: Roads and trails as thin white/light lines (#E8E4D9)
  - ICONS: Simple symbolic markers for ruins (broken towers), landmarks (stars), and special locations
  - COLOR PALETTE: Limited to earth tones, primarily browns, greens, and blue-grays
  - LAYOUT: Rectangular with major features centered and title in bottom left
  - [Campaign-specific geographic features and locations based on setting]

### SUBSECTION: Battle Maps
For each key encounter location in your campaign, provide the following:

* #### ENCOUNTER: [Encounter Name]
* #### MAP TYPE: Battle Map
* #### MAP TITLE: [Name of the specific location]
* #### MAP STYLE: Top-Down Tactical Grid
* #### MAP INSTRUCTIONS: Create a top-down battle map with these exact specifications:
  - GRID: 5ft square overlay with thin light gray lines (#CCCCCC), 70% opacity
  - PERSPECTIVE: Strictly top-down 2D view with no perspective distortion
  - STRUCTURES: Building foundations and walls shown as clean outlined shapes
  - TERRAIN TEXTURES: Natural surfaces rendered as subtle textures, not photographic
    * Grass: Light olive green base (#7D8E4E) with subtle texture
    * Dirt/Paths: Tan/brown (#B69E7B) with granular texture
    * Stone: Gray (#8E8E8E) with subtle seam lines for manufactured stone
  - TACTICAL ELEMENTS: Debris, furniture, obstacles shown as top-down silhouettes
  - SHADOWS: Minimal directional shadows from walls and large objects, 30% opacity
  - COLOR PALETTE: Natural earth tones only, no saturated or bright colors
  - SCALE: Consistent 5ft per square throughout entire map
  - LIGHTING: Ambient light assumed unless specified (no dramatic shadows/lighting)
  - LAYOUT: Rectangular grid with clear entry/exit points and focal encounter area
  - DIMENSIONS: [Specific width x height in 5ft squares, e.g. 24x30 squares]
  - [Specific structural layout, features and objects of the location]
  - [Tactical positioning information relevant to the encounter]

3. For each section that contains subsections, use the following format:

### SUBSECTION: [Subsection Name]
[Content for this subsection]

4. For lists within sections or subsections, use consistent bullet points:

* [List item 1]
* [List item 2]

5. For each Key NPC, use this format:
### SUBSECTION: [NPC Name]
* Role: [NPC's role]
* Motivation: [NPC's motivation]
* Description: [Brief physical/personality description]
* Connections: [Relationships to plot or other NPCs]

6. For each Location, use this format:
### SUBSECTION: [Location Name]
* Type: [Type of location]
* Description: [Physical description]
* Key Features: [Notable elements]
* Encounters: [Possible encounters here]
* Secrets: [Hidden elements or lore]

7. For each Encounter, use this format:
### SUBSECTION: [Encounter Name]
* Location: [Where this occurs]
* Enemies: [Enemy types and CRs]
* Battlefield: [Layout and dimensions]
* Tactics: [Enemy tactics]
* Objectives: [Multiple ways to succeed]
* Rewards: [Specific treasures/outcomes]
* Scaling: [Adjustments for party size/level]

Use these exact formatting conventions throughout your response to ensure the campaign can be properly parsed and displayed to users. Do not use alternative formats or deviate from this structure.
`;
}