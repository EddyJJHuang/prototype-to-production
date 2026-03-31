import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { ResumeContext } from '../../context/ResumeContext';
import { getJobs } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { mockCompanies, Company } from '../../data/mockCompanies';
import { ROUTES } from '../../utils/constants';
import Badge from '../../components/common/Badge';
import MatchScore from '../../components/common/MatchScore';
import {
  ArrowRight, Bookmark, BookmarkCheck, ExternalLink, X,
  TrendingUp, TrendingDown, ShieldCheck, Building2, MapPin,
  DollarSign, Sparkles, ChevronRight, Briefcase, Send,
  MessageSquare, Trophy, Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Helpers ─────────────────────────────────────────────

const parseRecencyHours = (postedDate: string | null | undefined): number => {
  if (!postedDate) return 168;
  const match = postedDate.match(/(\d+)\s*(hour|day|d|h)/i);
  if (!match) return 168; // default 7 days
  const n = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('h')) return n;
  return n * 24;
};

const computeFeedScore = (job: Job, companyMap: Map<string, Company>): number => {
  const company = companyMap.get(job.companyName.toLowerCase());
  const sponsorStrength = company ? company.approvalRate / 100 : 0.5;
  const recencyHours = parseRecencyHours(job.postedDate);
  const recencyMultiplier = recencyHours <= 6 ? 1.3 : recencyHours <= 24 ? 1.15 : recencyHours <= 72 ? 1.0 : 0.85;
  return job.matchScore * (sponsorStrength * 0.3 + 0.7) * recencyMultiplier;
};

const getTopMovers = (companies: Company[], count: number): Array<Company & { delta: number }> => {
  return companies
    .filter(c => c.history.length >= 2)
    .map(c => {
      const latest = c.history[c.history.length - 1].petitions;
      const prev = c.history[c.history.length - 2].petitions;
      return { ...c, delta: latest - prev };
    })
    .sort((a, b) => b.delta - a.delta)
    .slice(0, count);
};

// ─── Skeleton ────────────────────────────────────────────

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} />
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <SkeletonBlock className="h-36 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-40 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <SkeletonBlock className="h-64 rounded-xl" />
      </div>
    </div>
    <SkeletonBlock className="h-32 rounded-xl" />
  </div>
);

// ─── Action Prompt ───────────────────────────────────────

interface ActionPromptProps {
  highMatchCount: number;
  recentCount: number;
  resumeUploaded: boolean;
}

