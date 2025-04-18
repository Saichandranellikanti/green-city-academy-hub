
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProgressBar from '@/components/courses/ProgressBar';
import { CourseType } from '@/types/course';
import { mockCourses } from '@/services/mockData';
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle, 
  Play,
  FileText
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading course data
    const loadCourse = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const foundCourse = mockCourses.find(c => c.id === courseId);
      setCourse(foundCourse || null);
      setIsLoading(false);
    };
    
    loadCourse();
    analyticsService.trackPageView(`course-detail-${courseId}`);
    
    // Track time spent on course detail page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analyticsService.trackTimeOnScreen(`course-detail-${courseId}`, timeSpent);
    };
  }, [courseId]);
  
  const handleStartCourse = () => {
    analyticsService.trackButtonClick('start-course', 'Start Course');
    // Navigate to first lesson
    if (course?.syllabus && course.syllabus.length > 0 && course.syllabus[0].lessons.length > 0) {
      navigate(`/lesson/${course.id}/${course.syllabus[0].lessons[0].id}`);
    } else {
      toast.error('No lessons available for this course');
    }
  };
  
  const handleContinueCourse = () => {
    analyticsService.trackButtonClick('continue-course', 'Continue Course');
    // Find the first incomplete lesson
    if (course?.syllabus) {
      for (const module of course.syllabus) {
        for (const lesson of module.lessons) {
          if (!lesson.isCompleted) {
            navigate(`/lesson/${course.id}/${lesson.id}`);
            return;
          }
        }
      }
      // If all lessons are complete
      toast.success('You have completed all lessons!');
    }
  };
  
  const handleLessonClick = (lessonId: string) => {
    analyticsService.trackButtonClick('lesson-click', `Lesson ${lessonId}`);
    navigate(`/lesson/${courseId}/${lessonId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-muted rounded"></div>
          <div className="h-8 w-3/4 bg-muted rounded"></div>
          <div className="h-52 bg-muted rounded-xl"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-10 w-full bg-muted rounded-xl mt-4"></div>
          <div className="space-y-2 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate total lessons and completed lessons
  let totalLessons = 0;
  let completedLessons = 0;
  
  if (course.syllabus) {
    course.syllabus.forEach(module => {
      totalLessons += module.lessons.length;
      completedLessons += module.lessons.filter(lesson => lesson.isCompleted).length;
    });
  }
  
  return (
    <div className="pb-20">
      {/* Course header */}
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="absolute top-4 left-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl font-bold mb-1 drop-shadow-md">{course.title}</h1>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.duration}</span>
              <span className="mx-2">•</span>
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{course.lessonCount} lessons</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="p-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Your Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedLessons}/{totalLessons} lessons completed
            </span>
          </div>
          <ProgressBar 
            value={completedLessons} 
            max={totalLessons}
            showLabel={false}
          />
        </div>
        
        {/* Course description */}
        <p className="text-muted-foreground mb-6">
          {course.description}
        </p>
        
        {/* Action button */}
        <Button 
          className="w-full btn-primary mb-8"
          onClick={course.progressPercent > 0 ? handleContinueCourse : handleStartCourse}
        >
          {course.progressPercent > 0 ? 'Continue Learning' : 'Start Course'}
        </Button>
        
        {/* Course syllabus */}
        <div>
          <h2 className="text-xl font-bold mb-4">Course Syllabus</h2>
          
          {course.syllabus ? (
            <Accordion type="single" collapsible className="w-full">
              {course.syllabus.map((module, index) => (
                <AccordionItem key={index} value={`module-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center text-left">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          module.isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted'
                        }`}
                      >
                        {module.isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {module.lessons.filter(l => l.isCompleted).length} / {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-2">
                      {module.lessons.map((lesson) => (
                        <div 
                          key={lesson.id} 
                          className={`p-3 rounded-lg cursor-pointer flex items-center ${
                            lesson.isCompleted ? 'bg-primary/10' : 'bg-secondary hover:bg-secondary/70'
                          } transition-colors`}
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="mr-3">
                            {lesson.videoUrl ? (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Play className="h-4 w-4 text-primary" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <FileText className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{lesson.title}</h4>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                          {lesson.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-6 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No syllabus available for this course</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
