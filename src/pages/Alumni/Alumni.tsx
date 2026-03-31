import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getAlumni } from '../../services/alumniService';
import { Alumni as AlumniType } from '../../data/mockAlumni';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import {
  GraduationCap, Building2, Briefcase, UserPlus, Check,
  Loader2, Users, ShieldCheck, SearchX,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// ─── Skeleton ────────────────────────────────────────────

const AlumniSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
    </div>
    <div className="h-9 bg-gray-100 dark:bg-gray-700 rounded-lg mt-4" />
  </div>
);

// ─── Alumni Card ─────────────────────────────────────────

interface AlumniCardProps {
  person: AlumniType;
  isConnecting: boolean;
  isConnected: boolean;
  onConnect: () => void;
  index: number;
}

const AlumniCard = ({ person, isConnecting, isConnected, onConnect, index }: AlumniCardProps) => {
  // Avatar gradient based on initials
  const bgColors = [
    'bg-primary-100 dark:bg-primary-900/30',
    'bg-emerald-100 dark:bg-emerald-900/30',
    'bg-amber-100 dark:bg-amber-900/30',
    'bg-pink-100 dark:bg-pink-900/30',
    'bg-cyan-100 dark:bg-cyan-900/30',
  ];
  const textColors = [
    'text-primary-700 dark:text-primary-300',
    'text-emerald-700 dark:text-emerald-300',
    'text-amber-700 dark:text-amber-300',
    'text-pink-700 dark:text-pink-300',
    'text-cyan-700 dark:text-cyan-300',
  ];
  const colorIdx = person.initials.charCodeAt(0) % bgColors.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={`size-11 rounded-full ${bgColors[colorIdx]} flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm`}>
          <span className={`text-sm font-display font-bold ${textColors[colorIdx]}`}>
            {person.initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white truncate">
            {person.name}
          </h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" strokeWidth={1.75} />
            <span className="truncate">{person.role}</span>
          </div>
        </div>
        {/* Sponsor indicator */}
        {person.sponsors && (
          <Badge variant="sponsor" className="flex-shrink-0 text-[11px] px-2 py-0.5">
            <ShieldCheck className="w-3 h-3 mr-0.5" strokeWidth={2} />
            Sponsors
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-5 flex-1">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Building2 className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" strokeWidth={1.75} />
          <span className="truncate font-medium text-gray-800 dark:text-gray-200">{person.company}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <GraduationCap className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" strokeWidth={1.75} />
          <span className="truncate">{person.university} · '{person.gradYear.slice(2)}</span>
        </div>
      </div>

      <button
        onClick={onConnect}
        disabled={isConnecting || isConnected}
        className={`w-full py-2 px-4 rounded-lg text-sm font-display font-semibold transition-all flex justify-center items-center gap-2 ${
          isConnected
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/15 dark:text-emerald-400 dark:border-emerald-800 cursor-default'
            : isConnecting
              ? 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed'
              : 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 dark:bg-gray-800 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/15 active:scale-[0.98]'
        }`}
      >
        {isConnected ? (
          <><Check className="w-4 h-4" strokeWidth={2} /> Request sent</>
        ) : isConnecting ? (
          <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Sending...</>
        ) : (
          <><UserPlus className="w-4 h-4" strokeWidth={1.75} /> Request intro</>
        )}
      </button>
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────

const Alumni = () => {
  const [alumni, setAlumni] = useState<AlumniType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sponsorOnly, setSponsorOnly] = useState(true);
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const res = await getAlumni({ q: searchQuery });
        setAlumni(res);
      } catch {
        // empty state handled
      } finally {
        setLoading(false);
      }
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchAlumni();
    } else {
      const timer = setTimeout(fetchAlumni, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const filtered = useMemo(() => {
    if (!sponsorOnly) return alumni;
    return alumni.filter(a => a.sponsors);
  }, [alumni, sponsorOnly]);

  const handleConnect = useCallback((id: string, name: string) => {
    setConnectingIds(prev => new Set(prev).add(id));

    setTimeout(() => {
      setConnectingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setConnectedIds(prev => new Set(prev).add(id));
      toast.success('Request sent!', {
        description: `${name} has been notified of your intro request.`,
      });
    }, 800);
  }, []);

  const sponsorCount = alumni.filter(a => a.sponsors).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto pb-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">Alumni network</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Connect with international students who secured H-1B roles.
            {!loading && (
              <span className="ml-1">
                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{filtered.length}</span> alumni
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setSponsorOnly(!sponsorOnly)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium font-display transition-all duration-200 flex-shrink-0 ${
            sponsorOnly
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
          At sponsoring companies
          {sponsorOnly && !loading && (
            <span className="font-mono text-xs bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
              {sponsorCount}
            </span>
          )}
        </button>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search name, university, or company..."
          className="flex-1 min-w-[200px] max-w-sm"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <AlumniSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX className="w-7 h-7" strokeWidth={1.75} />}
          title="No alumni match your search"
          description="Try broadening your filters or searching for a different university or company."
          className="mt-8"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((person, i) => (
            <AlumniCard
              key={person.id}
              person={person}
              isConnecting={connectingIds.has(person.id)}
              isConnected={connectedIds.has(person.id)}
              onConnect={() => handleConnect(person.id, person.name)}
              index={i}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Alumni;
