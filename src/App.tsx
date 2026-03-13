/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { Stats } from './pages/Stats';
import { Resume } from './pages/Resume';
import { Alumni } from './pages/Alumni';
import { Saved } from './pages/Saved';
import { Settings } from './pages/Settings';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="stats" element={<Stats />} />
            <Route path="resume" element={<Resume />} />
            <Route path="alumni" element={<Alumni />} />
            <Route path="saved" element={<Saved />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </AppProvider>
  );
}
