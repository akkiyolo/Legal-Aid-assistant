
import React from 'react';

interface QuickActionButtonProps {
    text: string;
    onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{text}</p>
        </button>
    );
};

export default QuickActionButton;
