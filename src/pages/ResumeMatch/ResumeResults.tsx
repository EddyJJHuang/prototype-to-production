import React, { useEffect, useState, useContext } from 'react';
import { getJobs } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { ResumeContext } from '../../context/ResumeContext';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import { Trash2, FileCheck, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const ResumeResults: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResumeUploaded, resumeData, setResumeData } = useContext(ResumeContext) || { setResumeUploaded: () => {} };
  const { savedJobs, toggleSavedJob } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {} };

  // Extract classification info from resume analysis
  const jobTitle = resumeData?.classification?.job_family_label || 'Software Engineer';
  const seniorityLevel = resumeData?.classification?.seniority_level || '';
  const skills = resumeData?.candidate?.skills || [];
  const topSkills = Array.isArray(skills) ? skills.slice(0, 5) : [];

  useEffect(() => {
    const fetchRealJobs = async () => {
      setLoading(true);
      try {
        // Build a search query from resume analysis data
        const searchQuery = seniorityLevel 
          ? `${seniorityLevel} ${jobTitle}` 
          : jobTitle;
        
        const res = await getJobs({ q: searchQuery, page: 1 });
        setJobs(res.data.slice(0, 9)); // Show top 9 matches
      } catch (err) {
        console.error("Failed to fetch matched jobs from JSearch", err);
        // Fallback: try a simpler query
        try {
          const fallback = await getJobs({ q: jobTitle });
          setJobs(fallback.data.slice(0, 9));
        } catch (fallbackErr) {
          console.error("Fallback search also failed", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRealJobs();
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
      {/* Header with analysis summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileCheck className="w-6 h-6 text-green-500 mr-2" />
            Looking good! Here's what we found.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            We analyzed your resume and found real job openings that match your profile.
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

      {/* Resume Analysis Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Detected Role</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{jobTitle}</p>
          </div>
        </div>

        {seniorityLevel && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Seniority Level</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{seniorityLevel}</p>
            </div>
          </div>
        )}

        {topSkills.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Top Skills</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {topSkills.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Jobs Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Top Job Matches for "{jobTitle}"
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real-time job listings from across the web, matched to your profile
        </p>
      </div>

      {loading ? (
        <Loader type="card" count={6} />
      ) : jobs.length > 0 ? (
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
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No matching jobs found. Try uploading a different resume.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeResults;
