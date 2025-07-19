import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; // Remove useLocalSearchParams since we're using context
import { colors } from '../../component/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { TrainWorkoutCard } from '../../component/TrainWorkoutCard';
import { ExerciseList, Exercise, ExerciseState } from '../../component/ExerciseList';
import { WorkoutStats } from '../../component/WorkoutStats';
import { AddTrainingModal } from '../../component/AddTrainingModal';
import { StandardizedCalendarBar } from '../../component/StandardizedCalendarBar';
import { workoutApi } from '../../api/workouts';
import { homeApi } from '../../api/home';
import { useAuth } from '../../context/AuthContext';
import { useDate } from '../../context/DateContext'; // Add this import
import { getUserData, removeToken, removeUserData } from '../../api/storage';
import { EmptyState } from '../../component/EmptyState';
import moment from 'moment';

const USER_AVATAR = 'http://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';

export default function TrainScreen() {
  const { selectedDate, setSelectedDate } = useDate(); // Use context instead of local state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutState, setWorkoutState] = useState<'running' | 'paused'>('running');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  // Remove the useEffect for selectedDateParam since we're using context

  // Initial load - only fetch workout dates once
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkoutDates();
      fetchWorkouts();
      setIsInitialLoad(false);
    }
  }, [isAuthenticated]);

  // Separate effect for date changes - only fetch workouts, not dates
  useEffect(() => {
    if (isAuthenticated && !isInitialLoad) {
      fetchWorkouts();
    }
  }, [selectedDate, isAuthenticated, isInitialLoad]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear authentication state
              setIsAuthenticated(false);
              
              // Remove stored data
              await removeToken();
              await removeUserData();
              
              // Navigate to login screen
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  async function fetchWorkouts() {
    try {
      // Only show loading on initial load, not on date changes
      if (isInitialLoad) {
        setIsLoading(true);
      }
      
      // Get user data from storage
      const userData = await getUserData();
      
      if (!userData?.id) {
        setExercises([]);
        setHasData(false);
        return;
      }

      // Fix timezone issue: use moment to format date in local timezone
      const dateString = moment(selectedDate).format('YYYY-MM-DD');
      const workoutsData = await workoutApi.getUserWorkouts(userData.id, dateString);
      
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
        setHasData(true);
      } else {
        setCurrentWorkout(null);
        setExercises([]);
        setHasData(false);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setExercises([]);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  }

  // Updated to use the same optimized approach as home screen
  async function fetchWorkoutDates() {
    try {
      const userData = await getUserData();
      if (!userData?.id) return;

      // Get current week's start and end dates
      const startOfWeek = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD'); // Monday
      const endOfWeek = moment().endOf('week').format('YYYY-MM-DD'); // Sunday
      
      const { workoutDates } = await homeApi.getWeekWorkouts(userData.id, startOfWeek, endOfWeek);
      setWorkoutDates(workoutDates);
    } catch (error) {
      console.error('Error fetching workout dates:', error);
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
    setSelectedDate(date); // Use context setter
  }
  
  function handleWeekChange(startDate: Date, endDate: Date) {
    // Fetch workout dates for the new week
    const userData = getUserData().then(userData => {
      if (userData?.id) {
        const startDateStr = moment(startDate).format('YYYY-MM-DD');
        const endDateStr = moment(endDate).format('YYYY-MM-DD');
        
        homeApi.getWeekWorkouts(userData.id, startDateStr, endDateStr)
          .then(({ workoutDates }) => {
            setWorkoutDates(workoutDates);
          })
          .catch(error => console.error('Error fetching workout dates for new week:', error));
      }
    });
  }

  const completedCount = exercises.filter(e => e.state === 'completed').length;

  // Add navigation function
  const handleExplorePress = () => {
    router.push('/(protected)/explore');
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
      }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // Show empty state when no data
  if (!hasData || exercises.length === 0) {
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
              <TouchableOpacity 
                style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 10, marginRight: 8 }}
                onPress={handleSignOut}
              >
                <FontAwesome5 name="power-off" size={18} color={colors.white} />
              </TouchableOpacity>
              <Image source={{ uri: USER_AVATAR }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            </View>
          </View>
          
          {/* Calendar Bar */}
          <View style={{ paddingHorizontal: 24 }}>
            <StandardizedCalendarBar
              onDateSelect={handleDateSelect}
              onWeekChange={handleWeekChange}
              workoutDates={workoutDates}
            />
          </View>
          
          {/* Empty State */}
          <EmptyState
            icon="dumbbell"
            title="No exercises today"
            message="Get a personal trainer to set up your workout plan! They'll create customized exercises tailored to your fitness goals and schedule."
            iconColor={colors.primary}
            showExploreButton={true}
            onExplorePress={handleExplorePress}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            <TouchableOpacity 
              style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 10, marginRight: 8 }}
              onPress={handleSignOut}
            >
              <FontAwesome5 name="power-off" size={18} color={colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: USER_AVATAR }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </View>
        </View>
        
        {/* Calendar Bar */}
        <View style={{ paddingHorizontal: 24 }}>
          <StandardizedCalendarBar
            onDateSelect={handleDateSelect}
            onWeekChange={handleWeekChange}
            workoutDates={workoutDates}
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
        {/* <View style={{ paddingHorizontal: 24 }}>
          <WorkoutStats 
            minutes={currentWorkout?.duration || 28} 
            calories={currentWorkout?.caloriesBurned || 320} 
            avgBpm={currentWorkout?.averageHeartRate || 142} 
          />
        </View> */}
        
        {/* Continue/Pause Buttons */}
        {/* <View style={{ paddingHorizontal: 24, flexDirection: 'row', gap: 12, marginBottom: 32 }}>
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
        </View> */}
      </ScrollView>
      <AddTrainingModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
} 