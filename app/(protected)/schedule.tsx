import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { StandardizedCalendarBar } from '../../component/StandardizedCalendarBar';
import { colors } from '../../component/theme';

// Types
interface ScheduleItemBase {
  id: string;
  type: 'workout' | 'pt' | 'diet' | 'recovery';
  time: string;
  status: 'completed' | 'planned' | 'upcoming';
}

interface WorkoutItem extends ScheduleItemBase {
  type: 'workout';
  title: string;
  coach?: string;
  exercises?: number;
  details?: string;
}

interface PTSessionItem extends ScheduleItemBase {
  type: 'pt';
  coach: string;
  coachAvatar: string;
  details?: string;
}

interface DietPlanItem extends ScheduleItemBase {
  type: 'diet';
  meals: Array<{
    name: string;
    time: string;
    status: 'completed' | 'upcoming' | 'planned';
    color: string;
    icon: keyof typeof FontAwesome5.glyphMap;
  }>;
}

interface RecoveryItem extends ScheduleItemBase {
  type: 'recovery';
  details: string;
}

type ScheduleItem = WorkoutItem | PTSessionItem | DietPlanItem | RecoveryItem;

interface WeekProgress {
  workouts: { completed: number; total: number };
  ptSessions: { completed: number; total: number };
  dietAdherence: number; // percent
}

// Mock Data

const mockSchedule: Record<number, ScheduleItem[]> = {
  22: [
    {
      id: 'w1',
      type: 'workout',
      title: 'Morning Cardio',
      coach: 'Coach Mike',
      time: '7:00 AM - 8:00 AM',
      status: 'completed',
      exercises: 5,
      details: 'Assigned by Coach Mike',
    },
    {
      id: 'pt1',
      type: 'pt',
      coach: 'Coach Sarah',
      coachAvatar:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      time: '2:00 PM - 3:00 PM',
      status: 'upcoming',
      details: '',
    },
    {
      id: 'diet1',
      type: 'diet',
      time: '',
      status: 'planned',
      meals: [
        {
          name: 'Breakfast - Protein Bowl',
          time: '8:00 AM',
          status: 'completed',
          color: colors.green,
          icon: 'utensils',
        },
        {
          name: 'Lunch - Grilled Chicken',
          time: '1:00 PM',
          status: 'upcoming',
          color: colors.orange,
          icon: 'utensils',
        },
        {
          name: 'Dinner - Salmon & Veggies',
          time: '7:00 PM',
          status: 'planned',
          color: colors.gray400,
          icon: 'utensils',
        },
      ],
    },
    {
      id: 'rec1',
      type: 'recovery',
      time: 'All Day',
      status: 'planned',
      details: 'Active rest & stretching',
    },
  ],
};

const mockTodayWorkout = {
  title: "Upper Body Strength",
  status: "planned" as const,
  time: "6:00 PM - 7:30 PM",
  exercises: 8,
};

const mockProgress: WeekProgress = {
  workouts: { completed: 5, total: 7 },
  ptSessions: { completed: 2, total: 3 },
  dietAdherence: 85,
};

