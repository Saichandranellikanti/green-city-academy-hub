
import React, { useEffect, useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { mockLeaderboard, regionRankings } from '@/services/mockData';
import { Award, TrendingUp, MapPin, Users } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';

const LeaderboardPage = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get current user from local storage
    const userStr = localStorage.getItem('res4city-user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    analyticsService.trackPageView('leaderboard');
    
    // Track time spent on leaderboard page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analyticsService.trackTimeOnScreen('leaderboard', timeSpent);
    };
  }, []);
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary/10 px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Award className="h-6 w-6 mr-2 text-primary" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See how you rank among other learners
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="px-4 py-6 grid grid-cols-2 gap-4">
        <div className="card-res4city flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xl font-bold">6,000+</span>
          <span className="text-sm text-muted-foreground">Active Learners</span>
        </div>
        
        <div className="card-res4city flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xl font-bold">120+</span>
          <span className="text-sm text-muted-foreground">Countries</span>
        </div>
      </div>
      
      {/* Leaderboard tabs */}
      <div className="px-4">
        <Tabs defaultValue="global">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="global">Global Rankings</TabsTrigger>
            <TabsTrigger value="regions">By Region</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="mt-2">
            <LeaderboardTable 
              entries={mockLeaderboard} 
              highlightUserId={currentUserId || undefined}
            />
          </TabsContent>
          
          <TabsContent value="regions" className="mt-2">
            <div className="space-y-4">
              {regionRankings.map((region, index) => (
                <div key={index} className="card-res4city">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{region.region}</h3>
                    <div className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                      Rank #{index + 1}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-secondary rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Learners</p>
                      <p className="text-lg font-bold">{region.participants.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-secondary rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Courses</p>
                      <p className="text-lg font-bold">{region.completedCourses.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-secondary rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Avg. Points</p>
                      <p className="text-lg font-bold">{region.avgPoints}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>
                      {index % 3 === 0 ? '12% increase' : index % 3 === 1 ? '8% increase' : '5% increase'} in the last month
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeaderboardPage;
