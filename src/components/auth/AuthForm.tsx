import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Leaf } from 'lucide-react';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        // Special case for admin login
        if (email === 'Admin@gmail.com' && password === 'Admin1234') {
          const adminUser = {
            id: 'Admin',
            email: 'Admin@gmail.com',
            name: 'Admin',
            role: 'admin'
          };
          
          localStorage.setItem('res4city-user', JSON.stringify(adminUser));
          toast.success('Admin logged in successfully!');
          navigate('/dashboard');
          return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('res4city-users') || '[]');
        const user = users.find((u: any) => u.email === email);
        
        if (!user) {
          toast.error('User not found');
          return;
        }
        
        if (user.password !== password) {
          toast.error('Invalid password');
          return;
        }
        
        toast.success('Successfully logged in!');
        localStorage.setItem('res4city-user', JSON.stringify(user));
      } else {
        // Sign up
        const users = JSON.parse(localStorage.getItem('res4city-users') || '[]');
        
        if (users.some((u: any) => u.email === email)) {
          toast.error('Email already registered');
          return;
        }
        
        const newUser = {
          id: 'user-' + Date.now(),
          email,
          password,
          name: name || email.split('@')[0],
        };
        
        users.push(newUser);
        localStorage.setItem('res4city-users', JSON.stringify(users));
        localStorage.setItem('res4city-user', JSON.stringify(newUser));
        toast.success('Account created successfully!');
      }
      
      // Initialize user progress
      const userId = 'user-' + Date.now();
      if (!localStorage.getItem(`progress-${userId}`)) {
        localStorage.setItem(`progress-${userId}`, '{}');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(mode === 'login' ? 'Login failed' : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 card-res4city">
      <div className="text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {mode === 'login' 
            ? 'Sign in to access your learning journey' 
            : 'Join Res4City and start learning about green cities'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="input-res4city"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="input-res4city"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="input-res4city"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <a 
              href="/signup" 
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
