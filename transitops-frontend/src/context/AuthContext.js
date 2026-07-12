'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Role Redirection Matrix helper
  const getRedirectPath = (role) => {
    switch (role) {
      case 'Fleet Manager':
        return '/dashboard';
      case 'Dispatcher':
        return '/dashboard/trips';
      case 'Safety Officer':
        return '/dashboard/maintenance';
      case 'Financial Analyst':
        return '/dashboard/analytics';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('transitops_token') : null;
    const storedUser = typeof window !== 'undefined' ? window.localStorage.getItem('transitops_user') : null;

    if (storedToken) {
      setToken(storedToken);
      // Bind token to API client authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsReady(true);
  }, []);

  const login = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('transitops_token', nextToken);
      window.localStorage.setItem('transitops_user', JSON.stringify(nextUser));
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${nextToken}`;
    
    // Redirect based on role automatically
    const redirectPath = getRedirectPath(nextUser.role);
    router.push(redirectPath);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('transitops_token');
      window.localStorage.removeItem('transitops_user');
    }
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const value = useMemo(
    () => ({ 
      token, 
      user,
      isReady, 
      login, 
      logout, 
      isAuthenticated: Boolean(token),
      role: user?.role || null
    }),
    [token, user, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
