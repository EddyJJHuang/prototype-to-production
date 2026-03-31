import React from 'react';
import { Check, HelpCircle, AlertCircle } from 'lucide-react';

type BadgeVariant = 'default' | 'sponsor' | 'sponsor-maybe' | 'sponsor-unknown' | 'success' | 'warning' | 'error';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  sponsor:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-sm dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'sponsor-maybe':
    'bg-amber-50 text-amber-700 border border-amber-200 font-medium dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'sponsor-unknown':
    'bg-gray-50 text-gray-500 border border-gray-200 font-medium dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  success:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  error:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  default:
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const variantIcons: Partial<Record<BadgeVariant, React.ReactNode>> = {
  sponsor: <Check className="w-3.5 h-3.5 mr-1" strokeWidth={3} aria-hidden="true" />,
  'sponsor-maybe': <AlertCircle className="w-3.5 h-3.5 mr-1" strokeWidth={2} aria-hidden="true" />,
  'sponsor-unknown': <HelpCircle className="w-3.5 h-3.5 mr-1" strokeWidth={2} aria-hidden="true" />,
};

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const isSponsorVariant = variant === 'sponsor' || variant === 'sponsor-maybe' || variant === 'sponsor-unknown';
  const sizeClass = variant === 'sponsor'
    ? 'px-2.5 py-1 text-[13px]'
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full transition-colors duration-200 ${sizeClass} ${variantStyles[variant]} ${className}`}>
      {isSponsorVariant && variantIcons[variant]}
      {children}
    </span>
  );
};

export default Badge;
