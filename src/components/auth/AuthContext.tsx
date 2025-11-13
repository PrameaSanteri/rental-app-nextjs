'use client';

import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

const USER_STORAGE_KEY = 'pin_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Could not read session storage for user data', e);
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    try {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error('Could not write to session storage', e);
    }
    setUser(userData);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error('Could not write to session storage', e);
    }
    setUser(null);
    window.location.href = '/login';
  };

  const isAuthenticated = !!user;

  const value = { user, isAuthenticated, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
