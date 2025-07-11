import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { colors } from './theme';

const FILTERS = [
  'All',
  'Weight Training',
  'HIIT',
  'Yoga',
  'Cardio',
  'Pilates',
];

interface TrainXFilterBarProps {
  activeFilter: string;
  onChangeFilter: (filter: string) => void;
}

export function TrainXFilterBar({ activeFilter, onChangeFilter }: TrainXFilterBarProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 8 }} style={{ marginBottom: 8 }}>
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <TouchableOpacity
            key={filter}
            onPress={() => onChangeFilter(filter)}
            style={{
              backgroundColor: isActive ? colors.primary : colors.accent,
              borderRadius: 999,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 13, fontWeight: isActive ? '600' : '500' }}>{filter}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
} 