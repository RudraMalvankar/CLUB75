import { useMemo } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { getCalendarService } from "../services/calendar-service";
import type { CalendarEvent, CalendarFilter } from "../types";

type MonthViewProps = {
  year: number;
  month: number;
  selectedDate: string | null;
  events: CalendarEvent[];
  onDateSelect: (date: string) => void;
  filter?: CalendarFilter;
};

export function MonthView({
  year,
  month,
  selectedDate,
  events,
  onDateSelect,
  filter,
}: MonthViewProps) {
  const { theme } = useTheme();
  const calendarService = getCalendarService();

  const days = useMemo(() => {
    const firstDay = calendarService.getFirstDayOfMonth(year, month);
    const daysInMonth = calendarService.getDaysInMonth(year, month);
    const daysInPrevMonth = calendarService.getDaysInMonth(year, month - 1);
    const today = calendarService.formatDate(new Date());

    const result: {
      date: string;
      day: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      eventCount: number;
      hasPresent: boolean;
      hasAbsent: boolean;
    }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const fullDate = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date === fullDate);
      result.push({
        date: fullDate,
        day,
        isCurrentMonth: false,
        isToday: fullDate === today,
        isSelected: fullDate === selectedDate,
        eventCount: dayEvents.length,
        hasPresent: dayEvents.some((e) => e.status === "present"),
        hasAbsent: dayEvents.some((e) => e.status === "absent"),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date === date);
      result.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: date === today,
        isSelected: date === selectedDate,
        eventCount: dayEvents.length,
        hasPresent: dayEvents.some((e) => e.status === "present"),
        hasAbsent: dayEvents.some((e) => e.status === "absent"),
      });
    }

    const remainingDays = 42 - result.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const date = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date === date);
      result.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: date === selectedDate,
        eventCount: dayEvents.length,
        hasPresent: dayEvents.some((e) => e.status === "present"),
        hasAbsent: dayEvents.some((e) => e.status === "absent"),
      });
    }

    return result;
  }, [year, month, events, selectedDate, calendarService]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View>
      <View className="flex-row justify-around mb-2">
        {weekDays.map((day) => (
          <Text key={day} variant="body" className="text-center w-[13%] text-secondary">
            {day}
          </Text>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {days.map((day, index) => (
          <Pressable
            key={`${day.date}-${index}`}
            onPress={() => onDateSelect(day.date)}
            className="w-[13%] aspect-square items-center justify-center"
            style={{
              backgroundColor: day.isSelected
                ? theme.colors.primary
                : day.isToday
                  ? `${theme.colors.primary}20`
                  : "transparent",
              borderRadius: theme.radius.sm,
            }}
          >
            <Text
              variant="body"
              style={{
                color: day.isSelected
                  ? theme.colors.background
                  : day.isCurrentMonth
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary,
              }}
            >
              {day.day}
            </Text>
            {day.eventCount > 0 && (
              <View className="flex-row gap-0.5 mt-0.5">
                {day.hasPresent && (
                  <View
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: theme.colors.success }}
                  />
                )}
                {day.hasAbsent && (
                  <View
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: theme.colors.danger }}
                  />
                )}
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
