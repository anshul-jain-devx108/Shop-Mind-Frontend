import { useState, useEffect } from 'react';
import type { Message } from '../types';

export interface ChatSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  metadata: {
    messageCount: number;
    userMessageCount: number;
    botMessageCount: number;
    productInteractions: number;
    searchQueries: string[];
    categories: string[];
    avgResponseTime?: number;
  };
}

export interface ChatAnalytics {
  totalSessions: number;
  totalMessages: number;
  averageSessionLength: number;
  popularSearchTerms: { term: string; count: number }[];
  popularCategories: { category: string; count: number }[];
  userEngagement: {
    averageMessagesPerSession: number;
    averageSessionDuration: number;
    productClickRate: number;
  };
}

export const useChatAnalytics = () => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null);

  // Initialize or restore current session
  useEffect(() => {
    const userSession = sessionStorage.getItem('user-session');
    if (userSession) {
      const { user, sessionId } = JSON.parse(userSession);
      
      // Check if there's an active session
      const activeSession = localStorage.getItem(`chat-session-${sessionId}`);
      if (activeSession) {
        const session = JSON.parse(activeSession);
        session.startTime = new Date(session.startTime);
        if (session.endTime) session.endTime = new Date(session.endTime);
        session.messages = session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setCurrentSession(session);
      } else {
        // Create new session
        const newSession: ChatSession = {
          sessionId,
          userId: user.email,
          startTime: new Date(),
          messages: [],
          metadata: {
            messageCount: 0,
            userMessageCount: 0,
            botMessageCount: 0,
            productInteractions: 0,
            searchQueries: [],
            categories: []
          }
        };
        setCurrentSession(newSession);
        saveSession(newSession);
      }
    }
  }, []);

  const saveSession = (session: ChatSession) => {
    localStorage.setItem(`chat-session-${session.sessionId}`, JSON.stringify(session));
    
    // Also update the sessions index
    const sessionsIndex = JSON.parse(localStorage.getItem('chat-sessions-index') || '[]');
    const existingIndex = sessionsIndex.findIndex((s: any) => s.sessionId === session.sessionId);
    
    const sessionSummary = {
      sessionId: session.sessionId,
      userId: session.userId,
      startTime: session.startTime,
      endTime: session.endTime,
      messageCount: session.metadata.messageCount
    };
    
    if (existingIndex >= 0) {
      sessionsIndex[existingIndex] = sessionSummary;
    } else {
      sessionsIndex.push(sessionSummary);
    }
    
    localStorage.setItem('chat-sessions-index', JSON.stringify(sessionsIndex));
  };

  const addMessage = (message: Message) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, message],
      metadata: {
        ...currentSession.metadata,
        messageCount: currentSession.metadata.messageCount + 1,
        userMessageCount: message.sender === 'user' 
          ? currentSession.metadata.userMessageCount + 1 
          : currentSession.metadata.userMessageCount,
        botMessageCount: message.sender === 'bot' 
          ? currentSession.metadata.botMessageCount + 1 
          : currentSession.metadata.botMessageCount,
        productInteractions: message.products 
          ? currentSession.metadata.productInteractions + message.products.length
          : currentSession.metadata.productInteractions,
        searchQueries: message.sender === 'user' 
          ? [...currentSession.metadata.searchQueries, message.content]
          : currentSession.metadata.searchQueries,
        categories: message.products 
          ? [...new Set([...currentSession.metadata.categories, ...message.products.map(p => p.category)])]
          : currentSession.metadata.categories
      }
    };

    setCurrentSession(updatedSession);
    saveSession(updatedSession);
  };

  const endSession = () => {
    if (!currentSession) return;

    const endedSession = {
      ...currentSession,
      endTime: new Date()
    };

    setCurrentSession(null);
    saveSession(endedSession);
  };

  const clearHistory = () => {
    if (currentSession) {
      // Clear current session messages but keep session active
      const clearedSession = {
        ...currentSession,
        messages: [],
        metadata: {
          messageCount: 0,
          userMessageCount: 0,
          botMessageCount: 0,
          productInteractions: 0,
          searchQueries: [],
          categories: []
        }
      };
      setCurrentSession(clearedSession);
      saveSession(clearedSession);
    }
  };

  const generateAnalytics = (): ChatAnalytics => {
    const sessionsIndex = JSON.parse(localStorage.getItem('chat-sessions-index') || '[]');
    const allSessions: ChatSession[] = [];

    // Load all sessions
    sessionsIndex.forEach((sessionSummary: any) => {
      const sessionData = localStorage.getItem(`chat-session-${sessionSummary.sessionId}`);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.startTime = new Date(session.startTime);
        if (session.endTime) session.endTime = new Date(session.endTime);
        allSessions.push(session);
      }
    });

    // Calculate analytics
    const totalSessions = allSessions.length;
    const totalMessages = allSessions.reduce((sum, session) => sum + session.metadata.messageCount, 0);
    
    const completedSessions = allSessions.filter(s => s.endTime);
    const averageSessionLength = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => {
          const duration = session.endTime!.getTime() - session.startTime.getTime();
          return sum + duration;
        }, 0) / completedSessions.length / 1000 / 60 // in minutes
      : 0;

    // Popular search terms
    const allSearchQueries = allSessions.flatMap(s => s.metadata.searchQueries);
    const searchTermCounts: { [key: string]: number } = {};
    allSearchQueries.forEach(query => {
      const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
      words.forEach(word => {
        searchTermCounts[word] = (searchTermCounts[word] || 0) + 1;
      });
    });
    
    const popularSearchTerms = Object.entries(searchTermCounts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Popular categories
    const allCategories = allSessions.flatMap(s => s.metadata.categories);
    const categoryCounts: { [key: string]: number } = {};
    allCategories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const popularCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // User engagement metrics
    const averageMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;
    const averageSessionDuration = averageSessionLength;
    const totalProductInteractions = allSessions.reduce((sum, session) => sum + session.metadata.productInteractions, 0);
    const productClickRate = totalMessages > 0 ? (totalProductInteractions / totalMessages) * 100 : 0;

    return {
      totalSessions,
      totalMessages,
      averageSessionLength,
      popularSearchTerms,
      popularCategories,
      userEngagement: {
        averageMessagesPerSession,
        averageSessionDuration,
        productClickRate
      }
    };
  };

  const getAnalytics = () => {
    const calculatedAnalytics = generateAnalytics();
    setAnalytics(calculatedAnalytics);
    return calculatedAnalytics;
  };

  const exportChatData = () => {
    const sessionsIndex = JSON.parse(localStorage.getItem('chat-sessions-index') || '[]');
    const allSessions: ChatSession[] = [];

    sessionsIndex.forEach((sessionSummary: any) => {
      const sessionData = localStorage.getItem(`chat-session-${sessionSummary.sessionId}`);
      if (sessionData) {
        allSessions.push(JSON.parse(sessionData));
      }
    });

    const exportData = {
      exportDate: new Date(),
      analytics: generateAnalytics(),
      sessions: allSessions
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopmind-chat-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return {
    currentSession,
    messages: currentSession?.messages || [],
    addMessage,
    endSession,
    clearHistory,
    getAnalytics,
    analytics,
    exportChatData
  };
};
