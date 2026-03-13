import React, { createContext, useState, useEffect } from 'react';
import { mockUser, User } from '../data/mockUser';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Simulate fetching user on load
  useEffect(() => {
    // In future this will be an API call verifying the token
    const timer = setTimeout(() => {
      setUser(mockUser);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
};
