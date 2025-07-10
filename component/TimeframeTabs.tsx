import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

interface TimeframeTabsProps {
  value: 'daily' | 'weekly' | 'monthly';
  onChange: (val: 'daily' | 'weekly' | 'monthly') => void;
}

const TABS: Array<{ key: 'daily' | 'weekly' | 'monthly'; label: string }> = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export function TimeframeTabs({ value, onChange }: TimeframeTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const selected = value === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selected && styles.selectedTab]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={selected ? { selected: true } : {}}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 4,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.gray400,
    fontSize: 15,
    fontWeight: '600',
  },
  selectedLabel: {
    color: colors.white,
  },
}); 