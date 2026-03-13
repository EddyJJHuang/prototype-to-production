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

  // Real API call — proxied through our FastAPI backend to JSearch
  const params: any = {
    q: filters.q || 'software engineer',
    page: filters.page || 1,
    num_pages: 1,
    country: 'us',
    date_posted: 'all',
  };
  if (filters.location && filters.location !== 'All') {
    params.location = filters.location;
  }

  const res = await api.get(API_ENDPOINTS.JOBS, { params });
  return { data: res.data.data, total: res.data.total };
};

export const getJobById = async (id: string): Promise<Job | null> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockJobs.find(job => job.id === id) || null;
  }
  // For real API, we fetch all current results and find by id
  // (JSearch doesn't have a direct job-by-id endpoint)
  try {
    const res = await api.get(API_ENDPOINTS.JOBS, { params: { q: 'software engineer' } });
    const jobs: Job[] = res.data.data || [];
    return jobs.find(job => job.id === id) || null;
  } catch {
    return null;
  }
};
