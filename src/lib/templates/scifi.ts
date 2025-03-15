/**
 * SciFi story template
 * Provides the structure and guidelines for generating science fiction stories
 */

export interface SciFiPromptAnswers {
  setting: string;
  ability: string;
  discovery: string;
  fear: string;
  characterName: string;
  characterDetails: string;
}

/**
 * Generates a template for SciFi story generation based on user inputs
 */
export function generateSciFiTemplate(answers: SciFiPromptAnswers): string {
  return `
You are a science fiction author specializing in creating immersive, character-driven stories.
Create a compelling science fiction story based on the following information:

Setting: ${answers.setting}
Character Name: ${answers.characterName}
Character Details: ${answers.characterDetails}
Character's Technological Ability: ${answers.ability}
Scientific Discovery: ${answers.discovery}
Character's Fear: ${answers.fear}

Story Structure Guidelines:
- Opening: Establish the technological/scientific context and introduce ${answers.characterName} with their unique ability
- Inciting Incident: A technological problem/discovery that only someone with ${answers.characterName}'s specific ability could handle
- Rising Action: Complexity increases as the science/tech implications expand
- Climax: ${answers.characterName} must use their ability in an unexpected way
- Resolution: Show how the event changes ${answers.characterName}'s world/understanding

Technology Level Guidelines:
- All technology should feel consistent with the character's described abilities
- Focus on one main technological concept (the character's ability) and build related tech around it
- Keep advanced tech focused on the plot rather than overwhelming the story

Writing Style:
- Vivid descriptions of futuristic technology and environments
- Balance technical descriptions with human emotion and character development
- Use sensory details to bring the science fiction world to life
- Create a cohesive, plausible future world, even if the technology is advanced

Length: Approximately 1500 words

Generate only the story text without any additional commentary, explanations, or section headers.
Give the story a title that reflects its themes and concepts.
`;
} 