
import React from 'react';
import ChatWindow from './components/ChatWindow';
import { DisclaimerIcon, ShieldCheckIcon } from './components/Icons';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Legal Aid Assistant
          </h1>
        </div>
      </header>

      <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 mx-4 mt-4 rounded-md shadow" role="alert">
        <div className="flex">
          <div className="py-1">
            <DisclaimerIcon className="w-6 h-6 text-yellow-500 mr-4" />
          </div>
          <div>
            <p className="font-bold">Important Disclaimer</p>
            <p className="text-sm">
              This is general legal information, not legal advice. Every situation is unique - you should consult with a qualified lawyer for your specific case. This tool is not a substitute for professional legal counsel.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-4">
        <ChatWindow />
      </main>
    </div>
  );
};

export default App;
