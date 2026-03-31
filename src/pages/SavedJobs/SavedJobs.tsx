import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { getJobById } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { mockCompanies, Company } from '../../data/mockCompanies';
import { ROUTES } from '../../utils/constants';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import {
  Bookmark, Trash2, ExternalLink, MapPin, DollarSign,
  Building2, ShieldCheck, Clock, ChevronRight, ArrowRight,
  Sparkles, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Helpers ─────────────────────────────────────────────

const companyMap = new Map<string, Company>();
mockCompanies.forEach(c => companyMap.set(c.name.toLowerCase(), c));

// ─── Skeleton ────────────────────────────────────────────

const CardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
    <div className="h-1 bg-gray-100 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="flex gap-3">
        <div className="h-9 w-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

// ─── Saved Job Card ──────────────────────────────────────

interface SavedCardProps {
  job: Job;
  company: Company | undefined;
  onRemove: (id: string) => void;
  index: number;
}

const SavedCard = ({ job, company, onRemove, index }: SavedCardProps) => {
  const navigate = useNavigate();
  const scoreColor = job.matchScore >= 80 ? 'text-match-high' : job.matchScore >= 60 ? 'text-match-mid' : 'text-match-low';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* Sponsorship stripe */}
      <div className={`h-1 ${job.sponsorship ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-gray-100 dark:bg-gray-700'}`} />

      <div className="p-4">
        {/* Sponsor badge + track record */}
        {job.sponsorship && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="sponsor">H-1B Sponsor</Badge>
            {company && (
              <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" strokeWidth={1.75} />
                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.petitions.toLocaleString()}</span> visas ·
                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.approvalRate}%</span>
              </span>
            )}
          </div>
        )}

        {/* Title + Company */}
        <div className="flex items-start gap-2.5 mb-3 cursor-pointer" onClick={() => navigate(`${ROUTES.JOB_SEARCH}?id=${job.id}`)}>
          <div className="h-9 w-9 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain p-0.5" />
            ) : (
              <Building2 className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
              {job.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{job.companyName}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.75} />{job.location.split(',')[0]}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" strokeWidth={1.75} /><span className="font-mono text-gray-700 dark:text-gray-300">{job.salaryRange}</span></span>
        </div>

        {/* Match score */}
        {job.matchScore > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-mono font-bold text-lg leading-none ${scoreColor}`}>{job.matchScore}%</span>
            <span className={`text-xs font-medium ${scoreColor}`}>
              {job.matchScore >= 80 ? 'Strong' : job.matchScore >= 60 ? 'Good' : 'Partial'} Match
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => navigate(`${ROUTES.JOB_SEARCH}?id=${job.id}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            View <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </button>

          {job.applyLink && (
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 transition-all"
            >
              Apply <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
            </a>
          )}

          <button
            onClick={() => onRemove(job.id)}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove from saved"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────

const SavedJobs = () => {
  const { savedJobs, toggleSavedJob } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {} };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const fetches = savedJobs.map(id => getJobById(id));
        const results = await Promise.all(fetches);
        setJobs(results.filter((job): job is Job => job !== null));
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };

    if (savedJobs.length > 0) {
      fetchSavedJobs();
    } else {
      setJobs([]);
      setLoading(false);
    }
  }, [savedJobs]);

  // Stats
  const highMatchCount = jobs.filter(j => j.matchScore >= 80).length;
  const sponsoringCount = jobs.filter(j => j.sponsorship).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto pb-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">Saved roles</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Your bookmarked opportunities — review and take action.
        </p>
      </div>

      {/* Stats bar */}
      {jobs.length > 0 && !loading && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3.5">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-mono font-bold text-gray-900 dark:text-white">{jobs.length}</span> saved roles
          </span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-mono font-bold text-match-high">{highMatchCount}</span> high-match
          </span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{sponsoringCount}</span> sponsoring
          </span>

          {highMatchCount > 0 && (
            <button
              onClick={() => navigate(ROUTES.JOB_SEARCH)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-display font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/15 hover:bg-primary-100 dark:hover:bg-primary-900/25 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
              Review high-match roles
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-7 h-7" strokeWidth={1.75} />}
          title="No saved roles yet"
          description="Bookmark roles you're interested in from Explore and they'll appear here for easy tracking."
          action={
            <button
              onClick={() => navigate(ROUTES.JOB_SEARCH)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-display font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start exploring
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          }
          className="mt-8"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {jobs.map((job, i) => (
              <SavedCard
                key={job.id}
                job={job}
                company={companyMap.get(job.companyName.toLowerCase())}
                onRemove={toggleSavedJob}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default SavedJobs;
