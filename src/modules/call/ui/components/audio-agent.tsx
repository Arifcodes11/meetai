"use client";

import { useEffect, useState } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { geminiModel } from "@/lib/gemini";

interface AudioAgentProps {
  agentId: string;
  agentInstructions: string;
}

export const AudioAgent = ({ agentId, agentInstructions }: AudioAgentProps) => {
  const call = useCall();
  const [isListening, setIsListening] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>("");

  useEffect(() => {
    if (!call) return;

    // Set up audio event listeners
    const handleAudioData = async (audioData: any) => {
      if (!isListening) return;

      try {
        // Convert audio data to text (you'll need to implement speech-to-text)
        // For now, we'll simulate this
        const transcribedText = "Hello, how can I help you?"; // Placeholder

        // Send to Gemini for processing
        const prompt = `${agentInstructions}\n\nUser said: "${transcribedText}"\n\nRespond naturally and helpfully.`;
        const response = await geminiModel.generateContent(prompt);
        const responseText = response.response.text();

        setLastResponse(responseText);

        // Convert response to speech and play it
        speakText(responseText);

      } catch (error) {
        console.error("Error processing audio:", error);
      }
    };

    // Subscribe to audio events
    call.on("audioData", handleAudioData);

    return () => {
      call.off("audioData", handleAudioData);
    };
  }, [call, isListening, agentInstructions]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const naturalVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Natural')
      );
      
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isListening ? (
            <div className="w-4 h-4 bg-white rounded-sm" />
          ) : (
            <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
          )}
        </button>
        
        <div className="text-sm">
          <div className="font-medium">
            {isListening ? "Listening..." : "AI Agent Ready"}
          </div>
          {lastResponse && (
            <div className="text-xs opacity-75 mt-1 max-w-xs truncate">
              Last response: {lastResponse}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
