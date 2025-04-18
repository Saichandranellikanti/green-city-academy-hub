
import { v4 as uuidv4 } from 'uuid';

// Constants
const LOCAL_STORAGE_SESSION_KEY = 'res4city-session-id';
const EVENT_QUEUE_KEY = 'res4city-event-queue';

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
  | 'error';

type AnalyticsEvent = {
  sessionId: string;
  eventType: EventType;
  details: Record<string, any>;
  timestamp: number;
  url: string;
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
  
  // Attempt to send events immediately if online
  if (navigator.onLine) {
    const backendUrl = localStorage.getItem('res4city-backend-url');
    if (backendUrl) {
      sendEvents(backendUrl).catch(console.error);
    }
  }
};

// Track page view
const trackPageView = (pageName: string): void => {
  trackEvent('pageView', { pageName });
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
};
