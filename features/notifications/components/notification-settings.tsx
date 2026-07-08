import { View, Switch } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { REMINDER_LEAD_OPTIONS } from "../types";
import type { NotificationPreferences } from "../types";

type NotificationSettingsProps = {
  preferences: NotificationPreferences;
  onUpdatePreferences: (preferences: NotificationPreferences) => void;
};

export function NotificationSettings({
  preferences,
  onUpdatePreferences,
}: NotificationSettingsProps) {
  const { theme } = useTheme();

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    onUpdatePreferences({ ...preferences, [key]: value });
  };

  return (
    <View>
      <View
        className="flex-row items-center justify-between p-4 rounded-xl mb-2"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <View className="flex-1">
          <Text variant="body" className="font-semibold">
            Enable Notifications
          </Text>
          <Text variant="body" className="text-sm text-secondary">
            Master toggle for all notifications
          </Text>
        </View>
        <Switch
          value={preferences.enabled}
          onValueChange={(value) => handleToggle("enabled", value)}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        />
      </View>

      {preferences.enabled && (
        <>
          <Text
            variant="body"
            className="font-semibold mt-4 mb-2 px-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Reminders
          </Text>

          <SettingRow
            label="Lecture Reminders"
            description="Get notified before lectures"
            value={preferences.lectureReminders}
            onValueChange={(value) => handleToggle("lectureReminders", value)}
            theme={theme}
          />

          <SettingRow
            label="Attendance Reminders"
            description="Remind to mark attendance"
            value={preferences.attendanceReminders}
            onValueChange={(value) => handleToggle("attendanceReminders", value)}
            theme={theme}
          />

          <SettingRow
            label="Low Attendance Alerts"
            description="Warn when attendance drops"
            value={preferences.lowAttendanceAlerts}
            onValueChange={(value) => handleToggle("lowAttendanceAlerts", value)}
            theme={theme}
          />

          <Text
            variant="body"
            className="font-semibold mt-4 mb-2 px-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Summaries
          </Text>

          <SettingRow
            label="Daily Summary"
            description="End of day attendance recap"
            value={preferences.dailySummary}
            onValueChange={(value) => handleToggle("dailySummary", value)}
            theme={theme}
          />

          <SettingRow
            label="Weekly Summary"
            description="Weekly attendance report"
            value={preferences.weeklySummary}
            onValueChange={(value) => handleToggle("weeklySummary", value)}
            theme={theme}
          />

          <SettingRow
            label="Monthly Summary"
            description="Monthly attendance report"
            value={preferences.monthlySummary}
            onValueChange={(value) => handleToggle("monthlySummary", value)}
            theme={theme}
          />

          <Text
            variant="body"
            className="font-semibold mt-4 mb-2 px-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Smart Notifications
          </Text>

          <SettingRow
            label="Goal Reminders"
            description="Reminders about attendance goals"
            value={preferences.goalReminders}
            onValueChange={(value) => handleToggle("goalReminders", value)}
            theme={theme}
          />

          <SettingRow
            label="Safe Bunk Warnings"
            description="Know when you can safely skip"
            value={preferences.safeBunkWarnings}
            onValueChange={(value) => handleToggle("safeBunkWarnings", value)}
            theme={theme}
          />

          <SettingRow
            label="Semester Alerts"
            description="Important semester milestones"
            value={preferences.semesterAlerts}
            onValueChange={(value) => handleToggle("semesterAlerts", value)}
            theme={theme}
          />

          <SettingRow
            label="Achievements"
            description="Celebrate your progress"
            value={preferences.achievements}
            onValueChange={(value) => handleToggle("achievements", value)}
            theme={theme}
          />

          <Text
            variant="body"
            className="font-semibold mt-4 mb-2 px-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Quiet Hours
          </Text>

          <SettingRow
            label="Enable Quiet Hours"
            description="No notifications during quiet hours"
            value={preferences.quietHoursEnabled}
            onValueChange={(value) => handleToggle("quietHoursEnabled", value)}
            theme={theme}
          />

          <Text
            variant="body"
            className="font-semibold mt-4 mb-2 px-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Reminder Lead Time
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {REMINDER_LEAD_OPTIONS.map((option) => (
              <View
                key={option.value}
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor:
                    preferences.reminderLeadMinutes === option.value
                      ? theme.colors.primary
                      : theme.colors.surface,
                }}
              >
                <Text
                  variant="body"
                  className="text-sm"
                  style={{
                    color:
                      preferences.reminderLeadMinutes === option.value
                        ? theme.colors.background
                        : theme.colors.textPrimary,
                  }}
                >
                  {option.label}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function SettingRow({
  label,
  description,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: { colors: { surface: string; border: string; primary: string; textSecondary: string } };
}) {
  return (
    <View
      className="flex-row items-center justify-between p-4 rounded-xl mb-2"
      style={{ backgroundColor: theme.colors.surface }}
    >
      <View className="flex-1 mr-4">
        <Text variant="body" className="font-medium">
          {label}
        </Text>
        <Text variant="body" className="text-sm" style={{ color: theme.colors.textSecondary }}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      />
    </View>
  );
}
