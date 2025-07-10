import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from './theme';

export type ExerciseState = 'completed' | 'current' | 'pending';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  state: ExerciseState;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onToggleState: (id: string) => void;
}

export function ExerciseList({ exercises, onToggleState }: ExerciseListProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      {exercises.map((ex) => {
        let icon, iconBg, iconColor, rightText, rightColor, cardBg, border = undefined, opacity = 1;
        if (ex.state === 'completed') {
          icon = 'check';
          iconBg = colors.green + '33';
          iconColor = colors.green;
          rightText = 'Completed';
          rightColor = colors.green;
          cardBg = colors.secondary + '55';
        } else if (ex.state === 'current') {
          icon = 'play';
          iconBg = colors.primary + '33';
          iconColor = colors.primary;
          rightText = 'Current';
          rightColor = colors.primary;
          cardBg = colors.primary + '11';
          border = { borderWidth: 1, borderColor: colors.primary + '33' };
        } else {
          icon = 'circle';
          iconBg = colors.gray700;
          iconColor = colors.gray400;
          rightText = 'Pending';
          rightColor = colors.gray400;
          cardBg = colors.secondary + '33';
          opacity = 0.6;
        }
        return (
          <TouchableOpacity
            key={ex.id}
            onPress={() => onToggleState(ex.id)}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 10, opacity, ...(border || {}) }}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <FontAwesome5 name={icon as any} size={16} color={iconColor} />
              </View>
              <View>
                <Text style={{ color: colors.white, fontSize: 15, fontWeight: '500' }}>{ex.name}</Text>
                <Text style={{ color: colors.gray400, fontSize: 12, marginTop: 2 }}>{ex.sets} sets × {ex.reps} reps</Text>
              </View>
            </View>
            <Text style={{ color: rightColor, fontSize: 13, fontWeight: ex.state === 'current' ? '600' : '500' }}>{rightText}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 