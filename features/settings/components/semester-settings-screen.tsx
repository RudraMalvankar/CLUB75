import { ScrollView, View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";

export function SemesterSettingsScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Semester Name
          </Text>
          <Text variant="body" className="text-secondary">
            Fall 2026
          </Text>
        </View>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Start Date
          </Text>
          <Text variant="body" className="text-secondary">
            2026-08-15
          </Text>
        </View>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            End Date
          </Text>
          <Text variant="body" className="text-secondary">
            2026-12-20
          </Text>
        </View>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Current Week
          </Text>
          <Text variant="body" className="text-secondary">
            12
          </Text>
        </View>
        <View className="p-4">
          <Text variant="body" className="font-semibold">
            Working Days
          </Text>
          <Text variant="body" className="text-secondary">
            5
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
