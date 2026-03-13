import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { ResumeProvider } from './context/ResumeContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProvider>
      <UserProvider>
        <SavedJobsProvider>
          <ResumeProvider>
            <Router>
              <AppRoutes />
              {/* Toaster uses sonner, customized for dark mode tracking */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
                }}
              />
            </Router>
          </ResumeProvider>
        </SavedJobsProvider>
      </UserProvider>
    </AppProvider>
  );
}
