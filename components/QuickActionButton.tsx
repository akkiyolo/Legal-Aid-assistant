
import React from 'react';

interface QuickActionButtonProps {
    text: string;
    onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <p className="text-sm font-medium text-slate-200">{text}</p>
        </button>
    );
};

export default QuickActionButton;