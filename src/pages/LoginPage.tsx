
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { analyticsService } from '@/services/analyticsService';

const LoginPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('res4city-user');
    if (user) {
      navigate('/');
    }
    
    analyticsService.trackPageView('login');
    
    // Track time spent on login page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analyticsService.trackTimeOnScreen('login', timeSpent);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-city-50 to-white">
      <AuthForm mode="login" />
    </div>
  );
};

export default LoginPage;
