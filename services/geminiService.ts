import { MessageType } from '../types';

export const sendMessageStream = async (history: MessageType[], message: string): Promise<ReadableStream<Uint8Array>> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ history, message }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${errorText}`);
        }

        if (!response.body) {
            throw new Error("Response body is empty.");
        }

        return response.body;
    } catch (error) {
        console.error("Error sending message via API route:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get response from AI. Please try again. (${error.message})`);
        }
        throw new Error("An unknown error occurred while contacting the AI.");
    }
};
