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
        max_tokens: 4000, // Enough for a ~3000 word story
      });

      // Extract and return the generated story text
      return response.choices[0]?.message?.content || 'No story generated.';
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please try again later.');
    }
  }

  /**
   * Generates an image using the OpenAI API
   */
  static async generateImage(params: { model: string; prompt: string }): Promise<OpenAI.Images.ImagesResponse> {
    try {
      const response = await openai.images.generate({
        model: params.model,
        prompt: params.prompt
      });

      if (!response.data[0].b64_json) {
        throw new Error("No image data received from OpenAI");
      }

      return response;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image. Please try again later.');
    }
  }
} 