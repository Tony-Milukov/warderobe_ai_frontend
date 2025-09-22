import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, HelperText } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks';
import { Button, Card } from '@/components';
import { useRequestReset } from '@/api';

interface ForgotPasswordScreenProps {
  navigation: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const requestResetMutation = useRequestReset();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetCode = () => {
    if (!validateForm()) return;

    requestResetMutation.mutate(
      { email },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Reset Code Sent!',
            text2: 'Reset code sent to your email',
          });

          // Navigate to CodeValidationScreen with email
          navigation.navigate('CodeValidation', { email });
        },
        onError: (error: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('Request reset error:', error);
          const errorMessage =
            error.response?.data?.message ||
            'Failed to send reset code. Please try again.';

          Toast.show({
            type: 'error',
            text1: 'Failed to Send Code',
            text2: errorMessage,
          });

          // Show field-specific errors if available
          if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
          }
        },
      }
    );
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Forgot Password?
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            No worries! Enter your email address and we&apos;ll send you a reset
            code.
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.form}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={handleEmailChange}
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

            <Button
              title="Send Reset Code"
              onPress={handleSendResetCode}
              loading={requestResetMutation.isPending}
              style={styles.sendButton}
            />

            <Button
              title="Back to Sign In"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
          </View>
        </Card>

        <View style={styles.infoCard}>
          <Card>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              📧 What happens next?
            </Text>
            <Text
              style={[styles.infoText, { color: theme.colors.textSecondary }]}
            >
              1. You&apos;ll receive a 6-digit code in your email{'\n'}
              2. Enter the code along with your new password{'\n'}
              3. You&apos;ll be ready to sign in with your new password
            </Text>
          </Card>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
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
  sendButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 8,
  },
  infoCard: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ForgotPasswordScreen;
