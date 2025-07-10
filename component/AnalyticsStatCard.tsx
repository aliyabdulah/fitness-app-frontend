import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

interface AnalyticsStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  change: string;
  changeColor: string;
  goal?: string;
  miniChart?: React.ReactNode;
  color: string; // icon bg
  accentColor: string; // for progress bar/chart
}

export function AnalyticsStatCard({ icon, label, value, unit, change, changeColor, goal, miniChart, color, accentColor }: AnalyticsStatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: color }]}> {icon} </View>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.change, { color: changeColor }]}>{change}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {goal ? <Text style={styles.goal}>{goal}</Text> : null}
      {miniChart ? <View style={{ marginTop: 8 }}>{miniChart}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    minWidth: 0,
    flex: 1,
    marginBottom: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    flex: 1,
    color: colors.gray400,
    fontSize: 13,
    fontWeight: '600',
  },
  change: {
    fontSize: 13,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  value: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  unit: {
    color: colors.gray400,
    fontSize: 13,
    marginLeft: 4,
    marginBottom: 2,
  },
  goal: {
    color: colors.gray400,
    fontSize: 12,
    marginBottom: 2,
  },
}); 