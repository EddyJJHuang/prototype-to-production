import React, { useContext, useState } from 'react';
import { Job } from '../../data/mockJobs';
import { mockCompanies } from '../../data/mockCompanies';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import Badge from '../../components/common/Badge';
import MatchScore from '../../components/common/MatchScore';
import { MapPin, DollarSign, Bookmark, BookmarkCheck, ExternalLink, Calendar, CheckCircle2, ChevronDown, ChevronUp, ArrowLeft, Building2, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobDetailProps {
  job: Job;
  onClose?: () => void;
}

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Partial Match';
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-match-high';
  if (score >= 60) return 'text-match-mid';
  return 'text-match-low';
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/40';
  if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/40';
  return 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700';
};

const JobDetail = ({ job, onClose }: JobDetailProps) => {
  const { isSaved, toggleSavedJob } = useContext(SavedJobsContext) || {};
  const saved = isSaved ? isSaved(job.id) : false;
  const [matchExpanded, setMatchExpanded] = useState(true);

  // Look up company sponsorship stats
  const company = mockCompanies.find(
    c => c.name.toLowerCase() === job.companyName.toLowerCase()
  );

  return (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col h-full overflow-hidden"
    >
      {/* Sticky Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        {/* Mobile back button */}
        <button
          onClick={onClose}
          className="md:hidden flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Back to list
        </button>

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain" />
              ) : (
                <Building2 className="h-7 w-7 text-gray-400" strokeWidth={1.75} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">{job.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{job.companyName}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => toggleSavedJob?.(job.id)}
              className="p-2.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-gray-50 hover:bg-primary-50 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              aria-label={saved ? 'Remove from saved' : 'Save job'}
            >
              {saved ?
                <BookmarkCheck className="h-5 w-5 text-primary-600 dark:text-primary-400 fill-current" strokeWidth={1.75} /> :
                <Bookmark className="h-5 w-5" strokeWidth={1.75} />
              }
            </button>
            {job.applyLink ? (
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm font-display font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                Apply <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ) : (
              <button
                disabled
                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-display font-semibold rounded-lg cursor-not-allowed flex items-center gap-2"
              >
                Apply <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {job.sponsorship && (
            <Badge variant="sponsor">H-1B Sponsor</Badge>
          )}
          {job.greencardSupport && (
            <Badge variant="success">Green Card Support</Badge>
          )}
          {!job.sponsorship && (
            <Badge variant="sponsor-unknown">Sponsorship Unknown</Badge>
          )}
        </div>

        {/* Company sponsorship stats (inline) */}
        {company && job.sponsorship && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
              Sponsored
              <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                {company.petitions.toLocaleString()}
              </span>
              visas (FY2026)
            </span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
              <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                {company.approvalRate}%
              </span>
              approval rate
            </span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" strokeWidth={1.75} />
            <span className="font-mono text-gray-700 dark:text-gray-300">{job.salaryRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" strokeWidth={1.75} />
            {job.postedDate || 'Recently'}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Match Score Panel */}
        {job.matchScore > 0 && (
          <div className={`border rounded-xl overflow-hidden ${getScoreBg(job.matchScore)}`}>
            {/* Match header — always visible */}
            <button
              onClick={() => setMatchExpanded(prev => !prev)}
              aria-expanded={matchExpanded}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <MatchScore score={job.matchScore} />
                <span className={`font-display font-bold text-sm ${getScoreColor(job.matchScore)}`}>
                  {getScoreLabel(job.matchScore)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">{matchExpanded ? 'Hide' : 'Show'} reasoning</span>
                {matchExpanded
                  ? <ChevronUp className="w-4 h-4" strokeWidth={1.75} />
                  : <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
                }
              </div>
            </button>

            {/* Expandable reasons */}
            <AnimatePresence initial={false}>
              {matchExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <div className="px-4 pb-4 border-t border-black/5 dark:border-white/5 pt-3">
                    <h4 className="text-xs font-display font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">
                      Why you match
                    </h4>
                    <ul className="space-y-2">
                      {job.matchReasons.map((reason, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.2 }}
                          className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                          <span>{reason}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-3">About the role</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
          <ul className="space-y-2.5">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mt-2 mr-3 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetail;
