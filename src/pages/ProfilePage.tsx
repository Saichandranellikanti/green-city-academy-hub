
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  User,
  Settings,
  LogOut,
  Bell,
  Download,
  HelpCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';

type UserData = {
  name: string;
  email: string;
  id: string;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [backendUrl, setBackendUrl] = useState<string>('');
  
  useEffect(() => {
    // Get user from local storage
    const userStr = localStorage.getItem('res4city-user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    
    // Get backend URL if configured
    const savedBackendUrl = localStorage.getItem('res4city-backend-url');
    if (savedBackendUrl) {
      setBackendUrl(savedBackendUrl);
    }
    
    analyticsService.trackPageView('profile');
    
    // Track time spent on profile page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      analyticsService.trackTimeOnScreen('profile', timeSpent);
    };
  }, [navigate]);
  
  const handleLogout = () => {
    analyticsService.trackButtonClick('logout', 'Logout');
    localStorage.removeItem('res4city-user');
    toast.success('Successfully logged out');
    navigate('/login');
  };
  
  const handleBackendUrlSave = () => {
    if (backendUrl) {
      localStorage.setItem('res4city-backend-url', backendUrl);
      analyticsService.configureBackendUrl(backendUrl);
      toast.success('Analytics endpoint configured successfully');
    } else {
      toast.error('Please enter a valid URL');
    }
  };
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary/10 px-4 pt-6 pb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Profile sections */}
      <div className="p-4">
        {/* Account section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Account</h2>
          
          <div className="space-y-2">
            <div className="p-4 flex items-center justify-between border rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span>Edit Profile</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="p-4 flex items-center justify-between border rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <span>Notifications</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="p-4 flex items-center justify-between border rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <span>Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        {/* Downloads section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Downloads</h2>
          
          <div className="p-4 flex items-center justify-between border rounded-xl">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="block">Offline Content</span>
                <span className="text-xs text-muted-foreground">2 courses available offline</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        {/* Help section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Help & Support</h2>
          
          <div className="space-y-2">
            <div className="p-4 flex items-center justify-between border rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <span>FAQ</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="p-4 flex items-center justify-between border rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span>Terms & Privacy</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        {/* Developer settings */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Developer Settings</h2>
          
          <div className="p-4 border rounded-xl">
            <label className="block text-sm font-medium mb-2">
              Analytics Endpoint URL
            </label>
            <input
              type="text"
              className="input-res4city w-full mb-3"
              placeholder="https://your-endpoint.example.com"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleBackendUrlSave}
            >
              Save Endpoint
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Enter the URL where analytics events will be sent
            </p>
          </div>
        </div>
        
        {/* Logout button */}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
