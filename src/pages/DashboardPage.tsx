
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Book, Bell, Info, NewspaperIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';
import { CourseType } from '@/types/course';
import CourseCard from '@/components/courses/CourseCard';
import { mockCourses } from '@/services/mockData';

const DashboardPage = () => {
  const [myCourses, setMyCourses] = useState<CourseType[]>([]);
  const user = JSON.parse(localStorage.getItem('res4city-user') || '{}');

  useEffect(() => {
    // Load user's courses from localStorage
    const userProgress = JSON.parse(localStorage.getItem(`progress-${user.id}`) || '{}');
    const coursesWithProgress = mockCourses.slice(0, 3).map(course => ({
      ...course,
      progressPercent: userProgress[course.id] || 0
    }));
    setMyCourses(coursesWithProgress);

    analyticsService.trackPageView('dashboard');
  }, [user.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Continue your journey towards sustainable cities</p>
      </div>

      {/* My Courses Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <Link to="/" className="text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Res4City
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Learn about our mission for sustainable urban development</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NewspaperIcon className="h-5 w-5" />
              Latest Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Stay informed with our latest news and announcements</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Check your course notifications and reminders</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Access additional learning materials and guides</p>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-20 right-4">
        <Button 
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={() => console.log('Open chatbot')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
