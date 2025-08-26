
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageType, MessageRole } from '../types';
import { sendMessageStream } from '../services/geminiService';
import Message from './Message';
import QuickActionButton from './QuickActionButton';
import CrisisButton from './CrisisButton';
import { SendIcon, LandlordIcon, WageIcon, FamilyIcon, DebtIcon } from './Icons';
import { CRISIS_RESOURCES } from '../constants';
import { translations, Language } from '../i18n';

interface ChatWindowProps {
    language: Language;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Landlord: LandlordIcon,
    Wage: WageIcon,
    Family: FamilyIcon,
    Debt: DebtIcon
};

const ChatWindow: React.FC<ChatWindowProps> = ({ language }) => {
    const t = translations[language];
    
    const [messages, setMessages] = useState<MessageType[]>([
        { id: 'initial', role: MessageRole.MODEL, content: t.initialMessage }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCrisisResources, setShowCrisisResources] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Reset initial message when language changes
    useEffect(() => {
        setMessages([{ id: 'initial', role: MessageRole.MODEL, content: t.initialMessage }]);
    }, [language, t.initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const historyForApi = messages.filter(m => m.id !== 'initial');

        const userMessage: MessageType = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            content: messageText,
        };
        
        const aiMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, userMessage, { id: aiMessageId, role: MessageRole.MODEL, content: '' }]);

        setInput('');
        setIsLoading(true);
        setError(null);
        setShowCrisisResources(false);

        try {
            const stream = await sendMessageStream(historyForApi, messageText, language);
            
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
                msg.id === aiMessageId ? { ...msg, content: `${t.errorPrefix} ${errorMessage}` } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, messages, language, t.errorPrefix]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSend(input);
    };
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-1 pr-4 space-y-6">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                {isLoading && messages[messages.length - 1].role === MessageRole.USER && (
                    <Message message={{ id: 'loading', role: MessageRole.MODEL, content: '' }} isLoading={true} />
                )}
                 <div ref={messagesEndRef} />
            </div>

            {showCrisisResources && (
                <div className="p-4 border-t border-slate-700 bg-red-900/50 opacity-0 animate-fade-in-down">
                    <h3 className="text-lg font-bold text-red-300 mb-2">{t.crisisTitle}</h3>
                    <ul className="space-y-2">
                        {CRISIS_RESOURCES.map(resource => (
                             <li key={resource.name} className="text-sm text-slate-300">
                                <strong>{resource.name}:</strong> Call {resource.number} {resource.website !== 'N/A' && `(Website: ${resource.website})`}
                             </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && (
                <div className="p-4 border-t border-slate-700 bg-red-900/50 text-red-200">
                    <p><strong>{t.errorPrefix}</strong> {error}</p>
                </div>
            )}

            <div className="p-1 pt-4">
                <div className="max-w-4xl mx-auto">
                    {messages.length <= 1 && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            {t.quickActions.map((topic, index) => {
                                const IconComponent = iconMap[topic.icon];
                                return (
                                    <div key={index} className={`opacity-0 animate-fade-in-down delay-${200 + index * 100}`}>
                                        <QuickActionButton 
                                            text={topic.text} 
                                            Icon={IconComponent}
                                            onClick={() => handleSend(topic.text)} 
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3 bg-slate-800 rounded-xl p-2">
                        <CrisisButton onClick={() => setShowCrisisResources(prev => !prev)} />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t.inputPlaceholder}
                            className="flex-1 p-2 bg-transparent focus:outline-none text-slate-100 placeholder-slate-400"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-slate-700 text-white p-3 rounded-full hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 data-[active=true]:bg-blue-600 data-[active=true]:hover:bg-blue-500"
                            data-active={!isLoading && !!input.trim()}
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
