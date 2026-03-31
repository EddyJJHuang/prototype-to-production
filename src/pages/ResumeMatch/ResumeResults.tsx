import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobService';
import { Job } from '../../data/mockJobs';
import { mockCompanies } from '../../data/mockCompanies';
import { SavedJobsContext } from '../../context/SavedJobsContext';
import { ResumeContext } from '../../context/ResumeContext';
import { ROUTES } from '../../utils/constants';
import Badge from '../../components/common/Badge';
import {
  Trash2, Sparkles, TrendingUp, Clock, Zap, ArrowRight,
  ExternalLink, Bookmark, BookmarkCheck, ShieldCheck,
  MapPin, DollarSign, ChevronLeft, ChevronRight, RefreshCw,
  Building2,
} from 'lucide-react';
import { motion } from 'motion/react';

// ─── Mock Analysis Data ──────────────────────────────────

interface SkillItem {
  name: string;
  strength: number;
  inDemand: boolean;
}

interface Opportunity {
  area: string;
  impact: string;
  timeEstimate: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnalysisData {
  overallScore: number;
  percentile: number;
  detectedRole: string;
  seniority: string;
  skills: Record<string, SkillItem[]>;
  opportunities: Opportunity[];
}

const MOCK_ANALYSIS: AnalysisData = {
  overallScore: 82,
  percentile: 23,
  detectedRole: 'Machine Learning Engineer',
  seniority: 'Mid Level',
  skills: {
    Languages: [
      { name: 'Python', strength: 95, inDemand: true },
      { name: 'SQL', strength: 80, inDemand: true },
      { name: 'Java', strength: 65, inDemand: false },
      { name: 'TypeScript', strength: 70, inDemand: true },
      { name: 'C++', strength: 55, inDemand: false },
    ],
    Frameworks: [
      { name: 'PyTorch', strength: 90, inDemand: true },
      { name: 'TensorFlow', strength: 75, inDemand: true },
      { name: 'FastAPI', strength: 85, inDemand: true },
      { name: 'React', strength: 60, inDemand: false },
    ],
    Tools: [
      { name: 'Docker', strength: 80, inDemand: true },
      { name: 'AWS', strength: 70, inDemand: true },
      { name: 'Git', strength: 90, inDemand: false },
      { name: 'Kubernetes', strength: 40, inDemand: true },
      { name: 'MLflow', strength: 65, inDemand: true },
    ],
    Domain: [
      { name: 'NLP', strength: 85, inDemand: true },
      { name: 'Computer Vision', strength: 60, inDemand: true },
      { name: 'Data Pipelines', strength: 75, inDemand: true },
      { name: 'LLM/RAG', strength: 50, inDemand: true },
    ],
  },
  opportunities: [
    {
      area: 'Kubernetes & Container Orchestration',
      impact: 'Adding Kubernetes experience would match 34% more sponsored ML Engineering roles.',
      timeEstimate: '2–3 weeks for fundamentals',
      priority: 'high',
    },
    {
      area: 'LLM Application Development',
      impact: 'Fastest-growing sponsored role category with 156% YoY increase in petitions.',
      timeEstimate: '2–4 weeks with your ML background',
      priority: 'high',
    },
    {
      area: 'System Design for ML',
      impact: 'Senior ML roles at top sponsors (Google, Meta) require distributed ML system knowledge.',
      timeEstimate: '1–2 months of focused practice',
      priority: 'medium',
    },
  ],
};

// ─── Arc Gauge ───────────────────────────────────────────

const ArcGauge = ({ score }: { score: number }) => {
  const radius = 54;
  const stroke = 8;
  const startAngle = -120;
  const endAngle = 120;
  const totalAngle = endAngle - startAngle;
  const scoreAngle = startAngle + (score / 100) * totalAngle;

  const polarToCart = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const s = polarToCart(cx, cy, r, start);
    const e = polarToCart(cx, cy, r, end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const cx = 64;
  const cy = 64;
  const color = score >= 80 ? '#16A34A' : score >= 60 ? '#D97706' : '#9CA3AF';

  return (
    <svg width="128" height="100" viewBox="0 0 128 100" className="overflow-visible">
      {/* Background track */}
      <path
        d={describeArc(cx, cy, radius, startAngle, endAngle)}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="text-gray-100 dark:text-gray-700"
      />
      {/* Score arc */}
      <motion.path
        d={describeArc(cx, cy, radius, startAngle, scoreAngle)}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Score text */}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-gray-900 dark:fill-white" style={{ fontSize: '28px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
        {score}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" style={{ fontSize: '11px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
        out of 100
      </text>
    </svg>
  );
};

// ─── Skill Chip ──────────────────────────────────────────

const SkillChip = ({ skill }: { skill: SkillItem }) => {
  const barColor = skill.strength >= 80
    ? 'bg-emerald-400 dark:bg-emerald-500'
    : skill.strength >= 60
      ? 'bg-amber-400 dark:bg-amber-500'
      : 'bg-gray-300 dark:bg-gray-600';

  return (
    <div className={`relative px-3 py-2 rounded-lg border transition-colors ${
      skill.inDemand
        ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800/40'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{skill.name}</span>
        {skill.inDemand && (
          <Zap className="w-3 h-3 text-amber-500" fill="currentColor" strokeWidth={0} />
        )}
      </div>
      <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${skill.strength}%` }} />
      </div>
    </div>
  );
};

// ─── Opportunity Card ────────────────────────────────────

