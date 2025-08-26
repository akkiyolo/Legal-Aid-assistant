import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { MessageType, MessageRole } from "../types";

// This is required for Vercel Edge Functions
export const config = {
  runtime: 'edge',
};

// Common headers for CORS. This allows the frontend to communicate with the API.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};


export default async function handler(req: Request) {
  // Handle CORS preflight requests. The browser sends this before the actual POST request.
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }

  if (!process.env.API_KEY) {
    return new Response('API_KEY environment variable not set', {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }

  try {
    const { history, message } = (await req.json()) as { history: MessageType[], message: string };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Transform message history to the format required by the Gemini API
    const contents = history
      .filter(msg => msg.role === MessageRole.USER || msg.role === MessageRole.MODEL)
      .map(msg => ({
        role: msg.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    
    // Add the latest user message
    contents.push({ role: 'user', parts: [{ text: message }] });
    
    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: SYSTEM_PROMPT,
        },
    });

    // Create a streaming response to send back to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(`Error processing request: ${errorMessage}`, {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
}