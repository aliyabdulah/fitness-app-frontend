import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Image, SafeAreaView } from 'react-native';
import { colors } from '../../component/theme';
import { TrainXStatsCard as StatsCard } from '../../component/TrainXStatsCard';
import { TodayWorkoutCard } from '../../component/TodayWorkoutCard';
import { SuggestedPT } from '../../component/SuggestedPT';
import { DailyCalories } from '../../component/DailyCalories';
import { RecentAchievements } from '../../component/RecentAchievements';
import { TrainXBottomNavBar as BottomNavBar } from '../../component/TrainXBottomNavBar';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StandardizedCalendarBar } from '../../component/StandardizedCalendarBar';

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

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    // TODO: Fetch data for selected date
  }

  function handleWeekChange(startDate: Date, endDate: Date) {
    // TODO: Handle week change, maybe fetch data for the new week
    console.log('Week changed:', startDate, endDate);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Status Bar (custom) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 }}>
          <Text style={{ color: colors.white, fontSize: 14 }}>9:41</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <FontAwesome5 name="signal" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <FontAwesome5 name="wifi" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <FontAwesome5 name="battery-full" size={16} color={colors.white} />
          </View>
        </View>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <View>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: 'bold' }}>TrainX</Text>
            <Text style={{ color: colors.gray400, fontSize: 12 }}>Hello, Ahmed</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 8, marginRight: 8 }}>
              <FontAwesome5 name="bell" size={18} color={colors.white} />
            </View>
            <Image source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg' }} style={{ width: 40, height: 40, borderRadius: 20 }} />
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
          <TodayWorkoutCard />
        </View>
        {/* Suggested PT */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <SuggestedPT />
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
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
} 