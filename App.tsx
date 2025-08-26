
import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import { DisclaimerIcon, ShieldCheckIcon } from './components/Icons';
import LanguageSwitcher from './components/LanguageSwitcher';
import { translations, Language } from './i18n';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  return (
    <div className="flex flex-col h-screen antialiased text-gray-200">
      <div className="relative max-w-4xl mx-auto w-full h-full flex flex-col bg-slate-900">
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          <header className="bg-slate-900 p-4 flex items-center justify-between z-10 flex-shrink-0 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <ShieldCheckIcon className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white" style={{textShadow: '0 0 10px rgba(79, 174, 245, 0.3)'}}>
                  {t.title}
                </h1>
                <p className="text-xs md:text-sm text-slate-400">{t.tagline}</p>
              </div>
            </div>
            <LanguageSwitcher selectedLanguage={language} onSelectLanguage={setLanguage} />
          </header>

          <div className="bg-amber-400/10 border border-amber-400/30 text-amber-200 p-4 m-4 rounded-lg shadow-lg flex-shrink-0 opacity-0 animate-fade-in-down delay-100" role="alert">
            <div className="flex">
              <div className="py-1">
                <DisclaimerIcon className="w-5 h-5 text-amber-400 mr-3" />
              </div>
              <div>
                <p className="font-bold text-sm">{t.disclaimerTitle}</p>
                <p className="text-sm opacity-90">{t.disclaimerText}</p>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-hidden px-4 pb-4">
            <ChatWindow language={language} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;