
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyticsService } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const sampleQA: { question: string; answer: string }[] = [
  {
    question: "What is Res4City?",
    answer: "Res4City is a platform focused on sustainable urban development. We offer micro-credentials and courses to help you learn about green city initiatives, urban planning, and sustainable development."
  },
  {
    question: "How do I track my course progress?",
    answer: "You can track your course progress by going to the Progress tab in the navigation bar. It shows all your enrolled courses and their completion percentages."
  },
  {
    question: "Can I download course materials for offline viewing?",
    answer: "Yes, all course videos and PDFs are available for offline viewing. When viewing a course, look for the download button next to each resource."
  },
  {
    question: "How does the leaderboard work?",
    answer: "The leaderboard ranks users based on course completion and participation. You earn points for completing lessons, watching videos, and interacting with course materials."
  },
  {
    question: "How do I earn certificates?",
    answer: "Certificates are awarded upon successful completion of each course. You need to complete all lessons and pass the final assessment to receive your certificate."
  }
];

const ChatbotMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div 
      className={cn(
        "mb-3 max-w-[80%] rounded-xl p-3", 
        message.sender === 'user' 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-secondary text-secondary-foreground"
      )}
    >
      <p>{message.content}</p>
      <div className="text-xs opacity-70 mt-1 text-right">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hello! I'm your Res4City assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggleChatbot = () => {
    setIsOpen(!isOpen);
    analyticsService.trackButtonClick('chatbot-toggle', isOpen ? 'close' : 'open');
    console.log(isOpen ? 'Close chatbot' : 'Open chatbot');
  };

  const findAnswer = (question: string): string => {
    // Simple matching algorithm - in a real app, you'd use NLP or integrate with an AI API
    const lowerQuestion = question.toLowerCase();
    
    for (const qa of sampleQA) {
      if (qa.question.toLowerCase().includes(lowerQuestion) || 
          lowerQuestion.includes(qa.question.toLowerCase().split(" ").filter(word => word.length > 3).join(" "))) {
        return qa.answer;
      }
    }
    
    // If no matching answer is found
    return "I don't have information about that yet. Please contact our support team for more assistance.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Track the message
    analyticsService.trackEvent('chatbotMessage', { message: input });
    
    // Simulate bot response (with a slight delay for realism)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: findAnswer(input),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button 
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={handleToggleChatbot}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-50 w-80 sm:w-96 animate-scale-in">
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="bg-primary/10 py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Res4City Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 h-[350px]">
              <ScrollArea className="h-full pr-4">
                {messages.map(message => (
                  <ChatbotMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Chatbot;
