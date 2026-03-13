import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { getJobs } from '../../services/jobService';
import { getAlumni } from '../../services/alumniService';
import { Job } from '../../data/mockJobs';
import MetricCard from '../../components/common/MetricCard';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import { Briefcase, Building2, Users, FileText } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { user } = useContext(UserContext) || {};
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, alumni: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, alumniRes] = await Promise.all([
          getJobs({ limit: 3, sponsorshipRequired: true }),
          getAlumni({ limit: 1 }) // Just for count simulation
        ]);
        
        setRecentJobs(jobsRes.data.slice(0, 3));
        setStats({
          jobs: jobsRes.total,
          companies: 142, // Mocked overall count
          alumni: 1205 // Mocked overall
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loader type="skeleton" count={1} className="h-24" />
        <Loader type="card" count={3} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.name || 'there'}! Here's what's new for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Sponsoring Jobs" 
          value={stats.jobs.toLocaleString()} 
          icon={<Briefcase className="w-5 h-5" />}
          trend={{ value: '12% this week', isPositive: true }}
        />
        <MetricCard 
          title="Sponsor Companies" 
          value={stats.companies} 
          icon={<Building2 className="w-5 h-5" />}
          trend={{ value: '4 new today', isPositive: true }}
        />
        <MetricCard 
          title="Alumni Connections" 
          value={stats.alumni.toLocaleString()} 
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard 
          title="Resume Score" 
          value={85} 
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: 'Top 15%', isPositive: true }}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Matches</h2>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
