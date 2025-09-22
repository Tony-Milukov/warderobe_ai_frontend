# Password Reset API Integration Demo

This document demonstrates how the password reset flow integrates with the backend API.

## Backend API Endpoints

### 1. Request Password Reset
```http
POST /password-reset/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reset code sent to your email"
  },
  "message": "Success"
}
```

### 2. Validate Reset Code
```http
POST /password-reset/validate
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "Code is valid"
  },
  "message": "Success"
}
```

### 3. Reset Password
```http
POST /password-reset/reset
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  },
  "message": "Success"
}
```

## Frontend Usage Examples

### Using the API hooks

```typescript
import {
  useRequestReset,
  useValidateResetCode,
  useResetPassword,
} from '@/api';

// In a component
const requestResetMutation = useRequestReset();
const validateCodeMutation = useValidateResetCode();
const resetPasswordMutation = useResetPassword();

// Request reset code
const handleRequestReset = async () => {
  try {
    await requestResetMutation.mutateAsync({ email: 'user@example.com' });
    console.log('Reset code sent!');
  } catch (error) {
    console.error('Failed to send reset code:', error);
  }
};

// Validate code
const handleValidateCode = async () => {
  try {
    const result = await validateCodeMutation.mutateAsync({
      email: 'user@example.com',
      code: '123456'
    });
    if (result.valid) {
      console.log('Code is valid!');
    }
  } catch (error) {
    console.error('Invalid code:', error);
  }
};

// Reset password
const handleResetPassword = async () => {
  try {
    await resetPasswordMutation.mutateAsync({
      email: 'user@example.com',
      code: '123456',
      newPassword: 'NewSecurePassword123'
    });
    console.log('Password reset successfully!');
  } catch (error) {
    console.error('Failed to reset password:', error);
  }
};
```

## Navigation Flow

1. **SignInScreen** → User clicks "Forgot password?" → **ForgotPasswordScreen**
2. **ForgotPasswordScreen** → User enters email and submits → **CodeValidationScreen**
3. **CodeValidationScreen** → User validates code and sets new password → **SignInScreen**

## Security Features

- ✅ Reset codes are not stored locally beyond form state
- ✅ Form data is cleared on navigation back
- ✅ Strong password validation (8+ chars, uppercase, lowercase, number)
- ✅ Real-time form validation with error display
- ✅ API error handling with user-friendly messages
- ✅ Toast notifications for success/error feedback

## Error Handling

The implementation includes comprehensive error handling:

- **Network errors**: Graceful fallback with retry options
- **Invalid codes**: Clear error messages below input fields
- **Weak passwords**: Real-time validation feedback
- **API errors**: Server error messages displayed to user
- **Form validation**: Immediate feedback on invalid inputs

## UI Components Used

- **react-native-paper**: Modern Material Design components
- **react-native-toast-message**: Toast notifications
- **Custom theme system**: Consistent styling across screens
- **Responsive design**: Works on all screen sizes
