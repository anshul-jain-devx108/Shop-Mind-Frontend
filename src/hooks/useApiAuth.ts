
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { User } from '../types';
import type { LoginRequest, SignupRequest } from '../services/authService';

// API-connected version of useAuth hook
export const useApiAuth = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Check current authentication status
  const {
    data: user,
    isLoading: isCheckingAuth,
    error: authError
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (credentials: SignupRequest) => authService.signup(credentials),
    onSuccess: (response) => {
      queryClient.setQueryData(['currentUser'], response.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      queryClient.setQueryData(['currentUser'], response.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Guest login mutation
  const guestLoginMutation = useMutation({
    mutationFn: () => authService.guestLogin(),
    onSuccess: (response) => {
      queryClient.setQueryData(['currentUser'], response.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      console.error('Guest login failed:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still clear local data even if API call fails
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
    },
  });

  useEffect(() => {
    // Initialize authentication state
    const storedUser = authService.getStoredUser();
    if (storedUser && !authService.isAuthenticated()) {
      // Clear invalid session
      authService.logout();
    }
    setIsLoading(false);
  }, []);

  const signup = async (credentials: SignupRequest) => {
    try {
      const response = await signupMutation.mutateAsync(credentials);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const guestLogin = async () => {
    try {
      const response = await guestLoginMutation.mutateAsync();
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Logout locally even if API call fails
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user || authService.isAuthenticated();

  return {
    user: user || authService.getStoredUser(),
    signup,
    login,
    guestLogin,
    logout,
    isAuthenticated,
    isLoading: isLoading || isCheckingAuth || loginMutation.isPending || logoutMutation.isPending || signupMutation.isPending || guestLoginMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending
  };
};
