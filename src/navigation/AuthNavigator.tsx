import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@/hooks';
import {
  SignInScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  CodeValidationScreen,
} from '@/screens/Auth';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  CodeValidation: { email: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Create Account',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
      <Stack.Screen
        name="CodeValidation"
        component={CodeValidationScreen}
        options={{
          title: 'Verify Code',
          headerLeft: () => null, // Prevent going back without completing
        }}
      />
    </Stack.Navigator>
  );
};
