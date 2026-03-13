import React, { useState } from 'react';
import { motion } from 'motion/react';
import { mockData } from '../data/mockData';
import { Search, GraduationCap, Building2, Briefcase, MessageSquare, Users } from 'lucide-react';

export const Alumni: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All');

  const universities = ['All', ...Array.from(new Set(mockData.alumni.map(a => a.university)))].sort();

  const filteredAlumni = mockData.alumni.filter(alumnus => {
    const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alumnus.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumnus.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniversity = selectedUniversity === 'All' || alumnus.university === selectedUniversity;
    
    return matchesSearch && matchesUniversity;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Network</h1>
        <p className="text-slate-600 mt-1 text-lg">Connect with international alumni who successfully navigated the visa process.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="relative md:w-64">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
            >
              {universities.map(uni => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map(alumnus => (
          <motion.div
            key={alumnus.id}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold shrink-0">
                {alumnus.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">{alumnus.name}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1">
                  <GraduationCap className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{alumnus.university} '{alumnus.gradYear.slice(-2)}</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 flex-1">
              <div className="flex items-center text-sm text-slate-700">
                <Building2 className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                <span className="font-medium">{alumnus.company}</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <Briefcase className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                <span>{alumnus.role}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-slate-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors border border-slate-200 hover:border-indigo-200">
                <MessageSquare className="w-4 h-4 mr-2" />
                Connect
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredAlumni.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No alumni found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </motion.div>
  );
};
