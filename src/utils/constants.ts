export const API_ENDPOINTS = {
  JOBS: '/jobs',
  JOB_DETAIL: (id: string) => `/jobs/${id}`,
  COMPANIES: '/companies',
  COMPANY_DETAIL: (id: string) => `/companies/${id}`,
  COMPANY_STATS: '/companies/stats',
  RESUME_UPLOAD: '/resume/upload',
  RESUME_MATCH: '/resume/match',
  ALUMNI: '/alumni',
  USER_PROFILE: '/user/profile',
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  SAVED_JOBS: '/user/saved-jobs',
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  JOB_SEARCH: '/jobs',
  SPONSORSHIP_STATS: '/stats',
  RESUME_MATCH: '/resume-match',
  SAVED_JOBS: '/saved-jobs',
  ALUMNI: '/alumni',
  SETTINGS: '/settings',
  LOGIN: '/login',
  SIGNUP: '/signup',
};
