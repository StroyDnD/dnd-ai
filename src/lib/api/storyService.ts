/**
 * Story Service
 * Combines templates with the OpenAI API to generate stories
 */

import OpenAIService from './openai';
import { generateTemplate, TemplateMap } from '../templates';
import { SciFiPromptAnswers } from '../templates/scifi';

export interface StoryGenerationInput {
  genre: keyof TemplateMap;
  answers: any; // Type will be inferred based on genre (e.g., SciFiPromptAnswers for 'Sci-Fi')
}

export interface StoryGenerationResult {
  story: string;
  title?: string; // The title might be extracted from the generated story
  illustrations?: string[]; // URLs to illustrations (for future use)
}

/**
 * Service for generating stories based on user inputs
 */
export default class StoryService {
  /**
   * Generates a story based on the given genre and user answers
   */
  static async generateStory(input: StoryGenerationInput): Promise<StoryGenerationResult> {
    try {
      // 1. Generate template from user inputs
      const template = generateTemplate(input.genre, input.answers);
      
      // 2. Call OpenAI to generate the story
      const storyText = await OpenAIService.generateStory(template);
      
      // 3. Extract title from the story (assuming the first line is the title)
      const lines = storyText.trim().split('\n');
      const title = lines[0].replace(/^#+ /, '').trim(); // Remove any markdown heading symbols
      
      // 4. Return the result
      return {
        story: storyText,
        title,
      };
    } catch (error) {
      console.error('Error in story generation:', error);
      throw error;
    }
  }

  /**
   * Example method for SciFi story generation with strong typing
   */
  static async generateSciFiStory(answers: SciFiPromptAnswers): Promise<StoryGenerationResult> {
    return this.generateStory({
      genre: 'Sci-Fi',
      answers,
    });
  }

  // Additional methods for other genres can be added here in the future
} 