const { width } = Dimensions.get('window');

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 22)); // Default to December 22, 2024
  const [addModalVisible, setAddModalVisible] = useState(false);

  // TODO: Replace with API data
  const schedule = mockSchedule[selectedDate.getDate()] || [];

  // TODO: Replace with API data
  const todayWorkout = mockTodayWorkout;
  const progress = mockProgress;

  // Handlers
  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    // TODO: Fetch schedule for selected date
  }

  function handleWeekChange(startDate: Date, endDate: Date) {
    // TODO: Handle week change, maybe fetch data for the new week
    console.log('Week changed:', startDate, endDate);
  }

  function handleStartWorkout() {
    // TODO: Start workout logic
  }

  function handleChat(ptItem: PTSessionItem) {
    // TODO: Navigate to chat with coach
  }

  function handleAdd() {
    setAddModalVisible(true);
  }

  function handleCloseAddModal() {
    setAddModalVisible(false);
  }

  // Subcomponents

  function TodaysWorkoutCard() {
    return (
      <View style={styles.todaysWorkoutCard}>
        <View style={styles.todaysWorkoutHeader}>
          <View>
            <Text style={styles.todaysWorkoutTitle}>Today's Workout</Text>
            <Text style={styles.todaysWorkoutSubtitle}>{todayWorkout.title}</Text>
          </View>
          <View style={styles.todaysWorkoutStatusRow}>
            <Text style={styles.todaysWorkoutStatus}>Planned</Text>
            <TouchableOpacity>
              <FontAwesome5 name="edit" size={18} color={colors.gray400} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.todaysWorkoutDetailsRow}>
          <View style={styles.todaysWorkoutDetailItem}>
            <FontAwesome5 name="clock" size={14} color={colors.gray400} style={{ marginRight: 4 }} />
            <Text style={styles.todaysWorkoutDetailText}>{todayWorkout.time}</Text>
          </View>
          <View style={styles.todaysWorkoutDetailItem}>
            <FontAwesome5 name="dumbbell" size={14} color={colors.gray400} style={{ marginRight: 4 }} />
            <Text style={styles.todaysWorkoutDetailText}>{todayWorkout.exercises} exercises</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.startWorkoutBtn}
          onPress={handleStartWorkout}
          disabled={!todayWorkout}
          accessibilityRole="button"
        >
          <Text style={styles.startWorkoutBtnText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function ScheduleList() {
    return (
      <View style={styles.scheduleListContainer}>
        <Text style={styles.scheduleListTitle}>Today's Schedule</Text>
        {schedule.map((item) => {
          if (item.type === 'workout') {
            const w = item as WorkoutItem;
            return (
              <View key={w.id} style={styles.scheduleCard}>
                <View style={styles.scheduleCardHeader}>
                  <View style={scheduleCardIconCircle(colors.blue)}>
                    <FontAwesome5 name="dumbbell" size={20} color={colors.blue} />
                  </View>
                  <View>
                    <Text style={styles.scheduleCardTitle}>{w.title}</Text>
                    <Text style={styles.scheduleCardSubtitle}>Assigned by {w.coach}</Text>
                  </View>
                  <View style={styles.scheduleCardStatusRow}>
                    <Text style={styles.scheduleCardStatusCompleted}>Completed</Text>
                    <FontAwesome5 name="check-circle" size={16} color={colors.green} />
                  </View>
                </View>
                <View style={styles.scheduleCardTimeRow}>
                  <FontAwesome5 name="clock" size={14} color={colors.gray400} style={{ marginRight: 4 }} />
                  <Text style={styles.scheduleCardTime}>{w.time}</Text>
                </View>
              </View>
            );
          }
          if (item.type === 'pt') {
            const pt = item as PTSessionItem;
            return (
              <View key={pt.id} style={styles.scheduleCardPT}>
                <View style={styles.scheduleCardPTHeader}>
                  <View style={styles.scheduleCardPTAvatarWrap}>
                    <Image
                      source={{ uri: pt.coachAvatar }}
                      style={styles.scheduleCardPTAvatar}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.scheduleCardPTTitle}>PT Session</Text>
                  <View style={styles.scheduleCardPTStatusRow}>
                    <Text style={styles.scheduleCardPTStatusUpcoming}>Upcoming</Text>
                    <TouchableOpacity>
                      <FontAwesome5 name="edit" size={18} color={colors.gray400} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.scheduleCardPTFooter}>
                  <View style={styles.scheduleCardTimeRow}>
                    <FontAwesome5 name="clock" size={14} color={colors.gray400} style={{ marginRight: 4 }} />
                    <Text style={styles.scheduleCardTime}>{pt.time}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => handleChat(pt)}
                    accessibilityRole="button"
                  >
                    <FontAwesome5 name="comment" size={16} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.chatBtnText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
          if (item.type === 'diet') {
            const d = item as DietPlanItem;
            return (
              <View key={d.id} style={styles.scheduleCard}>
                <View style={styles.scheduleCardHeader}>
                  <View style={scheduleCardIconCircle(colors.green)}>
                    <FontAwesome5 name="utensils" size={20} color={colors.green} />
                  </View>
                  <View>
                    <Text style={styles.scheduleCardTitle}>Diet Plan</Text>
                    <Text style={styles.scheduleCardSubtitle}>Meal Schedule</Text>
                  </View>
                  <TouchableOpacity>
                    <FontAwesome5 name="edit" size={18} color={colors.gray400} />
                  </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 52 }}>
                  {d.meals.map((meal, idx) => (
                    <View key={idx} style={styles.dietMealRow}>
                      <View style={styles.dietMealLeft}>
                        <View style={[styles.dietMealDot, { backgroundColor: meal.color }]} />
                        <Text style={styles.dietMealName}>{meal.name}</Text>
                      </View>
                      <View style={styles.dietMealRight}>
                        <Text style={styles.dietMealTime}>{meal.time}</Text>
                        {meal.status === 'completed' ? (
                          <FontAwesome5 name="check-circle" size={16} color={colors.green} />
                        ) : meal.status === 'upcoming' ? (
                          <FontAwesome5 name="clock" size={16} color={colors.orange} />
                        ) : (
                          <FontAwesome5 name="clock" size={16} color={colors.gray400} />
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
          if (item.type === 'recovery') {
            const r = item as RecoveryItem;
            return (
              <View key={r.id} style={styles.scheduleCard}>
                <View style={styles.scheduleCardHeader}>
                  <View style={scheduleCardIconCircle(colors.yellow)}>
                    <FontAwesome5 name="bed" size={20} color={colors.yellow} />
                  </View>
                  <View>
                    <Text style={styles.scheduleCardTitle}>Recovery Day</Text>
                    <Text style={styles.scheduleCardSubtitle}>{r.details}</Text>
                  </View>
                  <Text style={styles.scheduleCardRecoveryStatus}>Planned</Text>
                </View>
                <View style={styles.scheduleCardTimeRow}>
                  <FontAwesome5 name="clock" size={14} color={colors.gray400} style={{ marginRight: 4 }} />
                  <Text style={styles.scheduleCardTime}>{r.time}</Text>
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  }

  function WeekSummary() {
    return (
      <View style={styles.weekSummaryCard}>
        <Text style={styles.weekSummaryTitle}>This Week's Progress</Text>
        <View style={styles.weekSummaryRow}>
          <View style={styles.weekSummaryCol}>
            <Text style={styles.weekSummaryValuePrimary}>{progress.workouts.completed}/{progress.workouts.total}</Text>
            <Text style={styles.weekSummaryLabel}>Workouts</Text>
          </View>
          <View style={styles.weekSummaryCol}>
            <Text style={styles.weekSummaryValueGreen}>{progress.ptSessions.completed}/{progress.ptSessions.total}</Text>
            <Text style={styles.weekSummaryLabel}>PT Sessions</Text>
          </View>
          <View style={styles.weekSummaryCol}>
            <Text style={styles.weekSummaryValueBlue}>{progress.dietAdherence}%</Text>
            <Text style={styles.weekSummaryLabel}>Diet Plan</Text>
          </View>
        </View>
      </View>
    );
  }

  function AddModal() {
    return (
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseAddModal}
      >
        <View style={styles.addModalOverlay}>
          <View style={styles.addModalCard}>
            <View style={styles.addModalHeader}>
              <Text style={styles.addModalTitle}>Add to Schedule</Text>
              <TouchableOpacity onPress={handleCloseAddModal}>
                <FontAwesome5 name="times" size={20} color={colors.gray400} />
              </TouchableOpacity>
            </View>
            <View style={styles.addModalBtnGroup}>
              <TouchableOpacity style={styles.addModalBtn}>
                <FontAwesome5 name="dumbbell" size={18} color={colors.blue} style={{ marginRight: 8 }} />
                <Text style={styles.addModalBtnTextBlue}>Add Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addModalBtn}>
                <FontAwesome5 name="user-tie" size={18} color={colors.purple} style={{ marginRight: 8 }} />
                <Text style={styles.addModalBtnTextPurple}>Schedule PT Session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addModalBtn}>
                <FontAwesome5 name="utensils" size={18} color={colors.green} style={{ marginRight: 8 }} />
                <Text style={styles.addModalBtnTextGreen}>Add Meal Plan</Text>
              </TouchableOpacity>
            </View>
            {/* TODO: Implement add item logic */}
          </View>
        </View>
      </Modal>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Schedule</Text>
          <TouchableOpacity style={styles.headerAddBtn} onPress={handleAdd}>
            <FontAwesome5 name="plus" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        {/* Calendar Bar */}
        <View style={{ paddingHorizontal: 20 }}>
          <StandardizedCalendarBar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onWeekChange={handleWeekChange}
          />
        </View>
        {/* Today's Workout */}
        <TodaysWorkoutCard />
        {/* Schedule List */}
        <ScheduleList />
        {/* Week Summary */}
        <WeekSummary />
      </ScrollView>
      {/* Add Modal */}
      <AddModal />
    </SafeAreaView>
  );
}

// TODO: Move colors to theme/colors.ts if not already present
// TODO: Replace mock data with API integration
// TODO: Wire up navigation and chat logic
// TODO: Implement add/edit/cancel schedule item logic
// TODO: Add accessibility props and test on devices

function scheduleCardIconCircle(bg: string): import('react-native').ViewStyle {
  return {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: bg + '33',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  todaysWorkoutCard: {
    backgroundColor: colors.primary + '33', // 20% opacity
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '55', // 33% opacity
  },
  todaysWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  todaysWorkoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  todaysWorkoutSubtitle: {
    fontSize: 14,
    color: colors.gray400,
    marginTop: 2,
  },
  todaysWorkoutStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todaysWorkoutStatus: {
    fontSize: 12,
    backgroundColor: colors.primary + '33',
    color: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  todaysWorkoutDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 12,
  },
  todaysWorkoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  todaysWorkoutDetailText: {
    fontSize: 13,
    color: colors.gray400,
  },
  startWorkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  startWorkoutBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  scheduleListContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  scheduleListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  scheduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  scheduleCardSubtitle: {
    fontSize: 13,
    color: colors.gray400,
  },
  scheduleCardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 4,
  },
  scheduleCardStatusCompleted: {
    fontSize: 12,
    backgroundColor: colors.green + '33',
    color: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  scheduleCardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 52,
    marginTop: 2,
  },
  scheduleCardTime: {
    fontSize: 13,
    color: colors.gray400,
  },
  // PT Session
  scheduleCardPT: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  scheduleCardPTHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleCardPTAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 16,
  },
  scheduleCardPTAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  scheduleCardPTTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.white,
    flex: 1,
  },
  scheduleCardPTStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleCardPTStatusUpcoming: {
    fontSize: 12,
    backgroundColor: colors.orange + '33',
    color: colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  scheduleCardPTFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 72,
  },
  chatBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  // Diet Plan
  dietMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dietMealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietMealDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dietMealName: {
    fontSize: 14,
    color: colors.white,
  },
  dietMealRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dietMealTime: {
    fontSize: 12,
    color: colors.gray400,
    marginRight: 4,
  },
  // Recovery
  scheduleCardRecoveryStatus: {
    fontSize: 12,
    backgroundColor: colors.yellow + '33',
    color: colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  // Week Summary
  weekSummaryCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  weekSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 12,
  },
  weekSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  weekSummaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  weekSummaryValuePrimary: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  weekSummaryValueGreen: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.green,
  },
  weekSummaryValueBlue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.blue,
  },
  weekSummaryLabel: {
    fontSize: 12,
    color: colors.gray400,
    marginTop: 2,
  },
  // Add Modal
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addModalCard: {
    backgroundColor: colors.accent,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxWidth: 420,
    padding: 24,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  addModalBtnGroup: {
    gap: 12,
  },
  addModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '08',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  addModalBtnTextBlue: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: 16,
  },
  addModalBtnTextPurple: {
    color: colors.purple,
    fontWeight: '600',
    fontSize: 16,
  },
  addModalBtnTextGreen: {
    color: colors.green,
    fontWeight: '600',
    fontSize: 16,
  },
}); 