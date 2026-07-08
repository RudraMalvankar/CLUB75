import { View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { getCalendarService } from "../services/calendar-service";
import { CALENDAR_EVENT_COLORS } from "../types";
import type { CalendarEvent, AttendanceSummary } from "../types";

type DayViewProps = {
  date: string;
  events: CalendarEvent[];
  summary: AttendanceSummary | null;
};

export function DayView({ date, events, summary }: DayViewProps) {
  const { theme } = useTheme();
  const calendarService = getCalendarService();

  const dateObj = new Date(date);
  const dayName = calendarService.getDayName(dateObj.getDay());
  const monthName = calendarService.getMonthName(dateObj.getMonth());
  const dayNumber = dateObj.getDate();

  return (
    <View>
      <View className="mb-4">
        <Text variant="bodyLarge" className="font-semibold">
          {dayName}
        </Text>
        <Text variant="body" className="text-secondary">
          {monthName} {dayNumber}
        </Text>
      </View>

      {summary && (
        <View className="p-4 rounded-xl mb-4" style={{ backgroundColor: theme.colors.surface }}>
          <View className="flex-row justify-between mb-2">
            <Text variant="body" className="text-secondary">
              Attendance
            </Text>
            <Text variant="body" className="font-semibold">
              {summary.attendancePercentage}%
            </Text>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text variant="body" className="text-success font-semibold">
                {summary.present}
              </Text>
              <Text variant="body" className="text-xs text-secondary">
                Present
              </Text>
            </View>
            <View className="items-center">
              <Text variant="body" className="text-danger font-semibold">
                {summary.absent}
              </Text>
              <Text variant="body" className="text-xs text-secondary">
                Absent
              </Text>
            </View>
            <View className="items-center">
              <Text variant="body" className="text-warning font-semibold">
                {summary.cancelled}
              </Text>
              <Text variant="body" className="text-xs text-secondary">
                Cancelled
              </Text>
            </View>
            <View className="items-center">
              <Text
                variant="body"
                className="font-semibold"
                style={{ color: CALENDAR_EVENT_COLORS.medical }}
              >
                {summary.medical}
              </Text>
              <Text variant="body" className="text-xs text-secondary">
                Medical
              </Text>
            </View>
          </View>
        </View>
      )}

      {events.length === 0 ? (
        <View className="items-center py-8">
          <Text variant="body" className="text-secondary">
            No events scheduled
          </Text>
        </View>
      ) : (
        <View>
          {events.map((event) => (
            <View
              key={event.id}
              className="flex-row items-center p-3 mb-2 rounded-lg"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <View
                className="w-1 h-10 rounded-full mr-3"
                style={{
                  backgroundColor:
                    event.status === "present"
                      ? CALENDAR_EVENT_COLORS.present
                      : event.status === "absent"
                        ? CALENDAR_EVENT_COLORS.absent
                        : event.status === "cancelled"
                          ? CALENDAR_EVENT_COLORS.cancelled
                          : CALENDAR_EVENT_COLORS.lecture,
                }}
              />
              <View className="flex-1">
                <Text variant="body" className="font-medium">
                  {event.title}
                </Text>
                {event.faculty && (
                  <Text variant="body" className="text-xs text-secondary">
                    {event.faculty}
                  </Text>
                )}
              </View>
              <Text
                variant="body"
                className="text-xs font-medium"
                style={{
                  color:
                    event.status === "present"
                      ? CALENDAR_EVENT_COLORS.present
                      : event.status === "absent"
                        ? CALENDAR_EVENT_COLORS.absent
                        : theme.colors.textSecondary,
                }}
              >
                {event.status?.charAt(0).toUpperCase()}
                {event.status?.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
