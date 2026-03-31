import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon, Bell, Menu } from 'lucide-react';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

const TopBar = ({ onOpenMobileSidebar }: TopBarProps) => {
  const themeContext = useContext(ThemeContext);

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 z-10 transition-colors duration-200 sticky top-0 flex-shrink-0">
      {/* Left: mobile hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <span className="text-base font-display font-bold text-primary-600 dark:text-primary-400 md:hidden">VisaHire</span>
      </div>

      {/* Spacer */}
      <div className="hidden md:block" />

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={themeContext?.toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {themeContext?.theme === 'dark' ? <Sun className="w-4.5 h-4.5" strokeWidth={1.75} /> : <Moon className="w-4.5 h-4.5" strokeWidth={1.75} />}
        </button>

        <button
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-[1.5px] border-white dark:border-gray-900" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
