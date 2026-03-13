import React, { createContext, useState, useEffect } from 'react';

interface ResumeContextType {
  resumeUploaded: boolean;
  setResumeUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  resumeData: any;
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(() => {
    const saved = localStorage.getItem('visahire_resume_status_v2');
    return saved ? JSON.parse(saved) : false;
  });
  const [resumeData, setResumeData] = useState<any>(() => {
    const saved = localStorage.getItem('visahire_resume_data');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('visahire_resume_status_v2', JSON.stringify(resumeUploaded));
  }, [resumeUploaded]);

  useEffect(() => {
    if (resumeData) {
      localStorage.setItem('visahire_resume_data', JSON.stringify(resumeData));
    } else {
      localStorage.removeItem('visahire_resume_data');
    }
  }, [resumeData]);

  return (
    <ResumeContext.Provider value={{ resumeUploaded, setResumeUploaded, resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};
