import React, { useContext } from 'react';
import { ResumeContext } from '../../context/ResumeContext';
import ResumeUpload from './ResumeUpload';
import ResumeResults from './ResumeResults';
import { motion } from 'motion/react';

const ResumeMatch: React.FC = () => {
  const { resumeUploaded, setResumeUploaded, setResumeData } = useContext(ResumeContext) || {};

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Match</h1>
        <p className="text-gray-500 mt-1">AI-powered resume analysis for H-1B roles</p>
      </div>

      {resumeUploaded ? (
        <ResumeResults />
      ) : (
        <ResumeUpload 
          onSuccess={(data) => {
            setResumeData?.(data);
            setResumeUploaded?.(true);
          }} 
        />
      )}
    </motion.div>
  );
};

export default ResumeMatch;
