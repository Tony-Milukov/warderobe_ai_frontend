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
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks';
import { Button, Card } from '@/components';
import { AuthProvider, useSignUp } from '@/api';
import { useAuthStore } from '@/store';
import { secureStorage } from '@/utils';

interface SignUpScreenProps {
  navigation: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuthStore();
  const signUpMutation = useSignUp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validateForm()) return;

    signUpMutation.mutate(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        provider: AuthProvider.EMAIL,
      },
      {
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
            text1: 'Welcome!',
            text2: 'Your account has been created successfully.',
          });
        },
        onError: (error: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('Sign up error:', error);
          const errorMessage =
            error.response?.data?.message || 'Failed to create account';

          Toast.show({
            type: 'error',
            text1: 'Sign Up Failed',
            text2: errorMessage,
          });

          if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
          }
        },
      }
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            Create Account
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Join us to start building your digital wardrobe
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.form}>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={value => updateFormData('firstName', value)}
              mode="outlined"
              autoComplete="given-name"
              error={!!errors.firstName}
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />
            {errors.firstName && (
              <HelperText type="error" visible={!!errors.firstName}>
                {errors.firstName}
              </HelperText>
            )}

            <TextInput
              label="Last Name (Optional)"
              value={formData.lastName}
              onChangeText={value => updateFormData('lastName', value)}
              mode="outlined"
              autoComplete="family-name"
              error={!!errors.lastName}
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />
            {errors.lastName && (
              <HelperText type="error" visible={!!errors.lastName}>
                {errors.lastName}
              </HelperText>
            )}

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
              autoComplete="new-password"
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

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={value => updateFormData('confirmPassword', value)}
              mode="outlined"
              secureTextEntry
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />
            {errors.confirmPassword && (
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>
            )}

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={signUpMutation.isPending}
              style={styles.signUpButton}
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <Text
            style={[styles.footerText, { color: theme.colors.textSecondary }]}
          >
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Sign in
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
  formCard: {
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  signUpButton: {
    marginTop: 8,
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

export default SignUpScreen;
