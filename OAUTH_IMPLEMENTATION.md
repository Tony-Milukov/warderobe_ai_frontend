# OAuth Authentication Implementation

This document describes the complete OAuth authentication implementation for Google and Apple Sign-In.

## 🔧 Setup Requirements

### Google OAuth Setup

1. **Google Cloud Console Configuration**:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your app's bundle identifier to authorized origins

2. **Environment Configuration**:
   ```env
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

3. **App Configuration** (`app.json`):
   ```json
   {
     "plugins": ["expo-apple-authentication"],
     "extra": {
       "googleClientId": "${EXPO_PUBLIC_GOOGLE_CLIENT_ID}"
     }
   }
   ```

### Apple OAuth Setup

1. **Apple Developer Configuration**:
   - Enable "Sign In with Apple" capability in your app identifier
   - Configure your app's bundle identifier
   - Apple Sign-In works automatically on iOS devices

2. **App Configuration** (`app.json`):
   ```json
   {
     "plugins": ["expo-apple-authentication"]
   }
   ```

## 🚀 Implementation Overview

### OAuth Flow Architecture

```typescript
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SignInScreen  │    │   OAuth Provider │    │   Backend API   │
│                 │    │ (Google/Apple)   │    │                 │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ 1. User clicks  │───▶│ 2. OAuth login   │    │                 │
│    OAuth button │    │    dialog opens  │    │                 │
│                 │    │                  │    │                 │
│ 4. Receive      │◀───│ 3. User approves │    │                 │
│    idToken      │    │    and returns   │    │                 │
│                 │    │    tokens        │    │                 │
│                 │    │                  │    │                 │
│ 5. Send idToken │───────────────────────────▶│ 6. Validate     │
│    to backend   │    │                  │    │    idToken      │
│                 │    │                  │    │                 │
│ 8. Store tokens │◀───────────────────────────│ 7. Return       │
│    & login user │    │                  │    │    access token │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components

1. **`useOAuth` Hook** (`src/hooks/useOAuth.ts`):
   - Handles Google and Apple authentication flows
   - Manages OAuth provider configurations
   - Processes authentication responses

2. **OAuth API Services** (`src/api/services.ts`):
   - `useGoogleSignIn()` - Google authentication mutation
   - `useAppleSignIn()` - Apple authentication mutation

3. **Secure Storage** (`src/utils/secureStorage.ts`):
   - Stores authentication tokens securely using `expo-secure-store`
   - Manages user data persistence

4. **Updated SignInScreen** (`src/screens/Auth/SignInScreen.tsx`):
   - OAuth buttons with platform-specific availability
   - Integrated error handling with toast notifications

## 📱 User Interface

### OAuth Buttons

The SignInScreen now includes OAuth buttons that appear above the email/password form:

```typescript
{/* OAuth Buttons */}
{(isGoogleSignInAvailable || isAppleSignInAvailable) && (
  <Card style={styles.oauthCard}>
    <View style={styles.oauthButtons}>
      {isGoogleSignInAvailable && (
        <TouchableOpacity style={styles.oauthButton} onPress={onGoogleSignIn}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text>Continue with Google</Text>
        </TouchableOpacity>
      )}

      {isAppleSignInAvailable && (
        <TouchableOpacity style={styles.oauthButton} onPress={onAppleSignIn}>
          <Ionicons name="logo-apple" size={20} />
          <Text>Continue with Apple</Text>
        </TouchableOpacity>
      )}
    </View>
    
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.dividerLine} />
    </View>
  </Card>
)}
```

### Platform Availability

- **Google Sign-In**: Available on all platforms (iOS, Android, Web)
- **Apple Sign-In**: Available only on iOS devices

## 🔐 Security Features

### Token Management

1. **Secure Storage**:
   - Access tokens stored using `expo-secure-store`
   - Automatic token injection in API requests
   - Secure token cleanup on logout

2. **Authentication State**:
   - Persistent authentication state across app restarts
   - Automatic session restoration from secure storage

### Error Handling

```typescript
// OAuth error handling example
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
```

## 🔗 Backend Integration

### Required Backend Endpoints

#### Google Sign-In Endpoint
```http
POST /auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "avatar_url",
      "provider": "google",
      "providerId": "google_user_id",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

#### Apple Sign-In Endpoint
```http
POST /auth/apple
Content-Type: application/json

{
  "idToken": "apple_identity_token_string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "id": "user_id",
      "email": "user@privaterelay.appleid.com",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": null,
      "provider": "apple",
      "providerId": "apple_user_id",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

## 🧪 Testing OAuth Integration

### Development Testing

1. **Google Sign-In Testing**:
   ```typescript
   // Test Google OAuth flow
   const testGoogleAuth = async () => {
     console.log('Testing Google authentication...');
     const result = await handleGoogleSignIn();
     console.log('Google auth result:', result);
   };
   ```

2. **Apple Sign-In Testing**:
   ```typescript
   // Test Apple OAuth flow (iOS only)
   const testAppleAuth = async () => {
     if (Platform.OS === 'ios') {
       console.log('Testing Apple authentication...');
       const result = await handleAppleSignIn();
       console.log('Apple auth result:', result);
     }
   };
   ```

### Mock Data for UI Testing

```typescript
export const mockOAuthData = {
  googleResponse: {
    type: 'success',
    params: {
      id_token: 'mock_google_id_token',
      access_token: 'mock_google_access_token',
    },
  },
  appleCredential: {
    identityToken: 'mock_apple_identity_token',
    user: 'mock_apple_user_id',
    email: 'user@privaterelay.appleid.com',
    fullName: {
      givenName: 'John',
      familyName: 'Doe',
    },
  },
};
```

## 🔧 Troubleshooting

### Common Issues

1. **Google Sign-In Not Working**:
   - Verify `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
   - Check Google Cloud Console configuration
   - Ensure OAuth consent screen is configured

2. **Apple Sign-In Not Available**:
   - Only works on iOS devices
   - Requires proper app configuration in Apple Developer Console
   - Check if device supports Apple Sign-In

3. **Token Storage Issues**:
   - Ensure `expo-secure-store` is properly installed
   - Check device compatibility for secure storage

### Debug Information

```typescript
// Enable OAuth debugging
const debugOAuth = () => {
  console.log('Google Client ID:', process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);
  console.log('Apple Sign-In Available:', Platform.OS === 'ios');
  console.log('Secure Store Available:', SecureStore.isAvailableAsync());
};
```

## 📚 Additional Resources

- [Expo Google Authentication](https://docs.expo.dev/guides/google-authentication/)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [React Navigation Authentication Flow](https://reactnavigation.org/docs/auth-flow/)
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)

## 🎯 Usage Examples

### Complete OAuth Setup in Component

```typescript
import { useOAuth } from '@/hooks';

const MyAuthComponent = () => {
  const {
    handleGoogleSignIn,
    handleAppleSignIn,
    isGoogleSignInAvailable,
    isAppleSignInAvailable,
    isLoading,
  } = useOAuth();

  return (
    <View>
      {isGoogleSignInAvailable && (
        <Button 
          title="Sign in with Google" 
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        />
      )}
      
      {isAppleSignInAvailable && (
        <Button 
          title="Sign in with Apple" 
          onPress={handleAppleSignIn}
          disabled={isLoading}
        />
      )}
    </View>
  );
};
```

This implementation provides a complete, secure, and user-friendly OAuth authentication system that integrates seamlessly with the existing authentication flow.
