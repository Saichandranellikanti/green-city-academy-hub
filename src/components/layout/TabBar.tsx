
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TabBar = () => {
  const location = useLocation();
  
  const tabs = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Progress',
      path: '/progress',
      icon: BookOpen
    },
    {
      name: 'Leaderboard',
      path: '/leaderboard',
      icon: Award
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
                          (tab.path !== '/' && location.pathname.startsWith(tab.path));
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-6 w-6", isActive ? "animate-bounce-in" : "")} />
              <span className="text-xs mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
