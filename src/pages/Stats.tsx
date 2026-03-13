import React, { useState } from 'react';
import { motion } from 'motion/react';
import { mockData } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Search, TrendingUp, TrendingDown, Minus, Building2 } from 'lucide-react';

export const Stats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = mockData.companies
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.petitions - a.petitions);

  // Prepare data for the top 10 companies chart
  const chartData = mockData.companies
    .sort((a, b) => b.petitions - a.petitions)
    .slice(0, 10)
    .map(c => ({
      name: c.name,
      petitions: c.petitions,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sponsorship Statistics</h1>
        <p className="text-slate-600 mt-1 text-lg">Analyze H-1B visa sponsorship data across top tech companies.</p>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Top 10 Sponsors (2025)</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="petitions" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Company Directory</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Petitions</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Approval Rate</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Salary</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={company.logo} alt="" className="w-8 h-8 rounded-md border border-slate-200" referrerPolicy="no-referrer" />
                      <span className="ml-3 font-medium text-slate-900">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {company.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {company.petitions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {company.approvalRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    ${company.avgSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.trend === 'up' ? (
                      <span className="inline-flex items-center text-emerald-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" /> Up
                      </span>
                    ) : company.trend === 'down' ? (
                      <span className="inline-flex items-center text-red-600 text-sm font-medium">
                        <TrendingDown className="w-4 h-4 mr-1" /> Down
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-500 text-sm font-medium">
                        <Minus className="w-4 h-4 mr-1" /> Flat
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>No companies found matching "{searchTerm}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
