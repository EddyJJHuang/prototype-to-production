import React from 'react';
import { Job } from '../data/mockData';
import { Building2, MapPin, DollarSign, Bookmark, BookmarkCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { savedJobs, toggleSavedJob } = useAppContext();
  const isSaved = savedJobs.includes(job.id);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <img src={job.companyLogo} alt={job.companyName} className="w-12 h-12 rounded-lg border border-slate-100 object-cover" referrerPolicy="no-referrer" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <Building2 className="w-4 h-4 mr-1" />
              <span>{job.companyName}</span>
              <span className="mx-2">•</span>
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleSavedJob(job.id)}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
        >
          {isSaved ? <BookmarkCheck className="w-5 h-5 text-indigo-600" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          <DollarSign className="w-3.5 h-3.5 mr-0.5" />
          {job.salaryRange}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {job.experienceLevel}
        </span>
        {job.sponsorship && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            H-1B Sponsored
          </span>
        )}
        {job.greencardSupport && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            GC Support
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs border border-indigo-100">
            {job.matchScore}%
          </div>
          <span className="ml-2 text-sm text-slate-600 font-medium">Match Score</span>
        </div>
        <span className="text-xs text-slate-400">{job.postedDate}</span>
      </div>
    </motion.div>
  );
};
