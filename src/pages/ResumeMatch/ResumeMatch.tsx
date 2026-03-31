import React, { useContext, useState, useEffect } from 'react';
import { ResumeContext } from '../../context/ResumeContext';
import ResumeUpload from './ResumeUpload';
import ResumeResults from './ResumeResults';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

type ProcessingStep = {
  label: string;
  status: 'pending' | 'active' | 'done';
};

const STEPS: string[] = [
  'Reading your experience...',
  'Matching against 50,000+ sponsorship records...',
  'Analyzing skill-to-role alignment...',
  'Generating your personalized insights...',
];

const ProcessingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setCurrentStep(i + 1), (i + 1) * 1400));
    });
    timers.push(setTimeout(onComplete, STEPS.length * 1400 + 600));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="max-w-md w-full">
        {/* Animated orb */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-primary-300 dark:border-primary-600 animate-ping opacity-30" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((label, i) => {
            const isDone = currentStep > i;
            const isActive = currentStep === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : isActive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDone
                    ? 'text-gray-500 dark:text-gray-400'
                    : isActive
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const ResumeMatch = () => {
  const { resumeUploaded, setResumeUploaded, setResumeData } = useContext(ResumeContext) || {};
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadSuccess = (data: unknown) => {
    setIsProcessing(true);
    // Store data but don't show results yet — processing animation first
    setResumeData?.(data);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setResumeUploaded?.(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-full pb-8"
    >
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <ProcessingScreen key="processing" onComplete={handleProcessingComplete} />
        ) : resumeUploaded ? (
          <ResumeResults key="results" />
        ) : (
          <ResumeUpload key="upload" onSuccess={handleUploadSuccess} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResumeMatch;
