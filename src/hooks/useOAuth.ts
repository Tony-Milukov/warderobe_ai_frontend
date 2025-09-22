import { useState } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useGoogleSignIn, useAppleSignIn } from '@/api';
import { useAuthStore } from '@/store';
import { secureStorage } from '@/utils';

export const useOAuth = () => {
  const { login } = useAuthStore();
  const googleSignInMutation = useGoogleSignIn();
  const appleSignInMutation = useAppleSignIn();
  const [isLoading, setIsLoading] = useState(false);

  // Google OAuth configuration
  const [request, , promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const result = await promptAsync();

      if (result?.type === 'success') {
        const { id_token } = result.params;

        if (!id_token) {
          throw new Error('No ID token received from Google');
        }

        // Send token to backend
        const authResponse = await googleSignInMutation.mutateAsync({
          idToken: id_token,
        });

        // Store tokens securely
        await secureStorage.setTokens(
          authResponse.accessToken,
          authResponse.refreshToken
        );
        await secureStorage.setUserData(authResponse.user);

        // Update auth state
        login(authResponse.user);

        return { success: true };
      } else if (result?.type === 'cancel') {
        return { success: false, cancelled: true };
      } else {
        throw new Error('Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google sign-in failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Apple Sign-In handler
  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);

      // Check if Apple Authentication is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Authentication is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Send token to backend
      const authResponse = await appleSignInMutation.mutateAsync({
        idToken: credential.identityToken,
      });

      // Store tokens securely
      await secureStorage.setTokens(
        authResponse.accessToken,
        authResponse.refreshToken
      );
      await secureStorage.setUserData(authResponse.user);

      // Update auth state
      login(authResponse.user);

      return { success: true };
    } catch (error) {
      console.error('Apple sign-in error:', error);

      if (error instanceof Error) {
        // Handle specific Apple Authentication errors
        if (error.message.includes('canceled')) {
          return { success: false, cancelled: true };
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Apple sign-in failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if Apple Sign-In is available (iOS only)
  const isAppleSignInAvailable = Platform.OS === 'ios';

  // Check if Google Sign-In is configured
  const isGoogleSignInAvailable = !!request;

  return {
    // Google
    handleGoogleSignIn,
    isGoogleSignInAvailable,
    googleLoading: googleSignInMutation.isPending,

    // Apple
    handleAppleSignIn,
    isAppleSignInAvailable,
    appleLoading: appleSignInMutation.isPending,

    // General
    isLoading:
      isLoading ||
      googleSignInMutation.isPending ||
      appleSignInMutation.isPending,
  };
};
