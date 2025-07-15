import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from './theme';

interface WorkoutCardProps {
  workoutName: string;
  duration: string;
  time: string;
  muscles: string[];
  progress: { completed: number; total: number };
  // onViewSchedule: () => void; //removing schedule for now
}

export function TrainWorkoutCard({ workoutName, duration, time, muscles, progress }: WorkoutCardProps) {
  const percent = progress.total > 0 ? (progress.completed / progress.total) : 0;
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 20, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Today's Workout</Text>
        {/* removing schedule for now */}
        {/* <TouchableOpacity onPress={onViewSchedule}>
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '500' }}>View Schedule</Text>
        </TouchableOpacity> */}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
          <FontAwesome5 name="dumbbell" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontSize: 16, fontWeight: '500', marginBottom: 2 }}>{workoutName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="clock" size={12} color={colors.gray400} style={{ marginRight: 4 }} />
              <Text style={{ color: colors.gray400, fontSize: 12 }}>{duration}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="calendar" size={12} color={colors.gray400} style={{ marginRight: 4 }} />
              <Text style={{ color: colors.gray400, fontSize: 12 }}>{time}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: colors.secondary + '88', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>Progress</Text>
          <Text style={{ color: colors.gray400, fontSize: 12 }}>{progress.completed} of {progress.total} exercises</Text>
        </View>
        <View style={{ backgroundColor: colors.gray700, height: 6, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
          <View style={{ backgroundColor: colors.primary, width: `${Math.round(percent * 100)}%`, height: 6, borderRadius: 4 }} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {muscles.map((muscle) => (
            <Text key={muscle} style={{ backgroundColor: colors.primary + '33', color: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, fontSize: 12, marginRight: 4, marginBottom: 4 }}>{muscle}</Text>
          ))}
        </View>
      </View>
    </View>
  );
} 