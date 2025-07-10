import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

interface AchievementBadgeProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  iconColor: string;
}

export function AchievementBadge({ icon, title, subtitle, bgColor, iconColor }: AchievementBadgeProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: bgColor }]}> {icon} </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 0,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.gray400,
    fontSize: 12,
    textAlign: 'center',
  },
}); 