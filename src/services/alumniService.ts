import api from './api';
import { mockAlumni, Alumni } from '../data/mockAlumni';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK = true; // import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const getAlumni = async (filters: any = {}): Promise<Alumni[]> => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    let results = [...mockAlumni];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.company.toLowerCase().includes(q) ||
        a.university.toLowerCase().includes(q)
      );
    }
    return results;
  }
  const res = await api.get(API_ENDPOINTS.ALUMNI, { params: filters });
  return res.data;
};
