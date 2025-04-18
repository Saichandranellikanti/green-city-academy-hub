
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  UserRoundCog, 
  Calendar, 
  Users, 
  TrendingUp, 
  LineChart, 
  Download,
  Mail
} from 'lucide-react';

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Last 30 days
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
                <CardDescription>Active learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">1,248</div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <TrendingUp className="mr-1 h-4 w-4" /> +8.2%
                  </div>
                </div>
                <Progress value={82} className="h-1 mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Course Completions</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">342</div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <TrendingUp className="mr-1 h-4 w-4" /> +12.5%
                  </div>
                </div>
                <Progress value={68} className="h-1 mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Avg. Engagement</CardTitle>
                <CardDescription>Time per session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">24m 18s</div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <TrendingUp className="mr-1 h-4 w-4" /> +3.7%
                  </div>
                </div>
                <Progress value={74} className="h-1 mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Retention Rate</CardTitle>
                <CardDescription>30-day return</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="flex items-center text-red-500 text-sm font-medium">
                    <TrendingUp className="mr-1 h-4 w-4 rotate-180" /> -2.1%
                  </div>
                </div>
                <Progress value={78} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Course Popularity</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Top courses by enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {[78, 63, 52, 48, 42, 36, 28].map((value, i) => (
                    <div key={i} className="relative w-full">
                      <div 
                        className="bg-primary/90 rounded-t w-full" 
                        style={{ height: `${value * 2}px` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <div>Green Energy</div>
                  <div>Urban Planning</div>
                  <div>Sustainability</div>
                  <div>Smart Cities</div>
                  <div>Water Mgmt</div>
                  <div>Waste Systems</div>
                  <div>Green Tech</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">User Retention</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Week by week retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Week 1</div>
                      <div className="font-medium">98%</div>
                    </div>
                    <Progress value={98} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Week 2</div>
                      <div className="font-medium">86%</div>
                    </div>
                    <Progress value={86} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Week 3</div>
                      <div className="font-medium">74%</div>
                    </div>
                    <Progress value={74} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Week 4</div>
                      <div className="font-medium">65%</div>
                    </div>
                    <Progress value={65} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>
                Detailed metrics about user engagement with course content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                Detailed engagement charts would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>
                Regional distribution and user profile data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                User demographic visualizations would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Course Dropout Prevention</CardTitle>
              <UserRoundCog className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>
              ML-powered interventions for at-risk learners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Green Building Techniques</p>
                  <p className="text-sm text-muted-foreground">5 users at risk</p>
                </div>
                <Button size="sm" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Send Reminder
                </Button>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Sustainable Transportation</p>
                  <p className="text-sm text-muted-foreground">3 users at risk</p>
                </div>
                <Button size="sm" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Send Reminder
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Urban Wildlife Conservation</p>
                  <p className="text-sm text-muted-foreground">7 users at risk</p>
                </div>
                <Button size="sm" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Send Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">User Feedback Summary</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>
              Aggregated sentiment analysis from reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Content Quality</div>
                  <div className="text-sm">4.8/5</div>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Instructor Clarity</div>
                  <div className="text-sm">4.6/5</div>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Course Materials</div>
                  <div className="text-sm">4.7/5</div>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">UI/UX Experience</div>
                  <div className="text-sm">4.5/5</div>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
