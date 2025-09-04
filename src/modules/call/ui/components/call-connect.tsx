"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUI } from "./call-ui";
import { AgentClient } from "./agent-client";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
  meetingData: {
    agent?: {
      id: string;
      name: string;
      instructions: string;
    };
  };
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
  meetingData,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  // Meeting data is now passed as a prop

  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });
    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, generateToken]);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
        <StreamCall call={call}>
            <CallUI meetingName={meetingName}/>
            {/* Agent Client - handles agent connection */}
            {meetingData?.agent && (
              <AgentClient
                meetingId={meetingId}
                agentId={meetingData.agent.id}
                agentName={meetingData.agent.name}
                agentInstructions={meetingData.agent.instructions}
              />
            )}
        </StreamCall>
    </StreamVideo>
  );
};
