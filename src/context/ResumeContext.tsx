import React, { createContext, useState, useEffect } from 'react';

interface ResumeContextType {
  resumeUploaded: boolean;
  setResumeUploaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(() => {
    const saved = localStorage.getItem('visahire_resume_status_v2');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('visahire_resume_status_v2', JSON.stringify(resumeUploaded));
  }, [resumeUploaded]);

  return (
    <ResumeContext.Provider value={{ resumeUploaded, setResumeUploaded }}>
      {children}
    </ResumeContext.Provider>
  );
};
