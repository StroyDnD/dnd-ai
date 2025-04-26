/**
 * Story Service
 * Combines templates with the OpenAI API to generate stories
 */

import OpenAIService from './openai';
import { generateTemplate, TemplateMap } from '../templates';
import { SciFiPromptAnswers } from '../templates/scifi';
import { DndCampaignAnswers } from '../templates/dnd';

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
      //Generate template from user inputs
      const template = generateTemplate(input.genre, input.answers);
      
      // Call OpenAI to generate the story
      const storyText = await OpenAIService.generateStory(template);
      
      // Extract title from the story (assuming the first line is the title)
      const lines = storyText.trim().split('\n');
      const title = lines[0].replace(/^#+ /, '').trim(); // Remove any markdown heading symbols
      
      // Return the result
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
   * Example method for SciFi story generation
   */
  static async generateSciFiStory(answers: SciFiPromptAnswers): Promise<StoryGenerationResult> {
    return this.generateStory({
      genre: 'Sci-Fi',
      answers,
    });
  }

  /**
   * Method for D&D campaign generation 
   */
  static async generateDndCampaign(answers: DndCampaignAnswers): Promise<StoryGenerationResult> {
    return this.generateStory({
      genre: 'D&D Campaign',
      answers,
    });
  }

  /**
   * Generates a map image based on the provided instructions
   */
  static async generateMap(prompt: string): Promise<StoryGenerationResult> {
    try {
      const result = await OpenAIService.generateImage({
        model: "gpt-image-1",
        prompt,
      });

      if (!result.data[0].b64_json) {
        throw new Error("No image data received from OpenAI");
      }

      const image_base64 = result.data[0].b64_json;
      
      return {
        story: "Map generated successfully",
        illustrations: [image_base64]
      };
    } catch (error) {
      console.error('Error in map generation:', error);
      throw error;
    }
  }
} 