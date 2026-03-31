import React, { useCallback, useState } from 'react';
import { uploadResume } from '../../services/resumeService';
import { UploadCloud, Shield, BarChart3, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeUploadProps {
  onSuccess: (data: unknown) => void;
}

// ── Blurred preview mockup ──

const BlurredPreview = () => (
  <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 select-none pointer-events-none" aria-hidden="true">
    <div className="blur-[6px] opacity-60">
      {/* Mock score gauge */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full border-[6px] border-emerald-400 flex items-center justify-center">
          <span className="font-mono font-bold text-3xl text-gray-900 dark:text-white">82%</span>
        </div>
        <div>
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-700/50 rounded" />
        </div>
      </div>
      {/* Mock skill chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['Python', 'PyTorch', 'SQL', 'Docker', 'AWS', 'React'].map(s => (
          <span key={s} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-medium">{s}</span>
        ))}
      </div>
      {/* Mock bars */}
      <div className="space-y-3">
        <div className="h-3 bg-emerald-200 dark:bg-emerald-800/40 rounded-full w-4/5" />
        <div className="h-3 bg-emerald-200 dark:bg-emerald-800/40 rounded-full w-3/5" />
        <div className="h-3 bg-amber-200 dark:bg-amber-800/40 rounded-full w-2/5" />
      </div>
    </div>
  </div>
);

const ResumeUpload = ({ onSuccess }: ResumeUploadProps) => {
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
    if (e.dataTransfer.files?.[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
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
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight mb-2">
          Your personalized sponsorship analysis
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Upload your resume and get AI-powered insights into which companies will sponsor you, how strong your profile is, and what to improve.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Upload zone */}
        <div>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/15'
                : error
                  ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
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

            <label htmlFor="resume-upload" className={`cursor-pointer flex flex-col items-center ${isUploading ? 'pointer-events-none' : ''}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                isDragActive
                  ? 'bg-primary-100 dark:bg-primary-900/30'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <UploadCloud className={`w-7 h-7 transition-colors ${
                  isDragActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} strokeWidth={1.75} />
              </div>

              <p className="font-display font-bold text-gray-900 dark:text-white mb-1.5">
                Drop your resume here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                or click to browse · PDF, DOCX, TXT (max 5MB)
              </p>

              <span className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-display font-semibold rounded-lg transition-all active:scale-[0.98]">
                {isUploading ? 'Uploading...' : 'Select file'}
              </span>
            </label>
          </div>

          {error && (
            <p className="mt-3 text-center text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <Users className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              <span className="font-mono font-medium text-gray-600 dark:text-gray-300">12,847</span> students improved their match scores this month
            </p>
          </div>
        </div>

        {/* Blurred preview */}
        <div className="relative">
          <BlurredPreview />
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] rounded-xl">
            <div className="text-center px-6">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <p className="font-display font-bold text-sm text-gray-900 dark:text-white mb-1">
                Upload to unlock your analysis
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">
                See your sponsorship readiness score, skill map, and personalized matches
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: <Shield className="w-5 h-5" strokeWidth={1.75} />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', title: 'Sponsorship readiness', desc: 'See how your profile stacks up against actual H-1B sponsored roles' },
          { icon: <BarChart3 className="w-5 h-5" strokeWidth={1.75} />, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400', title: 'Skill-to-role matching', desc: 'AI maps your skills to in-demand competencies at sponsoring companies' },
          { icon: <Sparkles className="w-5 h-5" strokeWidth={1.75} />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', title: 'Growth roadmap', desc: 'Actionable suggestions to increase your chances, with time estimates' },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${f.color}`}>{f.icon}</div>
            <div>
              <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">{f.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResumeUpload;
