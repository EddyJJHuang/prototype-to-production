import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, mockData } from '../data/mockData';

interface AppContextType {
  savedJobs: string[];
  toggleSavedJob: (jobId: string) => void;
  resumeUploaded: boolean;
  setResumeUploaded: (status: boolean) => void;
  user: typeof mockData.user;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('visahire_saved_jobs');
    return saved ? JSON.parse(saved) : [];
  });
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(() => {
    const saved = localStorage.getItem('visahire_resume_status');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('visahire_saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('visahire_resume_status', JSON.stringify(resumeUploaded));
  }, [resumeUploaded]);

  const toggleSavedJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        savedJobs,
        toggleSavedJob,
        resumeUploaded,
        setResumeUploaded,
        user: mockData.user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
