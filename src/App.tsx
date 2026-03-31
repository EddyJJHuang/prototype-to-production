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
              <Toaster
                position="bottom-right"
                gap={8}
                toastOptions={{
                  duration: 3000,
                  className: 'font-body text-sm',
                  style: {
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  },
                }}
                theme="system"
              />
            </Router>
          </ResumeProvider>
        </SavedJobsProvider>
      </UserProvider>
    </AppProvider>
  );
}
