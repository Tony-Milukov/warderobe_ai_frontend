import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { TabNavigator, AuthNavigator } from '@/navigation';
import { useTheme } from '@/hooks';
import { useAuthStore } from '@/store';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function AppContent() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  // Initialize auth state on app start
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const paperTheme = {
    colors: {
      primary: theme.colors.primary,
      surface: theme.colors.card,
      background: theme.colors.background,
      error: theme.colors.error,
      onSurface: theme.colors.text,
      onBackground: theme.colors.text,
    },
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.background,
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.text }}>
              Loading...
            </Text>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer
          theme={{
            dark: isDark,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.background,
              card: theme.colors.card,
              text: theme.colors.text,
              border: theme.colors.border,
              notification: theme.colors.error,
            },
            fonts: {
              regular: {
                fontFamily: 'System',
                fontWeight: '400',
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500',
              },
              bold: {
                fontFamily: 'System',
                fontWeight: '700',
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '900',
              },
            },
          }}
        >
          {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
