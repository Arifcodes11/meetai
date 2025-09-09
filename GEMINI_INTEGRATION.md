# Gemini API Integration in MeetAI

## Overview

This document explains how the Gemini API has been integrated into MeetAI as a free alternative to OpenAI's API. The Gemini API provides similar functionality to OpenAI but at no cost, making it a viable option for development and testing purposes.

## Implementation Details

The integration includes the following components:

1. **Gemini Client Setup** (`src/lib/gemini.ts`)
   - Initializes the Gemini client using the API key from environment variables
   - Configures the model to use "gemini-1.5-flash" (or "gemini-1.5-pro" for deeper reasoning)

2. **Chat Completions Wrapper** (`src/lib/gemini-chat.ts`)
   - Provides an OpenAI-compatible interface for chat completions
   - Handles conversion between OpenAI and Gemini message formats
   - Manages system instructions and chat history

3. **Stream Video Integration** (`src/app/api/webhook/route.ts`)
   - Uses Gemini API key with Stream Video's OpenAI integration
   - Note: This is a partial solution as Stream Video is designed for OpenAI

4. **Agent Implementation** (`src/lib/gemini-agent.ts`)
   - Creates a Gemini-based agent that mimics the @inngest/agent-kit interface
   - Used for meeting summarization in place of OpenAI

## Usage Notes

1. **API Key**: Replace the `GEMINI_API_KEY` in your `.env` file with your valid Gemini API key

2. **Limitations**:
   - Stream Video integration may have limitations as it's designed for OpenAI
   - Some advanced OpenAI features might not have direct equivalents in Gemini
   - Model behavior and responses may differ between OpenAI and Gemini

3. **Performance**: Gemini models may have different performance characteristics compared to OpenAI models

## Future Improvements

1. Implement a more robust Stream Video integration if they add native Gemini support
2. Add fallback mechanisms to handle cases where Gemini API might not work as expected
3. Optimize prompt engineering for Gemini models specifically

## References

- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Gemini API Documentation](https://ai.google.dev/docs/gemini_api)