import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../component/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { TrainWorkoutCard } from '../../component/TrainWorkoutCard';
import { ExerciseList, Exercise, ExerciseState } from '../../component/ExerciseList';
import { WorkoutStats } from '../../component/WorkoutStats';
import { AddTrainingModal } from '../../component/AddTrainingModal';
import { StandardizedCalendarBar } from '../../component/StandardizedCalendarBar';
import { workoutApi } from '../../api/workouts';
import { useAuth } from '../../context/AuthContext';
import { getUserData } from '../../api/storage';

const USER_AVATAR = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';

// Fallback data to maintain appearance when no backend data
const fallbackExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', sets: 4, reps: '8-12', state: 'completed' },
  { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-15', state: 'completed' },
  { id: '3', name: 'Shoulder Press', sets: 3, reps: '12-15', state: 'completed' },
  { id: '4', name: 'Lateral Raises', sets: 3, reps: '15-20', state: 'current' },
  { id: '5', name: 'Tricep Dips', sets: 3, reps: '12-15', state: 'pending' },
  { id: '6', name: 'Pull-ups', sets: 3, reps: '8-10', state: 'pending' },
];

export default function TrainScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exercises, setExercises] = useState<Exercise[]>(fallbackExercises);
  const [workoutState, setWorkoutState] = useState<'running' | 'paused'>('running');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkouts();
    }
  }, [isAuthenticated, selectedDate]);

  async function fetchWorkouts() {
    try {
      setIsLoading(true);
      
      // Get user data from storage
      const userData = await getUserData();
      if (!userData?._id) {
        console.log('No user ID found in storage');
        setExercises(fallbackExercises);
        return;
      }

      const dateString = selectedDate.toISOString().split('T')[0];
      const workoutsData = await workoutApi.getUserWorkouts(userData._id, dateString);
      
      if (workoutsData.length > 0) {
        const workout = workoutsData[0];
        setCurrentWorkout(workout);
        setExercises(workout.exercises.map((ex: any) => ({
          id: ex.exerciseId._id || ex.exerciseId,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          state: ex.state,
        })));
      } else {
        // Keep fallback data if no workout found
        setCurrentWorkout(null);
        setExercises(fallbackExercises);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      // Keep fallback data on error
      setExercises(fallbackExercises);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleExercise(id: string) {
    try {
      const exercise = exercises.find(ex => ex.id === id);
      if (!exercise) return;

      // Cycle state: pending -> current -> completed -> pending
      const nextState: Record<ExerciseState, ExerciseState> = {
        pending: 'current',
        current: 'completed',
        completed: 'pending',
      };
      const newState = nextState[exercise.state];

      // Update local state immediately for better UX
      setExercises(prev =>
        prev.map(ex => ex.id === id ? { ...ex, state: newState } : ex)
      );

      // Update backend if workout exists
      if (currentWorkout) {
        await workoutApi.updateWorkoutExercise(currentWorkout._id, id, {
          state: newState,
        });
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
      // Revert on error
      await fetchWorkouts();
    }
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
  }
  
  function handleWeekChange(startDate: Date, endDate: Date) {
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
            workoutName={currentWorkout?.name || "Upper Body Strength"}
            duration={currentWorkout ? `${currentWorkout.duration} min` : "45 min"}
            time={currentWorkout ? new Date(currentWorkout.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "2:30 PM"}
            muscles={currentWorkout?.muscleGroups || ["Chest", "Shoulders", "Triceps", "Back"]}
            progress={{ completed: completedCount, total: exercises.length }}
          />
        </View>
        
        {/* Exercise List */}
        <View style={{ paddingHorizontal: 24 }}>
          <ExerciseList exercises={exercises} onToggleState={handleToggleExercise} />
        </View>
        
        {/* Workout Stats */}
        <View style={{ paddingHorizontal: 24 }}>
          <WorkoutStats 
            minutes={currentWorkout?.duration || 28} 
            calories={currentWorkout?.caloriesBurned || 320} 
            avgBpm={currentWorkout?.averageHeartRate || 142} 
          />
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