
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import type { Message } from '../types';
import type { ChatSession, ChatAnalytics } from './useChatAnalytics';

// API-connected version of useChatAnalytics hook
export const useApiChatAnalytics = () => {
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  // Get current user session info
  const getCurrentSessionInfo = () => {
    const userSession = sessionStorage.getItem('user-session');
    if (userSession) {
      try {
        return JSON.parse(userSession);
      } catch (error) {
        console.error('Error parsing user session:', error);
        return null;
      }
    }
    return null;
  };

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: (userId: string) => chatService.createSession({ userId }),
    onSuccess: (response, userId) => {
      const newSession: ChatSession = {
        sessionId: response.sessionId,
        userId,
        startTime: new Date(response.startTime),
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
      
      // Update session storage with new session ID
      const sessionInfo = getCurrentSessionInfo();
      if (sessionInfo) {
        sessionStorage.setItem('user-session', JSON.stringify({
          ...sessionInfo,
          sessionId: response.sessionId
        }));
      }
    },
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: Message }) =>
      chatService.addMessage({ sessionId, message }),
    onSuccess: () => {
      // Optionally refresh session data
      queryClient.invalidateQueries({ queryKey: ['chatSession'] });
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: (session: ChatSession) =>
      chatService.updateSession({
        sessionId: session.sessionId,
        endTime: session.endTime?.toISOString(),
        metadata: session.metadata
      }),
  });

  // Get analytics query
  const getAnalyticsQuery = useQuery({
    queryKey: ['chatAnalytics'],
    queryFn: () => {
      const sessionInfo = getCurrentSessionInfo();
      if (sessionInfo?.user?.email) {
        return chatService.getAnalytics(sessionInfo.user.email);
      }
      throw new Error('No user found');
    },
    enabled: false,
  });

  // Initialize or restore session
  useEffect(() => {
    const sessionInfo = getCurrentSessionInfo();
    if (sessionInfo) {
      const { user, sessionId } = sessionInfo;
      
      if (sessionId && sessionId.startsWith('session_')) {
        // Try to fetch existing session from API
        chatService.getSession(sessionId)
          .then(response => {
            const session: ChatSession = {
              sessionId: response.sessionId,
              userId: response.userId,
              startTime: new Date(response.startTime),
              endTime: response.endTime ? new Date(response.endTime) : undefined,
              messages: response.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              })),
              metadata: {
                messageCount: response.messages.length,
                userMessageCount: response.messages.filter((m: any) => m.sender === 'user').length,
                botMessageCount: response.messages.filter((m: any) => m.sender === 'bot').length,
                productInteractions: response.messages.reduce((acc: number, m: any) => acc + (m.products?.length || 0), 0),
                searchQueries: response.messages.filter((m: any) => m.sender === 'user').map((m: any) => m.content),
                categories: [...new Set(response.messages.flatMap((m: any) => m.products?.map((p: any) => p.category) || []))]
              }
            };
            setCurrentSession(session);
          })
          .catch(() => {
            // Session not found on server, create new one
            createSessionMutation.mutate(user.email);
          });
      } else {
        // Create new session
        createSessionMutation.mutate(user.email);
      }
    }
  }, []);

  const addMessage = async (message: Message) => {
    if (!currentSession) return;

    // Update local state immediately for better UX
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

    // Send to API
    try {
      await addMessageMutation.mutateAsync({
        sessionId: currentSession.sessionId,
        message
      });
      
      // Update session metadata on server
      await updateSessionMutation.mutateAsync(updatedSession);
    } catch (error) {
      console.error('Failed to sync message to server:', error);
      // Continue with local state - implement retry logic if needed
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    const endedSession = {
      ...currentSession,
      endTime: new Date()
    };

    try {
      await updateSessionMutation.mutateAsync(endedSession);
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to end session on server:', error);
      setCurrentSession(null);
    }
  };

  const clearHistory = async () => {
    if (currentSession) {
      // Create new session to replace current one
      const sessionInfo = getCurrentSessionInfo();
      if (sessionInfo?.user?.email) {
        try {
          await endSession();
          await createSessionMutation.mutateAsync(sessionInfo.user.email);
        } catch (error) {
          console.error('Failed to clear history:', error);
          // Fallback to local clear
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
        }
      }
    }
  };

  const getAnalytics = async (): Promise<ChatAnalytics> => {
    try {
      const result = await getAnalyticsQuery.refetch();
      return result.data!;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  };

  const exportChatData = async () => {
    const sessionInfo = getCurrentSessionInfo();
    if (sessionInfo?.user?.email) {
      try {
        const response = await chatService.exportChatData(sessionInfo.user.email);
        // Open download URL
        window.open(response.exportUrl, '_blank');
      } catch (error) {
        console.error('Failed to export chat data:', error);
        throw error;
      }
    }
  };

  return {
    currentSession,
    messages: currentSession?.messages || [],
    addMessage,
    endSession,
    clearHistory,
    getAnalytics,
    exportChatData,
    isLoading: createSessionMutation.isPending || addMessageMutation.isPending,
    error: createSessionMutation.error || addMessageMutation.error
  };
};
