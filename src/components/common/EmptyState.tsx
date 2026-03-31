import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center transition-colors duration-200 ${className}`}>
      <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
        {icon || <SearchX className="w-7 h-7" strokeWidth={1.75} />}
      </div>
      <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm font-body text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
