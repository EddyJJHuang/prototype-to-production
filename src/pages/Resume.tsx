import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { mockData } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Resume: React.FC = () => {
  const { resumeUploaded, setResumeUploaded } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get top matched jobs if resume is uploaded
  const matchedJobs = mockData.jobs
    .filter(job => job.matchScore > 80)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload and parsing delay
    setTimeout(() => {
      setIsUploading(false);
      setResumeUploaded(true);
      toast.success('Resume parsed successfully! We found some great matches.');
    }, 2000);
  };

  const handleRemoveResume = () => {
    setResumeUploaded(false);
    toast.info('Resume removed.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resume Match</h1>
        <p className="text-slate-600 mt-1 text-lg">Upload your resume to see how you match with top sponsored roles.</p>
      </div>

      {!resumeUploaded ? (
        <div 
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-colors ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <h3 className="text-xl font-semibold text-slate-900">Parsing your resume...</h3>
              <p className="text-slate-500">Extracting skills and experience to find the best matches.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                <UploadCloud className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Drag & drop your resume here</h3>
              <p className="text-slate-500">Supports PDF files up to 5MB</p>
              
              <div className="flex items-center w-full max-w-xs my-4">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-slate-400 text-sm">OR</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Browse Files
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInput} 
                accept=".pdf" 
                className="hidden" 
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Success State */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">Resume Active</h3>
                <p className="text-emerald-700 mt-1">
                  Your resume has been parsed. We've extracted your skills in React, TypeScript, and Node.js.
                </p>
                <div className="mt-3 flex items-center space-x-2 text-sm text-emerald-600 font-medium">
                  <FileText className="w-4 h-4" />
                  <span>alex_johnson_resume_2025.pdf</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleRemoveResume}
              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
              title="Remove resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Matched Jobs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Top Matches for You</h2>
              <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-medium">
                Based on your skills
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matchedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <img src={job.companyLogo} alt={job.companyName} className="w-14 h-14 rounded-xl border border-slate-100 object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                          <p className="text-slate-500 font-medium">{job.companyName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 font-bold text-lg border-2 border-indigo-100">
                        {job.matchScore}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Why it's a match</h4>
                      <ul className="space-y-2">
                        {job.matchReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">{job.location}</span>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
