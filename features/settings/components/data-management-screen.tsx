import { ScrollView, View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";

export function DataManagementScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Database Size
          </Text>
          <Text variant="body" className="text-secondary">
            2.4 MB
          </Text>
        </View>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Subjects
          </Text>
          <Text variant="body" className="text-secondary">
            8
          </Text>
        </View>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Attendance Records
          </Text>
          <Text variant="body" className="text-secondary">
            245
          </Text>
        </View>
        <View className="p-4">
          <Text variant="body" className="font-semibold">
            Timetable Entries
          </Text>
          <Text variant="body" className="text-secondary">
            12
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
