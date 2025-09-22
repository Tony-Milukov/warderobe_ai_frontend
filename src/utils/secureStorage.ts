import * as SecureStore from 'expo-secure-store';

// Keys for storing auth tokens
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export const secureStorage = {
  // Token management
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY),
    ]);
  },

  // User data management
  async setUserData(userData: object): Promise<void> {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  },

  async getUserData(): Promise<object | null> {
    const data = await SecureStore.getItemAsync(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  },
};
