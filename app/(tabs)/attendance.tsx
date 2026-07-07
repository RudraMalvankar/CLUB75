import { View, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";

export default function AttendanceScreen() {
  const { theme } = useTheme();

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="text-heading-m font-semibold text-foreground">Attendance</Text>
        <Text className="text-body text-foreground-muted" style={{ marginTop: theme.spacing.sm }}>
          Milestone: Phase 7 — Navigation Shell
        </Text>
      </View>
    </Screen>
  );
}
