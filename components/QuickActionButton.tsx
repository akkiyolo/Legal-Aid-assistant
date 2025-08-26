
import React from 'react';

interface QuickActionButtonProps {
    text: string;
    onClick: () => void;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ text, onClick, Icon }) => {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700/80 hover:border-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-3 group hover:shadow-lg hover:shadow-blue-500/10"
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-200">
                <Icon className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors duration-200" />
            </div>
            <p className="text-sm font-medium text-slate-200">{text}</p>
        </button>
    );
};

export default QuickActionButton;