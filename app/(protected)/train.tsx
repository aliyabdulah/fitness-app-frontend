import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../component/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { TrainWorkoutCard } from '../../component/TrainWorkoutCard';
import { ExerciseList, Exercise, ExerciseState } from '../../component/ExerciseList';
import { WorkoutStats } from '../../component/WorkoutStats';
import { AddTrainingModal } from '../../component/AddTrainingModal';
import { StandardizedCalendarBar } from '../../component/StandardizedCalendarBar';

const USER_AVATAR = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';

const initialExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', sets: 4, reps: '8-12', state: 'completed' },
  { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-15', state: 'completed' },
  { id: '3', name: 'Shoulder Press', sets: 3, reps: '12-15', state: 'completed' },
  { id: '4', name: 'Lateral Raises', sets: 3, reps: '15-20', state: 'current' },
  { id: '5', name: 'Tricep Dips', sets: 3, reps: '12-15', state: 'pending' },
  { id: '6', name: 'Pull-ups', sets: 3, reps: '8-10', state: 'pending' },
];

export default function TrainScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [workoutState, setWorkoutState] = useState<'running' | 'paused'>('running');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  function handleToggleExercise(id: string) {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== id) return ex;
        // Cycle state: pending -> current -> completed -> pending
        const nextState: Record<ExerciseState, ExerciseState> = {
          pending: 'current',
          current: 'completed',
          completed: 'pending',
        };
        return { ...ex, state: nextState[ex.state] };
      })
    );
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    // TODO: Fetch exercises for selected date
  }
  
  function handleWeekChange(startDate: Date, endDate: Date) {
    // TODO: Handle week change, maybe fetch data for the new week
    console.log('Week changed:', startDate, endDate);
  }

  const completedCount = exercises.filter(e => e.state === 'completed').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
          <View>
            <Text style={{ color: colors.white, fontSize: 26, fontWeight: 'bold' }}>Exercises</Text>
            <Text style={{ color: colors.gray400, fontSize: 13, marginTop: 4 }}>Find your workout</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 10, marginRight: 8 }}>
              <FontAwesome5 name="bell" size={18} color={colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: USER_AVATAR }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </View>
        </View>
        {/* Calendar Bar */}
        <View style={{ paddingHorizontal: 24 }}>
          <StandardizedCalendarBar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onWeekChange={handleWeekChange}
          />
        </View>
        {/* Workout Card */}
        <View style={{ paddingHorizontal: 24 }}>
          <TrainWorkoutCard
            workoutName="Upper Body Strength"
            duration="45 min"
            time="2:30 PM"
            muscles={["Chest", "Shoulders", "Triceps", "Back"]}
            progress={{ completed: completedCount, total: exercises.length }}
            onViewSchedule={() => router.push('/(protected)/schedule')}
          />
        </View>
        {/* Exercise List */}
        <View style={{ paddingHorizontal: 24 }}>
          <ExerciseList exercises={exercises} onToggleState={handleToggleExercise} />
          {/* Add Training Button */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ backgroundColor: colors.secondary + '55', borderStyle: 'dashed', borderWidth: 2, borderColor: colors.primary + '55', borderRadius: 12, padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="plus" size={16} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '500' }}>Add Training</Text>
          </TouchableOpacity>
        </View>
        {/* Workout Stats */}
        <View style={{ paddingHorizontal: 24 }}>
          <WorkoutStats minutes={28} calories={320} avgBpm={142} />
        </View>
        {/* Continue/Pause Buttons */}
        <View style={{ paddingHorizontal: 24, flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => setWorkoutState(workoutState === 'running' ? 'paused' : 'running')}
            style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.8}
          >
            <FontAwesome5 name={workoutState === 'running' ? 'play' : 'pause'} size={18} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.white, fontSize: 15, fontWeight: '500' }}>{workoutState === 'running' ? 'Continue Workout' : 'Paused'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setWorkoutState(workoutState === 'running' ? 'paused' : 'running')}
            style={{ paddingHorizontal: 20, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.8}
          >
            <FontAwesome5 name={workoutState === 'running' ? 'pause' : 'play'} size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AddTrainingModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
} 