import { View, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";

export default function OnboardingScreen() {
  const { theme } = useTheme();

  return (
    <SafeArea className="flex-1 items-center justify-center bg-background">
      <View className="items-center" style={{ padding: theme.spacing["3xl"] }}>
        <Text className="text-heading-l font-semibold text-foreground">Welcome to Club75</Text>
        <Text
          className="text-body text-foreground-muted text-center"
          style={{ marginTop: theme.spacing.lg }}
        >
          Set up your semester and start tracking attendance.
        </Text>
      </View>
    </SafeArea>
  );
}
