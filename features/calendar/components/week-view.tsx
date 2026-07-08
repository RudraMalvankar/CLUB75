import { useMemo } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { getCalendarService } from "../services/calendar-service";
import type { CalendarEvent, CalendarFilter } from "../types";

type WeekViewProps = {
  startDate: string;
  selectedDate: string | null;
  events: CalendarEvent[];
  onDateSelect: (date: string) => void;
  filter?: CalendarFilter;
};

export function WeekView({ startDate, selectedDate, events, onDateSelect, filter }: WeekViewProps) {
  const { theme } = useTheme();
  const calendarService = getCalendarService();

  const days = useMemo(() => {
    const today = calendarService.formatDate(new Date());
    const result: {
      date: string;
      dayName: string;
      dayNumber: number;
      isToday: boolean;
      isSelected: boolean;
      eventCount: number;
      hasPresent: boolean;
      hasAbsent: boolean;
    }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = calendarService.addDays(startDate, i);
      const dayEvents = events.filter((e) => e.date === date);
      const dateObj = new Date(date);
      result.push({
        date,
        dayName: calendarService.getDayName(dateObj.getDay()).slice(0, 3),
        dayNumber: dateObj.getDate(),
        isToday: date === today,
        isSelected: date === selectedDate,
        eventCount: dayEvents.length,
        hasPresent: dayEvents.some((e) => e.status === "present"),
        hasAbsent: dayEvents.some((e) => e.status === "absent"),
      });
    }

    return result;
  }, [startDate, events, selectedDate, calendarService]);

  return (
    <View>
      <View className="flex-row justify-around">
        {days.map((day) => (
          <Pressable
            key={day.date}
            onPress={() => onDateSelect(day.date)}
            className="items-center py-2"
            style={{
              width: `${100 / 7}%`,
              backgroundColor: day.isSelected
                ? theme.colors.primary
                : day.isToday
                  ? `${theme.colors.primary}20`
                  : "transparent",
              borderRadius: theme.radius.md,
            }}
          >
            <Text
              variant="body"
              className="text-xs"
              style={{
                color: day.isSelected ? theme.colors.background : theme.colors.textSecondary,
              }}
            >
              {day.dayName}
            </Text>
            <Text
              variant="body"
              className="text-lg font-semibold"
              style={{
                color: day.isSelected ? theme.colors.background : theme.colors.textPrimary,
              }}
            >
              {day.dayNumber}
            </Text>
            {day.eventCount > 0 && (
              <View className="flex-row gap-0.5 mt-1">
                {day.hasPresent && (
                  <View
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: theme.colors.success }}
                  />
                )}
                {day.hasAbsent && (
                  <View
                    className="w-1.5 h-1.5 rounded-full"
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
