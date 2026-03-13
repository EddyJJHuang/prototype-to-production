import React, { createContext, useState, useEffect } from 'react';

interface SavedJobsContextType {
  savedJobs: string[];
  toggleSavedJob: (jobId: string) => void;
  isSaved: (jobId: string) => boolean;
}

export const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('visahire_saved_jobs_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('visahire_saved_jobs_v2', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleSavedJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const isSaved = (jobId: string) => savedJobs.includes(jobId);

  return (
    <SavedJobsContext.Provider value={{ savedJobs, toggleSavedJob, isSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
};
