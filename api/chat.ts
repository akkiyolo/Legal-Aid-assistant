import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { MessageType, MessageRole } from "../types";
import { Language } from "../i18n";

export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const languageMap: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  zh: "Mandarin Chinese",
  hi: "Hindi",
};

export default async function handler(req: Request) {
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
    const { history, message, language = 'en' } = (await req.json()) as { history: MessageType[], message: string, language: Language };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const contents = history
      .filter(msg => msg.role === MessageRole.USER || msg.role === MessageRole.MODEL)
      .map(msg => ({
        role: msg.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    
    contents.push({ role: 'user', parts: [{ text: message }] });
    
    const languageInstruction = `\n\nIMPORTANT: You must provide your response in ${languageMap[language]}.`;
    const localizedSystemPrompt = SYSTEM_PROMPT + languageInstruction;

    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: localizedSystemPrompt,
        },
    });

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