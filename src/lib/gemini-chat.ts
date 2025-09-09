import { geminiModel } from "./gemini";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type GeminiChatCompletionResponse = {
  choices: [
    {
      message: {
        content: string | null;
      };
    }
  ];
};

/**
 * A wrapper for Gemini API that mimics the OpenAI chat completions interface
 * This allows for easier replacement of OpenAI with Gemini in the codebase
 */
export const geminiChat = {
  completions: {
    create: async ({
      messages,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      model, // This parameter is ignored as we use the geminiModel from gemini.ts
    }: {
      messages: ChatCompletionMessageParam[];
      model: string;
    }): Promise<GeminiChatCompletionResponse> => {
      try {
        // Convert OpenAI message format to Gemini format
        const formattedMessages = messages.map((message) => ({
          role: message.role === "assistant" ? "model" : message.role,
          parts: [{ text: message.content as string }],
        }));

        // Find the system message if it exists
        const systemMessage = messages.find((msg) => msg.role === "system");
        let systemInstruction = "";
        
        if (systemMessage) {
          systemInstruction = systemMessage.content as string;
        }

        // Filter out system messages as Gemini handles them differently
        const chatMessages = formattedMessages.filter(
          (msg) => msg.role !== "system"
        );

        // Create a chat session with the system instruction
        const chat = geminiModel.startChat({
          history: chatMessages.slice(0, -1), // All messages except the last one
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
          systemInstruction: systemInstruction,
        });

        // Send the last message to get a response
        const lastMessage = chatMessages[chatMessages.length - 1];
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
};