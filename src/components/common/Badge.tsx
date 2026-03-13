import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'sponsor' | 'success' | 'warning' | 'error';
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200';
  
  let variantClasses = '';
  switch (variant) {
    case 'sponsor':
      // Micro-adjustment: Most prominent hierarchy
      variantClasses = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[13px] border border-emerald-200 dark:border-emerald-800';
      break;
    case 'success':
      variantClasses = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      break;
    case 'warning':
      variantClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      break;
    case 'error':
      variantClasses = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      break;
    case 'default':
    default:
      variantClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      break;
  }

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
