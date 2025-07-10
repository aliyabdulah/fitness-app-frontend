import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../../component/theme';
import { TimeframeTabs } from '../../component/TimeframeTabs';
import { AnalyticsStatCard as StatCard } from '../../component/AnalyticsStatCard';
import { ProgressGraph } from '../../component/ProgressGraph';
import { NutritionCard } from '../../component/NutritionCard';
import { AchievementBadge } from '../../component/AchievementBadge';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const STAT_CARDS = [
  {
    key: 'weight',
    icon: <FontAwesome5 name="weight" size={16} color={colors.purple} />, label: 'Weight', value: '78.5', unit: 'kg', change: '-2%', changeColor: colors.green, goal: 'Goal: 75 kg', color: colors.purple + '33', accentColor: colors.purple,
    miniChart: <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 18, marginTop: 2 }}>
      {[4, 3, 5, 2, 4, 6, 5].map((h, i) => (
        <View key={i} style={{ width: 3, height: h * 3, backgroundColor: colors.purple, opacity: 0.3 + 0.1 * i, borderRadius: 2, marginRight: 2 }} />
      ))}
    </View>
  },
  {
    key: 'steps',
    icon: <FontAwesome5 name="shoe-prints" size={16} color={colors.blue} />, label: 'Steps', value: '8,247', unit: '/ 10k', change: '+12%', changeColor: colors.green, goal: '+12% this week', color: colors.blue + '33', accentColor: colors.blue,
    miniChart: <View style={{ width: '100%', backgroundColor: colors.gray700, height: 6, borderRadius: 4, overflow: 'hidden', marginTop: 2 }}><View style={{ backgroundColor: colors.blue, width: '82%', height: 6, borderRadius: 4 }} /></View>
  },
  {
    key: 'calories',
    icon: <FontAwesome5 name="fire" size={16} color={colors.orange} />, label: 'Calories', value: '642', unit: 'kcal', change: '+8%', changeColor: colors.green, goal: '+8% this week', color: colors.orange + '33', accentColor: colors.orange,
    miniChart: null // Could add a mini chart if desired
  },
  {
    key: 'heart',
    icon: <FontAwesome5 name="heart" size={16} color={colors.red} />, label: 'Heart Rate', value: '72', unit: 'bpm', change: '-3%', changeColor: colors.red, goal: 'Resting: 68 bpm', color: colors.red + '33', accentColor: colors.red,
    miniChart: null // Could add a mini chart if desired
  },
];

const PROGRESS_GRAPHS = {
  weight: {
    data: [
      { x: 'Mon', y: 80.2 }, { x: 'Tue', y: 79.8 }, { x: 'Wed', y: 79.5 }, { x: 'Thu', y: 79.1 }, { x: 'Fri', y: 78.8 }, { x: 'Sat', y: 78.5 }, { x: 'Sun', y: 78.5 }
    ],
    color: colors.purple,
    label: 'Weight (kg)'
  },
  steps: {
    data: [
      { x: 'Mon', y: 7500 }, { x: 'Tue', y: 8200 }, { x: 'Wed', y: 9100 }, { x: 'Thu', y: 8800 }, { x: 'Fri', y: 9500 }, { x: 'Sat', y: 8247 }, { x: 'Sun', y: 8900 }
    ],
    color: colors.blue,
    label: 'Steps'
  },
  muscle: {
    data: [
      { x: 'Mon', y: 45.2 }, { x: 'Tue', y: 45.4 }, { x: 'Wed', y: 45.6 }, { x: 'Thu', y: 45.8 }, { x: 'Fri', y: 46.0 }, { x: 'Sat', y: 46.2 }, { x: 'Sun', y: 46.4 }
    ],
    color: colors.green,
    label: 'Muscle Mass (kg)'
  }
};

const NUTRITION_CARDS = [
  {
    key: 'protein',
    icon: <MaterialCommunityIcons name="food-drumstick" size={16} color={colors.blue} />, label: 'Protein', value: '65g', goal: '120g', percent: 54, change: '+5% from yesterday', changeColor: colors.green, barColor: colors.blue
  },
  {
    key: 'carbs',
    icon: <MaterialCommunityIcons name="leaf" size={16} color={colors.green} />, label: 'Carbs', value: '145g', goal: '250g', percent: 58, change: '-2% from yesterday', changeColor: colors.red, barColor: colors.green
  },
  {
    key: 'fats',
    icon: <MaterialCommunityIcons name="water" size={16} color={colors.yellow} />, label: 'Fats', value: '35g', goal: '65g', percent: 54, change: '+8% from yesterday', changeColor: colors.green, barColor: colors.yellow
  },
];

const ACHIEVEMENTS = [
  {
    key: 'steps',
    icon: <FontAwesome5 name="trophy" size={24} color={colors.yellow} />, title: '10K Steps', subtitle: 'Completed Today', bgColor: colors.yellow + '22', iconColor: colors.yellow
  },
  {
    key: 'workouts',
    icon: <FontAwesome5 name="medal" size={24} color={colors.green} />, title: '3x Workouts', subtitle: 'This Week', bgColor: colors.green + '22', iconColor: colors.green
  },
  {
    key: 'streak',
    icon: <FontAwesome5 name="fire" size={24} color={colors.blue} />, title: '7 Day Streak', subtitle: 'Keep Going!', bgColor: colors.blue + '22', iconColor: colors.blue
  },
  {
    key: 'weight',
    icon: <FontAwesome5 name="star" size={24} color={colors.purple} />, title: 'Weight Goal', subtitle: '85% Complete', bgColor: colors.purple + '22', iconColor: colors.purple
  },
];

