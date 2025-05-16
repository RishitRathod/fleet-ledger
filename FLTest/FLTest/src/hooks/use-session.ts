import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface SessionUser {
  email: string;
  role: string;
  token: string;
  name?: string;
  profilePicture?: string;
}

export const useSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SessionUser | null>(null);

  // Initialize session from localStorage and handle protection
  useEffect(() => {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    // Check if session is expired
    if (sessionExpiry && new Date(sessionExpiry) < new Date()) {
      logout();
      return;
    }

    if (email && role && token) {
      setUser({ email, role, token });
    } else if (location.pathname !== '/' && location.pathname !== '/signup') {
      // If no session and trying to access protected route, redirect to login
      navigate('/', { replace: true });
    }
  }, [location.pathname]);

  const initializeSession = useCallback((userData: SessionUser) => {
    // Clear any existing session data
    localStorage.clear();

    // Set new session data with expiry (24 hours)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    localStorage.setItem('email', userData.email);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('sessionExpiry', expiry.toISOString());

    // Update state
    setUser(userData);

    // Navigate based on role
    if (userData.role === 'admin') {
      navigate('/dashboard');
    } else if (userData.role === 'user') {
      navigate('/user-dash');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    // Clear all session data
    localStorage.clear();
    setUser(null);
    
    // Redirect to login page and prevent going back
    navigate('/', { replace: true });
  }, [navigate]);

  return { 
    user,
    initializeSession,
    logout,
    isAuthenticated: !!user 
  };
};
