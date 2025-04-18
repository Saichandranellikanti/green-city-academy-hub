import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/sonner';

// Constants
const LOCAL_STORAGE_SESSION_KEY = 'res4city-session-id';
const EVENT_QUEUE_KEY = 'res4city-event-queue';
const USER_PREFERENCES_KEY = 'res4city-user-preferences';
const USER_INTERACTIONS_KEY = 'res4city-user-interactions';
const LAST_ACTIVITY_KEY = 'res4city-last-activity';

// Types
type EventType = 
  | 'pageView'
  | 'buttonClick'
  | 'videoPlay'
  | 'videoPause'
  | 'videoProgress'
  | 'pdfView'
  | 'pdfScroll'
  | 'lessonComplete'
  | 'courseComplete'
  | 'login'
  | 'signup'
  | 'timeOnScreen'
  | 'chatbotMessage'
  | 'error';

type AnalyticsEvent = {
  sessionId: string;
  eventType: EventType;
  details: Record<string, any>;
  timestamp: number;
  url: string;
};

type UserInteraction = {
  courseId: string;
  views: number;
  timeSpent: number;
  lastAccessed: number;
  progress: number;
};

// Get or create a session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

// Get the event queue from local storage
const getEventQueue = (): AnalyticsEvent[] => {
  const queue = localStorage.getItem(EVENT_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
};

// Save the event queue to local storage
const saveEventQueue = (queue: AnalyticsEvent[]): void => {
  localStorage.setItem(EVENT_QUEUE_KEY, JSON.stringify(queue));
};

// Add an event to the queue
const queueEvent = (event: AnalyticsEvent): void => {
  const queue = getEventQueue();
  queue.push(event);
  saveEventQueue(queue);
};

// Send events to the backend
const sendEvents = async (backendUrl?: string): Promise<boolean> => {
  if (!backendUrl) {
    return false;
  }
  
  const queue = getEventQueue();
  
  if (queue.length === 0) {
    return true;
  }
  
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: queue }),
    });
    
    if (response.ok) {
      // Clear the queue on successful send
      saveEventQueue([]);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to send analytics events:', error);
    return false;
  }
};

// Track an event
const trackEvent = (
  eventType: EventType,
  details: Record<string, any> = {}
): void => {
  const sessionId = getSessionId();
  const timestamp = Date.now();
  const url = window.location.href;
  
  const event: AnalyticsEvent = {
    sessionId,
    eventType,
    details,
    timestamp,
    url,
  };
  
  queueEvent(event);
  
  // Update last activity time
  localStorage.setItem(LAST_ACTIVITY_KEY, timestamp.toString());
  
  // If this is a course interaction, update the user interaction data
  if (details.courseId && ['pageView', 'videoPlay', 'pdfView', 'lessonComplete'].includes(eventType)) {
    updateCourseInteraction(details.courseId, eventType, details);
  }
  
  // Attempt to send events immediately if online
  if (navigator.onLine) {
    const backendUrl = localStorage.getItem('res4city-backend-url');
    if (backendUrl) {
      sendEvents(backendUrl).catch(console.error);
    }
  }
};

// Update course interaction data for ML recommendations
const updateCourseInteraction = (courseId: string, eventType: EventType, details: Record<string, any>) => {
  const interactionsJson = localStorage.getItem(USER_INTERACTIONS_KEY) || '{}';
  const interactions: Record<string, UserInteraction> = JSON.parse(interactionsJson);
  
  // Get or create interaction for this course
  const interaction = interactions[courseId] || {
    courseId,
    views: 0,
    timeSpent: 0,
    lastAccessed: Date.now(),
    progress: 0
  };
  
  // Update based on event type
  switch (eventType) {
    case 'pageView':
      interaction.views += 1;
      interaction.lastAccessed = Date.now();
      break;
    case 'videoPlay':
    case 'pdfView':
      interaction.lastAccessed = Date.now();
      break;
    case 'timeOnScreen':
      if (details.timeInSeconds > 0) {
        interaction.timeSpent += details.timeInSeconds;
      }
      break;
    case 'lessonComplete':
      // Update progress (would need more detailed logic based on your app structure)
      const userProgress = JSON.parse(localStorage.getItem(`progress-${getUserId()}`) || '{}');
      interaction.progress = userProgress[courseId] || 0;
      break;
  }
  
  // Save updated interaction data
  interactions[courseId] = interaction;
  localStorage.setItem(USER_INTERACTIONS_KEY, JSON.stringify(interactions));
};

// Get user ID from stored user data
const getUserId = (): string => {
  const user = JSON.parse(localStorage.getItem('res4city-user') || '{}');
  return user.id || '';
};

// Get course recommendations based on user behavior
const getCourseRecommendations = (availableCourses: any[], count: number = 3): any[] => {
  const interactionsJson = localStorage.getItem(USER_INTERACTIONS_KEY) || '{}';
  const interactions: Record<string, UserInteraction> = JSON.parse(interactionsJson);
  
  if (Object.keys(interactions).length === 0 || !availableCourses.length) {
    // If no interaction data, return random courses
    return availableCourses
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }
  
  // Get user's preferences based on interactions
  const preferences: Record<string, number> = {};
  
  // Get categories/tags from interacted courses
  availableCourses.forEach(course => {
    if (interactions[course.id]) {
      const score = calculateInteractionScore(interactions[course.id]);
      
      // Collect tags/categories and assign scores
      if (course.tags) {
        course.tags.forEach((tag: string) => {
          preferences[tag] = (preferences[tag] || 0) + score;
        });
      }
      if (course.category) {
        preferences[course.category] = (preferences[course.category] || 0) + score;
      }
    }
  });
  
  // Calculate relevance score for each course
  const scoredCourses = availableCourses
    .filter(course => !interactions[course.id] || interactions[course.id].progress < 100) // Filter completed courses
    .map(course => {
      let relevanceScore = 0;
      
      // Calculate score based on tags/categories match
      if (course.tags) {
        course.tags.forEach((tag: string) => {
          relevanceScore += preferences[tag] || 0;
        });
      }
      if (course.category) {
        relevanceScore += preferences[course.category] || 0;
      }
      
      return { ...course, relevanceScore };
    });
  
  // Sort by relevance and return top courses
  return scoredCourses
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, count);
};

