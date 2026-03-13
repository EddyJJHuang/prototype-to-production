import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { motion } from 'motion/react';
import { User, Bell, Shield, Moon, Sun, CreditCard, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';

const Settings: React.FC = () => {
  const { user } = useContext(UserContext) || {};
  const themeContext = useContext(ThemeContext);

  const isDark = themeContext?.theme === 'dark';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and app preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <User className="w-4 h-4 mr-3" /> Profile
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
            <Bell className="w-4 h-4 mr-3" /> Notifications
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
            <Shield className="w-4 h-4 mr-3" /> Security
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
            <CreditCard className="w-4 h-4 mr-3" /> Billing
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-sm overflow-hidden">
                  {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : 'A'}
                </div>
                <div>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white sm:text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white sm:text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                  <input type="text" defaultValue={user?.university} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white sm:text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visa Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white sm:text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>{user?.visaStatus}</option>
                    <option>H-1B</option>
                    <option>OPT STEM</option>
                    <option>O-1</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">App Preferences</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark modes</p>
                </div>
                <button 
                  onClick={themeContext?.toggleTheme}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'}`}>
                    <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isDark ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'}`}>
                      <Sun className="h-3 w-3 text-gray-400" />
                    </span>
                    <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isDark ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'}`}>
                      <Moon className="h-3 w-3 text-blue-600" />
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sign Out</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">End your current session</p>
              </div>
              <button 
                onClick={logout}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </button>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
