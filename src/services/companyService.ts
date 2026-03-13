import api from './api';
import { mockCompanies, Company } from '../data/mockCompanies';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK = true; // import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const getCompanies = async (filters: any = {}): Promise<Company[]> => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 400));
    let results = [...mockCompanies];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(q));
    }
    return results;
  }
  const res = await api.get(API_ENDPOINTS.COMPANIES, { params: filters });
  return res.data;
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    return mockCompanies.find(c => c.id === id) || null;
  }
  const res = await api.get(API_ENDPOINTS.COMPANY_DETAIL(id));
  return res.data;
};
