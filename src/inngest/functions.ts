import { db } from "@/db";
import { TextMessage } from "@inngest/agent-kit";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
// Temporarily disabled Gemini API integration to allow agent creation without API key
// import { createGeminiAgent } from "@/lib/gemini-agent";

// Commented out to allow agent creation without requiring Gemini API
/*
const summarizer = createGeminiAgent({
  name: "summarizer",
  system: `
  You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
});
*/

// Simple mock summarizer object to replace the Gemini-based one
const summarizer = {
  // Using empty parameter list since we don't need the parameter
  run: async () => {
    return {
      output: [
        {
          type: "text",
          content: "Meeting summary functionality is disabled as Gemini API integration has been temporarily removed.",
        },
      ],
    };
  },
};
export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    // Commented out since we're not using the transcript in the mock summarizer
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );
        if (!speaker) {
          return {
            ...item,
            user: {
              name: "unknown",
            },
          };
        }
        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });
    // We're not using transcriptWithSpeakers with the mock summarizer

    // Modified to match the new summarizer function signature that takes no arguments
    const { output } = await summarizer.run();

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  }
);
