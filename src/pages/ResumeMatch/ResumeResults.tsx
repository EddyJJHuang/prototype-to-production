import React, { useEffect, useState, useContext } from 'react';
import { getJobs } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { ResumeContext } from '../../context/ResumeContext';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import { Trash2, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

const ResumeResults: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResumeUploaded, resumeData, setResumeData } = useContext(ResumeContext) || { setResumeUploaded: () => {} };
  const { savedJobs, toggleSavedJob } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {} };

  useEffect(() => {
    const fetchMatches = async () => {
      if (resumeData && resumeData.recommendations) {
        setLoading(true);
        const parsedJobs: Job[] = resumeData.recommendations.map((rec: any, idx: number) => ({
          id: `api-job-${idx}`,
          companyId: `api-comp-${idx}`,
          companyName: rec.employer_name || rec.name || 'Unknown',
          companyLogo: '',
          title: resumeData.classification?.job_family_label || 'Software Engineer',
          location: 'United States',
          salaryRange: rec.avg_salary ? `$${Math.floor(rec.avg_salary / 1000)}k+` : 'Varies',
          sponsorship: true,
          greencardSupport: false,
          matchScore: rec.scoreDisplay || Math.round((rec.score || 0) * 100),
          postedDate: 'Recently',
          description: `You stand a strong chance here because: ${rec.reasons?.join(' ')}`,
          requirements: ['H-1B Visa sponsorship tracked actively in the current season.'],
          matchReasons: rec.reasons || [],
          experienceLevel: resumeData.classification?.seniority_level || 'Professional',
          industry: rec.industry || 'Technology'
        }));
        setJobs(parsedJobs);
        setLoading(false);
      } else {
        try {
          const res = await getJobs();
          const matches = [...res.data]
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 9);
          setJobs(matches);
        } catch (err) {
          console.error("Failed to fetch match results", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMatches();
  }, [resumeData]);

  const handleReset = () => {
    localStorage.removeItem('visahire_resume_status_v2');
    if (setResumeData) setResumeData(null);
    setResumeUploaded(false);
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedJob(id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileCheck className="w-6 h-6 text-green-500 mr-2" />
            Looking good! Here's what we found.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            We extracted your skills and matched them against active H-1B sponsors.
          </p>
        </div>
        
        <button 
          onClick={handleReset}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Resume
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Sponsorship Matches</h3>
      </div>

      {loading ? (
        <Loader type="card" count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              isSaved={savedJobs.includes(job.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ResumeResults;
