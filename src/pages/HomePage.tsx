
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from '@/components/courses/CourseCard';
import ProgressBar from '@/components/courses/ProgressBar';
import { CourseType } from '@/types/course';
import { mockCourses } from '@/services/mockData';
import { Leaf, Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { analyticsService } from '@/services/analyticsService';

const HomePage = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading courses with a delay
    const loadCourses = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses(mockCourses);
      setIsLoading(false);
    };
    
    loadCourses();
    analyticsService.trackPageView('home');
    
    // Track time spent on home page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analyticsService.trackTimeOnScreen('home', timeSpent);
    };
  }, []);
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Compute overall progress
  const overallProgress = courses.length > 0
    ? courses.reduce((sum, course) => sum + course.progressPercent, 0) / courses.length
    : 0;
  
  // Ongoing courses (has some progress but not complete)
  const ongoingCourses = courses.filter(
    course => course.progressPercent > 0 && course.progressPercent < 100
  );
  
  // Get 3 recommended courses (prioritize those with 0 progress)
  const recommendedCourses = courses
    .filter(course => course.progressPercent === 0)
    .slice(0, 3);
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary/10 px-4 pt-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold">Res4City</h1>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Continue your journey to sustainable cities</p>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="input-res4city pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-res4city animate-pulse bg-muted/50">
                <div className="h-48 rounded-xl bg-muted mb-4"></div>
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded mt-2"></div>
                <div className="h-4 w-full bg-muted rounded mt-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            {filteredCourses.length > 0 ? (
              <div className="space-y-4">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No courses found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Overall progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Your Progress</h2>
                <span className="text-sm text-muted-foreground">
                  {Math.round(overallProgress)}% Complete
                </span>
              </div>
              <ProgressBar value={overallProgress} />
            </div>
            
            {/* Continuing learning section */}
            {ongoingCourses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
                <div className="space-y-4">
                  {ongoingCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}
          
            {/* Course tabs */}
            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-2">
                {courses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </TabsContent>
              
              <TabsContent value="recommended" className="space-y-4 mt-2">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      No recommendations yet. Start exploring courses!
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-4 mt-2">
                {courses
                  .slice()
                  .sort((a, b) => b.lessonCount - a.lessonCount)
                  .slice(0, 3)
                  .map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
