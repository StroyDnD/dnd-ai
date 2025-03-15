/**
 * API Services index
 * Centralizes and exports all API-related services and types
 */

import OpenAIService from './openai';
import StoryService, { 
  StoryGenerationInput, 
  StoryGenerationResult 
} from './storyService';

export { 
  OpenAIService,
  StoryService 
};

export type { 
  StoryGenerationInput, 
  StoryGenerationResult 
}; 