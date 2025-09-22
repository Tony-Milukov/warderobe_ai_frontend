import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './client';
import {
  WardrobeItem,
  Outfit,
  CreateWardrobeItemRequest,
  GenerateOutfitRequest,
  User,
} from '@/types';

/**
 * Authentication API Services
 *
 * Updated to handle the new backend authentication response format:
 * - Returns accessToken and refreshToken (instead of single token)
 * - User object includes firstName, lastName, profileImage, provider, etc.
 * - Consistent response format across all auth operations (login, signup, oauth)
 */

// Auth API Types
export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export interface LoginRequest {
  email: string;
  password: string;
  provider?: AuthProvider;
  idToken?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  provider?: AuthProvider;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// OAuth API Types
export interface GoogleAuthRequest {
  idToken: string;
}

export interface AppleAuthRequest {
  idToken: string;
}

// Auth API functions
export const authAPI = {
  // Sign in
  signIn: async (data: LoginRequest): Promise<AuthResponse> => {
    data.provider = data.provider || AuthProvider.EMAIL;

    const response = await api.post<AuthResponse>('/auth/signin', data);
    return response.data;
  },

  // Sign up
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// OAuth API functions
export const oAuthAPI = {
  // Google Sign-In
  googleSignIn: async (data: GoogleAuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google', data);
    return response.data;
  },

  // Apple Sign-In
  appleSignIn: async (data: AppleAuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/apple', data);
    return response.data;
  },
};

// API functions
export const wardrobeAPI = {
  // Upload new wardrobe item
  createItem: async (
    data: CreateWardrobeItemRequest
  ): Promise<WardrobeItem> => {
    const formData = new FormData();
    formData.append('image', {
      uri: data.image,
      type: 'image/jpeg',
      name: 'wardrobe-item.jpg',
    } as unknown as Blob);

    if (data.category) {
      formData.append('category', data.category);
    }

    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    const response = await api.post<WardrobeItem>('/api/warderobe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all wardrobe items
  getItems: async (): Promise<WardrobeItem[]> => {
    const response = await api.get<WardrobeItem[]>('/api/warderobe/list');
    return response.data;
  },

  // Delete wardrobe item
  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/api/warderobe/${id}`);
  },
};

export const outfitAPI = {
  // Generate outfit
  generateOutfit: async (data: GenerateOutfitRequest): Promise<Outfit> => {
    const response = await api.post<Outfit>('/api/outfits/generate', data);
    return response.data;
  },

  // Get saved outfits
  getOutfits: async (): Promise<Outfit[]> => {
    const response = await api.get<Outfit[]>('/api/outfits');
    return response.data;
  },
};

// React Query hooks
export const useWardrobeItems = () => {
  return useQuery({
    queryKey: ['wardrobe-items'],
    queryFn: wardrobeAPI.getItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWardrobeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wardrobeAPI.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobe-items'] });
    },
  });
};

export const useDeleteWardrobeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wardrobeAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobe-items'] });
    },
  });
};

export const useGenerateOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outfitAPI.generateOutfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });
};

export const useOutfits = () => {
  return useQuery({
    queryKey: ['outfits'],
    queryFn: outfitAPI.getOutfits,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Auth React Query hooks
export const useSignIn = () => {
  return useMutation({
    mutationFn: authAPI.signIn,
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: authAPI.signUp,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: authAPI.getCurrentUser,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: false, // Don't retry on auth errors
  });
};

// OAuth React Query hooks
export const useGoogleSignIn = () => {
  return useMutation({
    mutationFn: oAuthAPI.googleSignIn,
  });
};

export const useAppleSignIn = () => {
  return useMutation({
    mutationFn: oAuthAPI.appleSignIn,
  });
};
