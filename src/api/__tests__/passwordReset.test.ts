/**
 * Password Reset API Test
 *
 * This file demonstrates how to test the password reset functionality
 * manually or with automated tests.
 */

import { useRequestReset, useValidateResetCode, useResetPassword } from '@/api';

// Example usage in a test environment or development
export const testPasswordResetFlow = async () => {
  const testEmail = 'test@example.com';
  const testCode = '123456';
  const testNewPassword = 'NewSecurePassword123!';

  try {
    console.log('🔄 Starting password reset flow test...');

    // Step 1: Request reset code
    console.log('📧 Requesting reset code...');
    const requestResult = await fetch('/password-reset/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });
    const requestData = await requestResult.json();
    console.log('✅ Reset code requested:', requestData);

    // Step 2: Validate reset code
    console.log('🔍 Validating reset code...');
    const validateResult = await fetch('/password-reset/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        code: testCode,
      }),
    });
    const validateData = await validateResult.json();
    console.log('✅ Code validation result:', validateData);

    if (validateData.data.valid) {
      // Step 3: Reset password
      console.log('🔒 Resetting password...');
      const resetResult = await fetch('/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          code: testCode,
          newPassword: testNewPassword,
        }),
      });
      const resetData = await resetResult.json();
      console.log('✅ Password reset complete:', resetData);
    }

    console.log('🎉 Password reset flow test completed successfully!');
  } catch (error) {
    console.error('❌ Password reset flow test failed:', error);
  }
};

// Example React Hook usage
export const usePasswordResetExample = () => {
  const requestResetMutation = useRequestReset();
  const validateCodeMutation = useValidateResetCode();
  const resetPasswordMutation = useResetPassword();

  const handleCompletePasswordReset = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      // Step 1: Request reset (already done by user)
      console.log('Requesting reset for:', email);

      // Step 2: Validate code
      const validation = await validateCodeMutation.mutateAsync({
        email,
        code,
      });

      if (!validation.valid) {
        throw new Error('Invalid reset code');
      }

      // Step 3: Reset password
      await resetPasswordMutation.mutateAsync({
        email,
        code,
        newPassword,
      });

      console.log('Password reset successful!');
      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, error };
    }
  };

  return {
    handleCompletePasswordReset,
    isLoading:
      requestResetMutation.isPending ||
      validateCodeMutation.isPending ||
      resetPasswordMutation.isPending,
  };
};

// Mock data for testing UI components
export const mockPasswordResetData = {
  validEmail: 'user@example.com',
  invalidEmail: 'invalid-email',
  validCode: '123456',
  invalidCode: '000000',
  validPassword: 'SecurePassword123!',
  weakPassword: '123',

  // Mock API responses
  successResponses: {
    request: {
      success: true,
      data: { message: 'Reset code sent to your email' },
    },
    validate: {
      success: true,
      data: { valid: true, message: 'Code is valid' },
    },
    reset: {
      success: true,
      data: { message: 'Password reset successfully' },
    },
  },

  errorResponses: {
    invalidEmail: {
      success: false,
      message: 'Invalid email address',
    },
    invalidCode: {
      success: false,
      message: 'Invalid or expired reset code',
    },
    weakPassword: {
      success: false,
      message: 'Password does not meet requirements',
    },
  },
};

// Validation utilities
export const validatePasswordResetForm = {
  email: (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  },

  code: (code: string) => {
    return code.length === 6 && /^\d+$/.test(code);
  },

  password: (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      valid: minLength && hasUpper && hasLower && hasNumber,
      checks: { minLength, hasUpper, hasLower, hasNumber },
    };
  },

  confirmPassword: (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  },
};
