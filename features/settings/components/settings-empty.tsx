import { View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";

export function SettingsEmpty() {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center p-6"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text variant="bodyLarge">⚙️</Text>
      <Text variant="body" className="mt-4 text-center">
        No settings available
      </Text>
    </View>
  );
}
