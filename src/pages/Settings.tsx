import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { User, Mail, GraduationCap, Globe, Bell, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { user } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully.');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-600 mt-1 text-lg">Manage your account and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6">
            <nav className="space-y-2">
              <a href="#" className="flex items-center px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm">
                <User className="w-4 h-4 mr-3" />
                Profile
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                <Shield className="w-4 h-4 mr-3" />
                Privacy
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                <Key className="w-4 h-4 mr-3" />
                Security
              </a>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Profile Section */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                
                <div className="flex items-center space-x-6 mb-8">
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                  <div>
                    <button type="button" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">University</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue={user.university}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Visa Status</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        defaultValue={user.visaStatus}
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
                      >
                        <option value="F-1 OPT">F-1 OPT</option>
                        <option value="F-1 STEM OPT">F-1 STEM OPT</option>
                        <option value="H-1B">H-1B</option>
                        <option value="O-1">O-1</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-slate-200" />

              {/* Preferences Section */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Preferences</h2>
                
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Job Alerts</p>
                      <p className="text-sm text-slate-500">Receive weekly emails about new sponsored roles matching your profile.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Alumni Messages</p>
                      <p className="text-sm text-slate-500">Allow alumni to send you direct messages.</p>
                    </div>
                  </label>
                </div>
              </section>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
