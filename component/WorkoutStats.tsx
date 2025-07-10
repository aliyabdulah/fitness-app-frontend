import React from 'react';
import { View, Text } from 'react-native';
import { colors } from './theme';

interface WorkoutStatsProps {
  minutes: number;
  calories: number;
  avgBpm: number;
}

export function WorkoutStats({ minutes, calories, avgBpm }: WorkoutStatsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
      <View style={{ flex: 1, backgroundColor: colors.secondary + '55', borderRadius: 12, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>{minutes}</Text>
        <Text style={{ color: colors.gray400, fontSize: 12 }}>Minutes</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: colors.secondary + '55', borderRadius: 12, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>{calories}</Text>
        <Text style={{ color: colors.gray400, fontSize: 12 }}>Calories</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: colors.secondary + '55', borderRadius: 12, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>{avgBpm}</Text>
        <Text style={{ color: colors.gray400, fontSize: 12 }}>Avg BPM</Text>
      </View>
    </View>
  );
} 