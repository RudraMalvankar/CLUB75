import { View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { getCalendarService } from "../services/calendar-service";
import { CALENDAR_EVENT_COLORS } from "../types";
import type { CalendarEvent } from "../types";

type EventDetailProps = {
  event: CalendarEvent;
};

export function EventDetail({ event }: EventDetailProps) {
  const calendarService = getCalendarService();

  const dateObj = new Date(event.date);
  const dayName = calendarService.getDayName(dateObj.getDay());
  const monthName = calendarService.getMonthName(dateObj.getMonth());
  const dayNumber = dateObj.getDate();

  const statusColor =
    event.status === "present"
      ? CALENDAR_EVENT_COLORS.present
      : event.status === "absent"
        ? CALENDAR_EVENT_COLORS.absent
        : event.status === "cancelled"
          ? CALENDAR_EVENT_COLORS.cancelled
          : CALENDAR_EVENT_COLORS.lecture;

  return (
    <View>
      <View className="mb-4">
        <Text variant="bodyLarge" className="font-semibold">
          {event.title}
        </Text>
        {event.subjectName && (
          <Text variant="body" className="text-secondary">
            {event.subjectName}
          </Text>
        )}
      </View>

      <View className="space-y-3">
        <View className="flex-row items-center">
          <Text variant="body" className="w-24 text-secondary">
            Date
          </Text>
          <Text variant="body">
            {dayName}, {monthName} {dayNumber}
          </Text>
        </View>

        {event.startTime && (
          <View className="flex-row items-center">
            <Text variant="body" className="w-24 text-secondary">
              Time
            </Text>
            <Text variant="body">
              {event.startTime} - {event.endTime ?? "N/A"}
            </Text>
          </View>
        )}

        {event.room && (
          <View className="flex-row items-center">
            <Text variant="body" className="w-24 text-secondary">
              Room
            </Text>
            <Text variant="body">{event.room}</Text>
          </View>
        )}

        {event.faculty && (
          <View className="flex-row items-center">
            <Text variant="body" className="w-24 text-secondary">
              Faculty
            </Text>
            <Text variant="body">{event.faculty}</Text>
          </View>
        )}

        {event.lectureType && (
          <View className="flex-row items-center">
            <Text variant="body" className="w-24 text-secondary">
              Type
            </Text>
            <Text variant="body">{event.lectureType}</Text>
          </View>
        )}

        {event.status && (
          <View className="flex-row items-center">
            <Text variant="body" className="w-24 text-secondary">
              Status
            </Text>
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: statusColor }}
              />
              <Text variant="body" style={{ color: statusColor }}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Text>
            </View>
          </View>
        )}

        {event.notes && (
          <View className="mt-4">
            <Text variant="body" className="text-secondary mb-1">
              Notes
            </Text>
            <Text variant="body">{event.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
