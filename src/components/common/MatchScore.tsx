import React from 'react';

type MatchScoreProps = {
  score: number | null;
  className?: string;
  showLabel?: boolean;
};

const getScoreConfig = (score: number) => {
  if (score >= 80) {
    return {
      colorClass: 'text-match-high border-match-high/30',
      ringClass: 'stroke-match-high',
      label: 'Strong Match',
    };
  }
  if (score >= 60) {
    return {
      colorClass: 'text-match-mid border-match-mid/30',
      ringClass: 'stroke-match-mid',
      label: 'Good Match',
    };
  }
  return {
    colorClass: 'text-match-low border-match-low/30',
    ringClass: 'stroke-match-low',
    label: 'Partial Match',
  };
};

const MatchScore = ({ score, className = '', showLabel = false }: MatchScoreProps) => {
  if (score === null || score === undefined) return null;

  const config = getScoreConfig(score);

  return (
    <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 ${config.colorClass} ${className}`}>
      <div className="relative flex items-center justify-center w-5 h-5">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            className="text-gray-100 dark:text-gray-700 stroke-current"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`${config.ringClass} transition-all duration-1000 ease-out`}
            strokeDasharray={`${score}, 100`}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      </div>
      <span className="text-xs font-bold font-mono">
        {score}%
        {showLabel && (
          <span className="text-gray-500 dark:text-gray-400 font-medium font-body ml-1">{config.label}</span>
        )}
      </span>
    </div>
  );
};

export default MatchScore;
