import React from 'react';

type MatchScoreProps = {
  score: number | null;
  className?: string;
};

const MatchScore: React.FC<MatchScoreProps> = ({ score, className = '' }) => {
  if (score === null || score === undefined) return null;

  // Visual secondary to sponsor badge: Colored dot/ring
  let colorClass = 'text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'; // <60
  if (score >= 80) colorClass = 'text-green-600 dark:text-green-400 border-green-500/30 dark:border-green-400/30';
  else if (score >= 60) colorClass = 'text-amber-500 dark:text-amber-400 border-amber-500/30 dark:border-amber-400/30';

  return (
    <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 ${colorClass} ${className}`}>
      <div className={`relative flex items-center justify-center w-5 h-5`}>
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            className="text-gray-100 dark:text-gray-700 stroke-current"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-current transition-all duration-1000 ease-out"
            strokeDasharray={`${score}, 100`}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      </div>
      <span className="text-xs font-bold">{score}% <span className="text-gray-500 dark:text-gray-400 font-medium">Match</span></span>
    </div>
  );
};

export default MatchScore;
