import { useMutation } from '@tanstack/react-query';
import api from './client';
import { APIResponse } from '@/types';

// API Types
export interface RequestResetRequest {
  email: string;
}

export interface ValidateResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface RequestResetResponse {
  message: string;
}

export interface ValidateResetCodeResponse {
  valid: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// API functions
export const passwordResetAPI = {
  // Request password reset code
  requestReset: async (
    data: RequestResetRequest
  ): Promise<RequestResetResponse> => {
    const response = await api.post<APIResponse<RequestResetResponse>>(
      '/password-reset/request',
      data
    );
    return response.data.data;
  },

  // Validate reset code
  validateResetCode: async (
    data: ValidateResetCodeRequest
  ): Promise<ValidateResetCodeResponse> => {
    const response = await api.post<ValidateResetCodeResponse>(
      '/password-reset/validate',
      data
    );

    return response.data;
  },

  // Reset password
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(
      '/password-reset/reset',
      data
    );
    return response.data;
  },
};

// React Query hooks
export const useRequestReset = () => {
  return useMutation({
    mutationFn: passwordResetAPI.requestReset,
  });
};

export const useValidateResetCode = () => {
  return useMutation({
    mutationFn: passwordResetAPI.validateResetCode,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: passwordResetAPI.resetPassword,
  });
};
