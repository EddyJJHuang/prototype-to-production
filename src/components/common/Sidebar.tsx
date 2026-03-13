import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">VisaHire</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavLink to={ROUTES.DASHBOARD} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Dashboard</NavLink>
        <NavLink to={ROUTES.JOB_SEARCH} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Job Search</NavLink>
        <NavLink to={ROUTES.SPONSORSHIP_STATS} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Sponsorship Stats</NavLink>
        <NavLink to={ROUTES.RESUME_MATCH} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Resume Match</NavLink>
        <NavLink to={ROUTES.SAVED_JOBS} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Saved Jobs</NavLink>
        <NavLink to={ROUTES.ALUMNI} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Alumni Network</NavLink>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <NavLink to={ROUTES.SETTINGS} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Settings</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
