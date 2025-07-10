import React from 'react';
import { View, Text, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from './theme';

const achievements: {
  label: string;
  icon: string;
  gradient: [ColorValue, ColorValue];
  borderColor: string;
}[] = [
  {
    label: '10K Steps Goal',
    icon: 'trophy',
    gradient: ['#FACC15', '#FDE68A'],
    borderColor: '#FACC15',
  },
  {
    label: 'Calorie Crusher',
    icon: 'fire',
    gradient: [colors.primary, '#FF7F50'],
    borderColor: colors.primary,
  },
];

export function RecentAchievements() {
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Recent Achievements</Text>
        <Text style={{ color: colors.primary, fontSize: 12 }}>View All</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {achievements.map((ach, idx) => (
          <View key={ach.label} style={{ flex: 1, alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: ach.borderColor + '33', padding: 12, backgroundColor: String(ach.gradient[0]) + '11', marginRight: idx === 0 ? 12 : 0 }}>
            <LinearGradient colors={ach.gradient} style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <FontAwesome5 name={ach.icon} size={28} color={colors.white} />
            </LinearGradient>
            <Text style={{ color: colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' }}>{ach.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
} 