import api from './api';
import { mockJobs, Job } from '../data/mockJobs';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const getJobs = async (filters: any = {}): Promise<{ data: Job[], total: number }> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let results = [...mockJobs];
    
    if (filters.sponsorshipRequired) {
      results = results.filter(job => job.sponsorship === true);
    }
    if (filters.location && filters.location !== 'All') {
      results = results.filter(job => job.location.includes(filters.location));
    }
    // Search text
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(q) || 
        job.companyName.toLowerCase().includes(q)
      );
    }
    
    return { data: results, total: results.length };
  }
  const res = await api.get(API_ENDPOINTS.JOBS, { params: filters });
  return res.data;
};

export const getJobById = async (id: string): Promise<Job | null> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockJobs.find(job => job.id === id) || null;
  }
  const res = await api.get(API_ENDPOINTS.JOB_DETAIL(id));
  return res.data;
};
