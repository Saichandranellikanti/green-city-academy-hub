
import React, { useEffect } from 'react';
import TabBar from './TabBar';
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
      <TabBar />
    </div>
  );
};

export default AppLayout;
