import { create } from 'zustand';
import { lightTheme, darkTheme, Theme } from '@/theme';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>(set => ({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () =>
    set(state => ({
      isDark: !state.isDark,
      theme: !state.isDark ? darkTheme : lightTheme,
    })),
  setTheme: (isDark: boolean) =>
    set(() => ({
      isDark,
      theme: isDark ? darkTheme : lightTheme,
    })),
}));
