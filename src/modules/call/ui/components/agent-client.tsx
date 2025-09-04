"use client";

import { useEffect, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { geminiModel } from "@/lib/gemini";

interface AgentClientProps {
  meetingId: string;
  agentId: string;
  agentName: string;
  agentInstructions: string;
}

export const AgentClient = ({ 
  meetingId, 
  agentId, 
  agentName, 
  agentInstructions 
}: AgentClientProps) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        console.log(`Initializing agent ${agentName} for meeting ${meetingId}`);

        // Get agent token
        const tokenResponse = await fetch('/api/agent-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agentId }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get agent token');
        }

        const { token } = await tokenResponse.json();

        // Create agent client
        const agentClient = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
          user: {
            id: agentId,
            name: agentName,
            image: `https://api.dicebear.com/7.x/bottts/svg?seed=${agentName}`,
          },
          token,
        });

        // Join the agent to the call
        const call = agentClient.call("default", meetingId);
        await call.join();

        setIsConnected(true);
        console.log(`Agent ${agentName} successfully joined meeting ${meetingId}`);

        // Generate and send welcome message
        const welcomePrompt = `You are an AI assistant in a video meeting. Generate a brief, friendly welcome message (1-2 sentences) that you would say when joining a meeting. Keep it professional but warm.`;
        const geminiResponse = await geminiModel.generateContent(welcomePrompt);
        const welcomeMessage = geminiResponse.response.text();

        // Send welcome message to chat
        await call.sendMessage({
          text: welcomeMessage,
          user_id: agentId,
        });

        console.log(`Agent ${agentName} sent welcome message: ${welcomeMessage}`);

      } catch (error) {
        console.error("Failed to initialize agent:", error);
      }
    };

    initializeAgent();

    return () => {
      // Cleanup if needed
    };
  }, [meetingId, agentId, agentName, agentInstructions]);

  // This component doesn't render anything visible
  // It just handles the agent's connection to the call
  return null;
};
