
import { useState, useEffect } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const userSession = sessionStorage.getItem('user-session');
    if (userSession) {
      try {
        const { user: storedUser } = JSON.parse(userSession);
        setUser(storedUser);
      } catch (error) {
        console.error('Error parsing user session:', error);
        sessionStorage.removeItem('user-session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Session is already stored in AuthSystem component
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user-session');
    
    // Clear current chat session but preserve historical data
    const userSession = sessionStorage.getItem('user-session');
    if (userSession) {
      const { sessionId } = JSON.parse(userSession);
      const activeSession = localStorage.getItem(`chat-session-${sessionId}`);
      if (activeSession) {
        const session = JSON.parse(activeSession);
        session.endTime = new Date();
        localStorage.setItem(`chat-session-${sessionId}`, JSON.stringify(session));
      }
    }
  };

  const isAuthenticated = !!user;

  return { 
    user, 
    login, 
    logout, 
    isAuthenticated, 
    isLoading 
  };
};
