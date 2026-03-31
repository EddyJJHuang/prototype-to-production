import React, { useState, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCompanies, Company } from '../../data/mockCompanies';
import { ResumeContext } from '../../context/ResumeContext';
import { ROUTES } from '../../utils/constants';
import SearchBar from '../../components/common/SearchBar';
import {
  TrendingUp, TrendingDown, Minus, Building2, ChevronDown,
  ChevronUp, MapPin, Briefcase, DollarSign, ShieldCheck,
  Pin, PinOff, X, ArrowRight, Sparkles, BarChart3, Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Helpers ─────────────────────────────────────────────

const industries = [...new Set(mockCompanies.map(c => c.industry))].sort();

const getApprovalColor = (rate: number): string => {
  if (rate >= 99) return 'bg-emerald-600/90 dark:bg-emerald-500/80';
  if (rate >= 97) return 'bg-emerald-500/85 dark:bg-emerald-500/70';
  if (rate >= 95) return 'bg-teal-500/80 dark:bg-teal-500/65';
  return 'bg-amber-500/80 dark:bg-amber-500/65';
};

const getApprovalBorder = (rate: number): string => {
  if (rate >= 97) return 'border-emerald-600/20 dark:border-emerald-400/15';
  if (rate >= 95) return 'border-teal-600/20 dark:border-teal-400/15';
  return 'border-amber-600/20 dark:border-amber-400/15';
};

// ─── Squarified Treemap Layout ───────────────────────────

interface TreemapRect {
  x: number; y: number; w: number; h: number;
  company: Company;
}

const layoutTreemap = (items: Company[], width: number, height: number): TreemapRect[] => {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => b.petitions - a.petitions);
  const total = sorted.reduce((s, c) => s + c.petitions, 0);
  const rects: TreemapRect[] = [];

  const layout = (companies: Company[], x: number, y: number, w: number, h: number) => {
    if (companies.length === 0) return;
    if (companies.length === 1) {
      rects.push({ x, y, w, h, company: companies[0] });
      return;
    }

    const subTotal = companies.reduce((s, c) => s + c.petitions, 0);
    const horizontal = w >= h;

    // Find best split using squarified heuristic
    let bestIdx = 0;
    let bestRatio = Infinity;
    let runSum = 0;

    for (let i = 0; i < companies.length - 1; i++) {
      runSum += companies[i].petitions;
      const frac = runSum / subTotal;
      const stripSize = frac * (horizontal ? w : h);
      const restSize = (horizontal ? w : h) - stripSize;

      // Worst aspect ratio in the strip
      let worstRatio = 0;
      let innerSum = 0;
      for (let j = 0; j <= i; j++) {
        innerSum += companies[j].petitions;
        const cellLen = (companies[j].petitions / runSum) * (horizontal ? h : w);
        const ratio = Math.max(stripSize / cellLen, cellLen / stripSize);
        worstRatio = Math.max(worstRatio, ratio);
      }

      if (worstRatio < bestRatio) {
        bestRatio = worstRatio;
        bestIdx = i;
      }
    }

    const splitAt = bestIdx + 1;
    const leftItems = companies.slice(0, splitAt);
    const rightItems = companies.slice(splitAt);
    const leftTotal = leftItems.reduce((s, c) => s + c.petitions, 0);
    const frac = leftTotal / subTotal;

    if (horizontal) {
      const splitW = frac * w;
      // Lay out left strip vertically
      let offsetY = y;
      for (const c of leftItems) {
        const cellH = (c.petitions / leftTotal) * h;
        rects.push({ x, y: offsetY, w: splitW, h: cellH, company: c });
        offsetY += cellH;
      }
      layout(rightItems, x + splitW, y, w - splitW, h);
    } else {
      const splitH = frac * h;
      let offsetX = x;
      for (const c of leftItems) {
        const cellW = (c.petitions / leftTotal) * w;
        rects.push({ x: offsetX, y, w: cellW, h: splitH, company: c });
        offsetX += cellW;
      }
      layout(rightItems, x, y + splitH, w, h - splitH);
    }
  };

  layout(sorted, 0, 0, width, height);
  return rects;
};

const getApprovalTextColor = (rate: number): string => {
  if (rate >= 97) return 'text-emerald-600 dark:text-emerald-400';
  if (rate >= 95) return 'text-teal-600 dark:text-teal-400';
  return 'text-amber-600 dark:text-amber-400';
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.75} />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={1.75} />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />;
};

// ─── Sparkline ───────────────────────────────────────────

