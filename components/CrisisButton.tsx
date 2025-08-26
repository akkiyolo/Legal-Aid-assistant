
import React from 'react';
import { LifeBuoyIcon } from './Icons';

interface CrisisButtonProps {
    onClick: () => void;
}

const CrisisButton: React.FC<CrisisButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className="bg-red-600 text-white flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-200"
            aria-label="Show crisis resources"
        >
            <LifeBuoyIcon className="w-6 h-6" />
        </button>
    );
};

export default CrisisButton;