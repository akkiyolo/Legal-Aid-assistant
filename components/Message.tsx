
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageType, MessageRole } from '../types';
import { UserIcon, AiIcon, CopyIcon, CheckIcon } from './Icons';

interface MessageProps {
    message: MessageType;
    isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);

const Message: React.FC<MessageProps> = ({ message, isLoading }) => {
    const [isCopied, setIsCopied] = useState(false);
    const isUser = message.role === MessageRole.USER;
    const isModel = message.role === MessageRole.MODEL;

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const containerClasses = isUser ? "flex justify-end" : "flex justify-start";
    const bubbleClasses = isUser
        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-l-2xl rounded-tr-2xl"
        : "bg-slate-700 text-slate-100 rounded-r-2xl rounded-tl-2xl";

    const Icon = isUser ? UserIcon : AiIcon;
    const iconContainerClasses = isUser ? "ml-3" : "mr-3";
    const iconAnimation = isUser ? "animate-slide-fade-in-right" : "animate-slide-fade-in-left";
    const bubbleAnimation = isUser ? "animate-slide-fade-in-right" : "animate-slide-fade-in-left";

    return (
        <div className={`flex items-start max-w-full group ${containerClasses}`}>
             {!isUser && (
                <div className={`${iconContainerClasses} flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center opacity-0 ${iconAnimation} [animation-delay:0.1s]`}>
                    <Icon className="w-5 h-5 text-slate-300" />
                </div>
            )}
            <div className={`relative px-4 py-3 max-w-xl md:max-w-2xl opacity-0 ${bubbleClasses} ${bubbleAnimation} [animation-delay:0.2s]`}>
                {isLoading || (message.content === '' && isModel) ? <TypingIndicator /> : (
                    <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
                
                {isModel && !isLoading && message.content && (
                     <button
                        onClick={handleCopy}
                        className="absolute -top-3 -right-3 p-1.5 bg-slate-600 text-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Copy message"
                    >
                        {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {isUser && (
                <div className={`${iconContainerClasses} flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center opacity-0 ${iconAnimation} [animation-delay:0.1s]`}>
                    <Icon className="w-5 h-5 text-blue-400" />
                </div>
            )}
        </div>
    );
};

export default Message;