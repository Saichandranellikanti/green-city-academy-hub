
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseType } from '@/types/course';
import { mockCourses } from '@/services/mockData';
import ProgressBar from '@/components/courses/ProgressBar';
import { 
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading courses with a delay
    const loadCourses = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setCourses(mockCourses);
      setIsLoading(false);
    };
    
    loadCourses();
    analyticsService.trackPageView('progress');
    
    // Track time spent on progress page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analyticsService.trackTimeOnScreen('progress', timeSpent);
    };
  }, []);
  
  // Calculate overall progress and stats
  const completedCourses = courses.filter(course => course.progressPercent === 100).length;
  const inProgressCourses = courses.filter(course => course.progressPercent > 0 && course.progressPercent < 100).length;
  const notStartedCourses = courses.filter(course => course.progressPercent === 0).length;
  
  const overallProgress = courses.length > 0
    ? courses.reduce((sum, course) => sum + course.progressPercent, 0) / courses.length
    : 0;
  
  // Calculate total learning time (based on course duration, simplified)
  const totalLearningTime = courses.reduce((total, course) => {
    const durationMatch = course.duration.match(/(\d+)/);
    const weeks = durationMatch ? parseInt(durationMatch[0]) : 0;
    return total + (weeks * 3); // Assuming 3 hours per week
  }, 0);
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded-xl mt-4"></div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-20 bg-muted rounded-xl"></div>
            <div className="h-20 bg-muted rounded-xl"></div>
          </div>
          <div className="h-8 w-1/2 bg-muted rounded mt-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary/10 px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-primary" />
          My Learning Progress
        </h1>
        <p className="text-muted-foreground">
          Track your journey through sustainable city courses
        </p>
      </div>
      
      {/* Progress overview */}
      <div className="p-4">
        <div className="card-res4city mb-6">
          <h2 className="font-bold mb-2">Overall Progress</h2>
          <ProgressBar 
            value={overallProgress} 
            className="mb-4"
          />
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {completedCourses}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-amber-500">
                {inProgressCourses}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-muted-foreground">
                {notStartedCourses}
              </div>
              <div className="text-xs text-muted-foreground">Not Started</div>
            </div>
          </div>
        </div>
        
        {/* Learning stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card-res4city flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold">{totalLearningTime} hrs</p>
              <p className="text-xs text-muted-foreground">Learning Time</p>
            </div>
          </div>
          
          <div className="card-res4city flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold">720 pts</p>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </div>
        
        {/* Courses progress */}
        <h2 className="text-xl font-bold mb-4">Your Courses</h2>
        
        <div className="space-y-4">
          {courses.map(course => (
            <div 
              key={course.id}
              className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{course.title}</h3>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <ProgressBar 
                value={course.progressPercent} 
                size="sm"
                className="mb-2"
              />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  {course.progressPercent === 100 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-primary" />
                      <span>Completed</span>
                    </>
                  ) : course.progressPercent > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 mr-1 text-amber-500" />
                      <span>In Progress</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>Not Started</span>
                    </>
                  )}
                </div>
                
                <div>{course.lessonCount} lessons</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