const ActionPrompt = ({ highMatchCount, recentCount, resumeUploaded }: ActionPromptProps) => {
  const navigate = useNavigate();

  let headline: string;
  let subtext: string;
  let ctaLabel: string;
  let ctaRoute: string;

  if (!resumeUploaded) {
    headline = `${highMatchCount} companies are sponsoring roles in your field right now`;
    subtext = 'Upload your resume to unlock personalized match scores and see which roles fit you best.';
    ctaLabel = 'Upload resume';
    ctaRoute = ROUTES.RESUME_MATCH;
  } else if (recentCount > 0) {
    headline = `${recentCount} new high-fit roles added since yesterday`;
    subtext = `${highMatchCount} sponsoring companies match your profile. Your resume is working — review your strongest matches now.`;
    ctaLabel = 'Review top matches';
    ctaRoute = ROUTES.JOB_SEARCH;
  } else {
    headline = `${highMatchCount} sponsoring roles match your profile`;
    subtext = 'Companies are actively filing H-1B petitions. The sooner you apply, the better your odds.';
    ctaLabel = 'Explore roles';
    ctaRoute = ROUTES.JOB_SEARCH;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 p-6 md:p-8"
    >
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
            <span className="text-xs font-display font-semibold text-amber-400 uppercase tracking-wider">Today's briefing</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-snug mb-2">
            {headline}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
            {subtext}
          </p>
        </div>
        <button
          onClick={() => navigate(ctaRoute)}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-display font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-primary-600/20 active:scale-[0.98] flex-shrink-0 self-start md:self-center"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Feed Card (Decision Unit) ───────────────────────────

interface FeedCardProps {
  job: Job;
  company: Company | undefined;
  isSaved: boolean;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
  index: number;
}

const FeedCard = ({ job, company, isSaved, onSave, onDismiss, index }: FeedCardProps) => {
  const navigate = useNavigate();

  const scoreColor = job.matchScore >= 80
    ? 'text-match-high'
    : job.matchScore >= 60
      ? 'text-match-mid'
      : 'text-match-low';

  const scoreLabel = job.matchScore >= 80 ? 'Strong' : job.matchScore >= 60 ? 'Good' : 'Partial';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      layout
      className={`border-l-[3px] ${job.sponsorship ? 'border-l-emerald-400 dark:border-l-emerald-600' : 'border-l-transparent'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 group`}
    >
      {/* Top row: Logo + Title + Score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <button
          type="button"
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left"
          onClick={() => navigate(`${ROUTES.JOB_SEARCH}?id=${job.id}`)}
        >
          <div className="h-10 w-10 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain p-1" />
            ) : (
              <Building2 className="h-5 w-5 text-gray-400" strokeWidth={1.75} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100 text-[15px] line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{job.companyName}</p>
          </div>
        </button>

        {/* Match score */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className={`font-mono font-bold text-lg leading-none ${scoreColor}`}>{job.matchScore}%</span>
          <span className={`text-[11px] font-medium ${scoreColor} opacity-80`}>{scoreLabel}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" strokeWidth={1.75} />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" strokeWidth={1.75} />
          <span className="font-mono text-gray-700 dark:text-gray-300">{job.salaryRange}</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" strokeWidth={1.75} />
          {job.postedDate || 'Recently'}
        </span>
      </div>

      {/* Sponsor track record */}
      {company && job.sponsorship && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg px-3 py-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={1.75} />
          <span>
            Sponsored <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.petitions.toLocaleString()}</span> visas
            <span className="text-gray-300 dark:text-gray-600 mx-1">·</span>
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.approvalRate}%</span> approved
            <span className="text-gray-300 dark:text-gray-600 mx-1">·</span>
            avg <span className="font-mono font-medium text-gray-700 dark:text-gray-300">${Math.round(company.avgSalary / 1000)}k</span>
          </span>
        </div>
      )}

      {job.sponsorship && !company && (
        <div className="mb-3">
          <Badge variant="sponsor">H-1B Sponsor</Badge>
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button
          onClick={() => onSave(job.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            isSaved
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
          }`}
        >
          {isSaved
            ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" strokeWidth={1.75} />
            : <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
          }
          {isSaved ? 'Saved' : 'Save'}
        </button>

        {job.applyLink ? (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
            Apply
          </a>
        ) : (
          <button
            onClick={() => navigate(`${ROUTES.JOB_SEARCH}?id=${job.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            View details
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        )}

        <button
          onClick={() => onDismiss(job.id)}
          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Dismiss this job"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Sponsorship Pulse ───────────────────────────────────

const SponsorshipPulse = () => {
  const navigate = useNavigate();
  const topMovers = useMemo(() => getTopMovers(mockCompanies, 5), []);
  const upCount = mockCompanies.filter(c => c.trend === 'up').length;
  const avgApproval = (mockCompanies.reduce((sum, c) => sum + c.approvalRate, 0) / mockCompanies.length).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-fit"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">Sponsorship pulse</h3>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 dark:bg-emerald-900/15 rounded-lg p-3">
          <div className="font-mono font-bold text-xl text-emerald-700 dark:text-emerald-300 leading-none">{upCount}</div>
          <div className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-1">companies ↑ this year</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
          <div className="font-mono font-bold text-xl text-gray-800 dark:text-gray-200 leading-none">{avgApproval}%</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">avg approval rate</div>
        </div>
      </div>

      {/* Top movers */}
      <div className="mb-4">
        <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Top movers</h4>
        <div className="space-y-2.5">
          {topMovers.map((company) => (
            <div key={company.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 w-7 rounded-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-0.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{company.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{company.petitions.toLocaleString()} petitions</p>
                </div>
              </div>
              <span className={`text-xs font-mono font-medium flex items-center gap-0.5 flex-shrink-0 ${
                company.delta > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}>
                {company.delta > 0 ? (
                  <TrendingUp className="w-3 h-3" strokeWidth={1.75} />
                ) : (
                  <TrendingDown className="w-3 h-3" strokeWidth={1.75} />
                )}
                {company.delta > 0 ? '+' : ''}{company.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate(ROUTES.SPONSORSHIP_STATS)}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-display font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/15 hover:bg-primary-100 dark:hover:bg-primary-900/25 rounded-lg transition-colors"
      >
        View all sponsor data
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
    </motion.div>
  );
};

// ─── Pipeline ────────────────────────────────────────────

interface PipelineStageProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  emptyText: string;
  isFirst?: boolean;
}

const PipelineStage = ({ icon, label, count, color, emptyText, isFirst = false }: PipelineStageProps) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-display font-bold text-gray-900 dark:text-white">{label}</span>
        <span className="font-mono text-xs font-medium text-gray-400 dark:text-gray-500">{count}</span>
      </div>
    </div>
    {count === 0 && (
      <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed pl-9">{emptyText}</p>
    )}
    {count > 0 && (
      <div className="pl-9">
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 opacity-80" />
          ))}
          {count > 5 && <span className="text-[10px] text-gray-400 ml-1">+{count - 5}</span>}
        </div>
      </div>
    )}
  </div>
);

const Pipeline = ({ savedCount }: { savedCount: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">Your pipeline</h3>
        {savedCount > 0 && (
          <button
            onClick={() => navigate(ROUTES.SAVED_JOBS)}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            View saved
            <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Stages */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Connector lines (desktop only) */}
        <PipelineStage
          icon={<Bookmark className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />}
          label="Saved"
          count={savedCount}
          color="bg-primary-50 dark:bg-primary-900/20"
          emptyText="Save your first role to start tracking."
          isFirst
        />
        <div className="hidden sm:flex items-center text-gray-200 dark:text-gray-700 -mx-2">
          <ChevronRight className="w-4 h-4" />
        </div>
        <PipelineStage
          icon={<Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />}
          label="Applied"
          count={0}
          color="bg-blue-50 dark:bg-blue-900/20"
          emptyText="Apply to get started — we'll track it here."
        />
        <div className="hidden sm:flex items-center text-gray-200 dark:text-gray-700 -mx-2">
          <ChevronRight className="w-4 h-4" />
        </div>
        <PipelineStage
          icon={<MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />}
          label="Interview"
          count={0}
          color="bg-amber-50 dark:bg-amber-900/20"
          emptyText="Keep going — interviews are coming."
        />
        <div className="hidden sm:flex items-center text-gray-200 dark:text-gray-700 -mx-2">
          <ChevronRight className="w-4 h-4" />
        </div>
        <PipelineStage
          icon={<Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />}
          label="Offer"
          count={0}
          color="bg-emerald-50 dark:bg-emerald-900/20"
          emptyText="Your first offer awaits."
        />
      </div>
    </motion.div>
  );
};

// ─── Main Dashboard ──────────────────────────────────────

const Dashboard = () => {
  const { user } = useContext(UserContext) || {};
  const { savedJobs, toggleSavedJob, isSaved } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {}, isSaved: () => false };
  const { resumeUploaded } = useContext(ResumeContext) || { resumeUploaded: false };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    mockCompanies.forEach(c => map.set(c.name.toLowerCase(), c));
    return map;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const res = await getJobs({ sponsorshipRequired: true });
        if (!cancelled) {
          setAllJobs(res.data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Smart feed: ranked by composite score, exclude dismissed
  const feedJobs = useMemo(() => {
    return allJobs
      .filter(j => !dismissedIds.has(j.id))
      .map(j => ({ job: j, score: computeFeedScore(j, companyMap) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.job);
  }, [allJobs, dismissedIds, companyMap]);

  const highMatchCount = allJobs.filter(j => j.matchScore >= 80 && j.sponsorship).length;
  const recentCount = allJobs.filter(j => parseRecencyHours(j.postedDate) <= 24).length;

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Action Prompt */}
      <ActionPrompt
        highMatchCount={highMatchCount}
        recentCount={recentCount}
        resumeUploaded={resumeUploaded}
      />

      {/* Feed + Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">Your top matches</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ranked by match strength, sponsorship track record, and recency</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.JOB_SEARCH)}
              className="text-xs font-display font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {feedJobs.map((job, index) => (
                <FeedCard
                  key={job.id}
                  job={job}
                  company={companyMap.get(job.companyName.toLowerCase())}
                  isSaved={isSaved ? isSaved(job.id) : false}
                  onSave={toggleSavedJob}
                  onDismiss={handleDismiss}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {feedJobs.length === 0 && (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-50" strokeWidth={1.75} />
                <p className="text-sm">All caught up! Check back later for new matches.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sponsorship Pulse */}
        <div className="lg:col-span-1">
          <SponsorshipPulse />
        </div>
      </div>

      {/* Pipeline */}
      <Pipeline savedCount={savedJobs.length} />
    </div>
  );
};

export default Dashboard;
