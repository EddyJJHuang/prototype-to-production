import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { mockCompanies, Company } from '../../data/mockCompanies';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { ResumeContext } from '../../context/ResumeContext';
import { ROUTES } from '../../utils/constants';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import JobDetailDrawer from './JobDetailDrawer';
import {
  Check, SlidersHorizontal, X, MapPin, DollarSign, Building2,
  Bookmark, BookmarkCheck, ExternalLink, Clock, ShieldCheck,
  ChevronRight, ChevronDown, SearchX, Upload, Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Helpers ─────────────────────────────────────────────

const parseRecencyHours = (posted: string | null | undefined): number => {
  if (!posted) return 168;
  const m = posted.match(/(\d+)\s*(hour|day|d|h)/i);
  if (!m) return 168;
  const n = parseInt(m[1], 10);
  return m[2].toLowerCase().startsWith('h') ? n : n * 24;
};

const computeScore = (job: Job, cm: Map<string, Company>): number => {
  const c = cm.get(job.companyName.toLowerCase());
  const sponsorStr = c ? c.approvalRate / 100 : 0.5;
  const hours = parseRecencyHours(job.postedDate);
  const recency = hours <= 6 ? 1.3 : hours <= 24 ? 1.15 : hours <= 72 ? 1.0 : 0.85;
  return job.matchScore * (sponsorStr * 0.3 + 0.7) * recency;
};

const EXPERIENCE_OPTIONS = ['Intern', 'Entry Level', 'Mid Level', 'Senior', 'Staff', 'Principal'] as const;

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
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

// ─── Grid Card (Decision Unit) ───────────────────────────

interface GridCardProps {
  job: Job;
  company: Company | undefined;
  isSaved: boolean;
  isDismissed: boolean;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpen: (id: string) => void;
  index: number;
}

const GridCard = ({ job, company, isSaved, isDismissed, onSave, onDismiss, onOpen, index }: GridCardProps) => {
  const scoreColor = job.matchScore >= 80 ? 'text-match-high' : job.matchScore >= 60 ? 'text-match-mid' : 'text-match-low';
  const scoreLabel = job.matchScore >= 80 ? 'Strong' : job.matchScore >= 60 ? 'Good' : 'Partial';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDismissed ? 0.4 : 1, y: 0, scale: isDismissed ? 0.98 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 group ${isDismissed ? 'pointer-events-none' : ''}`}
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
                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.petitions.toLocaleString()}</span> visas
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.approvalRate}%</span>
              </span>
            )}
          </div>
        )}

        {/* Title + Company */}
        <button
          type="button"
          className="flex items-start gap-2.5 mb-3 cursor-pointer text-left w-full"
          onClick={() => onOpen(job.id)}
        >
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
        </button>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.75} />{job.location.split(',')[0]}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" strokeWidth={1.75} /><span className="font-mono text-gray-700 dark:text-gray-300">{job.salaryRange}</span></span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" strokeWidth={1.75} />{job.postedDate || 'Recently'}</span>
        </div>

        {/* Match score */}
        {job.matchScore > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className={`font-mono font-bold text-lg leading-none ${scoreColor}`}>{job.matchScore}%</div>
            <div className={`text-xs font-medium ${scoreColor}`}>{scoreLabel} Match</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSaved
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {isSaved
              ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" strokeWidth={1.75} />
              : <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
            }
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={() => onOpen(job.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            Details <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(job.id); }}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Filter Panel ────────────────────────────────────────

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  experienceFilter: Set<string>;
  onToggleExperience: (level: string) => void;
  onClearFilters: () => void;
}

const FilterPanel = ({ open, onClose, experienceFilter, onToggleExperience, onClearFilters }: FilterPanelProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 rounded-t-2xl p-5 shadow-2xl border-t border-gray-200 dark:border-gray-700 md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:rounded-xl md:mt-2 md:w-72 md:border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white">Filters</h3>
            <div className="flex items-center gap-2">
              {experienceFilter.size > 0 && (
                <button onClick={onClearFilters} className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  Clear all
                </button>
              )}
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 md:hidden">
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">Experience level</h4>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map(level => {
                const active = experienceFilter.has(level);
                return (
                  <button
                    key={level}
                    onClick={() => onToggleExperience(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Main Page ───────────────────────────────────────────

const JobSearch = () => {
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => urlParams.get('q') || '');
  const [sponsorshipOnly, setSponsorshipOnly] = useState(() => urlParams.get('sponsorship') !== 'false');
  const [experienceFilter, setExperienceFilter] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => urlParams.get('id'));

  const { savedJobs, toggleSavedJob, isSaved } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {}, isSaved: () => false };
  const { resumeUploaded } = useContext(ResumeContext) || { resumeUploaded: false };
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    mockCompanies.forEach(c => map.set(c.name.toLowerCase(), c));
    return map;
  }, []);

  // Fetch jobs — cancelled flag prevents StrictMode double-render flash
  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      try {
        const res = await getJobs({ q: searchQuery, sponsorshipRequired: sponsorshipOnly });
        if (!cancelled) {
          setAllJobs(res.data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    const delay = allJobs.length > 0 ? 300 : 0;
    const timer = setTimeout(fetchJobs, delay);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery, sponsorshipOnly]);

  // Smart sort + filter
  const sortedJobs = useMemo(() => {
    let filtered = [...allJobs];
    if (experienceFilter.size > 0) {
      filtered = filtered.filter(j => experienceFilter.has(j.experienceLevel));
    }
    return filtered
      .map(j => ({ job: j, score: computeScore(j, companyMap) }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.job);
  }, [allJobs, experienceFilter, companyMap]);

  const selectedJob = useMemo(
    () => allJobs.find(j => j.id === selectedJobId) || null,
    [allJobs, selectedJobId]
  );

  const handleOpenJob = useCallback((id: string) => {
    scrollPosRef.current = gridRef.current?.scrollTop || 0;
    setSelectedJobId(id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedJobId(null);
    // Restore scroll after drawer closes
    requestAnimationFrame(() => {
      gridRef.current?.scrollTo(0, scrollPosRef.current);
    });
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  }, []);

  const handleToggleExperience = useCallback((level: string) => {
    setExperienceFilter(prev => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    setSearchQuery('');
    setSponsorshipOnly(false);
    setExperienceFilter(new Set());
    setDismissedIds(new Set());
  }, []);

  const activeFilterCount = experienceFilter.size;
  const visibleJobs = sortedJobs.filter(j => !dismissedIds.has(j.id));
  const dismissedJobs = sortedJobs.filter(j => dismissedIds.has(j.id));

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Resume upload banner */}
      {!resumeUploaded && (
        <div className="mb-4 flex items-center gap-3 bg-primary-50 dark:bg-primary-900/15 border border-primary-100 dark:border-primary-800/30 rounded-xl px-4 py-3">
          <Upload className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" strokeWidth={1.75} />
          <p className="text-sm text-primary-700 dark:text-primary-300 flex-1">
            <span className="font-medium">Upload your resume</span> to see personalized match scores on every role.
          </p>
          <button
            onClick={() => navigate(ROUTES.RESUME_MATCH)}
            className="px-3 py-1.5 text-xs font-display font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            Upload
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-1">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">Explore roles</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            {loading ? 'Searching...' : (
              <>
                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{visibleJobs.length}</span>
                {' '}{sponsorshipOnly ? 'sponsoring' : ''} roles
                {dismissedIds.size > 0 && (
                  <span className="text-gray-400 dark:text-gray-500">
                    {' · '}{dismissedIds.size} dismissed
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Sponsorship toggle + Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mt-3 mb-5">
        {/* Sponsorship toggle — OUTSIDE filters, always visible */}
        <button
          onClick={() => setSponsorshipOnly(!sponsorshipOnly)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium font-display transition-all duration-200 flex-shrink-0 ${
            sponsorshipOnly
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
          }`}
        >
          <span className={`flex items-center justify-center w-4 h-4 rounded border transition-all ${
            sponsorshipOnly
              ? 'bg-emerald-600 border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {sponsorshipOnly && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </span>
          H-1B Sponsors
        </button>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search role, company, location..."
          className="flex-1 min-w-[180px] max-w-sm"
        />

        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeFilterCount > 0
                ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>

          {/* Desktop filter popover */}
          <div className="hidden md:block">
            <FilterPanel
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              experienceFilter={experienceFilter}
              onToggleExperience={handleToggleExperience}
              onClearFilters={() => setExperienceFilter(new Set())}
            />
          </div>
        </div>

        {/* Undo dismissals */}
        {dismissedIds.size > 0 && (
          <button
            onClick={() => setDismissedIds(new Set())}
            className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Undo all dismissals
          </button>
        )}
      </div>

      {/* Mobile filter panel */}
      <div className="md:hidden">
        <FilterPanel
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          experienceFilter={experienceFilter}
          onToggleExperience={handleToggleExperience}
          onClearFilters={() => setExperienceFilter(new Set())}
        />
      </div>

      {/* Card Grid */}
      <div ref={gridRef} className="flex-1 overflow-y-auto -mx-1 px-1 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : visibleJobs.length === 0 && dismissedJobs.length === 0 ? (
          <EmptyState
            icon={<SearchX className="w-7 h-7" strokeWidth={1.75} />}
            title="No roles match your search"
            description="Try broadening your search or adjusting your filters — new roles are added daily."
            action={
              <button
                onClick={handleResetAll}
                className="px-4 py-2 text-sm font-medium font-display text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
              >
                Reset all filters
              </button>
            }
            className="mt-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {visibleJobs.map((job, index) => (
                <GridCard
                  key={job.id}
                  job={job}
                  company={companyMap.get(job.companyName.toLowerCase())}
                  isSaved={isSaved ? isSaved(job.id) : false}
                  isDismissed={false}
                  onSave={toggleSavedJob}
                  onDismiss={handleDismiss}
                  onOpen={handleOpenJob}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {/* Dismissed section */}
            {dismissedJobs.length > 0 && visibleJobs.length > 0 && (
              <div className="col-span-full mt-6 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {dismissedJobs.length} dismissed
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            )}
            {dismissedJobs.map((job, index) => (
              <GridCard
                key={job.id}
                job={job}
                company={companyMap.get(job.companyName.toLowerCase())}
                isSaved={isSaved ? isSaved(job.id) : false}
                isDismissed
                onSave={toggleSavedJob}
                onDismiss={() => {}}
                onOpen={handleOpenJob}
                index={visibleJobs.length + index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        allJobs={allJobs}
        onClose={handleCloseDrawer}
        onOpenJob={(id) => setSelectedJobId(id)}
        onSave={toggleSavedJob}
      />
    </div>
  );
};

export default JobSearch;
