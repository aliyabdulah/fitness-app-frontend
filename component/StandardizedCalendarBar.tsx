import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from './theme';

interface StandardizedCalendarBarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onWeekChange?: (startDate: Date, endDate: Date) => void;
  style?: any;
  headerStyle?: any;
  calendarStripStyle?: any;
}

const DAY_CIRCLE_SIZE = 48;
const DAY_CIRCLE_SIZE_SELECTED = 56;
const DAY_SPACING = 12;

function getWeekDays(selectedDate: Date) {
  // Start from Monday
  const start = moment(selectedDate).startOf('week').add(1, 'day');
  return Array.from({ length: 7 }, (_, i) => {
    const m = moment(start).add(i, 'days');
    return {
      date: m.toDate(),
      day: m.format('ddd'),
      dayNum: m.date(),
      isSelected: m.isSame(selectedDate, 'day'),
      isToday: m.isSame(new Date(), 'day'),
    };
  });
}

export function StandardizedCalendarBar({
  selectedDate,
  onDateSelect,
  onWeekChange,
  style,
  headerStyle,
  calendarStripStyle
}: StandardizedCalendarBarProps) {
  const [weekStart, setWeekStart] = useState(() => moment(selectedDate).startOf('week').add(1, 'day').toDate());

  const weekDays = getWeekDays(selectedDate);

  const handleChevron = useCallback((dir: 'prev' | 'next') => {
    const newStart = moment(weekStart).add(dir === 'prev' ? -7 : 7, 'days');
    setWeekStart(newStart.toDate());
    const newSelected = moment(newStart).toDate();
    onDateSelect(newSelected);
    onWeekChange?.(
      newStart.toDate(),
      moment(newStart).add(6, 'days').toDate()
    );
  }, [weekStart, onDateSelect, onWeekChange]);

  // When selectedDate changes, update weekStart if it's outside the current week
  React.useEffect(() => {
    const start = moment(selectedDate).startOf('week').add(1, 'day').toDate();
    if (!moment(weekStart).isSame(start, 'day')) {
      setWeekStart(start);
    }
  }, [selectedDate]);

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
          keyExtractor={d => d.day + d.dayNum}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: DAY_SPACING }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onDateSelect(item.date)}
              style={({ pressed }) => [
                styles.dayContainer,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select ${item.day} ${item.dayNum}`}
            >
              <View style={[ 
                styles.dayCircle,
                item.isSelected ? styles.dayCircleSelected : styles.dayCircleUnselected,
                item.isToday && !item.isSelected ? styles.dayCircleToday : null,
                { width: item.isSelected ? DAY_CIRCLE_SIZE_SELECTED : DAY_CIRCLE_SIZE, height: item.isSelected ? DAY_CIRCLE_SIZE_SELECTED : DAY_CIRCLE_SIZE }
              ]}>
                <Text style={[ 
                  styles.dayNum,
                  item.isSelected ? styles.dayNumSelected : styles.dayNumUnselected,
                  item.isToday && !item.isSelected ? styles.dayNumToday : null
                ]}>
                  {item.dayNum}
                </Text>
              </View>
              <Text style={[ 
                styles.dayLabel,
                item.isSelected ? styles.dayLabelSelected : styles.dayLabelUnselected,
                item.isToday && !item.isSelected ? styles.dayLabelToday : null
              ]}>
                {item.day}
              </Text>
            </Pressable>
          )}
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
    paddingHorizontal: 4,
  },
  dayContainer: {
    alignItems: 'center',
    width: DAY_CIRCLE_SIZE_SELECTED,
  },
  dayCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DAY_CIRCLE_SIZE_SELECTED / 2,
    marginBottom: 4,
  },
  dayCircleSelected: {
    backgroundColor: colors.accent,
  },
  dayCircleUnselected: {
    backgroundColor: '#232F3E',
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: colors.accent,
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
  dayNumToday: {
    color: colors.accent,
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
  dayLabelToday: {
    color: colors.accent,
    fontWeight: '700',
  },
}); 