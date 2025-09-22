import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme, useOAuth } from '@/hooks';
import { Button, Card } from '@/components';
import { useSignIn } from '@/api';
import { useAuthStore } from '@/store';
import { secureStorage } from '@/utils';

interface SignInScreenProps {
  navigation: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuthStore();
  const signInMutation = useSignIn();
  const {
    handleGoogleSignIn,
    handleAppleSignIn,
    isGoogleSignInAvailable,
    isAppleSignInAvailable,
    isLoading: oAuthLoading,
  } = useOAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validateForm()) return;

    signInMutation.mutate(formData, {
      onSuccess: async response => {
        // Store tokens securely
        await secureStorage.setTokens(
          response.accessToken,
          response.refreshToken
        );
        await secureStorage.setUserData(response.user);

        login(response.user);
        Toast.show({
          type: 'success',
          text1: 'Welcome back!',
          text2: 'You have successfully signed in.',
        });
        // Navigation will be handled automatically by App.tsx auth flow
      },
      onError: (error: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('Sign in error:', error);
        const errorMessage =
          error.response?.data?.message || 'Invalid email or password';

        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: errorMessage,
        });

        // Show field-specific errors if available
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      },
    });
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // OAuth handlers
  const onGoogleSignIn = async () => {
    const result = await handleGoogleSignIn();

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Successfully signed in with Google.',
      });
    } else if (!result.cancelled) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: result.error || 'Google sign-in failed',
      });
    }
  };

  const onAppleSignIn = async () => {
    const result = await handleAppleSignIn();

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Successfully signed in with Apple.',
      });
    } else if (!result.cancelled) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: result.error || 'Apple sign-in failed',
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Sign in to access your digital wardrobe
          </Text>
        </View>

        {/* OAuth Buttons */}
        {(isGoogleSignInAvailable || isAppleSignInAvailable) && (
          <Card style={styles.oauthCard}>
            <View style={styles.oauthButtons}>
              {isGoogleSignInAvailable && (
                <TouchableOpacity
                  style={[
                    styles.oauthButton,
                    { borderColor: theme.colors.border },
                  ]}
                  onPress={onGoogleSignIn}
                  disabled={oAuthLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text
                    style={[
                      styles.oauthButtonText,
                      { color: theme.colors.text },
                    ]}
                  >
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              )}

              {isAppleSignInAvailable && (
                <TouchableOpacity
                  style={[
                    styles.oauthButton,
                    { borderColor: theme.colors.border },
                  ]}
                  onPress={onAppleSignIn}
                  disabled={oAuthLoading}
                >
                  <Ionicons
                    name="logo-apple"
                    size={20}
                    color={theme.colors.text}
                  />
                  <Text
                    style={[
                      styles.oauthButtonText,
                      { color: theme.colors.text },
                    ]}
                  >
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.dividerContainer}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                or
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>
          </Card>
        )}

        <Card style={styles.formCard}>
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />
            {errors.email && (
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            )}

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={value => updateFormData('password', value)}
              mode="outlined"
              secureTextEntry
              autoComplete="password"
              error={!!errors.password}
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />
            {errors.password && (
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            )}

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={signInMutation.isPending}
              style={styles.signInButton}
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordLink}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: theme.colors.primary },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.footer}>
          <Text
            style={[styles.footerText, { color: theme.colors.textSecondary }]}
          >
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  oauthCard: {
    marginBottom: 24,
  },
  oauthButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  oauthButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  oauthButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#888',
  },
  formCard: {
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordLink: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SignInScreen;
