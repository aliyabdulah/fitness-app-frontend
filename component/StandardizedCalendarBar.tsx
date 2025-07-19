import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions } from 'react-native';
import moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from './theme';
import { useDate } from '../context/DateContext'; // Add this import

interface StandardizedCalendarBarProps {
  onDateSelect: (date: Date) => void;
  onWeekChange?: (startDate: Date, endDate: Date) => void;
  style?: any;
  headerStyle?: any;
  calendarStripStyle?: any;
  workoutDates?: string[]; // Add this prop for workout dates
}

// Get screen width to calculate day container width
const screenWidth = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 48; // 24px padding on each side
const AVAILABLE_WIDTH = screenWidth - HORIZONTAL_PADDING;
const DAY_CONTAINER_WIDTH = AVAILABLE_WIDTH / 7; // Divide available width by 7 days
const DAY_CIRCLE_SIZE = Math.min(DAY_CONTAINER_WIDTH - 8, 48); // Ensure circle fits in container
const DAY_CIRCLE_SIZE_SELECTED = Math.min(DAY_CONTAINER_WIDTH - 8, 56); // Selected circle can be slightly larger
const DAY_SPACING = 0; // No gap since we're using full width

function getWeekDays(weekStart: Date, selectedDate: Date, workoutDates: string[] = []) {
  // Start from the provided week start (Monday)
  const start = moment(weekStart);
  
  console.log('🔍 Calendar Debug:');
  console.log('  Week start:', start.format('YYYY-MM-DD'));
  console.log('  Selected date:', moment(selectedDate).format('YYYY-MM-DD'));
  console.log('  Workout dates:', workoutDates);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const m = moment(start).add(i, 'days');
    const dateString = m.format('YYYY-MM-DD');
    const hasWorkout = workoutDates.includes(dateString);
    
    console.log(`  Day ${i + 1}: ${dateString} (${m.format('ddd')}) - Has workout: ${hasWorkout}`);
    
    return {
      date: m.toDate(),
      day: m.isSame(new Date(), 'day') ? 'Today' : m.format('ddd'),
      dayNum: m.date(),
      isSelected: m.isSame(selectedDate, 'day'),
      isToday: m.isSame(new Date(), 'day'),
      hasWorkout: hasWorkout,
    };
  });
  
  console.log('  Generated week days:', weekDays.map(d => `${d.dayNum} (${d.hasWorkout ? 'has workout' : 'no workout'})`));
  
  return weekDays;
}

