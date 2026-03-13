import React, { useContext, useEffect, useState } from 'react';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { getJobById } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

const SavedJobs: React.FC = () => {
  const { savedJobs, toggleSavedJob } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {} };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const fetches = savedJobs.map(id => getJobById(id));
        const results = await Promise.all(fetches);
        // Filter out any nulls if a job was deleted
        setJobs(results.filter((job): job is Job => job !== null));
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (savedJobs.length > 0) {
      fetchSavedJobs();
    } else {
      setJobs([]);
      setLoading(false);
    }
  }, [savedJobs]);

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedJob(id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
        <p className="text-gray-500 mt-1">Review opportunities you've bookmarked.</p>
      </div>

      {loading ? (
        <Loader type="card" count={6} />
      ) : jobs.length === 0 ? (
        <EmptyState 
          icon={<Bookmark className="w-8 h-8" />}
          title="No saved jobs yet"
          description="Explore and bookmark the ones that catch your eye!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="h-full">
              <JobCard 
                job={job} 
                isSaved={true} 
                onToggleSave={handleToggleSave} 
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SavedJobs;
