
import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';
import type { Message } from '../types';
import type { ChatSession, ChatAnalytics } from '../hooks/useChatAnalytics';

export interface CreateSessionRequest {
  userId: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  startTime: string;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
}

export interface GetSessionResponse {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: string;
    products?: any[];
  }>;
}

export class ChatService {
  // Create new chat session
  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    try {
      return await apiClient.post<CreateSessionResponse>(
        API_CONFIG.CHAT.SESSIONS,
        request
      );
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  }

  // Send message to chat session (requires session ID in headers)
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      return await apiClient.post<SendMessageResponse>(
        API_CONFIG.CHAT.SEND_MESSAGE,
        request,
        undefined,
        true // Include session ID in headers
      );
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Get session details with messages
  async getSession(sessionId: string): Promise<GetSessionResponse> {
    try {
      return await apiClient.get<GetSessionResponse>(
        API_CONFIG.CHAT.SESSION_DETAIL,
        { sessionId },
        true // Include session ID in headers
      );
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }

  // Delete chat session
  async deleteSession(sessionId: string): Promise<{ success: boolean }> {
    try {
      return await apiClient.delete<{ success: boolean }>(
        API_CONFIG.CHAT.SESSION_DETAIL,
        { sessionId },
        true // Include session ID in headers
      );
    } catch (error) {
      console.error('Delete session error:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility with existing hooks
  async addMessage(request: { sessionId: string; message: Message }): Promise<{ success: boolean }> {
    try {
      const sendRequest: SendMessageRequest = {
        sessionId: request.sessionId,
        message: request.message.content,
        sender: request.message.sender,
        timestamp: request.message.timestamp.toISOString()
      };
      
      const response = await this.sendMessage(sendRequest);
      return { success: response.success };
    } catch (error) {
      console.error('Add message error:', error);
      throw error;
    }
  }

  // Placeholder methods for analytics (implement based on your backend)
  async getAnalytics(userId: string): Promise<ChatAnalytics> {
    // This would need to be implemented based on your backend analytics endpoint
    console.warn('Analytics endpoint not implemented yet');
    return {
      totalSessions: 0,
      totalMessages: 0,
      averageSessionLength: 0,
      popularSearchTerms: [],
      popularCategories: [],
      userEngagement: {
        averageMessagesPerSession: 0,
        averageSessionDuration: 0,
        productClickRate: 0
      }
    };
  }

  async exportChatData(userId: string): Promise<{ exportUrl: string; expiresAt: string }> {
    // This would need to be implemented based on your backend export endpoint
    console.warn('Export endpoint not implemented yet');
    throw new Error('Export functionality not available');
  }

  // Update session method for backward compatibility
  async updateSession(request: any): Promise<{ success: boolean }> {
    // This might not be needed with the new backend structure
    console.warn('Update session method may not be needed with new backend');
    return { success: true };
  }
}

export const chatService = new ChatService();
