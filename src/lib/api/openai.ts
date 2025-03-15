/**
 * OpenAI API service
 * Handles interactions with the OpenAI API for story generation
 */

import OpenAI from 'openai';

// Initialize OpenAI client
// Note: This assumes an API key is set in the environment variable OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for development - in production, we should proxy through a backend
});

/**
 * Service for calling OpenAI's API to generate stories
 */
export default class OpenAIService {
  /**
   * Generates a story using the OpenAI API based on the provided template
   */
  static async generateStory(template: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // Using the latest model; can be configured based on needs
        messages: [
          {
            role: 'system',
            content: template,
          }
        ],
        temperature: 0.7, // Slightly creative but still focused
        max_tokens: 2000, // Enough for a ~1500 word story
      });

      // Extract and return the generated story text
      return response.choices[0]?.message?.content || 'No story generated.';
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please try again later.');
    }
  }

  /**
   * In the future, this could be used to generate images for the story
   */
  static async generateIllustration(/* parameters for image generation */): Promise<string> {
    // This will be implemented in the future for illustrations
    // Using DALL-E or other OpenAI image generation capabilities
    return 'Image generation will be implemented in the future.';
  }
} 