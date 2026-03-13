import React, { useEffect, useState } from 'react';
import { getAlumni } from '../../services/alumniService';
import { Alumni as AlumniType } from '../../data/mockAlumni';
import SearchBar from '../../components/common/SearchBar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { GraduationCap, Building2, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const Alumni: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const res = await getAlumni({ q: searchQuery });
        setAlumni(res);
      } catch (err) {
        console.error("Failed to fetch alumni:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAlumni();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleConnect = (id: string, name: string) => {
    setConnecting(prev => ({ ...prev, [id]: true }));
    
    // Simulate network request
    setTimeout(() => {
      setConnecting(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      // Utilizing sonner toast since it's in package.json
      toast.success('Request sent!', {
        description: `${name} has been notified of your connection request.`
      });
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Network</h1>
          <p className="text-gray-500 mt-1">Connect with international students who secured H-1B roles.</p>
        </div>
        
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search name, university, or company..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Loader type="card" count={6} />
        </div>
      ) : alumni.length === 0 ? (
        <EmptyState 
          icon={<UsersIcon className="w-8 h-8" />}
          title="No alumni found"
          description={`We couldn't find anyone matching "${searchQuery}".`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map(person => (
            <div key={person.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200 flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {person.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {person.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{person.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate font-medium text-gray-900 dark:text-gray-300">{person.company}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <GraduationCap className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{person.university} • '{person.gradYear.slice(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => handleConnect(person.id, person.name)}
                disabled={connecting[person.id]}
                className={`w-full py-2 px-4 border rounded-lg text-sm font-medium transition-colors flex justify-center items-center ${
                  connecting[person.id]
                    ? 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed'
                    : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/30'
                }`}
              >
                {connecting[person.id] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Fallback lucide icon import inline for empty state match
const UsersIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default Alumni;
