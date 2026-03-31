import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../data/mockJobs';
import { ROUTES } from '../../utils/constants';
import Badge from './Badge';
import MatchScore from './MatchScore';
import { MapPin, DollarSign, Building, Bookmark, BookmarkCheck, Clock } from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  isSelected?: boolean;
  onToggleSave?: (id: string, e: React.MouseEvent) => void;
  onClick?: (id: string) => void;
  showMatchScore?: boolean;
  compact?: boolean;
}

const JobCard = ({
  job,
  isSaved = false,
  isSelected = false,
  onToggleSave,
  onClick,
  showMatchScore = true,
  compact = false,
}: JobCardProps) => {
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

  const leftBorderColor = isSelected
    ? 'border-l-primary-600'
    : job.sponsorship
      ? 'border-l-emerald-400 dark:border-l-emerald-600'
      : 'border-l-transparent';

  const cardBg = isSelected
    ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800/40'
    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <div
      onClick={handleCardClick}
      className={`border-l-[3px] ${leftBorderColor} border ${cardBg} rounded-xl ${compact ? 'p-3' : 'p-4'} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group flex flex-col h-full`}
    >
      {/* Header: Badge + Save */}
      <div className="flex justify-between items-start mb-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Company logo */}
          <div className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center`}>
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain p-1" />
            ) : (
              <Building className="h-5 w-5 text-gray-400" strokeWidth={1.75} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className={`font-display font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${compact ? 'text-sm' : 'text-[15px]'}`}>
              {job.title}
            </h3>
            <p className={`text-gray-500 dark:text-gray-400 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              {job.companyName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {job.sponsorship && (
            <Badge variant="sponsor">H-1B</Badge>
          )}
          <button
            onClick={handleSaveClick}
            className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
          >
            {isSaved ?
              <BookmarkCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 fill-current" strokeWidth={1.75} /> :
              <Bookmark className="h-4 w-4" strokeWidth={1.75} />
            }
          </button>
        </div>
      </div>

      {/* Meta: Location + Salary */}
      <div className={`space-y-1.5 flex-grow ${compact ? 'mt-1' : 'mt-2'}`}>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" strokeWidth={1.75} />
          <span className="truncate text-xs">{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <DollarSign className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" strokeWidth={1.75} />
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{job.salaryRange}</span>
        </div>
      </div>

      {/* Footer: Posted date + Match score */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 font-medium">
          <Clock className="h-3 w-3 mr-1" strokeWidth={1.75} />
          {job.postedDate || 'Recently'}
        </div>

        {showMatchScore && job.matchScore > 0 && (
          <MatchScore score={job.matchScore} />
        )}
      </div>
    </div>
  );
};

export default JobCard;
