
import React from 'react';
import { MessageType, MessageRole } from '../types';
import { UserIcon, AiIcon } from './Icons';

interface MessageProps {
    message: MessageType;
    isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .split('\n').map((line, index) => {
            if (line.trim().startsWith('- ')) {
                return <li key={index} className="ml-4">{line.substring(2)}</li>;
            }
            return <p key={index}>{line}</p>;
        });

    // Check if there are list items to wrap them in a <ul>
    const hasListItems = formattedContent.some(el => el.type === 'li');
    if (hasListItems) {
        let listStartIndex = formattedContent.findIndex(el => el.type === 'li');
        let listEndIndex = formattedContent.map(e => e.type).lastIndexOf('li');

        const beforeList = formattedContent.slice(0, listStartIndex);
        const listItems = formattedContent.slice(listStartIndex, listEndIndex + 1);
        const afterList = formattedContent.slice(listEndIndex + 1);
        
        return (
            <>
                {beforeList}
                <ul className="list-disc list-inside my-2 space-y-1">{listItems}</ul>
                {afterList}
            </>
        );
    }

    return <>{formattedContent}</>;
};

const Message: React.FC<MessageProps> = ({ message, isLoading }) => {
    const isUser = message.role === MessageRole.USER;
    const isModel = message.role === MessageRole.MODEL;

    const containerClasses = isUser ? "flex justify-end" : "flex justify-start";
    const bubbleClasses = isUser
        ? "bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl"
        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-2xl rounded-tl-2xl";

    const Icon = isUser ? UserIcon : AiIcon;
    const iconContainerClasses = isUser ? "ml-3" : "mr-3";

    return (
        <div className={`${containerClasses} items-start max-w-full group`}>
            {!isUser && (
                <div className={`${iconContainerClasses} flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
            )}
            <div className={`px-4 py-3 max-w-xl md:max-w-2xl ${bubbleClasses} shadow-md`}>
                {isLoading || (message.content === '' && isModel) ? <TypingIndicator /> : <MessageContent content={message.content} />}
            </div>
            {isUser && (
                <div className={`${iconContainerClasses} flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
            )}
        </div>
    );
};

export default Message;
