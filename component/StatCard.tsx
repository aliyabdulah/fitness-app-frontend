import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './theme';
import Card from './Card';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  target?: string;
  progress?: number; // 0-100
  progressColor?: string;
}

export default function StatCard({
  icon,
  title,
  value,
  target,
  progress,
  progressColor = Colors.primary,
}: StatCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <Text style={styles.value}>{value}</Text>
      
      {target && <Text style={styles.target}>{target}</Text>}
      
      {progress !== undefined && (
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(100, Math.max(0, progress))}%`,
                backgroundColor: progressColor 
              }
            ]} 
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  target: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
}); 