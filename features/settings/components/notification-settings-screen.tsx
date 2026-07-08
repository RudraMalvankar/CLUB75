import { Pressable, ScrollView, View, Switch } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useSettings } from "../hooks/use-settings";
import { REMINDER_OPTIONS } from "../types";
import { SettingsLoading } from "./settings-loading";

export function NotificationSettingsScreen() {
  const { theme } = useTheme();
  const { notifications, updateNotifications, isLoading } = useSettings();

  if (isLoading) {
    return <SettingsLoading />;
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <View
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderColor: theme.colors.border }}
        >
          <Text variant="body">Enable Notifications</Text>
          <Switch
            value={notifications.enabled}
            onValueChange={(value) => updateNotifications({ ...notifications, enabled: value })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
        <View
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderColor: theme.colors.border }}
        >
          <Text variant="body">Attendance Reminders</Text>
          <Switch
            value={notifications.attendanceReminders}
            onValueChange={(value) =>
              updateNotifications({ ...notifications, attendanceReminders: value })
            }
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
        <View
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderColor: theme.colors.border }}
        >
          <Text variant="body">Low Attendance Alerts</Text>
          <Switch
            value={notifications.lowAttendanceAlerts}
            onValueChange={(value) =>
              updateNotifications({ ...notifications, lowAttendanceAlerts: value })
            }
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
        <View className="flex-row items-center justify-between p-4">
          <Text variant="body">Daily Summary</Text>
          <Switch
            value={notifications.dailySummary}
            onValueChange={(value) =>
              updateNotifications({ ...notifications, dailySummary: value })
            }
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </Card>

      <Card className="mt-4">
        <Text variant="body" className="p-4 pb-2 font-semibold">
          Reminder Lead Time
        </Text>
        {REMINDER_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() =>
              updateNotifications({ ...notifications, reminderLeadMinutes: option.value })
            }
            className="flex-row items-center justify-between border-b p-4 active:opacity-70"
            style={{ borderColor: theme.colors.border }}
          >
            <Text variant="body">{option.label}</Text>
            {notifications.reminderLeadMinutes === option.value && <Text variant="body">✓</Text>}
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}
