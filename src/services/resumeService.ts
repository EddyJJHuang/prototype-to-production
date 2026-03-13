import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const uploadResume = async (file: File): Promise<any> => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1500)); // Simulate file parsing
    localStorage.setItem('visahire_resume_status_v2', JSON.stringify(true));
    return { success: true, matchAnalyzed: true };
  }
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('top', '9');
  
  const res = await api.post(API_ENDPOINTS.RESUME_UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
