import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { motion } from 'motion/react';
import { User, Moon, Sun, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';

const Settings = () => {
  const { user } = useContext(UserContext) || {};
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white">Profile</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary-600 flex items-center justify-center text-xl font-display font-bold text-white shadow-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-display font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'email@example.com'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="s-name" className="block text-xs font-display font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Full name</label>
              <input id="s-name" type="text" defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white font-body focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all" />
            </div>
            <div>
              <label htmlFor="s-email" className="block text-xs font-display font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
              <input id="s-email" type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white font-body focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all" />
            </div>
            <div>
              <label htmlFor="s-univ" className="block text-xs font-display font-semibold text-gray-500 dark:text-gray-400 mb-1.5">University</label>
              <input id="s-univ" type="text" defaultValue={user?.university} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white font-body focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all" />
            </div>
            <div>
              <label htmlFor="s-visa" className="block text-xs font-display font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Visa status</label>
              <select id="s-visa" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white font-body focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all">
                <option>{user?.visaStatus || 'F-1 OPT'}</option>
                <option>H-1B</option>
                <option>OPT STEM</option>
                <option>O-1</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-display font-semibold hover:bg-primary-700 transition-colors active:scale-[0.98]">
              Save changes
            </button>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white">Preferences</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-display font-semibold text-gray-900 dark:text-white">Dark mode</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={themeContext?.toggleTheme}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isDark ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
            >
              <span className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}>
                <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`}>
                  <Sun className="h-3 w-3 text-gray-400" strokeWidth={2} />
                </span>
                <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isDark ? 'opacity-100' : 'opacity-0'}`}>
                  <Moon className="h-3 w-3 text-primary-600" strokeWidth={2} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Sign out */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-display font-semibold text-gray-900 dark:text-white">Sign out</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">End your current session</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-display font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} /> Log out
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default Settings;