const Sparkline = ({ data, className = '' }: { data: number[]; className?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`
  ).join(' ');
  const isUp = data[data.length - 1] >= data[0];

  return (
    <svg width={w} height={h} className={`overflow-visible ${className}`}>
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? '#059669' : '#ef4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── Market Map (Treemap Viz) ────────────────────────────

interface MarketMapProps {
  companies: Company[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  pinnedIds: Set<string>;
}

const TREEMAP_W = 1000;
const TREEMAP_H = 420;
const CELL_GAP = 2;

const MarketMap = ({ companies, selectedId, onSelect, pinnedIds }: MarketMapProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rects = useMemo(
    () => layoutTreemap(companies, TREEMAP_W, TREEMAP_H),
    [companies]
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">Sponsorship landscape</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Area = petition volume · Color = approval rate</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-emerald-500" aria-hidden="true" /> &ge;97%</span>
          <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-teal-500" aria-hidden="true" /> 95–97%</span>
          <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-amber-500" aria-hidden="true" /> &lt;95%</span>
        </div>
      </div>

      {/* Treemap */}
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ paddingBottom: `${(TREEMAP_H / TREEMAP_W) * 100}%` }}
      >
        <div className="absolute inset-0">
          {rects.map(rect => {
            const c = rect.company;
            const isActive = selectedId === c.id;
            const isPinned = pinnedIds.has(c.id);
            const isHovered = hoveredId === c.id;

            // Adaptive content: show more info in larger cells
            const cellArea = (rect.w / TREEMAP_W) * (rect.h / TREEMAP_H);
            const showName = cellArea > 0.015;
            const showStats = cellArea > 0.04;

            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute flex flex-col items-center justify-center overflow-hidden transition-opacity duration-150 border ${getApprovalColor(c.approvalRate)} ${getApprovalBorder(c.approvalRate)} ${
                  isActive ? 'ring-2 ring-primary-600 z-10' : ''
                } ${isPinned ? 'ring-2 ring-amber-400 z-10' : ''} ${
                  isHovered ? 'opacity-100 z-20' : 'opacity-90 hover:opacity-100'
                }`}
                style={{
                  left: `${(rect.x / TREEMAP_W) * 100}%`,
                  top: `${(rect.y / TREEMAP_H) * 100}%`,
                  width: `calc(${(rect.w / TREEMAP_W) * 100}% - ${CELL_GAP}px)`,
                  height: `calc(${(rect.h / TREEMAP_H) * 100}% - ${CELL_GAP}px)`,
                  borderRadius: '6px',
                }}
                title={`${c.name}: ${c.petitions.toLocaleString()} petitions, ${c.approvalRate}% approved`}
                aria-label={`${c.name}, ${c.petitions} petitions, ${c.approvalRate} percent approved`}
              >
                <img
                  src={c.logo}
                  alt=""
                  className="rounded bg-white/90 dark:bg-white/80 shadow-sm"
                  style={{ width: showStats ? 28 : showName ? 22 : 18, height: showStats ? 28 : showName ? 22 : 18, padding: 2 }}
                  referrerPolicy="no-referrer"
                  aria-hidden="true"
                />
                {showName && (
                  <span className="text-white font-display font-bold text-[10px] mt-1 leading-none truncate max-w-[90%] drop-shadow-sm">
                    {c.name}
                  </span>
                )}
                {showStats && (
                  <span className="text-white/80 font-mono text-[9px] mt-0.5 leading-none drop-shadow-sm">
                    {c.petitions.toLocaleString()} · {c.approvalRate}%
                  </span>
                )}

                {/* Hover overlay with full info for small cells */}
                {isHovered && !showStats && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-900/80 p-1">
                    <div className="text-center">
                      <div className="text-white font-display font-bold text-[10px] leading-tight truncate">{c.name}</div>
                      <div className="text-white/70 font-mono text-[8px] mt-0.5">{c.petitions.toLocaleString()} · {c.approvalRate}%</div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Company Card (Expandable) ───────────────────────────

interface CompanyCardProps {
  company: Company;
  isExpanded: boolean;
  isPinned: boolean;
  onToggleExpand: () => void;
  onTogglePin: () => void;
  rank: number;
}

const CompanyCard = ({ company, isExpanded, isPinned, onToggleExpand, onTogglePin, rank }: CompanyCardProps) => {
  const navigate = useNavigate();
  const maxHistory = Math.max(...company.history.map(h => h.petitions));
  const rolePercentages = [45, 30, 25];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: rank * 0.02 }}
      className={`bg-white dark:bg-gray-800 border rounded-xl overflow-hidden transition-colors ${
        isPinned
          ? 'border-amber-300 dark:border-amber-700 shadow-sm'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Collapsed row */}
      <button
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        {/* Rank */}
        <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-5 text-right flex-shrink-0">{rank}</span>

        {/* Logo */}
        <div className="h-9 w-9 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-0.5" referrerPolicy="no-referrer" />
        </div>

        {/* Name + Industry */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{company.name}</h3>
            <TrendIcon trend={company.trend} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{company.industry}</p>
        </div>

        {/* Stats (hidden on mobile collapsed) */}
        <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
          <div className="text-right">
            <div className="font-mono font-bold text-sm text-gray-900 dark:text-white">{company.petitions.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">petitions</div>
          </div>
          <div className="text-right">
            <div className={`font-mono font-bold text-sm ${getApprovalTextColor(company.approvalRate)}`}>{company.approvalRate}%</div>
            <div className="text-[10px] text-gray-400">approved</div>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-sm text-gray-900 dark:text-white">${Math.round(company.avgSalary / 1000)}k</div>
            <div className="text-[10px] text-gray-400">avg salary</div>
          </div>
          <Sparkline data={company.history.map(h => h.petitions)} />
        </div>

        {/* Pin + Expand */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
            className={`p-1.5 rounded-lg transition-colors ${
              isPinned
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            }`}
            aria-label={isPinned ? 'Unpin from comparison' : 'Pin to compare'}
          >
            {isPinned ? <PinOff className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" /> : <Pin className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />}
          </button>
          {isExpanded
            ? <ChevronUp className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
            : <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
          }
        </div>
      </button>

      {/* Mobile stats (always visible on mobile when collapsed) */}
      {!isExpanded && (
        <div className="flex sm:hidden items-center gap-4 px-4 pb-3 pl-[68px] text-xs text-gray-500 dark:text-gray-400">
          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{company.petitions.toLocaleString()}</span> visas
          <span>·</span>
          <span className={`font-mono font-medium ${getApprovalTextColor(company.approvalRate)}`}>{company.approvalRate}%</span>
          <span>·</span>
          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">${Math.round(company.avgSalary / 1000)}k</span>
        </div>
      )}

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="px-4 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700/50 space-y-5">
              {/* Petition history */}
              <div>
                <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Petition history
                </h4>
                <div className="space-y-2">
                  {company.history.map(h => (
                    <div key={h.year} className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-gray-400 w-12 flex-shrink-0">{h.year}</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(h.petitions / maxHistory) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full"
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300 w-12 text-right flex-shrink-0">
                        {h.petitions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top roles */}
              <div>
                <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Top roles sponsored
                </h4>
                <div className="space-y-2">
                  {company.topRoles.map((role, i) => (
                    <div key={role} className="flex items-center gap-2.5">
                      <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 min-w-0 truncate">{role}</span>
                      <div className="w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                        <div
                          className="bg-primary-500 dark:bg-primary-400 h-full rounded-full"
                          style={{ width: `${rolePercentages[i]}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 w-6 text-right flex-shrink-0">{rolePercentages[i]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations + Key stats */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Office locations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {company.locations.map(loc => (
                      <span key={loc} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3" strokeWidth={1.75} />{loc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Salary range
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">${(company.avgSalary / 1000).toFixed(0)}k</span>
                    <span className="text-xs text-gray-400">average</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`${ROUTES.JOB_SEARCH}?q=${encodeURIComponent(company.name)}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-display font-semibold rounded-lg transition-all active:scale-[0.98]"
              >
                View open jobs at {company.name}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Comparison View ─────────────────────────────────────

const ComparisonView = ({ companies, onRemove, onClose }: { companies: Company[]; onRemove: (id: string) => void; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mb-6"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
        Company comparison
      </h3>
      <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <X className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {companies.map(c => (
        <div key={c.id} className="relative bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
          <button
            onClick={() => onRemove(c.id)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700"
          >
            <X className="w-3 h-3" strokeWidth={2} />
          </button>
          <div className="h-10 w-10 mx-auto mb-2 rounded-lg border border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            <img src={c.logo} alt={c.name} className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
          </div>
          <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mb-3 truncate">{c.name}</h4>

          <div className="space-y-2.5 text-left">
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-400">Petitions</span>
              <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">{c.petitions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-400">Approval</span>
              <span className={`font-mono font-bold text-xs ${getApprovalTextColor(c.approvalRate)}`}>{c.approvalRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-400">Avg salary</span>
              <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">${Math.round(c.avgSalary / 1000)}k</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-400">Trend</span>
              <TrendIcon trend={c.trend} />
            </div>
            <div className="pt-1.5 border-t border-gray-200 dark:border-gray-600">
              <span className="text-[10px] text-gray-400 block mb-1">Top roles</span>
              {c.topRoles.map(r => (
                <div key={r} className="text-[11px] text-gray-600 dark:text-gray-300 truncate">{r}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ─── Skeleton ────────────────────────────────────────────

const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-48" />
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-16" />
      ))}
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────

const SponsorshipStats = () => {
  const { resumeUploaded } = useContext(ResumeContext) || { resumeUploaded: false };
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  // Filter companies
  const filtered = useMemo(() => {
    let result = [...mockCompanies];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.topRoles.some(r => r.toLowerCase().includes(q)) ||
        c.locations.some(l => l.toLowerCase().includes(q))
      );
    }
    if (industryFilter) {
      result = result.filter(c => c.industry === industryFilter);
    }
    return result.sort((a, b) => b.petitions - a.petitions);
  }, [searchQuery, industryFilter]);

  const handleTogglePin = useCallback((id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBubbleSelect = useCallback((id: string) => {
    setSelectedBubbleId(prev => prev === id ? null : id);
    setExpandedId(prev => prev === id ? null : id);
    // Scroll to card
    setTimeout(() => {
      document.getElementById(`company-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

  const pinnedCompanies = useMemo(
    () => mockCompanies.filter(c => pinnedIds.has(c.id)),
    [pinnedIds]
  );

  // Aggregate stats
  const totalPetitions = mockCompanies.reduce((sum, c) => sum + c.petitions, 0);
  const avgApproval = (mockCompanies.reduce((sum, c) => sum + c.approvalRate, 0) / mockCompanies.length).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto space-y-6 pb-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">Sponsorship intelligence</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{mockCompanies.length}</span> companies
          <span className="text-gray-300 dark:text-gray-600 mx-1.5">·</span>
          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{totalPetitions.toLocaleString()}</span> total petitions
          <span className="text-gray-300 dark:text-gray-600 mx-1.5">·</span>
          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{avgApproval}%</span> avg approval
        </p>
      </div>

      {/* Personal insight */}
      {resumeUploaded && (
        <div className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/15 border border-primary-100 dark:border-primary-800/30 rounded-xl px-4 py-3">
          <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" strokeWidth={1.75} />
          <p className="text-sm text-primary-700 dark:text-primary-300 flex-1">
            <span className="font-display font-semibold">Based on your profile</span>, Technology companies with ML/AI roles have the strongest sponsorship track record for your background.
          </p>
        </div>
      )}

      {/* Hero Market Map */}
      <MarketMap
        companies={filtered}
        selectedId={selectedBubbleId}
        onSelect={handleBubbleSelect}
        pinnedIds={pinnedIds}
      />

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search company, role, or location..."
          className="flex-1 min-w-[200px] max-w-md"
        />

        {/* Industry chips */}
        <div className="flex flex-wrap gap-2">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(prev => prev === ind ? null : ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                industryFilter === ind
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 ml-auto">
          <span className="font-mono font-medium text-gray-600 dark:text-gray-300">{filtered.length}</span> results
        </span>
      </div>

      {/* Comparison pinned bar */}
      {pinnedIds.size >= 2 && !showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3"
        >
          <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" strokeWidth={1.75} />
          <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
            <span className="font-display font-semibold">{pinnedIds.size} companies pinned</span> for comparison
          </p>
          <button
            onClick={() => setShowComparison(true)}
            className="px-3 py-1.5 text-xs font-display font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Compare
          </button>
        </motion.div>
      )}

      {/* Comparison view */}
      <AnimatePresence>
        {showComparison && pinnedCompanies.length >= 2 && (
          <ComparisonView
            companies={pinnedCompanies}
            onRemove={(id) => handleTogglePin(id)}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>

      {/* Company cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <Building2 className="w-8 h-8 mx-auto mb-3 opacity-50" strokeWidth={1.75} />
            <p className="text-sm font-medium mb-1">No companies match your search</p>
            <p className="text-xs">Try a different query or clear your filters.</p>
          </div>
        ) : (
          filtered.map((company, index) => (
            <div key={company.id} id={`company-${company.id}`}>
              <CompanyCard
                company={company}
                isExpanded={expandedId === company.id}
                isPinned={pinnedIds.has(company.id)}
                onToggleExpand={() => setExpandedId(prev => prev === company.id ? null : company.id)}
                onTogglePin={() => handleTogglePin(company.id)}
                rank={index + 1}
              />
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SponsorshipStats;
