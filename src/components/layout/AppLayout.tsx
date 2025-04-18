
import React, { useEffect } from 'react';
import TabBar from './TabBar';
import Chatbot from '../chatbot/Chatbot';
import { Outlet } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';

const AppLayout = () => {
  useEffect(() => {
    // Initialize analytics
    analyticsService.initAnalytics();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16">
        <Outlet />
      </main>
      <Chatbot />
      <TabBar />
    </div>
  );
};

export default AppLayout;
