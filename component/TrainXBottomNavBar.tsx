import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';

const TABS = [
  { label: 'Home', icon: 'home' },
  { label: 'Schedule', icon: 'calendar-alt' },
  { label: 'Train', icon: 'dumbbell' },
  { label: 'Explore', icon: 'compass' },
  { label: 'Analytics', icon: 'chart-line' },
];

interface TrainXBottomNavBarProps {
  activeTab?: string;
}

export function TrainXBottomNavBar({ activeTab = 'Home' }: TrainXBottomNavBarProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.secondary, borderTopWidth: 1, borderTopColor: colors.accent + '88', paddingVertical: 12 }}>
      {TABS.map((tab) => {
        const isActive = tab.label === activeTab;
        return (
          <TouchableOpacity key={tab.label} style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome5 name={tab.icon as any} size={22} color={isActive ? colors.primary : colors.gray400} />
            <Text style={{ color: isActive ? colors.primary : colors.gray400, fontSize: 11, fontWeight: isActive ? '600' : '400', marginTop: 4 }}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 