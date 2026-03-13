import React, { useState } from 'react';
import { motion } from 'motion/react';
import { mockData } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sponsorshipOnly, setSponsorshipOnly] = useState(false);

  const roles = ['All', 'Software Engineer', 'Data Scientist', 'Product Manager', 'Backend Engineer', 'Frontend Engineer'];

  const filteredJobs = mockData.jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || job.title.includes(selectedRole);
    const matchesSponsorship = sponsorshipOnly ? job.sponsorship : true;
    
    return matchesSearch && matchesRole && matchesSponsorship;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Search</h1>
          <p className="text-slate-600 mt-1 text-lg">Find opportunities that sponsor H-1B visas.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={sponsorshipOnly}
                onChange={(e) => setSponsorshipOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-sm font-medium text-slate-700">H-1B Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-500">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
