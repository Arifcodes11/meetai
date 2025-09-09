import { geminiModel } from "./gemini";

/**
 * Creates a Gemini-based agent that mimics the @inngest/agent-kit interface
 * This allows for easier replacement of OpenAI with Gemini in the codebase
 */
export const createGeminiAgent = ({
  name,
  system,
}: {
  name: string;
  system: string;
}) => {
  return {
    run: async (prompt: string) => {
      try {
        // Create a chat with the system instruction
        const chat = geminiModel.startChat({
          generationConfig: {
            temperature: 0.2, // Lower temperature for summarization tasks
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 4000, // Allow for longer summaries
          },
          systemInstruction: system,
        });

        // Send the prompt to get a response
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Return in a format similar to agent-kit's response
        return {
          output: [
            {
              type: "text",
              content: text,
            },
          ],
        };
      } catch (error) {
        console.error(`Error in ${name} agent using Gemini API:`, error);
        throw error;
      }
    },
  };
};