import { geminiModel } from "./gemini";

/**
 * A wrapper for Gemini API that mimics the OpenAI interface for Stream Video
 * This allows for easier replacement of OpenAI with Gemini in the Stream Video integration
 */
export const geminiStream = {
  /**
   * Creates a mock OpenAI client that uses Gemini under the hood
   * This is needed because Stream Video expects an OpenAI client
   */
  createMockOpenAIClient: () => {
    return {
      // Mock the chat.completions.create method to use Gemini instead
      chat: {
        completions: {
          create: async ({ messages }: { messages: { role: string; content: string }[] }) => {
            try {
              // Extract system message if present
              const systemMessage = messages.find((msg) => msg.role === "system");
              let systemInstruction = "";
              
              if (systemMessage) {
                systemInstruction = systemMessage.content;
              }

              // Convert OpenAI message format to Gemini format
              const formattedMessages = messages
                .filter((msg) => msg.role !== "system")
                .map((message) => ({
                  role: message.role === "assistant" ? "model" : message.role,
                  parts: [{ text: message.content }],
                }));

              // Create a chat session with the system instruction
              const chat = geminiModel.startChat({
                history: formattedMessages.slice(0, -1), // All messages except the last one
                generationConfig: {
                  temperature: 0.7,
                  topP: 0.8,
                  topK: 40,
                },
                systemInstruction: systemInstruction,
              });

              // Send the last message to get a response
              const lastMessage = formattedMessages[formattedMessages.length - 1];
              const result = await chat.sendMessage(lastMessage.parts[0].text);
              const response = await result.response;
              const text = response.text();

              // Return in a format similar to OpenAI's response
              return {
                choices: [
                  {
                    message: {
                      content: text,
                    },
                  },
                ],
              };
            } catch (error) {
              console.error("Error using Gemini API:", error);
              throw error;
            }
          },
        },
      },
    };
  },
};