const OpportunityCard = ({ opp, index }: { opp: Opportunity; index: number }) => {
  const priorityColor = opp.priority === 'high'
    ? 'border-l-emerald-500'
    : opp.priority === 'medium'
      ? 'border-l-amber-500'
      : 'border-l-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-[3px] ${priorityColor} rounded-xl p-4`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">{opp.area}</h4>
        <span className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
          opp.priority === 'high'
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
        }`}>
          {opp.priority} impact
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{opp.impact}</p>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <Clock className="w-3 h-3" strokeWidth={1.75} />
        {opp.timeEstimate}
      </div>
    </motion.div>
  );
};

// ─── Job Match Card (Carousel) ───────────────────────────

interface MatchCardProps {
  job: Job;
  isSaved: boolean;
  onSave: (id: string) => void;
}

const MatchCard = ({ job, isSaved, onSave }: MatchCardProps) => {
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.name.toLowerCase() === job.companyName.toLowerCase());
  const scoreColor = job.matchScore >= 80 ? 'text-match-high' : job.matchScore >= 60 ? 'text-match-mid' : 'text-match-low';

  return (
    <div className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Score stripe */}
      <div className={`h-1 ${job.sponsorship ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className="p-4">
        {/* Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold text-xl ${scoreColor}`}>{job.matchScore}%</span>
            <span className={`text-xs font-medium ${scoreColor}`}>
              {job.matchScore >= 80 ? 'Strong' : job.matchScore >= 60 ? 'Good' : 'Partial'}
            </span>
          </div>
          {job.sponsorship && <Badge variant="sponsor">H-1B</Badge>}
        </div>

        {/* Job info */}
        <div className="flex items-start gap-2.5 mb-3">
          <div className="h-8 w-8 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-contain p-0.5" />
            ) : (
              <Building2 className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{job.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.companyName}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.75} />{job.location.split(',')[0]}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" strokeWidth={1.75} /><span className="font-mono">{job.salaryRange}</span></span>
        </div>

        {/* Sponsor track record */}
        {company && job.sponsorship && (
          <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
            <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" strokeWidth={1.75} />
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.petitions.toLocaleString()}</span> visas ·
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.approvalRate}%</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => onSave(job.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSaved
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" strokeWidth={1.75} /> : <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={() => navigate(`${ROUTES.JOB_SEARCH}?id=${job.id}`)}
            className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            View details <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Results ────────────────────────────────────────

const ResumeResults = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResumeUploaded, setResumeData } = useContext(ResumeContext) || {};
  const { savedJobs, toggleSavedJob, isSaved } = useContext(SavedJobsContext) || { savedJobs: [], toggleSavedJob: () => {}, isSaved: () => false };
  const carouselRef = useRef<HTMLDivElement>(null);

  const analysis = MOCK_ANALYSIS;
  const scoreColor = analysis.overallScore >= 80 ? 'text-match-high' : analysis.overallScore >= 60 ? 'text-match-mid' : 'text-match-low';

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await getJobs({ sponsorshipRequired: true });
        const sorted = [...res.data].sort((a, b) => b.matchScore - a.matchScore);
        setJobs(sorted.slice(0, 12));
      } catch {
        // empty state handled below
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleReset = () => {
    localStorage.removeItem('visahire_resume_status_v2');
    localStorage.removeItem('visahire_resume_data');
    setResumeData?.(null);
    setResumeUploaded?.(false);
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* ── Section A: Sponsorship Readiness ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Your sponsorship readiness</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/15 dark:hover:text-red-400 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
              Re-upload
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <ArcGauge score={analysis.overallScore} />
          <div className="text-center sm:text-left">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
              You're in the <span className={`font-mono font-bold ${scoreColor}`}>top {analysis.percentile}%</span> of applicants for
              {' '}<span className="font-display font-semibold text-gray-900 dark:text-white">{analysis.detectedRole}</span> roles at sponsoring companies.
            </p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1 rounded-md">
                Detected: <span className="font-medium text-gray-700 dark:text-gray-300">{analysis.seniority} {analysis.detectedRole}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Section B: Your Strengths ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Your strengths</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Skills with <Zap className="w-3 h-3 text-amber-500 inline" fill="currentColor" strokeWidth={0} /> are in high demand at sponsoring companies.
        </p>

        <div className="space-y-5">
          {Object.entries(analysis.skills).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {skills.map(skill => (
                  <SkillChip key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section C: Growth Opportunities ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Growth opportunities</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Targeted improvements that would expand your sponsorship options the most.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.opportunities.map((opp, i) => (
            <OpportunityCard key={opp.area} opp={opp} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ── Section D: Top Matches (Carousel) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Your top matches</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Curated for your profile — highest match scores first</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => scrollCarousel('left')} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button onClick={() => scrollCarousel('right')} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors">
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[280px] animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-56 flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {jobs.map(job => (
              <MatchCard
                key={job.id}
                job={job}
                isSaved={isSaved ? isSaved(job.id) : false}
                onSave={toggleSavedJob}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Section E: Track Progress ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Track your progress</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Upload an updated resume after improving skills to see how your score changes over time. Build skills → re-upload → watch your match count grow.
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-display font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
              Upload new version
            </button>
          </div>

          {/* Mini timeline visualization */}
          <div className="flex items-end gap-3 flex-shrink-0">
            {[
              { label: 'Now', score: analysis.overallScore, active: true },
              { label: '+Skills', score: analysis.overallScore + 8, active: false },
              { label: '+Projects', score: analysis.overallScore + 14, active: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 rounded-t-lg transition-all ${
                    step.active
                      ? 'bg-primary-500 dark:bg-primary-400'
                      : 'bg-gray-200 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ height: `${step.score * 0.8}px` }}
                />
                <span className="text-[10px] font-mono font-medium text-gray-500 dark:text-gray-400">{step.score}%</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeResults;
