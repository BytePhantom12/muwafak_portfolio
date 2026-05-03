import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { authAPI } from '../services/api';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          await authAPI.getCurrentUser();
          setIsAuthenticated(true);
          sessionStorage.setItem('admin_authenticated', 'true');
        } catch (error) {
          // Token is invalid, clear it
          authAPI.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Update document title based on authentication status
    if (isAuthenticated) {
      document.title = 'Admin Dashboard - Muwafak Portfolio';
    } else {
      document.title = 'Admin Login - Muwafak Portfolio';
    }

    // Cleanup: restore original title when component unmounts
    return () => {
      document.title = 'Muwafak Abubakar - Data Analyst | Full Stack Developer';
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
