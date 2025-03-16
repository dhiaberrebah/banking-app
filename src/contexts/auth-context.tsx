import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { mockUsers } from '../data/mock-data';
import { User, AuthContextType, RegisterData } from '../types';

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (email: string, password: string): boolean => {
    // Find user in mock data
    const user = mockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Remove password from stored user object
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Register function
  const register = (userData: RegisterData): boolean => {
    // In a real app, this would make an API call
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'user' as const,
    };
    
    // Log in the user after registration
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};