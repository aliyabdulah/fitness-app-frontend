import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './theme';
import Card from './Card';

interface QuickActionCardProps extends TouchableOpacityProps {
  title: string;
  icon: string;
  color?: string;
}

export default function QuickActionCard({
  title,
  icon,
  color = Colors.primary,
  onPress,
  ...props
}: QuickActionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <Card 
        style={[styles.container, { borderColor: color }]}
        variant="outlined"
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.xs,
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
}); 