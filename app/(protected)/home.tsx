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
import { getUserData, removeToken, removeUserData } from '../../api/storage';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

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

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [suggestedTrainers, setSuggestedTrainers] = useState<Trainer[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchHomeData();
    }
  }, [isAuthenticated]);

  // Fetch data when date changes
  useEffect(() => {
    if (isAuthenticated && userData?._id) {
      fetchTodayWorkout();
    }
  }, [selectedDate, userData]);

  const fetchHomeData = async () => {
    try {
      const user = await getUserData();
      setUserData(user as UserData);

      // Fetch suggested trainers
      const trainers = await homeApi.getSuggestedTrainers();
      setSuggestedTrainers(trainers);

      // Fetch today's workout
      if (user?._id) {
        const workout = await homeApi.getTodayWorkout(user._id);
        setTodayWorkout(workout);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  const fetchTodayWorkout = async () => {
    try {
      if (userData?._id) {
        const workout = await homeApi.getTodayWorkout(userData._id);
        setTodayWorkout(workout);
      }
    } catch (error) {
      console.error('Error fetching today\'s workout:', error);
    }
  };

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
  }

  function handleWeekChange(startDate: Date, endDate: Date) {
    console.log('Week changed:', startDate, endDate);
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <View>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: 'bold' }}>TrainX</Text>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>Hello, {userData?.firstName || 'Ahmed'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 8, marginRight: 8 }}
              onPress={handleSignOut}
            >
              <FontAwesome5 name="power-off" size={18} color={colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: userData?.profilePicture || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg' }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </View>
        </View>
        {/* Calendar Bar */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
          <StandardizedCalendarBar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onWeekChange={handleWeekChange}
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
        {/* Today Workout Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <TodayWorkoutCard workout={todayWorkout} />
        </View>
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