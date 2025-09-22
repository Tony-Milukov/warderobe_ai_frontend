import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, HelperText } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks';
import { Button, Card } from '@/components';
import { useValidateResetCode, useResetPassword } from '@/api';

interface CodeValidationScreenProps {
  navigation: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  route: {
    params: {
      email: string;
    };
  };
}

const CodeValidationScreen: React.FC<CodeValidationScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const { email } = route.params;
  const validateCodeMutation = useValidateResetCode();
  const resetPasswordMutation = useResetPassword();

  const [formData, setFormData] = useState({
    email: email,
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCodeValid, setIsCodeValid] = useState(false);

  // Clear form data when component unmounts (for security)
  useEffect(() => {
    return () => {
      setFormData({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: '',
      });
    };
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Reset code is required';
    } else if (formData.code.length !== 6) {
      newErrors.code = 'Reset code must be 6 digits';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidateCode = () => {
    if (!formData.code.trim()) {
      setErrors({ code: 'Reset code is required' });
      return;
    }

    validateCodeMutation.mutate(
      { email: formData.email, code: formData.code },
      {
        onSuccess: response => {
          if (response.valid) {
            setIsCodeValid(true);
            Toast.show({
              type: 'success',
              text1: 'Code Verified!',
              text2: 'Please enter your new password',
            });
            // Clear code error
            setErrors(prev => ({ ...prev, code: '' }));
          } else {
            setErrors({ code: response.message || 'Invalid reset code' });
          }
        },
        onError: (error: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('Validate code error:', error);
          const errorMessage =
            error.response?.data?.message || 'Invalid reset code';
          setErrors({ code: errorMessage });
        },
      }
    );
  };

  const handleResetPassword = () => {
    if (!validateForm()) return;

    resetPasswordMutation.mutate(
      {
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Password Reset Successful!',
            text2: 'You can now sign in with your new password',
          });

          // Navigate back to SignIn screen and clear the stack
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        },
        onError: (error: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('Reset password error:', error);
          const errorMessage =
            error.response?.data?.message ||
            'Failed to reset password. Please try again.';

          Toast.show({
            type: 'error',
            text1: 'Reset Failed',
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
            Enter Reset Code
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            We sent a 6-digit code to{'\n'}
            <Text style={{ fontWeight: '600' }}>{email}</Text>
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.form}>
            {/* Email (read-only) */}
            <TextInput
              label="Email"
              value={formData.email}
              mode="outlined"
              disabled
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />

            {/* Reset Code */}
            <TextInput
              label="6-Digit Reset Code"
              value={formData.code}
              onChangeText={value => updateFormData('code', value)}
              mode="outlined"
              keyboardType="number-pad"
              maxLength={6}
              error={!!errors.code}
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  surface: theme.colors.card,
                },
              }}
            />
            {errors.code && (
              <HelperText type="error" visible={!!errors.code}>
                {errors.code}
              </HelperText>
            )}

            {/* Validate Code Button */}
            {!isCodeValid && (
              <Button
                title="Validate Code"
                onPress={handleValidateCode}
                loading={validateCodeMutation.isPending}
                style={styles.validateButton}
              />
            )}

            {/* New Password Fields (only show after code is validated) */}
            {isCodeValid && (
              <>
                <View style={styles.divider}>
                  <Text
                    style={[
                      styles.dividerText,
                      { color: theme.colors.success },
                    ]}
                  >
                    ✓ Code verified! Now set your new password
                  </Text>
                </View>

                <TextInput
                  label="New Password"
                  value={formData.newPassword}
                  onChangeText={value => updateFormData('newPassword', value)}
                  mode="outlined"
                  secureTextEntry
                  autoComplete="new-password"
                  error={!!errors.newPassword}
                  style={styles.input}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                      background: theme.colors.background,
                      surface: theme.colors.card,
                    },
                  }}
                />
                {errors.newPassword && (
                  <HelperText type="error" visible={!!errors.newPassword}>
                    {errors.newPassword}
                  </HelperText>
                )}

                <TextInput
                  label="Confirm New Password"
                  value={formData.confirmPassword}
                  onChangeText={value =>
                    updateFormData('confirmPassword', value)
                  }
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
                  title="Reset Password"
                  onPress={handleResetPassword}
                  loading={resetPasswordMutation.isPending}
                  style={styles.resetButton}
                />
              </>
            )}

            <Button
              title="Back to Sign In"
              variant="outline"
              onPress={() => navigation.navigate('SignIn')}
              style={styles.backButton}
            />
          </View>
        </Card>

        {/* Password Requirements Info */}
        {isCodeValid && (
          <View style={styles.infoCard}>
            <Card>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                🔒 Password Requirements
              </Text>
              <Text
                style={[styles.infoText, { color: theme.colors.textSecondary }]}
              >
                • At least 8 characters long{'\n'}• Contains uppercase and
                lowercase letters{'\n'}• Contains at least one number
              </Text>
            </Card>
          </View>
        )}
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
  validateButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
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

export default CodeValidationScreen;
