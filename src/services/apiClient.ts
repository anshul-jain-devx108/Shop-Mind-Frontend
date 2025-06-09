
import { API_DEFAULTS, buildUrl } from './apiConfig';

// Generic API client with error handling and token management
class ApiClient {
  private getAuthHeaders(includeSessionId: boolean = false) {
    const userSession = sessionStorage.getItem('user-session');
    let headers = { ...API_DEFAULTS.headers };
    
    if (userSession) {
      try {
        const { token, sessionId } = JSON.parse(userSession);
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (includeSessionId && sessionId) {
          headers['X-Session-ID'] = sessionId;
        }
      } catch (error) {
        console.error('Error parsing user session:', error);
      }
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  async get<T>(endpoint: string, params?: Record<string, string>, includeSessionId: boolean = false): Promise<T> {
    const url = buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(includeSessionId),
    });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, params?: Record<string, string>, includeSessionId: boolean = false): Promise<T> {
    const url = buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(includeSessionId),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any, params?: Record<string, string>, includeSessionId: boolean = false): Promise<T> {
    const url = buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getAuthHeaders(includeSessionId),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, params?: Record<string, string>, includeSessionId: boolean = false): Promise<T> {
    const url = buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders(includeSessionId),
    });
    
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
