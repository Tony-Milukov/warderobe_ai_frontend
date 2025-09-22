import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  style,
  contentStyle,
  titleStyle,
}) => {
  const { theme } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  const titleTextStyle: TextStyle = {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  };

  return (
    <View style={[cardStyle, style]}>
      {title && <Text style={[titleTextStyle, titleStyle]}>{title}</Text>}
      <View style={contentStyle}>{children}</View>
    </View>
  );
};
