import React from 'react';
import { View, Text } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface TrainXStatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend: string;
  trendColor: string;
  subLabel: string;
  progress: number; // 0-1
  progressColor: string;
}

export function TrainXStatsCard({
  icon,
  label,
  value,
  unit,
  trend,
  trendColor,
  subLabel,
  progress,
  progressColor,
}: TrainXStatsCardProps) {
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 16, flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon}
          <Text style={{ color: colors.light, fontSize: 12, marginLeft: 8 }}>{label}</Text>
        </View>
        <Text style={{ color: trendColor, fontSize: 12 }}>{trend}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 }}>
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: 'bold' }}>{value}</Text>
        {unit ? <Text style={{ color: colors.gray400, fontSize: 12, marginLeft: 4 }}>{unit}</Text> : null}
      </View>
      <Text style={{ color: colors.gray400, fontSize: 12, marginBottom: 8 }}>{subLabel}</Text>
      <View style={{ backgroundColor: colors.gray700, height: 4, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ backgroundColor: progressColor, width: `${Math.round(progress * 100)}%`, height: 4, borderRadius: 4 }} />
      </View>
    </View>
  );
} 