import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import SearchBar from '../../components/common/SearchBar';
import JobList from './JobList';
import JobDetail from './JobDetail';
import { motion } from 'motion/react';
import { Filter } from 'lucide-react';

const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sponsorshipOnly, setSponsorshipOnly] = useState(false);
  
  const { savedJobs, toggleSavedJob } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {} };
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedId = queryParams.get('id');

  const selectedJob = jobs.find(j => j.id === selectedId) || null;

  // Create a map for fast lookup in list
  const savedJobsMap = savedJobs.reduce((acc, id) => ({ ...acc, [id]: true }), {} as Record<string, boolean>);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const filters = {
          q: searchQuery,
          sponsorshipRequired: sponsorshipOnly
        };
        const res = await getJobs(filters);
        setJobs(res.data);
        
        // Auto-select first if none selected
        if (res.data.length > 0 && !selectedId && !loading) {
          navigate(`?id=${res.data[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, sponsorshipOnly]);

  const handleJobSelect = (id: string) => {
    navigate(`?id=${id}`);
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedJob(id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-6rem)]" // Fill viewport minus topbar/padding
    >
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Search</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Find H-1B sponsoring tech jobs</p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search role or company..."
            className="flex-1 sm:w-64"
          />
          <button 
            onClick={() => setSponsorshipOnly(!sponsorshipOnly)}
            className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              sponsorshipOnly 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            H-1B Only
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Panel: List */}
        <div className={`w-full md:w-5/12 lg:w-1/3 flex-shrink-0 overflow-y-auto pr-1 custom-scrollbar ${selectedJob ? 'hidden md:block' : 'block'}`}>
          <JobList 
            jobs={jobs}
            loading={loading}
            onJobSelect={handleJobSelect}
            selectedId={selectedId}
            savedJobsMap={savedJobsMap}
            onToggleSave={handleToggleSave}
          />
        </div>

        {/* Right Panel: Detail */}
        <div className={`w-full md:flex-1 h-full ${!selectedJob ? 'hidden md:flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-700' : 'block'}`}>
          {selectedJob ? (
            <JobDetail 
              job={selectedJob} 
              onClose={() => navigate('?')}
            />
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center">
              <p>Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobSearch;
