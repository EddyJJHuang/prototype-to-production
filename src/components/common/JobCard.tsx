import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../data/mockJobs';
import { ROUTES } from '../../utils/constants';
import Badge from './Badge';
import MatchScore from './MatchScore';
// Note: Assuming Lucide React is available. E.g. Building map pin icon inline for now.
import { MapPin, DollarSign, Building, Bookmark, BookmarkCheck } from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave?: (id: string, e: React.MouseEvent) => void;
  onClick?: (id: string) => void;
  showMatchScore?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  isSaved = false, 
  onToggleSave, 
  onClick,
  showMatchScore = true 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(job.id);
    } else {
      navigate(`${ROUTES.JOB_SEARCH}?id=${job.id}`);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) onToggleSave(job.id, e);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain p-1" />
            ) : (
              <Building className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{job.companyName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {job.sponsorship && (
            <Badge variant="sponsor" className="px-2 py-1 shadow-sm font-semibold">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              H-1B Sponsor
            </Badge>
          )}
          <button 
            onClick={handleSaveClick}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isSaved ? 
              <BookmarkCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 fill-current" /> : 
              <Bookmark className="h-5 w-5" />
            }
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-2 flex-grow">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <DollarSign className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>{job.salaryRange}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          {job.postedDate}
        </div>
        
        {showMatchScore && job.matchScore > 0 && (
          <MatchScore score={job.matchScore} />
        )}
      </div>
    </div>
  );
};

export default JobCard;
