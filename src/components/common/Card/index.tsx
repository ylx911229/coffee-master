import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../../styles/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof theme.spacing;
  shadow?: keyof typeof theme.shadows;
  borderRadius?: keyof typeof theme.borderRadius;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'sm',
  borderRadius = 'md',
  testID,
}) => {
  const cardStyle = [
    styles.base,
    { padding: theme.spacing[padding] },
    { borderRadius: theme.borderRadius[borderRadius] },
    theme.shadows[shadow],
    style,
  ];

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.card,
    marginVertical: theme.spacing.xs,
  },
});