import { ScrollView, View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";

export function AboutScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <View className="items-center border-b p-6" style={{ borderColor: theme.colors.border }}>
          <Text variant="bodyLarge">📱</Text>
          <Text variant="body" className="mt-2 font-bold">
            Club75
          </Text>
          <Text variant="body" className="text-secondary">
            Version 1.0.0
          </Text>
        </View>
        <View className="border-b p-4" style={{ borderColor: theme.colors.border }}>
          <Text variant="body" className="font-semibold">
            Developer
          </Text>
          <Text variant="body" className="text-secondary">
            Club75 Team
          </Text>
        </View>
        <View className="p-4">
          <Text variant="body" className="font-semibold">
            GitHub
          </Text>
          <Text variant="body" className="text-secondary">
            github.com/club75/app
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
