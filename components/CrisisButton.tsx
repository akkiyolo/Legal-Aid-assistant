
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
            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            aria-label="Show crisis resources"
        >
            <LifeBuoyIcon className="w-6 h-6" />
        </button>
    );
};

export default CrisisButton;
