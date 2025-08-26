import React, { useState, useRef, useEffect } from 'react';
import { LanguageIcon } from './Icons';
import { languages, Language } from '../i18n';

interface LanguageSwitcherProps {
    selectedLanguage: Language;
    onSelectLanguage: (language: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ selectedLanguage, onSelectLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleLanguageSelect = (langCode: Language) => {
        onSelectLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <LanguageIcon className="w-6 h-6" />
            </button>
            <div 
                className={`absolute right-0 mt-2 w-40 bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20 origin-top-right transition-all duration-200 ease-out
                    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                {languages.map((lang) => (
                    <a
                        key={lang.code}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLanguageSelect(lang.code);
                        }}
                        className={`block px-4 py-2 text-sm ${
                            selectedLanguage === lang.code
                                ? 'font-semibold text-blue-400'
                                : 'text-slate-200'
                        } hover:bg-slate-700`}
                        role="menuitem"
                    >
                        {lang.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcher;