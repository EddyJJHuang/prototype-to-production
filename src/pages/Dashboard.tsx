import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { mockData } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Briefcase, Bookmark, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, savedJobs, resumeUploaded } = useAppContext();
  
  const recommendedJobs = mockData.jobs.slice(0, 3);
  
  const statsData = [
    { name: 'Jan', petitions: 4000 },
    { name: 'Feb', petitions: 3000 },
    { name: 'Mar', petitions: 2000 },
    { name: 'Apr', petitions: 2780 },
    { name: 'May', petitions: 1890 },
    { name: 'Jun', petitions: 2390 },
    { name: 'Jul', petitions: 3490 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-slate-600 mt-1 text-lg">Here's what's happening with your job search today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Applications</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Saved Jobs</p>
            <p className="text-2xl font-bold text-slate-900">{savedJobs.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resume Status</p>
            <p className="text-lg font-bold text-slate-900">{resumeUploaded ? 'Uploaded' : 'Pending'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Profile Match</p>
            <p className="text-2xl font-bold text-slate-900">85%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
            <Link to="/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recommendedJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Chart Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">H-1B Trends 2025</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="petitions" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Link to="/stats" className="mt-4 block text-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Explore full statistics &rarr;
            </Link>
          </div>

          {/* Action Needed */}
          {!resumeUploaded && (
            <div className="bg-indigo-600 p-6 rounded-2xl shadow-md text-white">
              <h3 className="text-lg font-bold mb-2">Upload Your Resume</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Get personalized job matches and see how you stack up against other candidates.
              </p>
              <Link to="/resume" className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                Upload Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
