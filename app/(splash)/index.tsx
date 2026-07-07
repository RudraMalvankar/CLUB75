import { View, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";

export default function SplashScreen() {
  const { theme } = useTheme();

  return (
    <SafeArea className="flex-1 items-center justify-center bg-background">
      <View className="items-center">
        <Text className="text-display-l font-bold text-foreground">Club75</Text>
        <Text className="text-body text-foreground-muted" style={{ marginTop: theme.spacing.md }}>
          Know before you bunk.
        </Text>
      </View>
    </SafeArea>
  );
}
