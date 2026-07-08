import { ScrollView, View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useSettings } from "../hooks/use-settings";
import { SettingsLoading } from "./settings-loading";

export function AttendanceGoalSettingsScreen() {
  const { theme } = useTheme();
  const { attendanceGoal, isLoading } = useSettings();
  const target = attendanceGoal.targetAttendance;
  const buffer = attendanceGoal.safeBuffer;

  if (isLoading) {
    return <SettingsLoading />;
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <Text variant="body" className="p-4 pb-2 font-semibold">
          Target Attendance: {target}%
        </Text>
        <View className="px-4 pb-4">
          <Text variant="body" className="mb-2 text-secondary">
            Minimum attendance goal you want to maintain
          </Text>
          <View className="flex-row gap-2">
            {[60, 65, 70, 75, 80, 85, 90].map((value) => (
              <View
                key={value}
                className="flex-1 items-center rounded-lg p-3"
                style={{
                  backgroundColor: target === value ? theme.colors.primary : theme.colors.surface,
                }}
              >
                <Text
                  variant="body"
                  style={{
                    color: target === value ? theme.colors.background : theme.colors.textPrimary,
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      <Card className="mt-4">
        <Text variant="body" className="p-4 pb-2 font-semibold">
          Safe Buffer: {buffer}%
        </Text>
        <View className="px-4 pb-4">
          <Text variant="body" className="mb-2 text-secondary">
            Extra buffer above minimum for safety
          </Text>
          <View className="flex-row gap-2">
            {[0, 2, 5, 8, 10].map((value) => (
              <View
                key={value}
                className="flex-1 items-center rounded-lg p-3"
                style={{
                  backgroundColor: buffer === value ? theme.colors.primary : theme.colors.surface,
                }}
              >
                <Text
                  variant="body"
                  style={{
                    color: buffer === value ? theme.colors.background : theme.colors.textPrimary,
                  }}
                >
                  {value}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
