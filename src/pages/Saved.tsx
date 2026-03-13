import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { mockData } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import { Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Saved: React.FC = () => {
  const { savedJobs } = useAppContext();
  
  const savedJobsData = mockData.jobs.filter(job => savedJobs.includes(job.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Saved Jobs</h1>
        <p className="text-slate-600 mt-1 text-lg">Your bookmarked opportunities.</p>
      </div>

      {savedJobsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobsData.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Keep track of jobs you're interested in by clicking the bookmark icon on any job posting.
          </p>
          <Link 
            to="/jobs" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Jobs
          </Link>
        </div>
      )}
    </motion.div>
  );
};
