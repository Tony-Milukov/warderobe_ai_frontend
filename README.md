# AI Wardrobe App 👗✨

A modern React Native Expo application that uses AI to help users manage their digital wardrobe, automatically categorize clothing items, and generate stylish outfit combinations.

## 🚀 Features

### MVP Features
- **📱 Digital Wardrobe**: Upload and manage clothing items with photos
- **🤖 AI Processing**: Automatic background removal and clothing categorization
- **👕 Outfit Generation**: AI-powered outfit suggestions based on your wardrobe
- **🔐 Authentication**: Complete user authentication with password reset flow
- **🎨 Modern UI**: Beautiful, responsive design with light/dark mode support
- **📊 Smart Categories**: Automatic classification of tops, bottoms, shoes, accessories, etc.

### Authentication Features
- **🔑 Sign In/Sign Up**: Secure user authentication
- **🌐 OAuth Login**: Google and Apple Sign-In integration
- **📧 Forgot Password**: Email-based password reset with verification codes
- **🔒 Password Reset**: Complete flow with code validation and new password setup
- **🔐 Secure Storage**: Encrypted token storage with expo-secure-store
- **🚪 Logout**: Secure session management with token cleanup
- **📱 Modern UI**: React Native Paper components with toast notifications

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Navigation**: Stack and Tab navigation with React Navigation v7
- **Authentication**: Complete auth flow with password reset
- **State Management**: Zustand for global state, React Query for server state
- **Image Handling**: Camera/gallery integration with compression
- **UI Components**: React Native Paper for modern Material Design
- **Notifications**: Toast messages for user feedback
- **Theming**: Dynamic light/dark mode with custom theme system
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7 (Stack + Tab navigators)
- **Authentication**: OAuth (Google/Apple) + Email/Password
- **State Management**: Zustand + React Query (TanStack Query)
- **HTTP Client**: Axios with interceptors
- **UI Components**: React Native Paper + Custom components
- **Notifications**: React Native Toast Message
- **Security**: Expo Secure Store for token management
- **Image Processing**: Expo Image Picker & Image Manipulator
- **Styling**: Custom theme system with light/dark mode
- **Development**: ESLint, Prettier, Husky

## 📱 Screenshots

*Screenshots will be added here once the app is running*

## 🏗 Project Structure

```
src/
├── api/                # API services and React Query hooks
│   ├── client.ts       # Axios configuration
│   ├── services.ts     # API endpoints and React Query hooks
│   ├── passwordReset.ts# Password reset API functions
│   └── index.ts
├── components/         # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── WardrobeItemCard.tsx
│   └── index.ts
├── screens/           # Screen components
│   ├── Auth/          # Authentication screens
│   │   ├── SignInScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── CodeValidationScreen.tsx
│   │   └── index.ts
│   ├── WardrobeScreen.tsx
│   ├── AddItemScreen.tsx
│   ├── GenerateOutfitScreen.tsx
│   └── index.ts
├── navigation/        # Navigation configuration
│   ├── TabNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── index.ts
├── store/            # Zustand stores
│   ├── authStore.ts
│   ├── themeStore.ts
│   └── index.ts
├── theme/            # Theme system
│   ├── colors.ts
│   └── index.ts
├── utils/            # Utility functions
│   ├── imageUtils.ts
│   └── index.ts
├── hooks/            # Custom hooks
│   ├── useTheme.ts
│   ├── useImagePicker.ts
│   └── index.ts
└── types/            # TypeScript type definitions
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warderobe_ai_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   API_BASE_URL=http://localhost:3000
   API_TIMEOUT=10000
   NODE_ENV=development
   ENABLE_DEBUG_MODE=true
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Code Quality

The project includes automated code quality tools:

- **ESLint**: Code linting with React Native and TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### Theme System

The app supports light and dark themes. Switch themes using:

```typescript
import { useTheme } from '@/hooks';

