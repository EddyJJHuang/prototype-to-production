import React, { useContext, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { UserContext } from '../../context/UserContext';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { ResumeContext } from '../../context/ResumeContext';
import {
  LayoutDashboard, Search, BarChart3, FileText, Bookmark,
  Users, Settings, PanelLeftClose, PanelLeftOpen, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) => {
  const { user } = useContext(UserContext) || {};
  const { savedJobs } = useContext(SavedJobsContext) || { savedJobs: [] };
  const { resumeUploaded } = useContext(ResumeContext) || { resumeUploaded: false };
  const location = useLocation();

  const navGroups: NavGroup[] = useMemo(() => [
    {
      label: 'Discover',
      items: [
        { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { path: ROUTES.JOB_SEARCH, label: 'Explore roles', icon: Search },
        { path: ROUTES.SPONSORSHIP_STATS, label: 'Sponsor data', icon: BarChart3 },
      ],
    },
    {
      label: 'My profile',
      items: [
        { path: ROUTES.RESUME_MATCH, label: 'Resume match', icon: FileText },
        { path: ROUTES.SAVED_JOBS, label: 'Saved roles', icon: Bookmark, badge: savedJobs.length || undefined },
      ],
    },
    {
      label: 'Community',
      items: [
        { path: ROUTES.ALUMNI, label: 'Alumni network', icon: Users },
      ],
    },
  ], [savedJobs.length]);

  const navLinkClass = (isActive: boolean) => {
    const base = 'group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150';
    const padding = collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5';
    if (isActive) {
      return `${base} ${padding} bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border-l-[3px] border-primary-600 dark:border-primary-400`;
    }
    return `${base} ${padding} text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 border-l-[3px] border-transparent`;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-800 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
        {!collapsed && (
          <span className="text-lg font-display font-bold text-primary-600 dark:text-primary-400 tracking-tight">VisaHire</span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors hidden md:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" strokeWidth={1.75} /> : <PanelLeftClose className="w-4 h-4" strokeWidth={1.75} />}
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em] px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={() => navLinkClass(isActive)}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />

                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="flex-shrink-0 font-mono text-[10px] font-bold bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Settings + User */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
        {/* Settings */}
        <div className="px-3 py-2">
          <NavLink
            to={ROUTES.SETTINGS}
            onClick={onCloseMobile}
            className={() => navLinkClass(location.pathname === ROUTES.SETTINGS)}
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />
            {!collapsed && <span className="flex-1 truncate">Settings</span>}
          </NavLink>
        </div>

        {/* User card */}
        <div className={`px-3 py-3 ${collapsed ? 'flex justify-center' : ''}`}>
          <NavLink
            to={ROUTES.RESUME_MATCH}
            onClick={onCloseMobile}
            className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-display font-bold text-white flex-shrink-0 shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                {resumeUploaded ? (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    Score: <span className="font-mono font-bold text-match-high">82%</span>
                    <ChevronRight className="w-3 h-3" strokeWidth={1.75} />
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Upload resume →</p>
                )}
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-200 flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-white dark:bg-gray-900 z-50 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
