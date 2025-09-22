import { useThemeStore } from '@/store';

export const useTheme = () => {
  const { theme, isDark, toggleTheme, setTheme } = useThemeStore();

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
};
