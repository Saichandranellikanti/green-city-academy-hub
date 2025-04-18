
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Book, 
  Bell, 
  Info, 
  NewspaperIcon, 
  Leaf, 
  TreeDeciduous, 
  Building, 
  PanelRight,
  ChevronRight,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';
import { CourseType } from '@/types/course';
import CourseCard from '@/components/courses/CourseCard';
import { mockCourses } from '@/services/mockData';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const DashboardPage = () => {
  const [myCourses, setMyCourses] = useState<CourseType[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<CourseType[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const user = JSON.parse(localStorage.getItem('res4city-user') || '{}');
  
  useEffect(() => {
    // Load user's courses from localStorage
    const userProgress = JSON.parse(localStorage.getItem(`progress-${user.id}`) || '{}');
    const coursesWithProgress = mockCourses.slice(0, 3).map(course => ({
      ...course,
      progressPercent: userProgress[course.id] || 0
    }));
    setMyCourses(coursesWithProgress);
    
    // Get course recommendations
    const recommended = analyticsService.getCourseRecommendations(mockCourses, 3)
      .map(course => ({
        ...course,
        progressPercent: userProgress[course.id] || 0
      }));
    setRecommendedCourses(recommended);

    analyticsService.trackPageView('dashboard');
  }, [user.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Continue your journey towards sustainable cities</p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <Button 
            variant="outline" 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <PanelRight className="h-4 w-4" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
        </div>
      </div>
      
      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="mb-8 animate-fade-in">
          <AnalyticsDashboard />
        </div>
      )}

      {/* My Courses Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <Link to="/courses" className="text-primary hover:underline flex items-center">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
      
      {/* Recommended Courses */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recommended for You</h2>
          <Link to="/courses" className="text-primary hover:underline flex items-center">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Quick Access Tabs */}
      <Tabs defaultValue="info" className="mb-8">
        <TabsList className="grid grid-cols-4 h-auto">
          <TabsTrigger value="info">About</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About Res4City
              </CardTitle>
              <CardDescription>
                Our mission for sustainable urban development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Res4City is a leading platform for education on sustainable urban development, 
                offering courses designed to help professionals and enthusiasts build greener, 
                more resilient cities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-xl">
                  <TreeDeciduous className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-medium">Sustainability</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Courses on renewable energy and sustainable resources
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-xl">
                  <Building className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-medium">Urban Planning</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Smart city design and infrastructure development
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-xl">
                  <Leaf className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-medium">Green Innovation</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Cutting-edge technologies for environmental protection
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More About Our Mission</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="news" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NewspaperIcon className="h-5 w-5 text-primary" />
                Latest Updates
              </CardTitle>
              <CardDescription>
                Stay informed with our latest news and announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium">New Course: Smart Water Management Systems</h3>
                  <p className="text-sm text-muted-foreground mb-2">Posted on April 12, 2025</p>
                  <p>
                    Our newest course on Smart Water Management Systems is now available. 
                    Learn how technology is helping cities conserve water and manage resources more efficiently.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium">Webinar: The Future of Urban Mobility</h3>
                  <p className="text-sm text-muted-foreground mb-2">Posted on April 5, 2025</p>
                  <p>
                    Join us for a live webinar on April 20th where experts will discuss 
                    the latest trends in sustainable urban transportation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Case Study: Green Roof Implementation in Major Cities</h3>
                  <p className="text-sm text-muted-foreground mb-2">Posted on March 28, 2025</p>
                  <p>
                    Read our latest case study on how major cities are implementing green roof 
                    policies to combat urban heat islands and improve energy efficiency.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All News</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Learning Resources
              </CardTitle>
              <CardDescription>
                Access additional learning materials and guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-xl p-4 hover:border-primary/50 transition-colors">
                  <h3 className="font-medium mb-2">Green Building Design Guide</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive guide to sustainable architecture and construction practices.
                  </p>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>
                
                <div className="border rounded-xl p-4 hover:border-primary/50 transition-colors">
                  <h3 className="font-medium mb-2">Sustainable Urban Planning Toolkit</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Templates and checklists for implementing green city initiatives.
                  </p>
                  <Button variant="outline" size="sm">Access Toolkit</Button>
                </div>
                
                <div className="border rounded-xl p-4 hover:border-primary/50 transition-colors">
                  <h3 className="font-medium mb-2">Renewable Energy Implementation Guide</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Step-by-step guide to implementing renewable energy solutions in urban areas.
                  </p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </div>
                
                <div className="border rounded-xl p-4 hover:border-primary/50 transition-colors">
                  <h3 className="font-medium mb-2">Urban Biodiversity Assessment Tools</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tools and methodologies for assessing and enhancing urban biodiversity.
                  </p>
                  <Button variant="outline" size="sm">Explore Tools</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse Resource Library</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="offers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Special Offers
              </CardTitle>
              <CardDescription>
                Exclusive deals and promotions for our members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">Early Bird Discount</h3>
                      <p className="text-muted-foreground mb-2">Valid until April 30, 2025</p>
                      <p className="mb-4">
                        Get 20% off all new courses when you enroll within the first week of launch.
                      </p>
                      <Button>Claim Offer</Button>
                    </div>
                    <div className="bg-primary/20 text-primary font-bold text-xl p-3 rounded-full">
                      20% OFF
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">Bundle Discount</h3>
                      <p className="text-muted-foreground mb-2">Ongoing offer</p>
                      <p className="mb-4">
                        Enroll in three or more courses and receive 15% off your total purchase.
                      </p>
                      <Button>View Bundles</Button>
                    </div>
                    <div className="bg-blue-500/20 text-blue-500 font-bold text-xl p-3 rounded-full">
                      BUNDLE
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Offers</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* City Sustainability Visualizations */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Sustainability Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TreeDeciduous className="h-5 w-5 text-primary" />
                Carbon Reduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-primary" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="75.36"
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold">70%</span>
                      <span className="text-xs block">reduction</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Reduction in carbon emissions through green building practices
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Water Conservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-blue-500" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="100.48"
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold">60%</span>
                      <span className="text-xs block">saved</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Water saved through efficient urban water management systems
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-amber-500" />
                Green Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-amber-500" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="125.6"
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold">50%</span>
                      <span className="text-xs block">increase</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Increase in urban green spaces through smart city planning
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
