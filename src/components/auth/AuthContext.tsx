'use client';

import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'pin_authenticated';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Could not read session storage for auth state', e);
    }
    setLoading(false);
  }, []);

  const login = () => {
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch (e) {
      console.error('Could not write to session storage', e);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Could not write to session storage', e);
    }
    setIsAuthenticated(false);
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  const value = { isAuthenticated, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
