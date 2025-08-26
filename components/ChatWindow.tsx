import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageType, MessageRole } from '../types';
import { sendMessageStream } from '../services/geminiService';
import Message from './Message';
import QuickActionButton from './QuickActionButton';
import CrisisButton from './CrisisButton';
import { SendIcon } from './Icons';
import { QUICK_ACTION_TOPICS, CRISIS_RESOURCES } from '../constants';

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([
        { id: 'initial', role: MessageRole.MODEL, content: 'Hello! How can I help you today? Please select a topic below or type your question.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCrisisResources, setShowCrisisResources] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: MessageType = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            content: messageText,
        };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setError(null);
        setShowCrisisResources(false);

        const aiMessageId = (Date.now() + 1).toString();
        // Add a placeholder for the AI response
        setMessages(prev => [...prev, { id: aiMessageId, role: MessageRole.MODEL, content: '' }]);

        try {
            // Filter out the initial welcome message for the API call
            const historyForApi = newMessages.filter(m => m.id !== 'initial' && m.id !== aiMessageId);
            const stream = await sendMessageStream(historyForApi, messageText);
            
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let streamedContent = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                streamedContent += decoder.decode(value, { stream: true });
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, content: streamedContent } : msg
                ));
            }
        } catch (e: any) {
            const errorMessage = e.message || 'An unknown error occurred.';
            setError(errorMessage);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, content: `Error: ${errorMessage}` } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, messages]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSend(input);
    };
    
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                {isLoading && messages[messages.length - 1].role === MessageRole.USER && (
                    <Message message={{ id: 'loading', role: MessageRole.MODEL, content: '' }} isLoading={true} />
                )}
                 <div ref={messagesEndRef} />
            </div>

            {showCrisisResources && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">Immediate Help Resources</h3>
                    <ul className="space-y-2">
                        {CRISIS_RESOURCES.map(resource => (
                             <li key={resource.name} className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{resource.name}:</strong> Call {resource.number} {resource.website !== 'N/A' && `(Website: ${resource.website})`}
                             </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                {messages.length <= 1 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {QUICK_ACTION_TOPICS.map((topic, index) => (
                            <QuickActionButton key={index} text={topic} onClick={() => handleSend(topic)} />
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <CrisisButton onClick={() => setShowCrisisResources(prev => !prev)} />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your legal question here..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;