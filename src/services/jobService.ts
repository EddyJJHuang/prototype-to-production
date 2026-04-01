import api from './api';
import { mockJobs, Job } from '../data/mockJobs';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ── Client-side cache (sessionStorage) with stale-while-revalidate ──────────

const CACHE_PREFIX = 'visahire_jobs_';
const CACHE_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes — consider data fresh

interface CachedResult {
  data: Job[];
  total: number;
  timestamp: number;
}

function buildCacheKey(filters: Record<string, unknown>): string {
  const sorted = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return CACHE_PREFIX + JSON.stringify(sorted);
}

function readCache(key: string): CachedResult | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CachedResult;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: Job[], total: number): void {
  try {
    const entry: CachedResult = { data, total, timestamp: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // sessionStorage full — silently ignore
  }
}

export const getJobs = async (filters: any = {}): Promise<{ data: Job[], total: number }> => {
  if (USE_MOCK) {
    let results = [...mockJobs];

    if (filters.sponsorshipRequired) {
      results = results.filter(job => job.sponsorship === true);
    }
    if (filters.location && filters.location !== 'All') {
      results = results.filter(job => job.location.includes(filters.location));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(job =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q)
      );
    }

    return { data: results, total: results.length };
  }

  const params: Record<string, string | number> = {
    q: filters.q || 'software engineer',
    page: filters.page || 1,
    num_pages: 1,
    country: 'us',
    date_posted: 'all',
  };
  if (filters.location && filters.location !== 'All') {
    params.location = filters.location;
  }

  const cacheKey = buildCacheKey(params);
  const cached = readCache(cacheKey);
  const isFresh = cached && (Date.now() - cached.timestamp) < CACHE_MAX_AGE_MS;

  // Return fresh cache immediately — no network call
  if (isFresh) {
    return { data: cached.data, total: cached.total };
  }

  // If stale cache exists, return it immediately and revalidate in background
  if (cached) {
    api.get(API_ENDPOINTS.JOBS, { params }).then(res => {
      writeCache(cacheKey, res.data.data, res.data.total);
    }).catch(() => { /* background refresh failed — stale data still usable */ });
    return { data: cached.data, total: cached.total };
  }

  // No cache at all — must wait for network
  const res = await api.get(API_ENDPOINTS.JOBS, { params });
  writeCache(cacheKey, res.data.data, res.data.total);
  return { data: res.data.data, total: res.data.total };
};

export const getJobById = async (id: string): Promise<Job | null> => {
  if (USE_MOCK) {
    // Return mock data immediately (no artificial delay)
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
