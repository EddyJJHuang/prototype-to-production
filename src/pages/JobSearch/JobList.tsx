import React from 'react';
import { Job } from '../../data/mockJobs';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { SearchX } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  onJobSelect: (id: string) => void;
  selectedId: string | null;
  savedJobsMap: Record<string, boolean>;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onResetFilters?: () => void;
}

const JobList = ({
  jobs,
  loading,
  onJobSelect,
  selectedId,
  savedJobsMap,
  onToggleSave,
  onResetFilters,
}: JobListProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
              </div>
              <div className="h-6 w-14 bg-gray-100 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="w-7 h-7" strokeWidth={1.75} />}
        title="No roles match your filters"
        description="Try broadening your search or adjusting your filters — new roles are added daily."
        action={
          onResetFilters ? (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-sm font-medium font-display text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            >
              Reset filters
            </button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-2.5 pb-6">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          compact
          isSelected={selectedId === job.id}
          isSaved={savedJobsMap[job.id]}
          onToggleSave={onToggleSave}
          onClick={() => onJobSelect(job.id)}
        />
      ))}
    </div>
  );
};

export default JobList;
