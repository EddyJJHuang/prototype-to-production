import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Job } from '../../data/mockJobs';
import { mockCompanies } from '../../data/mockCompanies';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import Badge from '../../components/common/Badge';
import {
  X, MapPin, DollarSign, Bookmark, BookmarkCheck, ExternalLink,
  Calendar, CheckCircle2, Building2, ShieldCheck, TrendingUp,
  TrendingDown, Minus, Sparkles, ChevronRight, Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobDetailDrawerProps {
  job: Job | null;
  allJobs: Job[];
  onClose: () => void;
  onOpenJob: (id: string) => void;
  onSave: (id: string) => void;
}

// ── Score helpers ──

const getScoreColor = (s: number) => s >= 80 ? 'text-match-high' : s >= 60 ? 'text-match-mid' : 'text-match-low';
const getScoreLabel = (s: number) => s >= 80 ? 'Strong Match' : s >= 60 ? 'Good Match' : 'Partial Match';
const getScoreBg = (s: number) =>
  s >= 80 ? 'bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'
  : s >= 60 ? 'bg-amber-50/80 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30'
  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700';

// ── Mini bar chart ──

const SponsorHistoryChart = ({ history }: { history: { year: string; petitions: number }[] }) => {
  const max = Math.max(...history.map(h => h.petitions));
  return (
    <div className="space-y-2">
      {history.map(h => (
        <div key={h.year} className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 w-12 flex-shrink-0">{h.year}</span>
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(h.petitions / max) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full"
            />
          </div>
          <span className="text-[11px] font-mono font-medium text-gray-600 dark:text-gray-300 w-10 text-right flex-shrink-0">
            {h.petitions.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Drawer ──

const JobDetailDrawer = ({ job, allJobs, onClose, onOpenJob, onSave }: JobDetailDrawerProps) => {
  const { isSaved, toggleSavedJob } = useContext(SavedJobsContext) || {};

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (job) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [job, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (job) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [job]);

  const company = useMemo(() => {
    if (!job) return undefined;
    return mockCompanies.find(c => c.name.toLowerCase() === job.companyName.toLowerCase());
  }, [job?.companyName]);

  const relatedJobs = useMemo(() => {
    if (!job) return [];
    return allJobs
      .filter(j => j.companyName === job.companyName && j.id !== job.id)
      .slice(0, 3);
  }, [job?.id, job?.companyName, allJobs]);

  const saved = job && isSaved ? isSaved(job.id) : false;

  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-lg bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain" />
                    ) : (
                      <Building2 className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white tracking-tight line-clamp-1">{job.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{job.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close detail view"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {job.sponsorship && <Badge variant="sponsor">H-1B Sponsor</Badge>}
                {job.greencardSupport && <Badge variant="success">Green Card</Badge>}
                {!job.sponsorship && <Badge variant="sponsor-unknown">Sponsorship Unknown</Badge>}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />{job.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" strokeWidth={1.75} /><span className="font-mono text-gray-700 dark:text-gray-300">{job.salaryRange}</span></span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />{job.postedDate || 'Recently'}</span>
              </div>

              {/* CTAs */}
              <div className="flex gap-2.5 mt-4">
                {job.applyLink ? (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-display font-semibold rounded-lg transition-all active:scale-[0.98]"
                  >
                    Apply now <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                ) : (
                  <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-400 text-sm font-display font-semibold rounded-lg cursor-not-allowed">
                    Apply now <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                )}
                <button
                  onClick={() => toggleSavedJob?.(job.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-display font-semibold transition-all ${
                    saved
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {saved
                    ? <BookmarkCheck className="w-4 h-4 fill-current" strokeWidth={1.75} />
                    : <Bookmark className="w-4 h-4" strokeWidth={1.75} />
                  }
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Match Coach Note */}
              {job.matchScore > 0 && (
                <div className={`rounded-xl border p-4 ${getScoreBg(job.matchScore)}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
                    <span className="text-xs font-display font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your coach's take</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className={`font-mono font-bold text-2xl ${getScoreColor(job.matchScore)}`}>{job.matchScore}%</span>
                    <span className={`font-display font-bold text-sm ${getScoreColor(job.matchScore)}`}>{getScoreLabel(job.matchScore)}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {job.matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Sponsorship Deep-dive */}
              {company && job.sponsorship && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                    <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white">Sponsorship track record</h3>
                  </div>

                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 text-center">
                      <div className="font-mono font-bold text-base text-gray-900 dark:text-white">{company.petitions.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">FY2026 visas</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 text-center">
                      <div className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">{company.approvalRate}%</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">approved</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono font-bold text-base text-gray-900 dark:text-white">${Math.round(company.avgSalary / 1000)}k</span>
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">avg salary</div>
                    </div>
                  </div>

                  {/* History chart */}
                  <div className="mb-4">
                    <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">Petition history</h4>
                    <SponsorHistoryChart history={company.history} />
                  </div>

                  {/* Trend + top roles */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Trend:
                      {company.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.75} />}
                      {company.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={1.75} />}
                      {company.trend === 'flat' && <Minus className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span>Top roles: {company.topRoles.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-2.5">About the role</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-2.5">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mt-2 mr-2.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related jobs */}
              {relatedJobs.length > 0 && (
                <div>
                  <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-3">More from {job.companyName}</h3>
                  <div className="space-y-2">
                    {relatedJobs.map(rj => (
                      <button
                        key={rj.id}
                        onClick={() => onOpenJob(rj.id)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{rj.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{rj.location} · {rj.salaryRange}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" strokeWidth={1.75} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobDetailDrawer;
