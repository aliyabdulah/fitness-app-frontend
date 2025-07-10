import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

interface NutritionCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  goal: string;
  percent: number; // 0-100
  change: string;
  changeColor: string;
  barColor: string;
}

export function NutritionCard({ icon, label, value, goal, percent, change, changeColor, barColor }: NutritionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: barColor + '22' }]}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value} / {goal}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.bar, { width: `${percent}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.percent}>{percent}% of daily goal</Text>
        <Text style={[styles.change, { color: changeColor }]}>{change}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    flex: 1,
    color: colors.gray400,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  barBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray700,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percent: {
    color: colors.gray400,
    fontSize: 12,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 