// Calculate interaction score based on user behavior
const calculateInteractionScore = (interaction: UserInteraction): number => {
  // Simple score calculation - could be more sophisticated
  let score = 0;
  
  score += interaction.views * 0.1;
  score += interaction.timeSpent * 0.01;
  score += interaction.progress;
  
  // Recency factor - interactions in the last 7 days get boosted
  const daysSinceLastAccess = (Date.now() - interaction.lastAccessed) / (1000 * 60 * 60 * 24);
  if (daysSinceLastAccess < 7) {
    score *= 1.5;
  }
  
  return score;
};

// Check for inactive users and send notifications
const checkInactiveUsers = (): void => {
  const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
  const userId = getUserId();
  
  if (!userId || !lastActivity) return;
  
  const daysSinceLastActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
  
  // If user has been inactive for 3+ days
  if (daysSinceLastActivity >= 3) {
    // Get course with highest progress but not completed
    const userProgress = JSON.parse(localStorage.getItem(`progress-${userId}`) || '{}');
    let highestProgressCourse: string | null = null;
    let highestProgress = 0;
    
    Object.entries(userProgress).forEach(([courseId, progress]) => {
      const numProgress = Number(progress);
      if (numProgress > highestProgress && numProgress < 100) {
        highestProgress = numProgress;
        highestProgressCourse = courseId;
      }
    });
    
    if (highestProgressCourse) {
      // Send notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Continue your learning journey!', {
          body: `You're ${highestProgress}% through your course. Just a bit more to go!`,
          icon: '/favicon.ico'
        });
      }
      
      // Show in-app toast
      toast('Continue your learning journey!', {
        description: `You're ${highestProgress}% through your course. Just a bit more to go!`,
        action: {
          label: 'Resume',
          onClick: () => {
            window.location.href = `/course/${highestProgressCourse}`;
          }
        }
      });
      
      // Track this notification event
      trackEvent('notification', { 
        type: 'inactivity', 
        courseId: highestProgressCourse,
        daysSinceLastActivity 
      });
      
      // Update last activity to prevent repeated notifications
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }
};

// Track page view
const trackPageView = (pageName: string): void => {
  trackEvent('pageView', { pageName });
  
  // Check for inactivity whenever user views a page
  checkInactiveUsers();
};

// Track button click
const trackButtonClick = (buttonId: string, buttonText: string): void => {
  trackEvent('buttonClick', { buttonId, buttonText });
};

// Track video events
const trackVideoPlay = (videoId: string, currentTime: number): void => {
  trackEvent('videoPlay', { videoId, currentTime });
};

const trackVideoPause = (videoId: string, currentTime: number): void => {
  trackEvent('videoPause', { videoId, currentTime });
};

const trackVideoProgress = (videoId: string, currentTime: number, duration: number): void => {
  trackEvent('videoProgress', { videoId, currentTime, duration, percent: Math.round((currentTime / duration) * 100) });
};

// Track PDF events
const trackPdfView = (pdfId: string, pageNumber: number): void => {
  trackEvent('pdfView', { pdfId, pageNumber });
};

const trackPdfScroll = (pdfId: string, pageNumber: number, scrollPercent: number): void => {
  trackEvent('pdfScroll', { pdfId, pageNumber, scrollPercent });
};

// Track lesson completion
const trackLessonComplete = (lessonId: string, courseId: string): void => {
  trackEvent('lessonComplete', { lessonId, courseId });
};

// Track course completion
const trackCourseComplete = (courseId: string): void => {
  trackEvent('courseComplete', { courseId });
};

// Track time on screen
const trackTimeOnScreen = (screenName: string, timeInSeconds: number): void => {
  trackEvent('timeOnScreen', { screenName, timeInSeconds });
};

// Configure the backend URL
const configureBackendUrl = (url: string): void => {
  localStorage.setItem('res4city-backend-url', url);
};

// Initialize analytics and set up listeners
const initAnalytics = (): void => {
  // Set up online/offline listeners to sync events when connection is restored
  window.addEventListener('online', () => {
    const backendUrl = localStorage.getItem('res4city-backend-url');
    if (backendUrl) {
      sendEvents(backendUrl).catch(console.error);
    }
  });
  
  // Set up beforeunload to track session end
  window.addEventListener('beforeunload', () => {
    trackEvent('timeOnScreen', { 
      screenName: document.title || window.location.pathname,
      timeInSeconds: -1, // Special value to indicate end of session
    });
  });
  
  // Request notification permission
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    setTimeout(() => {
      toast('Enable notifications', {
        description: 'Get reminders about your courses and new content',
        action: {
          label: 'Allow',
          onClick: () => {
            Notification.requestPermission();
          }
        },
        duration: 10000
      });
    }, 3000);
  }
  
  // Check for inactive users on startup
  checkInactiveUsers();
};

export const analyticsService = {
  trackPageView,
  trackButtonClick,
  trackVideoPlay,
  trackVideoPause,
  trackVideoProgress,
  trackPdfView,
  trackPdfScroll,
  trackLessonComplete,
  trackCourseComplete,
  trackTimeOnScreen,
  configureBackendUrl,
  initAnalytics,
  getCourseRecommendations,
};
