import { generateResponseForPrompt } from "@/lib/api/openai";

/**
 * Generates an AI response for a prompt and returns updated answers.
 * @param answers Current answers object
 * @param promptId The prompt's id to update
 * @param promptContext The context for the AI generation
 * @returns Updated answers object with the generated response
 */
export async function autoGeneratePromptAnswer(
  answers: Record<string, string>,
  promptId: string,
  promptContext: string
): Promise<Record<string, string>> {
  const response = await generateResponseForPrompt(promptContext);
  return {
    ...answers,
    [promptId]: response,
  };
}