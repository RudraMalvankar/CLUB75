import { View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { getCalendarService } from "../services/calendar-service";
import { CALENDAR_EVENT_COLORS } from "../types";
import type { AgendaItem } from "../types";

type AgendaProps = {
  items: AgendaItem[];
  onEventPress?: (eventId: string) => void;
};

export function Agenda({ items, onEventPress }: AgendaProps) {
  const { theme } = useTheme();
  const calendarService = getCalendarService();

  if (items.length === 0) {
    return (
      <View className="items-center py-8">
        <Text variant="body" className="text-secondary">
          No upcoming events
        </Text>
      </View>
    );
  }

  return (
    <View>
      {items.map((item) => {
        const dateObj = new Date(item.date);
        const dayName = calendarService.getDayName(dateObj.getDay());
        const monthName = calendarService.getMonthName(dateObj.getMonth());
        const dayNumber = dateObj.getDate();
        const isToday = calendarService.isToday(item.date);

        return (
          <View key={item.date} className="mb-4">
            <View className="flex-row items-center mb-2">
              <Text
                variant="body"
                className="font-semibold"
                style={{
                  color: isToday ? theme.colors.primary : theme.colors.textPrimary,
                }}
              >
                {isToday ? "Today" : dayName}
              </Text>
              <Text variant="body" className="text-secondary ml-2">
                {monthName} {dayNumber}
              </Text>
            </View>

            {item.events.length === 0 ? (
              <View className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <Text variant="body" className="text-secondary text-sm">
                  No events
                </Text>
              </View>
            ) : (
              <View>
                {item.events.map((event) => (
                  <View
                    key={event.id}
                    className="flex-row items-center p-3 mb-1 rounded-lg"
                    style={{ backgroundColor: theme.colors.surface }}
                  >
                    <View
                      className="w-1 h-8 rounded-full mr-3"
                      style={{
                        backgroundColor:
                          event.status === "present"
                            ? CALENDAR_EVENT_COLORS.present
                            : event.status === "absent"
                              ? CALENDAR_EVENT_COLORS.absent
                              : CALENDAR_EVENT_COLORS.lecture,
                      }}
                    />
                    <View className="flex-1">
                      <Text variant="body" className="font-medium text-sm">
                        {event.title}
                      </Text>
                      {event.startTime && (
                        <Text variant="body" className="text-xs text-secondary">
                          {event.startTime}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
