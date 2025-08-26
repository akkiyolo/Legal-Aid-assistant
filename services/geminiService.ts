
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAI = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const startChat = (): Chat => {
    if (!chat) {
        const genAI = getAI();
        chat = genAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });
    }
    return chat;
};

export const sendMessageStream = async (message: string) => {
    const chatSession = startChat();
    try {
        const result = await chatSession.sendMessageStream({ message });
        return result;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        throw new Error("Failed to get response from AI. Please check your API key and network connection.");
    }
};
