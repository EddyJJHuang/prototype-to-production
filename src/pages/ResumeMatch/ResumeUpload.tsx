import React, { useCallback, useState } from 'react';
import { uploadResume } from '../../services/resumeService';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

interface ResumeUploadProps {
  onSuccess: (data: any) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSuccess }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Basic validation
    if (file.type !== 'application/pdf' && !file.type.includes('wordprocessingml') && file.type !== 'text/plain') {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    
    try {
      const data = await uploadResume(file);
      onSuccess(data);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Find your perfect match</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Drop your resume here and let us find your best matches</p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : error 
              ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="resume-upload" 
          className="hidden" 
          accept=".pdf,.doc,.docx,.txt" 
          onChange={handleChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">Analyzing your resume...</p>
            <p className="text-sm text-gray-500 mt-2">Extracting skills and matching with H-1B sponsors</p>
          </div>
        ) : (
          <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
              <UploadCloud className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              PDF, DOCX, TXT (Max 5MB)
            </p>
            <span className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Select File
            </span>
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Smart Extraction</h4>
          <p className="text-sm text-gray-500 mt-1">Our AI pulls out your core skills and experience</p>
        </div>
        <div className="p-4">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Sponsor Matching</h4>
          <p className="text-sm text-gray-500 mt-1">Matches you only with companies open to sponsorship</p>
        </div>
        <div className="p-4">
          <UploadCloud className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Instant Results</h4>
          <p className="text-sm text-gray-500 mt-1">Get quantifiable match scores under 5 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
