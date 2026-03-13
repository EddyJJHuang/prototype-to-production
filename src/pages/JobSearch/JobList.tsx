import React from 'react';
import { Job } from '../../data/mockJobs';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  onJobSelect: (id: string) => void;
  selectedId: string | null;
  savedJobsMap: Record<string, boolean>;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  loading, 
  onJobSelect, 
  selectedId, 
  savedJobsMap, 
  onToggleSave 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Loader type="skeleton" count={5} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState 
        title="No matches found"
        description="Try adjusting your filters or broadening your search."
      />
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {jobs.map(job => (
        <div 
          key={job.id} 
          className={`transition-all duration-200 rounded-xl ${selectedId === job.id ? 'ring-2 ring-blue-500 shadow-md transform scale-[1.02]' : ''}`}
        >
          <JobCard 
            job={job}
            isSaved={savedJobsMap[job.id]}
            onToggleSave={onToggleSave}
            onClick={() => onJobSelect(job.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default JobList;
