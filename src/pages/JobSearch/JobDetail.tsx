import React, { useContext } from 'react';
import { Job } from '../../data/mockJobs';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import Badge from '../../components/common/Badge';
import MatchScore from '../../components/common/MatchScore';
import { MapPin, DollarSign, Building, Bookmark, BookmarkCheck, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface JobDetailProps {
  job: Job;
  onClose?: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onClose }) => {
  const { isSaved, toggleSavedJob } = useContext(SavedJobsContext) || {};
  const saved = isSaved ? isSaved(job.id) : false;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain" />
              ) : (
                <Building className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{job.companyName}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => toggleSavedJob?.(job.id)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {saved ? 
                <BookmarkCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 fill-current" /> : 
                <Bookmark className="h-5 w-5" />
              }
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:brightness-110 active:scale-[0.98] text-white font-medium rounded-lg transition-all flex items-center justify-center">
              Apply <ExternalLink className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.sponsorship && (
            <Badge variant="sponsor" className="px-2.5 py-1 text-sm shadow-sm font-semibold">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              H-1B Sponsor
            </Badge>
          )}
          {job.greencardSupport && (
            <Badge variant="success">Green Card Support</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" />{job.location}</div>
          <div className="flex items-center"><DollarSign className="h-4 w-4 mr-1.5" />{job.salaryRange}</div>
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />{job.postedDate}</div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Match Score Panel */}
        {job.matchScore > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-5">
            <div className="flex items-start">
              <div className="mr-5">
                <MatchScore score={job.matchScore} className="scale-125 transform origin-top-left" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Why you match</h3>
                <ul className="space-y-2">
                  {job.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the role</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
        
      </div>
    </motion.div>
  );
};

export default JobDetail;