const { theme, isDark, toggleTheme } = useTheme();
```

## 🔐 Authentication & Password Reset

### Complete Auth Flow

The app includes a full authentication system with:

- **Sign In/Sign Up**: Secure user registration and login
- **Password Reset**: Complete forgot password flow with email verification
- **Session Management**: Persistent auth state with logout functionality

### Password Reset Flow

1. **Request Reset**: User enters email → API sends verification code
2. **Code Validation**: User enters 6-digit code → Backend validates
3. **Password Reset**: User sets new password → Account updated

### Backend API Integration

The password reset feature integrates with these backend endpoints:

```typescript
// Request password reset code
POST /password-reset/request
{
  "email": "user@example.com"
}

// Validate reset code
POST /password-reset/validate
{
  "email": "user@example.com",
  "code": "123456"
}

// Reset password
POST /password-reset/reset
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePassword123"
}
```

### Usage Example

```typescript
import {
  useRequestReset,
  useValidateResetCode,
  useResetPassword,
} from '@/api';

// In your component
const requestResetMutation = useRequestReset();

const handleForgotPassword = async (email: string) => {
  try {
    await requestResetMutation.mutateAsync({ email });
    // Show success toast and navigate to code validation
  } catch (error) {
    // Handle error
  }
};
```

### Security Features

- ✅ **No Local Storage**: Reset codes are never stored locally
- ✅ **Form Validation**: Real-time password strength validation
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Session Cleanup**: Automatic form data clearing
- ✅ **Toast Notifications**: Success and error feedback

See `PASSWORD_RESET_DEMO.md` for complete implementation details.

## 🌐 OAuth Authentication

### Google & Apple Sign-In

The app supports OAuth authentication with Google and Apple:

- **🌐 Google Sign-In**: Available on all platforms
- **🍎 Apple Sign-In**: Available on iOS devices
- **🔐 Secure Token Storage**: Uses expo-secure-store for token management
- **🔄 Automatic Session Restoration**: Persistent authentication across app restarts

### Setup Instructions

1. **Google OAuth Setup**:
   ```env
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

2. **Backend Integration**:
   ```typescript
   // Google Sign-In endpoint
   POST /auth/google
   { "idToken": "google_id_token" }
   
   // Apple Sign-In endpoint  
   POST /auth/apple
   { "idToken": "apple_identity_token" }
   ```

3. **Usage Example**:
   ```typescript
   import { useOAuth } from '@/hooks';
   
   const { handleGoogleSignIn, handleAppleSignIn } = useOAuth();
   ```

### Platform Availability

- **Google Sign-In**: ✅ iOS, ✅ Android, ✅ Web
- **Apple Sign-In**: ✅ iOS only

See `OAUTH_IMPLEMENTATION.md` for complete setup and implementation details.

## 🏭 Production Build

### Using EAS Build

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas login
   eas build:configure
   ```

3. **Build for production**
   ```bash
   # Android APK
   npm run build:android
   
   # iOS IPA
   npm run build:ios
   
   # Both platforms
   npm run build:all
   ```

4. **Submit to stores**
   ```bash
   # Google Play Store
   npm run submit:android
   
   # Apple App Store
   npm run submit:ios
   ```

### Environment Configuration

For production builds, update your environment variables:

```env
API_BASE_URL=https://api.yourproductiondomain.com
NODE_ENV=production
ENABLE_DEBUG_MODE=false
```

## 🔌 Backend Integration

The app is designed to work with a NestJS backend featuring:

- **POST /api/warderobe** - Upload clothing item image
- **GET /api/warderobe/list** - Fetch all wardrobe items
- **POST /api/outfits/generate** - Generate outfit combinations

### API Response Format

```typescript
interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

## 📱 Permissions

The app requires the following permissions:

### iOS
- Camera access for taking photos
- Photo library access for selecting images

### Android
- Camera permission
- Read/Write external storage

These are automatically configured in `app.json`.

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **iOS simulator not opening**
   ```bash
   npx expo run:ios
   ```

3. **Android build errors**
   ```bash
   npx expo run:android --clean
   ```

4. **Type errors**
   ```bash
   npm run type-check
   ```

## 📚 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint && npm run type-check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI inspiration from modern fashion apps
- Icons by [Expo Vector Icons](https://icons.expo.fyi/)

---

**Happy coding! 🚀**
