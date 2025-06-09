
import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';
import type { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

export class AuthService {
  // Signup new user
  async signup(credentials: SignupRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.AUTH.SIGNUP,
        credentials
      );
      
      // Store session data
      sessionStorage.setItem('user-session', JSON.stringify({
        user: response.user,
        token: response.token,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.AUTH.LOGIN,
        credentials
      );
      
      // Store session data
      sessionStorage.setItem('user-session', JSON.stringify({
        user: response.user,
        token: response.token,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Guest login
  async guestLogin(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.AUTH.GUEST,
        {}
      );
      
      // Store session data
      sessionStorage.setItem('user-session', JSON.stringify({
        user: response.user,
        token: response.token,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return response;
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_CONFIG.AUTH.LOGOUT);
      
      // Clear session data
      sessionStorage.removeItem('user-session');
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local session even if API call fails
      sessionStorage.removeItem('user-session');
      throw error;
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>(API_CONFIG.AUTH.ME);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Refresh authentication token
  async refreshToken(): Promise<LoginResponse> {
    try {
      return await apiClient.post<LoginResponse>(API_CONFIG.AUTH.REFRESH);
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const userSession = sessionStorage.getItem('user-session');
    return !!userSession;
  }

  // Get stored user data
  getStoredUser(): User | null {
    const userSession = sessionStorage.getItem('user-session');
    if (userSession) {
      try {
        const { user } = JSON.parse(userSession);
        return user;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
