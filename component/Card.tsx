import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors, Spacing, BorderRadius } from './theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: keyof typeof Spacing;
}

export default function Card({
  variant = 'default',
  padding = 'lg',
  style,
  children,
  ...props
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    { padding: Spacing[padding] },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
  },
  default: {
    backgroundColor: Colors.card,
  },
  outlined: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
  },
  elevated: {
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 