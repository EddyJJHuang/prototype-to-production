import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  FileText,
  Users,
  Bookmark,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Job Search', path: '/jobs', icon: Briefcase },
  { name: 'Sponsorship Stats', path: '/stats', icon: BarChart3 },
  { name: 'Resume Match', path: '/resume', icon: FileText },
  { name: 'Alumni Network', path: '/alumni', icon: Users },
  { name: 'Saved Jobs', path: '/saved', icon: Bookmark },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppContext();
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">VisaHire</span>
          <button className="ml-auto lg:hidden text-slate-500" onClick={closeMobileMenu}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-slate-200" referrerPolicy="no-referrer" />
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.visaStatus}</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10">
          <div className="flex items-center flex-1">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700 mr-4"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="max-w-md w-full hidden sm:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="Search jobs, companies, or alumni..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors rounded-full hover:bg-slate-100">
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
