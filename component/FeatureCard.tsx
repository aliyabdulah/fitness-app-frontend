import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './theme';

interface FeatureCardProps extends TouchableOpacityProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  color = Colors.primary,
  onPress,
  ...props
}: FeatureCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} {...props}>
      <View style={[styles.iconContainer, { backgroundColor: color + '22' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
}); 