const PROGRESS_TABS = [
  { key: 'weight', label: 'Weight' },
  { key: 'steps', label: 'Steps' },
  { key: 'muscle', label: 'Muscle' },
];

export default function AnalyticsScreen() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [progressTab, setProgressTab] = useState<'weight' | 'steps' | 'muscle'>('weight');
  const [period, setPeriod] = useState(3); // week index for demo

  // Demo period navigation
  const periodLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const periodDates = ['Dec 1 - Dec 7', 'Dec 8 - Dec 14', 'Dec 15 - Dec 21', 'Dec 22 - Dec 28'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 12 }}>
          <Text style={{ color: colors.white, fontSize: 24, fontWeight: 'bold' }}>Analytics</Text>
        </View>
        {/* Timeframe Tabs */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <TimeframeTabs value={timeframe} onChange={setTimeframe} />
        </View>
        {/* Stat Cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 20 }}>
          {STAT_CARDS.map((card, idx) => (
            <View key={card.key} style={{ width: '48%' }}>
              <StatCard {...card} />
            </View>
          ))}
        </View>
        {/* My Progress Section */}
        <View style={{ backgroundColor: colors.accent, borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>My Progress</Text>
            <View style={{ flexDirection: 'row', backgroundColor: colors.secondary + '88', borderRadius: 8, padding: 2 }}>
              {PROGRESS_TABS.map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, backgroundColor: progressTab === tab.key ? colors.primary : 'transparent' }}
                  onPress={() => setProgressTab(tab.key as any)}
                >
                  <Text style={{ color: progressTab === tab.key ? colors.white : colors.gray400, fontSize: 13, fontWeight: '600' }}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Period Navigation */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setPeriod(Math.max(0, period - 1))} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary + '55', alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome5 name="chevron-left" size={16} color={colors.gray400} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.white, fontSize: 15, fontWeight: '600' }}>{periodLabels[period]}</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>{periodDates[period]}</Text>
            </View>
            <TouchableOpacity onPress={() => setPeriod(Math.min(periodLabels.length - 1, period + 1))} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary + '55', alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome5 name="chevron-right" size={16} color={colors.gray400} />
            </TouchableOpacity>
          </View>
          {/* Progress Stats */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <View style={{ flex: 1, backgroundColor: colors.secondary + '33', borderRadius: 8, padding: 10, alignItems: 'center' }}>
              <Text style={{ color: colors.green, fontSize: 16, fontWeight: 'bold' }}>+2.5kg</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Muscle Gain</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.secondary + '33', borderRadius: 8, padding: 10, alignItems: 'center' }}>
              <Text style={{ color: colors.blue, fontSize: 16, fontWeight: 'bold' }}>85%</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Goal Progress</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.secondary + '33', borderRadius: 8, padding: 10, alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>12</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Workouts</Text>
            </View>
          </View>
          {/* Progress Graph */}
          <ProgressGraph data={PROGRESS_GRAPHS[progressTab].data} color={PROGRESS_GRAPHS[progressTab].color} label={PROGRESS_GRAPHS[progressTab].label} height={140} />
          {/* Progress Metrics */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1, backgroundColor: colors.secondary + '33', borderRadius: 8, padding: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ color: colors.gray400, fontSize: 12 }}>Current</Text>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary }} />
              </View>
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: 'bold' }}>78.5 kg</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Today</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.secondary + '33', borderRadius: 8, padding: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ color: colors.gray400, fontSize: 12 }}>Target</Text>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green }} />
              </View>
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: 'bold' }}>75.0 kg</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Goal</Text>
            </View>
          </View>
          {/* Progress Trend */}
          <View style={{ backgroundColor: colors.secondary + '33', borderRadius: 8, padding: 10, marginTop: 8, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>Progress Trend</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="arrow-trend-down" size={14} color={colors.green} style={{ marginRight: 4 }} />
                <Text style={{ color: colors.green, fontSize: 12 }}>Improving</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Weekly Change: -0.8kg</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>Monthly Change: -3.2kg</Text>
            </View>
          </View>
          {/* Progress Summary */}
          <View style={{ backgroundColor: colors.primary + '11', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: colors.primary + '33' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>Weekly Summary</Text>
                <Text style={{ color: colors.gray400, fontSize: 12 }}>Target vs Achievement</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.green, fontSize: 14, fontWeight: 'bold' }}>On Track</Text>
                <Text style={{ color: colors.gray400, fontSize: 12 }}>85% completed</Text>
              </View>
            </View>
            <View style={{ marginTop: 8, width: '100%', backgroundColor: colors.secondary + '55', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ backgroundColor: colors.primary, width: '85%', height: 8, borderRadius: 4 }} />
            </View>
          </View>
        </View>
        {/* Nutrition Analytics */}
        <View style={{ backgroundColor: colors.accent, borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Nutrition Analytics</Text>
          {NUTRITION_CARDS.map((card) => (
            <NutritionCard key={card.key} icon={card.icon} label={card.label} value={card.value} goal={card.goal} percent={card.percent} change={card.change} changeColor={card.changeColor} barColor={card.barColor} />
          ))}
        </View>
        {/* Recent Achievements */}
        <View style={{ backgroundColor: colors.accent, borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Recent Achievements</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {ACHIEVEMENTS.map((badge, idx) => (
              <View key={badge.key} style={{ width: '48%', marginBottom: 12 }}>
                <AchievementBadge {...badge} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 