export function StandardizedCalendarBar({
  onDateSelect,
  onWeekChange,
  style,
  headerStyle,
  calendarStripStyle,
  workoutDates = [] // Default to empty array
}: StandardizedCalendarBarProps) {
  const { selectedDate } = useDate(); // Get selected date from context

  // Use useMemo for weekStart - this will automatically update when selectedDate changes
  const weekStart = useMemo(() => {
    return moment(selectedDate).startOf('week').add(1, 'day').toDate();
  }, [selectedDate]);

  const weekDays = useMemo(() => {
    return getWeekDays(weekStart, selectedDate, workoutDates);
  }, [weekStart, selectedDate, workoutDates]);

  const handleChevron = useCallback((dir: 'prev' | 'next') => {
    // Calculate new week start based on current week start
    const newWeekStart = moment(weekStart).add(dir === 'prev' ? -7 : 7, 'days').toDate();
    
    // Select the same day of the week in the new week
    const dayOfWeek = moment(selectedDate).day();
    const newSelected = moment(newWeekStart).add(dayOfWeek === 0 ? 6 : dayOfWeek - 1, 'days').toDate();
    
    console.log(`🔄 Chevron ${dir}: ${moment(selectedDate).format('YYYY-MM-DD')} -> ${moment(newSelected).format('YYYY-MM-DD')}`);
    onDateSelect(newSelected);
    
    // Calculate new week range
    const newWeekEnd = moment(newWeekStart).add(6, 'days').toDate();
    onWeekChange?.(newWeekStart, newWeekEnd);
  }, [weekStart, selectedDate, onDateSelect, onWeekChange]);

  return (
    <View style={[styles.container, style]}> 
      <View style={[styles.headerRow, headerStyle]}>
        <Text style={styles.headerMonthText}>
          {moment(selectedDate).format('MMMM YYYY')}
        </Text>
        <View style={styles.chevronRow}>
          <Pressable onPress={() => handleChevron('prev')} style={styles.chevronBtn} accessibilityRole="button" accessibilityLabel="Previous week">
            <FontAwesome5 name="chevron-left" size={22} color={colors.gray400} />
          </Pressable>
          <Pressable onPress={() => handleChevron('next')} style={styles.chevronBtn} accessibilityRole="button" accessibilityLabel="Next week">
            <FontAwesome5 name="chevron-right" size={22} color={colors.gray400} />
          </Pressable>
        </View>
      </View>
      <View style={[styles.daysRow, calendarStripStyle]}> 
        <FlatList
          data={weekDays}
          keyExtractor={d => d.day + d.dayNum + d.date.getTime()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: '100%' }}
          renderItem={({ item }) => {
            console.log(`🎯 Rendering day ${item.dayNum}: selected=${item.isSelected}, hasWorkout=${item.hasWorkout}`);
            return (
              <Pressable
                onPress={() => onDateSelect(item.date)}
                style={({ pressed }) => [
                  styles.dayContainer,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select ${item.day} ${item.dayNum}${item.hasWorkout ? ' - Has workout' : ''}`}
              >
                <View style={[ 
                  styles.dayCircle,
                  item.isSelected ? styles.dayCircleSelected : styles.dayCircleUnselected,
                  { 
                    width: item.isSelected ? DAY_CIRCLE_SIZE_SELECTED : DAY_CIRCLE_SIZE, 
                    height: item.isSelected ? DAY_CIRCLE_SIZE_SELECTED : DAY_CIRCLE_SIZE 
                  }
                ]}>
                  <Text style={[ 
                    styles.dayNum,
                    item.isSelected ? styles.dayNumSelected : styles.dayNumUnselected,
                  ]}>
                    {item.dayNum}
                  </Text>
                  
                  {/* Workout indicator dot - show for all dates with workouts */}
                  {item.hasWorkout && (
                    <View style={styles.workoutDot} />
                  )}
                </View>
                <Text style={[ 
                  styles.dayLabel,
                  item.isSelected ? styles.dayLabelSelected : styles.dayLabelUnselected,
                ]}>
                  {item.day}
                </Text>
                {/* Subtle underline for today's date */}
                {item.isToday && (
                  <View style={styles.todayUnderline} />
                )}
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerMonthText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  chevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chevronBtn: {
    padding: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: DAY_CIRCLE_SIZE_SELECTED + 16,
    paddingHorizontal: 0, // Remove horizontal padding since we're using full width
  },
  dayContainer: {
    alignItems: 'center',
    width: DAY_CONTAINER_WIDTH, // Use calculated width
    position: 'relative', // For today's underline positioning
  },
  dayCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DAY_CIRCLE_SIZE_SELECTED / 2,
    marginBottom: 4,
    position: 'relative', // Add this for workout dot positioning
  },
  dayCircleSelected: {
    backgroundColor: colors.accent, // Keep orange for selected dates
  },
  dayCircleUnselected: {
    backgroundColor: '#232F3E',
  },
  dayNum: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  dayNumSelected: {
    color: colors.white,
  },
  dayNumUnselected: {
    color: colors.white,
    opacity: 0.9,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  dayLabelSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  dayLabelUnselected: {
    color: colors.white,
    opacity: 0.7,
  },
  // Updated workout indicator styles
  workoutDot: {
    position: 'absolute',
    bottom: 6, // Moved up slightly for better spacing
    width: 4, // Smaller dot
    height: 4, // Smaller dot
    borderRadius: 2, // Half of width/height
    backgroundColor: colors.primary, // Always orange
  },
  // New style for today's underline
  todayUnderline: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
    opacity: 0.6, // Subtle underline
  },
}); 