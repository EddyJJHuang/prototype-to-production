import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';

const TopBar: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10 transition-colors duration-200 sticky top-0">
      <div className="flex md:hidden items-center">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">VisaHire</span>
      </div>
      <div className="hidden md:block"></div> {/* Spacer */}
      <div className="flex items-center space-x-4">
        
        {/* Theme Toggle */}
        <button 
          onClick={themeContext?.toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {themeContext?.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
          <span className="text-sm font-medium text-white">A</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
