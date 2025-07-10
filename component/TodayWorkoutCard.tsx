import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from './theme';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export function TodayWorkoutCard() {
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 16 }}>
      <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Today Workout</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
          <FontAwesome5 name="dumbbell" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontSize: 16, fontWeight: '500', marginBottom: 2 }}>Upper Body Strength</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="clock" size={12} color={colors.gray400} style={{ marginRight: 4 }} />
              <Text style={{ color: colors.gray400, fontSize: 12 }}>45 min</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="calendar" size={12} color={colors.gray400} style={{ marginRight: 4 }} />
              <Text style={{ color: colors.gray400, fontSize: 12 }}>2:30 PM</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: colors.secondary + '88', borderRadius: 10, padding: 10, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Chest', 'Shoulders', 'Triceps', 'Back'].map((muscle) => (
            <Text key={muscle} style={{ backgroundColor: colors.primary + '33', color: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 12, marginRight: 4, marginBottom: 4 }}>{muscle}</Text>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesome5 name="play" size={16} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="format-list-bulleted" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
} 