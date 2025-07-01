
import { useState, useEffect } from 'react';

const SUPER_ADMIN_EMAIL = 'brian@goodbusinesshq.com';
const SUPER_ADMIN_PASSWORD = 'N0vember!';

export const useSuperAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('superAdminAuth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('superAdminAuth', 'authenticated');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('superAdminAuth');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
