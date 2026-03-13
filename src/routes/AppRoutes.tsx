import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
// import AuthLayout from '../layouts/AuthLayout';
import { ROUTES } from '../utils/constants';

// Page Imports
import Dashboard from '../pages/Dashboard/Dashboard';
import JobSearch from '../pages/JobSearch/JobSearch';
import SponsorshipStats from '../pages/SponsorshipStats/SponsorshipStats';
import ResumeMatch from '../pages/ResumeMatch/ResumeMatch';
import SavedJobs from '../pages/SavedJobs/SavedJobs';
import Alumni from '../pages/Alumni/Alumni';
import Settings from '../pages/Settings/Settings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.JOB_SEARCH} element={<JobSearch />} />
        <Route path={ROUTES.SPONSORSHIP_STATS} element={<SponsorshipStats />} />
        <Route path={ROUTES.RESUME_MATCH} element={<ResumeMatch />} />
        <Route path={ROUTES.SAVED_JOBS} element={<SavedJobs />} />
        <Route path={ROUTES.ALUMNI} element={<Alumni />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>

      {/* Future auth routes: */}
      {/* 
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
      </Route> 
      */}
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutes;
