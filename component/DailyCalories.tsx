import React from 'react';
import { View, Text } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';

const macros = [
  {
    label: 'Protein',
    icon: 'drumstick-bite',
    value: 65,
    goal: 120,
    color: colors.blue,
  },
  {
    label: 'Carbs',
    icon: 'leaf',
    value: 145,
    goal: 250,
    color: colors.green,
  },
  {
    label: 'Fats',
    icon: 'tint',
    value: 35,
    goal: 65,
    color: colors.yellow,
  },
];

export function DailyCalories() {
  const calories = 1240;
  const caloriesGoal = 2400;
  const caloriesRemaining = caloriesGoal - calories;
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.orange + '33', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <FontAwesome5 name="fire" size={24} color={colors.orange} />
          </View>
          <View>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>Daily Calories</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ color: colors.white, fontSize: 20, fontWeight: 'bold' }}>{calories}</Text>
              <Text style={{ color: colors.gray400, fontSize: 12, marginLeft: 4 }}>/ {caloriesGoal} kcal</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: colors.gray400, fontSize: 12 }}>Remaining</Text>
          <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>{caloriesRemaining}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.gray700, height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
        <View style={{ backgroundColor: colors.orange, width: `${Math.round((calories / caloriesGoal) * 100)}%`, height: 8, borderRadius: 4 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {macros.map((macro) => (
          <View key={macro.label} style={{ flex: 1, backgroundColor: colors.secondary + '88', borderRadius: 10, padding: 10, alignItems: 'center' }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: macro.color + '33', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <FontAwesome5 name={macro.icon as any} size={16} color={macro.color} />
            </View>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>{macro.label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ color: colors.white, fontSize: 14, fontWeight: 'bold' }}>{macro.value}g</Text>
              <Text style={{ color: colors.gray400, fontSize: 10, marginLeft: 2 }}>/ {macro.goal}g</Text>
            </View>
            <View style={{ backgroundColor: colors.gray700, height: 4, borderRadius: 2, overflow: 'hidden', width: '100%', marginTop: 4 }}>
              <View style={{ backgroundColor: macro.color, width: `${Math.round((macro.value / macro.goal) * 100)}%`, height: 4, borderRadius: 2 }} />
            </View>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.secondary + '55', borderRadius: 10, padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <FontAwesome5 name="utensils" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>Today's Intake</Text>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>Track your meals</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>3</Text>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>Meals</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>2</Text>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>Snacks</Text>
          </View>
        </View>
      </View>
    </View>
  );
} 