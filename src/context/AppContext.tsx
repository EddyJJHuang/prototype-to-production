import React from 'react';
import { ThemeProvider } from './ThemeContext';

// We will add more providers here (UserProvider, SavedJobsProvider, etc.)
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {/* <UserProvider> */}
        {/* <SavedJobsProvider> */}
          {children}
        {/* </SavedJobsProvider> */}
      {/* </UserProvider> */}
    </ThemeProvider>
  );
};
