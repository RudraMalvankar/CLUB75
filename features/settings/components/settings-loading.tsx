import { View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";

export function SettingsLoading() {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text variant="body">Loading settings...</Text>
    </View>
  );
}
