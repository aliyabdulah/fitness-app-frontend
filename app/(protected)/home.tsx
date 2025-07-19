import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../component/theme';
import { TrainXStatsCard as StatsCard } from '../../component/TrainXStatsCard';
import { TodayWorkoutCard } from '../../component/TodayWorkoutCard';
import { SuggestedPT } from '../../component/SuggestedPT';
import { DailyCalories } from '../../component/DailyCalories';
import { RecentAchievements } from '../../component/RecentAchievements';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StandardizedCalendarBar } from '../../component/StandardizedCalendarBar';
import { homeApi, UserData, Workout, Trainer } from '../../api/home';
import { workoutApi } from '../../api/workouts'; // Add this import
import { getUserData, removeToken, removeUserData } from '../../api/storage';
import { useAuth } from '../../context/AuthContext';
import { useDate } from '../../context/DateContext'; // Add this import
import { useRouter } from 'expo-router';
import moment from 'moment';

const stats = [
  {
    icon: <FontAwesome5 name="shoe-prints" size={20} color={colors.blue} style={{ backgroundColor: colors.blue + '22', borderRadius: 16, padding: 6 }} />, 
    label: 'Steps',
    value: '8,247',
    unit: '/ 10k',
    trend: '+12%',
    trendColor: colors.green,
    subLabel: 'Weekly avg: 7,832',
    progress: 0.82,
    progressColor: colors.blue,
  },
  {
    icon: <FontAwesome5 name="fire" size={20} color={colors.orange} style={{ backgroundColor: colors.orange + '22', borderRadius: 16, padding: 6 }} />, 
    label: 'Calories',
    value: '642',
    unit: 'kcal',
    trend: '+8%',
    trendColor: colors.green,
    subLabel: 'Weekly avg: 594',
    progress: 0.64,
    progressColor: colors.orange,
  },
  {
    icon: <FontAwesome5 name="heart" size={20} color={colors.red} style={{ backgroundColor: colors.red + '22', borderRadius: 16, padding: 6 }} />, 
    label: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    trend: '-3%',
    trendColor: colors.red,
    subLabel: 'Resting: 68 bpm',
    progress: 0.6,
    progressColor: colors.red,
  },
  {
    icon: <FontAwesome5 name="weight" size={20} color={colors.purple} style={{ backgroundColor: colors.purple + '22', borderRadius: 16, padding: 6 }} />, 
    label: 'Weight',
    value: '78.5',
    unit: 'kg',
    trend: '-2%',
    trendColor: colors.green,
    subLabel: 'Goal: 75 kg',
    progress: 0.85,
    progressColor: colors.purple,
  },
];

const USER_AVATAR = 'http://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';

export default function HomeScreen() {
  const { selectedDate, setSelectedDate } = useDate(); // Use context instead of local state
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [suggestedTrainers, setSuggestedTrainers] = useState<Trainer[]>([]);
  const [userFirstName, setUserFirstName] = useState<string>('Ahmed'); // Add this for display
  const [userData, setUserData] = useState<any>(null); // Add this to store user data
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  // Initial load - only fetch workout dates once (like train screen)
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkoutDates();
      fetchHomeData();
      fetchUserDisplayName(); // Add this
      setIsInitialLoad(false);
    }
  }, [isAuthenticated]);

  // Separate effect for date changes - only fetch workouts, not dates (like train screen)
  useEffect(() => {
    if (isAuthenticated && !isInitialLoad) {
      fetchTodayWorkout();
    }
  }, [selectedDate, isAuthenticated, isInitialLoad]);

  const fetchHomeData = async () => {
    try {
      // Fetch user data and store it
      const user = await getUserData();
      setUserData(user);

      // Fetch suggested trainers
      const trainers = await homeApi.getSuggestedTrainers();
      setSuggestedTrainers(trainers);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  const fetchTodayWorkout = async () => {
    try {
      // Get user data directly from storage (like train screen)
      const userData = await getUserData();
      
      if (!userData?.id) return; // Use .id like train screen

      const dateString = moment(selectedDate).format('YYYY-MM-DD');
      const workoutsData = await workoutApi.getUserWorkouts(userData.id, dateString); // Use .id like train screen
      
      if (workoutsData.length > 0) {
        setTodayWorkout(workoutsData[0] as unknown as Workout);
      } else {
        setTodayWorkout(null);
      }
    } catch (error) {
      console.error('Error fetching today\'s workout:', error);
      setTodayWorkout(null);
    }
  };

  const fetchWorkoutDates = async () => {
    try {
      // Get user data directly from storage (like train screen)
      const userData = await getUserData();
      if (!userData?.id) return; // Use .id like train screen

      const startOfWeek = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD');
      const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');
      
      const { workoutDates } = await homeApi.getWeekWorkouts(userData.id, startOfWeek, endOfWeek); // Use .id like train screen
      setWorkoutDates(workoutDates);
    } catch (error) {
      console.error('Error fetching workout dates:', error);
    }
  };

  // Add function to fetch user display name
  const fetchUserDisplayName = async () => {
    try {
      const userData = await getUserData();
      setUserFirstName(userData?.firstName || '');
    } catch (error) {
      console.error('Error fetching user display name:', error);
    }
  };

  function handleDateSelect(date: Date) {
    setSelectedDate(date); // Use context setter
  }

  function handleWeekChange(startDate: Date, endDate: Date) {
    // Fetch workout dates for the new week (like train screen)
    const userData = getUserData().then(userData => {
      if (userData?.id) { // Use .id like train screen
        const startDateStr = moment(startDate).format('YYYY-MM-DD');
        const endDateStr = moment(endDate).format('YYYY-MM-DD');
        
        homeApi.getWeekWorkouts(userData.id, startDateStr, endDateStr) // Use .id like train screen
          .then(({ workoutDates }) => {
            setWorkoutDates(workoutDates);
          })
          .catch(error => console.error('Error fetching workout dates for new week:', error));
      }
    });
  }

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
          <View>
            <Text style={{ color: colors.white, fontSize: 26, fontWeight: 'bold' }}>TrainX</Text>
            {/* Get user data directly for display (like train screen) */}
            <Text style={{ color: colors.gray400, fontSize: 13, marginTop: 4 }}>
              Hello, {userFirstName}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 10, marginRight: 8 }}
              onPress={handleSignOut}
            >
              <FontAwesome5 name="power-off" size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={{ backgroundColor: 'red', width: 40, height: 40, borderRadius: 20 }}>
              <Image 
                source={{ 
                  uri: userData?.profilePicture || USER_AVATAR // Direct usage as requested
                }} 
                style={{ width: 40, height: 40, borderRadius: 20 }} 
                onError={(error) => console.log('Image loading error:', error.nativeEvent)}
                onLoad={() => console.log('Image loaded successfully')}
              />
            </View>
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
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, columnGap: 12, paddingHorizontal: 20, marginBottom: 20 }}>
          {stats.map((stat, idx) => (
            <View key={stat.label} style={{ width: '48%' }}>
              <StatsCard {...stat} />
            </View>
          ))}
        </View>
        {/* Today Workout Card - Only show if workout exists for selected date */}
        {todayWorkout && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <TodayWorkoutCard workout={todayWorkout} />
          </View>
        )}
        {/* Suggested PT */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <SuggestedPT trainers={suggestedTrainers} />
        </View>
        {/* Daily Calories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <DailyCalories />
        </View>
        {/* Recent Achievements */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <RecentAchievements />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 